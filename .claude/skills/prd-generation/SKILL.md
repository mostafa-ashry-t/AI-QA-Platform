---
name: prd-generation
description: PRD Generation stage of the AI QA Platform. Converts one task's intake (context/TaskContext.md, supporting documents, user-supplied information, and the project UI/API URLs) into a structured, traceable 20-section PRD at platform/tasks/<task-name>/prd/PRD.md. Documented intent only; it performs no UI or API exploration. Then HARD STOPS until the exact standalone key PRD_APPROVED. Revisions update the same PRD.md with a version bump. Generic for any web, API, mobile or UI+API project. Use when asked to "generate the PRD", "write requirements for <task>", "create a PRD from this user story / URL", or "revise the PRD".
---

# PRD Generation

| Field | Value |
|---|---|
| Skill | `prd-generation` |
| Skill version | `1.0.1` |
| Prompt | [`.claude/prompts/prd-generation.md`](../../prompts/prd-generation.md). `prompt_id: prd-generation`, `prompt_version: 1.0.0` |
| Output structure | [`PRD.template.md`](PRD.template.md) |
| Journal event template | [`journal-event.template.json`](journal-event.template.json) |
| Journal schemas | [`journal-event.schema.json`](../../../platform/schemas/journal-event.schema.json), [`prompt-record.schema.json`](../../../platform/schemas/prompt-record.schema.json), [`workflow-run.schema.json`](../../../platform/schemas/workflow-run.schema.json) |
| Workflow stage | `prd-generation` (order 1) in [`default-qa-workflow.yaml`](../../../platform/workflows/default-qa-workflow.yaml) |
| Upstream | Task creation (task folder, `TaskContext.md`, active workflow run) |
| Downstream | `project-context` (only after approval) |
| Approval key | `PRD_APPROVED` |
| MCP | **None.** Playwright MCP is never used. |

```
Task Creation ──▶ PRD Generation ──▶ PRD.md ──▶ ⛔ HARD STOP ──▶ PRD_APPROVED ──▶ Project Context
```

## Purpose

Turn the task's supplied information into a **Product Requirements Document**:
a structured, traceable, testable-where-possible statement of documented intent.
Project Context consumes it as its only requirements source.

The PRD is a **requirements artifact**. It is not an exploration report, test
case document, bug report, automation plan or execution report.

## Separation of concerns

| Concept | For this stage |
|---|---|
| **Skill** (this file) | *How* the PRD is generated, validated, gated, revised and journaled. |
| **Prompt** (`.claude/prompts/prd-generation.md`) | The versioned *instruction*. It is recorded in the journal by id and version, with the verbatim text in `prompts.json`. |
| **Workflow** (`default-qa-workflow.yaml`) | *When* the stage runs, and that `PRD_APPROVED` unlocks `project-context`. |
| **Journal** (`journal/*.json`) | *What actually happened* in each attempt. |
| **Artifact** (`prd/PRD.md`) | *What was produced*. This is the only artifact. |
| **TaskContext.md** | Input only: identity metadata and raw intake. This skill never creates or modifies it. |
| **ProjectContext.md** | Downstream QA analysis. This skill never creates it. |

## Trigger Conditions

Run when a human asks to generate or revise the PRD of a **named task**.
Preconditions, all mandatory:

1. `platform/tasks/<task-name>/` exists and is not under `platform/templates/`.
2. `platform/tasks/<task-name>/context/TaskContext.md` exists. It was created at
   task creation, never by this skill.
3. `platform/tasks/<task-name>/journal/workflow-run.json` has a non-null
   `active_run_id`, created by the orchestration layer.
4. There is at least one requirement input: a task description or user story,
   acceptance criteria, scope information, additional information, a supporting
   document, user-supplied information in the request, or a project URL.
   URL-only input is allowed. It produces a PRD that is mostly `Not provided`
   and Open Questions, and that is stated explicitly.
5. `prd/PRD.md` either does not exist, or was produced by this skill (a
   `prd-generation` `stage_execution` for it exists in the journal).

If no task name is given, ask for one. Never guess a task.

## Inputs

