# CLAUDE.md — AI QA Platform

This repository is a **reusable AI-powered QA testing platform**. It is not a
test project for one application. OrangeHRM is only the first validation project.

## Layout

- `platform/workflows/` — workflow definitions (stage order + dependencies).
- `platform/registry/skills.yaml` — catalog of skills and their status.
- `platform/templates/task-template/` — the immutable task template.
- `platform/tasks/<task-name>/` — task instances (all generated artifacts live here).
- `platform/knowledge-base/` — reusable, project-agnostic QA knowledge.
- `.claude/skills/`, `.claude/prompts/` — skill implementations and versioned prompts.
- `docs/` — architecture, assignment brief, evidence, document templates.

## Platform Principles

1. **Reusability** — Nothing in `platform/`, `.claude/skills/` or `.claude/prompts/`
   may be hardcoded to a specific application. Project specifics belong in the
   task's `context/TaskContext.md`.
2. **Task isolation** — Each task runs in its own `platform/tasks/<task-name>/`
   folder and never reads or writes another task's artifacts unless told to.
3. **Evidence-based testing** — Every claim about application behavior must be
   backed by evidence (screenshot, response, log, trace) referenced in the journal.
4. **No fabricated application behavior** — Never invent pages, fields, endpoints,
   messages, credentials or results. If something is unknown, say so and mark it
   as an assumption or open question.
5. **Explore before designing** — UI/API exploration must happen before test design.
6. **Test design must be reviewed** — The mandatory `test-review` stage gates both
   `manual-execution` and `automation-generation` (ADR-001). Neither may bypass it,
   even if approved test cases already exist. The approval is bound to the exact
   reviewed `TestCases.md` hash; any later edit voids it. Review findings are
   `Change Required` (blocks approval while open) or `Advisory` (non-blocking), and
   the review never edits test cases.
7. **`Valid in Scope` controls execution** — Only rows with `Valid in Scope = TRUE`
   are executed in `manual-execution`.
8. **`Needs Automation` controls automation** — Only rows with
   `Needs Automation = TRUE` get Playwright automation.
9. **Honest self-healing** — Self-healing may fix locators, waits, setup and test
   plumbing. It must **never** silently change expected behavior or assertions to
   make a test pass. A real application defect is reported as a bug, not healed.
   Every attempt documents reason, change and result.
10. **Journal everything important** — Every significant AI action is recorded in
    the task's `journal/execution-log.json`, with the prompt in `journal/prompts.json`.
11. **Artifacts belong to the task** — Generated files go under the current task
    folder, never in the template, registry or repo root.
12. **Templates are immutable** — Never modify `platform/templates/` during task
    execution. Create a task by copying the template.
13. **Modular skills** — One skill per responsibility; skills communicate through
    files in the task folder, not hidden state.
14. **Replaceable stages** — Each workflow stage can be swapped for another skill
    without changing the other stages, as long as its inputs/outputs are honored.

## Current Status

- Implemented skills: `prd-generation` (v1.0.1), `project-context` (v1.1.1),
  `exploration` (v1.0.0), `test-design` (v1.0.1), `test-review` (v1.0.0),
  `manual-execution` (v1.1.0). All other skills are `planned`.
- `test-review` is **mandatory** (ADR-001). No task reaches `manual-execution` or
  `automation-generation` without a current `TEST_REVIEW_APPROVED`.
- No task instance exists and no testing milestone has been executed. Do not claim
  otherwise.

## Stage Gates

Each gated stage stops after producing its artifact. Only its exact, standalone
approval key unlocks the next stage. General approval ("approved", "looks good",
"continue", …), text containing the key, and the key mixed with other text never
do. Revisions update the same artifact in place.

| Stage | Key | Unlocks |
|---|---|---|
| prd-generation | `PRD_APPROVED` | project-context |
| project-context | `PROJECT_CONTEXT_APPROVED` | exploration |
| exploration | `EXPLORATION_APPROVED` | test-design |
| test-design | `TEST_DESIGN_APPROVED` | test-review |
| test-review | `TEST_REVIEW_APPROVED` (ADR-001; refused while a `Change Required` finding is open) | manual-execution, automation-generation |
| manual-execution | `MANUAL_EXECUTION_APPROVED` | automation-generation (which also needs the same current `TEST_REVIEW_APPROVED`) |

## Ownership Rules

- `workflow_run_id` is owned by the workflow orchestration layer
  (`journal/workflow-run.json`). Skills read it and never create it.
- `context/TaskContext.md` holds task identity metadata and verbatim intake only.
  It is written at task creation, never by skills.
- `prd/PRD.md` holds structured requirements (`prd-generation`).
- `context/ProjectContext.md` holds the QA analysis of the approved PRD
  (`project-context`).
- `exploration/ExplorationReport.md` and `exploration/evidence/` hold observed
  behavior against the approved ProjectContext (`exploration`).
- `test-design/TestCases.md` holds the designed test cases, with per-case
  `Valid in Scope` / `Needs Automation` flags, derived from both approved sources
  (`test-design`). Expected results are never invented; unsupported ones are
  `Not established` → Exploratory / Open Question.
- `test-review/TestReview.md` holds the review of exactly one `TestCases.md` version
  (bound by SHA-256, together with the approved ProjectContext and
  ExplorationReport hashes): findings and proposed changes with reasons. It never
  edits test cases (`test-review`).
- `execution/ExecutionReport.md` and `execution/evidence/` hold the results of executing
  the approved cases (`manual-execution`). `bugs/BugReports.md` holds one report per
  distinct application defect, and is written only when such defects exist.

## Secrets Rule

Passwords, tokens, API keys, session cookies and personal credentials are never
stored in journals, reports, evidence, HTML or bug reports. Text is redacted as
`[REDACTED: <kind>]`, and each redaction is recorded. Credentials are referenced by
source name only.

## Tooling Rule

Playwright MCP (`.mcp.json` → `playwright`) is a **browser-access and
exploration tool**. It is used only by stages that observe the live
application (`exploration`, `manual-execution`). It is **not** the automation framework.
Automation uses Selenium + SHAFT + Java + TestNG with an ID/XPath locator
preference. PRD Generation and Project Context never use it.

Journal events follow `platform/schemas/journal-event.schema.json`; see
`docs/architecture/ai-qa-execution-journal.md`. Platform-level architecture
decisions are recorded in `docs/architecture/decisions/`.
