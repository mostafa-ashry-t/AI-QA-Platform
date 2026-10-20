---
name: self-healing
description: Self-Healing stage of the AI QA Platform. Investigates non-passing automation runs recorded by automation-execution, using only the preserved evidence (errors, step logs, screenshots, traces, console logs, fork dumps, framework internals). Classifies each failure as environment, configuration, framework defect, test data, test script or application. Applies only justified fixes to locators, waits, setup, configuration and test plumbing of the affected binding; never changes expected results, assertions, steps or approved artifacts; never heals an application defect. Preserves the original failure evidence, asks automation-execution for one verification rerun of the affected binding, and documents every attempt in self-healing/healing-log.md and the journal. Use when asked to "heal", "fix the failing automation", "investigate the automation failure", or after an automation run fails.
---

# Self-Healing

## Stage Identity

| Field | Value |
|---|---|
| Skill | `self-healing` |
| Skill version | `1.0.0` |
| stage_id | `self-healing` (conditional; loops back to `automation-execution`) |
| Prompt | [`.claude/prompts/self-healing.md`](../../prompts/self-healing.md). `prompt_id: self-healing`, `prompt_version: 1.0.0` |
| Output structure | [`healing-log.template.md`](healing-log.template.md) |
| Journal event template | [`journal-event.template.json`](journal-event.template.json) |
| Journal schemas | [`journal-event.schema.json`](../../../platform/schemas/journal-event.schema.json) (v1.7.0: `healing_attempts`), [`prompt-record.schema.json`](../../../platform/schemas/prompt-record.schema.json) |
| Upstream | `automation-execution` (a non-passing run with failure class ≠ `application`) |
| Downstream | `automation-execution` (one verification rerun per attempt) |
| Approval key | None. Guardrails below are absolute. |
| MCP | **Optional, read-only.** Playwright MCP may confirm a locator or an observed state on the live page; it never performs the test. |

```
non-passing run (results/<run-id>/<project-dir>/ preserved) + approved TestCases + AutomationGeneration.md
        ↓  investigate evidence → classify → (application? → report, STOP for that failure)
   minimal justified change (one binding) → healing-log.md + journal
        ↓  automation-execution: one verification rerun (new run ID, cites the healing ID)
   fixed | not_fixed (next attempt, max 3) | escalated
```

## Purpose

Return broken automation to a trustworthy state without hiding anything: a test may
only pass after healing because the **test code or its environment** was wrong,
never because the expectation was weakened. Every attempt is reviewable.

## Guardrails (absolute)

| Allowed (with evidence and reason) | Forbidden |
|---|---|
| Locators (to another stable, traced locator) | Changing or removing an assertion, its comparison or its expected value |
| Waits for a named state; timeout values in configuration | Fixed sleeps, `networkidle`, retries > 0, `force` clicks, catch-and-ignore |
| Setup, fixtures, evidence capture, step logging | Changing the approved steps, their order, or the test data definitions |
| Build/runner configuration, dependency pins, toolchain selection per command | Editing TestCases, TestReview, ExecutionReport, BugReports, ProjectContext, ExplorationReport, PRD, evidence |
| Environment actions (install a browser, select a JDK) — no code change | Healing an application defect; changing bug statuses or creating bugs |
| Parsing/normalizing values read from the page (e.g. whitespace) when the approved value is unchanged | Storing credentials or session state anywhere |

`assertion_changed` is always `false`. If the only way to pass would change an
assertion or step, stop: the case needs a Test Design revision (`SH-E04`).

## Trigger Conditions

Run for a **named task** and one or more failed run IDs handed over by
`automation-execution` (or named by the human). Never start on a passing run.

## Prerequisites

| # | Prerequisite | Failure |
|---|---|---|
| 1 | Task exists; `active_run_id` non-null | `SH-E01` |
| 2 | Each named run has a folder under `automation-execution/results/` and an `automation_runs` journal entry with outcome `failed`, `not_run` or `harness_failed` | `SH-E02` |
| 3 | The failure evidence of the run is present and its journaled hashes still match | `SH-E03` |

## Inputs

| Input | Use |
|---|---|
| Failed run folder (`results/<run-id>/<project-dir>/`) and console log | Primary evidence (read only) |
| `automation/<project-dir>/` | The code to diagnose and, if justified, change |
| `automation/AutomationGeneration.md` | Locator sources, data resolvers, binding notes |
| Approved `TestCases.md`, `ExplorationReport.md` | The contract and observed behavior (read only) |
| `journal/execution-log.json` | The run's `automation_runs` entry and evidence IDs |
| `self-healing/healing-log.md` | Previous attempts (IDs continue) |