| # | Input | Where it comes from |
|---|---|---|
| 1–4 | Task ID, Task Name, Task Type, Project Name | `TaskContext.md` § Identity. Task ID defaults to the folder name only if the field is unfilled, and this is recorded as a decision. |
| 5 | User story / task description | `TaskContext.md` § Task Intake and/or the user's request |
| 6 | Project UI URL | `TaskContext.md` § Project Entry Points and/or the user's request |
| 7 | Project API URL | same |
| 8 | Acceptance criteria | `TaskContext.md` § Task Intake and/or the user's request |
| 9 | Scope | same |
| 10 | Out-of-scope information | same |
| 11 | Additional project information, supporting documents | Intake, the user's request, and local files listed there |
| 12 | `workflow_run_id` | `journal/workflow-run.json` → `active_run_id`. **Read only.** |
| — | Prompt | `.claude/prompts/prd-generation.md` |

Information given only in the conversation is recorded verbatim in the event's
`trigger.user_message`. The PRD cites it as `User message (journal EVT-NNNN)`,
using the ID of the event about to be written. It is never written back into
TaskContext.md.

## Outputs

| Kind | Path | Notes |
|---|---|---|
| **Artifact** (exactly one) | `platform/tasks/<task-name>/prd/PRD.md` | Created on the first run and updated in place on revisions. |
| Journal record | `journal/execution-log.json` | Events appended for each attempt, change request and gate reply. |
| Journal record | `journal/prompts.json` | Prompt snapshot added on first use of a `prompt_id` + `prompt_version` in this task. |

No other file is created or modified. In particular, this skill never touches
`TaskContext.md`, `ProjectContext.md`, `workflow-run.json` or
`platform/templates/`.

## Responsibilities

