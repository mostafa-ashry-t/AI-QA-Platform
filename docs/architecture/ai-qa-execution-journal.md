# AI QA Execution Journal: Architecture

The journal is the **execution history** of a task. It is not a final report.
It records what each stage actually did, so a person can later replay the
workflow step by step in an interactive HTML page.

## Storage (per task)

| File | Content | Schema |
|---|---|---|
| `platform/tasks/<task>/journal/execution-log.json` | `entries[]`: append-only events | [`platform/schemas/journal-event.schema.json`](../../platform/schemas/journal-event.schema.json) |
| `platform/tasks/<task>/journal/prompts.json` | `prompts[]`: one snapshot per `prompt_id` + `prompt_version` | [`platform/schemas/prompt-record.schema.json`](../../platform/schemas/prompt-record.schema.json) |
| `platform/tasks/<task>/journal/workflow-run.json` | `active_run_id` + `runs[]`: **owned by orchestration** | [`platform/schemas/workflow-run.schema.json`](../../platform/schemas/workflow-run.schema.json) |

## workflow_run_id ownership

One workflow execution has one `workflow_run_id` (e.g. `RUN-001`), shared by
every stage of that execution. The **orchestration layer** creates it at run
start in `workflow-run.json`. A human operator fills this role until a runner
exists. Skills **read** `active_run_id` and never create, change or infer it.
If it is missing, the stage fails (`PRD-E04`, `PC-E08`). That failure event is
the only event allowed to carry `workflow_run_id: null`.

## Schema versions

| Version | Change |
|---|---|
| 1.1.0 | Orchestration-owned `workflow_run_id`; `revision` object; required gate and audit fields. |
| 1.2.0 | Structured `evidence` items (were strings); `blocked` status; optional stage blocks `mcp_actions`, `observations`, `classifications`, `candidate_locators`, `coverage`; `mcp_used.servers[].version`. |
| 1.3.0 | Backward-compatible superset (accepts `schema_version` 1.2.0 or 1.3.0). Test-design blocks `techniques_used`, `generated_test_case_ids`, `test_cases`, `traceability`, `exploratory_cases`, `coverage_gaps`, `test_data_requirements`; `coverage` is a union of the exploration and test-design shapes; `open_questions` add `related_test_cases` / `ambiguity` / `required_clarification`; `revision` adds `items_added` / `items_modified` / `items_removed`. |
| 1.4.0 | Backward-compatible superset (accepts 1.2.0, 1.3.0, 1.4.0). Manual-execution blocks `environment`, `build`, `browser`, `test_case_ids`, `executed_test_case_ids`, `execution_actions`, `test_results` (verbatim expected, observed actual, status), `statuses`, `failure_analysis`, `blocked_cases`, `test_case_issues`, `deviations`, `bugs` (severity and priority per bug), `defect_grouping`. `coverage` gains an execution shape. `evidence` items add `related_test_cases` / `related_step` / `related_bugs` and types `ui_text` / `application_output`. `mcp_actions` add `test_case_id` / `step`. `revision` adds `re_executed` / `result_changes`. `trigger.redactions`. |
| 1.5.0 | Backward-compatible superset (accepts 1.2.0 through 1.5.0). Test-review blocks `review_binding` (reviewed TestCases.md, ProjectContext and ExplorationReport: path, version, SHA-256, approval event), `reviewed_test_case_ids`, `review_findings` (`TR-###`: classification `Advisory` \| `Change Required`, category, proposed change, reason, status, resolution, classification history), `review_outcome`. `coverage` gains a test-review shape. |
| 1.6.0 | Backward-compatible superset (accepts 1.2.0 through 1.6.0). Automation-generation blocks `automation_binding` (framework, binding, language, runner, versions, toolchain, IDE, credential environment variable names), `automated_cases` (per candidate: generated or not, warning code, test file / method, verbatim expected result, data, locators, bugs), `locator_decisions` (strategy and `LOC-###` source or verification), `generated_files` (role, operation, SHA-256), `static_validation`. New status `completed` for an ungated stage that finished successfully. |
| 1.7.0 | Backward-compatible superset (accepts 1.2.0 through 1.7.0). Automation-execution block `automation_runs` (per command run of one binding: run ID, binding, project dir, command with environment variable names only, exit code, outcome `passed` \| `failed` \| `not_run` \| `harness_failed`, test counts, test / runner / wall-clock durations, failure class, result files, evidence, healing and bug IDs). Self-healing block `healing_attempts` (`E-###` / `H-###`: failed run, symptom, classification, root cause, diagnosis evidence, change, files with SHA-256 before / after, `assertion_changed` (always false), verification run, result `fixed` \| `not_fixed` \| `not_healed_application_defect` \| `escalated`). Run metrics file: `platform/schemas/execution-metrics.schema.json`. |

**`blocked` vs `failed`:** `blocked` means a prerequisite was not met and the
stage never started (no MCP, no artifact). `failed` means the stage started but
could not complete.

## Evidence storage

Evidence files belong to the task, e.g. `exploration/evidence/` or
`execution/evidence/EVD-###-<slug>.<ext>`. `EVD` numbering is **task-wide**: each
stage continues after the highest existing `EVD`, so IDs never collide across
stages. Secrets are redacted (`[REDACTED: <kind>]`, recorded in `redactions`).
Images that would expose a secret are not stored; they are recorded as `not_captured`.
Files an MCP server writes to its own output directory (`.playwright-mcp/`) are
moved into the task and their `original_path` is recorded. Each evidence item
carries a SHA-256 hash, a capture timestamp, the MCP action (`seq`) that
produced it, and the observations it supports. Evidence that could not be
captured is still recorded, as `not_captured` with the reason.

