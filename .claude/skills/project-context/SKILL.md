---
name: project-context
description: Project Context stage of the AI QA Platform. Reads one task's own PRD (platform/tasks/<task-name>/prd/PRD.md), plus the knowledge-base and supporting material that PRD references, and writes that task's ProjectContext.md. The artifact covers scope decomposition, scope and boundaries, roles, business rules, expected behaviors, dependencies, assumptions, risks, gaps and open questions, traceability, and QA scope preparation. Then HARD STOPS until the literal key PROJECT_CONTEXT_APPROVED. Documentation only; it never explores the live application. Use when asked to "build/run the project context", "decompose this task", "read the PRD for <task>", or "what is in scope for <task>".
---

# Project Context

| Field | Value |
|---|---|
| Skill | `project-context` |
| Skill version | `1.1.1` |
| Prompt | [`.claude/prompts/project-context.md`](../../prompts/project-context.md). `prompt_id: project-context`, `prompt_version: 1.1.0` |
| Output structure | [`ProjectContext.template.md`](ProjectContext.template.md) |
| Journal event template | [`journal-event.template.json`](journal-event.template.json) |
| Journal schemas | [`journal-event.schema.json`](../../../platform/schemas/journal-event.schema.json), [`prompt-record.schema.json`](../../../platform/schemas/prompt-record.schema.json), [`workflow-run.schema.json`](../../../platform/schemas/workflow-run.schema.json) |
| Workflow stage | `project-context` in [`default-qa-workflow.yaml`](../../../platform/workflows/default-qa-workflow.yaml) |
| Upstream | `prd-generation`, which must be approved with `PRD_APPROVED` |
| Downstream | `exploration` (only after approval) |
| Approval key | `PROJECT_CONTEXT_APPROVED` |
| MCP | **None.** Playwright MCP is not used. |

```
PRD.md ──▶ ⛔ PRD_APPROVED ──▶ Project Context ──▶ ProjectContext.md ──▶ ⛔ HARD STOP ──▶ PROJECT_CONTEXT_APPROVED ──▶ Exploration
```

## Purpose

Read the task's own PRD and establish what the task *is*: its scope, rules,
roles, dependencies and boundaries. This happens before any testing activity
begins. Once approved, `ProjectContext.md` is the **scope source of truth** that
every later stage of this task is measured against.

The stage runs in **one pass**. It reads the PRD, performs the scope
decomposition, and writes `ProjectContext.md`, where the decomposition is one
section. There is no separate gate before the artifact is written. The single
gate comes *after* it.

## Separation of concerns

| Concept | For this stage |
|---|---|
| **Skill** (this file) | *How* the stage is performed: procedure, rules, validation, gate, journaling. |
| **Prompt** (`.claude/prompts/project-context.md`) | The versioned *instruction* the AI works from. It is recorded in the journal by id and version. |
| **Workflow** (`default-qa-workflow.yaml`) | *When* the stage runs and what it depends on or unlocks. |
| **Journal** (`journal/execution-log.json`, `journal/prompts.json`) | *What actually happened* during each execution. |
| **Artifact** (`context/ProjectContext.md`) | *What the stage produced*. This is the only artifact. |

## Trigger Conditions

Run when a human asks for the project context of a **named task**. Preconditions,
all mandatory:

1. `platform/tasks/<task-name>/` exists and is not `platform/templates/…`.
2. `platform/tasks/<task-name>/prd/PRD.md` exists and is not empty or an unfilled
   placeholder.
3. **The PRD is approved.** `journal/execution-log.json` contains a
   `prd-generation` `approval_decision` event with `approval_outcome: accepted`
   in the active run. No later `prd-generation` `stage_execution` exists after
   it, and the current PRD.md SHA-256 equals the hash recorded in that approval
   event. If any of these fails, the approval is missing or stale.
4. **An active workflow run exists.** `journal/workflow-run.json` →
   `active_run_id` is set. It is created by the orchestration layer and never
   by this skill.

If no task name is given, ask for one. Never guess a task.

