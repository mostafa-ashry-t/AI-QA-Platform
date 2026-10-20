---
name: automation-generation
description: Automation Generation stage of the AI QA Platform. Turns ONLY the approved test cases with Needs Automation = TRUE into maintainable UI automation code under platform/tasks/<task-name>/automation/, in the framework the task's approved ProjectContext names (platform default otherwise). One test per case, every step traced to its approved text, expected results asserted exactly as approved, data resolved at run time, credentials read from environment variables only. Statically validates the project (compile, test discovery, forbidden-pattern and secret scans) and writes automation/AutomationGeneration.md. Never runs the suite against the application, never changes test cases or expected results, never heals. Use when asked to "generate the automation", "automate the approved cases", "create the Playwright tests", or "revise the generated automation".
---

# Automation Generation

## Stage Identity

| Field | Value |
|---|---|
| Skill | `automation-generation` |
| Skill version | `1.1.0` (1.1.0: several independent bindings per task; `playwright-ts` and `shaft-java-testng` scaffolds; toolchain lessons from the first execution) |
| stage_id | `automation-generation` (ordering is owned by the workflow, not this skill) |
| Prompt | [`.claude/prompts/automation-generation.md`](../../prompts/automation-generation.md). `prompt_id: automation-generation`, `prompt_version: 1.1.0` |
| Output structure | [`AutomationGeneration.template.md`](AutomationGeneration.template.md) |
| Project scaffolds | [`scaffold/playwright-ts/`](scaffold/playwright-ts/), [`scaffold/shaft-java-testng/`](scaffold/shaft-java-testng/), [`scaffold/playwright-java-testng/`](scaffold/playwright-java-testng/) (generic; placeholders only) |
| Journal event template | [`journal-event.template.json`](journal-event.template.json) |
| Journal schemas | [`journal-event.schema.json`](../../../platform/schemas/journal-event.schema.json) (v1.6.0), [`prompt-record.schema.json`](../../../platform/schemas/prompt-record.schema.json), [`workflow-run.schema.json`](../../../platform/schemas/workflow-run.schema.json) |
| Upstream | `manual-execution` (`MANUAL_EXECUTION_APPROVED`) and `test-review` (`TEST_REVIEW_APPROVED`, the **same** approval the approved manual execution used; ADR-001) |
| Downstream | `automation-execution` (runs the generated suite), then `self-healing` when needed |
| Approval key | None. The workflow defines no gate for this stage: it stops after producing its output, and orchestration decides when `automation-execution` starts. |
| MCP | **Optional, read-only.** Playwright MCP may be used only to confirm that a locator is present and unique on the live page. It never executes a test case. |

```
APPROVED TestCases.md (Needs Automation = TRUE) + APPROVED TestReview + APPROVED ExecutionReport
 + APPROVED ProjectContext (framework) + APPROVED ExplorationReport (candidate locators, observed flows)
        ↓
   AUTOMATION GENERATION (resolve framework → select cases → map steps → locators → data → assertions)
        ↓
   automation/<project> + automation/AutomationGeneration.md
        ↓  static validation only (compile, discovery, scans) — no run against the application
   STOP → automation-execution (runs it) → self-healing (only for test-code failures)
```

## Purpose

Produce automation that a reviewer can trust and that a developer can maintain:
each automated test performs exactly the approved steps, checks exactly the
approved expected result, and fails loudly and informatively when the application
does not behave as approved. Automation is a faithful encoding of the approved
test case. It is not a new test design.

## Separation of concerns

| Concept | For this stage |
|---|---|
| **Skill** (this file) | *How* cases are selected, mapped, coded, validated and journaled. |
| **Prompt** (`.claude/prompts/automation-generation.md`) | The versioned *instruction*. Recorded by id and version, with the verbatim text in `prompts.json`. |
| **Workflow** (`default-qa-workflow.yaml`) | *When* the stage runs: after `MANUAL_EXECUTION_APPROVED`, with the same current `TEST_REVIEW_APPROVED`. |
| **Journal** (`journal/*.json`) | *What actually happened*: binding, framework decision, files and hashes, case mapping, locator decisions, validation. |
| **Artifacts** | The automation project under `automation/` and `automation/AutomationGeneration.md`. |
| **Playwright MCP** | A browser-access tool used read-only for locator confirmation. **Never** the automation framework, and never a code generator or recorder. |

