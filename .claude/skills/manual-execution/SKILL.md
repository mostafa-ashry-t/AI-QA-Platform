---
name: manual-execution
description: Manual Execution stage of the AI QA Platform. Executes ONLY the approved test cases from the task's TestCases.md against the live application through the Playwright MCP server (browser access only, not automation). Follows each step exactly as written, records the verbatim expected result against the observed actual result, and assigns exactly one of PASS / FAIL / BLOCKED. Analyzes every failure's cause, and raises one evidenced bug report per distinct application defect, with severity and priority assessed independently. Writes platform/tasks/<task-name>/execution/ExecutionReport.md, plus bugs/BugReports.md only when supported defects exist. Then HARD STOPS until the exact standalone key MANUAL_EXECUTION_APPROVED. Never invents or repairs test cases, never fixes failures, never generates automation. Use when asked to "execute the test cases", "run the approved cases", "log the results", "report this defect", or "revise the execution report".
---

# Manual Execution

## Stage Identity

| Field | Value |
|---|---|
| Skill | `manual-execution` |
| Skill version | `1.1.0` |
| stage_id | `manual-execution` (ordering is owned by the workflow, not this skill) |
| Prompt | [`.claude/prompts/manual-execution.md`](../../prompts/manual-execution.md). `prompt_id: manual-execution`, `prompt_version: 1.1.0` |
| Output structures | [`ExecutionReport.template.md`](ExecutionReport.template.md), [`BugReports.template.md`](BugReports.template.md) |
| Journal event template | [`journal-event.template.json`](journal-event.template.json) |
| Journal schemas | [`journal-event.schema.json`](../../../platform/schemas/journal-event.schema.json) (v1.4.0), [`prompt-record.schema.json`](../../../platform/schemas/prompt-record.schema.json), [`workflow-run.schema.json`](../../../platform/schemas/workflow-run.schema.json) |
| Upstream | `test-review` (`TEST_REVIEW_APPROVED`, mandatory, ADR-001), which rests on `test-design`, `exploration`, `project-context` and `prd-generation` approvals |
| Downstream | `automation-generation` (only after approval) |
| Approval key | `MANUAL_EXECUTION_APPROVED` |
| MCP | **Required:** `playwright` (see [`.mcp.json`](../../../.mcp.json)), for browser access only |

```
APPROVED TestCases.md + APPROVED TestReview.md (bound to that TestCases.md hash)
        ↓
LIVE APPLICATION (Playwright MCP)
        ↓
EXECUTE EXACT STEPS → EXPECTED vs ACTUAL → PASS / FAIL / BLOCKED
        ↓
FAILURE ANALYSIS → BUG REPORTS FOR DISTINCT DEFECTS
        ↓
ExecutionReport.md (+ BugReports.md) + execution/evidence/
        ↓
⛔ HARD STOP → HUMAN REVIEW → MANUAL_EXECUTION_APPROVED → Automation Generation
```

## Purpose

Run the approved test cases against the live application. Record what
**actually** happened with enough fidelity that any result can be trusted and any
failure can be reproduced by a developer without follow-up questions.

## Separation of concerns

| Concept | For this stage |
|---|---|
| **Skill** (this file) | *How* cases are executed, judged, analyzed, reported, gated, revised and journaled. |
| **Prompt** (`.claude/prompts/manual-execution.md`) | The versioned *instruction*. Recorded by id and version, with the verbatim text in `prompts.json`. |
| **Workflow** | *When* the stage runs. It requires a current `TEST_REVIEW_APPROVED` (ADR-001), and `MANUAL_EXECUTION_APPROVED` unlocks `automation-generation`. |
| **Journal** | *What actually happened*: every execution and MCP action, result, evidence item, bug and gate reply. |
| **Artifacts** | `execution/ExecutionReport.md`, `execution/evidence/`, and `bugs/BugReports.md` (conditional). |
| **TestCases.md** | The **execution contract**. It is read only and never modified here. |
| **Playwright MCP** | The browser-access **tool**. It is **not** the automation framework. |

## Trigger Conditions

Run when a human, or the orchestration layer, asks to execute, or revise the
execution of, a **named task**. The request may narrow the selection to specific
approved case IDs. If no task is named, ask. Never guess a task.

## Prerequisites

Check all of these, in order, **before any Playwright MCP call**:

