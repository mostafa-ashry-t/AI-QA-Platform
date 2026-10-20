# Test Review

> Produced by the `test-review` skill (v1.0.0, prompt `test-review` v1.0.0), the mandatory review
> stage (ADR-001). Review only: TestCases.md was not modified, nothing was executed, and no browser,
> MCP or automation was used.

## 1. Review Information

| Field | Value |
|---|---|
| Task ID | `orangehrm-ui-api` |
| Task Name | `OrangeHRM UI & API QA assignment` (scope: Directory UI only) |
| Project Name | `OrangeHRM` |
| Workflow Run ID | `RUN-001` |
| TestReview version | 1.3.0 |
| Status | Approved (`TEST_REVIEW_APPROVED`, journal EVT-0039) |
| Review outcome | ready_for_approval |
| Test Review skill version | test-review v1.0.0 |
| Prompt version | test-review v1.0.0 |
| Reviewed at | 2026-10-18T09:35:02Z |

### Binding

The approval of this review applies **only** to the artifact versions below. Any later change to TestCases.md, this file, or the approved ProjectContext or ExplorationReport voids it.

| Bound artifact | Version | SHA-256 | Approval event | Produced by |
|---|---|---|---|---|
| `test-design/TestCases.md` (**reviewed**) | 1.4.0 | `9197633342204a94ff1aa710e807c6b8246ff03ea5a35cc61d84192808ecefe7` | `TEST_DESIGN_APPROVED` EVT-0037 | test-design EVT-0034 |
| `context/ProjectContext.md` | Approved | `0b0dcc57d5fc887e8e3c2b0e1f74d0934841430958a2ba3da8f52258d55f24de` | `PROJECT_CONTEXT_APPROVED` EVT-0009 | project-context EVT-0008 |
| `exploration/ExplorationReport.md` | 1.1.0 | `0edc9da6ebc94b63f27c4e9545f2c44062f87c70b8f53ed9e825096d8b8651d2` | `EXPLORATION_APPROVED` EVT-0015 | exploration EVT-0014 |

Also checked (not bound, approved with TestCases.md in EVT-0037): `test-design/TestCases.csv` SHA-256 `8ebc02a66e3792818ae2a64d088e8be45992fa64053d89ace0558288752d9373`.

### Revision History

| Version | Date (UTC) | Kind | Reason | Reviewed TestCases version | Findings added | Resolved | Withdrawn / downgraded | Still open (CR / Adv) |
|---|---|---|---|---|---|---|---|---|
| 1.0.0 | 2026-10-15 | Initial review | — | 1.1.0 | TR-001…TR-014 | — | — | 8 / 6 |
| 1.1.0 | 2026-10-15 | Re-review | Re-review of TestCases v1.2.0 (test-design revision EVT-0022, `TEST_DESIGN_APPROVED` EVT-0023) | 1.2.0 | TR-015, TR-016, TR-017 | TR-001, TR-002, TR-003, TR-004, TR-005, TR-006, TR-007, TR-014 | — | 1 / 8 |
| 1.2.0 | 2026-10-15 | Re-review | Re-review of TestCases v1.3.0 (test-design revision EVT-0026, `TEST_DESIGN_APPROVED` EVT-0029) | 1.3.0 | — | TR-015 | — | 0 / 8 |
| 1.3.0 | 2026-10-18 | Re-review | Re-review of TestCases v1.4.0 (test-design revision EVT-0034 for manual-execution TCI-002, `TEST_DESIGN_APPROVED` EVT-0037) | 1.4.0 | — | — | — | 0 / 8 |

## 2. Review Scope

- **Active cases reviewed:** 58 (TC-001 … TC-058); 40 with established expected results, 18 Exploratory. Every check was re-run over the whole file, not only the case changed in v1.4.0 (TC-024).
- **Withdrawn cases (listed, not reviewed):** None.
- **Earlier findings re-assessed:** all 17 (TR-001 – TR-017) against v1.4.0; see §6 and §8.
- **Sources checked for coverage:** 16 PC BR, 14 PC EB, 9 PC DEP, 22 OBS (19 GAP, 2 QUESTION, 1 POTENTIAL BUG), 4 XDEP, 19 Exploration §13 limits (U-01 – U-15 and 4 unfinished flows): 84 in total.
- **Human decisions applied as given (not re-litigated):** Directory UI only, no API; all 58 cases in scope; TC-054 the only automation case (EVT-0017); data-aware design with no fixed names or counts (EVT-0016); observed baseline for evidenced GAP observations (EVT-0016).
- **CSV consistency:** `TestCases.csv` re-checked field by field against the TestCases.md case blocks: 58 rows, same IDs in the same order, no duplicates, all 15 columns identical (steps joined, traceability separators and flag reasons normalised as the export defines), header `valid in scope` / `needs automation` exact, only TRUE / FALSE values, UTF-8 with BOM. `valid in scope` is TRUE for all 58; `needs automation` is TRUE only for **TC-054** (CSV, case blocks, §4 Index and §11 agree). No finding.
- **Not checked, and why:** candidate locators (automation concern); live behavior (no browser in this stage).

## 3. Review Checks

| # | Category | Performed | Open findings (CR / Adv) | Notes (or reason not applicable) |
|---|---|---|---|---|
| 1 | missing_coverage | Yes | 0 / 0 | Every PC BR / PC EB / PC DEP, observation, XDEP and §13 limit checked against cases, TQs and CGs; every matrix claim checked against the case's traceability. All 84 sources now have a case, TQ or CG (U-07 and the PC DEP items fixed: TR-004, TR-014 resolved). |
| 2 | duplicate | Yes | 0 / 0 | No two cases share preconditions, data, steps and expected result. Cases with identical setup and steps assert different single outcomes, as the one-expected-result rule requires: TC-020 / TC-021; TC-043 / TC-044; TC-045 / TC-057. |
| 3 | unclear_step | Yes | 0 / 2 | All steps checked for concrete values and established UI. Name prefixes, data pairs and TC-054's result-count reference now defined (TR-001, TR-003, TR-015 resolved); TC-054 steps 3 and 6 read the header only after cards are displayed. TC-024 (v1.4.0) adds step 2 "Delete the last character of the text and type it again, so the suggestion list reopens.": a concrete action on the established Employee Name field that uses established typing-shows-suggestions behavior (OBS-013); retyping alone keeps "Invalid" (OBS-015, TC-025), so step 3's selection remains the judged action; expected result, basis (OBS-016) and flags unchanged. No finding. Wording: TR-009, TR-013 still open. |
| 4 | invalid_expected_result | Yes | 0 / 0 | All 40 established results have a GAP-class observation basis (no QUESTION or POTENTIAL BUG basis; TR-005 resolved); all 18 Exploratory results are exactly "Not established by approved requirements." with a TQ. Independent pairs split (TR-006 resolved). Composite results judged as one state: TC-002, TC-005, TC-008, TC-012, TC-014, TC-023, TC-048, TC-054. |
| 5 | missing_precondition | Yes | 0 / 3 | Test data definitions checked against each step that uses them. DATA-012 / DATA-013 / DATA-015 close TR-002, TR-003 and TR-007; DATA-012's fewer-records condition supports TC-054's N > k check (TR-015). DATA-007, DATA-008 and DATA-009 are chosen by the property the case then checks on the searched card or panel; accepted under the data-aware decision (EVT-0016), since no other data source exists for UI-only testing. Open: TR-010, TR-012, TR-017. |
| 6 | unsupported_assumption | Yes | 0 / 1 | No invented limit, state or transition found. DATA-015's upper bound 14 is the observed batch size (OBS-019). The observed-baseline assumption remains disclosed (TR-008). |
| 7 | traceability_error | Yes | 0 / 2 | All cited source IDs exist upstream (PC, PRD, Exploration); both §5 directions agree; §11 counts equal §4. Narrative counts in §1 / §2 / §3 are stale (TR-016). TR-011 still open. |
| 8 | flag_inconsistency | Yes | 0 / 0 | Valid in Scope TRUE for all 58 (human decision; no case depends on excluded functionality). Needs Automation TRUE only for TC-054: in scope, established, End-to-End, High priority (deterministic: DATA-012 pair plus a within-case N > k check, TR-015 resolved). No Exploratory case is TRUE. Every flag has a reason. New cases TC-055 – TC-058 are FALSE with a reason. |

