---
prompt_id: manual-execution
prompt_version: 1.1.0
skill: manual-execution
stage_id: manual-execution
approval_key: MANUAL_EXECUTION_APPROVED
variables: [task_name, task_path, workflow_run_id, ui_url, api_url]
changelog:
  - "1.1.0: Require a current TEST_REVIEW_APPROVED bound to the current TestCases.md hash (ADR-001)."
  - "1.0.0: Initial version."
---

# Prompt — Manual Execution

> Versioning rule: any change to the text of this file requires a
> `prompt_version` bump. The journal identifies the prompt used for each run by
> `prompt_id` + `prompt_version`. One verbatim snapshot of each version, with its
> SHA-256, is stored in the task's `journal/prompts.json`.

## Purpose

Run the **approved** test cases against the live application. Record what
actually happened with enough fidelity that any result can be trusted, and any
failure can be reproduced by a developer without follow-up questions.

```
approved TestCases.md → live application → execute exact steps → expected vs actual
  → PASS / FAIL / BLOCKED → failure analysis → bug reports per distinct defect
  → ExecutionReport.md (+ BugReports.md) → HUMAN REVIEW → MANUAL_EXECUTION_APPROVED
```

## Prerequisites

Execute nothing, and do not call Playwright MCP, unless **all** of these hold:

- The task, TaskContext.md, PRD.md, ProjectContext.md, ExplorationReport.md,
  TestCases.md and TestReview.md exist. TestCases.md must not be the template
  placeholder.
- The PRD, ProjectContext, Exploration and Test Design (`TEST_DESIGN_APPROVED`)
  approvals are valid and current (hashes unchanged since approval).
- The approved TestCases.md was designed from the currently approved
  ProjectContext and ExplorationReport.
- **Test Review is mandatory.** A current `TEST_REVIEW_APPROVED` exists for
  exactly the current TestCases.md (same SHA-256), even when TestCases.md is
  already approved. An unapproved, blocked or stale review means execute nothing.
- An active `workflow_run_id` exists (`{{workflow_run_id}}`, orchestration-owned,
  read only).
- The target application URL and environment can be determined
  (`{{ui_url}}` / `{{api_url}}`).
- The test data requirements (TestCases §10) and their sources can be determined.

Otherwise, stop and report the failed prerequisite.

## Approved Test Case Rules

- The approved `{{task_path}}/test-design/TestCases.md` is the **execution
  contract**.
- **Selection:** Active cases with `Valid in Scope = TRUE` and an established
  expected result. The human may narrow this to a subset.
- **Not executed, each listed with its reason:**
  - `Valid in Scope = FALSE`
  - withdrawn cases
  - Exploratory cases (`Expected Result: Not established …`), because they
    cannot be judged PASS or FAIL
- Never invent a test case, add steps, change expected results or preconditions,
  change test data assumptions, silently skip steps, or reinterpret a case.
- **Missing case:** if a needed case does not exist, do **not** create it. Record
  a Test Case Issue (`missing_test_case`). If the human requested a case ID that
  is not in the approved TestCases.md, stop before executing and ask.
- **Case not executable as written:** record a Test Case Issue (`TCI-###`) and
  classify the result per the status rules. Never silently repair the case.

## Environment Rules

Before the first case, record:

- environment
- application URL
- build or version identifier
- browser information
- execution start time (system clock)
- relevant configuration
- test data source (never secret values)

Never fabricate any of these. A value that cannot be determined is recorded as
`unavailable`, with the reason.

## Test Data Rules

Before each case:

- verify the required `DATA-###` exists and the preconditions can be
  established,
- use only approved or supplied data,
- never invent credentials, and never expose secrets.

If required data is unavailable, the case is **BLOCKED**. Record the missing data,
the affected case, why execution cannot proceed, and what would unblock it.

## Playwright MCP Rules

- Use the `playwright` MCP server for all browser interaction and evidence
  capture:
  - navigation
  - data entry
  - clicks and submits
  - observation
  - screenshots
  - accessibility snapshots
  - console and network output