| # | Prerequisite | Failure |
|---|---|---|
| 1 | `platform/tasks/<task-name>/` exists and is not under `platform/templates/` | `ME-E01` / `ME-E02` |
| 2 | `context/TaskContext.md` exists | `ME-E03` |
| 3 | `prd/PRD.md` exists, and its `PRD_APPROVED` is current | `ME-E04` |
| 4 | `context/ProjectContext.md` exists | `ME-E05` |
| 5 | The ProjectContext approval (`PROJECT_CONTEXT_APPROVED`) is valid and current: the post-approval hash equals the current file hash, with no later `project-context` run | `ME-E06` |
| 6 | `exploration/ExplorationReport.md` exists | `ME-E07` |
| 7 | The Exploration approval (`EXPLORATION_APPROVED`) is valid and current | `ME-E08` |
| 8 | `test-design/TestCases.md` exists and is **not** the template placeholder | `ME-E09` |
| 9 | The Test Design approval (`TEST_DESIGN_APPROVED`) exists in the active run | `ME-E10` |
| 10 | The Test Design approval is current: the post-approval hash equals the current TestCases.md, with no later `test-design` run. **And** the `test-design` execution that produced the approved version recorded ProjectContext and ExplorationReport hashes equal to the current approved ones | `ME-E11` / `ME-E12` |
| 11 | `journal/workflow-run.json` → `active_run_id` is non-null. It is owned by orchestration, and this skill never creates it | `ME-E13` |
| 12 | The target application URL and environment can be determined (TaskContext § Project Entry Points / PRD source register) | `ME-E14` |
| 13 | The test data requirements can be determined: TestCases §10 lists the `DATA-###` needed by the selected cases, each with a declared source | `ME-E15` |
| 14 | Every case ID the human explicitly requested exists as an Active case in the approved TestCases.md | `ME-E16` |
| 15 | **Test Review approved (ADR-001):** `test-review/TestReview.md` exists, and a `test-review` `approval_decision` with `approval_outcome: accepted` (`TEST_REVIEW_APPROVED`) exists in the active run. This holds even when TestCases.md is already approved: the review can never be bypassed | `ME-E23` |
| 16 | **Test Review approval current and bound to the current TestCases.md:** the TestReview.md post-approval hash equals the current file, no later `test-review` run exists, and the **reviewed** TestCases.md SHA-256 recorded by that review equals the current TestCases.md hash (and the `TEST_DESIGN_APPROVED` approval it reviewed is still current) | `ME-E24` |

If any prerequisite fails:

- execute nothing,
- do not call Playwright MCP,
- do not create or modify ExecutionReport.md or BugReports.md,
- append a `stage_execution` event with `status: blocked` ("MCP: Not used"
  plus the reason),
- report and STOP.

Prerequisite 13 is stage-level: the *requirements* and their *sources* must be
known. Whether a specific data item is actually available is checked per case,
and an unavailable item makes that case **BLOCKED**.

## Inputs

| Input | Path | Use |
|---|---|---|
| **Approved TestCases.md** | `test-design/TestCases.md` | **The execution contract**: cases, steps, expected results, test data, flags, traceability |
| **Approved TestReview.md** | `test-review/TestReview.md` | Proof that exactly this TestCases.md version was reviewed and approved (`TEST_REVIEW_APPROVED`). Read only. |
| Approved ProjectContext | `context/ProjectContext.md` | To judge whether an actual result is *wrong*, not merely different, and for severity and priority bases (PC RK) |
| Approved ExplorationReport | `exploration/ExplorationReport.md` | Known FINDINGs and GAPs, which explain behavior already known to diverge from documentation |
| TaskContext.md | `context/TaskContext.md` | Identity, environment, entry points |
| PRD | `prd/PRD.md` | IDs, where traceability requires them |
| Environment and build information | Inputs, the human, or observed in the application (e.g. a version shown in the UI) | Execution Information |
| Approved test data | Sources declared in TestCases §10, or supplied by the human | Per-case execution. Secret values are never recorded. |
| Approvals / run context | `journal/execution-log.json`, `journal/workflow-run.json` | Prerequisites |
| Prompt | `.claude/prompts/manual-execution.md` | Loaded, hashed and recorded |
| Previous reports | `execution/ExecutionReport.md`, `bugs/BugReports.md` | On revisions only |

## Outputs

| Kind | Path | Notes |
|---|---|---|
| **Execution report** | `execution/ExecutionReport.md` | Always produced by a completed attempt. It replaces the template placeholder on the first run, and is updated in place after that. |
| **Evidence** | `execution/evidence/EVD-###-<slug>.<ext>` | `EVD` numbering is **task-wide**: it continues after the highest existing `EVD` (e.g. exploration evidence), so IDs never collide. |
| **Bug reports** | `bugs/BugReports.md` | **Only when at least one supported `APPLICATION_DEFECT` exists.** Otherwise the placeholder stays untouched, and the report and journal state that no bugs were raised. |
| Journal | `journal/execution-log.json`, `journal/prompts.json` | Events and the prompt snapshot |

**Placeholders:** a file carrying
`<!-- AI-QA-PLATFORM:PLACEHOLDER execution/ExecutionReport.md -->` or
`<!-- AI-QA-PLATFORM:PLACEHOLDER bugs/BugReports.md -->` is treated as absent.
A non-placeholder report without a journaled `manual-execution` origin is never
overwritten (`ME-E19`).

Nothing else is created or modified. That includes TestCases.md, the upstream
artifacts, `automation/`, the template, and the application.

## Responsibilities

- Record environment and build identifiers before starting.
- Verify preconditions and test data before each case.
- Execute the steps **exactly as written**. Any deviation is reported, never
  silently absorbed.
- For every executed case, capture the **Expected Result** (as written in the
  approved case), the **Actual Result** (as observed), and the **Status**
  (`PASS` / `FAIL` / `BLOCKED`).
- Give a reason for every `FAIL` and `BLOCKED`.
- Assign `PASS` only from a real observed result. Never infer a pass, and never
  mark a case passed that was not actually run.
- Capture evidence where possible: screenshots, accessibility snapshots, console
  and network output, and the exact message text.