## 4. Per-Case Review

One row per active case. Each cell is `OK` or the ID(s) of an **open** finding. Resolved findings are listed in the last column for reference (detail in §6 and §8).

| Case | Type | Coverage | Duplicate | Steps | Expected Result | Preconditions | Assumptions | Traceability | Flags | Result | Resolved findings |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-001 | Dependency | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-014 |
| TC-002 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-014 |
| TC-003 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-006 |
| TC-004 | Business Rule | OK | OK | OK | OK | OK | TR-008 | TR-011 | OK | Advisory only | — |
| TC-005 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-006 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-007 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-008 | Dependency | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-009 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-010 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-011 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-003 |
| TC-012 | Negative | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-013 | Negative | OK | OK | TR-013 | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-014 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-001 |
| TC-015 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-016 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-017 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-001 |
| TC-018 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-001 |
| TC-019 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-001 |
| TC-020 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-001, TR-002 |
| TC-021 | Boundary | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-001, TR-002 |
| TC-022 | Validation | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-023 | Error Handling | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-024 | Validation | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-001 |
| TC-025 | Validation | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-026 | Negative | OK | OK | OK | OK | TR-010 | TR-008 | OK | OK | Advisory only | — |
| TC-027 | Exploratory | OK | OK | OK | OK | TR-010 | OK | OK | OK | Advisory only | — |
| TC-028 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-029 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-030 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-031 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-032 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-033 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-034 | Positive | OK | OK | OK | OK | TR-017 | TR-008 | OK | OK | Advisory only | TR-002 |
| TC-035 | Positive | OK | OK | OK | OK | TR-017 | TR-008 | OK | OK | Advisory only | TR-002 |
| TC-036 | Boundary | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-005, TR-007 |
| TC-037 | Positive | OK | OK | TR-009 | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-038 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-039 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-040 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-041 | Positive | OK | OK | OK | OK | TR-017 | TR-008 | OK | OK | Advisory only | TR-002, TR-006 |
| TC-042 | Positive | OK | OK | OK | OK | TR-017 | TR-008 | OK | OK | Advisory only | TR-002 |
| TC-043 | Positive | OK | OK | OK | OK | TR-017 | TR-008 | OK | OK | Advisory only | TR-002 |
| TC-044 | Positive | OK | OK | OK | OK | TR-017 | TR-008 | OK | OK | Advisory only | TR-002 |
| TC-045 | Positive | OK | OK | OK | OK | TR-017 | TR-008 | OK | OK | Advisory only | TR-002, TR-006 |
| TC-046 | Exploratory | OK | OK | OK | OK | TR-017 | OK | OK | OK | Advisory only | TR-002 |
| TC-047 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-048 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | — |
| TC-049 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-050 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-051 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | — |
| TC-052 | Exploratory | OK | OK | OK | OK | TR-017 | OK | OK | OK | Advisory only | TR-002 |
| TC-053 | Exploratory | OK | OK | OK | OK | TR-017 | OK | OK | OK | Advisory only | TR-002 |
| TC-054 | End-to-End | OK | OK | OK | OK | TR-012 | TR-008 | OK | OK | Advisory only | TR-003, TR-015 |
| TC-055 | Exploratory | OK | OK | OK | OK | OK | OK | OK | OK | No findings | TR-004 |
| TC-056 | Positive | OK | OK | OK | OK | TR-017 | TR-008 | OK | OK | Advisory only | TR-006 |
| TC-057 | Positive | OK | OK | OK | OK | TR-017 | TR-008 | OK | OK | Advisory only | TR-006 |
| TC-058 | Positive | OK | OK | OK | OK | OK | TR-008 | OK | OK | Advisory only | TR-006 |

## 5. Source Coverage Verification

Verified independently of the TestCases.md matrix, against each case's traceability, steps and expected result.

