# Automation Generation Report

<!--
OUTPUT STRUCTURE for the automation-generation skill. This file is a structure
reference, not an artifact. The skill writes the filled version to
platform/tasks/<task-name>/automation/AutomationGeneration.md. Every section is
always present; an empty section says "None."

This report describes generated code and its static validation only. It never
reports test results: running the suite belongs to automation-execution.
Expected results are copied verbatim from the approved TestCases.md.
No secrets anywhere: environment variable NAMES only, never values.

Warning codes: AG-W01 not eligible · AG-W02 manual FAIL (non-application cause)
· AG-W03 manual BLOCKED / not executed · AG-W04 step not automatable as written
-->

## 1. Generation Information

| Field | Value |
|---|---|
| Task ID | |
| Workflow Run ID | |
| Report version | 1.0.0 |
| Generated at (UTC) | |
| Skill / prompt version | automation-generation v1.0.0 / v1.0.0 |
| TestCases.md | version · SHA-256 · `TEST_DESIGN_APPROVED` event |
| TestReview.md | version · SHA-256 · `TEST_REVIEW_APPROVED` event |
| ExecutionReport.md | version · SHA-256 · `MANUAL_EXECUTION_APPROVED` event |
| ProjectContext / ExplorationReport | SHA-256 / SHA-256 |

### Revision History

| Version | Date (UTC) | Reason | Changed files | Cases added / modified / removed |
|---|---|---|---|---|
| 1.0.0 | | Initial generation | All | — |

## 2. Scope

| Case | Title | Needs Automation | Latest manual result | Generated? | Reason / code |
|---|---|---|---|---|---|

## 3. Framework and Project

| Field | Value |
|---|---|
| Framework | <name> — decided by <approved artifact ID / platform default> |
| Binding | <binding id>: <language> + <runner> + <build tool> |
| Library versions | <name x.y.z (registry, date checked)> |
| Toolchain | <JDK / Node version (minimum required)> |
| Project directory | `automation/<project-dir>/` |
| IDE | <name, edition supported, run configuration path> |

### Generated files

| Path | Role | SHA-256 |
|---|---|---|

## 4. Case Mapping

One subsection per generated case.

### TC-### — <title>

| Field | Value |
|---|---|
| Test | `<file>` → `<method>` |
| Expected result (verbatim) | |
| Assertion | <what is compared, with which values read at run time> |
| Test data | DATA-### → <resolver and its rule> |
| Related bugs | BUG-### / none |

| Step | Approved text (verbatim) | Code (summary) | Waits for |
|---|---|---|---|
| Pre | | | |
| 1 | | | |

## 5. Locators

| ID | Element | Locator (as in code) | Strategy | Source (LOC-### / verification) | Notes |
|---|---|---|---|---|---|

## 6. Test Data and Credentials

| Item | Source at run time | Notes |
|---|---|---|
| DATA-### | | |
| Credentials | Environment variables `<NAME>`, `<NAME>` (values never recorded) | Fail fast when missing |

## 7. Waits, Assertions and Failure Handling

- Waits: <named states waited for; central timeout value; no fixed sleeps>
- Assertions: <retrying assertions used; messages cite the case ID>
- Failure evidence: <screenshot, trace, step log; output location>
- Retries: 0 (or the recorded human decision)

## 8. How to Run

### Command line (Claude Code)

```
<set environment variables (names only)>
<one command>
```

### IDE

<import steps; run configuration name; where to fill the environment variables>

### First-run setup

<browser download / dependency resolution, documented only>

## 9. Static Validation

| Check | Description | Result | Command / notes |
|---|---|---|---|
| SV-1 | Build / compile | | |
| SV-2 | Test discovery = selected cases | | |
| SV-3 | Forbidden patterns | | |
| SV-4 | Secret scan | | |
| SV-5 | Traceability (steps, locators, data) | | |
| SV-6 | Asserted expected result = approved | | |
| SV-7 | Approved upstream artifacts unchanged | | |

## 10. Risks, Assumptions and Open Questions

| ID | Type | Description | Impact | Owner |
|---|---|---|---|---|
