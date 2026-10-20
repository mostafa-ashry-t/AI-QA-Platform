---
name: test-design
description: "Test Design stage of the AI QA Platform. Designs comprehensive, traceable, executable test cases from the task's APPROVED ProjectContext.md and APPROVED ExplorationReport.md by systematically selecting and applying equivalence partitioning, boundary value analysis, decision tables, state transition, pairwise, and (supplementary) error guessing. Produces platform/tasks/<task-name>/test-design/TestCases.md, containing test cases with a single expected result each, a traceability matrix, technique rationale, exploratory cases, open questions, coverage gaps, test data requirements and a coverage summary. Never invents expected results. Design only: no browser, no Playwright MCP, no execution, no automation, no bugs. Then HARD STOPS until the exact standalone key TEST_DESIGN_APPROVED. Use when asked to \"design test cases\", \"write test cases for this task\", \"what cases cover this\", or \"revise the test cases\"."
---

# Test Design

## Stage Identity

| Field | Value |
|---|---|
| Skill | `test-design` |
| Skill version | `1.0.1` |
| stage_id | `test-design` (ordering is owned by the workflow, not this skill) |
| Prompt | [`.claude/prompts/test-design.md`](../../prompts/test-design.md). `prompt_id: test-design`, `prompt_version: 1.0.0` |
| Output structure | [`TestCases.template.md`](TestCases.template.md) |
| Journal event template | [`journal-event.template.json`](journal-event.template.json) |
| Journal schemas | [`journal-event.schema.json`](../../../platform/schemas/journal-event.schema.json) (v1.3.0), [`prompt-record.schema.json`](../../../platform/schemas/prompt-record.schema.json), [`workflow-run.schema.json`](../../../platform/schemas/workflow-run.schema.json) |
| Upstream | `exploration` (`EXPLORATION_APPROVED`), which rests on `project-context` (`PROJECT_CONTEXT_APPROVED`) |
| Downstream | `test-review` (mandatory, ADR-001), which gates `manual-execution` and `automation-generation` |
| Approval key | `TEST_DESIGN_APPROVED` |
| MCP | **Not used.** Playwright MCP is never called. |

```
APPROVED ProjectContext.md + APPROVED ExplorationReport.md
        ↓
   TEST DESIGN (technique selection → application → coverage verification)
        ↓
   TestCases.md = test cases + traceability + technique rationale + exploratory cases
                  + open questions + coverage gaps + test data requirements + coverage summary
        ↓
   ⛔ HARD STOP → HUMAN REVIEW → TEST_DESIGN_APPROVED → Test Review (mandatory) → Manual Execution / Automation Generation
```

## Purpose

Turn approved documented scope and approved observed behavior into concrete,
executable test cases. Use recognized design techniques rather than intuition,
so coverage is **defensible** and the gaps are **visible rather than
accidental**.

This is a **design** stage. It does not execute tests, open a browser, use
Playwright MCP, generate automation code, or create bug reports.

## Separation of concerns

| Concept | For this stage |
|---|---|
| **Skill** (this file) | *How* cases are designed, traced, validated, gated, revised and journaled. |
| **Prompt** (`.claude/prompts/test-design.md`) | The versioned *instruction*. Recorded by id and version, with the verbatim text in `prompts.json`. |
| **Workflow** (`default-qa-workflow.yaml`) | *When* the stage runs. It requires `EXPLORATION_APPROVED`, and `TEST_DESIGN_APPROVED` unlocks the mandatory `test-review` stage, never execution directly (ADR-001). |
| **Journal** (`journal/*.json`) | *What actually happened*: techniques, cases, traceability, coverage, gaps, gate replies. |
| **Artifact** (`test-design/TestCases.md`) | *What was produced*. This is the only artifact. |

## Trigger Conditions

Run when a human, or the orchestration layer, asks to design or revise test
cases for a **named task**. If no task is named, ask. Never guess a task.

## Prerequisites

Check all of these, in order, before designing anything:

