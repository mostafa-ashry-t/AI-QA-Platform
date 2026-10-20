---
name: exploration
description: Exploration stage of the AI QA Platform. Explores the live application through the Playwright MCP server (browser access only, not automation) against the task's APPROVED ProjectContext.md. Compares documented expected behavior with actual behavior, classifies every observation as exactly one of MATCH / FINDING / GAP / QUESTION / POTENTIAL BUG, captures evidence for every non-MATCH, and records candidate locators. Writes platform/tasks/<task-name>/exploration/ExplorationReport.md, then HARD STOPS for human review until the exact standalone key EXPLORATION_APPROVED. Never writes test cases, automation or bug reports. Use when asked to "explore the application", "check how this actually behaves", "compare the context with the real app", or "revise the exploration report".
---

# Exploration

## Stage Identity

| Field | Value |
|---|---|
| Skill | `exploration` |
| Skill version | `1.0.0` |
| stage_id | `exploration` (ordering is owned by the workflow, not this skill) |
| Prompt | [`.claude/prompts/exploration.md`](../../prompts/exploration.md). `prompt_id: exploration`, `prompt_version: 1.0.0` |
| Output structure | [`ExplorationReport.template.md`](ExplorationReport.template.md) |
| Journal event template | [`journal-event.template.json`](journal-event.template.json) |
| Journal schemas | [`journal-event.schema.json`](../../../platform/schemas/journal-event.schema.json) (v1.2.0), [`prompt-record.schema.json`](../../../platform/schemas/prompt-record.schema.json), [`workflow-run.schema.json`](../../../platform/schemas/workflow-run.schema.json) |
| Upstream | `project-context`, which must be approved with `PROJECT_CONTEXT_APPROVED` |
| Downstream | `test-design` (only after approval) |
| Approval key | `EXPLORATION_APPROVED` |
| MCP | **Required:** `playwright` (see [`.mcp.json`](../../../.mcp.json)), for browser access only |

```
APPROVED ProjectContext.md + LIVE APPLICATION
        ↓
   EXPLORATION (Playwright MCP)
        ↓
   EXPECTED vs ACTUAL → MATCH / FINDING / GAP / QUESTION / POTENTIAL BUG
        ↓
   ExplorationReport.md + evidence/
        ↓
   ⛔ HARD STOP → HUMAN REVIEW → EXPLORATION_APPROVED → Test Design
```

## Purpose

Learn how the application **actually behaves** before any test case is written.
Record every place where reality and the approved Project Context agree or
disagree. Test design that skips this step encodes assumptions instead of
behavior.

## Separation of concerns

| Concept | For this stage |
|---|---|
| **Skill** (this file) | *How* exploration is planned, performed, classified, evidenced, validated, gated, revised and journaled. |
| **Prompt** (`.claude/prompts/exploration.md`) | The versioned *instruction*. Recorded by id and version, with the verbatim text in `prompts.json`. |
| **Workflow** (`default-qa-workflow.yaml`) | *When* the stage runs. It requires `PROJECT_CONTEXT_APPROVED` and unlocks `test-design` via `EXPLORATION_APPROVED`. |
| **Journal** (`journal/*.json`) | *What actually happened*: every MCP action, observation, evidence item and gate reply. |
| **Artifacts** | `exploration/ExplorationReport.md` plus evidence files in `exploration/evidence/`. |
| **Playwright MCP** | A browser-access and exploration **tool**. It is **not** the automation framework. |

## Trigger Conditions

Run when a human, or the orchestration layer, asks to explore a **named task**,
or to revise its exploration report. If no task is named, ask. Never guess a task.

## Prerequisites

The skill **must not start** unless all of the following hold. Check them in
this order, **before** any Playwright MCP call:

| # | Prerequisite | Failure |
|---|---|---|
| 1 | `platform/tasks/<task-name>/` exists and is not under `platform/templates/` | `EX-E01` / `EX-E02` |
| 2 | `context/TaskContext.md` exists and its Identity section is filled | `EX-E03` |
| 3 | `prd/PRD.md` exists | `EX-E04` |
| 4 | `context/ProjectContext.md` exists | `EX-E05` |
| 5 | The journal holds a `project-context` `approval_decision` with `approval_outcome: accepted` in the active run | `EX-E06` |
| 6 | That approval is **current**: the current ProjectContext.md SHA-256 equals the post-approval hash in the event, no later `project-context` `stage_execution` exists, and the PRD approval it rests on is still current (PRD hash unchanged, no later `prd-generation` run) | `EX-E07` |
| 7 | `journal/workflow-run.json` → `active_run_id` is non-null. It is owned by orchestration, and this skill never creates it | `EX-E08` |
| 8 | A target is determinable: a UI URL (and an API URL if API behavior is in scope) in TaskContext.md § Project Entry Points or the PRD source register | `EX-E09` |

