---
prompt_id: project-context
prompt_version: 1.1.0
skill: project-context
stage_id: project-context
approval_key: PROJECT_CONTEXT_APPROVED
variables: [task_name, task_path, prd_path]
changelog:
  - "1.1.0: Require approved PRD (PRD_APPROVED); qualify PRD IDs as 'PRD <ID>'; TaskContext.md identity section only."
  - "1.0.0: Initial version."
---

# Prompt — Project Context

> Versioning rule: any change to the text of this file requires a
> `prompt_version` bump. The journal identifies the prompt used for each run by
> `prompt_id` + `prompt_version` and stores one snapshot of each version in the
> task's `journal/prompts.json`. The snapshot is compared by SHA-256.

## Purpose

Establish what the task **is**, as documented by its PRD: its functional areas,
scope and boundaries, roles, business rules, expected behaviors, dependencies,
assumptions, risks, gaps and open questions. Every item must trace back to its
source. The output becomes the scope source of truth for every later QA stage of
this task once a human approves it.

## Expected Inputs

| Input | Location | Required |
|---|---|---|
| Task PRD | `{{prd_path}}` (normally `{{task_path}}/prd/PRD.md`) | Yes |
| Task identity metadata | `{{task_path}}/context/TaskContext.md` § Identity | Identity fields only (Section 1) |
| Shared knowledge-base material | `platform/knowledge-base/…`, only files the PRD references or depends on | When referenced |
| Supporting material | Local files the PRD explicitly references | When referenced |

## Instructions

You are performing the **Project Context** stage for task `{{task_name}}`.

1. Confirm the PRD was approved with `PRD_APPROVED` and has not changed since.
   Then read the task PRD **completely** before proposing anything.
2. Read only the knowledge-base and supporting material that the PRD references
   or depends on. If referenced material is not available locally, do not fetch
   or guess it. Record it as a GAP.
3. Do **not** consult the live application: no browser, no Playwright MCP, no API
   calls, and no fetching the application's URLs. The PRD is the source of
   documented intent. Observed behavior belongs to the Exploration stage.
4. Perform a **Scope Decomposition**. Split the task into distinct functional
   areas or flows. For each one, give its name, a description, what it contains,
   and why it is distinct.
5. Define **Task Scope**:
   - In scope: only what the PRD documents.
   - Explicitly out of scope: only what the PRD explicitly excludes. Never infer
     exclusions.
   - Scope boundaries: where this task meets other functionality.
6. Identify **Roles and Permissions**: allowed and restricted actions per role,
   as supported by the PRD.
7. Extract **Business Rules** as numbered (`BR-001`, …), independently verifiable
   statements, one assertion per rule, each with its PRD source.
8. Extract **Expected Behaviors** (`EB-001`, …) that the PRD explicitly states,
   each with its PRD source.
9. Identify **Dependencies** (other tasks, modules, external systems, APIs, data,
   business), only where documentation supports them.
10. List **Assumptions** (`AS-001`, …). Mark each one `Confirmed` (stated in a
    source) or `Unconfirmed`. Never present an assumption as a fact, and never
    turn one into a requirement.
11. Identify **Risks** (`RK-001`, …). Mark each one's basis as `Documented`
    (stated in a source) or `Derived` (QA reasoning). Say why it matters, which
    requirement or area it relates to, and cite the source.
12. Identify **Gaps** (`GAP-001`, …: missing, unclear, contradictory or untestable
    requirements) and **Open Questions** (`OQ-001`, …: specific questions). Name
    an owner **only** if a source or the human explicitly states one. Otherwise
    write `not stated`.
13. Never invent requirements. Never silently resolve an unclear business rule.
    If the PRD does not state something, record it as a GAP or OPEN QUESTION.
14. Build **Traceability**: PRD Section → Requirement → Business Rule / Expected
    Behavior → Scope Area. Use the PRD's own requirement IDs where they exist,
    always qualified as `PRD <ID>` (e.g. `PRD FR-003`) so they are never
    confused with this artifact's own IDs.
    Otherwise cite the section plus a short quote. List any PRD section that
    produced no item.
15. Prepare **QA Scope Preparation** for downstream stages: the areas, UI areas,
    API areas, business rules and data that require exploration or validation,
    by reference to the IDs above. This is preparation only. Do not explore.
16. Write the result to `{{task_path}}/context/ProjectContext.md` using the
    structure in `.claude/skills/project-context/ProjectContext.template.md`. If
    the file already exists, update it in place.

## Expected Outputs

- Exactly one artifact: `{{task_path}}/context/ProjectContext.md`, containing
  sections 1–12 (Task Information, Scope Decomposition, Task Scope, Roles and
  Permissions, Business Rules, Expected Behaviors, Dependencies, Assumptions,
  Risks, Gaps and Open Questions, Traceability, QA Scope Preparation).
- A short review summary to the human: artifact path, counts per section, the
  most important gaps and open questions, and the required approval key.

## Stop Conditions

- **After writing ProjectContext.md: STOP.** Do not explore, design tests,
  execute, generate or prepare automation, draft any later stage, or modify the
  PRD.
- **Before writing anything, STOP and report failure** if:
  - the task folder does not exist,
  - the target is the task template,
  - the PRD is missing, empty or an unfilled placeholder,
  - the PRD is not approved with `PRD_APPROVED`, or changed after approval,
  - there is no active workflow run (`workflow_run_id` is never created here),
  - the PRD delegates its requirements entirely to material that is unavailable.

## Approval Requirements

- Progression to the next stage requires the literal key, sent on its own:

  ```
  PROJECT_CONTEXT_APPROVED
  ```

- "looks good", "approved", "continue", "okay", "proceed", "LGTM", silence, and
  another stage's key are **not** approval.
- If changes are requested, update the **same** `ProjectContext.md` (never
  `-v2` or `-final`), present the revision, and STOP again.