| Source ID | Source Type | TestCases claims | Verified covering cases | TQ / CG | Result |
|---|---|---|---|---|---|
| PC BR-001 | Business Rule | — | — | CG-001 | Gap documented |
| PC BR-002 | Business Rule | — | — | CG-001 | Gap documented |
| PC BR-003 | Business Rule | — | — | CG-001 | Gap documented |
| PC BR-004 | Business Rule | — | — | CG-001 | Gap documented |
| PC BR-005 | Business Rule | — | — | CG-001 | Gap documented |
| PC BR-006 | Business Rule | TC-004 | TC-004 | — | Covered (TC-004); see TR-011 |
| PC BR-007 | Business Rule | — | — | CG-001 | Gap documented |
| PC BR-008 | Business Rule | — | — | CG-001 | Gap documented |
| PC BR-009 | Business Rule | — | — | CG-002 | Gap documented |
| PC BR-010 | Business Rule | — | — | CG-002 | Gap documented |
| PC BR-011 | Business Rule | — | — | CG-002 | Gap documented |
| PC BR-012 | Business Rule | — | — | CG-002 | Gap documented |
| PC BR-013 | Business Rule | — | — | CG-002 | Gap documented |
| PC BR-014 | Business Rule | — | — | CG-002 | Gap documented |
| PC BR-015 | Business Rule | — | — | CG-002 | Gap documented |
| PC BR-016 | Business Rule | — | — | CG-001 | Gap documented |
| PC EB-001 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC EB-002 | Expected Behavior | — | — | CG-001 | Gap documented |
| PC EB-003 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC EB-004 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC EB-005 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC EB-006 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC EB-007 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC EB-008 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC EB-009 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC EB-010 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC EB-011 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC EB-012 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC EB-013 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC EB-014 | Expected Behavior | — | — | CG-002 | Gap documented |
| PC DEP-001 | Dependency | TC-001, TC-002 | TC-001, TC-002 | — | Covered (TR-014 resolved) |
| PC DEP-002 | Dependency | TC-001, TC-002 | TC-001, TC-002 | — | Covered (TR-014 resolved) |
| PC DEP-003 | Dependency | — | — | CG-010 | Gap documented (TR-014 resolved) |
| PC DEP-004 | Dependency | — | — | CG-010 | Gap documented (TR-014 resolved) |
| PC DEP-005 | Dependency | — | — | CG-010 | Gap documented (TR-014 resolved) |
| PC DEP-006 | Dependency | TC-001 | TC-001 | — | Covered (TC-001); see TR-011 |
| PC DEP-007 | Dependency | — | — | CG-010 | Gap documented (TR-014 resolved) |
| PC DEP-008 | Dependency | — | — | CG-010 | Gap documented (TR-014 resolved) |
| PC DEP-009 | Dependency | — | — | CG-010 | Gap documented (TR-014 resolved) |
| OBS-001 (GAP) | Exploration Observation | TC-001, TC-054 | TC-001, TC-054 | — | Covered |
| OBS-002 (QUESTION) | Exploration Observation | — | — | — | Resolved by human decision (EVT-0016); DATA-001, CG-003 |
| OBS-003 (GAP) | Exploration Observation | TC-002, TC-003, TC-054, TC-058 | TC-002, TC-003, TC-054, TC-058 | — | Covered |
| OBS-004 (GAP) | Exploration Observation | TC-004, TC-005 | TC-004, TC-005 | — | Covered |
| OBS-005 (GAP) | Exploration Observation | TC-006 | TC-006 | — | Covered |
| OBS-006 (GAP) | Exploration Observation | TC-007 | TC-007 | — | Covered |
| OBS-007 (GAP) | Exploration Observation | TC-008 | TC-008 | — | Covered |
| OBS-008 (GAP) | Exploration Observation | TC-009, TC-034, TC-036 | TC-009, TC-034, TC-036 | — | Covered |
| OBS-009 (GAP) | Exploration Observation | TC-010, TC-035 | TC-010, TC-035 | — | Covered |
| OBS-010 (GAP) | Exploration Observation | TC-011, TC-052, TC-053, TC-054 | TC-011, TC-052, TC-053, TC-054 | TQ-015 | Covered |
| OBS-011 (GAP) | Exploration Observation | TC-012, TC-013 | TC-012, TC-013 | — | Covered |
| OBS-012 (GAP) | Exploration Observation | TC-014, TC-015, TC-054 | TC-014, TC-015, TC-054 | — | Covered |
| OBS-013 (GAP) | Exploration Observation | TC-017, TC-018, TC-019, TC-055 | TC-017, TC-018, TC-019, TC-055 | — | Covered |
| OBS-014 (GAP) | Exploration Observation | TC-022, TC-023, TC-024, TC-027 | TC-022, TC-023, TC-024, TC-027 | TQ-002 | Covered |
| OBS-015 (GAP) | Exploration Observation | TC-025, TC-031 | TC-025, TC-031 | TQ-006 | Covered |
| OBS-016 (GAP) | Exploration Observation | TC-020, TC-021, TC-024, TC-028 | TC-020, TC-021, TC-024, TC-028 | TQ-003 | Covered |
| OBS-017 (GAP) | Exploration Observation | TC-026, TC-027 | TC-026, TC-027 | TQ-002 | Covered |
| OBS-018 (GAP) | Exploration Observation | TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-047, TC-054, TC-056, TC-057 | TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-047, TC-054, TC-056, TC-057 | TQ-010, TQ-011 | Covered |
| OBS-019 (GAP) | Exploration Observation | TC-036, TC-037, TC-038, TC-039 | TC-036, TC-037, TC-038, TC-039 | TQ-008 | Covered |
| OBS-020 (GAP) | Exploration Observation | TC-048, TC-049 | TC-048, TC-049 | TQ-012 | Covered |
| OBS-021 (QUESTION) | Exploration Observation | — | — | — | Resolved by human decision (EVT-0016); CG-004. No longer used as a basis (TR-005 resolved) |
| OBS-022 (POTENTIAL BUG) | Exploration Observation | TC-050 | TC-050 | TQ-013 | Covered |
| XDEP-001 | Exploration Dependency | TC-001 | TC-001 | — | Covered |
| XDEP-002 | Exploration Dependency | TC-008 | TC-008 | — | Covered |
| XDEP-003 | Exploration Dependency | TC-022, TC-023 | TC-022, TC-023 | — | Covered |
| XDEP-004 | Exploration Dependency | CG-004 | — | CG-004 | Gap documented |
| §13 U-01 | Exploration limit | TC-016 | TC-016 | TQ-001 | Covered |
| §13 U-02 | Exploration limit | CG-005 | — | CG-005 | Gap documented |
| §13 U-03 | Exploration limit | TC-052, TC-053 | TC-052, TC-053 | TQ-015 | Covered |
| §13 U-04 | Exploration limit | TC-029 | TC-029 | TQ-004 | Covered |
| §13 U-05 | Exploration limit | TC-030 | TC-030 | TQ-005 | Covered |
| §13 U-06 | Exploration limit | TC-032, TC-033 | TC-032, TC-033 | TQ-007 | Covered |
| §13 U-07 | Exploration limit | TC-055 | TC-055 | TQ-016 | Covered (TR-004 resolved) |
| §13 U-08 | Exploration limit | TC-039 | TC-039 | TQ-008 | Covered |
| §13 U-09 | Exploration limit | TC-040 | TC-040 | TQ-009 | Covered |
| §13 U-10 | Exploration limit | TC-051 | TC-051 | TQ-014 | Covered |
| §13 U-11 | Exploration limit | TC-046 | TC-046 | TQ-010 | Covered |
| §13 U-12 | Exploration limit | TC-047 | TC-047 | TQ-011 | Covered |
| §13 U-13 | Exploration limit | CG-007 | — | CG-007 | Gap documented |
| §13 U-14 | Exploration limit | CG-006 | — | CG-006 | Gap documented |
| §13 U-15 | Exploration limit | TC-050 | TC-050 | — | Covered |
| §13 Filter panel re-expanded state | Exploration limit | TC-049 | TC-049 | — | Covered |
| §13 PB-001 reproduction | Exploration limit | TC-050 | TC-050 | — | Covered |
| §13 Loader during incremental loading | Exploration limit | CG-008 | — | CG-008 | Gap documented |
| §13 Trigger of "Invalid" on leaving the field | Exploration limit | TC-031 | TC-031 | — | Covered |

