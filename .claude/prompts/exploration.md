---
prompt_id: exploration
prompt_version: 1.0.0
skill: exploration
stage_id: exploration
approval_key: EXPLORATION_APPROVED
variables: [task_name, task_path, workflow_run_id, ui_url, api_url]
changelog:
  - "1.0.0: Initial version."
---

# Prompt — Exploration

> Versioning rule: any change to the text of this file requires a
> `prompt_version` bump. The journal identifies the prompt used for each run by
> `prompt_id` + `prompt_version`. One verbatim snapshot of each version, with its
> SHA-256, is stored in the task's `journal/prompts.json`.

## Purpose

Learn how the application **actually behaves** before any test case is written.
Record every place where reality and the approved Project Context agree or
disagree. Test design that skips this step encodes assumptions instead of
behavior.

```
approved ProjectContext.md + live application → expected vs actual → ExplorationReport.md → HUMAN REVIEW → EXPLORATION_APPROVED
```

## Expected Inputs

| Input | Location | Use |
|---|---|---|
| Approved Project Context | `{{task_path}}/context/ProjectContext.md` | **Expected-behavior baseline** |
| PRD | `{{task_path}}/prd/PRD.md` | Reference only: IDs, sources, entry points |
| Task identity and entry points | `{{task_path}}/context/TaskContext.md` | Task ID, name, project, environment, URLs |
| Live application | UI: `{{ui_url}}` · API: `{{api_url}}` | **Actual behavior**, via Playwright MCP |
| workflow_run_id | `{{workflow_run_id}}` (orchestration-owned, read only) | Journal and report header |

## Prerequisites

Do not explore, and do not open a browser, unless **all** of these hold:

- the task, TaskContext.md, PRD.md and ProjectContext.md exist,
- ProjectContext.md was approved with `PROJECT_CONTEXT_APPROVED`, and that
  approval is current (the file is unchanged since approval, and the PRD approval
  is also current),
- an active `workflow_run_id` exists.

Otherwise, stop and report which prerequisite is missing.

## ProjectContext Rules

- The approved ProjectContext is the **only** expectation baseline. Use its
  in-scope and out-of-scope areas, roles and permissions, business rules
  (`PC BR-###`), expected behaviors (`PC EB-###`), dependencies, risks, gaps,
  open questions and §12 QA Scope Preparation.
- Never rewrite ProjectContext to match the application. Never assume either the
  application or the documentation is correct. Record the difference.
- Exploration never closes a ProjectContext GAP or OQ. It records what was
  observed about it, for a human to judge.

## Exploration Instructions

1. **Plan before touching the browser.** For each area in ProjectContext §12,
   and each in-scope `SA-###`, list:
   - the expected behaviors and rules to compare,
   - the UI or API flow to follow,
   - the data needed.

   This plan is §2 of the report.
2. For each planned area:
   1. identify the expected behavior,
   2. identify the flow,
   3. explore it,
   4. record the actual behavior,
   5. compare expected with actual,
   6. classify,
   7. capture evidence where required.
3. Inspect, where applicable:
   - **fields**: type, required or optional, format, limits, defaults, visible
     and validation behavior
   - **dropdowns**: actual options, ordering, default and empty state, dynamic
     loading where observable
   - **validations**: when they fire, the exact message text, client or server
     side where observable, behavior after invalid input and after correction
   - **dependencies**: fields or sections that change, appear, disappear,
     enable or disable, and links between screens
   - **workflows**: the actual end-to-end path, states, transitions,
     navigation, success and failure behavior
   - **relevant APIs**: only when API behavior is in scope, or needed to
     understand an in-scope UI flow
4. Stay in scope. Follow an out-of-scope area only when it is a dependency of
   an in-scope flow, and record why. Never click through the application at
   random.

## Playwright MCP Rules

- Use the `playwright` MCP server for **all** browser access. It is a
  browser-access and exploration tool, **not** the automation framework.
- Allowed: open the application, navigate, interact with in-scope UI, and take
  accessibility snapshots and screenshots. Read-only DOM inspection of element
  attributes is allowed. So is observing network requests and console messages
  produced by in-scope actions.
- Forbidden:
  - writing automation code of any kind (Playwright tests, Selenium, SHAFT,
    TestNG, Java),
  - using page scripts to alter state, bypass validation or perform actions a
    user could not perform,
  - exploring outside scope without a recorded reason.
- **Data-changing actions:**
  - Only perform them when needed to observe an in-scope flow, and record each
    one as data-changing.
  - Destructive, irreversible or bulk actions, and actions on data not created
    during this exploration, require explicit human confirmation first.
- **Credentials:**
  - Use only credentials supplied by the task inputs or the human.
  - If the application itself displays credentials, record that as an
    observation and ask before using them.
  - Never write passwords, tokens or cookies into the report or journal. Redact
    them.

## Expected vs Actual Rules

Every comparison has exactly this shape:

```
Expected:       <documented expectation from ProjectContext — never an observation>
Actual:         <observed application behavior — never an expectation>
Classification: MATCH | FINDING | GAP | QUESTION | POTENTIAL BUG
Evidence:       EVD-### (or "not required — MATCH", or reason not captured)
Source:         PC BR-### / PC EB-### / PC SA-### (or "none — ProjectContext silent")
```