If any prerequisite fails:

- do not explore,
- do not call Playwright MCP,
- do not create or modify ExplorationReport.md,
- append a `stage_execution` event with `status: blocked`, the error, and
  `mcp_used.used: false` with the reason ("MCP: Not used — blocked by EX-E0x"),
- report and STOP.

## Inputs

| Input | Path | Use |
|---|---|---|
| **Approved Project Context** | `context/ProjectContext.md` | The **expected-behavior baseline**: scope areas `PC SA-###`, out of scope, roles and permissions, `PC BR-###`, `PC EB-###`, dependencies, risks, `PC GAP-###`, `PC OQ-###`, and §12 QA Scope Preparation. |
| PRD | `prd/PRD.md` | Reference only: PRD IDs for traceability, the source register, and entry points. **Not** an expectation source. If the PRD states something ProjectContext omits, that is recorded as a GAP noting the omission. |
| Task identity and entry points | `context/TaskContext.md` | Task ID, name, project, environment, UI and API URLs. |
| Approvals | `journal/execution-log.json` | Prerequisites 5–6. |
| Run context | `journal/workflow-run.json` | `active_run_id`, read only. |
| Live application | The UI/API URLs | **Actual behavior**, via Playwright MCP. |
| Credentials | Task inputs or the human only | See [Credentials](#credentials-and-sensitive-data). |
| Prompt | `.claude/prompts/exploration.md` | Loaded, hashed and recorded. |
| Previous report | `exploration/ExplorationReport.md` | On revisions only. |

## Outputs

| Kind | Path | Notes |
|---|---|---|
| **Artifact** | `exploration/ExplorationReport.md` | Exactly one report. Created on the first attempt and updated in place on revisions. |
| **Evidence** | `exploration/evidence/EVD-###-<slug>.<ext>` | Screenshots, snapshot text, attribute dumps, network or console output. |
| Journal | `journal/execution-log.json`, `journal/prompts.json` | Events and the prompt snapshot. |

Nothing else is created or modified. The skill never touches ProjectContext.md,
PRD.md, TaskContext.md, `workflow-run.json`, `platform/templates/`, or any file
outside the task folder. The one exception is moving its own MCP output files
out of `.playwright-mcp/`.

## Tooling

- **Playwright MCP (`playwright` server)** is used for **all** browser access. It
  is a **browser-access and exploration tool**, not the automation framework.
  Nothing done here becomes automation code, and no Playwright locator syntax is
  carried forward.
- Typical MCP tools are listed below. Names depend on the server version, and the
  exact names used are recorded in the journal. Each is used for exploration only:

  | Tool | Purpose |
  |---|---|
  | navigate / navigate_back | open the application and move between pages |
  | snapshot | accessibility snapshot |
  | click / type / fill_form / select_option / press_key / hover | interact with in-scope UI |
  | take_screenshot | screenshot evidence |
  | wait_for | wait for observable states |
  | evaluate | **read-only** attribute inspection |
  | network_requests / console_messages | observe traffic and errors |
  | tabs / close | manage tabs and end the session |
- Local file tools are used to write the report, move and hash evidence, and
  append to the journal.
- Shell HTTP requests (e.g. `curl`) are used only for in-scope API exploration
  under the [API rules](#api-exploration-rules), and every call is recorded.
- **Never:** write, generate or save automation code of any kind (Playwright
  test code, Selenium, SHAFT, TestNG, Java), code generation or recording
  features, or scripts that alter page state.

## Responsibilities

The Explorer inspects, where applicable to the in-scope areas:

- **Fields**: field type, required or optional state, format, limits,
  defaults, visible behavior, validation behavior.
- **Dropdowns**: actual option sets, ordering, default and empty state, and
  whether options are static or dynamically loaded, where observable.
- **Validations**: when they fire (on input, blur, submit), the **exact**
  message text, client-side vs server-side where observable, behavior after
  invalid input, behavior after correction.
- **Dependencies**: fields or sections that change, appear, disappear, enable or
  disable based on other values, and what triggers the change. Also dependencies
  between screens.
- **Workflows**: the actual end-to-end path, states, transitions, navigation,
  success behavior, failure behavior.
- **Relevant APIs**: only when API behavior is explicitly in scope, or needed to
  understand an in-scope UI flow.

It also:

- compares **every** observation against the ProjectContext expectation,
- records what was **actually observed**, not what was expected to be observed,
- captures evidence for everything that is not a plain MATCH,
- records candidate locators for the automation stage without writing
  automation code,
- **never invents requirements** to explain a behavior. Undocumented behavior is
  a GAP, not a discovered rule.

## Non-Responsibilities

This stage never does any of the following:

- Design, draft, sketch or prepare test cases or test suites. That belongs to
  Test Design, which is behind this gate.
- Write automation or locator code, or generate or save Playwright tests.
- Execute tests, or create formal or confirmed bug reports.
- Upgrade a POTENTIAL BUG to a confirmed bug.
- Modify ProjectContext.md or PRD.md, whether to hide findings, "fix"
  expectations, or record new rules.
- Resolve ProjectContext gaps or open questions. It records observations about
  them.
- Explore without scope, or perform load, stress, penetration or security attack
  testing. It never bypasses authentication or authorization.
- Continue to Test Design or automation. It never creates a `workflow_run_id`.

## Source-of-Truth Rules

| | Source | Role |
|---|---|---|
| **Expected** | Approved `ProjectContext.md` | Documented behavior |
| **Actual** | Live application, via Playwright MCP | Observed behavior |

- Don't assume the application is correct, and don't assume the documentation is
  correct. Record the difference.
- Never rewrite ProjectContext to match the application.
- Never convert an observation into a business rule or requirement.
- If behavior is undocumented, record a **GAP** when it is simply undocumented,
  or a **QUESTION** when a human or business decision is needed to judge it.

## Exploration Strategy

Exploration is **scope-driven**:

```
ProjectContext → §12 areas requiring exploration → exploration plan → actual exploration
```

1. **Plan first, before any MCP call.** For each ProjectContext §12 area and each
   in-scope `PC SA-###`, list:
   - the expectations to compare (`PC EB-###`, `PC BR-###`),
   - the relevant ProjectContext gaps or questions (`PC GAP-###`, `PC OQ-###`),
   - the UI or API flow to follow,
   - the data needed.

   The plan becomes report §2.
2. **For each planned area:**
   1. identify the expected behavior,
   2. identify the flow,
   3. explore it,
   4. record the actual behavior,
   5. compare expected with actual,
   6. classify,
   7. capture evidence when required.
3. **Log every MCP call** as it happens: sequence, tool, action, target, area,
   data-changing flag, result and system timestamp. This becomes the event's
   `mcp_actions`.
4. **End the session.** Close the browser, record the end time, and write the
   report.

## Scope Control

- Explore only areas that are in scope in ProjectContext §3 and the §12 areas.
- Out-of-scope areas are **not** explored. They are listed in §2 as
  intentionally not explored, with the reason.
- **Dependency exception:** an out-of-scope area may be entered only when it
  must be followed to understand an in-scope flow (e.g. a prerequisite screen).
  Record it in §2 "followed as dependencies" and in the journal's
  `coverage.out_of_scope_followed` and `decisions`, with the reason. Explore it
  only as far as the in-scope flow requires.
- Random or exhaustive clicking is forbidden.

## Expected vs Actual Rules

Every comparison keeps exactly this shape:

```
Expected:       <documented expectation from ProjectContext>
Actual:         <observed application behavior>
Classification: MATCH | FINDING | GAP | QUESTION | POTENTIAL BUG
Evidence:       EVD-### | "not required — MATCH" | "not captured — <reason>"
Source:         PC EB-### / PC BR-### / PC SA-### | "none — ProjectContext silent"
```

- **Never** write actual behavior into Expected, and **never** write an
  expectation into Actual.
- If ProjectContext is silent, Expected is exactly
  `Not documented (ProjectContext silent)`.
- Actual records what was seen: exact message text, exact option lists, the exact
  URL reached. Interpretation does not go in Actual.

## Observation Model

Every meaningful observation has:

- `OBS-###` ID
- Area (`PC SA-###`)
- Expected
- Actual
- Classification
- Evidence reference(s)
- Source reference(s)
- Notes

Each non-MATCH observation also gets a class item in its report section:
`FND-###` (§7), `XGAP-###` (§8), `XQ-###` (§9) or `PB-###` (§10). The
`X` prefix keeps exploration GAP and QUESTION IDs distinct from ProjectContext's
`GAP-###` / `OQ-###`.

## Observation Classification

Every observation gets **exactly one** label:

| Label | Meaning |
|---|---|
| **MATCH** | Actual behavior matches the documented expected behavior in ProjectContext. |
| **FINDING** | Actual behavior differs from the documented expected behavior. |
| **GAP** | The expected behavior is missing or undocumented in ProjectContext. |
| **QUESTION** | Human or business clarification is required before the behavior can be judged. |
| **POTENTIAL BUG** | The behavior appears incorrect, but needs confirmation before being called a defect. |

### Classification rules

Apply these checks in order. The first one that applies decides the label:

1. **POTENTIAL BUG**: objective malfunction signals, whether documented or not.
   Examples: an unhandled error, crash, HTTP 5xx, broken or blank page, lost or
   corrupted data, or exposure of sensitive data. It is still only *potential*.
2. **MATCH / FINDING**: a clear documented expectation exists. If it equals the
   actual behavior, the label is MATCH. If it differs, the label is FINDING. A
   difference from documented behavior is a **FINDING, not automatically a
   bug**, because the documentation may be the thing that is wrong.
3. **QUESTION**: the expectation exists but is ambiguous or contradictory, or
   judging the behavior requires a human or business decision.
4. **GAP**: ProjectContext is silent. Resist deciding what "should" happen.

- Never upgrade a POTENTIAL BUG to a confirmed defect. Confirmation is a human
  decision, and formal bug reporting belongs to a later stage.
- Observed behavior related to a ProjectContext GAP or OQ is recorded as
  `XGAP` or `XQ`, cross-referencing the `PC GAP-###` / `PC OQ-###`. It never
  resolves them.

Example:

```
Expected:       User must provide a valid email address.            (PC BR-004)
Actual:         Application accepts "abc@" and saves the record.
Classification: FINDING   (FND-003 / OBS-011)
Evidence:       EVD-011 (screenshot), EVD-012 (element attributes)
```

## Evidence Rules

- Evidence is **mandatory for every non-MATCH** observation, and optional for a
  MATCH.
- **Types:**
  - `screenshot`
  - `accessibility_snapshot`
  - `element_attributes`
  - `url`
  - `page_title`
  - `network`
  - `api_response`
  - `console`
  - `browser_state`
  - `other`
- **Every evidence item** records:
  - `EVD-###`
  - type
  - capture status
  - source action (the `mcp_actions` seq)
  - related observation(s)
  - file path
  - original tool path, if moved
  - SHA-256
  - timestamp from the real system or tool (`null` if unavailable)
  - redactions
  - notes
- **Storage:** `exploration/evidence/EVD-###-<slug>.<ext>`. Files the MCP server
  wrote to `.playwright-mcp/` are **moved** into the task, and the original path
  is recorded. Text evidence such as snapshots, attributes, network or console
  output is saved **verbatim** from the tool result. Only secrets are redacted,
  and each redaction is marked `[REDACTED: <kind>]`.
- **Not capturable:** record an evidence item with
  `capture_status: not_captured` and the actual reason. The observation cites it.
- **Never fabricate** evidence, timestamps or hashes. Never edit evidence content
  beyond marked redaction. Never delete evidence referenced by an earlier journal
  event.

## Candidate Locator Rules

Record candidate locators for relevant elements, for the automation stage
(Selenium + SHAFT + Java + TestNG, with an ID/XPath preference):

| Field | Content |
|---|---|
| `LOC-###` | ID |
| Element | Plain description, and the page or URL |
| Stable `id` | Observed `id` attribute value, or `none` |
| Attribute usable in XPath | Observed attribute name and value (e.g. `name="email"`, `data-test="save"`, `aria-label="Search"`) |
| Locator notes | Uniqueness on the page, visible label |
| Stability observations | E.g. id looks generated or dynamic, changed between reloads, position-dependent, text is localized |
| Related | `OBS-###`, `EVD-###` (attribute evidence) |

Candidate locators are **observations, not automation code**. Never record:

- Selenium, SHAFT, TestNG or Java code,
- Playwright test code,
- Playwright locator syntax (`getByRole`, `getByText`, `getByLabel`,
  `getByTestId`),
- Playwright MCP snapshot refs (e.g. `ref=e12`). These are session-scoped and
  meaningless later.

Attribute values come from read-only inspection (a snapshot or a read-only
`evaluate`) and are saved as `element_attributes` evidence. The automation stage
decides the implementation.

## UI Exploration Rules

- Begin at the application URL from the inputs. Record the URL and page title of
  every page reached (`coverage.pages_visited`).
- Take an accessibility snapshot before interacting with a new page or state.
  Take screenshots for visual evidence of non-MATCH states.
- Enter values only to observe behavior (validation, limits, dependencies). Record
  the value *category* used, e.g. "empty", "256-char string", "invalid email
  format". Exploration inputs are not test data or test cases.
- Record validation messages **verbatim**, including when they appear and when
  they clear.
- Read-only `evaluate` is allowed for attributes and properties. Scripts that
  change the DOM, bypass validation, or trigger actions a user could not perform
  are forbidden.
- **Data-changing actions** (create, update, delete, persisting submit):
  - Perform them only when needed to observe an in-scope flow, and mark them
    `data_changing: true`.
  - **Destructive, irreversible or bulk actions, and any action on data not
    created during this exploration, require explicit human confirmation first**
    (`human_confirmed: true`). Without confirmation, the action is not performed.
    It is recorded as `result: blocked` and listed in §13 Coverage Limits.
  - List all data changes in §13 "Data changed during exploration".

## Workflow Exploration Rules

- Follow the documented flow end-to-end where reachable. Record each state,
  transition, navigation target, and success and failure outcome as observed.
- Explore the failure paths ProjectContext documents or clearly implies (e.g.
  invalid input on a documented validation rule). Undocumented branches found
  along the way become GAP or QUESTION observations. They are not expanded into
  a full exploration of their own.
- If a flow cannot be completed (missing data, missing permission, environment
  error), record where it stopped and why, as a Coverage Limit plus an
  observation where appropriate.

## API Exploration Rules

Apply these only when API behavior is explicitly in scope, or needed to
understand an in-scope UI flow.

1. **Prefer passive observation.** Use the network requests produced by
   in-scope UI actions (MCP network tool).
2. **Direct requests** go only to entry points or endpoints named in
   ProjectContext or PRD, or observed in in-scope traffic.
   - They are read-only (GET) by default.
   - Any data-changing request follows the data-changing rules above.
   - No endpoint enumeration, fuzzing or brute force.
   - Each request is recorded in `tools_used` (e.g. shell `curl`) or in
     `mcp_actions`.
3. **Recording.** Record method, URL, status, relevant headers and body excerpts
   as `network` / `api_response` evidence. Redact tokens, cookies and
   credentials.
4. **Observed ≠ contract.** Observed API behavior is recorded as observation and
   evidence. It never becomes a documented API contract or requirement.
   Undocumented API behavior is a GAP.

## Credentials and Sensitive Data

- Use only credentials supplied by the task inputs or by the human.
- If the application itself displays credentials, record that as an observation
  and **ask** before using them.
- Never write passwords, tokens, session cookies or personal data into the
  report or journal. Reference their source instead (e.g. "credentials supplied
  by the human, journal EVT-0007").

## Validation Rules (self-checks before presenting)

| Check | Rule |
|---|---|
| EX-V01 | All prerequisites were verified before the first MCP call. |
| EX-V02 | All 14 report sections are present, in order. Empty sections state "None observed." |
| EX-V03 | Every observation has an ID, area, Expected, Actual, exactly one classification, evidence (or a MATCH or not-captured reason), and a source (or "none — ProjectContext silent"). |
| EX-V04 | No Expected field contains observed behavior, and no Actual field contains an expectation. |
| EX-V05 | Classifications follow the ordered rules. Counts in §14 equal the §5 rows and the per-section lists. |
| EX-V06 | Every non-MATCH observation references at least one `EVD-###`. Each captured evidence file exists in `exploration/evidence/` with a recorded SHA-256. |
| EX-V07 | No requirement, business rule or expectation was invented. Undocumented behavior is a GAP or QUESTION. |
| EX-V08 | No POTENTIAL BUG is presented as confirmed, and no bug report was created. |
| EX-V09 | No test cases, automation code, Playwright locator syntax or MCP refs appear in the report. |
| EX-V10 | Every area explored is in scope, or listed as a dependency followed with its reason. Everything not explored is in §2 or §13. |
| EX-V11 | Data-changing actions are logged, and destructive or irreversible ones have human confirmation. |
| EX-V12 | No secrets appear in the report, evidence text or journal. |
| EX-V13 | ProjectContext.md and PRD.md are unchanged (hashes equal the input hashes). |
| EX-V14 | Exactly one report exists at `exploration/ExplorationReport.md`, with no `-v2` or `-final` copies. |
| EX-G01 | (gate) The reply is exactly `EXPLORATION_APPROVED`, standalone. |

If a check fails because of the report, correct the report and record the
correction in `fixes`. If it fails because the exploration was incomplete,
record the limitation in §13. Never pass a check by fabricating content.

## Failure Conditions

| Code | Condition | Status | MCP |
|---|---|---|---|
| EX-E01 | Task folder missing (never create it) | blocked | not used |
| EX-E02 | Target resolves into `platform/templates/` | blocked | not used |
| EX-E03 | TaskContext.md missing or Identity unfilled | blocked | not used |
| EX-E04 | PRD.md missing | blocked | not used |
| EX-E05 | ProjectContext.md missing | blocked | not used |
| EX-E06 | ProjectContext not approved with `PROJECT_CONTEXT_APPROVED` in the active run | blocked | not used |
| EX-E07 | ProjectContext or PRD approval stale | blocked | not used |
| EX-E08 | No active workflow run (the event carries `workflow_run_id: null`) | blocked | not used |
| EX-E09 | No determinable target URL | blocked | not used |
| EX-E10 | Prompt file missing, or `prompt_id`/`prompt_version` unreadable | blocked | not used |
| EX-E11 | Same `prompt_id`/`prompt_version` recorded with a different SHA-256 | blocked | not used |
| EX-E12 | Journal file missing or invalid JSON. Nothing is recreated silently. If the report was already written, state that the run is **not journaled** | blocked / failed | — |
| EX-E13 | Playwright MCP server unavailable or not responding | failed | attempted, recorded |
| EX-E14 | Application unreachable at start (navigation error or timeout) | failed | used, with evidence of the failure |
| EX-E15 | `ExplorationReport.md` exists without a journaled `exploration` origin (never overwritten) | blocked | not used |

For a **blocked** or **failed** stage, no ExplorationReport.md is created or
modified. For EX-E13 and EX-E14, the MCP actions attempted and any evidence of the
failure are still journaled. If the application becomes unavailable **during**
exploration, the stage completes the report with what was observed and records
the interruption in §13 Coverage Limits and `errors`. That is not a failure.

## Revision Behavior

When the reviewer requests changes:

1. Append a `revision_request` event with the verbatim request.
2. Update the **same** `ExplorationReport.md`. Never create
   `ExplorationReport-v2.md`, `-final`, or any copy.
3. Bump the report's minor version (1.0.0 → 1.1.0), add a Revision History row
   (reason, changed sections, re-exploration yes or no), and reset Status to Draft.
4. **Re-explore only what the revision requires.** Re-check prerequisites
   (including approval currency) before any MCP call. Capture new evidence with
   new `EVD-###` IDs, and keep earlier evidence files.
5. **Stable IDs.** Changed observations keep their ID. A withdrawn observation is
   marked `withdrawn (vX.Y.Z)`, and its ID is never reused.
6. **Reviewer clarifications:** a reviewer's answer may change a classification
   (e.g. a QUESTION becomes a MATCH or FINDING). Cite it as
   `Reviewer clarification (journal EVT-NNNN)`. If it changes the documented
   expectation, the report recommends a ProjectContext revision. The skill never
   edits ProjectContext.
7. If the prompt version changed since the previous attempt, register it and set
   `revision.prompt_version_changed: true`.
8. Append a `stage_execution` event with the `revision` object (versions, reason,
   changed sections, request event, prompt change) and the new MCP actions,
   observations and evidence.
9. Present the revision and **STOP again**. `EXPLORATION_APPROVED` is required
   again.

**Changing an approved report voids its approval.** Status returns to Draft, a
new version and attempt are recorded, and the key is required again.

## Hard-Stop Behavior

After ExplorationReport.md is produced (initial or revised):

- **STOP.** Present the matches, findings, gaps, questions, potential bugs,
  candidate locator count and coverage limits for human review.
- Do not:
  - generate or design test cases,
  - write automation,
  - execute tests,
  - create bug reports,
  - modify ProjectContext to hide findings,
  - continue to Test Design or automation.
- The gate is unconditional.

## Approval Gate

- The only valid progression key is the **exact, case-sensitive, standalone**
  value:

  ```
  EXPLORATION_APPROVED
  ```

- **Not valid:**
  - `approved`, `looks good`, `continue`, `proceed`, `LGTM`
  - `EXPLORATION_APPROVED please continue`
  - any message containing the key with additional text
  - silence
  - another stage's key

  Each of these is journaled as an `approval_decision` with
  `approval_outcome: not_accepted`, and the stage stays stopped. If the message
  also contains a change request, it proceeds to revision.
- **When accepted:**
  - set the report Status to `Approved`, with the version unchanged,
  - append an `approval_decision` (`accepted`, `next_stage.unlocked: true`) with
    the report's **post-update SHA-256**, which downstream stages use to detect a
    stale approval,
  - report that `test-design` is unlocked.

  **Test Design is not started** unless the orchestration layer explicitly starts
  it.

## Journal Integration

Use the existing journal only:

- `journal/execution-log.json` (events, schema v1.2.0)
- `journal/prompts.json` (prompt records)

The stage's constant values are in
[`journal-event.template.json`](journal-event.template.json).

| Moment | Event type | Status |
|---|---|---|
| Prerequisite not met | `stage_execution` | `blocked` |
| Exploration completed, report written (each attempt) | `stage_execution` | `awaiting_approval` |
| MCP unavailable or application unreachable at start | `stage_execution` | `failed` |
| Change requested | `revision_request` | `revision_requested` |
| Reply is the key | `approval_decision` | `approved` |
| Reply is not the key | `approval_decision` | `approval_not_accepted` |

Field rules for `stage_execution`:

- **Identity:**
  - `event_id` / `step_number` are the next in sequence.
  - `attempt` counts this stage's executions within the run.
  - `workflow_run_id` is **read** from `workflow-run.json` → `active_run_id`,
    never created. It is `null` only on EX-E08.
  - Also record `task_id` and `timestamp` (system clock, UTC), plus the stage
    and skill identity and versions.
- **Prompt:**
  - `prompt_id` / `prompt_version` reference `prompts.json`.
  - On first use in the task, append the verbatim prompt, its SHA-256,
    `captured_at` and `first_used_by_event_id`.
  - Later events reference it without duplicating the text.
  - `prompt_variables` records `task_name`, `task_path`, `workflow_run_id`,
    `ui_url` and `api_url`.
- **`trigger`**: the reason and the verbatim user message.
- **`input_references`**:
  - ProjectContext.md (`upstream_artifact`, SHA-256)
  - its approval (`upstream_approval`, `journal:EVT-NNNN`)
  - PRD.md (`task_prd`) and its approval (`upstream_approval`)
  - TaskContext.md (`task_metadata`)
  - each URL (`project_url`, accessed / inaccessible)
  - the prompt
  - on revisions, the previous report and the change request
- **`source_references`**: ProjectContext and PRD sections and IDs cited by the
  report.
- **`tools_used`**: local file, hash and shell tools, and any shell HTTP request,
  each with purpose and targets.
- **`mcp_used`**:
  - When exploration ran: `{ used: true, servers: [{ server: "playwright", version, tools: [<exact tool names used>], purpose: "browser access for exploration" }], intentionally_not_used: [] }`.
    The HTML journal shows this as **MCP: Playwright**.
  - When blocked: `{ used: false, servers: [], intentionally_not_used: [{ server: "playwright", reason: "<actual reason, e.g. blocked by EX-E06>" }] }`.
    The HTML journal shows this as **MCP: Not used — <reason>**.
- **`mcp_actions`**: every MCP call actually performed, in order:
  - `seq`, `tool`, and a plain-language `action` (e.g. "browser opened", "URL
    visited", "form submitted", "validation observed", "screenshot captured",
    "accessibility snapshot captured"),
  - `target`, `area`, `data_changing`, `human_confirmed`, `result`, `timestamp`,
  - linked `observations` and `evidence_ids`.

  It is never fabricated, reordered or summarized away.
- **`actions`**: stage-level steps (prerequisites verified, plan built, session
  started or closed, report written, evidence moved and hashed).
- **`decisions`**: scope decisions, dependencies followed, classification
  judgment calls, and human confirmations requested.
- **`observations`**: an ID/area/classification/summary/sources/evidence/report
  reference copy of every report observation.
- **`classifications`**: counts per label.
- **`evidence`**: every `EVD-###` item, captured or not captured with a reason.
- **`candidate_locators`**: a `LOC-###` summary.
- **`coverage`**:
  - areas and flows explored,
  - pages visited,
  - out-of-scope areas followed,
  - areas not explored, with reasons,
  - limits,
  - start and end times.
- **`output_artifacts`**: the report (created or updated, status, version,
  SHA-256, counts) and evidence files.
- **`assumptions`**: any assumptions made during exploration.
- **`gaps`** / **`open_questions`**: XGAP and XQ copies (owner `null` unless
  stated).
- **`validation.checks`**: EX-V01…V14 with their real results.
- **Gate fields:**
  - `status`
  - `stop_reason`
  - `approval_required: true`
  - `approval_key: "EXPLORATION_APPROVED"`
  - `approval_outcome` (`null` except on `approval_decision`)
  - `next_stage` (`test-design`, unlocked only after an accepted approval)
- **Also recorded:** `errors`, `fixes`, `revision` (`null` on attempt 1) and
  `notes`.
- **Never fabricate** runtime values. If a value is unavailable, use `null` and
  explain it in `notes`.

## Traceability

The chain is maintained end-to-end, and every link uses a real ID:

```
ProjectContext (PC SA-###)
   ↓
Expected Behavior / Business Rule (PC EB-### / PC BR-###)   ← traced to PRD FR-### by ProjectContext §11
   ↓
Exploration Observation (OBS-###)
   ↓
Classification (MATCH | FND-### | XGAP-### | XQ-### | PB-###)
   ↓
Evidence (EVD-###) → evidence file → ExplorationReport.md section
```

- Upstream IDs are always qualified (`PC BR-001`, `PRD FR-003`). Never fabricate,
  renumber or reuse an ID.
- An observation with no ProjectContext source is allowed only as a GAP or
  QUESTION, with `Source: none — ProjectContext silent`.
- Every `PC EB` and `PC BR` listed in the §2 plan either has at least one
  observation or appears in §13 Coverage Limits with the reason it was not
  observed.
- Candidate locators and discovered dependencies reference the observations and
  evidence they came from.

## HTML Journal Observability

The future interactive HTML journal must be able to show all of the following
for this stage from the journal and the artifacts, without rerunning anything:

| # | What the HTML shows | Where it comes from |
|---|---|---|
| 1 | Why the stage ran | `trigger.reason` |
| 2 | The user's triggering message | `trigger.user_message` |
| 3 | The exact prompt version used | `prompt_id`/`prompt_version` → `prompts.json` content |
| 4 | The input ProjectContext | `input_references` (path, hash, approval event) |
| 5 | The PRD reference | `input_references` (`task_prd`, approval) |
| 6 | workflow_run_id | `workflow_run_id` |
| 7 | Playwright MCP usage | `mcp_used` (MCP: Playwright, or Not used plus reason) |
| 8 | Browser actions performed | `mcp_actions[]` (ordered) |
| 9 | Pages and flows explored | `coverage` |
| 10–14 | Observations, expected, actual, classification, evidence | `observations[]` → `report_ref` (report §5) → `evidence[]` → files |
| 15 | Candidate locators | `candidate_locators[]` → report §11 |
| 16–19 | Findings, gaps, questions, potential bugs | `observations[]` filtered by class, `gaps`, `open_questions`, report §7–§10 |
| 20 | Coverage limitations | `coverage.not_explored`, `coverage.limits`, report §13 |
| 21 | Validation results | `validation.checks` |
| 22 | Why the stage stopped | `stop_reason`, `status` |
| 23 | Required approval key | `approval_key` |
| 24 | Approval result | `approval_decision` events → `approval_outcome` |
| 25 | Revisions and re-exploration | `revision_request` events, `revision`, new `mcp_actions` and `evidence` per attempt |
| 26 | Errors and fixes | `errors`, `fixes` |

Navigation path: **Observation (OBS) → Classification → Evidence (EVD → file) →
Report section**, grouped by attempt so the revision history reads as a sequence
of events.