## Inputs

| Input | Path | Use |
|---|---|---|
| **Task PRD** (required) | `platform/tasks/<task-name>/prd/PRD.md` | The only source of requirements. Read in full. |
| Task identity metadata | `platform/tasks/<task-name>/context/TaskContext.md` § Identity | **Identity fields only** (task ID, name, type, project name) for Section 1. Its intake section is PRD input and is never a source of requirements or scope here. The PRD already incorporates it. |
| Workflow run context | `platform/tasks/<task-name>/journal/workflow-run.json` | Read `active_run_id` only. |
| PRD approval | `platform/tasks/<task-name>/journal/execution-log.json` | Verify precondition 3. |
| Shared knowledge base | `platform/knowledge-base/…` | Only files the PRD references or depends on (glossary, roles, environments, cross-cutting rules). Never treated as a PRD. |
| Supporting material | Local paths the PRD explicitly references | Only when required to understand a PRD statement. |
| Prompt | `.claude/prompts/project-context.md` | Loaded, hashed, and recorded in the journal. |

**One task, one PRD.** Never read another task's PRD or artifacts as a
substitute, and never merge PRDs.

## Outputs

| Kind | Path | Notes |
|---|---|---|
| **Artifact** (exactly one) | `platform/tasks/<task-name>/context/ProjectContext.md` | Created on the first run and updated in place on revisions. |
| Journal record | `platform/tasks/<task-name>/journal/execution-log.json` | One event appended per execution, change request and gate reply. |
| Journal record | `platform/tasks/<task-name>/journal/prompts.json` | Prompt snapshot added only if this `prompt_id` + `prompt_version` is not already recorded. |

Journal records are not artifacts. They are the audit trail of producing the
artifact. No other file is created or modified.

## Responsibilities

1. Read the task PRD **completely** before proposing anything.
2. Read the knowledge-base and supporting material the PRD references or depends on.
3. Perform the **Scope Decomposition**: the functional areas and flows, what each
   contains, and why each is distinct.
4. Define task scope and boundaries: in scope, explicitly out of scope, and
   boundaries with other functionality.
5. Identify roles and their allowed and restricted actions.
6. Extract business rules as numbered, **independently verifiable** statements.
7. Extract the expected behaviors the PRD explicitly states.
8. Identify dependencies: tasks, modules, external systems, APIs, data, business.
9. Identify assumptions, each marked Confirmed or Unconfirmed.
10. Identify risks, each marked as Documented or Derived.
11. Identify gaps (missing, unclear, contradictory or untestable requirements) and
    specific open questions.
12. Maintain traceability from every item back to the PRD.
13. Prepare the QA scope for downstream stages without performing it.
14. Write exactly one `ProjectContext.md`, journal the execution, and **STOP**.

## Non-Responsibilities

This stage never does any of the following:

- Explore, open, screenshot, or call the application UI or API. No Playwright
  MCP, no browser, no HTTP requests to the application, no fetching its URLs.
- Generate, draft, or outline test cases, execution plans, automation, or
  exploration findings.
- Create, copy, rename, or scaffold task folders, or copy the task template.
  The task already exists.
- Write anything into `platform/templates/`.
- Modify the PRD, TaskContext.md, knowledge-base files, or supporting material.
  If the PRD looks wrong, record a GAP or OPEN QUESTION.
- Split a task. If the PRD covers work that belongs to a separate task, say so
  and let a human split it.
- Start the next stage, even after approval. Approval only unlocks it.

## Source-of-Truth Rules

1. **The PRD is the source of documented task intent.** Observed application
   behavior belongs to the Exploration stage.
2. The knowledge base provides shared definitions only. It never adds requirements
   the PRD does not reference.
3. **Never invent requirements.** If no source states something, it becomes a GAP
   or OPEN QUESTION, however obvious the answer seems.
4. **Never silently resolve** an unclear, ambiguous, or contradictory business rule.
   Record the ambiguity and do not pick an interpretation.
5. **Never turn an assumption into a requirement.** Assumptions live only in
   Section 8, with their status.