## 6. Findings

### Index

| ID | Classification | Category | Affected | Status | Raised in |
|---|---|---|---|---|---|
| TR-001 | Change Required | unclear_step | TC-014, TC-017, TC-018, TC-019, TC-020, TC-021, TC-024 | resolved | v1.0.0 |
| TR-002 | Change Required | missing_precondition | TC-020, TC-021, TC-034, TC-035, TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-052, TC-053 | resolved | v1.0.0 |
| TR-003 | Change Required | missing_precondition | TC-011, TC-054 | resolved | v1.0.0 |
| TR-004 | Change Required | missing_coverage | Exploration §13 U-07, PC SA-002 | resolved | v1.0.0 |
| TR-005 | Change Required | invalid_expected_result | TC-036 | resolved | v1.0.0 |
| TR-006 | Change Required | invalid_expected_result | TC-003, TC-041, TC-045 | resolved | v1.0.0 |
| TR-007 | Change Required | unclear_step | TC-036 | resolved | v1.0.0 |
| TR-008 | Advisory | unsupported_assumption | 40 established cases | open | v1.0.0 |
| TR-009 | Advisory | unclear_step | TC-037 | open | v1.0.0 |
| TR-010 | Advisory | missing_precondition | TC-026, TC-027 | open | v1.0.0 |
| TR-011 | Advisory | traceability_error | TC-004 | open | v1.0.0 |
| TR-012 | Advisory | missing_precondition | TC-054 | open | v1.0.0 |
| TR-013 | Advisory | unclear_step | TC-013 | open | v1.0.0 |
| TR-014 | Change Required | missing_coverage | PC DEP-001, PC DEP-002, PC DEP-003, PC DEP-004, PC DEP-005, PC DEP-007, PC DEP-008, PC DEP-009 | resolved | v1.0.0 |
| TR-015 | Change Required | unclear_step | TC-054 | resolved | v1.1.0 |
| TR-016 | Advisory | traceability_error | TestCases §1 Revision History, TestCases §2 Constraints, TestCases §3, TestCases §11 | open | v1.1.0 |
| TR-017 | Advisory | missing_precondition | TC-034, TC-035, TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-052, TC-053, TC-056, TC-057 | open | v1.1.0 |

### TR-001 — Name prefix and case are not pinned down in DATA-002

| Field | Value |
|---|---|
| Classification | Change Required |
| Category | unclear_step |
| Affected test cases | TC-014, TC-017, TC-018, TC-019, TC-020, TC-021, TC-024 |
| Sources | DATA-002 · OBS-013 · EVD-003 |
| Finding | TC-017 – TC-019 type "the first 4 characters of the DATA-002 employee's first name", but DATA-002 only says the first name, "typed partially", yields exactly one suggestion. DATA-002 does not require the first name to have at least 4 characters, does not tie its uniqueness to the 4-character prefix used in the steps, and does not require an upper-case letter. The approved data includes an all-lower-case name ("yedghjb1 ru84 90jsnd", EVD-003), for which TC-018's lower-case partition is identical to TC-017. TC-014, TC-020, TC-021 and TC-024 type "part of" the name with no length at all. _(as raised against TestCases v1.1.0)_ |
| Basis | Test-design rule: steps must be executable and use a concrete value or DATA-### (TestCases §4 rules; skill Test Case Generation Rules). DATA-002 (TestCases §10) vs steps of TC-017 – TC-019. |
| Proposed change | Redefine DATA-002 (TestCases §10): first name of at least 4 characters, containing at least one upper-case letter, whose first-4-character prefix yields exactly one suggestion. Use the same prefix ("first 4 characters") in TC-014, TC-020, TC-021 and TC-024. |
| Reason | Two testers can choose different names or prefixes; with a short or lower-case name TC-017 cannot be performed as written and TC-018 tests nothing distinct, so a PASS would not be trustworthy. |
| Re-assessment (latest: v1.4.0) | DATA-002 now requires a first name of at least 4 characters with an upper-case letter among the first 4, and a 4-character prefix that begins no other displayed card's first name. Every name step (TC-014, TC-017 – TC-025, TC-031, TC-032) types "the first 4 characters … as written on the card"; TC-018 types them in lower case, which is now a distinct input. Re-checked in v1.3.0: fix still present. Re-checked in v1.4.0: fix still present. |
| Status | resolved |
| Resolution | test_design_revision: TestCases.md v1.2.0 (SHA-256 f61b7505…291a), TEST_DESIGN_APPROVED journal EVT-0023; produced by test-design EVT-0022; verified in review v1.1.0 |
| Raised in | review v1.0.0 |

### TR-002 — Employee chosen by name is not required to have a unique full name

| Field | Value |
|---|---|
| Classification | Change Required |
| Category | missing_precondition |
| Affected test cases | TC-020, TC-021, TC-034, TC-035, TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-052, TC-053 |
| Sources | DATA-007 · DATA-008 · DATA-009 · OBS-021 · EVD-002 |
| Finding | These cases "Search for the DATA-00x employee" (select the name suggestion, click Search) and then inspect "the result card" or "the card". DATA-007, DATA-008 and DATA-009 do not require a unique full name. The approved exploration shows several employees with the same full name (repeated "Linda Anderson", OBS-021, EVD-002). TC-020 expects "exactly one result card", but DATA-002's uniqueness covers the prefix, not the full name. _(as raised against TestCases v1.1.0)_ |
| Basis | OBS-021 / EVD-002 (duplicate full names in the demo data); test-design rule: preconditions must set up the state the case needs (TestCases §4). |
| Proposed change | Add to DATA-002, DATA-007, DATA-008 and DATA-009 (TestCases §10): the employee's full name appears exactly once in the suggestion list. Or change the steps so that the card is identified without a name search (e.g. via a Location filter and the card text). |
| Reason | With a duplicated name, the search returns several cards: TC-020 fails for a data reason, not an application reason, and the other cases inspect an arbitrary card. |
| Re-assessment (latest: v1.4.0) | DATA-013 (full name appears exactly once in the suggestion list, confirmed during setup) added. DATA-007, DATA-008 and DATA-009 are DATA-013-qualified, and every case that must identify one employee (TC-020, TC-021, TC-034, TC-035, TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-052, TC-053, TC-056, TC-057) cites DATA-013 in Test Data and in its selection step. Re-checked in v1.3.0: fix still present. Re-checked in v1.4.0: fix still present. |
| Status | resolved |
| Resolution | test_design_revision: TestCases.md v1.2.0 (SHA-256 f61b7505…291a), TEST_DESIGN_APPROVED journal EVT-0023; produced by test-design EVT-0022; verified in review v1.1.0 |
| Raised in | review v1.0.0 |