| # | Prerequisite | Failure |
|---|---|---|
| 1 | `platform/tasks/<task-name>/` exists and is not under `platform/templates/` | `TD-E01` / `TD-E02` |
| 2 | `context/TaskContext.md` exists | `TD-E03` |
| 3 | `prd/PRD.md` exists, and its `PRD_APPROVED` is still current | `TD-E04` |
| 4 | `context/ProjectContext.md` exists | `TD-E05` |
| 5 | A `project-context` `approval_decision` with `approval_outcome: accepted` exists in the active run | `TD-E06` |
| 6 | **ProjectContext approval is current**: the current file's SHA-256 equals the post-approval hash, and no later `project-context` `stage_execution` exists | `TD-E07` |
| 7 | `exploration/ExplorationReport.md` exists | `TD-E08` |
| 8 | An `exploration` `approval_decision` with `approval_outcome: accepted` exists in the active run | `TD-E09` |
| 9 | **Exploration approval is current**: the current report's SHA-256 equals the post-approval hash, and no later `exploration` `stage_execution` exists | `TD-E10` |
| 10 | **The approved exploration matches the current approved ProjectContext**: the `exploration` `stage_execution` that produced the approved report version recorded, in `input_references` (`upstream_artifact`), a ProjectContext SHA-256 equal to the current approved ProjectContext hash | `TD-E11` |
| 11 | `journal/workflow-run.json` → `active_run_id` is non-null. It is owned by orchestration, and this skill never creates it | `TD-E12` |

If any prerequisite fails:

- do not generate TestCases.md or any test case,
- do not use Playwright MCP,
- append a `stage_execution` event with `status: blocked` (MCP not used, with
  the reason),
- report and STOP.

## Inputs

| Input | Path | Use |
|---|---|---|
| **Approved ProjectContext** | `context/ProjectContext.md` | **Documented** scope and business rules: `PC SA`, `PC BR`, `PC EB`, `PC DEP`, `PC RK`, `PC AS`, `PC GAP`, `PC OQ`, roles, out of scope |
| **Approved ExplorationReport** | `exploration/ExplorationReport.md` | **Observed** behavior: `OBS`, `FND`, `XGAP`, `XQ`, `PB`, `XDEP`, `EVD`, coverage limits (§13) |
| TaskContext.md | `context/TaskContext.md` § Identity | **Identity only** |
| PRD | `prd/PRD.md` | `PRD FR-###` etc., only where traceability requires them |
| Constraints | Inputs or the human's request | Environment, available test data, roles available for testing |
| Approvals | `journal/execution-log.json` | Prerequisites 3, 5–10 |
| Run context | `journal/workflow-run.json` | `active_run_id`, read only |
| Prompt | `.claude/prompts/test-design.md` | Loaded, hashed and recorded |
| Previous artifact | `test-design/TestCases.md` | On revisions only |

Candidate locators in the ExplorationReport are **not** used here. They belong
to automation.

## Outputs

| Kind | Path | Notes |
|---|---|---|
| **Artifact** (exactly one) | `test-design/TestCases.md` | Created on attempt 1, replacing the template placeholder, and updated in place on revisions. |
| Journal | `journal/execution-log.json`, `journal/prompts.json` | Events and the prompt snapshot. |

**Template placeholder:** a task copied from the template contains
`test-design/TestCases.md` with the marker
`<!-- AI-QA-PLATFORM:PLACEHOLDER test-design/TestCases.md -->`. A file carrying
that marker is treated as **absent**. It is replaced, and the journal records
`operation: created`. A `TestCases.md` without the marker and without a journaled
`test-design` origin is never overwritten (`TD-E15`).

Nothing else is created or modified.

## Responsibilities

- Select and apply appropriate design techniques per behavior:
  - equivalence partitioning
  - boundary value analysis
  - decision tables
  - state transition
  - pairwise combination
  - error guessing (supplementary)
- Cover, where applicable:
  - **Positive**: the intended path succeeds.
  - **Negative**: invalid input and misuse are rejected correctly.
  - **Boundary**: at, just inside, and just outside every limit.
  - **Validation**: each field rule, including the exact message where it is
    established.
  - **Business Rules**: each ProjectContext rule, individually.
  - **Dependencies**: dependent fields, sections, and cross-module effects.
  - **Error handling**: failure paths, timeouts, rejected submissions.
  - **Exploratory**: areas flagged as GAP where behavior is undocumented.
  - **End-to-end**: the full realistic workflow, not just isolated fields.