If ProjectContext is silent, Expected is `Not documented (ProjectContext silent)`.
Never fill Expected with what the application does.

## Classification Rules

Every observation gets **exactly one** classification. Apply these steps in order:

1. **POTENTIAL BUG**: objective malfunction signals, whether documented or not.
   For example: an unhandled error, crash, HTTP 5xx, broken or blank page, lost or
   corrupted data, or exposure of sensitive data. This is suspected, never
   confirmed.
2. **MATCH / FINDING**: a clear documented expectation exists. MATCH if actual
   equals expected. FINDING if it differs. A difference is a FINDING, **not** a
   bug, because the documentation may be the thing that is wrong.
3. **QUESTION**: the expectation exists but is ambiguous or contradictory, or
   judging the behavior needs a human or business decision.
4. **GAP**: ProjectContext is silent about the observed behavior. Do not
   decide what the requirement should be.

Never upgrade a POTENTIAL BUG to a confirmed bug. Never turn an observation
into a requirement or business rule.

## Evidence Rules

- Capture evidence for **every non-MATCH** observation. For a MATCH, evidence is
  optional.
- Evidence types:
  - screenshot
  - accessibility snapshot
  - element attributes
  - URL
  - page title
  - network or API request/response
  - console messages
  - browser state
- Each item gets an `EVD-###` ID and records:
  - type
  - the source MCP action
  - related observation(s)
  - file path in `{{task_path}}/exploration/evidence/`
  - system timestamp
  - SHA-256
- Store evidence files under `{{task_path}}/exploration/evidence/`. Move files
  the MCP server wrote elsewhere (e.g. `.playwright-mcp/`) into that folder.
- Save text evidence verbatim, redacting only secrets and marking each
  redaction.
- If evidence cannot be captured, record an evidence item with
  `capture_status: not_captured` and the real reason. Never fabricate evidence.

## Locator Rules

- For relevant elements, record `LOC-###` with:
  - element description and page,
  - the stable `id`, if present,
  - a meaningful attribute usable in XPath (attribute name and observed value),
  - locator notes,
  - stability observations (e.g. generated or dynamic id, changes on reload,
    position-dependent),
  - related observation and evidence.
- Record **observed attribute values only**. Never record Playwright locator
  syntax (`getByRole`, `getByText`, `getByLabel`, `getByTestId`), Playwright MCP
  snapshot refs (e.g. `ref=e12`, which are session-scoped), or any Selenium,
  SHAFT or TestNG code. The automation stage decides the implementation. It uses
  an ID/XPath preference.

## Output Structure

Write `{{task_path}}/exploration/ExplorationReport.md` following
`.claude/skills/exploration/ExplorationReport.template.md`, with these sections
in this order:

1. Exploration Information
2. Exploration Scope (with the exploration plan)
3. Environment
4. Exploration Method
5. Observations
6. MATCHES
7. FINDINGS
8. GAPS
9. QUESTIONS
10. POTENTIAL BUGS
11. Candidate Locators
12. Dependencies Discovered
13. Coverage Limits
14. Exploration Summary

§14 gives counts and coverage limits only. It gives **no** overall quality
verdict.

## Hard-Stop Rules

After ExplorationReport.md is written: **STOP** and present it for review. Do
not:

- generate or design test cases,
- write automation,
- execute tests,
- create bug reports,
- modify ProjectContext or the PRD,
- continue to Test Design or automation.

## Approval Rules

- The only progression key is the exact, case-sensitive, standalone value:

  ```
  EXPLORATION_APPROVED
  ```

- These are **not** approval: `approved`, `looks good`, `continue`, `proceed`,
  `LGTM`, `EXPLORATION_APPROVED please continue`, any message containing the key
  with other text, silence, or another stage's key.
- Approval unlocks Test Design. It never starts it.

## Revision Rules

1. Update the **same** ExplorationReport.md. Never create `-v2` or `-final`
   copies.
2. Bump the report's minor version, and record the reason and changed sections
   in the Revision History.
3. Re-explore **only** what the revision needs, and capture new evidence with
   new `EVD-###` IDs. Keep earlier evidence files.
4. Keep IDs stable. A withdrawn observation keeps its ID, is marked withdrawn,
   and its ID is never reused.
5. A reviewer's clarification can change a classification. Cite it as
   `Reviewer clarification (journal EVT-NNNN)`. If it changes documented
   expectations, recommend a ProjectContext revision instead of editing it.
6. Present the revision and STOP. `EXPLORATION_APPROVED` is required again.
   Changing an approved report voids its approval.

## Journal Requirements

- For every attempt, change request and gate reply, append an event conforming
  to `platform/schemas/journal-event.schema.json`.
- Record:
  - the verbatim trigger message,
  - the inputs with their hashes,
  - every Playwright MCP action actually performed, in order,
  - observations with their classifications and evidence links,
  - candidate locators, coverage, decisions and validation results,
  - the stop reason and the gate state.
- Never fabricate timestamps, hashes, actions, evidence or results. Use `null`
  plus a note when a value is unavailable.
- If Playwright MCP was not used (e.g. exploration was blocked), record
  "MCP: Not used" with the actual reason.
