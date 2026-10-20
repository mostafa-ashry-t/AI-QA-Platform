---
prompt_id: prd-generation
prompt_version: 1.0.0
skill: prd-generation
stage_id: prd-generation
approval_key: PRD_APPROVED
variables: [task_name, task_path, workflow_run_id]
changelog:
  - "1.0.0: Initial version."
---

# Prompt — PRD Generation

> Versioning rule: any change to the text of this file requires a
> `prompt_version` bump. The journal identifies the prompt used for each run by
> `prompt_id` + `prompt_version` and stores one verbatim snapshot of each version,
> with its SHA-256, in the task's `journal/prompts.json`.

## Purpose

Convert the task's supplied information into a structured, traceable **Product
Requirements Document** that the Project Context stage can consume. The PRD
records **documented intent**. It is not an exploration report, test case
document, bug report, automation plan, or execution report.

## Expected Inputs

| Input | Location |
|---|---|
| Task identity (Task ID, Name, Type, Project Name) | `{{task_path}}/context/TaskContext.md` § Identity |
| Project UI / API URL (if provided) | `{{task_path}}/context/TaskContext.md` § Project Entry Points |
| Task description / user story, acceptance criteria, scope, out of scope, additional information (verbatim intake) | `{{task_path}}/context/TaskContext.md` § Task Intake |
| Supporting documents (local only) | Paths listed in the intake or supplied by the user |
| Information supplied by the user in the request | The user's message, recorded verbatim in the journal |
| workflow_run_id | `{{workflow_run_id}}`, from `journal/workflow-run.json` (owned by orchestration) |

## Source-of-Truth Rules

Use sources in this priority order:

1. Explicit user or task requirements
2. Explicit acceptance criteria
3. Explicit project information
4. Verified source information from the provided project URL (see URL rules)
5. Clearly labeled assumptions
6. Unknown, recorded as a GAP or Open Question

- **Never silently fill gaps.** If a statement is not supported by a source,
  mark it `Unknown` or raise an Open Question.
- **Never invent** business rules, roles, permissions, workflows, API behavior,
  validation rules, database behavior, UI behavior, error messages, expected
  results, acceptance criteria, owners, or non-functional values.
- **Never silently resolve ambiguity or conflict.** If two sources disagree,
  record a GAP citing both and do not pick one.
- An assumption never becomes a requirement. Assumptions appear only in §17.

### URL rules

- Check that each provided URL is present and well-formed, and record it as a
  source (`SRC-###`).
- You may perform **at most one plain, non-browser HTTP request per provided
  entry URL**. From it, establish only:
  - (a) whether the URL is reachable, with its HTTP status, and
  - (b) how the resource identifies itself (e.g. its page or document title).
- Do not use a browser or Playwright MCP. Do not navigate, follow links, log
  in, submit forms, inspect the DOM or network traffic, discover or call API
  endpoints, or record UI elements, fields, messages or credentials seen in the
  response. All of that belongs to **Exploration**.
- If a URL is inaccessible, or no suitable tool is available, record the
  limitation and do not fabricate information. Continue with the supplied
  information if it is sufficient. Record what is missing as a GAP or Open
  Question.

## Generation Instructions

1. Read `TaskContext.md` completely, then every supporting document and the
   user-supplied information.
2. Register every source as `SRC-001`, `SRC-002`, … in §2. Cite user-supplied
   chat information as `User message (journal EVT-NNNN)`.
3. Apply the URL rules.
4. Write each section of the PRD structure below. For each statement, cite its
   `SRC-###` (plus section or quote where useful).
5. Split compound statements so each FR and BR is a single, independently
   understandable, traceable and, where possible, testable statement.
6. Preserve supplied acceptance criteria **verbatim** (`AC-###`, keeping any
   original labels). If none were supplied, write exactly:
   `Acceptance criteria were not explicitly provided.`
7. Where a section has no supported content, write the section's required "not
   provided" wording. Never leave a section out.
8. Build §19 Traceability: Source → Requirement → Business Rule → Acceptance
   Criterion.
9. Build §20 QA Preparation Notes: what later stages must explore or validate.
   Never claim that anything has been observed.