- Playwright MCP is the browser-access tool. It is **not** the automation
  framework. Never generate Playwright tests, Selenium, SHAFT, Java, TestNG or any
  automation code. Never classify automation candidates.
- Never modify the application, alter page state through scripts, or bypass
  validation.

## Exact Execution Rules

For every step, in order:

1. record the action,
2. perform it exactly as written,
3. observe the result,
4. capture evidence when relevant,
5. continue only if the execution state allows it.

Deviations are never silently absorbed:

- **Incidental** (does not touch the tested behavior, e.g. dismissing an
  unrelated banner or waiting for a load): pause, record a `DEV-###` with the
  original step, the deviation, the reason and the consequence, then continue.
  The result is marked as having a deviation.
- **Substantive** (changes steps, data, order, preconditions, or is needed to
  reach the expected state): do **not** perform it. Stop the case and record a
  `DEV-###` and a `TCI-###`. The case is BLOCKED (deviation required), unless a
  FAIL was already observed.

## Expected vs Actual Rules

- **Expected** is copied **verbatim** from the approved case. Never rewrite,
  improve or reinterpret it.
- **Actual** is only what was observed:
  - behavior and exact text,
  - visible state,
  - navigation result,
  - relevant network or API behavior,
  - error details,
  - evidence references.

  It never says "should", never mixes in the expectation, and is never
  fabricated.

## PASS / FAIL / BLOCKED Rules

Each executed case gets **exactly one** status:

- **PASS** only when all of these hold:
  - the case was actually executed,
  - every step was completed,
  - the actual result satisfies the approved expected result,
  - nothing invalidated the result.

  Never PASS a case because it "should" work, usually works, or because similar
  cases passed.
- **FAIL** when the case was executed and the observed behavior does not satisfy
  the approved expected result. Record the expected and actual results, the
  evidence, the failure reason, the affected step, and the failure analysis.
- **BLOCKED** when the case cannot be meaningfully executed because of an external
  or prerequisite condition. Examples:
  - environment or application unreachable,
  - test data unavailable,
  - authentication unavailable,
  - a dependency or prerequisite system unavailable,
  - a case that is not executable as written,
  - a substantive deviation required.

  If the application executed the behavior and produced a wrong result, the case
  is a **FAIL**, not BLOCKED.

## Failure Analysis

For every FAIL, determine the **most supported** cause:

| Cause | Meaning |
|---|---|
| `APPLICATION_DEFECT` | The application behaves contrary to the approved expectation, and the case, data and environment are sound. |
| `TEST_CASE_DEFECT` | The case itself is wrong: an incorrect step or expectation relative to its approved sources. |
| `TEST_DATA_PROBLEM` | The data used was wrong or in the wrong state. |
| `ENVIRONMENT_PROBLEM` | The environment misbehaved: configuration, deployment, outage. |
| `DEPENDENCY_PROBLEM` | An external system or service the flow relies on failed. |
| `UNKNOWN` | The evidence does not support any single cause. |

- Give the reasoning, the supporting evidence, and the confidence (High, Medium
  or Low) with its limitations.
- Never force a cause.
- If the case carries a known FINDING (`FND-###`), the approved expectation is
  still the contract. Note that the documentation may be what is wrong.

## Defect Grouping and Bug Rules

- A FAIL is **not** automatically a bug. Only `APPLICATION_DEFECT` failures
  produce bugs. Test case defects, data, environment and dependency problems
  produce no bug unless they reveal a distinct application defect.
- **One bug per distinct defect or root cause.**
  - Several failing cases with the same underlying defect produce **one**
    `BUG-###` listing all of them.
  - Group only when the evidence supports a single defect.
  - If you are unsure, keep the bugs separate and cross-reference them as
    "possibly related".
- **Each bug records:**
  - Title
  - Severity
  - Priority
  - Environment (with build)
  - Preconditions
  - Steps to Reproduce (complete and standalone)
  - Expected Result (from the approved case)
  - Actual Result (observed)
  - Evidence
  - Affected Test Cases
  - Root Cause Assessment (only what the evidence supports, otherwise
    `Not established — observed symptom only`)
  - Status: `Open`
