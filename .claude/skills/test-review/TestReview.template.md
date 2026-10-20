# Test Review

<!--
OUTPUT STRUCTURE for the test-review skill. This file is a structure reference,
not an artifact. The skill writes the filled version to
platform/tasks/<task-name>/test-review/TestReview.md. Never copy placeholder
rows into the artifact as content. Every section is always present. When a
section is empty, write "None."

This review NEVER modifies TestCases.md. Every finding records a proposed change
and its reason; changes are made only through a test-design revision.

ID conventions (this artifact):
  TR review finding · RQ review open question
Classification: Change Required (blocks TEST_REVIEW_APPROVED while open) | Advisory (non-blocking)
Category: missing_coverage | duplicate | unclear_step | invalid_expected_result |
          missing_precondition | unsupported_assumption | traceability_error |
          flag_inconsistency
Finding status: open | resolved | withdrawn
Review outcome: changes_required | ready_for_approval
Upstream references (reused exactly, never invented):
  TC / TA / TQ / CG / DATA-### (TestCases.md) ·
  PC SA/BR/EB/DEP/RK/AS/GAP/OQ-### (ProjectContext) · PRD FR-### (PRD) ·
  OBS / FND / XGAP / XQ / PB / XDEP-### (ExplorationReport)
-->

## 1. Review Information

| Field | Value |
|---|---|
| Task ID | |
| Task Name | |
| Project Name | |
| Workflow Run ID | <journal/workflow-run.json → active_run_id> |
| TestReview version | 1.0.0 |
| Status | Draft — awaiting `TEST_REVIEW_APPROVED` \| Changes required — not approvable \| Approved |
| Review outcome | ready_for_approval \| changes_required |
| Test Review skill version | test-review vX.Y.Z |
| Prompt version | test-review vX.Y.Z |
| Reviewed at | <UTC, system clock> |

### Binding

The approval of this review applies **only** to the artifact versions below. Any
later change to TestCases.md, this file, or the approved ProjectContext or
ExplorationReport voids it.

| Bound artifact | Version | SHA-256 | Approval event | Produced by |
|---|---|---|---|---|
| `test-design/TestCases.md` (**reviewed**) | x.y.z | <hash at review start = hash at review end> | `TEST_DESIGN_APPROVED` EVT-NNNN | test-design EVT-NNNN |
| `context/ProjectContext.md` | <status/revision> | <approved hash> | `PROJECT_CONTEXT_APPROVED` EVT-NNNN | — |
| `exploration/ExplorationReport.md` | x.y.z | <approved hash> | `EXPLORATION_APPROVED` EVT-NNNN | — |

### Revision History

| Version | Date (UTC) | Kind | Reason | Reviewed TestCases version | Findings added | Resolved | Withdrawn / downgraded | Still open (CR / Adv) |
|---|---|---|---|---|---|---|---|---|
| 1.0.0 | | Initial review | — | x.y.z | TR-001…TR-### | — | — | n / n |

## 2. Review Scope

- **Active cases reviewed:** n (TC-### … TC-###)
- **Withdrawn cases (listed, not reviewed):** TC-### (Withdrawn vX.Y.Z), or None.
- **Sources checked for coverage:** n PC BR, n PC EB, n PC DEP, n OBS (by class), n XDEP, Exploration §13 limits
- **Not checked, and why:** e.g. candidate locators (automation concern), or None.

## 3. Review Checks

| # | Category | Performed | Findings (CR / Adv) | Notes (or reason not applicable) |
|---|---|---|---|---|
| 1 | missing_coverage | Yes \| Not applicable | n / n | |
| 2 | duplicate | | | |
| 3 | unclear_step | | | |
| 4 | invalid_expected_result | | | |
| 5 | missing_precondition | | | |
| 6 | unsupported_assumption | | | |
| 7 | traceability_error | | | |
| 8 | flag_inconsistency | | | |

## 4. Per-Case Review

One row per active case. Each cell is `OK`, `N/A`, or the finding ID(s).

| Case | Type | Coverage | Duplicate | Steps | Expected Result | Preconditions | Assumptions | Traceability | Flags | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| TC-001 | | OK | OK | TR-### | OK | OK | OK | OK | OK | Change Required \| Advisory only \| No findings |

## 5. Source Coverage Verification

Verified independently of the TestCases.md matrix, against each case's actual
steps and expected result.

| Source ID | Source Type | TestCases claims | Verified covering cases | TQ / CG | Result |
|---|---|---|---|---|---|
| PC BR-### | Business Rule | TC-### | TC-### | — | Covered \| Gap documented \| Not covered (TR-###) \| Claim not verified (TR-###) |
| OBS-### (FINDING) | Exploration Observation | TC-### | | CG-### | |

## 6. Findings

### Index

| ID | Classification | Category | Affected | Status |
|---|---|---|---|---|
| TR-001 | Change Required \| Advisory | <category> | TC-### / PC BR-### | open \| resolved \| withdrawn |

### TR-001 — <short title>

| Field | Value |
|---|---|
| Classification | Change Required \| Advisory |
| Category | <one of the 8 categories> |
| Affected test cases | TC-### |
| Sources | PC BR-### · OBS-### · TestCases §n |
| Finding | <what is wrong, observed in TestCases.md vX.Y.Z> |
| Basis | <the approved source or test-design rule that shows it> |
| Proposed change | <what must change, and where; never a full replacement case; never an unestablished expected result> |
| Reason | <why the change is needed; for Change Required, which result would become untrustworthy or which rule is violated> |
| Status | open \| resolved \| withdrawn |
| Resolution | — \| test_design_revision: TestCases vX.Y.Z (`TEST_DESIGN_APPROVED` EVT-NNNN), verified in review vX.Y.Z \| reviewer_decision: EVT-NNNN |
| Raised in | review v1.0.0 |

## 7. Open Questions

| ID | Related | Related test cases | Exact ambiguity | Required clarification | Blocks approval? | Owner |
|---|---|---|---|---|---|---|
| RQ-001 | PC OQ-### / XQ-### / TQ-### | TC-### | | | No \| Yes, via TR-### | not stated |

An open question never blocks approval by itself. If its answer decides whether a
case is valid, the problem is also recorded as a Change Required finding.

## 8. Resolution Tracking

| Finding | Raised in | Classification history | Status | Resolution | Verified in |
|---|---|---|---|---|---|
| TR-001 | v1.0.0 | Change Required | open | — | — |

## 9. Review Summary

| Metric | Count |
|---|---|
| Active cases reviewed | |
| Cases with no findings | |
| Sources checked | |
| Sources not covered (no case, TQ or CG) | |
| Findings total | |
| Change Required (open / resolved / withdrawn) | n / n / n |
| Advisory (open / resolved / withdrawn) | n / n / n |
| Open questions | |
| **Review outcome** | ready_for_approval \| changes_required |

_No overall quality score is given. Judgment belongs to the human reviewer._
_`TEST_REVIEW_APPROVED` is accepted only when no Change Required finding is open._