10. Write the result to `{{task_path}}/prd/PRD.md`, following
    `.claude/skills/prd-generation/PRD.template.md`.

## PRD Structure

`# Product Requirements Document`, followed by these sections, in order:

1. **Document Information**: PRD ID (`PRD-<task-id>`), Task ID, Task Name,
   Project Name, Task Type, Version, Status, workflow_run_id, Created timestamp,
   Last updated timestamp, and revision history. Timestamps come from the system
   clock and the run ID from the run context. Never fabricate them.
2. **Source Information**: the `SRC-###` register (user or task requirement, UI
   URL, API URL, supporting documents, other sources), with access status for
   URLs.
3. **Problem Statement**: only as described. Do not expand it.
4. **Goal**: the user's stated intent. Do not invent business goals.
5. **User Story**: As a… / I want… / So that…, or `Not provided.`
6. **Scope**: In Scope (documented only), Out of Scope (explicit exclusions
   only), Scope Not Defined.
7. **Actors / Roles**: role, responsibility, and permissions only if explicitly
   stated.
8. **Functional Requirements**: `FR-###`, each with *Requirement* and *Source*.
9. **Business Rules**: `BR-###`, each independently verifiable, with source.
10. **Acceptance Criteria**: verbatim `AC-###`, or the not-provided statement.
11. **Data Requirements**: `DR-###`, known data requirements only. No test data.
12. **UI Requirements**: `UIR-###`, only if explicitly supported. No selectors,
    layouts, field behavior, messages or components unless stated.
13. **API Requirements**: `APIR-###`, only if explicitly supported. No invented
    endpoints, schemas, authentication or status codes. If only an API URL is
    known, record the entry point and mark detailed behavior as
    `Requires exploration`.
14. **Non-Functional Requirements**: `NFR-###` for performance, security,
    accessibility, reliability, compatibility, availability or other attributes
    as provided, or `Not explicitly provided.`
15. **Dependencies**: `DEP-###` for internal modules, external systems, APIs,
    authentication, data, configuration, or other tasks, where supported.
16. **Constraints**: `CON-###` for explicit technology, business, scope,
    environment or data constraints.
17. **Assumptions**: `AS-###` with description, reason, and source or context.
18. **Gaps and Open Questions**: `GAP-###` / `OQ-###` with description,
    related requirement, impact if known, and owner (`not stated` unless
    explicitly provided).
19. **Traceability**: Source → Requirement → Business Rule → Acceptance
    Criterion. Every FR has a source.
20. **QA Preparation Notes**: areas requiring exploration, UI areas requiring
    validation, API areas requiring validation, business rules requiring
    validation, data requiring validation, and unknown behavior requiring
    investigation. This is preparation only.

## Quality Rules

- The PRD is structured, traceable, testable, evidence-based, reusable,
  unambiguous where possible, and explicit about uncertainty.
- One statement per FR / BR / AC. Keep wording neutral, and quote sources where
  precision matters.
- Only requirement content. No test cases, test data, exploration findings, bug
  reports, automation or execution content.
- Nothing about the application beyond what the sources state and what the URL
  rules allow.

## Stop Conditions

- **After writing PRD.md: STOP.** Do not create ProjectContext.md, explore the
  application, generate test cases, execute tests, generate automation or bugs,
  or produce reports.
- **Before writing anything, STOP and report failure** if:
  - the task folder is missing,
  - the target is the template,
  - TaskContext.md is missing,
  - there is no active workflow run,
  - there is no requirement input at all,
  - PRD.md already exists without a journaled `prd-generation` origin (never
    overwrite a human-authored PRD).

## Approval Requirements

- Progression to Project Context requires the exact standalone key:

  ```
  PRD_APPROVED
  ```

- "approved", "looks good", "okay", "continue", "proceed", "LGTM", any other
  text containing the key, the key mixed with other text, silence, and another
  stage's key are **not** approval.
- If changes are requested, update the **same** `PRD.md` (never `PRD-v2.md` or
  `PRD-final.md`), increment the PRD minor version, record the reason and the
  changed sections, present the revision, and STOP again.