- For each failure, analyze whether it is an application defect, a test case
  defect, a test data problem, an environment problem, a dependency problem, or
  unknown. Say which, and why.
- Raise **one bug report per distinct defect**, not per failing case.
- Assess severity and priority **separately**.
- Do not silently fix or reinterpret a test case. Flag it.
- Do not fix the application, and do not attempt workarounds that mask a failure.

## Non-Responsibilities

This stage never does any of the following:

- Invent, add, edit, repair, reorder or reinterpret test cases, steps, expected
  results, preconditions or test data assumptions. Corrections go back through
  Test Design.
- Modify the application, change test data or the environment to make a case
  pass, or use workarounds that mask a defect.
- Generate or modify automation code (Playwright tests, Selenium, SHAFT, Java,
  TestNG), classify automation candidates, or touch `automation/`.
- Execute automation, self-heal, or close or resolve bugs.
- Start `automation-generation`, or create a `workflow_run_id`.
- Store secrets anywhere.

## Tooling

- **Playwright MCP (`playwright`)** is used for all browser interaction and
  evidence capture. It is the browser-access tool, **not** the automation
  framework. Nothing produced here is automation code.

  | Tools (names vary by server version; the exact names used are journaled) | Purpose |
  |---|---|
  | navigate | open and move through the application |
  | fill / type / select_option / click / press_key | enter data, operate controls, submit |
  | snapshot / take_screenshot | observe and capture evidence |
  | console_messages / network_requests | error and traffic evidence |
  | read-only evaluate | inspect a displayed value or attribute |
  | wait_for | wait for an observable state |
  | close | end the session |

  Scripts that change page state or bypass validation are forbidden.
- Local file tools are used to write the reports, move, hash and redact evidence,
  and append to the journal.

## Case Selection (approved test cases only)

1. **Candidates:** every Active case in the approved TestCases.md.
2. **Selected for execution:** candidates with `Valid in Scope = TRUE` and an
   established expected result, narrowed to the human's explicit subset if one
   was given.
3. **Not executed**, each listed in §2 with the reason:
   - `Valid in Scope = FALSE` (cite its `CG-###`)
   - withdrawn cases
   - **Exploratory** cases (`Expected Result: Not established by approved
     requirements.`), because no PASS/FAIL judgment is possible (cite the
     `TQ-###`)
   - cases excluded by the human's request
   - cases not reached because the run was interrupted
4. **Missing case:** if a case needed to verify something does not exist, it is
   **not created**. Record a `TCI-###` of type `missing_test_case` with the
   recommended action "revise TestCases via Test Design". If a case the human
   requested does not exist, the stage is blocked before execution (`ME-E16`).