6. **Never infer an exclusion.** "Explicitly out of scope" lists only items a
   source explicitly excludes.
7. **Never invent an owner** for a gap or question. A fabricated owner is an
   invented requirement. Use `not stated`.
8. Referenced material that is unavailable locally is **not** fetched or
   reconstructed. It is recorded as a GAP, and the input is journaled as `missing`.

## Workflow (procedure)

**A. Initial run**

1. **Resolve the task.** Confirm the task folder exists and is under
   `platform/tasks/`. Otherwise fail with `PC-E01` or `PC-E02`. Read
   `active_run_id` from `journal/workflow-run.json` (`PC-E08` if null or
   missing). Verify the PRD approval (`PC-E09` if missing or stale).
2. **Capture the start time** from the system clock (UTC). Never estimate
   timestamps.
3. **Load the prompt.** Read `.claude/prompts/project-context.md`, then its
   `prompt_id` and `prompt_version`. Compute its SHA-256.
4. **Read inputs.** Read `TaskContext.md` for identity fields, then the full PRD
   (fail with `PC-E03` if it is missing or a placeholder), then the referenced
   knowledge-base and supporting files. Compute a SHA-256 for each file read.
   Record missing references.
5. **Analyze**, following the prompt instructions, into sections 1–12.
6. **Write** `context/ProjectContext.md` using
   [`ProjectContext.template.md`](ProjectContext.template.md). Set Status to
   `Draft (revision N) — awaiting PROJECT_CONTEXT_APPROVED`. Cite PRD IDs
   qualified with `PRD` (e.g. `PRD FR-003`, `PRD BR-002`), so they are never
   confused with this artifact's own `BR-###` / `AS-###` / `GAP-###` IDs.
7. **Self-validate** against the Quality Checks below. If a check fails because
   of the artifact, correct the artifact and record the correction under `fixes`.
   If it fails because of the inputs, record a GAP. Never "fix" a check by
   inventing content.