- Write each case with a unique ID, title, type, priority, preconditions, test
  data, ordered steps, and a **single** unambiguous expected result.
- Keep each case independent and repeatable, with no hidden dependency on
  execution order.
- Maintain traceability: every case maps to a ProjectContext rule or an
  Exploration observation, and every rule has at least one covering case or an
  explicit gap.
- **Do not invent expected behavior for undocumented requirements.** Mark the
  case **Exploratory**, or raise an **Open Question**. Never fill in a
  plausible-looking expected result.
- State explicitly what is deliberately not covered, and why.
- Decide **Valid in Scope** and **Needs Automation** for every case, with a
  recorded reason. These flags drive the downstream `manual-execution` and
  `automation-generation` filters (CLAUDE.md principles 7–8).

## Non-Responsibilities

This stage never does any of the following:

- Open a browser, use Playwright MCP, or explore the live application. Missing
  observations become Coverage Gaps or Open Questions, never new exploration.
- Execute test cases or report pass/fail results.
- Generate automation or code: Selenium, SHAFT, TestNG, Java, Playwright tests,
  or scripts.
- Create bug reports, or confirm a POTENTIAL BUG.
- Modify ProjectContext.md, ExplorationReport.md, PRD.md, TaskContext.md,
  `workflow-run.json`, or the template.
- Resolve open questions or gaps on the business's behalf.
- Start Manual Execution or Automation, or create a `workflow_run_id`.

## Source-of-Truth Rules

| Source | Meaning |
|---|---|
| **ProjectContext** | Documented scope and business rules |
| **ExplorationReport** | Observed application behavior |
| **Test Design** | Test coverage derived from both approved sources |

- ExplorationReport **never replaces** ProjectContext.
- Undocumented behavior is **never** a confirmed requirement.
- **Expected results are never invented.** See the next section.

## Expected Result Rules (critical)

An expected result must be supported by one of:

1. **ProjectContext**: a `PC BR` or `PC EB`.
2. **Approved exploration consistent with documentation**: a **MATCH**
   observation may supply the concrete detail of a documented behavior, such as
   the exact validation text or actual option list. It is cited as
   `PC EB-### + OBS-### (MATCH detail)`.
3. **An explicit documented business rule** (e.g. `PRD BR-###` via
   ProjectContext traceability).

Apply these rules by observation class:

| Upstream situation | Expected Result | Case / action |
|---|---|---|
| Documented, and exploration MATCH | Documented expectation, with MATCH detail | Normal case |
| Documented, and exploration **FINDING** | The **documented** expectation, not the observed behavior | Normal case, with Notes: `known FINDING FND-###` |
| Documented, and exploration **POTENTIAL BUG** | Documented expectation | Normal case, with Notes: `PB-### (unconfirmed)` |
| Exploration **GAP** (undocumented) | `Not established by approved requirements.` | **Exploratory**, plus `TQ-###` |
| Exploration **QUESTION** | `Not established by approved requirements.` | **Exploratory** and/or `TQ-###` |
| POTENTIAL BUG with no documented expectation | `Not established by approved requirements.` | **Exploratory**, plus `TQ-###` |
| Nothing supports it (e.g. an error-guessing idea) | `Not established by approved requirements.` | **Exploratory**, plus `TQ-###`, or drop it with a reason |

Example:

```
Observed:  Application accepts an undocumented value.          (OBS-021, XGAP-004)
WRONG      Expected: The application should reject it.
RIGHT      Expected: Not established by approved requirements.
           Type: Exploratory · Open Question TQ-003: Should this value be accepted or rejected?
```

## Test Design Strategy

For **each** in-scope behavior or rule (`PC BR`, `PC EB`, and relevant `OBS`):

1. **Identify** the behavior or rule and its sources.
2. **Select** the appropriate technique(s) using the selection rules below.
3. **Apply** the technique, recording its table in §6.
4. **Explain** why it was selected, as a `TA-###` row.
5. **Generate the minimum defensible set** of cases. Every case must add
   coverage that no other case provides.