- Write `{{task_path}}/bugs/BugReports.md` **only** if at least one supported
  application defect exists.

## Severity and Priority Rules

- **Severity** (impact) and **priority** (urgency) are assessed
  **independently**, each with its rationale.
- **Severity:** use the project's defined model if one exists. Otherwise use:
  - **Critical**: core function unusable, data loss or corruption, or a
    security exposure, with no workaround.
  - **High**: a major function fails, or the workaround is impractical.
  - **Medium**: a function is partially impaired and a workaround exists.
  - **Low**: cosmetic or minor.
- **Priority:** High, Medium or Low, based on documented business importance,
  risk (PC RK), workflow impact, affected case priorities, or project rules.
  Otherwise write `Not established`. Always state the basis.

## Evidence Rules

- Capture evidence for every FAIL and every bug where possible. Types:
  - screenshot
  - accessibility snapshot
  - console output
  - network output
  - exact UI text
  - URL
  - request and response
  - browser state
  - application output
- Each item records:
  - `EVD-###` (continuing the task-wide sequence after existing evidence)
  - type
  - related test case and step
  - related failure or bug
  - the producing MCP action
  - file path under `{{task_path}}/execution/evidence/`
  - system timestamp
  - SHA-256
  - redaction information
- Move files the MCP server wrote elsewhere (`.playwright-mcp/`) into the task.
- If evidence cannot be captured, record it as `not_captured` with the reason.
  Never fabricate evidence.
- **Secrets are never stored:** passwords, tokens, API keys, session cookies or
  personal credentials. Redact text evidence and mark each redaction. Do not
  store an image that shows a secret and cannot be redacted. Record it as
  `not_captured` with the reason.

## Execution Report Rules

Write `{{task_path}}/execution/ExecutionReport.md` following
`.claude/skills/manual-execution/ExecutionReport.template.md`:

1. Execution Information
2. Execution Scope
3. Execution Summary
4. Per-Case Results
5. Failure Analysis
6. Blocked Cases
7. Test Case Issues
8. Bugs Raised
9. Coverage

Give counts only, with **no** quality score. Bugs follow
`.claude/skills/manual-execution/BugReports.template.md`.

## Hard Stop

After ExecutionReport.md, and BugReports.md if needed: **STOP** and present the
results, failures, blocked cases, test case issues, bugs, evidence and coverage.
Do **not**:

- generate or execute automation,
- self-heal,
- modify test cases, the application or test data,
- close bugs,
- start the next stage.

## Approval

- The only progression key is the exact, case-sensitive, standalone value:

  ```
  MANUAL_EXECUTION_APPROVED
  ```

- These are **not** approval: `approved`, `looks good`, `continue`, `proceed`,
  `LGTM`, `MANUAL_EXECUTION_APPROVED please continue`, any message containing the
  key with other text, silence, or another stage's key.
- Approval unlocks `automation-generation`. It never starts it.

## Revision Behavior

1. Update the **same** ExecutionReport.md and BugReports.md. Never create `-v2`
   copies.
2. Preserve IDs (`TC`, `BUG`, `TCI`, `DEV`, `EVD`). Withdrawn bugs stay listed as
   withdrawn.
3. Bump each changed report's minor version. Record:
   - the reason,
   - changed sections,
   - re-executed cases,
   - changed results (before and after),
   - added, modified and withdrawn bugs.
4. Re-run only what is required, and capture new evidence.
5. STOP. `MANUAL_EXECUTION_APPROVED` is required again. Changing an approved
   report voids its approval.

## Journal Requirements

- Append events conforming to `platform/schemas/journal-event.schema.json`.
- Record:
  - the trigger (secrets redacted),
  - inputs with their hashes,
  - environment, build and browser,
  - selected and executed case IDs,
  - every execution action (`EXEC-###`) and MCP action, in order,
  - per-case expected, actual and status,
  - failure analysis, blocked cases, test case issues and deviations,
  - evidence, bugs and defect grouping,
  - coverage, validation results, stop reason and gate state.
- Never fabricate values. Use `null` plus a note when a value is unavailable.
- If blocked before any MCP call, record "MCP: Not used" with the actual reason.