5. **Case not executable as written** (ambiguous or contradictory step, a
   reference to data that is not specified): record a `TCI-###`, and classify the
   result under the [status rules](#blocked-rules). Never silently repair it.

## Environment Verification

Before the first case, record the following in report §1 and the event's
`environment`, `build` and `browser` fields:

- environment
- application URL
- build or version identifier, and **how** it was determined
- browser name and version, if the tool reports them
- execution start (system clock)
- relevant configuration
- the test data source, by name only

**Never fabricate** a value. A value that cannot be determined is recorded as
`unavailable`, with the reason (e.g. "the application displays no version, and
none was supplied").

## Test Data Verification

Before **each** case:

1. Verify the required `DATA-###` exists and is available from its declared or
   supplied source.
2. Verify the preconditions can be established as written.
3. Never expose secrets, never invent credentials, and use only approved or
   supplied data.

If required data is unavailable, or a precondition cannot be established, the
case is **BLOCKED**. Record the missing data or precondition, the affected case,
why execution cannot proceed, and what would unblock it.

## Exact-Step Execution Rules

For **every step**, in the written order:

1. **Record** the action (`EXEC-###`: case, step number, action as written, tool,
   target, and the data *category* or `DATA-###`, never a secret value).
2. **Perform** it exactly as written, using Playwright MCP.
3. **Observe** the result.
4. **Capture evidence** when relevant. This is mandatory at a failing step.
5. **Continue** only if the execution state allows it.

**Deviations are never silently absorbed.** When a deviation becomes
necessary, pause and record `DEV-###` with the original step, the deviation,
the reason and the consequence:

| Kind | Definition | Handling |
|---|---|---|
| **Incidental** | Does not touch the tested behavior (e.g. dismissing an unrelated cookie banner, waiting for a slow load) | May be performed. It is recorded, and the result is marked "with deviation DEV-###" for the reviewer to judge. |
| **Substantive** | Changes steps, data, order or preconditions, or is needed to reach the expected state | **Not performed.** The case stops. Record `DEV-###` and `TCI-###`. Status is **BLOCKED** (deviation required), unless a FAIL was already observed at an earlier step. |

A deviation may invalidate the result. The reviewer decides.

## Expected vs Actual Rules

- **Expected Result** is copied **verbatim** from the approved case. It is never
  rewritten, improved, completed or reinterpreted.
- **Actual Result** describes **only** what was observed:
  - behavior and **exact** text,
  - visible state and navigation result,
  - relevant network or API behavior,
  - error details,
  - evidence references.
- The Actual Result never contains "should", never mixes in the expectation, and
  is never fabricated.

```
Approved case — Expected: "User receives an error message."
Execution    — Expected: "User receives an error message."        (verbatim)
               Actual:   "No error message is displayed; the form stays on /register." (EVD-031)
               Status:   FAIL
```

## PASS Rules

A case is **PASS** only when **all** of these hold:

1. it was actually executed,
2. every required step was completed,
3. the observed actual result satisfies the approved expected result,
4. no blocking issue or substantive deviation invalidated the result.

Never PASS a case because it was expected to work, the application usually works,
similar cases passed, or the result is assumed. **A PASS requires real
observation.**

## FAIL Rules

A case is **FAIL** when it was executed and the observed behavior does **not**
satisfy the approved expected result. Record:

- expected (verbatim) and actual (observed),
- evidence (mandatory, or `not_captured` with the reason),
- the failure reason,
- the affected step,
- the failure analysis.

If the application performed the behavior and produced a wrong result, the case
is a **FAIL**, never BLOCKED.

## BLOCKED Rules

A case is **BLOCKED** when it cannot be meaningfully executed because of an
**external or prerequisite condition**:

- the environment or application is unreachable,
- required test data is unavailable,
- authentication is unavailable,
- a prerequisite or dependent system is unavailable,
- the case is not executable as written (`TCI-###`),
- a substantive deviation is required (`DEV-###`).

Each blocked case records its blocker type, the blocker, its impact, what would
unblock it, and any evidence. If the application becomes unreachable mid-run,
the current case is BLOCKED. Cases not yet started are "Not executed — run
interrupted". Everything already observed is still reported.

## Evidence Rules

- **Mandatory** for every FAIL and every bug, where it can be captured.
  Recommended at key PASS observations.
- **Types:**
  - `screenshot`
  - `accessibility_snapshot`
  - `console`
  - `network`
  - `ui_text` (exact message)
  - `url`
  - `api_response` (request and response)
  - `browser_state`
  - `application_output`
  - `other`
- **Every item** records:
  - `EVD-###` (task-wide sequence)
  - type
  - capture status
  - related test case(s) and step
  - related failure and bug(s)
  - source MCP action (`mcp_actions.seq`)
  - file path under `execution/evidence/`
  - original tool path, if moved
  - SHA-256
  - system timestamp (`null` if unavailable)
  - redactions
  - notes
- **Storage:** `platform/tasks/<task-name>/execution/evidence/`. Files the MCP
  server wrote to `.playwright-mcp/` are **moved** in. Evidence is never stored
  in the template.
- **References:** evidence is cited from ExecutionReport.md (§4, §5, §6) and, where
  applicable, BugReports.md.
- **Not capturable:** record an item with `not_captured` and the actual reason.
  **Never fabricate evidence.** Never alter evidence beyond marked redaction.

## Security and Secret Handling

Never store passwords, access tokens, API keys, session cookies, other secrets,
or personal credentials, in the journal, reports, evidence, HTML or bug reports.

- **Data entry:** the execution and MCP action logs record the `DATA-###` or the
  value category (e.g. "password from DATA-002 source"), **never the value**.
- **Text evidence** (console, network, snapshot, UI text): redact secrets before
  storing, as `[REDACTED: <kind>]`, and record the redaction in `redactions`.
- **Images:** do not store a screenshot that shows a secret which cannot be
  redacted with the available tools. Record `not_captured`, with the reason
  "contained sensitive data", and prefer text evidence instead.
- **Trigger messages:** secrets in a human message are redacted in
  `trigger.user_message` before journaling, and the redaction is noted.
- Credentials come only from approved or supplied sources, and are referenced by
  source name.

## Failure Analysis

For **every FAIL**, determine the **most supported** cause category:

| Category | Supported when |
|---|---|
| `APPLICATION_DEFECT` | The application behaves contrary to the approved expectation, and the case, data and environment are sound. |
| `TEST_CASE_DEFECT` | The case is wrong relative to its own approved sources: an incorrect step, an expected result that contradicts the cited `PC BR`/`EB`, or an impossible precondition. |
| `TEST_DATA_PROBLEM` | The data used was invalid, in the wrong state, or not what the case specified. |
| `ENVIRONMENT_PROBLEM` | The environment misbehaved: deployment, configuration, outage, performance degradation unrelated to the tested behavior. |
| `DEPENDENCY_PROBLEM` | An external system or service the flow relies on failed. |
| `UNKNOWN` | The evidence does not support any single category. |

- Each analysis records the category, reasoning, supporting evidence, and
  confidence (High, Medium or Low) with its limitations.
- **Never force a cause** when the evidence is insufficient. Use `UNKNOWN` and
  say what would resolve it.
- **Known FINDING:** if the failing case carries a known `FND-###` from
  exploration, the approved expectation is still the contract. Supported
  deviations are an `APPLICATION_DEFECT`, and the bug notes that "the
  documentation may be what is wrong; business confirmation recommended".
- **A FAIL is not automatically a bug.** Only failures supported as
  `APPLICATION_DEFECT` produce bugs. `TEST_CASE_DEFECT` also produces a `TCI-###`.
  Data, environment and dependency problems are reported in §5 and §6, with no
  bug unless they reveal a distinct application defect.

## Defect Grouping

- Create **one bug per distinct defect or root cause**.
- **Group** failing cases into one `BUG-###` when the evidence supports the same
  underlying defect: the same faulty behavior in the same function or area,
  triggered by the same condition.

  ```
  TC-001 FAIL ─┐
  TC-004 FAIL ─┼→ BUG-001   (not BUG-001, BUG-002, BUG-003)
  TC-009 FAIL ─┘
  ```
- **When unsure,** keep the bugs separate and cross-reference them as "possibly
  related to BUG-###". This avoids hiding a distinct defect inside another. The
  judgment is recorded in `decisions`.
- Each group records its bug, its cases, and the grouping rationale
  (`defect_grouping`).

## Severity Rules

- Severity measures **impact**, and is assessed **independently** of priority.
- Use the project's defined severity model if one exists (knowledge base or
  TaskContext). Otherwise use the platform default:
  - **Critical**: core function unusable, data loss or corruption, or a security
    exposure, with no workaround.
  - **High**: a major function fails, or the workaround is impractical.
  - **Medium**: a function is partially impaired and a workaround exists.
  - **Low**: cosmetic or minor.
- Always give a **severity rationale** based on the observed impact, never on
  preference.

## Priority Rules

- Priority measures **urgency**, and is assessed **independently** of severity.
  A cosmetic issue on a critical path may be Low severity and High priority.
- Its basis is documented business importance, risk (`PC RK`), workflow impact,
  affected case priorities, or project rules. If none exists, write
  `Not established`.
- Always state the **basis**.

## Bug Report Rules

Write `bugs/BugReports.md` (from the
[template](BugReports.template.md)) **only** when at least one supported
`APPLICATION_DEFECT` exists. Each `BUG-###` has these sections:

- **Title:** clear and concise.
- **Severity**, with rationale, and **Priority**, with basis, independently.
- **Environment:** environment, URL, build and browser.
- **Preconditions:** the required state.
- **Steps to Reproduce:** complete and standalone. A developer reproduces the
  defect without external context, and without references like "see TC-004".
- **Expected Result:** from the approved case, with its basis.
- **Actual Result:** observed only.
- **Evidence:** `EVD-###` with paths.
- **Affected Test Cases:** every case failing on this defect, with the step, and
  the grouping rationale.
- **Root Cause Assessment:** only what the evidence establishes. Otherwise
  `Not established — observed symptom only.` No speculative technical cause.
- **Traceability:** `PC BR/EB → TC → FAIL → EVD → BUG`, plus related exploration
  items (`FND`, `OBS`).
- **Status:** `Open`. The skill never confirms, closes or rejects a bug.

## Execution Report Rules

Write `execution/ExecutionReport.md` from the
[template](ExecutionReport.template.md):

| § | Section | Content |
|---|---|---|
| 1 | Execution Information | Identity, run ID, environment, URL, build, browser, start and end, TestCases and upstream versions and hashes, skill and prompt versions, revision history |
| 2 | Execution Scope | Approved cases, selected and executed cases, not executed with reasons |
| 3 | Execution Summary | Totals: approved, selected, executed, PASS, FAIL, BLOCKED, not executed, TCIs, deviations, bugs. **No quality score.** |
| 4 | Per-Case Results | ID, Expected, Actual, Status, Reason, Evidence, plus per-case step detail (`EXEC` / `DEV`) |
| 5 | Failure Analysis | Per FAIL: case, step, cause, reasoning, evidence, confidence, bug or none |
| 6 | Blocked Cases | Per BLOCKED: case, blocker type, blocker, impact, unblock condition, evidence |
| 7 | Test Case Issues | `TCI-###` (invalid, ambiguous, missing data, incorrect assumption, deviation, unexecutable, missing case) and `DEV-###` |
| 8 | Bugs Raised | `BUG-###`, title, affected cases, severity, priority, status, or "No bugs raised" |
| 9 | Coverage | Approved vs executed (executed, passed, failed, blocked, not executed), plus source coverage from TestCases traceability |

## Coverage Rules

- **Every** approved Active case appears in §2, as executed or not executed with
  a reason, and executed cases appear in §4. Nothing silently disappears.
- **Arithmetic:** executed = PASS + FAIL + BLOCKED, and approved = executed + not
  executed.
- **Source coverage** (§9) maps each source (`PC BR`, `PC EB`, `OBS`) from the
  TestCases traceability to its executed cases, their statuses and bugs, so
  `Source → Test Case → Execution → Bug` is visible.

## Traceability

The chains are maintained with **exact upstream IDs**. New IDs are only
`EXEC`, `DEV`, `TCI`, `BUG`, and the continued `EVD` sequence.

```
Test Case (TC-###) → Execution Result (status, EXEC-###) → Evidence (EVD-###) → Failure (cause) → Bug (BUG-###)
Source (PC BR-### / OBS-###) → Test Case → Execution → Bug
PC BR-003 → TC-014 → FAIL → EVD-014 → BUG-002

TC-014 ─┐
TC-018 ─┼→ BUG-002
TC-021 ─┘
```

Every bug traces to one or more failing cases, execution evidence, the expected
behavior (the approved case and its basis), and the observed actual behavior.

## No Silent Fixes

Never:

- modify the application,
- modify the test case or its expected result,
- create a workaround that masks a defect,
- change test data to make a case pass,
- change environment behavior without recording it.

A needed correction is recorded as a `TCI-###` or a recommendation. It goes
through a revision request, or through Test Design for case changes.

## Validation Rules (self-checks before presenting)

| Check | Rule |
|---|---|
| ME-V01 | All prerequisites (1–14) were verified before the first MCP call. |
| ME-V02 | Environment, build and browser are recorded, or explicitly `unavailable` with a reason. |
| ME-V03 | Only approved Active cases were executed. Every approved case is accounted for (executed, or not executed with a reason). No case was invented. |
| ME-V04 | Every Expected Result is verbatim from TestCases.md (compared exactly). |
| ME-V05 | Every Actual Result is observation-only (no "should"), and backed by execution actions. |
| ME-V06 | Every executed case has exactly one status. PASS cases completed all steps with no substantive deviation. |
| ME-V07 | Every FAIL has expected, actual, the failing step, evidence (or not_captured with a reason), and a failure analysis with category, reasoning and confidence. |
| ME-V08 | Every BLOCKED has a blocker type, blocker, impact and unblock condition. No application misbehavior was marked BLOCKED. |
| ME-V09 | Bugs exist only for `APPLICATION_DEFECT` failures. One bug per distinct defect. Every such FAIL maps to a bug, and every bug lists all its affected cases with a grouping rationale. |
| ME-V10 | Each bug has every required section, including standalone steps to reproduce, severity with rationale, and priority with basis, set independently. The root cause is only what the evidence supports. |
| ME-V11 | Every captured evidence file exists in `execution/evidence/` with its SHA-256. Evidence IDs do not collide with existing task `EVD` IDs. |
| ME-V12 | No secrets appear in reports, evidence text, the journal or the trigger message (redactions recorded). |
| ME-V13 | Every `TCI` and `DEV` is recorded with consequence and recommended action. No test case was edited. |
| ME-V14 | Coverage arithmetic holds, and source coverage is consistent with TestCases traceability. |
| ME-V15 | No automation code, no automation candidate classification, and no change to `automation/`. |
| ME-V16 | Upstream artifacts are unchanged (hashes). There is exactly one ExecutionReport.md, and BugReports.md exists only if bugs exist. No `-v2` copies. |
| ME-G01 | (gate) The reply is exactly `MANUAL_EXECUTION_APPROVED`, standalone. |

If a check fails because of the report, correct the report and record the
correction in `fixes`. If it fails because of the execution, record the
limitation. Never pass a check by fabricating content.

## Failure Conditions

| Code | Condition | Status | MCP |
|---|---|---|---|
| ME-E01 / E02 | Task folder missing / target is the template | blocked | not used |
| ME-E03 | TaskContext.md missing | blocked | not used |
| ME-E04 | PRD missing, or its approval stale | blocked | not used |
| ME-E05 / E06 | ProjectContext missing / approval invalid or stale | blocked | not used |
| ME-E07 / E08 | ExplorationReport missing / approval invalid or stale | blocked | not used |
| ME-E09 | TestCases.md missing, or still the placeholder | blocked | not used |
| ME-E10 / E11 | Test Design not approved / approval stale | blocked | not used |
| ME-E12 | Approved TestCases.md was designed from different upstream versions | blocked | not used |
| ME-E13 | No active workflow run (the event carries `workflow_run_id: null`). A run ID is never created. | blocked | not used |
| ME-E14 | Target URL or environment not determinable | blocked | not used |
| ME-E15 | Test data requirements or sources not determinable | blocked | not used |
| ME-E16 | A requested case ID is not an Active case in the approved TestCases.md | blocked | not used |
| ME-E17 / E18 | Prompt missing or unreadable / same version with a different SHA-256 | blocked | not used |
| ME-E19 | A non-placeholder report exists without a journaled `manual-execution` origin (never overwritten) | blocked | not used |
| ME-E20 | Journal missing or invalid JSON. Nothing is recreated silently. If reports were already written, state that the run is **not journaled** | blocked / failed | — |
| ME-E21 | Playwright MCP server unavailable | failed | attempted, recorded |
| ME-E22 | Application unreachable before the first case | failed | used, with evidence of the failure |
| ME-E23 | Test Review missing or not approved with `TEST_REVIEW_APPROVED` in the active run (ADR-001) | blocked | not used |
| ME-E24 | Test Review approval stale: TestReview.md changed, a later review run exists, or the reviewed TestCases.md hash differs from the current one | blocked | not used |

For a blocked or failed stage, no ExecutionReport.md or BugReports.md is created
or modified. If the application becomes unreachable mid-run, that is **not** a
stage failure: the report is completed with the BLOCKED and not-executed cases.

## Revision Behavior

When the reviewer requests corrections:

1. Append a `revision_request` event with the verbatim request, secrets redacted.
2. Re-check prerequisites, including that the approvals are current. If
   TestCases.md was re-approved since, the whole execution must be re-planned
   against it.
3. Update the **same** `ExecutionReport.md`, and the same `BugReports.md` where
   applicable. Never create `ExecutionReport-v2.md` or `BugReports-v2.md`.
4. **Preserve stable IDs** (`BUG`, `TCI`, `DEV`, `EXEC`, `EVD`). A withdrawn bug
   stays listed as `Withdrawn (vX.Y.Z — reason)`, and its ID is never reused.
5. **Re-run only what is required**, and capture new evidence with new `EVD`
   IDs. Earlier evidence is kept.
6. Bump the minor version of each changed report. Record:
   - the reason,
   - changed sections,
   - re-executed cases,
   - changed results (before and after),
   - added, modified and withdrawn bugs.

   Reset Status to Draft.
7. If the prompt version changed, register it and set
   `revision.prompt_version_changed: true`.
8. Append a `stage_execution` event whose `revision` records all of the above
   (`re_executed`, `result_changes`, `items_added`, `items_modified`,
   `items_removed`), together with the new actions, results and evidence.
9. Present the revision and **STOP again**. `MANUAL_EXECUTION_APPROVED` is
   required again.

**Changing an approved ExecutionReport.md or BugReports.md voids the approval.**

## Hard-Stop Behavior

After ExecutionReport.md, and BugReports.md if needed, are produced:

- **STOP.** Present for review: execution results, failures, blocked cases, test
  case issues, bugs, evidence and coverage.
- Do **not**:
  - write, modify or execute automation code,
  - classify automation candidates,
  - self-heal tests,
  - modify test cases,
  - fix the application,
  - close bugs,
  - start the next stage.
- The gate is unconditional.

## Approval Gate

- The only valid progression key is the **exact, case-sensitive, standalone**
  value:

  ```
  MANUAL_EXECUTION_APPROVED
  ```

- **Invalid:** `approved`, `looks good`, `continue`, `proceed`, `LGTM`,
  `MANUAL_EXECUTION_APPROVED please continue`, any message containing the key with
  other text, silence, or another stage's key. Each is journaled as an
  `approval_decision` with `not_accepted`, and the stage remains stopped. A
  message that also contains a correction request proceeds to revision.
- **When accepted:**
  - set Status to `Approved` in ExecutionReport.md, and in BugReports.md if it
    exists, with the versions unchanged,
  - append an `approval_decision` (`accepted`, `next_stage.unlocked: true`)
    carrying the **post-update SHA-256 of each report**, which downstream stages
    use to detect a stale approval,
  - report that `automation-generation` is unlocked.
- The orchestration layer decides when `automation-generation` actually starts.
  This skill never starts it.

## Journal Integration

Use the existing journal only:

- `journal/execution-log.json` (events, schema v1.4.0)
- `journal/prompts.json` (prompt records)

The stage's constant values are in
[`journal-event.template.json`](journal-event.template.json).

| Moment | Event type | Status |
|---|---|---|
| Prerequisite not met | `stage_execution` | `blocked` |
| Execution completed, reports written (each attempt) | `stage_execution` | `awaiting_approval` |
| MCP unavailable, or application unreachable at start | `stage_execution` | `failed` |
| Correction requested | `revision_request` | `revision_requested` |
| Reply is the key | `approval_decision` | `approved` |
| Reply is not the key | `approval_decision` | `approval_not_accepted` |

Field rules (`stage_execution`):

- **Identity:**
  - `event_id` / `step_number` are the next in sequence.
  - `attempt` counts this stage's executions within the run.
  - `workflow_run_id` is **read** from `workflow-run.json`, never created. It is
    `null` only on ME-E13.
  - Also record `task_id` and `timestamp` (system clock, UTC), plus the stage and
    skill identity and versions.
- **Prompt:**
  - `prompt_id` / `prompt_version` reference `prompts.json`.
  - On first use in the task, append the verbatim content, SHA-256,
    `captured_at` and `first_used_by_event_id`.
  - Later events reference it without duplicating the text.
  - `prompt_variables` records `task_name`, `task_path`, `workflow_run_id`,
    `ui_url` and `api_url`.
- **`trigger`**: the reason and the verbatim user message, **secrets redacted**.
- **`input_references`**:
  - TestCases.md (`upstream_artifact`, SHA-256) and its approval
  - TestReview.md (`upstream_artifact`, SHA-256) and its `TEST_REVIEW_APPROVED`
    approval (`upstream_approval`, `journal:EVT-NNNN`). Automation Generation later
    verifies that this same review approval is still current (ADR-001).
  - ProjectContext and ExplorationReport, with their approvals
  - PRD and its approval
  - TaskContext.md
  - the application URL (`project_url`)
  - the prompt
  - on revisions, the previous reports and the request
- **`source_references`**: the TestCases sections and IDs used, and any
  ProjectContext or Exploration references.
- **Execution context:**
  - **`environment`**: environment, URL, configuration, test data source name,
    start and end.
  - **`build`**: identifier and how it was determined, or unavailable with the
    reason.
  - **`browser`**: name and version, or unavailable.
- **Cases:**
  - **`test_case_ids`**: the selected cases.
  - **`executed_test_case_ids`**: the cases actually executed.
- **Action logs:**
  - **`execution_actions`**: every `EXEC-###` (case, step, action, tool,
    target, result, `mcp_seq`, evidence, deviation, timestamp). This is the
    execution timeline.
  - **`mcp_actions`**: every Playwright MCP call actually performed, in order
    (`seq`, tool, action, target, `test_case_id`, `step`, `data_changing`,
    result, timestamp, evidence). Values are never recorded as secrets.
- **Results:**
  - **`test_results`**: per case, the expected result (verbatim), actual result,
    status, reason, failed step, evidence, cause, bug IDs, TCI and DEV IDs, and
    `with_deviation`. This covers expected results, actual results and statuses
    per case.
  - **`statuses`**: counts (`PASS`, `FAIL`, `BLOCKED`, `NOT_EXECUTED`).
- **Analysis:**
  - `failure_analysis`
  - `blocked_cases`
  - `test_case_issues`
  - `deviations`
- **Evidence and bugs:**
  - **`evidence`**: every `EVD` item (`related_test_cases`, `related_step`,
    `related_bugs`, `source_action`, path, SHA-256, `captured_at`, redactions,
    or `not_captured` with the reason).
  - **`bugs`**: `BUG-###`, title, severity with rationale, priority with basis,
    affected cases, evidence, sources, status, and report reference.
    `severity` and `priority` live per bug.
  - **`defect_grouping`**: bug, cases, rationale, and possibly-related bugs.
- **`coverage`** (execution shape):
  - approved, selected and executed counts,
  - passed, failed and blocked counts,
  - not executed, with reasons,
  - TCI and bug counts,
  - source coverage.
- **`output_artifacts`**:
  - ExecutionReport.md (created or updated, status, version, SHA-256, counts)
  - BugReports.md (created or updated, or `unchanged` with the summary
    "placeholder retained — no supported application defect")
  - the evidence files
- **`mcp_used`:**
  - When the stage ran: `{ used: true, servers: [{ server: "playwright", version, tools: [<exact names>], purpose: "browser access for manual execution (not automation)" }] }`.
    The HTML journal shows **MCP: Playwright**.
  - When blocked: `{ used: false, … intentionally_not_used: [{ server: "playwright", reason: "<actual reason>" }] }`.
    The HTML journal shows **MCP: Not used — <reason>**.
- **Also recorded:**
  - `tools_used`, `actions`, `decisions` (grouping, cause judgments, deviations
    performed, severity and priority reasoning), and `assumptions`.
  - `gaps` (empty) and `open_questions` (issues needing human decision).
  - `validation.checks` (ME-V01…V16).
- **Gate fields:**
  - `status`
  - `stop_reason`
  - `approval_required: true`
  - `approval_key: "MANUAL_EXECUTION_APPROVED"`
  - `approval_outcome` (`null` except on `approval_decision`)
  - `next_stage` (`automation-generation`, unlocked only after an accepted
    approval)
- **Also recorded:** `errors`, `fixes`, `revision` (`null` on attempt 1) and
  `notes`.
- **Never fabricate** runtime values. If a value is unavailable, use `null` and
  explain it in `notes`.

## HTML Journal Observability

The future interactive HTML journal must be able to show, from the journal and
the artifacts, without rerunning anything:

| # | Shown | From |
|---|---|---|
| 1–2 | Why it ran, and the triggering message | `trigger` (redacted) |
| 3 | Exact prompt version | `prompt_id`/`prompt_version` → `prompts.json` |
| 4–6 | ProjectContext, ExplorationReport, and TestCases.md version and hash | `input_references` (+ approval events) |
| 7 | Workflow Run ID | `workflow_run_id` |
| 8–10 | Environment, build, browser | `environment`, `build`, `browser` |
| 11 | Test data source (no secrets) | `environment.test_data_source` |
| 12 | Test cases selected | `test_case_ids`, `coverage.not_executed` |
| 13 | Steps executed | `execution_actions[]` (timeline) |
| 14 | Playwright MCP actions | `mcp_actions[]`, `mcp_used` |
| 15–17 | Expected, actual, and PASS/FAIL/BLOCKED | `test_results[]`, `statuses` |
| 18 | Evidence | `evidence[]` → files |
| 19 | Failure analysis | `failure_analysis[]` |
| 20 | Test case issues | `test_case_issues[]`, `deviations[]` |
| 21–24 | Bugs, grouping, severity, priority | `bugs[]`, `defect_grouping[]` |
| 25 | Coverage | `coverage` |
| 26 | Why execution stopped | `stop_reason`, `status` |
| 27–28 | `MANUAL_EXECUTION_APPROVED` requirement, and the approval result | `approval_key`, `approval_decision` events |
| 29 | Revisions | `revision_request` events, `revision` (re-executed, result changes, bugs added, modified and removed) |
| 30 | Errors and fixes | `errors`, `fixes` |

**Navigation paths:**

- **Test Case → Execution → Expected vs Actual → Evidence → Failure → Bug**:
  `test_results[tc]` → `execution_actions[tc]` → `evidence_ids` →
  `failure_analysis[tc]` → `bug_ids`.
- **Source → Test Case → Execution → Bug**: `coverage.source_coverage[]` (and
  upstream, the test-design `traceability.matrix`) → `test_results` → `bugs`.
- **BUG → Affected Test Cases → Evidence → Execution Result**: `bugs[].affected_test_cases`
  → `test_results[]` → `evidence[]`, via `defect_grouping`.
