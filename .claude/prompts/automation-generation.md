---
prompt_id: automation-generation
prompt_version: 1.1.0
skill: automation-generation
stage_id: automation-generation
approval_key: null
variables: [task_name, task_path, workflow_run_id, ui_url, binding_ids, credential_env_vars, ide]
changelog:
  - "1.0.0: Initial version."
  - "1.1.0: Several independent bindings per task (binding_ids); per-binding project dirs, evidence folders and journal events; binding notes from the first execution."
---

# Prompt — Automation Generation

> Versioning rule: any change to the text of this file requires a
> `prompt_version` bump. The journal identifies the prompt used for each run by
> `prompt_id` + `prompt_version`. One verbatim snapshot of each version, with its
> SHA-256, is stored in the task's `journal/prompts.json`.

## Purpose

Generate UI automation for **exactly** the approved test cases marked
`Needs Automation = TRUE` in task `{{task_name}}` (`{{task_path}}`), whose UI
entry point is `{{ui_url}}`, so that each
automated test performs the approved steps and checks the approved expected
result, and nothing else.

```
approved TestCases (Needs Automation = TRUE) + approved review + approved manual execution
  → resolve framework/binding → select eligible cases → map steps → locators → data → assertions
  → automation project + AutomationGeneration.md → static validation → STOP
```

## Prerequisites

Generate nothing unless **all** of these hold (skill `automation-generation`,
§Prerequisites, codes AG-E01 – AG-E12):

- The PRD, ProjectContext, Exploration and Test Design approvals are current.
- `TEST_REVIEW_APPROVED` is current and bound to the current TestCases.md hash.
- `MANUAL_EXECUTION_APPROVED` is current, and the approved manual execution used
  that same review approval (ADR-001).
- `journal/workflow-run.json` has an active run (`{{workflow_run_id}}`); never create one.
- At least one Active case has `Needs Automation = TRUE` in TestCases.md and TestCases.csv.
- The framework and binding can be resolved, and the toolchain is installed.

If any fails: write nothing, journal a `blocked` `stage_execution`, report, STOP.

## Instructions

1. **Bind.** Record the path, version and SHA-256 of every approved input and the
   approval events used.
2. **Resolve the binding(s).** Framework from the approved ProjectContext, else the
   platform default. Bindings: `{{binding_ids}}` if given (one or more); otherwise
   resolve one as the skill's Framework Resolution section says, and state the
   reason. Several bindings are generated as independent projects (own directory,
   configuration, evidence folder, validation and journal event) with the same case
   mapping, data resolvers and assertions. Verify library versions from the package
   registry and against the installed toolchain (for Java libraries, the release's
   compiler target); pin versions. Apply the skill's binding notes.
3. **Select cases.** Candidates: Active, `Needs Automation = TRUE`. Generate only
   eligible cases whose latest approved manual result is PASS, or FAIL caused by an
   application defect (assertion unchanged; reference the bug). Record every
   candidate not generated with its warning code and reason.
4. **Map steps.** One test per case. Preconditions first, then each approved
   step in order, labeled with its number and verbatim text. Add no action the
   step does not state, except waiting for a state the case names.
5. **Locators.** Prefer stable id → stable attribute → label/container-anchored →
   fixed UI text. Trace each to an ExplorationReport `LOC-###` or record its
   verification. Never use generated classes, absolute XPath, unanchored indexes
   or MCP refs. Playwright MCP may only confirm a locator, read-only.
6. **Waits.** No fixed sleeps. Auto-waiting actions and retrying assertions,
   bounded by central configuration. Wait for named states only.
7. **Assertions.** Exactly the approved expected result, with messages quoting the
   case ID. Run-time values for data-aware comparisons. Never assert a FINDING,
   potential bug or suspected bug as correct behavior.
8. **Test data.** Resolve each `DATA-###` at run time by its definition; fail with
   "test data not available: DATA-###" if none qualifies. No fallback values.
9. **Credentials.** Read only from environment variables
   (`{{credential_env_vars}}`); fail fast naming a missing variable; never log,
   persist or trace a value. IDE run configurations list names with empty values.
10. **Evidence and failure handling.** On failure: screenshot, trace, step log
    under `automation-execution/results/<run-id>/<project-dir>/<case-id>/`; machine-readable
    results; retries 0; no swallowed exceptions; failure messages give case,
    step, expected and actual.
11. **Runs.** One command-line command for Claude Code; a standard project import
    and a shared run configuration for `{{ide}}`. Document first-run setup.
12. **Validate statically** (SV-1 – SV-7): compile, discovery, forbidden patterns,
    secrets, traceability, assertion review, upstream hashes. Never run the tests
    against the application in this stage.
13. **Report.** Write `automation/AutomationGeneration.md` from the template (one
    column per binding), and journal one `stage_execution` per binding
    (`status: completed`, `approval_required: false`)
    with `automation_binding`, `automated_cases`, `locator_decisions`,
    `generated_files` and `static_validation`.

## Rules (never break)

- Never modify TestCases, TestReview, ExecutionReport, BugReports, ProjectContext,
  ExplorationReport, PRD, TaskContext, evidence or templates.
- Never invent steps, expected results, data or locators that are not established.
- Never weaken an assertion to make a test pass; healing belongs to `self-healing`.
- Never store a secret anywhere. Redact as `[REDACTED: <kind>]`.
- Never start `automation-execution`.

## Output

Present: binding(s) and why, generated cases, not-generated candidates with codes,
generated files with hashes, static validation results, environment variables to
set (names only), and the command-line and IDE run instructions. Then STOP.
