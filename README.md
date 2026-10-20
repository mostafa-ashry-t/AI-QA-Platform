# AI QA Platform

A reusable, AI-powered QA testing platform built on Claude Code. It drives a
structured QA workflow — from understanding requirements to automated tests and
final reports — and records every step in an auditable **AI QA Execution Journal**.

> **Status:** Foundation plus six skills. The architecture, workflow
> definition, skill registry, journal schemas and task template exist.
> `prd-generation` (v1.0.1), `project-context` (v1.1.1), `exploration` (v1.0.0),
> `test-design` (v1.0.1), `test-review` (v1.0.0, mandatory, ADR-001) and
> `manual-execution` (v1.1.0), `automation-generation` (v1.1.0), `automation-execution`
> (v1.0.0) and `self-healing` (v1.0.0) are implemented; `reporting` is planned.
> Task `orangehrm-ui-api` has completed the stages through manual execution and the
> TC-054 automation milestone (Playwright + TypeScript and SHAFT + Java; journal EVT-0001 – EVT-0049).

## Why it exists

AI can accelerate QA work, but only if its output is trustworthy and repeatable.
This platform exists to:

- apply the same disciplined QA process to any project, not just one app;
- keep AI output grounded in real evidence from the application under test;
- make every AI decision transparent: what prompt it got, what it did, what it
  produced, and how failures were handled;
- keep test automation honest — healing may fix test code, never the expectations.

## The reusable Task Template

Work is organized as **tasks** (a project, user story or feature under test).

```
platform/templates/task-template/     <- immutable template
platform/tasks/<task-name>/           <- one isolated copy per task
```

The template contains:

| Folder | Purpose |
|---|---|
| `context/` | `TaskContext.md` (identity + verbatim intake, written at task creation) and, once produced, `ProjectContext.md` (QA analysis) |
| `prd/` | `PRD.md`: structured requirements |
| `exploration/` | `ExplorationReport.md` (expected vs actual, classified observations) and `evidence/` |
| `test-design/` | `TestCases.md`: designed cases, traceability, technique rationale, gaps (a placeholder until the stage runs) |
| `test-review/` | `TestReview.md`: mandatory review of the exact `TestCases.md` version, with Advisory / Change Required findings (a placeholder until the stage runs) |
| `execution/` | `ExecutionReport.md` (PASS/FAIL/BLOCKED per approved case, failure analysis) and `evidence/` |
| `bugs/` | `BugReports.md`: one report per distinct application defect (a placeholder until defects are found) |
| `automation/` | Generated Playwright tests |
| `automation-execution/` | Automation run results/report |
| `self-healing/` | Healing attempts log |
| `reports/` | Final task deliverables |
| `journal/` | `execution-log.json`, `prompts.json`, `workflow-run.json` (run ID, owned by orchestration) |

## Planned QA workflow

Defined in [`platform/workflows/default-qa-workflow.yaml`](platform/workflows/default-qa-workflow.yaml):

```
0 task creation           (orchestration: task folder, TaskContext.md, workflow run)
1 prd-generation          ⛔ HARD STOP → PRD_APPROVED               (implemented)
2 project-context         ⛔ HARD STOP → PROJECT_CONTEXT_APPROVED   (implemented)
3 exploration             ⛔ HARD STOP → EXPLORATION_APPROVED       (implemented, Playwright MCP)
4 test-design             ⛔ HARD STOP → TEST_DESIGN_APPROVED       (implemented)
5 test-review             ⛔ HARD STOP → TEST_REVIEW_APPROVED       (MANDATORY, implemented; gates 6 and 7; refused while a Change Required finding is open)
6 manual-execution        ⛔ HARD STOP → MANUAL_EXECUTION_APPROVED  (implemented, Playwright MCP; only Valid in Scope = TRUE)
7 automation-generation   (only Needs Automation = TRUE; needs the same current TEST_REVIEW_APPROVED + MANUAL_EXECUTION_APPROVED)
8 automation-execution    (implemented; each binding run independently, credentials from env vars, retries 0)
9 self-healing            (implemented; conditional, loops back to 8; never changes assertions or heals application defects)
10 reporting
```

Each stage maps to a skill in [`platform/registry/skills.yaml`](platform/registry/skills.yaml).
Skills will be implemented one at a time under `.claude/skills/`, with versioned
prompts under `.claude/prompts/`.

## AI QA Execution Journal

Every task keeps a journal (`journal/execution-log.json` + `journal/prompts.json`)
capturing, per step: step number and name, timestamp, skill, prompt and prompt
version, input, tools/MCP used, actions, output, files created/modified,
validation result, errors, fixes, next step and evidence references.

The journal will be rendered as an interactive HTML page so anyone can answer:
*What prompt did the AI receive? What did it do and with which tools? What did it
produce? Why did we move on? What failed, and how was it fixed?*

## Creating a task (future)

1. Copy `platform/templates/task-template/` to `platform/tasks/<task-name>/`.
2. Fill `context/TaskContext.md` with identity and the verbatim intake: user
   story, acceptance criteria, URLs, scope. No analysis.
3. Start a workflow run. Orchestration writes `journal/workflow-run.json` with
   an `active_run_id` such as `RUN-001`.
4. Run the stages in order. Each stage writes into the task folder, appends to
   the task journal, and stops at its approval gate:
   `prd-generation` → `PRD_APPROVED` → `project-context` →
   `PROJECT_CONTEXT_APPROVED` → `exploration` → `EXPLORATION_APPROVED` →
   `test-design` → `TEST_DESIGN_APPROVED` → `test-review` →
   `TEST_REVIEW_APPROVED` → `manual-execution` → `MANUAL_EXECUTION_APPROVED` →
   `automation-generation` …

The template is never modified during task execution.

## First validation project: OrangeHRM

- UI: https://opensource-demo.orangehrmlive.com/
- API: https://api.orangehrm.com/

See [`docs/assignment/assignment-brief.md`](docs/assignment/assignment-brief.md)
for the milestones the platform will be validated against. None have been
completed yet.

## Repository layout

```
.claude/          skills, prompts, Claude Code settings
.playwright-mcp/  Playwright MCP output (screenshots, traces)
platform/         registry, workflows, templates, tasks, knowledge-base
docs/             architecture, assignment, evidence, document templates
reports/          cross-task / final consolidated reports
.mcp.json         MCP server configuration (Playwright)
CLAUDE.md         platform principles for Claude
```