## Trigger Conditions

Run when a human, or the orchestration layer, asks to generate, regenerate or
revise automation for a **named task**. If no task is named, ask. Never guess a
task. The skill never starts itself, and never starts `automation-execution`.

## Prerequisites

Check all of these, in order, before writing any file:

| # | Prerequisite | Failure |
|---|---|---|
| 1 | `platform/tasks/<task-name>/` exists and is not under `platform/templates/` | `AG-E01` / `AG-E02` |
| 2 | `context/TaskContext.md` exists and names a UI entry point | `AG-E03` |
| 3 | PRD, ProjectContext and Exploration approvals are current (post-approval hashes equal the current files; no later run of those stages) | `AG-E04` |
| 4 | `TEST_DESIGN_APPROVED` is current for the current `TestCases.md` | `AG-E05` |
| 5 | `TEST_REVIEW_APPROVED` is current: its post-approval TestReview hash equals the current file, its `review_binding.reviewed_test_cases.sha256` equals the current TestCases hash, and no later test-design or test-review `stage_execution` exists | `AG-E06` |
| 6 | `MANUAL_EXECUTION_APPROVED` is current: the post-approval hashes of `ExecutionReport.md` (and `BugReports.md` if it exists) equal the current files, and no later `manual-execution` `stage_execution` exists | `AG-E07` |
| 7 | **Same review** (ADR-001): the approved manual execution was performed against the TestCases hash bound by the current `TEST_REVIEW_APPROVED` | `AG-E08` |
| 8 | `journal/workflow-run.json` → `active_run_id` is non-null (owned by orchestration; never created here) | `AG-E09` |
| 9 | At least one Active case has `Needs Automation = TRUE` (TestCases.md **and** TestCases.csv agree) | `AG-E10` |
| 10 | The framework can be resolved (see [Framework Resolution](#framework-resolution)) | `AG-E11` |
| 11 | The required toolchain for the resolved binding is installed (e.g. JDK and build tool; or Node.js), at a version the binding supports. A Java **runtime** without a compiler (`javac`) does not qualify; an installed JDK may be selected for the stage's commands only (e.g. `JAVA_HOME` per command), never by changing system settings, and its path and version are recorded | `AG-E12` |

If any prerequisite fails:

- write no automation file and no report,
- do not use Playwright MCP,
- append a `stage_execution` event with `status: blocked`, the error code, and the reason,
- report and STOP.

## Inputs

| Input | Path | Use |
|---|---|---|
| **Approved TestCases.md** | `test-design/TestCases.md` | The contract: steps, expected result (verbatim), preconditions, test data (`DATA-###`), flags |
| TestCases.csv | `test-design/TestCases.csv` | Cross-check of `Needs Automation` / `Valid in Scope` |
| **Approved TestReview.md** | `test-review/TestReview.md` | Binding; open Advisory findings that affect the selected cases |
| **Approved ExecutionReport.md** | `execution/ExecutionReport.md` | Latest manual result of each selected case; deviations; test case issues; environment notes |
| BugReports.md | `bugs/BugReports.md` | Bugs that touch a selected case (never asserted as correct behavior) |
| **Approved ProjectContext.md** | `context/ProjectContext.md` | Framework decision (e.g. a task-specific constraint), automation rules, IDE / runner expectations |
| **Approved ExplorationReport.md** | `exploration/ExplorationReport.md` | Candidate locators (`LOC-###`), observed flows, coverage limits |
| TaskContext.md | `context/TaskContext.md` | Identity and UI entry point (base URL) |
| Approvals | `journal/execution-log.json` | Prerequisites 3–7 |
| Run context | `journal/workflow-run.json` | `active_run_id`, read only |
| Human decisions | journal `revision_request` / request text | Credential source, IDE expectations, language choice when not otherwise decided |
| Prompt | `.claude/prompts/automation-generation.md` | Loaded, hashed and recorded |
| Previous output | `automation/` | On revisions only |

## Outputs

| Kind | Path | Notes |
|---|---|---|
| **Automation project** | `automation/<project-dir>/` | Build file, run configuration, source, README. Created on the first attempt; updated in place on revisions. |
| **Generation report** | `automation/AutomationGeneration.md` | From the template. Always produced by a completed attempt. |
| Journal | `journal/execution-log.json`, `journal/prompts.json` | Events and the prompt snapshot. |

Runtime results (reports, screenshots, traces, videos) are **not** outputs of this
stage. The generated code writes them under `automation-execution/` at run time,
which belongs to `automation-execution`.

Nothing else is created or modified. TestCases, TestReview, ExecutionReport,
BugReports, ProjectContext, ExplorationReport, PRD, TaskContext, evidence and the
template are never written.

## Responsibilities

- Resolve the framework and language binding, and record the decision and its source.
- Select exactly the eligible cases ([Case Selection](#case-selection)).
- Generate one automated test per selected case, mapping every approved step to
  code, in order, with the step text quoted in a comment or step label.
- Assert exactly the approved expected result.
- Resolve every `DATA-###` at run time as its definition says. Never freeze a
  value observed during manual execution into the code.
- Read credentials and environment-specific settings from environment variables.
- Choose locators by the [selector rules](#selector-rules), and trace each one to
  a `LOC-###` or to recorded verification evidence.
- Configure failure evidence capture (screenshot, trace, step log) and a
  machine-readable result output for `automation-execution`.
- Make the project runnable from the command line (Claude Code) **and** importable
  into the IDE the task names, with a run configuration that carries no secret.
- Statically validate the project, and write the generation report.

## Non-Responsibilities

This stage never does any of the following:

- Run the generated tests against the application, or report pass / fail results.
- Edit test cases, expected results, flags or test data definitions; or design new cases.
- Automate a case whose `Needs Automation` is not TRUE, or an Exploratory case.
- Weaken, broaden or remove an assertion; assert observed defective behavior as
  correct; or add retries, waits or catches that hide a failure.
- Heal failing tests (that is `self-healing`), or change the application.
- Use Playwright MCP to generate, record or "codegen" tests, or carry MCP snapshot
  refs (`ref=e12`) into code.
- Store credentials, tokens or session state in code, configuration, IDE run
  configurations, reports or the journal.
- Change bug statuses, approvals, or the global platform rules.

## Framework Resolution

Resolve in this order, and record the winning source in the journal
(`automation_binding.decision_source`) and the report §3:

1. **Framework** — a framework named by the approved ProjectContext (a business
   rule or constraint such as "the automation framework for this task is X") wins
   for that task. Otherwise the platform default from CLAUDE.md Tooling Rule
   (Selenium + SHAFT + Java + TestNG) applies.
2. **Language / runner binding** — in order: a binding named by the approved
   ProjectContext or TaskContext; a binding stated by the human (journaled);
   otherwise the binding that (a) belongs to the platform's language stack
   (Java + TestNG + Maven), and (b) the IDE named by the task can run without
   extra paid plugins. State the reason in `decisions`.
3. **Several bindings** — when the human asks for more than one framework (for
   example, to compare them), generate each binding as an **independent project**:
   its own directory, build file, configuration, page objects, tests, README, run
   configuration and evidence folder. No code or configuration is shared between
   bindings, each one is validated on its own, and one may fail without blocking
   the others. All bindings implement the same case mapping, test data resolvers
   and assertions, so their results are comparable. The report has one column per
   binding; the journal has one `stage_execution` event per binding.
4. **Versions** — use the current stable release of each library at generation
   time, verified from the package registry, and pin it exactly in the build file.
   Verify the installed toolchain against the library's documented minimum
   (for Java libraries: the release's compiler target / class-file version).
   If the newest release needs a newer toolchain than the one decided (e.g. a
   human-required Java level), pin the newest release that supports it and record
   why. Never guess a version.

Supported bindings in this skill version:

| Binding id | Framework | Language / runner / build | Scaffold | Default project dir |
|---|---|---|---|---|
| `playwright-ts` | Playwright Test | TypeScript + `@playwright/test` + npm | `scaffold/playwright-ts/` | `playwright-ts` |
| `shaft-java-testng` | SHAFT Engine on Selenium WebDriver (platform default) | Java + TestNG + Maven | `scaffold/shaft-java-testng/` | `shaft-java` |
| `playwright-java-testng` | Playwright for Java | Java + TestNG + Maven | `scaffold/playwright-java-testng/` | `playwright-java` |

A binding without a scaffold may be generated, but the report must say so and the
static validation must still pass.

### Binding notes (learned from executions; apply when generating)

| Binding | Note |
|---|---|
| `playwright-ts` | Browser binaries are tied to the exact Playwright version: document `npx playwright install <browser>` as first-run setup. Start tracing only **after** steps that type secrets (fixture-managed tracing, config `trace: 'off'`). Regex text assertions match the element's raw text: allow surrounding whitespace (`^\s*…\s*$`) or compare trimmed values. A `--list` run must use `--reporter=list` so discovery writes no reports. |
| `shaft-java-testng` | SHAFT's newest releases may require a newer JDK than the task's Java level: check each release POM's compiler target and pin accordingly. Register `com.shaft.listeners.TestNGListener` in `testng.xml`; set `rp.enable=false` as a Surefire system property unless ReportPortal is used; add the AspectJ weaver `-javaagent` to the Surefire `argLine`; type secrets with `typeSecure`; use Selenium `WebDriverWait` for named states SHAFT has no wait for. SHAFT generates its Allure report at the end of every run and runs the Allure CLI from `user.home` without quoting: provide an empty-by-default `shaft.extraArgLine` property for `-Duser.home=<path without spaces>`. SHAFT writes default property files, listener service files and report folders into the project at run time: git-ignore them. |
| `playwright-java-testng` | Playwright for Java needs a JDK (not a JRE); TestNG 7.12 requires Java 11+. |

## Case Selection

1. **Candidates:** Active cases in the approved TestCases.md with
   `Needs Automation = TRUE` in **both** the Markdown and the CSV.
2. **Eligible:** candidates that are `Valid in Scope = TRUE`, not Exploratory, and
   have an established expected result. A candidate failing any of these is a
   test-design inconsistency: do not automate it; record `AG-W01` and recommend a
   Test Design revision.
3. **Latest approved manual result** of each eligible case:

   | Manual result | Action |
   |---|---|
   | PASS | Generate. |
   | FAIL with `APPLICATION_DEFECT` | Generate unchanged. The test is expected to fail until the bug is fixed; reference the `BUG-###` in the test metadata. Never adapt the assertion to the defect. |
   | FAIL with any other cause | Do not generate; record `AG-W02` with the cause (the case or data must be fixed first). |
   | BLOCKED or not executed | Do not generate; record `AG-W03` (the steps were never shown to be performable). |

4. A case that a human explicitly excludes is listed as not generated, with the reason.

## Project Structure Rules

- One project per binding under `automation/<project-dir>/` (default `<project-dir>`
  from the binding table; recorded in the report). Sources, configuration and build
  files only; no results.
- **Configuration** in one place (`Config`): base URL, browser, headless flag,
  timeouts, artifacts directory. Every value has an environment variable and a
  safe, non-secret default. Credentials have **no** default.
- **Page objects** (one per page or component used): locators as private
  members, user-level actions as methods. Tests never contain raw selectors.
- **Tests:** one test class per case (or per feature, one method per case),
  named after the case ID and title, e.g. `TC_123_ShortTitleTest.caseTitle()`.
  Test metadata carries the case ID, title, priority and source references.
- **Base test / fixtures:** browser lifecycle, tracing, failure evidence, step logging.
- **No shared mutable state** between tests; each test sets up its own preconditions
  as its approved Preconditions describe. No dependency on test order.
- **README** in the project: prerequisites, environment variables (names only),
  how to run from the command line and from the IDE, where results go.
- **`.gitignore`**: build output, `automation-execution` results, `.env` files,
  IDE workspace files, browser caches.

## Step Mapping Rules

- Every approved step maps to one labeled code block, in the same order:
  `step(N, "<verbatim approved step text>")` followed by the actions.
- Preconditions map to a labeled `precondition(...)` block before step 1.
- A step that needs several UI actions keeps them inside its block; no action is
  added that the step does not state, except waiting for a state the step itself
  names or that the approved case requires before reading a value.
- A step that cannot be expressed with the approved UI flow is **not invented**:
  stop generating that case, record `AG-W04`, and recommend a Test Design revision.
- Values the case notes during execution (e.g. "note the count k") become local
  variables read from the page at run time.

## Selector Rules

Order of preference (the global locator preference is ID / XPath; the first
stable option wins):

1. A stable `id` attribute.
2. A stable, meaningful attribute: `name`, `type`, `placeholder`, `aria-*`,
   `role` with accessible name, `data-*` test attributes.
3. An element anchored to its visible label or container (label-relative XPath,
   or the framework's role / label locators), when the element itself has no
   stable attribute.
4. Visible text, only for elements whose text is fixed UI copy (not data).

Rules:

- Every locator traces to an ExplorationReport `LOC-###`, or is recorded in
  `locator_decisions` with the verification evidence (read-only MCP check or DOM read).
- **Forbidden:** generated or hashed class names, absolute XPath from the document
  root, bare positional indexes (`nth(2)`, `[3]`) unless anchored to a stable
  parent and justified, MCP snapshot refs, coordinates.
- Data-bearing elements (names, counts) are located structurally, and their text
  is **read**, never used as a hard-coded locator.
- A locator must match exactly one element in the state where it is used; a list
  locator must say so explicitly.

## Wait Rules

- **No fixed sleeps**: `Thread.sleep`, `page.waitForTimeout`, `setTimeout`-style
  pauses are forbidden.
- Use the framework's auto-waiting actions and web-first assertions (retrying
  `expect` / `assertThat`), bounded by the central timeout.
- Wait for a **named state** before reading a value: an element visible, a text
  pattern present, a list non-empty, a request finished. The state must be one the
  approved step or expected result describes, or one the ExplorationReport
  documents as a prerequisite of the read.
- Do not rely on `networkidle`. Do not add arbitrary "stabilisation" waits.
- Timeouts come from configuration; per-call overrides need a comment with the reason.

## Assertion Rules

- Assert **exactly** the approved expected result: the same state, the same
  values, the same comparison. Each assertion message quotes the case ID and the
  expected result.
- One case → one expected result → the assertions needed to check that single
  result. No extra assertions on unrelated behavior.
- Data-aware expectations (e.g. "N greater than k") compare values read during
  the run. Never compare with numbers observed during manual execution.
- Use retrying (web-first) assertions for UI state; plain assertions only for
  values already read.
- Never assert behavior recorded as a FINDING, a POTENTIAL BUG or a suspected
  `BUG-###` as if it were correct.
- Soft assertions only when the approved expected result is one state made of
  several checks; the test must still fail at the end if any part failed.

## Test Data Rules

- Each `DATA-###` the case uses is resolved at run time, in a helper named after
  the data ID, implementing the definition's selection rule (e.g. "read from a
  displayed result card"). If no data satisfies the definition at run time, the
  test fails with a clear "test data not available: DATA-###" message. It never
  silently falls back to another value.
- Fixed inputs that the approved case states literally may be constants.
- No data-changing action unless the approved case performs it; never on data the
  test did not create.

## Credentials and Secrets

- Credentials come **only** from environment variables:
  `QA_USERNAME`, `QA_PASSWORD` (plus `QA_BASE_URL` for the entry point, which is
  not secret). A task may choose other names; record them in the report.
- At start-up the configuration fails fast with a message naming the **missing
  variable**, never its value.
- Never print, log, screenshot-annotate, trace-label or persist a credential.
  Tracing must not record typed secrets as visible text (mask or exclude the
  login step's input values where the framework allows; otherwise state the risk).
- IDE run configurations list the variable **names** with empty values; the human
  fills them locally. `.env` files are git-ignored and never generated with values.
- Redact as `[REDACTED: <kind>]` in every report and journal entry.

## Evidence Rules (runtime, configured here)

- On failure: full-page screenshot, Playwright trace (or the binding's
  equivalent), and the step log, written to
  `automation-execution/results/<run-id>/<project-dir>/<case-id>/`. On pass: the
  step log and a final-state screenshot (cheap evidence for the execution report).
- Every test writes a machine-readable result (JUnit / TestNG XML or JSON) that
  `automation-execution` turns into the HTML report.
- Step log lines: `[<case-id>] Step N: <approved step text>` and the observed
  values the step reads (never secrets).
- Videos are optional and off by default.

## Failure Handling Rules (in the generated code)

- No `try/catch` that swallows an exception; catch only to attach evidence, then rethrow.
- Retries are **0** by default. A retry setting greater than 0 needs a human
  decision recorded in the journal, and every retry is reported.
- A failure message states the case ID, the step number and text, and the
  expected vs actual value.
- Configuration and test-data failures are distinguishable from assertion
  failures (different exception types or message prefixes), so that
  `automation-execution` can classify them.
- Known defects: a case tied to an open `BUG-###` keeps its assertion; the test
  metadata names the bug so the execution report can link the failure.

## IDE and Command-Line Runs

- **Command line (Claude Code):** one documented command runs the selected cases,
  e.g. `mvn -q test` or `npx playwright test`. It needs only the environment
  variables.
- **IDE:** the project imports as a standard project of its build tool (Maven /
  npm). Provide a shared run configuration (e.g. `.run/*.run.xml` for IntelliJ)
  that runs the suite with the environment variable names and empty values.
  Record which IDE edition the binding supports.
- First-run setup (browser download) is documented, not executed by this stage.

## Scaffold Usage

Every scaffold is generic. Copy the binding's scaffold into
`automation/<project-dir>/`, renaming `*.template` files, `__package__` to the
package path and `__run_name__` to the run configuration name, and fill the
placeholders. The `playwright-java-testng` placeholders are listed below; the other
scaffolds use the same names plus:

| Placeholder | Scaffold | Source |
|---|---|---|
| `{{binding_dir}}` | all new | The project dir; evidence goes to `<artifacts>/<run-id>/{{binding_dir}}/` |
| `{{typescript_version}}`, `{{types_node_version}}` | `playwright-ts` | npm registry at generation time, pinned |
| `{{shaft_version}}`, `{{aspectj_version}}` | `shaft-java-testng` | Maven Central: newest SHAFT whose compiler target ≤ `{{java_level}}`; the AspectJ weaver version SHAFT's own POM uses |
| `{{default_timeout_s}}` | `shaft-java-testng` | `{{default_timeout_ms}}` / 1000 |

`playwright-java-testng` placeholders:

| Placeholder | Source |
|---|---|
| `{{group_id}}`, `{{artifact_id}}`, `{{base_package}}`, `{{project_name}}`, `{{project_description}}`, `{{suite_name}}`, `{{test_group_name}}`, `{{run_name}}` | Derived from the task ID |
| `{{java_level}}` | The highest minimum Java level among the pinned libraries (check each jar's class-file version or documented minimum), never above the JDK used |
| `{{playwright_version}}`, `{{testng_version}}`, `{{surefire_version}}` | Package registry at generation time, pinned |
| `{{base_url}}` | TaskContext UI entry point |
| `{{default_timeout_ms}}` | Platform default 15000 unless the task states otherwise |
| `{{default_artifacts_dir}}` | Relative path from the project to `<task>/automation-execution/results` |
| `{{username_env_var}}`, `{{password_env_var}}` | Default `QA_USERNAME`, `QA_PASSWORD` |
| `{{test_classes}}` | One `<class name="…"/>` per generated case |

The scaffold provides `Config` (environment variables, fail-fast credentials),
`BaseTest` (fresh context per test, `precondition` / `step` / `observed` logging,
`withoutTracing` for typing secrets, failure screenshot + trace + step log), a
TestNG suite, a shared IntelliJ run configuration, a README and `.gitignore`.
Generated page objects and tests are added next to it; the scaffold files are
filled, not rewritten.

## Static Validation

Performed after generation. None of these steps runs a test against the application.

| # | Check |
|---|---|
| SV-1 | The project builds / compiles (e.g. `mvn -q test-compile`, `npx tsc --noEmit`). |
| SV-2 | Test discovery lists exactly the selected cases (one test per case ID). |
| SV-3 | Forbidden-pattern scan: fixed sleeps, `networkidle`, `force` clicks, retries > 0, skipped / disabled tests, MCP refs, absolute XPath, hard-coded credentials. |
| SV-4 | Secret scan over every generated file, including IDE run configurations: no credential value, token or cookie. |
| SV-5 | Traceability: each selected case has a test; each approved step number appears once, in order, with its verbatim text; each locator maps to a `LOC-###` or a `locator_decisions` entry; each `DATA-###` has a resolver. |
| SV-6 | The expected result asserted equals the approved expected result (reviewed line by line; recorded in the report §4). |
| SV-7 | Approved upstream artifacts unchanged (hashes before = after). |

A failing check is fixed in the generated code and the check re-run. If it cannot
be fixed without changing the approved case, stop with `AG-E13`.

## Validation Rules (self-checks before presenting)

| Check | Rule |
|---|---|
| AG-V01 | Prerequisites 1–11 verified before any file was written. |
| AG-V02 | Generated cases = eligible cases; every non-generated candidate has a warning code and reason. |
| AG-V03 | Framework, binding, versions and decision source recorded. |
| AG-V04 | SV-1 to SV-7 all pass. |
| AG-V05 | Report has all sections; every generated file listed with its SHA-256. |
| AG-V06 | No test case, expected result or approved artifact was modified. |
| AG-V07 | No secret in any generated file, report or journal entry. |

## Failure Conditions

| Code | Condition | Event status |
|---|---|---|
| AG-E01 – AG-E12 | Prerequisites (see above) | `blocked` |
| AG-E13 | Static validation cannot pass without changing an approved case | `failed` |
| AG-E14 | Toolchain or dependency download fails during validation | `failed` |
| AG-W01 | Candidate not eligible (Exploratory, not in scope, or expected result not established) | warning; case not generated |
| AG-W02 | Latest manual result FAIL with a non-application cause | warning; case not generated |
| AG-W03 | Latest manual result BLOCKED or not executed | warning; case not generated |
| AG-W04 | A step cannot be automated with the approved UI flow | warning; case not generated |

For a `blocked` or `failed` attempt no partial project is presented as complete;
files written before an `AG-E13` / `AG-E14` failure are listed in the event.

## Revision Behavior

1. Append a `revision_request` event with the verbatim request (secrets redacted).
2. Re-check prerequisites. If TestCases, TestReview or the manual execution were
   re-approved since, re-plan the selection.
3. Update the **same** project and report in place; bump the report's minor version.
4. Re-run static validation over the whole project.
5. Append a `stage_execution` event whose `revision` lists added, modified and
   removed files and cases.

## Stop Behavior

After the report is written and validated, STOP and present: binding, generated
cases, skipped candidates with reasons, files, static validation results, the
environment variables to set, and the run commands. The stage has no approval
key; `automation-execution` starts only when orchestration starts it.

## Journal Integration

| Event | When | `status` |
|---|---|---|
| `stage_execution` | A successful attempt (the stage has no gate); one event per binding when several are generated | `completed`, with `approval_required: false`, `approval_key: null` |
| `stage_execution` | A prerequisite failed / validation could not pass | `blocked` / `failed` |
| `revision_request` | The human asks for changes | `revision_requested` |

Stage blocks (schema v1.6.0): `automation_binding`, `automated_cases`,
`locator_decisions`, `generated_files`, `static_validation`. Also recorded:
`input_references` (with hashes of every approved input), `mcp_used` (read-only
locator checks, or not used with the reason), `decisions`, `output_artifacts`,
`validation`, `errors`, `notes`.

## Hand-off to Self-Healing

`self-healing` may later change locators, waits, setup and test plumbing of the
generated code, and must document every attempt (reason, change, result). It may
never change the step mapping's meaning, the asserted expected result, or the
test data definitions. This skill's step labels and assertion messages exist so
that such changes are reviewable.