The file containers come from the task template. Stages only append to
`entries` / `prompts`. Only orchestration writes `workflow-run.json`.

## Responsibilities

| Concept | Owns |
|---|---|
| Skill | How a stage is performed, including *which* events it emits |
| Prompt | The versioned instruction; the full text is kept once in `prompts.json` |
| Workflow | Stage order, dependencies and gates |
| Journal | What actually happened: events, never predictions or fabricated values |
| Artifact | What the stage produced; the journal references it by path and hash |

## Event lifecycle (generic)

```
stage_execution (attempt 1, awaiting_approval, revision: null)
   ├─ approval_decision (not_accepted)      → still stopped
   ├─ revision_request                      → stage_execution (attempt 2, revision {…})
   └─ approval_decision (accepted)          → next_stage.unlocked = true
stage_execution (failed)                    → stopped with errors[]
```

The `revision` object on a revising attempt records `version_before` and
`version_after` (e.g. PRD 1.0.0 → 1.1.0), the reason, changed sections, the
triggering `revision_request` event, and whether the prompt version changed.

**Cross-stage approval check:** an `approval_decision` (accepted) stores the
artifact's post-approval SHA-256. The downstream stage compares it with the
current file. A mismatch, or a later `stage_execution` of the upstream stage,
means the approval is stale (e.g. Project Context `PC-E09`).

**Reviewed-artifact binding (ADR-001):** the mandatory Test Review approval is
bound to the TestReview.md post-approval hash, and to the SHA-256 of the exact
`TestCases.md` it reviewed, plus the approved ProjectContext and
ExplorationReport hashes it validated against. The bound hashes are carried by
`review_binding` (schema 1.5.0) on the review's `stage_execution` and
`approval_decision`, and also by the `upstream_artifact` input references.
Manual Execution (`ME-E23`/`ME-E24`) and Automation Generation reject the
approval if any bound hash no longer matches, or if a later `test-design` or
`test-review` run exists (stale conditions S1–S5 in the `test-review` skill).
Automation Generation also requires that it is the **same** review approval
referenced by the approved manual execution. The gate also refuses the exact key
while a `Change Required` finding is open.

## Prompt versioning

- Each prompt file declares `prompt_id` and `prompt_version` in its front matter.
- Changing the prompt text requires a version bump.
- On first use of a version within a task, the stage stores the verbatim content
  and SHA-256 in `prompts.json`.
- If the same id and version appear with a different hash, the stage fails
  (e.g. `PC-E06`). This prevents unrecorded prompt drift.

## What the HTML journal will render (per event)

- A timeline of steps: step number, stage, event type, timestamp and status badge.
- **Why**: the trigger reason and the verbatim user message.
- **Prompt**: id and version, expandable to the exact text from `prompts.json`,
  plus the variables used.
- **Inputs**: each file with its role, status (read or missing) and hash.
- **Browser actions** (Exploration): the ordered `mcp_actions` log (tool, action,
  target, data-changing flag, result, time), linked to observations and evidence.
- **Observations** (Exploration): Observation → Classification → Evidence (file) →
  Report section, with counts per classification, candidate locators and coverage
  (pages visited, areas not explored, limits).
- **Design** (Test Design): Source → Technique (`techniques_used`) → Test Case
  (`test_cases`) → Expected Result Basis → Traceability matrix → Coverage, plus
  Observation → Test Case, exploratory cases, open questions, coverage gaps and
  test data requirements.
- **Execution** (Manual Execution): the `execution_actions` timeline (`EXEC-###`),
  and per case Expected (verbatim) vs Actual (observed) → PASS/FAIL/BLOCKED →
  Evidence → Failure analysis → Bug, plus BUG → affected cases → evidence, and
  source coverage.
- **Review** (Test Review): the binding (exactly which TestCases.md version was
  reviewed), the 8 checks performed, and Test Case → Findings (`TR-###`,
  Advisory or Change Required) → Proposed Change and Reason → Resolution
  (test-design revision or human decision) → re-review, plus which findings
  blocked approval and why a key was refused (`TR-G01`–`TR-G03`).
- **Tools / MCP**: the tools used, and MCP used or *intentionally not used* with the
  reason (e.g. "MCP: None — Playwright not permitted in Project Context"). A
  non-MCP HTTP reachability check (PRD Generation) is listed as a tool, with its
  command and HTTP status.
- **Actions** and **decisions**, with rationale.
- **Outputs**: artifact path, created or updated, hash and summary.
- **Findings**: assumptions (confirmed or unconfirmed), gaps and open questions.
- **Validation**: each check with pass or fail.
- **Gate**: stop reason, required approval key, approval outcome, and whether the
  next stage is unlocked.
- **Errors and fixes**, and **evidence** links.
- Attempts grouped per stage, so revision history (attempt 1 → change request →
  attempt 2 → approval) reads as a story.

## History: v0.1.0 descriptor

The first template carried an inline camelCase `entryFormat` descriptor. It was
replaced by a reference to the canonical schema (template journal v1.1.0).
Mapping, for reference:

| v0.1.0 `entryFormat` | Schema v1.5.0 |
|---|---|
| stepNumber | step_number |
| stepName | stage_id / stage_name |
| timestamp | timestamp |
| skill | skill_name (+ skill_version) |
| promptId / promptVersion | prompt_id / prompt_version |
| input | input_references |
| tools | tools_used + mcp_used |
| actions | actions |
| output | output_artifacts |
| filesCreated / filesModified | output_artifacts[].operation |
| validation | validation |
| errors / fixes | errors / fixes |
| nextStep | next_stage |
| evidence | evidence |
