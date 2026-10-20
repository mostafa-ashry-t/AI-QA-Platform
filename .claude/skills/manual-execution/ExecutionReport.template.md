# Execution Report

<!--
OUTPUT STRUCTURE for the manual-execution skill. This file is a structure
reference, not an artifact. The skill writes the filled version to
platform/tasks/<task-name>/execution/ExecutionReport.md. Never copy placeholder
rows into the artifact as content. Every section is always present. When a
section is empty, write "None."

PASS is assigned only from a real observed result. A case that was not actually
run is never reported as passing. Expected results are copied verbatim from the
approved TestCases.md. Actual results contain only observed behavior.

ID conventions (this artifact):
  EXEC execution action · DEV deviation · TCI test case issue · BUG bug ·
  EVD evidence (task-wide sequence, continues after exploration evidence)
Upstream IDs reused exactly: TC-### · PC BR/EB-### · OBS-### · FND-### · DATA-### · CG-### · TQ-###
Statuses: PASS | FAIL | BLOCKED   (Not executed = not in the executed set, with reason)
Failure causes: APPLICATION_DEFECT | TEST_CASE_DEFECT | TEST_DATA_PROBLEM |
                ENVIRONMENT_PROBLEM | DEPENDENCY_PROBLEM | UNKNOWN
No secrets anywhere: passwords, tokens, keys and cookies are redacted as [REDACTED: <kind>].
-->

## 1. Execution Information

| Field | Value |
|---|---|
| Task ID | |
| Task Name | |
| Project Name | |
| Workflow Run ID | <journal/workflow-run.json → active_run_id> |
| Environment | <or "unavailable — reason"> |
| Application URL | |
| Build / version | <identifier, and how it was determined, or "unavailable — reason"> |
| Browser | <as reported by the tool, or "unavailable — reason"> |
| Test data source | <source names only; never secret values> |
| Execution started | <UTC, system clock> |
| Execution ended | <UTC, system clock> |
| TestCases.md | version <x.y.z> · SHA-256 <approved hash> · approval journal EVT-NNNN |
| ProjectContext / ExplorationReport | SHA-256 <approved hashes> |
| Report version | 1.0.0 |
| Status | Draft — awaiting `MANUAL_EXECUTION_APPROVED` \| Approved |
| Skill version | manual-execution vX.Y.Z |
| Prompt version | manual-execution vX.Y.Z |

### Revision History

| Version | Date (UTC) | Reason | Changed sections | Re-executed cases | Changed results | Bugs added / modified / withdrawn |
|---|---|---|---|---|---|---|
| 1.0.0 | | Initial execution | All | n/a | n/a | |

## 2. Execution Scope

### Approved test cases

_All Active cases in the approved TestCases.md: TC-### … (N)._

### Selected and executed

| Case | Title | Executed? |
|---|---|---|
| TC-### | | Yes \| No |

### Not executed

| Case | Reason |
|---|---|
| TC-### | Valid in Scope = FALSE (CG-###) \| Withdrawn \| Exploratory: expected result not established (TQ-###) \| Excluded by reviewer request (journal EVT-NNNN) \| Run interrupted before reaching this case |

## 3. Execution Summary

| Metric | Count |
|---|---|
| Total approved (active) | |
| Selected | |
| Executed | |
| PASS | |
| FAIL | |
| BLOCKED | |
| Not executed | |
| Test case issues | |
| Deviations recorded | |
| Bugs raised | |

_No overall quality score is given._

## 4. Per-Case Results

| ID | Expected | Actual | Status | Reason | Evidence |
|---|---|---|---|---|---|
| TC-### | <verbatim from TestCases.md> | <observed only> | PASS \| FAIL \| BLOCKED | <required for FAIL / BLOCKED> | EVD-### |

### 4.1 Execution detail

#### TC-### — <title>

| EXEC | Step | Action (as written) | Observed result | Evidence | Deviation |
|---|---|---|---|---|---|
| EXEC-### | 1 | | | EVD-### | — \| DEV-### |

Test data used: DATA-### (source only) · Preconditions established: yes \| no (why)

## 5. Failure Analysis

| Case | Failed step | Cause category | Reasoning | Evidence | Confidence / limitations | Bug |
|---|---|---|---|---|---|---|
| TC-### | | APPLICATION_DEFECT \| TEST_CASE_DEFECT \| TEST_DATA_PROBLEM \| ENVIRONMENT_PROBLEM \| DEPENDENCY_PROBLEM \| UNKNOWN | | EVD-### | High \| Medium \| Low — | BUG-### \| none (not an application defect) |

> A FAIL is not automatically a bug. Only supported APPLICATION_DEFECT failures produce bug reports.

## 6. Blocked Cases

| Case | Blocker type | Blocker | Impact | What would unblock it | Evidence |
|---|---|---|---|---|---|
| TC-### | Environment \| Test data \| Authentication \| Dependency \| Application unreachable \| Test case issue \| Deviation required \| Other | | | | |

## 7. Test Case Issues

| ID | Case | Type | Description | Step | Consequence | Recommended action |
|---|---|---|---|---|---|---|
| TCI-### | TC-### \| — | Invalid case \| Ambiguous step \| Missing data \| Incorrect assumption \| Deviation \| Unexecutable \| Missing test case | | | | e.g. revise TestCases via Test Design |

### Deviations

| ID | Case | Step | Original step | Deviation | Reason | Consequence | Performed? |
|---|---|---|---|---|---|---|---|
| DEV-### | TC-### | | | | | | Yes (incidental) \| No (substantive) |

## 8. Bugs Raised

| Bug | Title | Affected test cases | Severity | Priority | Status |
|---|---|---|---|---|---|
| BUG-### | | TC-###, TC-### | Critical \| High \| Medium \| Low | High \| Medium \| Low \| Not established | Open |

_Details: `bugs/BugReports.md`. Or: **No bugs raised.** No supported application defect was found, and BugReports.md was not created._

## 9. Coverage

### Approved vs executed

| Metric | Count | Cases |
|---|---|---|
| Approved (active) | | |
| Executed | | |
| Passed | | |
| Failed | | |
| Blocked | | |
| Not executed | | |

### Source coverage (from TestCases traceability)

| Source | Test cases | Executed | PASS | FAIL | BLOCKED | Bugs |
|---|---|---|---|---|---|---|
| PC BR-### | TC-### | | | | | BUG-### |