### TR-003 — No test data defines a matching Job Title + Location pair

| Field | Value |
|---|---|
| Classification | Change Required |
| Category | missing_precondition |
| Affected test cases | TC-011, TC-054 |
| Sources | DATA-003 · DATA-004 · OBS-010 |
| Finding | TC-011 and TC-054 need "a Job Title and a Location that together return at least one card (DATA-003 / DATA-004 pair)". DATA-003 and DATA-004 are defined separately (each returns at least one card); no DATA item defines a pair that returns a card together, or how to find one. TC-054 is the only automation case. _(as raised against TestCases v1.1.0)_ |
| Basis | TestCases §10 (DATA-003, DATA-004); test-design Test Data Rules (data the environment must contain is stated as a precondition requirement). |
| Proposed change | Add a DATA item (e.g. DATA-012): a Job Title + Location pair taken from one existing result card that shows both values, chosen at execution time. Reference it in TC-011 and TC-054 instead of the DATA-003 / DATA-004 pair. |
| Reason | Independently chosen values can return no cards; TC-011 then has no cards to check and TC-054 cannot complete step 2. For the automation case this makes the run non-deterministic. |
| Re-assessment (latest: v1.4.0) | DATA-012 (Job Title + Location pair read from one displayed card that shows both) added; TC-011 and TC-054 select "the Job Title and the Location of the DATA-012 pair". Re-checked in v1.3.0: fix still present (DATA-012 now also requires fewer records than the unfiltered list; still read from one card). Re-checked in v1.4.0: fix still present. |
| Status | resolved |
| Resolution | test_design_revision: TestCases.md v1.2.0 (SHA-256 f61b7505…291a), TEST_DESIGN_APPROVED journal EVT-0023; produced by test-design EVT-0022; verified in review v1.1.0 |
| Raised in | review v1.0.0 |

### TR-004 — Exploration limit U-07 has no case, TQ or coverage gap

| Field | Value |
|---|---|
| Classification | Change Required |
| Category | missing_coverage |
| Affected test cases | — (source-level) |
| Sources | Exploration §13 U-07 · PC SA-002 |
| Finding | ExplorationReport §13 lists U-07 "Names with several matches (suggestion list ordering and limits)". TestCases.md has no case, TQ or CG for it; all other §13 limits (U-01 – U-06, U-08 – U-15 and the four unfinished flows) are carried into a case, TQ or CG. _(as raised against TestCases v1.1.0)_ |
| Basis | Coverage Rules: Exploration §13 coverage limits are carried into Coverage Gaps; review check 1 floor (a §13 limit with neither a case, TQ nor CG). |
| Proposed change | Add an Exploratory case and TQ for a name prefix with several matching employees (ordering and maximum number of suggestions), or add a CG explaining why it is not covered. |
| Reason | The source has neither a case nor a CG, so missing coverage is hidden. |
| Re-assessment (latest: v1.4.0) | U-07 is covered by Exploratory TC-055 (Expected Result "Not established by approved requirements.", Needs Automation FALSE) and TQ-016. Re-checked in v1.3.0: fix still present. Re-checked in v1.4.0: fix still present. |
| Status | resolved |
| Resolution | test_design_revision: TestCases.md v1.2.0 (SHA-256 f61b7505…291a), TEST_DESIGN_APPROVED journal EVT-0023; produced by test-design EVT-0022; verified in review v1.1.0 |
| Raised in | review v1.0.0 |

### TR-005 — TC-036 uses a QUESTION observation as observed baseline

| Field | Value |
|---|---|
| Classification | Change Required |
| Category | invalid_expected_result |
| Affected test cases | TC-036 |
| Sources | OBS-021 · OBS-008 · EVD-016 |
| Finding | TC-036's Expected Result Basis is "OBS-008 + OBS-021 (observed baseline; human decision, journal EVT-0016)". OBS-021 is classified QUESTION. The human decision recorded in EVT-0016 adopts evidenced GAP-class observations as baseline; it does not cover QUESTION observations, which the Expected Result Rules map to Not established. _(as raised against TestCases v1.1.0)_ |
| Basis | Test-design Expected Result Rules (QUESTION → Not established / Exploratory); human decision scope (EVT-0016 decisions[0]). |
| Proposed change | TC-036 Expected Result Basis: cite OBS-008 only (it shows the "(2) Records Found" format). Keep OBS-021 in Traceability as context. |
| Reason | An expected result must rest only on an approved basis; the basis line is what Test Review and execution trust. |
| Re-assessment (latest: v1.4.0) | TC-036 Expected Result Basis is "OBS-008 (observed baseline; …)"; no established case cites a QUESTION or POTENTIAL BUG observation (OBS-002, OBS-021, OBS-022) as its basis. Re-checked in v1.3.0: fix still present. Re-checked in v1.4.0: fix still present. |
| Status | resolved |
| Resolution | test_design_revision: TestCases.md v1.2.0 (SHA-256 f61b7505…291a), TEST_DESIGN_APPROVED journal EVT-0023; produced by test-design EVT-0022; verified in review v1.1.0 |
| Raised in | review v1.0.0 |

### TR-006 — Expected result combines independent expectations

| Field | Value |
|---|---|
| Classification | Change Required |
| Category | invalid_expected_result |
| Affected test cases | TC-003, TC-041, TC-045 |
| Sources | OBS-003 · OBS-018 |
| Finding | TC-003 expects the URL to load AND the sidebar item to be active. TC-041 expects the panel to open AND the URL to stay the same. TC-045 expects the panel to close AND the URL to stay the same. Each pair is two independent observable outcomes; one can hold while the other fails. _(as raised against TestCases v1.1.0)_ |
| Basis | Test-design rule: one single unambiguous expected result; independent expectations become separate cases. |
| Proposed change | Split each into separate cases (new IDs), or move the URL check into its own case: e.g. TC-041 keeps "panel opens", a new case asserts "URL unchanged after card click"; TC-003 keeps one of URL / active item. |
| Reason | A FAIL would not show which expectation failed, and a partial result cannot be recorded as one PASS/FAIL. |
| Re-assessment (latest: v1.4.0) | TC-003, TC-041 and TC-045 each keep one outcome; the URL and active-item checks are new cases TC-056, TC-057 and TC-058, each with a single expected result and an OBS-018 / OBS-003 basis. Re-checked in v1.3.0: fix still present. Re-checked in v1.4.0: fix still present. |
| Status | resolved |
| Resolution | test_design_revision: TestCases.md v1.2.0 (SHA-256 f61b7505…291a), TEST_DESIGN_APPROVED journal EVT-0023; produced by test-design EVT-0022; verified in review v1.1.0 |
| Raised in | review v1.0.0 |

### TR-007 — TC-036 cannot verify "N is the number of matching records"