1. Read all task inputs completely before writing anything.
2. Register every source as `SRC-###`, with location and access status.
3. Handle project URLs according to the [URL Handling](#url-handling) rules.
4. Produce all 20 PRD sections following [`PRD.template.md`](PRD.template.md),
   with every statement citing its source.
5. Keep FR and BR items atomic, independently understandable, traceable, and
   testable where possible.
6. Preserve supplied acceptance criteria verbatim. Never create any.
7. Make uncertainty explicit through `Unknown`, `Not provided.`, `Scope Not
   Defined`, assumptions, gaps and open questions.
8. Build Source → Requirement → Business Rule → Acceptance Criterion traceability.
9. Prepare QA notes for downstream stages without performing them.
10. Self-validate, journal the attempt, present the PRD, and **STOP**.
11. Handle revisions in place with a version bump and full journaling.

## Non-Responsibilities

This stage never does any of the following:

- Explore the application: no browser, no Playwright MCP, no navigation, login,
  clicking, form submission, DOM or network inspection, API endpoint discovery
  or calls, or application workflow exploration.
- Record selectors, layouts, field behavior, validation or error messages,
  credentials, or UI components that are not stated in a source.
- Invent endpoints, request or response schemas, authentication behavior,
  status codes, business rules, roles, permissions, workflows, database behavior,
  expected results, acceptance criteria, NFR values, constraints, or owners.
- Generate test cases, test data, exploration findings, bugs, automation,
  execution results, or reports.
- Create `ProjectContext.md` or start Project Context, even after approval.
- Create, rename or copy task folders, create or edit `TaskContext.md`, or
  create a `workflow_run_id`.
- Overwrite a PRD it did not produce.

## Source-of-Truth Rules

Priority (a higher level wins, but **conflicts are never silently resolved**.
They become a GAP citing both sources):

1. Explicit user / task requirements
2. Explicit acceptance criteria
3. Explicit project information
4. Verified source information from the provided project URL (limited to the
   URL rules)
5. Clearly labeled assumptions (§17 only)
6. Unknown, recorded as `GAP-###` / `OQ-###`

- A reviewer's change request is an explicit user requirement (level 1). It is
  registered as a new `SRC-###` citing its `revision_request` event.
- An assumption never becomes an FR, BR, AC or NFR.
- A missing owner is `not stated`. An invented owner is an invented requirement.

## URL Handling

For each provided UI or API entry URL:

1. **Presence and format.** Record whether it is present and well-formed. Register it
   as a source.
2. **Optional reachability check.** Make at most **one** plain, non-browser HTTP
   GET per URL, e.g. `curl -sS -L --max-time 20` through the shell. Record the
   exact tool and command, the HTTP status, and the timestamp in the input
   reference `notes`. From the response, only the resource's self-identification
   (such as the HTML `<title>` or document title) may be used, and only to
   confirm the product or source name.
3. **Forbidden:** Playwright MCP or any browser, following links, a second
   request, authentication, form submission, reading UI elements, fields,
   messages or credentials from the response, and probing API paths.
4. **Inaccessible**, or no suitable tool: record `inaccessible` or
   `not_accessed` with the reason. Don't fabricate anything. Continue if the other
   inputs are sufficient, and raise a GAP or OQ for what is missing.
5. The PRD records each entry point and marks detailed UI or API behavior as
   **Requires exploration**, in §12, §13 and §20.

## Workflow (procedure)

**A. Initial run (attempt 1)**

1. **Resolve the task** and check preconditions 1–5, failing with `PRD-E01`…`E05`
   or `E09`.
2. **Read the run context.** Get `active_run_id` from `journal/workflow-run.json`.
   Never create or alter it (`PRD-E04` if absent).
3. **Capture the time** from the system clock (UTC) for the event and for
   `Created` / `Last updated`.
4. **Load the prompt.** Read `.claude/prompts/prd-generation.md` and its
   `prompt_id` and `prompt_version`, and compute its SHA-256 (`PRD-E06`, `PRD-E07`).
5. **Read inputs.** Read TaskContext.md, supporting documents and user-supplied
   information, and hash each file read. Missing referenced files are recorded
   as `missing` and raised as GAPs.
6. **URLs.** Apply [URL Handling](#url-handling).
7. **Generate.** Follow the prompt's generation instructions into
   `prd/PRD.md` with `Version 1.0.0` and `Status: Draft — awaiting PRD_APPROVED`.
8. **Self-validate** against [Quality Checks](#quality-rules-and-checks). If a
   check fails because of the artifact, correct the artifact and record the
   correction in `fixes`. If it fails because of the inputs, record a GAP or OQ.
   Never pass a check by inventing content.
9. **Journal.** Add the prompt record if it is new, then append a
   `stage_execution` event with `status: awaiting_approval` and `revision: null`.
10. **Present and STOP.** Give the path, version, section counts, key gaps and
    open questions, the URL access outcome, and the exact key `PRD_APPROVED`.

**B. Human reply at the gate**

| Reply | Action |
|---|---|
| Exactly `PRD_APPROVED`, standalone, case-sensitive, surrounding whitespace ignored | Set Status to `Approved`. The version is unchanged. Append an `approval_decision` event (`approval_outcome: accepted`, `status: approved`, `next_stage.unlocked: true`, with the **post-update** PRD SHA-256 in `output_artifacts`). Project Context uses that hash to detect a stale approval. Report that `project-context` is unlocked. **Do not start it.** |
| A change request | See **C**. |
| Anything else: `approved`, `looks good`, `okay`, `continue`, `proceed`, `LGTM`, text containing the key, the key mixed with other text, or another stage's key | Append an `approval_decision` event (`approval_outcome: not_accepted`, `status: approval_not_accepted`) with the verbatim reply. State that it is not the approval key, restate `PRD_APPROVED`, and remain stopped. If the reply also contains a change request, continue with **C**. |
| A question | Answer it without changing anything. The stage remains stopped. |

**C. Revision (attempt n + 1)**

1. Append a `revision_request` event with the verbatim request.
2. Re-run steps A2–A8 on the **same** `prd/PRD.md`. Never create `PRD-v2.md`,
   `PRD-final.md` or any copy.
3. **Version:** bump the minor version (1.0.0 → 1.1.0 → 1.2.0). Update
   `Last updated`, add a row to *Revision History* (version, date, reason,
   changed sections), and reset Status to `Draft — awaiting PRD_APPROVED`.
4. Register the change request as a new `SRC-###` if it adds or alters
   requirements.
5. If the prompt file's version differs from the previous attempt's, record the
   new prompt in `prompts.json` and set `revision.prompt_version_changed: true`.
6. Append a `stage_execution` event whose `revision` records `artifact_path`,
   `version_before`, `version_after`, `reason`, `changed_sections`,
   `revision_request_event_id`, `prompt_version_changed` and
   `previous_prompt_version`.
7. Present the revision and **STOP again**. `PRD_APPROVED` is required again.

**D. Changes after approval.** Any revision of an approved PRD voids the
approval: Status returns to Draft, the version is bumped, and `PRD_APPROVED` is
required again. Project Context will refuse a stale approval (`PC-E09`).

## PRD Structure

Exactly these sections, in this order. The full layout and ID formats are in
[`PRD.template.md`](PRD.template.md).

| § | Section | Mandatory rule |
|---|---|---|
| 1 | Document Information | PRD ID `PRD-<task-id>`, identity, Version, Status, `workflow_run_id`, Created and Last updated, Revision History. Real values only. |
| 2 | Source Information | `SRC-###` register with access status. |
| 3 | Problem Statement | As described. Do not expand it. |
| 4 | Goal | Stated intent only. |
| 5 | User Story | As a / I want / So that, or `Not provided.` |
| 6 | Scope | In Scope (documented), Out of Scope (explicit only), Scope Not Defined. |
| 7 | Actors / Roles | Explicitly mentioned roles only, with permissions only if stated. |
| 8 | Functional Requirements | `FR-###` with *Requirement* and *Source*. |
| 9 | Business Rules | `BR-###`, independently verifiable, with source. |
| 10 | Acceptance Criteria | Verbatim `AC-###`, or `Acceptance criteria were not explicitly provided.` |
| 11 | Data Requirements | `DR-###`, known only. No test data. |
| 12 | UI Requirements | `UIR-###`, stated only. Entry point plus `Requires exploration`. |
| 13 | API Requirements | `APIR-###`, stated only. Entry point plus `Requires exploration`. |
| 14 | Non-Functional Requirements | `NFR-###`, or `Not explicitly provided.` |
| 15 | Dependencies | `DEP-###`, supported only. |
| 16 | Constraints | `CON-###`, explicit only. |
| 17 | Assumptions | `AS-###` with description, reason and source or context. |
| 18 | Gaps and Open Questions | `GAP-###` / `OQ-###` with related requirement, impact and owner (`not stated`). |
| 19 | Traceability | Source → FR → BR → AC. "Requirements without a source" must be None. |
| 20 | QA Preparation Notes | Exploration, UI, API, BR and data validation needs, and unknown behavior. Nothing observed. |

## Quality Rules and Checks

Every check runs before presenting, and each result is recorded in
`validation.checks`.

| Check | Rule |
|---|---|
| PRD-V01 | All inputs were read. Every source is registered as `SRC-###` with an access status. |
| PRD-V02 | All 20 sections are present, in order. Empty sections use their required wording. |
| PRD-V03 | Every FR, BR, AC, DR, UIR, APIR, NFR, DEP and CON cites an `SRC-###`. |
| PRD-V04 | Each FR and BR is a single, independently understandable statement. |
| PRD-V05 | Acceptance criteria are verbatim from a source, or the not-provided statement is present. None are invented. |
| PRD-V06 | Out of Scope contains only explicit exclusions. Undeterminable items are under Scope Not Defined. |
| PRD-V07 | No invented roles, permissions, endpoints, schemas, status codes, messages, selectors, NFR values or owners. |
| PRD-V08 | Every assumption is in §17 with a reason, and none appears as an FR, BR, AC or NFR. |
| PRD-V09 | Source conflicts and ambiguities are recorded as GAP or OQ, not resolved. |
| PRD-V10 | URL handling complied: at most one non-browser request per URL, no MCP, and only reachability and self-identification used. |
| PRD-V11 | No exploration findings, test cases, test data, bugs, automation or execution content is present. §20 is preparation only. |
| PRD-V12 | Traceability is complete, and "Requirements without a source" is None. |
| PRD-V13 | Document Information values are real: run ID from the run context, timestamps from the system clock, version per the revision rules. |
| PRD-V14 | Exactly one artifact exists at `prd/PRD.md`, with no copies or variants and no writes outside the task folder except journal records. |
| PRD-G01 | (gate) The reply is exactly `PRD_APPROVED`, standalone. |

## Failure Conditions

On failure, write **no** artifact and report the error. If the task journal
exists, append a `stage_execution` event with `status: failed`, then STOP.

| Code | Condition |
|---|---|
| PRD-E01 | The task folder does not exist. Never create it. |
| PRD-E02 | The target resolves into `platform/templates/`. |
| PRD-E03 | `TaskContext.md` is missing. Never create it. |
| PRD-E04 | There is no active workflow run: `workflow-run.json` is missing or `active_run_id` is null. Never create a run ID. The failed event is journaled with `workflow_run_id: null`. |
| PRD-E05 | There is no requirement input at all (precondition 4). |
| PRD-E06 | The prompt file is missing, or its `prompt_id` / `prompt_version` is unreadable. |
| PRD-E07 | `prompts.json` already holds this `prompt_id` + `prompt_version` with a different SHA-256, meaning the prompt changed without a version bump. |
| PRD-E08 | A journal file is missing or not valid JSON. Report it, and never recreate or overwrite it silently. If the artifact was already written, state that the run is **not journaled**. |
| PRD-E09 | `prd/PRD.md` exists without a journaled `prd-generation` origin. A human-authored PRD is never overwritten. It may be moved to a supporting document and used as a source. |

An inaccessible URL is **not** a failure. It is a recorded limitation, a GAP or OQ.

## Hard-Stop Rules

After `PRD.md` is written (initial or revised):

- **STOP.** Present the PRD for review.
- Do not continue to Project Context. Do not create ProjectContext.md, explore
  the application, generate test cases, execute tests, generate automation or
  bugs, or generate reports.
- The gate is unconditional. No PRD is "obvious enough" to skip it.

## Approval Gate

- The only valid unlock key is the exact standalone value:

  ```
  PRD_APPROVED
  ```

- It is rejected and journaled when it is `approved`, `looks good`, `okay`,
  `continue`, `proceed`, `LGTM`, any other text containing the key, the key mixed
  with other text, silence, or another stage's key.
- Approval unlocks `project-context` but never starts it.

## Journal Integration

Events conform to
[`journal-event.schema.json`](../../../platform/schemas/journal-event.schema.json)
(v1.2.0). The stage's constant values are in
[`journal-event.template.json`](journal-event.template.json). Do not create
another journal format.

| Moment | Event type | Status |
|---|---|---|
| PRD written (each attempt) | `stage_execution` | `awaiting_approval` |
| Stage failed | `stage_execution` | `failed` |
| Change requested | `revision_request` | `revision_requested` |
| Reply is the key | `approval_decision` | `approved` |
| Reply is not the key | `approval_decision` | `approval_not_accepted` |

Field rules:

- **Append only.** `event_id` / `step_number` is the next sequence in `entries`.
  `attempt` counts this stage's `stage_execution` events within the run.
- `workflow_run_id` is read from `workflow-run.json` → `active_run_id`, never
  created. It is `null` only on a `PRD-E04` failure.
- `prompt_id` / `prompt_version` reference `prompts.json`. On first use of a
  version in this task, append a record (`prompt-record.schema.json`) with the
  verbatim content, SHA-256, `captured_at` and `first_used_by_event_id`. Later
  events reference it and never duplicate the text. `prompt_variables` records
  `task_name`, `task_path` and `workflow_run_id`.
- `trigger.user_message` holds the verbatim request, change request or gate reply.
- `input_references`:
  - TaskContext.md (`task_intake`)
  - supporting documents (`supporting_document`)
  - each URL (`project_url`, status `accessed` / `inaccessible` / `not_accessed`,
    `notes` = tool, command and HTTP status)
  - the prompt (`prompt`)
  - on revisions, the previous PRD (`previous_version_of_output`)
  - the change request (`user_message`, `journal:EVT-NNNN`)
- `source_references`: the `SRC-###` register mapped to paths and URLs.
- `tools_used`: only the tools actually used (file read and write, shell hashing,
  shell HTTP request if made), each with its purpose and targets.
- `mcp_used`: `{ "used": false, "servers": [] }` with `intentionally_not_used`
  naming `playwright`. The HTML journal shows **MCP: None**. A non-MCP HTTP
  request is recorded in `tools_used`, never hidden.
- `decisions`: judgment calls with rationale, e.g. splitting a compound
  statement, treating a conflict as a GAP, or a Task ID default.
- `output_artifacts`: `prd/PRD.md` with operation, `artifact_status`,
  `artifact_version`, SHA-256 and section-count summary.
- `assumptions` / `gaps` / `open_questions`: ID and summary copies of §17 and §18.
- `revision`: `null` on attempt 1. The full revision object on later attempts.
- `validation.checks`: PRD-V01…V14, or PRD-G01 for gate replies, with real results.
- `stop_reason`, `approval_required: true`, `approval_key: "PRD_APPROVED"`,
  `approval_outcome` (only on `approval_decision`, `null` otherwise), and
  `next_stage` (`project-context`, `unlocked` only after an accepted approval).
- `errors`, `fixes`, `evidence`: real items only. Evidence is normally empty for
  this stage.
- **Never fabricate** timestamps, hashes, IDs, tool usage or results. If a value
  is unobtainable, use `null` and explain it in `notes`.

## Traceability

- Every statement cites `SRC-###`, and optionally a section or short quote.
- §19 maps Source → FR → BR → AC. Every FR has at least one source, and
  "Requirements without a source" must be None. An untraceable statement is
  removed or restated as a GAP or OQ.
- Supplied AC keep their original labels next to the `AC-###` ID.
- IDs are stable across revisions. A removed item's ID is not reused. Record the
  removal in Revision History.
- Downstream stages cite PRD items qualified as `PRD <ID>` (e.g. `PRD FR-003`).