8. **Journal.** Register the prompt in `prompts.json` if it is not already there.
   Append a `stage_execution` event to `execution-log.json` (see
   [Journal Integration](#journal-integration)).
9. **Present and STOP.** Give the artifact path, the counts per section, the
   most important gaps and open questions, and the exact approval key. Then stop.

**B. Human reply at the gate**

| Reply | Action |
|---|---|
| Exactly `PROJECT_CONTEXT_APPROVED`, alone, case-sensitive, surrounding whitespace ignored | Set Status to `Approved`. Append an `approval_decision` event (`accepted`, `next_stage.unlocked: true`, with the **post-update** SHA-256 of ProjectContext.md in `output_artifacts`). Report that `exploration` is unlocked. **Do not start it.** |
| A change request | Append a `revision_request` event with the verbatim request. Re-run steps 2–9 with `attempt + 1`, updating the **same** file in place (`operation: updated`). Present the revision and STOP again. |
| Anything else ("looks good", "approved", "continue", "okay", "proceed", "LGTM", another stage's key, the key mixed with other text) | Append an `approval_decision` event (`not_accepted`). Reply that this is not the approval key, restate the key, and remain stopped. If the message also contains a change request, handle it as a change request. |
| A question about the artifact | Answer it. The stage remains stopped. |

**C. Re-run after approval.** If a human asks to re-run or change an
already-approved ProjectContext.md, the approval is void. Status returns to Draft,
a new attempt is journaled, and the key is required again.

## Artifact Content Requirements

`ProjectContext.md` contains exactly these sections, as in the output template:

1. **Task Information**: Task ID (the folder name unless a source states an
   ID), Task Name, Task Type (`not stated` if absent), Project Name, Status,
   Sources read.
2. **Scope Decomposition**: `SA-###` with name, description, contents, why it
   is distinct, and source.
3. **Task Scope**: In Scope (documented only), Explicitly Out of Scope
   (explicit only), Scope Boundaries.
4. **Roles and Permissions**: role, allowed actions, restricted actions, source.
   If no roles are documented, say so and raise a GAP.
5. **Business Rules**: `BR-###`, one verifiable assertion each, with Source and
   Scope area.
6. **Expected Behaviors**: `EB-###`, as documented, with source and scope area.
7. **Dependencies**: `DEP-###` typed as other task, module, external system,
   API, data or business, each with a source.
8. **Assumptions**: `AS-###`, each `Confirmed` or `Unconfirmed`, with basis.
9. **Risks**: `RK-###` with description, why it matters, related requirement or
   area, basis (`Documented` or `Derived`), and source.
10. **Gaps and Open Questions**: `GAP-###` and `OQ-###` with related area,
    impact if known, and owner (`not stated` unless explicitly given).
11. **Traceability**: PRD Section → Requirement → BR/EB → Scope Area. Also list
    PRD sections with no derived item, and items without a source (which must be
    none).
12. **QA Scope Preparation**: areas, UI areas, API areas, business rules and data
    requiring exploration or validation, by reference to IDs. This is
    preparation only.

## Quality Rules and Checks

Every check below runs before presenting, and each result is recorded in the
event's `validation.checks`.

| Check | Rule |
|---|---|
| PC-V01 | The PRD was read in full, and every referenced input is recorded as read or missing. |
| PC-V02 | All 12 sections are present, in order. Empty sections state "None documented in the PRD." |
| PC-V03 | Every SA, BR, EB, DEP, and every Documented risk and Confirmed assumption has a source reference. |
| PC-V04 | Each BR is a single, independently verifiable assertion (no "and/or" bundles, no vague terms left unflagged). |
| PC-V05 | Explicitly Out of Scope contains only explicit exclusions. |
| PC-V06 | Every assumption is marked Confirmed or Unconfirmed, and none appears as a BR or EB. |
| PC-V07 | Every risk is marked Documented or Derived. |
| PC-V08 | Every gap and question is specific, and no owner is invented. |
| PC-V09 | Traceability covers every BR and EB, and "items without a PRD source" is None. |
| PC-V10 | No live-application observation appears anywhere, and no MCP or browser tool was used. |
| PC-V11 | Exactly one artifact was written, at `context/ProjectContext.md`. No `-v2` or `-final` copies exist, and nothing was written outside the task folder except journal records. |
| PC-V12 | No test cases, exploration findings, or automation content is present. Section 12 is references only. |
| PC-G01 | (gate) The approval reply is exactly `PROJECT_CONTEXT_APPROVED`. |

Writing rules: use neutral wording, and quote the PRD where precision matters.
Keep one idea per row. Don't add filler. Don't use application knowledge that did
not come from the sources.

## Failure Conditions

On failure: write **no** artifact, append a `stage_execution` event with
`status: failed` and the error (if the task folder, and therefore the journal,
exists), report the failure, and STOP.

| Code | Condition |
|---|---|
| PC-E01 | Task folder `platform/tasks/<task-name>/` does not exist. Never create it. |
| PC-E02 | Target resolves into `platform/templates/`. |
| PC-E03 | PRD missing, empty, or an unfilled placeholder. |
| PC-E04 | PRD delegates its requirements entirely to referenced material that is unavailable. A partial loss is a GAP, not a failure. |
| PC-E05 | Prompt file missing, or its `prompt_id`/`prompt_version` is unreadable. |
| PC-E06 | `prompts.json` already holds this `prompt_id` + `prompt_version` with a **different** SHA-256. The prompt changed without a version bump. |
| PC-E07 | A journal file is missing or not valid JSON. Report it, and do not recreate or overwrite it silently. If the artifact was already written, say the run is **not journaled**. |
| PC-E08 | No active workflow run: `journal/workflow-run.json` is missing or `active_run_id` is null. The skill never creates a run ID. The failed event is journaled with `workflow_run_id: null`. |
| PC-E09 | PRD not approved, or the approval is stale (PRD changed or re-generated after `PRD_APPROVED`). |

## Hard-Stop Rules

After `ProjectContext.md` is written (initial or revised):

- **STOP.** Present the artifact for review.
- Do not explore the application, generate or draft test cases, execute tests,
  generate or prepare automation, read ahead into, or draft any part of the next
  stage, or modify the PRD.
- The gate is unconditional. No result is "obvious enough" to skip it.

## Approval Gate

- The **only** valid progression key is the literal:

  ```
  PROJECT_CONTEXT_APPROVED
  ```

- Not valid: `looks good`, `approved`, `continue`, `okay`, `proceed`, `LGTM`,
  silence, general praise, or any other stage's key.
- Revisions update the same `ProjectContext.md`. Never create
  `ProjectContext-v2.md` or `ProjectContext-final.md`. Git and the journal keep
  the history.
- Approval unlocks `exploration` but never starts it.

## Journal Integration

Events conform to
[`platform/schemas/journal-event.schema.json`](../../../platform/schemas/journal-event.schema.json).
The stage's constant values are in
[`journal-event.template.json`](journal-event.template.json).

| Moment | Event type | Status |
|---|---|---|
| Artifact written (each attempt) | `stage_execution` | `awaiting_approval` |
| Stage failed | `stage_execution` | `failed` |
| Change requested | `revision_request` | `revision_requested` |
| Reply is the key | `approval_decision` | `approved` |
| Reply is not the key | `approval_decision` | `approval_not_accepted` |

Rules:

- **Append only.** Never edit or delete earlier events.
- `event_id` / `step_number` is the next sequence in `entries`.
  `workflow_run_id` is **read** from `journal/workflow-run.json` →
  `active_run_id`. It is owned by the orchestration layer. The skill never
  creates, changes, or infers it.
- `input_references` includes the PRD approval as
  `{ "path": "journal:EVT-NNNN", "role": "upstream_approval" }`.
- `revision` is `null` on attempt 1. On later attempts it records the previous
  and new status, the change reason, changed sections, the triggering
  `revision_request` event, and whether the prompt version changed.
- `attempt` counts this stage's `stage_execution` events within the run.
- `prompt_id` / `prompt_version` reference `prompts.json`. The full prompt text
  is stored there once per version (`prompt-record.schema.json`), not in each
  event.
- `input_references` lists every file read or looked for, with its role, status
  and SHA-256. `source_references` lists the PRD sections the artifact cites.
- `tools_used` lists the tools actually used (e.g. file read/write, hashing) and
  their purpose.
- `mcp_used` must be `{ "used": false, "servers": [] }`, with
  `intentionally_not_used` naming `playwright` and the reason. The HTML journal
  shows this as **MCP: None**.
- `assumptions`, `gaps` and `open_questions` hold ID + summary copies of the
  artifact's items, so the journal can show what was found without opening the
  artifact.
- `decisions` records judgment calls, e.g. why two flows were split into separate
  scope areas.
- `validation.checks` records PC-V01…PC-V12 (and PC-G01 for gate replies) with
  their real results.
- `stop_reason`, `approval_required: true`, `approval_key`, and `next_stage`
  (`exploration`, `unlocked` true only after an accepted approval) explain why
  the workflow stopped and what unlocks it.
- **Never fabricate** timestamps, hashes, paths, tool usage, or results. If a value
  cannot be obtained, use `null` and explain in `notes`.

## Traceability Requirements

- Every BR, EB, SA, and DEP cites `<path> §<section>` and/or the PRD item ID
  (`PRD FR-###`), preferably with a short quote.
- Use the PRD's own requirement IDs (`FR-`, `BR-`, `AC-`, …) where they exist,
  always qualified as `PRD <ID>`. Never renumber or invent PRD IDs.
- Section 11 maps each PRD section to its requirements, the BR/EB derived from
  them, and the scope area.
- PRD sections that produced nothing are listed, so coverage is visible.
- An item that cannot be traced is not kept. It is removed or restated as a GAP.
- Downstream stages reference these IDs (SA-, BR-, EB-, GAP-, OQ-) to keep the
  chain intact.