| Field | Value |
|---|---|
| Classification | Change Required |
| Category | unclear_step |
| Affected test cases | TC-036 |
| Sources | OBS-008 · OBS-019 |
| Finding | TC-036 expects "N is the number of matching records and N ≥ 2", but gives no way to count the matching records. Results load incrementally (OBS-019: 14 cards first), so for N > 14 a tester must scroll to count, and another may not. _(as raised against TestCases v1.1.0)_ |
| Basis | Test-design rule: steps executable and deterministic where possible; OBS-019 (incremental loading). |
| Proposed change | Constrain DATA-004 for TC-036 to a Location that returns between 2 and 14 records, and state the check: N equals the number of rendered cards. |
| Reason | Two testers could judge the same screen differently. |
| Re-assessment (latest: v1.4.0) | TC-036 uses DATA-015 (Location returning 2 – 14 records, within the initial 14-card batch of OBS-019), counts the cards in step 2 and expects N to equal that count. Re-checked in v1.3.0: fix still present. Re-checked in v1.4.0: fix still present. |
| Status | resolved |
| Resolution | test_design_revision: TestCases.md v1.2.0 (SHA-256 f61b7505…291a), TEST_DESIGN_APPROVED journal EVT-0023; produced by test-design EVT-0022; verified in review v1.1.0 |
| Raised in | review v1.0.0 |

### TR-008 — Observed baseline rests on an unconfirmed assumption

| Field | Value |
|---|---|
| Classification | Advisory |
| Category | unsupported_assumption |
| Affected test cases | All 40 established (non-Exploratory) cases |
| Sources | TA-AS-001 · PC GAP-001 · PC RK-002 |
| Finding | All established cases (37 in v1.1.0; 40 in v1.2.0) rest on observed behavior adopted by human decision (EVT-0016), recorded as assumption TA-AS-001 (Unconfirmed). This is stated openly in TestCases §2 and §3. _(as raised against TestCases v1.1.0)_ |
| Basis | PC GAP-001 (no documented Directory behavior), PC RK-002 (a defect could be recorded as expected behavior). |
| Proposed change | No change to cases. Recommended: a ProjectContext revision that documents the adopted behaviors, so later reviews judge them against documentation. |
| Reason | Sanctioned by a human decision, so it does not block; it remains a risk worth closing. |
| Re-assessment (latest: v1.4.0) | Still present in v1.3.0 (unchanged since v1.2.0): TA-AS-001 remains Unconfirmed; ProjectContext has not been revised. Now applies to all 40 established cases (incl. TC-056 – TC-058). Re-checked in v1.4.0: still present (the v1.4.0 change touches only TC-024 and the §1 history). |
| Status | open |
| Resolution | — |
| Raised in | review v1.0.0 |

### TR-009 — "Scroll down … several times" is vague

| Field | Value |
|---|---|
| Classification | Advisory |
| Category | unclear_step |
| Affected test cases | TC-037 |
| Sources | OBS-019 |
| Finding | TC-037 step 2 says "Scroll down inside the results area several times". _(as raised against TestCases v1.1.0)_ |
| Basis | Test-design rule: ordered, executable steps. |
| Proposed change | State the action: scroll inside the results area until the last rendered card is visible, then wait for loading. |
| Reason | The outcome is unlikely to differ, but the step should be reproducible. |
| Re-assessment (latest: v1.4.0) | Still present in v1.3.0 (unchanged since v1.2.0): TC-037 step 2 still reads "Scroll down inside the results area several times". Re-checked in v1.4.0: still present (the v1.4.0 change touches only TC-024 and the §1 history). |
| Status | open |
| Resolution | — |
| Raised in | review v1.0.0 |

### TR-010 — DATA-006 verification is circular

| Field | Value |
|---|---|
| Classification | Advisory |
| Category | missing_precondition |
| Affected test cases | TC-026, TC-027 |
| Sources | DATA-006 · OBS-017 · EVD-022 |
| Finding | DATA-006 says "verify no suggestion appears before use", which is what TC-026 itself asserts. _(as raised against TestCases v1.1.0)_ |
| Basis | TestCases §10 DATA-006; OBS-017 (exploration used 'zzqxv'). |
| Proposed change | Define DATA-006 as a fixed design string (e.g. the value used in exploration, EVD-022) and remove the pre-verification. |
| Reason | Does not change how the result is judged. |
| Re-assessment (latest: v1.4.0) | Still present in v1.3.0 (unchanged since v1.2.0): DATA-006 still says "verify no suggestion appears before use". Re-checked in v1.4.0: still present (the v1.4.0 change touches only TC-024 and the §1 history). |
| Status | open |
| Resolution | — |
| Raised in | review v1.0.0 |

### TR-011 — TC-004 typed Business Rule; PC DEP-006 link incomplete

| Field | Value |
|---|---|
| Classification | Advisory |
| Category | traceability_error |
| Affected test cases | TC-004 |
| Sources | PC BR-006 · PC DEP-006 · TestCases §5 |
| Finding | TC-004 is typed Business Rule with basis PC BR-006, but PC BR-006 is a QA-process rule (verify controls before finalizing scope), already met by exploration; the expected control set comes from OBS-004. Separately, the §5 matrix links PC DEP-006 only to TC-001, although every case uses DATA-001. _(as raised against TestCases v1.1.0)_ |
| Basis | PC BR-006 text; TestCases §5 and §10. |
| Proposed change | Type TC-004 as Positive (keep PC BR-006 in traceability as context). Add the other DATA-001 cases to the PC DEP-006 row, or note that all cases depend on it. |
| Reason | The link can be inferred, and the expected result is still supported by OBS-004. |
| Re-assessment (latest: v1.4.0) | Still present in v1.3.0 (unchanged since v1.2.0): TC-004 is still typed Business Rule; the PC DEP-006 matrix row still lists TC-001 only (TC-001 is the one case that does not use DATA-001). Re-checked in v1.4.0: still present (the v1.4.0 change touches only TC-024 and the §1 history). |
| Status | open |
| Resolution | — |
| Raised in | review v1.0.0 |

### TR-012 — Automation case needs a configured credential source

| Field | Value |
|---|---|
| Classification | Advisory |
| Category | missing_precondition |
| Affected test cases | TC-054 |
| Sources | DATA-001 · PC BR-016 |
| Finding | TC-054 (the only automation case) logs in with DATA-001, whose source is "credentials displayed on the application's login page". An automated run needs a configured, named secret source. _(as raised against TestCases v1.1.0)_ |
| Basis | CLAUDE.md Secrets Rule; PC BR-016. |
| Proposed change | For automation, name a configured test-data / secret source for DATA-001 (e.g. environment variables) without recording values. |
| Reason | Manual execution is unaffected; automation-generation will need it. |
| Re-assessment (latest: v1.4.0) | Still present in v1.3.0 (unchanged since v1.2.0): DATA-001's source is still the credentials displayed on the login page; no configured secret source is named for automating TC-054. Re-checked in v1.4.0: still present (the v1.4.0 change touches only TC-024 and the §1 history). |
| Status | open |
| Resolution | — |
| Raised in | review v1.0.0 |