6. **Verify coverage**: the source appears in the matrix with cases or a gap.

Techniques are **not applied blindly**. §3 and §6 list each technique not used,
with the reason (e.g. "State Transition: no lifecycle states documented or
observed").

## Technique Selection Rules

| Behavior characteristic | Technique | Record |
|---|---|---|
| Input divisible into logically equivalent classes (valid, invalid, missing, malformed, …) | **Equivalence Partitioning** | Partition, representative value, expected behavior, source. No redundant cases without justification. |
| A documented, or approved-observed, numeric, length, date, quantity or similar **limit** | **Boundary Value Analysis** | Just below, at, just above. Where applicable: min, min+1, max−1, max, max+1. **Only** limits supported by approved sources. |
| Behavior depending on **multiple conditions** | **Decision Table** | Conditions, values, resulting actions, covered combinations, case IDs. Collapse equivalent-outcome combinations, with justification. |
| **Lifecycle / state** behavior (e.g. Draft→Submitted, Pending→Approved or Rejected, Active→Suspended, Booked→Cancelled) | **State Transition** | Valid transitions, plus the invalid transitions that sources establish. **Never invent states or transitions.** |
| Many **independent parameters** with a large combination space | **Pairwise / Combinatorial** | Dimensions, values, strategy, selected combinations, coverage achieved. **Never claim exhaustive coverage.** |
| Experience-based failure risks (missing required data, malformed input, repeated submission, unexpected sequence, timeout, duplicate action, invalid state, stale data) | **Error Guessing** (supplementary only) | Rationale. It never replaces a systematic technique. The expected result still needs an approved source, or the case is Exploratory. |

One behavior may warrant more than one technique (e.g. EP plus BVA on a length
rule). Each application is its own `TA-###`.

## Coverage Rules

- **Coverage types**, where applicable:
  1. Positive
  2. Negative
  3. Boundary
  4. Validation
  5. Business Rule
  6. Dependency
  7. Error Handling
  8. Exploratory
  9. End-to-End

  A type that is not applicable is noted in §3 with the reason.
- **Every applicable `PC BR`** has at least one covering case, **or** an
  explicit `CG-###`. Every `PC EB` likewise.
- **Every Exploration observation is considered.** It appears in §5
  "Exploration observations considered":

  | Class | Must have |
  |---|---|
  | FINDING, POTENTIAL BUG | A covering case, or a `CG-###` |
  | GAP, QUESTION | An Exploratory case and/or a `TQ-###` |
  | MATCH | A covering case, or the reason none is needed (e.g. "navigation only; covered by TC-012 preconditions") |
- Exploration §13 **coverage limits** are carried into §9 Coverage Gaps.
- Dependencies discovered (`XDEP-###`) and documented (`PC DEP-###`) are
  covered by Dependency cases, or listed as gaps.

## Test Case Generation Rules

**Structure** (every case):

| Field | Rule |
|---|---|
| `TC-###` | Stable ID |
| Title | Specific and behavior-oriented |
| Type | One of the 9 types. No other categories. |
| Priority | High / Medium / Low / `Not established`, with its basis |
| Preconditions | Self-contained state setup |
| Test Data | `DATA-###` references |
| Steps | Ordered, executable |
| Expected Result | **One** observable outcome |
| Expected Result Basis | Per the Expected Result Rules |
| Traceability | At least one approved source ID |
| Technique | `TA-###` |
| Valid in Scope | TRUE or FALSE, with a reason |
| Needs Automation | TRUE or FALSE, with a rationale |
| Status | Active / Withdrawn |
| Notes | e.g. known FINDING |

**Rules:**

- **One single unambiguous expected result.** Independent expectations become
  separate cases.
- **Independent, repeatable, executable, deterministic where possible.** Never
  depend on execution order ("after TC-003" is forbidden). Preconditions state
  the required state.
- **Steps use only established UI and flows**: screens, fields, controls and
  paths from ProjectContext or approved exploration. Nothing is invented. If a
  needed step is unknown, the case becomes Exploratory or a gap.
- **Priority** is based on documented business importance, risk (`PC RK`),
  critical-workflow impact, or explicit project context. If there is no basis,
  write `Not established`. Use a project-defined default only if one exists in
  the inputs or the knowledge base. Never invent business priority.
- **Valid in Scope:** TRUE when the case exercises an in-scope `PC SA` and does
  not depend on excluded functionality. FALSE when it depends on out-of-scope
  functionality, an unavailable role, or a documented environment exclusion. Each
  FALSE has a reason and a matching `CG-###`.
- **Needs Automation:** TRUE only when all of these hold:
  - Valid in Scope is TRUE,
  - the expected result is established (not Exploratory),
  - the case is deterministic and repeatable,
  - the case has regression value (e.g. a business rule, validation, critical
    path, or High/Medium priority).

  Otherwise FALSE, with a rationale. **Exploratory cases are always FALSE.** This
  is a design recommendation, reviewed at the gate.
- **IDs:** `TC-001`, `TC-002`, … are stable across revisions. An edited case keeps
  its ID. A removed case stays listed as `Withdrawn (vX.Y.Z — reason)`. IDs are
  never reused or renumbered.

## Traceability Rules

- Every test case traces to **at least one approved source**:
  - a ProjectContext rule or behavior (`PC BR-###`, `PC EB-###`, `PC DEP-###`)
  - an Exploration observation (`OBS-###`, with `FND`, `XGAP`, `XQ` or `PB`
    where relevant)
  - a documented requirement (`PRD FR-###`, via ProjectContext)
- **Reuse upstream IDs exactly.** Qualify ProjectContext and PRD IDs (`PC BR-001`,
  `PRD FR-003`). Exploration IDs are platform-unique and used as-is. **Never
  invent a source ID.**
- **Both directions** are maintained in §5: Source → Test Cases (the matrix, where
  every approved business rule appears) and Test Case → Sources.
- **Uncovered sources** are listed explicitly, each with a reason and a `CG-###`.
- Full chain: `PRD FR → PC BR/EB → OBS → TA → TC → Expected Result Basis → Coverage`.

## Exploratory Case Rules

Exploratory cases are allowed **only** where:

- behavior is undocumented,
- the expected result is not established,
- the Exploration Report identifies a GAP, or
- further investigation is required.

Each exploratory case records:

- the case ID,
- the reason it is exploratory,
- the observed behavior (`OBS-###`),
- what is unknown,
- the question to answer (`TQ-###`),
- the evidence or source references (`EVD-###`, `XGAP-###`).

Its Expected Result is exactly `Not established by approved requirements.`,
Needs Automation is FALSE, and the case is typed `Exploratory`. A GAP is **never**
converted into a guessed expected result.

## Open Question Rules

- Each question (`TQ-###`) records:
  - the related source (`OBS`, `XQ`, `PC OQ`, `PC GAP` or `PC BR`),
  - the related test cases,
  - the **exact ambiguity**,
  - the **required clarification**,
  - the owner (`not stated` unless explicitly given).
- Questions stay **unresolved** until a human or business decision is provided.
  The skill never answers them. Upstream `PC OQ` / `XQ` items that still block
  judgment are carried forward and referenced, not duplicated silently.

## Coverage Gap Rules

Explicitly document, as `CG-###`:

- uncovered business rules and uncovered observations,
- inaccessible functionality,
- missing test data and unavailable roles,
- environment limitations,
- intentionally excluded areas.

Each gap records its category, reason, impact (if known), dependency or blocker,
and whether follow-up is required. **Missing coverage is never hidden.** Every
FALSE `Valid in Scope` and every uncovered source has a gap.

## Test Data Rules

- Each `DATA-###` requirement records:
  - the data required,
  - its category (user, role, date, numeric range, account state, dependent
    record, or other),
  - the cases that use it,
  - how it is provided (source),
  - notes.
- **Never** include real credentials, secrets or personal data. If credentials
  are required, reference the configured test-data source (e.g. "credentials
  supplied by the human / environment test-data store named in TaskContext").
  Never write the value.
- Representative EP and BVA values are design values derived from approved
  limits. Synthetic identifiers use reserved domains (`example.com`, `.test`).
- Data the environment must already contain (dependent records, account states)
  is stated as a precondition requirement. Missing data becomes a `CG-###`.

## Validation Rules (self-checks before presenting)

| Check | Rule |
|---|---|
| TD-V01 | All prerequisites (1–11) were verified before any design work. |
| TD-V02 | All 11 sections are present, in order. Empty sections say "None." |
| TD-V03 | Every active case has every required field, and exactly one expected result. |
| TD-V04 | Every case traces to at least one approved source ID that exists upstream. No invented IDs. |
| TD-V05 | Every `PC BR` and `PC EB` appears in the matrix, with cases or a `CG-###`. |
| TD-V06 | Every Exploration observation appears in "observations considered", with cases, a TQ, or a reason. |
| TD-V07 | No expected result lacks a basis. Every `Not established` case is Exploratory and/or linked to a `TQ`. No FINDING observed behavior is used as an expected result. |
| TD-V08 | Each `TA` states its technique, area, reason and resulting cases. Non-applied techniques are listed with reasons. BVA values come from approved limits. No invented states or transitions. Pairwise is not claimed as exhaustive. Error guessing is supplementary. |
| TD-V09 | Cases are independent: no reliance on execution order, and steps use only established UI and flows. |
| TD-V10 | Priority has a basis or is `Not established`. Valid in Scope and Needs Automation each have a reason. Exploratory cases have Needs Automation FALSE. Every FALSE Valid in Scope has a `CG`. |
| TD-V11 | No secrets or real credentials appear. Test data references its sources. |
| TD-V12 | No execution results, bug reports, automation code or browser/MCP usage appear. |
| TD-V13 | §11 counts equal the §4 index, and coverage gaps and TQs are counted. |
| TD-V14 | ID stability: revisions preserve IDs, withdrawn cases are marked, and nothing is renumbered. |
| TD-V15 | ProjectContext.md and ExplorationReport.md hashes are unchanged. Exactly one `TestCases.md` exists, with no `-v2` or `-final` copies. |
| TD-G01 | (gate) The reply is exactly `TEST_DESIGN_APPROVED`, standalone. |

If a check fails because of the artifact, correct it and record the correction in
`fixes`. If it fails because of the inputs, record a `CG` or `TQ`. Never pass a
check by inventing content.

## Failure Conditions

Every failure below results in `status: blocked`, with MCP not used. No
TestCases.md is written or modified.

| Code | Condition |
|---|---|
| TD-E01 / E02 | Task folder missing / target is the template |
| TD-E03 | TaskContext.md missing |
| TD-E04 | PRD.md missing, or its approval stale |
| TD-E05 | ProjectContext.md missing |
| TD-E06 / E07 | ProjectContext not approved / approval stale |
| TD-E08 | ExplorationReport.md missing |
| TD-E09 / E10 | Exploration not approved / approval stale |
| TD-E11 | The approved exploration was performed against a different ProjectContext version |
| TD-E12 | No active workflow run (event `workflow_run_id: null`). A run ID is never created. |
| TD-E13 | Prompt file missing, or `prompt_id`/`prompt_version` unreadable |
| TD-E14 | Same `prompt_id`/`prompt_version` recorded with a different SHA-256 |
| TD-E15 | `TestCases.md` exists without the placeholder marker and without a journaled `test-design` origin (never overwritten) |
| TD-E16 | Journal file missing or invalid JSON. Nothing is recreated silently. If the artifact was already written, state that the run is **not journaled**. |

## Revision Behavior

When the reviewer requests changes:

1. Append a `revision_request` event with the verbatim request. A request may
   come from Test Review findings (`TR-###`); cite them in the request.
2. Re-check prerequisites, then update the **same** `TestCases.md`. Never create
   `TestCases-v2.md` or `TestCases-final.md`.
3. **Preserve existing test case IDs.** Edited cases keep their ID. New cases take
   the next unused number. Removed cases are marked `Withdrawn (vX.Y.Z — reason)`.
4. Bump the minor version (1.0.0 → 1.1.0), add a Revision History row (reason,
   changed sections, added, modified and withdrawn cases), and reset Status to
   Draft.
5. A reviewer's clarification may settle a `TQ`. It is cited as
   `Reviewer clarification (journal EVT-NNNN)`. If it changes a documented
   expectation, recommend a ProjectContext revision. The skill never edits
   ProjectContext.
6. If the prompt version changed, register it and set
   `revision.prompt_version_changed: true`.
7. Append a `stage_execution` event whose `revision` records the versions, reason,
   `changed_sections`, `items_added`, `items_modified` and `items_removed`.
8. Present the revision and **STOP**. `TEST_DESIGN_APPROVED` is required again.

**Changing an approved TestCases.md voids its approval.**

## Hard-Stop Behavior

After TestCases.md is written (initial or revised):

- **STOP.** Present the complete test case set for review, including counts,
  coverage gaps, open questions and exploratory cases.
- Do **not** execute any case or open a browser. Designing a case and running it
  are different stages, separated by this gate.
- Do not generate automation, create bugs, or start Manual Execution or
  Automation.
- The gate is unconditional.

## Approval Gate

- The only valid progression key is the **exact, case-sensitive, standalone**
  value:

  ```
  TEST_DESIGN_APPROVED
  ```

- **Invalid:** `approved`, `looks good`, `continue`, `proceed`, `LGTM`,
  `TEST_DESIGN_APPROVED please continue`, any message containing the key with
  other text, silence, or another stage's key. Each is journaled as an
  `approval_decision` with `not_accepted`, and the stage remains stopped. A
  message that also contains a change request proceeds to revision.
- **When accepted:**
  - set Status to `Approved`, with the version unchanged,
  - append an `approval_decision` (`accepted`, `next_stage.unlocked: true`)
    carrying the **post-update SHA-256**, which downstream stages use to detect a
    stale approval,
  - report that `test-review` is unlocked. Manual Execution and Automation
    Generation still require `TEST_REVIEW_APPROVED` (ADR-001).
- The skill **never** starts Manual Execution or Automation. The orchestration
  layer decides when the next stage starts.

## Journal Integration

Use the existing journal only:

- `journal/execution-log.json` (events, schema v1.3.0)
- `journal/prompts.json` (prompt records)

The stage's constant values are in
[`journal-event.template.json`](journal-event.template.json).

| Moment | Event type | Status |
|---|---|---|
| Prerequisite not met | `stage_execution` | `blocked` |
| TestCases.md written (each attempt) | `stage_execution` | `awaiting_approval` |
| Change requested | `revision_request` | `revision_requested` |
| Reply is the key | `approval_decision` | `approved` |
| Reply is not the key | `approval_decision` | `approval_not_accepted` |

Field rules (`stage_execution`):

- **Identity:**
  - `event_id` / `step_number` are the next in sequence.
  - `attempt` counts this stage's executions within the run.
  - `workflow_run_id` is **read** from `workflow-run.json`, never created. It is
    `null` only on TD-E12.
  - Also record `task_id` and `timestamp` (system clock, UTC), plus the stage and
    skill identity and versions.
- **Prompt:**
  - `prompt_id` / `prompt_version` reference `prompts.json`.
  - On first use in the task, append the verbatim content, SHA-256,
    `captured_at` and `first_used_by_event_id`.
  - Later events reference it without duplicating the text.
  - `prompt_variables` records `task_name`, `task_path` and `workflow_run_id`.
- **`trigger`**: the reason and the verbatim user message.
- **`input_references`**:
  - ProjectContext.md (`upstream_artifact`, SHA-256) and its approval
    (`upstream_approval`)
  - ExplorationReport.md (`upstream_artifact`, SHA-256) and its approval
  - PRD.md (`task_prd`) and its approval
  - TaskContext.md (`task_metadata`)
  - the prompt
  - on revisions, the previous TestCases.md and the change request
- **`source_references`**: ProjectContext, ExplorationReport and PRD sections and
  IDs used.
- **`tools_used`**: file read, write and hash tools only.
- **`mcp_used`**: `{ used: false, servers: [], intentionally_not_used: [{ server: "playwright", reason: "Test Design operates on approved artifacts and does not require live browser exploration." }] }`.
  The HTML journal shows **MCP: Not used**, with that reason.
- **`actions`**, **`decisions`**: technique choices, collapsed combinations,
  priority bases, Valid in Scope and Needs Automation calls, and FINDING
  handling.
- **`techniques_used`**: every `TA-###` (technique, areas, sources, rationale,
  resulting cases), plus the techniques not applied, with reasons.
- **`generated_test_case_ids`**: all active case IDs.
- **`test_cases`**: per-case summary (id, title, type, priority, expected result
  basis, sources, technique IDs, Valid in Scope, Needs Automation, status).
- **`traceability`**: the source → cases matrix, uncovered sources, and the
  observations considered.
- **`coverage`** (test-design shape): counts by type, the source totals covered
  and uncovered, and observations considered or without a test (with reasons).
- **`exploratory_cases`**, **`open_questions`** (`TQ-###` with related cases and
  required clarification), **`coverage_gaps`** (`CG-###`) and
  **`test_data_requirements`** (`DATA-###`, never secret values).
- **`output_artifacts`**: TestCases.md (operation, status, version, SHA-256,
  counts).
- **Also recorded:** `assumptions`, and `gaps` (empty; test-design gaps are
  `coverage_gaps`).
- **`validation.checks`**: TD-V01…V15 with their real results.
- **Gate fields:**
  - `status`
  - `stop_reason`
  - `approval_required: true`
  - `approval_key: "TEST_DESIGN_APPROVED"`
  - `approval_outcome` (`null` except on `approval_decision`)
  - `next_stage` (`test-review`, unlocked only after an accepted approval)
- **Also recorded:** `errors`, `fixes`, `revision` (`null` on attempt 1) and
  `notes`. `evidence` is empty: design produces no evidence, and upstream `EVD`
  items are referenced through sources.
- **Never fabricate** runtime values. If a value is unavailable, use `null` and
  explain it in `notes`.

## HTML Journal Observability

The future interactive HTML journal must be able to show all of the following for
this stage, from the journal plus TestCases.md, without rerunning anything:

| # | Shown | From |
|---|---|---|
| 1 | Why Test Design ran | `trigger.reason` |
| 2 | Triggering message | `trigger.user_message` |
| 3 | Exact prompt version | `prompt_id`/`prompt_version` → `prompts.json` content |
| 4 | ProjectContext used | `input_references` (path, hash, approval event) |
| 5 | ExplorationReport used | `input_references` (path, hash, approval event) |
| 6 | Workflow Run ID | `workflow_run_id` |
| 7 | Sources considered | `source_references`, `traceability.matrix`, `traceability.observations_considered` |
| 8–9 | Techniques selected, and why | `techniques_used[]` (rationale, not-applied list) |
| 10 | Test cases generated | `generated_test_case_ids`, `test_cases[]` → TestCases.md §4 |
| 11 | Traceability per case | `test_cases[].sources`, `traceability.matrix` |
| 12 | Expected result source | `test_cases[].expected_result_basis` |
| 13 | Exploratory cases | `exploratory_cases[]` |
| 14 | Open questions | `open_questions[]` |
| 15 | Coverage gaps | `coverage_gaps[]` |
| 16 | Test data requirements | `test_data_requirements[]` |
| 17 | Coverage summary | `coverage` |
| 18 | Validation results | `validation.checks` |
| 19 | Why the stage stopped | `stop_reason`, `status` |
| 20 | `TEST_DESIGN_APPROVED` requirement | `approval_key` |
| 21 | Approval result | `approval_decision` events → `approval_outcome` |
| 22 | Revisions | `revision_request` events, `revision` (added, modified, removed) |
| 23 | Errors and fixes | `errors`, `fixes` |

**Navigation paths:**

- **Source → Technique → Test Case → Expected Result → Traceability → Coverage**:
  `traceability.matrix[source]` → `techniques_used[].resulting_cases` →
  `test_cases[]` → `expected_result_basis` → `sources` → `coverage`.
- **Exploration Observation → Test Case → Traceability**:
  `traceability.observations_considered[OBS]` → `test_cases` → `sources`.
  Upstream, it continues into the exploration event's `observations` and
  `evidence`.
