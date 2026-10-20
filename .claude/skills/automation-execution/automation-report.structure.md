# Automation Execution Report — structure

<!--
OUTPUT STRUCTURE for the automation-execution skill. This file is a structure
reference, not an artifact. The skill writes one self-contained HTML file per binding
to platform/tasks/<task-name>/automation-execution/<project-dir>/automation-report.html.
Every section is always present; an empty section says "None."
Numbers come only from execution-metrics.json and the run outputs.
No secrets: environment variable NAMES only. No e-mail addresses.
-->

## 1. Header

Framework and versions (as read from run outputs), task, workflow run, case IDs,
execution date, environment, final verdict = outcome of the latest run of the binding.

## 2. Summary

Runs total; `passed`; `failed`; `not_run`; `harness_failed`; pass rate of runs after
the last healing change; mean test duration and wall-clock of passing runs (with min–max).

## 3. Run history

| Run | Outcome | Test start | Test duration | Runner total | Wall-clock | Case-specific observed values | Failure class / healing ID | Evidence |
|---|---|---|---|---|---|---|---|---|

A `harness_failed` run is labeled "tests passed — build failed", never "passed".

## 4. Test cases

Per case: approved steps and expected result, verbatim from TestCases.md.

## 5. Latest passing run

Step timeline from the step log (time, approved step label, observed values); each part
of the expected result with its actual value and status.

## 6. Evidence

Embedded final screenshot of the latest passing run; failure screenshots of failed runs
(base64). Relative links to native reports (Playwright `html-report/index.html`,
Allure single-file HTML), step logs, traces, console logs, machine-readable results.

## 7. Failures and healing

Per non-passing run: symptom, failure class, evidence, healing ID and result (from
`self-healing/healing-log.md`), or "reported to the human" for class `application`.

## 8. Footer

"No credentials are stored; values were supplied via <ENV VAR NAMES> at run time",
generation time, sources.