### TR-013 — Transient toast is hard to observe manually

| Field | Value |
|---|---|
| Classification | Advisory |
| Category | unclear_step |
| Affected test cases | TC-013 |
| Sources | OBS-011 · EVD-010 · EVD-011 |
| Finding | TC-013 asks the tester to "immediately observe the toast area"; in exploration the toast had already gone when the screenshot was taken (OBS-011). _(as raised against TestCases v1.1.0)_ |
| Basis | OBS-011. |
| Proposed change | Add: record the screen (or take a screenshot right after clicking Search) to capture the toast. |
| Reason | Evidence capture, not the expected result. |
| Re-assessment (latest: v1.4.0) | Still present in v1.3.0 (unchanged since v1.2.0): TC-013 step 3 still reads "Immediately observe the toast area". Re-checked in v1.4.0: still present (the v1.4.0 change touches only TC-024 and the §1 history). |
| Status | open |
| Resolution | — |
| Raised in | review v1.0.0 |

### TR-014 — Documented dependencies missing from the matrix

| Field | Value |
|---|---|
| Classification | Change Required |
| Category | missing_coverage |
| Affected test cases | — (source-level) |
| Sources | PC DEP-001 · PC DEP-002 · PC DEP-003 · PC DEP-004 · PC DEP-005 · PC DEP-007 · PC DEP-008 · PC DEP-009 |
| Finding | ProjectContext §7 documents PC DEP-001 – DEP-009. TestCases.md traces only PC DEP-006; PC DEP-001 – DEP-005 and DEP-007 – DEP-009 appear in no case, matrix row or CG. PC DEP-001 / DEP-002 (OrangeHRM UI and Directory page available) are in practice exercised by TC-001 / TC-002, but this is not recorded. _(as raised against TestCases v1.1.0)_ |
| Basis | Review check 1 floor: a documented dependency (PC DEP) with neither a covering case nor a CG. |
| Proposed change | Add PC DEP-001 and DEP-002 to the traceability of TC-001 / TC-002 (and the §5 matrix); add a CG for the process dependencies DEP-003 – DEP-005 and DEP-007 – DEP-009 (PRD, scope, flags, Playwright, Claude, IntelliJ). |
| Reason | Without it, dependency coverage cannot be verified from the artifact. |
| Re-assessment (latest: v1.4.0) | PC DEP-001 and PC DEP-002 are in the traceability of TC-001 and TC-002; PC DEP-003 – 005 and 007 – 009 are recorded in CG-010; all nine PC DEP rows are in the §5 matrix. Re-checked in v1.3.0: fix still present. Re-checked in v1.4.0: fix still present. |
| Status | resolved |
| Resolution | test_design_revision: TestCases.md v1.2.0 (SHA-256 f61b7505…291a), TEST_DESIGN_APPROVED journal EVT-0023; produced by test-design EVT-0022; verified in review v1.1.0 |
| Raised in | review v1.0.0 |

### TR-015 — TC-054 gives no reference for judging the "unfiltered" result count

| Field | Value |
|---|---|
| Classification | Change Required |
| Category | unclear_step |
| Affected test cases | TC-054 |
| Sources | OBS-012 · OBS-021 · OBS-022 · PB-001 · DATA-012 |
| Finding | TC-054 (the only automation case) expects the results header to show the unfiltered "(N) Records Found" list after Reset, but no step records a reference count, and DATA-012 does not require the pair to return fewer records than the unfiltered list. A tester who only checks the "(N) Records Found" format would pass a Reset that clears the fields but leaves the filtered results. A tester who compares N with the count shown after login may fail the case because the shared data changes during a session (OBS-021: 130 → 141 in 10 minutes). The case also does not say when to read the header; a transient "No Records Found" was seen once while the list loaded (OBS-022, PB-001, unconfirmed). Not raised in review v1.0.0; found on this full re-run of the checks. _(as raised against TestCases v1.2.0)_ |
| Basis | Test-design rules: executable, deterministic steps and one unambiguous expected result (TestCases §4 rules; skill Test Case Generation Rules). OBS-012 (Reset reloads the unfiltered results), OBS-021 (data changes during a session). TC-015 already handles the same check with a within-case comparison. |
| Proposed change | TC-054: after the Search in step 2, note the filtered count k from the results header; change the results-header part of the Expected Result to "(N) Records Found with N greater than k", the TC-015 pattern (basis OBS-012). DATA-012: add "the pair returns fewer records than the unfiltered list", as DATA-004 does for TC-015. Also recommended: state that the header is read once the result cards are displayed after Reset (PB-001 stays explored by TC-050). |
| Reason | As written, two testers can reach different verdicts on the same screen, and automation-generation would have to invent the "unfiltered" assertion, which the platform forbids. TC-054 is the only automation case. Where it is unclear whether a result could become untrustworthy, the rule is Change Required. |
| Re-assessment (latest: v1.4.0) | TC-054 step 3 notes the filtered record count k once result cards are displayed; step 6 waits until result cards are displayed after Reset before reading the header; the Expected Result now checks "(N) Records Found" with N greater than k (no "unfiltered" wording, no comparison with the login count). DATA-012 requires the pair to return fewer records than the unfiltered list. Basis (OBS-012), traceability, technique and flags unchanged; no fixed names or totals. Re-checked in v1.4.0: fix still present. |
| Status | resolved |
| Resolution | test_design_revision: TestCases.md v1.3.0 (SHA-256 66e895e7…3d70), TEST_DESIGN_APPROVED journal EVT-0029; produced by test-design EVT-0026; verified in review v1.2.0 |
| Raised in | review v1.1.0 |

### TR-016 — Narrative counts and ranges not updated for v1.2.0