## Outputs

| Kind | Path | Notes |
|---|---|---|
| Healing log | `self-healing/healing-log.md` | Created from the template on first use, then updated in place: new rows and sections appended, earlier attempts never rewritten |
| Code/config changes | `automation/<project-dir>/…` | Minimal; each file's SHA-256 before and after recorded |
| Journal | `journal/execution-log.json`, `journal/prompts.json` | One `stage_execution` per request, with `healing_attempts` |

## Investigation Procedure

1. **Read the evidence first**, newest layer to oldest: assertion/error message, step
   log (last completed step), screenshot, trace or Allure steps, console log, fork
   dumps. Note what the application showed versus what the code expected.
2. **Locate the failure point**: test code, page object, fixture/base class, runner
   configuration, framework internals (stack frames in framework packages; inspect
   the framework's classes or sources read-only if needed), toolchain, environment.
3. **Classify** with the table below. Cite the evidence that decides it.
4. **Reproduce cheaply** where possible without the application (compile, discovery,
   running the failing tool command by hand, a read-only probe). Record the result.

| Class | Decided when | Action |
|---|---|---|
| `application` | Steps performed as approved; the approved expected result is not met (real values in the assertion message) | **No heal.** Record `not_healed_application_defect`; report to the human for the bug process |
| `test_data` | `[TEST DATA]` failure: no data satisfies the DATA-### definition at run time | No code change unless the resolver contradicts the definition; otherwise report |
| `environment` | Missing/mismatched browser, driver, JDK, network, path or OS issue | Environment action, or an opt-in configuration switch; no hard-coded machine values in the project |
| `configuration` | Build/runner/framework settings wrong or missing | Minimal configuration change |
| `framework_defect` | Fault inside the framework's code under valid configuration | Workaround through supported configuration; document the defect and the version |
| `test_script` | Locator, wait or parsing in generated code disagrees with the approved, observed behavior | Minimal code change within the guardrails |

## Fix Rules

- One root cause per attempt; the smallest change that removes it; one binding only.
  The same defect in another binding is a separate attempt for that binding.
- Prefer configuration and environment actions over code changes; never add a
  machine-specific value to the project (use an empty-by-default switch instead).
- A changed locator must still trace to `LOC-###` or a recorded verification.
- Every change carries a comment with the healing ID.
- Static checks after the change: compile/type-check, discovery, forbidden-pattern scan.

## Rerun and Escalation

- Ask `automation-execution` for **one** verification run of the affected binding
  (only the affected cases), as a new run ID that cites the healing ID.
- `fixed` only when that run's outcome is `passed`. A run whose tests pass but whose
  build fails is `harness_failed`: the attempt is `not_fixed`.
- At most **3 attempts per failure**. Then record `escalated` with what is known, and STOP.

## Evidence Preservation

- The failed run's folder is never modified, moved or deleted; evidence created by the
  investigation (probe output) goes to the scratchpad or is described in the log.
- Healing log entries cite evidence by task-relative path or `EVD-###`.

## Validation Rules

| Check | Rule |
|---|---|
| SH-V01 | Every attempt has: ID, binding, failed run, symptom, classification, root cause, evidence, change, files with hashes before/after, verification run, result |
| SH-V02 | `assertion_changed = false` for every attempt; diff of the test's assertion lines is empty |
| SH-V03 | No approved artifact or failure evidence changed (hashes before = after) |
| SH-V04 | No forbidden pattern introduced; compile/discovery pass for the changed binding |
| SH-V05 | No credential value in the healing log, journal or changed files |
| SH-V06 | `application` failures have no code change and are reported to the human |

## Failure Conditions

| Code | Condition | Event status |
|---|---|---|
| SH-E01 – SH-E03 | Prerequisites | `blocked` |
| SH-E04 | Passing would require changing an assertion, step or approved artifact | `failed` (recommend Test Design revision) |
| SH-E05 | 3 attempts without a fix | `completed` with result `escalated` |

## Journal Integration

`stage_execution`, `status: completed` (or `blocked` / `failed`),
`approval_required: false`, with `healing_attempts` (schema 1.7.0), `fixes` (one line
per attempt), `decisions`, `output_artifacts` (healing log, changed files), and
`validation` (SH-V01 – SH-V06). The verification run itself is journaled by
`automation-execution`.

## Stop Behavior

Present per attempt: ID, classification, root cause, change, verification run and
result; list application failures reported to the human. Then STOP.