| Field | Value |
|---|---|
| Classification | Advisory |
| Category | traceability_error |
| Affected test cases | — (source-level) |
| Sources | TestCases §1 Revision History · TestCases §2 Constraints · TestCases §3 · TestCases §11 |
| Finding | §1 Revision History: the 1.0.0 row lists "TC-001…TC-058" as added, but v1.0.0 had 54 cases; TC-055 – TC-058 were added in 1.2.0, as the 1.2.0 row correctly says. §3 still says the cases already FALSE include "Exploratory (17)", while §11 and §4 have 18 Exploratory cases (TC-055 is new). §2 Constraints say data is chosen at execution time from "DATA-002 – DATA-010", although DATA-012 – DATA-015 are also execution-time data. _(as raised against TestCases v1.2.0)_ |
| Basis | Internal consistency of TestCases.md (§1 and §3 vs §4 and §11; §2 vs §10). |
| Proposed change | §1: change the 1.0.0 row's Added column to TC-001…TC-054. §3: "Exploratory (18)". §2: refer to DATA-002 – DATA-015 (excluding DATA-006 and DATA-011, which are design values), or to "the DATA items in §10". |
| Reason | The §11 counts, which the traceability check relies on, match §4, so no case is performed or judged differently. The stale text could mislead a reader of the revision history. |
| Re-assessment (latest: v1.4.0) | Still present in v1.3.0: the §1 1.0.0 row still lists TC-001…TC-058, §3 still says "Exploratory (17)", §2 still says DATA-002 – DATA-010. The new 1.3.0 history row is accurate. Re-checked in v1.4.0: still present (the v1.4.0 change touches only TC-024 and the §1 history). |
| Status | open |
| Resolution | — |
| Raised in | review v1.1.0 |

### TR-017 — DATA-013 relies on a suggestion list whose length limit is unknown

| Field | Value |
|---|---|
| Classification | Advisory |
| Category | missing_precondition |
| Affected test cases | TC-034, TC-035, TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-052, TC-053, TC-056, TC-057 |
| Sources | DATA-013 · DATA-007 · DATA-008 · DATA-009 · DATA-002 · TQ-016 · OBS-021 |
| Finding | DATA-013 confirms uniqueness by checking that the full name appears exactly once in the suggestion list for the 4-character prefix. Whether that list is truncated is unknown (TQ-016, TC-055). DATA-002 limits the list by requiring a prefix that begins no other displayed card's first name, but DATA-007, DATA-008 and DATA-009 have no such condition, so a common prefix could produce a truncated list that hides a same-named employee. _(as raised against TestCases v1.2.0)_ |
| Basis | TQ-016 (suggestion-list length and truncation not observed); OBS-021 (duplicate names in the demo data); DATA-002 vs DATA-007 / DATA-008 / DATA-009 (TestCases §10). |
| Proposed change | Require DATA-007, DATA-008 and DATA-009 employees to also meet DATA-002's prefix condition (the 4-character prefix begins no other displayed card's first name), or revisit DATA-013 once TQ-016 is answered. |
| Reason | The residual risk is small, and a hidden duplicate would show as two identically named cards, visible to the tester rather than silently changing a verdict. |
| Re-assessment (latest: v1.4.0) | Still present in v1.3.0: DATA-007, DATA-008 and DATA-009 are unchanged. Re-checked in v1.4.0: still present (the v1.4.0 change touches only TC-024 and the §1 history). |
| Status | open |
| Resolution | — |
| Raised in | review v1.1.0 |

## 7. Open Questions

| ID | Related | Related test cases | Exact ambiguity | Required clarification | Blocks approval? | Owner |
|---|---|---|---|---|---|---|
| RQ-001 | TA-AS-001; PC GAP-001 | All established cases | The observed baseline is adopted by decision but not documented in ProjectContext. | Should ProjectContext be revised to document the adopted Directory behaviors before execution, or after? | No | not stated |
| RQ-002 | DATA-001; PC BR-016 | TC-054 | Which configured secret source will automation use for the demo account? | Name the source (e.g. environment variables) for automation-generation. | No | not stated |

Both questions carried over from v1.0.0, unanswered. An open question never blocks approval by itself. If its answer decides whether a case is valid, the problem is also recorded as a Change Required finding.

## 8. Resolution Tracking

| Finding | Raised in | Classification history | Status | Resolution | Verified in |
|---|---|---|---|---|---|
| TR-001 | v1.0.0 | Change Required (unchanged) | resolved | test_design_revision: TestCases v1.2.0, `TEST_DESIGN_APPROVED` EVT-0023 | v1.1.0 |
| TR-002 | v1.0.0 | Change Required (unchanged) | resolved | test_design_revision: TestCases v1.2.0, `TEST_DESIGN_APPROVED` EVT-0023 | v1.1.0 |
| TR-003 | v1.0.0 | Change Required (unchanged) | resolved | test_design_revision: TestCases v1.2.0, `TEST_DESIGN_APPROVED` EVT-0023 | v1.1.0 |
| TR-004 | v1.0.0 | Change Required (unchanged) | resolved | test_design_revision: TestCases v1.2.0, `TEST_DESIGN_APPROVED` EVT-0023 | v1.1.0 |
| TR-005 | v1.0.0 | Change Required (unchanged) | resolved | test_design_revision: TestCases v1.2.0, `TEST_DESIGN_APPROVED` EVT-0023 | v1.1.0 |
| TR-006 | v1.0.0 | Change Required (unchanged) | resolved | test_design_revision: TestCases v1.2.0, `TEST_DESIGN_APPROVED` EVT-0023 | v1.1.0 |
| TR-007 | v1.0.0 | Change Required (unchanged) | resolved | test_design_revision: TestCases v1.2.0, `TEST_DESIGN_APPROVED` EVT-0023 | v1.1.0 |
| TR-008 | v1.0.0 | Advisory (unchanged) | open | — | — |
| TR-009 | v1.0.0 | Advisory (unchanged) | open | — | — |
| TR-010 | v1.0.0 | Advisory (unchanged) | open | — | — |
| TR-011 | v1.0.0 | Advisory (unchanged) | open | — | — |
| TR-012 | v1.0.0 | Advisory (unchanged) | open | — | — |
| TR-013 | v1.0.0 | Advisory (unchanged) | open | — | — |
| TR-014 | v1.0.0 | Change Required (unchanged) | resolved | test_design_revision: TestCases v1.2.0, `TEST_DESIGN_APPROVED` EVT-0023 | v1.1.0 |
| TR-015 | v1.1.0 | Change Required (unchanged) | resolved | test_design_revision: TestCases v1.3.0, `TEST_DESIGN_APPROVED` EVT-0029 | v1.2.0 |
| TR-016 | v1.1.0 | Advisory (unchanged) | open | — | — |
| TR-017 | v1.1.0 | Advisory (unchanged) | open | — | — |

No finding was withdrawn or downgraded; no human `revision_request` exists on this stage.

## 9. Review Summary

| Metric | Count |
|---|---|
| Active cases reviewed | 58 |
| Cases with no open findings | 14 |
| Sources checked | 84 |
| Sources not covered (no case, TQ or CG) | 0 |
| Findings total | 17 |
| Change Required (open / resolved / withdrawn) | 0 / 9 / 0 |
| Advisory (open / resolved / withdrawn) | 8 / 0 / 0 |
| Open questions | 2 |
| **Review outcome** | ready_for_approval |

_No overall quality score is given. Judgment belongs to the human reviewer._
_`TEST_REVIEW_APPROVED` is accepted only when no Change Required finding is open._
