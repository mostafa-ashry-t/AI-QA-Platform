# Test Cases

> Produced by the `test-design` skill (v1.0.1, prompt `test-design` v1.0.0) from the
> approved ProjectContext and the approved ExplorationReport v1.1.0. Design only:
> nothing was executed, no browser or MCP was used, and no automation was written.
>
> `ExplorationReport (EXPLORATION_APPROVED) → Test Design → HARD STOP → TEST_DESIGN_APPROVED → Test Review (mandatory)`

## 1. Test Design Information

| Field | Value |
|---|---|
| Task ID | `orangehrm-ui-api` |
| Task Name | `OrangeHRM UI & API QA assignment` (scope: Directory UI only) |
| Project Name | `OrangeHRM` |
| Workflow Run ID | `RUN-001` |
| ProjectContext version | Approved · SHA-256 `0b0dcc57d5fc887e8e3c2b0e1f74d0934841430958a2ba3da8f52258d55f24de` · approval journal EVT-0009 |
| ExplorationReport version | 1.1.0 · SHA-256 `0edc9da6ebc94b63f27c4e9545f2c44062f87c70b8f53ed9e825096d8b8651d2` · approval journal EVT-0015 |
| TestCases version | 1.4.0 |
| Status | Approved (`TEST_DESIGN_APPROVED`, journal EVT-0037) |
| Test Design skill version | test-design v1.0.1 |
| Prompt version | test-design v1.0.0 |
| Designed at | 2026-10-15T10:23:08Z |
| CSV export | `test-design/TestCases.csv` (same cases; columns `valid in scope` and `needs automation`). This Markdown file is the reviewed source; the CSV is generated from the same data. |

### Revision History

| Version | Date (UTC) | Reason | Changed sections | Added | Modified | Withdrawn |
|---|---|---|---|---|---|---|
| 1.0.0 | 2026-10-15 | Initial design | All | TC-001…TC-058 | — | — |
| 1.1.0 | 2026-10-15 | Human decision (journal EVT-0017): automation scope is TC-054 (End-to-End) only; all other cases are manual-only. Needs Automation changed TRUE → FALSE for 33 cases; the 20 cases that were already FALSE keep FALSE, with an added manual-only note | §1, §3, §4 (Index and Needs Automation of TC-001 – TC-053), §11 | — | TC-001, TC-002, TC-003, TC-004, TC-005, TC-006, TC-007, TC-008, TC-009, TC-010, TC-011, TC-012, TC-014, TC-015, TC-017, TC-018, TC-019, TC-020, TC-021, TC-022, TC-023, TC-024, TC-025, TC-026, TC-034, TC-035, TC-036, TC-037, TC-041, TC-042, TC-043, TC-044, TC-045 (Needs Automation only) | — |
| 1.2.0 | 2026-10-15 | Test Review v1.0.0 Change Required findings TR-001 – TR-007 and TR-014 (journal EVT-0020; revision request EVT-0021): 4-character prefix and upper-case rule for name data (DATA-002); name-uniqueness condition (DATA-013); matching Job Title + Location pair from one card (DATA-012); U-07 exploratory case and TQ-016; TC-036 basis OBS-008 only and a 2 – 14 record Location (DATA-015); independent URL / active-item checks split into new cases; PC DEP-001/002 traced and CG-010 for process dependencies. Needs Automation unchanged: TC-054 only | §1, §3, §4, §5, §6, §7, §8, §9, §10, §11 | TC-055, TC-056, TC-057, TC-058 | TC-001, TC-002, TC-003, TC-011, TC-014, TC-017, TC-018, TC-020, TC-021, TC-022, TC-023, TC-024, TC-025, TC-031, TC-032, TC-034, TC-035, TC-036, TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-052, TC-053, TC-054 | — |
| 1.3.0 | 2026-10-15 | Test Review v1.1.0 Change Required finding TR-015 (journal EVT-0024; revision request EVT-0025): TC-054 notes the filtered record count k after Search, waits for result cards after Reset before reading the header, and expects "(N) Records Found" with N greater than k (no fixed names or total counts); DATA-012 requires the pair to return fewer records than the unfiltered list. Needs Automation unchanged: TC-054 only | §1, §4 (TC-054), §10 (DATA-012), TestCases.csv (TC-054 row) | — | TC-054 | — |
| 1.4.0 | 2026-10-18 | Manual-execution test case issue TCI-002 (ExecutionReport v1.0.0, journal EVT-0032; revision request EVT-0033): TC-024 step 2 could not be performed because the suggestion list stays closed after Search. New step 2: "Delete the last character of the text and type it again, so the suggestion list reopens."; the former step 2 becomes step 3. Expected result, basis, traceability, technique and flags unchanged | §1, §4 (TC-024), TestCases.csv (TC-024 row) | — | TC-024 | — |

## 2. Scope

### In scope

- PC SA-001 — Directory page access
- PC SA-002 — Directory search
- PC SA-003 — Directory filters
- PC SA-004 — Employee results
- PC SA-005 — Displayed employee information
- PC SA-006 — Exploration and scope finalization

### Out of scope

- All OrangeHRM modules other than Directory (PC §3; PC BR-001). The login page is used only as a precondition / dependency (TC-001, TC-002, TC-054).
- API testing of any kind (PC BR-002 – BR-005; user instruction). No API case exists.
- Execution, automation and bug reporting (later stages).

### Assumptions

| ID | Assumption | Status | Source |
|---|---|---|---|
| TA-AS-001 | The approved exploration observations describe intended behavior closely enough to serve as the expected baseline for this task | Unconfirmed — adopted by human decision | Human decision (journal EVT-0016); PC GAP-001, PC RK-002 |
| TA-AS-002 | The demo account used during exploration remains available for execution | Unconfirmed | DATA-001; PC DEP-006 |

### Constraints

- **Account:** only the existing demo account is used (human decision, journal EVT-0016). Role-dependent behavior is not covered (CG-003).
- **Data:** the shared demo data changes during a session (OBS-021). No case asserts a fixed count or a specific employee name; data is chosen at execution time (DATA-002 – DATA-010) and comparisons are made within one case (CG-004).
- **Environment:** browsers, viewports and devices are undefined (PC GAP-006); cases assume a desktop browser (CG-006).

## 3. Test Design Strategy

- **Expected-result policy (human decision, journal EVT-0016):** ProjectContext documents no Directory behavior (PC GAP-001), and the approved exploration classified every Directory behavior as GAP. The human decided that **evidenced, approved exploration observations are the expected baseline for this task**. Such expected results are cited as `OBS-### (observed baseline; human decision, journal EVT-0016)`. They are *observed* behavior adopted by decision, not documented requirements; Test Review may challenge any of them. Recommendation: a later ProjectContext revision should document these behaviors.
- **Not established:** anything not observed (Exploration §13 U-01 – U-15), the unconfirmed potential bug PB-001, and observed oddities that may be defects (e.g. the double space, TC-028) stay **Exploratory** with `Not established by approved requirements.` and a `TQ-###`.
- **Techniques selected:** Equivalence Partitioning (TA-001, TA-002, TA-010, TA-011), Boundary Value Analysis on the observed result-count wording (TA-003), Decision Table for filter combinations (TA-004), State Transition for the detail panel, filter panel, validation message and incremental loading (TA-005 – TA-008), Error Guessing as a supplement (TA-009). Detail in §6.
- **Techniques not applied:** Pairwise — three filter dimensions are fully handled by the decision table. BVA on input length — no length limit is documented or observed (TC-030 is Exploratory instead).
- **Coverage approach:** every PC SA-001 – SA-006 and PRD FR-022 – FR-026 has cases; every exploration observation is considered (§5); QA-process and other-stage rules are listed with coverage gaps (CG-001, CG-002). Error Handling is limited to the observed blocked-search case (TC-023): no application error state was observed.
- **Data-aware design:** preconditions select data from what the Directory shows at execution time; assertions compare within a case (e.g. TC-015) or check properties of every card (e.g. TC-009) rather than fixed values.
- **Name-based data (v1.2.0):** every employee-name step types the first 4 characters of the first name exactly as written on a card (DATA-002). Cases that must identify one employee add the uniqueness condition DATA-013 (the full name appears exactly once in the suggestion list), because duplicate full names exist in the demo data. Combined-filter cases use a Job Title + Location pair read from one card (DATA-012). No fixed names or counts are used.
- **Needs Automation (v1.1.0, human decision, journal EVT-0017):** only **TC-054** (End-to-End) is selected for automation. **All other 57 cases are manual-only** (Needs Automation = FALSE). In v1.0.0, 33 more cases were eligible for automation at design level (in scope, established, deterministic, High/Medium priority); their rationale now records both that eligibility and the decision. Cases that were already FALSE keep their original reason: Exploratory (17), transient UI (TC-013), priority not established (TC-038, TC-048).

## 4. Test Cases

### Index

| ID | Title | Type | Priority | Valid in Scope | Needs Automation | Status |
|---|---|---|---|---|---|---|
| TC-001 | Unauthenticated access to the Directory URL redirects to the login page | Dependency | High | TRUE | FALSE | Active |
| TC-002 | Logging in from the redirect returns the user to the Directory page | Positive | High | TRUE | FALSE | Active |
| TC-003 | Sidebar "Directory" link loads the Directory URL | Positive | Medium | TRUE | FALSE | Active |
| TC-004 | Directory filter panel provides exactly the verified controls | Business Rule | High | TRUE | FALSE | Active |
| TC-005 | Filter controls show their default state on page load | Positive | Medium | TRUE | FALSE | Active |
| TC-006 | Job Title options list "-- Select --" first, then values in case-insensitive alphabetical order | Positive | Medium | TRUE | FALSE | Active |
| TC-007 | Location options list "-- Select --" first, followed by at least one location | Positive | Medium | TRUE | FALSE | Active |
| TC-008 | Selecting a filter value does not change the results until Search is clicked | Dependency | High | TRUE | FALSE | Active |
| TC-009 | Location filter shows only employees at the selected location | Positive | High | TRUE | FALSE | Active |
| TC-010 | Job Title filter shows only employees with the selected job title | Positive | High | TRUE | FALSE | Active |
| TC-011 | Job Title and Location combine: results match both selections | Positive | High | TRUE | FALSE | Active |
| TC-012 | Filter combination with no matching employee shows "No Records Found" and no cards | Negative | High | TRUE | FALSE | Active |
| TC-013 | A search with no results shows an info toast "No Records Found" | Negative | Medium | TRUE | FALSE | Active |
| TC-014 | Reset returns all filter fields to their defaults | Positive | High | TRUE | FALSE | Active |
| TC-015 | Reset restores the unfiltered results without clicking Search | Positive | High | TRUE | FALSE | Active |
| TC-016 | Search clicked with all filter fields empty | Exploratory | Medium | TRUE | FALSE | Active |
| TC-017 | Typing part of an existing first name shows a matching suggestion | Positive | High | TRUE | FALSE | Active |
| TC-018 | Name suggestions are not case-sensitive | Positive | Medium | TRUE | FALSE | Active |
| TC-019 | Leading and trailing spaces do not prevent suggestions | Positive | Medium | TRUE | FALSE | Active |
| TC-020 | Searching a selected name suggestion shows only that employee | Positive | High | TRUE | FALSE | Active |
| TC-021 | Results header uses the singular "(1) Record Found" for one result | Boundary | Medium | TRUE | FALSE | Active |
| TC-022 | Searching with typed text not selected from suggestions shows "Invalid" | Validation | High | TRUE | FALSE | Active |
| TC-023 | Searching with typed text not selected from suggestions does not run the search | Error Handling | High | TRUE | FALSE | Active |
| TC-024 | Selecting a suggestion clears the "Invalid" message | Validation | Medium | TRUE | FALSE | Active |
| TC-025 | "Invalid" stays visible while new text is typed after a failed search | Validation | Medium | TRUE | FALSE | Active |
| TC-026 | Non-matching name text shows "No Records Found" in the suggestion list | Negative | High | TRUE | FALSE | Active |
| TC-027 | Search clicked with non-matching typed text | Exploratory | Medium | TRUE | FALSE | Active |
| TC-028 | Employee Name field text after selecting a suggestion | Exploratory | Medium | TRUE | FALSE | Active |
| TC-029 | Search by last name only or by middle name | Exploratory | Medium | TRUE | FALSE | Active |
| TC-030 | Very long input and special characters in Employee Name | Exploratory | Medium | TRUE | FALSE | Active |
| TC-031 | Leaving Employee Name with unselected text | Exploratory | Medium | TRUE | FALSE | Active |
| TC-032 | Keyboard selection of a name suggestion | Exploratory | Medium | TRUE | FALSE | Active |
| TC-033 | Keyboard operation of the Job Title and Location dropdowns | Exploratory | Medium | TRUE | FALSE | Active |
| TC-034 | Result card shows name, picture, job title, sub-unit and location for an employee with all values | Positive | High | TRUE | FALSE | Active |
| TC-035 | Result card omits the location line for an employee without a location | Positive | Medium | TRUE | FALSE | Active |
| TC-036 | Results header uses "(N) Records Found" when more than one record matches | Boundary | Medium | TRUE | FALSE | Active |
| TC-037 | Scrolling the results loads additional cards | Positive | High | TRUE | FALSE | Active |
| TC-038 | Results area has no pagination control | Positive | Not established | TRUE | FALSE | Active |
| TC-039 | Scrolling to the end of the result list | Exploratory | Medium | TRUE | FALSE | Active |
| TC-040 | Order of result cards | Exploratory | Medium | TRUE | FALSE | Active |
| TC-041 | Clicking a result card opens the detail panel | Positive | High | TRUE | FALSE | Active |
| TC-042 | Detail panel shows the clicked employee's name, job title, sub-unit and location | Positive | High | TRUE | FALSE | Active |
| TC-043 | Detail panel shows a Work Email entry for an employee with a work email | Positive | Medium | TRUE | FALSE | Active |
| TC-044 | Detail panel shows a QR code image | Positive | Medium | TRUE | FALSE | Active |
| TC-045 | Arrow icon closes the detail panel | Positive | Medium | TRUE | FALSE | Active |
| TC-046 | Detail panel actions: copy icons, contact icons, QR content, Work Telephone | Exploratory | Medium | TRUE | FALSE | Active |
| TC-047 | Clicking another card while the detail panel is open | Exploratory | Medium | TRUE | FALSE | Active |
| TC-048 | Filter panel toggle collapses the filter panel | Positive | Not established | TRUE | FALSE | Active |
| TC-049 | Filter panel toggle re-expands the collapsed panel | Exploratory | Not established | TRUE | FALSE | Active |
| TC-050 | Results header while the list loads after sidebar navigation (PB-001) | Exploratory | Medium | TRUE | FALSE | Active |
| TC-051 | Filters and results after a browser refresh or Back navigation | Exploratory | Medium | TRUE | FALSE | Active |
| TC-052 | Employee Name combined with a matching Location | Exploratory | Medium | TRUE | FALSE | Active |
| TC-053 | Employee Name combined with a Location the employee does not have | Exploratory | Medium | TRUE | FALSE | Active |
| TC-054 | End-to-end: redirect login, combined filter, employee details, close, Reset | End-to-End | High | TRUE | TRUE | Active |
| TC-055 | Suggestion list for a prefix that matches several employees | Exploratory | Medium | TRUE | FALSE | Active |
| TC-056 | Clicking a result card does not change the page URL | Positive | Medium | TRUE | FALSE | Active |
| TC-057 | Closing the detail panel does not change the page URL | Positive | Medium | TRUE | FALSE | Active |
| TC-058 | Sidebar "Directory" item is shown as active on the Directory page | Positive | Medium | TRUE | FALSE | Active |

### TC-001 — Unauthenticated access to the Directory URL redirects to the login page

| Field | Value |
|---|---|
| Type | Dependency |
| Priority | High — basis: Access precondition for every Directory case; PC RK-004, PC DEP-006 |
| Preconditions | No authenticated session in the browser (fresh browser context, or logged out). |
| Test Data | — |
| Steps | 1. Open the Directory URL https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory. |
| Expected Result | The browser ends on the login page URL https://opensource-demo.orangehrmlive.com/web/index.php/auth/login. |
| Expected Result Basis | OBS-001 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-001 · PC DEP-001 · PC DEP-002 · PC DEP-006 · OBS-001 · XGAP-001 · XDEP-001 |
| Technique | TA-010 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-002 — Logging in from the redirect returns the user to the Directory page

| Field | Value |
|---|---|
| Type | Positive |
| Priority | High — basis: Access precondition for every Directory case; PC RK-004 |
| Preconditions | No authenticated session in the browser (fresh browser context, or logged out). |
| Test Data | DATA-001 |
| Steps | 1. Open the Directory URL.<br>2. On the login page, log in with the demo account (DATA-001). |
| Expected Result | The Directory page is shown: the page URL is the Directory URL and the header title reads "Directory". |
| Expected Result Basis | OBS-003 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-001 · PC DEP-001 · PC DEP-002 · OBS-003 · XGAP-002 |
| Technique | TA-010 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-003 — Sidebar "Directory" link loads the Directory URL

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Navigation into the module; PC OQ-011 boundary (supporting) |
| Preconditions | Logged in with the demo account (DATA-001); Directory page open. |
| Test Data | DATA-001 |
| Steps | 1. Click the "Directory" item in the sidebar. |
| Expected Result | The page URL is the Directory URL. |
| Expected Result Basis | OBS-003 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-001 · PC OQ-011 · OBS-003 |
| Technique | TA-010 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-004 — Directory filter panel provides exactly the verified controls

| Field | Value |
|---|---|
| Type | Business Rule |
| Priority | High — basis: PC BR-006 (controls verified before scope is finalized); PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001 |
| Steps | 1. Inspect the filter panel titled "Directory". |
| Expected Result | The filter panel contains exactly: Employee Name (text input), Job Title (dropdown), Location (dropdown), Reset button and Search button. |
| Expected Result Basis | PC BR-006 + OBS-004 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC BR-006 · PC SA-006 · PRD FR-026 · OBS-004 · XGAP-003 |
| Technique | TA-002 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-005 — Filter controls show their default state on page load

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-022/FR-023 via PC SA-002/SA-003) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001 |
| Steps | 1. Observe Employee Name, Job Title and Location without interacting. |
| Expected Result | Employee Name is empty with the placeholder "Type for hints...", and Job Title and Location both display "-- Select --". |
| Expected Result Basis | OBS-004 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-002 · PC SA-003 · OBS-004 · PRD FR-022 · PRD FR-023 |
| Technique | TA-002 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-006 — Job Title options list "-- Select --" first, then values in case-insensitive alphabetical order

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-023 via PC SA-003) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001 |
| Steps | 1. Open the Job Title dropdown.<br>2. Read the option list from top to bottom. |
| Expected Result | The first option is "-- Select --" and the remaining options are in case-insensitive alphabetical order. |
| Expected Result Basis | OBS-005 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-003 · OBS-005 · XGAP-004 · PRD FR-023 |
| Technique | TA-002 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | Data-aware: the option values come from shared demo data. Do not assert the exact list or count (v1.1.0 snapshot: 28 values, reference only). |

### TC-007 — Location options list "-- Select --" first, followed by at least one location

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-023 via PC SA-003) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001 |
| Steps | 1. Open the Location dropdown.<br>2. Read the option list. |
| Expected Result | The first option is "-- Select --" and at least one location value follows it. |
| Expected Result Basis | OBS-006 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-003 · OBS-006 · XGAP-005 · PRD FR-023 |
| Technique | TA-002 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | Data-aware: v1.1.0 snapshot (Canadian Regional HQ, HQ - CA, USA, New York Sales Office, Texas R&D) is reference only. |

### TC-008 — Selecting a filter value does not change the results until Search is clicked

| Field | Value |
|---|---|
| Type | Dependency |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-023 via PC SA-003); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-004 |
| Steps | 1. Note the results header text.<br>2. Select a Location value from DATA-004.<br>3. Do not click Search; observe the results header again. |
| Expected Result | The results header text and the displayed cards are unchanged after selecting the value. |
| Expected Result Basis | OBS-007 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-003 · OBS-007 · XGAP-006 · XDEP-002 · PRD FR-023 |
| Technique | TA-002 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-009 — Location filter shows only employees at the selected location

| Field | Value |
|---|---|
| Type | Positive |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-023 via PC SA-003); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-004 |
| Steps | 1. Select a Location value from DATA-004.<br>2. Click Search. |
| Expected Result | Every displayed result card shows the selected location. |
| Expected Result Basis | OBS-008 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-003 · PC SA-004 · OBS-008 · XGAP-007 · PRD FR-023 · PRD FR-024 |
| Technique | TA-004 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-010 — Job Title filter shows only employees with the selected job title

| Field | Value |
|---|---|
| Type | Positive |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-023 via PC SA-003); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-003 |
| Steps | 1. Select a Job Title value from DATA-003.<br>2. Click Search. |
| Expected Result | Every displayed result card shows the selected job title. |
| Expected Result Basis | OBS-009 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-003 · PC SA-004 · OBS-009 · XGAP-008 · PRD FR-023 · PRD FR-024 |
| Technique | TA-004 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-011 — Job Title and Location combine: results match both selections

| Field | Value |
|---|---|
| Type | Positive |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-023 via PC SA-003); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-012 |
| Steps | 1. Select the Job Title and the Location of the DATA-012 pair.<br>2. Click Search. |
| Expected Result | Every displayed result card shows both the selected job title and the selected location. |
| Expected Result Basis | OBS-010 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-003 · OBS-010 · XGAP-009 · PRD FR-023 |
| Technique | TA-004 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-012 — Filter combination with no matching employee shows "No Records Found" and no cards

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-024 via PC SA-004); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-005 |
| Steps | 1. Select the Job Title and Location pair from DATA-005.<br>2. Click Search. |
| Expected Result | The results header reads "No Records Found" and no result cards are displayed. |
| Expected Result Basis | OBS-011 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-004 · OBS-011 · XGAP-010 · PRD FR-024 |
| Technique | TA-004, TA-003 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-013 — A search with no results shows an info toast "No Records Found"

| Field | Value |
|---|---|
| Type | Negative |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-024 via PC SA-004) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-005 |
| Steps | 1. Select the Job Title and Location pair from DATA-005.<br>2. Click Search.<br>3. Immediately observe the toast area. |
| Expected Result | An info toast with the text "No Records Found" appears. |
| Expected Result Basis | OBS-011 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-004 · OBS-011 · XGAP-010 · PRD FR-024 |
| Technique | TA-009 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — The toast is transient (gone within seconds); capture is timing-dependent, so not deterministic for automation. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | — |

### TC-014 — Reset returns all filter fields to their defaults

| Field | Value |
|---|---|
| Type | Positive |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-022/FR-023 via PC SA-002/SA-003); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002, DATA-003, DATA-004 |
| Steps | 1. Type the first 4 characters of the DATA-002 employee's first name (as written on the card) and select the employee's suggestion; select a Job Title (DATA-003) and a Location (DATA-004).<br>2. Click Reset. |
| Expected Result | Employee Name is empty and Job Title and Location both display "-- Select --". |
| Expected Result Basis | OBS-012 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-002 · PC SA-003 · OBS-012 · XGAP-011 · PRD FR-022 · PRD FR-023 |
| Technique | TA-002 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-015 — Reset restores the unfiltered results without clicking Search

| Field | Value |
|---|---|
| Type | Positive |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-024 via PC SA-004); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-004 |
| Steps | 1. Select a Location (DATA-004) and click Search; note the filtered results header count.<br>2. Click Reset (do not click Search). |
| Expected Result | The results header shows "(N) Records Found" with N greater than the filtered count noted in step 1. |
| Expected Result Basis | OBS-012 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-004 · OBS-012 · XGAP-011 · PRD FR-024 |
| Technique | TA-002 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | Data-aware: compares counts within the same case; never a fixed N. DATA-004 must return fewer records than the unfiltered list. |

### TC-016 — Search clicked with all filter fields empty

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-022 via PC SA-002); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001 |
| Steps | 1. With all filters at defaults, click Search.<br>2. Record the results header, cards and any message. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-002 · PC SA-004 · PRD FR-022 · PRD FR-024 |
| Technique | TA-004 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Exploration U-01: not explored. TQ-001. |

### TC-017 — Typing part of an existing first name shows a matching suggestion

| Field | Value |
|---|---|
| Type | Positive |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-022 via PC SA-002); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002 |
| Steps | 1. Type the first 4 characters of the DATA-002 employee's first name into Employee Name, character by character.<br>2. Wait for the suggestion list. |
| Expected Result | The suggestion list contains the DATA-002 employee's full name. |
| Expected Result Basis | OBS-013 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-002 · OBS-013 · XGAP-012 · PRD FR-022 |
| Technique | TA-001 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | DATA-002's prefix does not begin any other displayed card's first name, which keeps the list short; the suggestion-list limit is unknown (TQ-016, TC-055). |

### TC-018 — Name suggestions are not case-sensitive

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-022 via PC SA-002) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002 |
| Steps | 1. Type the first 4 characters of the DATA-002 employee's first name in lower case (DATA-002 guarantees an upper-case letter among them, so the input differs from the card).<br>2. Wait for the suggestion list. |
| Expected Result | The suggestion list contains the DATA-002 employee's full name. |
| Expected Result Basis | OBS-013 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-002 · OBS-013 · XGAP-012 · PRD FR-022 |
| Technique | TA-001 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-019 — Leading and trailing spaces do not prevent suggestions

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-022 via PC SA-002) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002 |
| Steps | 1. Type two spaces, the first 4 characters of the DATA-002 employee's first name, then two spaces.<br>2. Wait for the suggestion list. |
| Expected Result | The suggestion list contains the DATA-002 employee's full name. |
| Expected Result Basis | OBS-013 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-002 · OBS-013 · XGAP-012 · PRD FR-022 |
| Technique | TA-001 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-020 — Searching a selected name suggestion shows only that employee

| Field | Value |
|---|---|
| Type | Positive |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-022 via PC SA-002); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-002 employee's first name (as written on the card).<br>2. Select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list).<br>3. Click Search. |
| Expected Result | Exactly one result card is displayed, and it shows the selected employee's name. |
| Expected Result Basis | OBS-016 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-002 · PC SA-004 · OBS-016 · XGAP-015 · PRD FR-022 · PRD FR-024 |
| Technique | TA-001, TA-004 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-021 — Results header uses the singular "(1) Record Found" for one result

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-024 via PC SA-004) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-002 employee's first name (as written on the card).<br>2. Select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list).<br>3. Click Search. |
| Expected Result | The results header reads exactly "(1) Record Found". |
| Expected Result Basis | OBS-016 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-004 · OBS-016 · XGAP-015 · PRD FR-024 |
| Technique | TA-003 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-022 — Searching with typed text not selected from suggestions shows "Invalid"

| Field | Value |
|---|---|
| Type | Validation |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-022 via PC SA-002); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002 |
| Steps | 1. Type the first 4 characters of the DATA-002 employee's first name (as written on the card).<br>2. Do not select a suggestion; click Search. |
| Expected Result | The message "Invalid" is displayed under the Employee Name field. |
| Expected Result Basis | OBS-014 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-002 · OBS-014 · XGAP-013 · XDEP-003 · PRD FR-022 |
| Technique | TA-001, TA-007 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-023 — Searching with typed text not selected from suggestions does not run the search

| Field | Value |
|---|---|
| Type | Error Handling |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-022 via PC SA-002); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002 |
| Steps | 1. Note the results header text.<br>2. Type the first 4 characters of the DATA-002 employee's first name (as written on the card); do not select a suggestion.<br>3. Click Search. |
| Expected Result | The results header text and displayed cards are unchanged from step 1. |
| Expected Result Basis | OBS-014 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-002 · OBS-014 · XGAP-013 · XDEP-003 · PRD FR-022 |
| Technique | TA-004 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-024 — Selecting a suggestion clears the "Invalid" message

| Field | Value |
|---|---|
| Type | Validation |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-022 via PC SA-002) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002 |
| Steps | 1. Type the first 4 characters of the DATA-002 employee's first name (as written on the card) and click Search without selecting ("Invalid" appears).<br>2. Delete the last character of the text and type it again, so the suggestion list reopens.<br>3. Select the employee's suggestion from the list. |
| Expected Result | The "Invalid" message is no longer displayed under Employee Name. |
| Expected Result Basis | OBS-016 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-002 · OBS-014 · OBS-016 · PRD FR-022 |
| Technique | TA-007 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | Observed in EVD-019 (no error after selection). v1.4.0 (TCI-002): after Search the suggestion list is closed and does not reopen on a click in the field or ArrowDown (manual execution, EVD-089, journal EVT-0032); step 2 reopens it. Retyping alone keeps "Invalid" displayed (OBS-015, TC-025), so the selection in step 3 is what clears the message. |

### TC-025 — "Invalid" stays visible while new text is typed after a failed search

| Field | Value |
|---|---|
| Type | Validation |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-022 via PC SA-002) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002 |
| Steps | 1. Type the first 4 characters of the DATA-002 employee's first name (as written on the card) and click Search without selecting ("Invalid" appears).<br>2. Replace the text with the same 4 characters in lower case, without selecting a suggestion. |
| Expected Result | The "Invalid" message is still displayed under Employee Name. |
| Expected Result Basis | OBS-015 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-002 · OBS-015 · XGAP-014 · PRD FR-022 |
| Technique | TA-007 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | Observed once (EVD-018). When the message appears on leaving the field is open (TC-031). |

### TC-026 — Non-matching name text shows "No Records Found" in the suggestion list

| Field | Value |
|---|---|
| Type | Negative |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-022 via PC SA-002); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-006 |
| Steps | 1. Type the DATA-006 non-matching string into Employee Name.<br>2. Wait for the suggestion list. |
| Expected Result | The suggestion list shows "No Records Found". |
| Expected Result Basis | OBS-017 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-002 · OBS-017 · XGAP-016 · PRD FR-022 |
| Technique | TA-001 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-027 — Search clicked with non-matching typed text

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-022 via PC SA-002); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-006 |
| Steps | 1. Type the DATA-006 string.<br>2. Click Search.<br>3. Record the field message, results header and cards. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-002 · OBS-014 · OBS-017 · PRD FR-022 |
| Technique | TA-001 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | OBS-014 was observed with matching-but-unselected text only; this partition was not observed. TQ-002. |

### TC-028 — Employee Name field text after selecting a suggestion

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-022 via PC SA-002); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002 |
| Steps | 1. Select a suggestion for an employee without a middle name.<br>2. Record the exact text shown in the field. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-002 · OBS-016 · PRD FR-022 |
| Technique | TA-009 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Observed "Sara␠␠Tencrady" (two spaces). Not asserted: it may be intended or a display defect. TQ-003. |

### TC-029 — Search by last name only or by middle name

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-022 via PC SA-002); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002 |
| Steps | 1. Type part of the DATA-002 employee's last name.<br>2. Record whether the employee is suggested.<br>3. If suggested, select and Search. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-002 · PRD FR-022 |
| Technique | TA-001 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Exploration U-04. TQ-004. |

### TC-030 — Very long input and special characters in Employee Name

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-022 via PC SA-002); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-011 |
| Steps | 1. Enter each DATA-011 value in turn.<br>2. Record the field content, suggestion list and any message; then click Search and record the outcome. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-002 · PRD FR-022 |
| Technique | TA-009 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | No length limit is documented or observed, so Boundary Value Analysis is not applicable (U-05). TQ-005. |

### TC-031 — Leaving Employee Name with unselected text

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-022 via PC SA-002); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002 |
| Steps | 1. Type the first 4 characters of the DATA-002 employee's first name (as written on the card) without selecting a suggestion.<br>2. (a) Press Escape and record any message; (b) separately, click outside the field and record any message. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-002 · OBS-015 · XGAP-014 · PRD FR-022 |
| Technique | TA-007 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Exploration could not isolate the trigger (Escape vs. card click). TQ-006. |

### TC-032 — Keyboard selection of a name suggestion

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-022 via PC SA-002); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-002 |
| Steps | 1. Type the first 4 characters of the DATA-002 employee's first name (as written on the card).<br>2. Use the Down arrow key to highlight the suggestion and press Enter.<br>3. Record the field value and whether a later Search returns the employee. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-002 · PRD FR-022 |
| Technique | TA-009 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Exploration U-06. TQ-007. |

### TC-033 — Keyboard operation of the Job Title and Location dropdowns

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-023 via PC SA-003); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001 |
| Steps | 1. Move focus to Job Title with Tab.<br>2. Try to open it, move between options and select with the keyboard; press Escape while it is open.<br>3. Repeat for Location; record each outcome. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-003 · PRD FR-023 |
| Technique | TA-009 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Exploration U-06. TQ-007. |

### TC-034 — Result card shows name, picture, job title, sub-unit and location for an employee with all values

| Field | Value |
|---|---|
| Type | Positive |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-025 via PC SA-005); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-008, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-008 employee's first name (as written on the card), select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list), and click Search.<br>2. Inspect the result card. |
| Expected Result | The card shows the employee's name, a profile picture, job title, sub-unit and location. |
| Expected Result Basis | OBS-008 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-005 · OBS-008 · XGAP-007 · PRD FR-025 |
| Technique | TA-011 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-035 — Result card omits the location line for an employee without a location

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-025 via PC SA-005) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-007, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-007 employee's first name (as written on the card), select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list), and click Search.<br>2. Inspect the result card. |
| Expected Result | The card shows no location line. |
| Expected Result Basis | OBS-009 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-005 · OBS-009 · XGAP-008 · PRD FR-025 |
| Technique | TA-011 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | Data-dependent: requires an employee with no location (DATA-007). If none exists at execution time, the case is Blocked, not Failed. |

### TC-036 — Results header uses "(N) Records Found" when more than one record matches

| Field | Value |
|---|---|
| Type | Boundary |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-024 via PC SA-004) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-015 |
| Steps | 1. Select the DATA-015 Location (2 – 14 records); click Search.<br>2. Count the result cards shown in the results area (scroll inside it if needed). |
| Expected Result | The results header reads "(N) Records Found", where N equals the number of result cards counted in step 2. |
| Expected Result Basis | OBS-008 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-004 · OBS-008 · OBS-019 · PRD FR-024 |
| Technique | TA-003 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | Data-aware: N is not fixed. With at most 14 records, all cards are in the initially rendered batch (OBS-019: 14 cards rendered first), so the count is complete. |

### TC-037 — Scrolling the results loads additional cards

| Field | Value |
|---|---|
| Type | Positive |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-024 via PC SA-004); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-010 |
| Steps | 1. With no filters, count the rendered result cards.<br>2. Scroll down inside the results area several times.<br>3. Count the rendered cards again. |
| Expected Result | More result cards are rendered after scrolling than before. |
| Expected Result Basis | OBS-019 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-004 · OBS-019 · XGAP-018 · PRD FR-024 |
| Technique | TA-008 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-038 — Results area has no pagination control

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Not established — basis: No documented importance or risk for this behavior |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001 |
| Steps | 1. Inspect the results area above and below the cards. |
| Expected Result | No pagination control is displayed. |
| Expected Result Basis | OBS-019 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-004 · OBS-019 · PRD FR-024 |
| Technique | TA-008 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Priority not established; asserting an absent control adds little regression value. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | — |

### TC-039 — Scrolling to the end of the result list

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-024 via PC SA-004); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-010 |
| Steps | 1. With no filters, scroll the results area until no more cards load.<br>2. Compare the number of rendered cards with N in the results header; record end-of-list behavior. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-004 · OBS-019 · PRD FR-024 |
| Technique | TA-008 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Exploration U-08. TQ-008. |

### TC-040 — Order of result cards

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-024 via PC SA-004); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001 |
| Steps | 1. With no filters, record the order of the first 14 card names.<br>2. Repeat after Reset; record whether and how the order is defined. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-004 · PRD FR-024 |
| Technique | TA-009 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Exploration U-09. TQ-009. |

### TC-041 — Clicking a result card opens the detail panel

| Field | Value |
|---|---|
| Type | Positive |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-025 via PC SA-005); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-008, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-008 employee's first name (as written on the card), select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list), and click Search.<br>2. Click the result card. |
| Expected Result | A detail panel opens on the right of the Directory page. |
| Expected Result Basis | OBS-018 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-005 · PC OQ-012 · OBS-018 · XGAP-017 · PRD FR-025 |
| Technique | TA-005 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-042 — Detail panel shows the clicked employee's name, job title, sub-unit and location

| Field | Value |
|---|---|
| Type | Positive |
| Priority | High — basis: Core behavior of a PRD focus area (PRD FR-025 via PC SA-005); PC RK-002, PC RK-003 |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-008, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-008 employee's first name (as written on the card), select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list), and click Search.<br>2. Note the card's name, job title, sub-unit and location.<br>3. Click the card. |
| Expected Result | The detail panel shows the same name, job title, sub-unit and location as the clicked card. |
| Expected Result Basis | OBS-018 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-005 · OBS-018 · XGAP-017 · PRD FR-025 |
| Technique | TA-011 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-043 — Detail panel shows a Work Email entry for an employee with a work email

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-025 via PC SA-005) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-009, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-009 employee's first name (as written on the card), select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list), and click Search.<br>2. Click the card. |
| Expected Result | The detail panel shows the label "Work Email" with a non-empty value. |
| Expected Result Basis | OBS-018 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-005 · OBS-018 · XGAP-017 · PRD FR-025 |
| Technique | TA-011 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | Do not record the email value in results or evidence text (personal data). |

### TC-044 — Detail panel shows a QR code image

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-025 via PC SA-005) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-009, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-009 employee's first name (as written on the card), select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list), and click Search.<br>2. Click the card. |
| Expected Result | A QR code image is displayed in the detail panel. |
| Expected Result Basis | OBS-018 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-005 · OBS-018 · XGAP-017 · PRD FR-025 |
| Technique | TA-011 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | QR content is not asserted (TC-046). |

### TC-045 — Arrow icon closes the detail panel

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-025 via PC SA-005) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-008, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-008 employee's first name (as written on the card), select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list), and click Search. Click the card (panel opens).<br>2. Click the arrow icon at the top of the panel. |
| Expected Result | The detail panel is no longer displayed. |
| Expected Result Basis | OBS-018 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-005 · OBS-018 · XGAP-017 · PRD FR-025 |
| Technique | TA-005 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Design-level eligibility (v1.0.0): in scope, established, deterministic, regression value |
| Status | Active |
| Notes | — |

### TC-046 — Detail panel actions: copy icons, contact icons, QR content, Work Telephone

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-025 via PC SA-005); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-009, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-009 employee's first name (as written on the card), select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list), and click Search. Click the card to open the detail panel.<br>2. Click each copy icon and each contact icon; decode the QR code; look for a Work Telephone value (an employee with a telephone, if available).<br>3. Record each outcome. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-005 · OBS-018 · PRD FR-025 |
| Technique | TA-009 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Exploration U-11. TQ-010. Do not record personal values. |

### TC-047 — Clicking another card while the detail panel is open

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-025 via PC SA-005); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-004 |
| Steps | 1. Search with a Location (DATA-004) returning at least 2 cards.<br>2. Click the first card, then click the second card.<br>3. Record the panel content. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-005 · OBS-018 · PRD FR-025 |
| Technique | TA-005 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Exploration U-12. TQ-011. |

### TC-048 — Filter panel toggle collapses the filter panel

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Not established — basis: No documented importance or risk for this behavior |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001 |
| Steps | 1. Click the caret toggle at the top right of the filter panel. |
| Expected Result | The filter fields and the Reset/Search buttons are hidden; the panel title "Directory" stays visible. |
| Expected Result Basis | OBS-020 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-001 · OBS-020 · XGAP-019 |
| Technique | TA-006 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Priority not established; layout convenience with no documented regression value. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | — |

### TC-049 — Filter panel toggle re-expands the collapsed panel

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Not established — basis: No documented importance or risk for this behavior |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001 |
| Steps | 1. Collapse the filter panel with the toggle.<br>2. Click the toggle again.<br>3. Record whether the fields reappear and keep their values. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-001 · OBS-020 · XGAP-019 |
| Technique | TA-006 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Re-expanded state was not captured in exploration. TQ-012. |

### TC-050 — Results header while the list loads after sidebar navigation (PB-001)

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: PB-001 (unconfirmed potential bug) affects results presentation (PRD FR-024 via PC SA-004) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001 |
| Steps | 1. Click the sidebar "Directory" link.<br>2. Record the results header text continuously (screen recording or repeated reads) until cards appear.<br>3. Repeat 5 times; also after a page reload and after Reset. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-004 · OBS-022 · PB-001 · PRD FR-024 |
| Technique | TA-009 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | PB-001 (unconfirmed). Expected result deliberately not asserted. TQ-013. |

### TC-051 — Filters and results after a browser refresh or Back navigation

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-023 via PC SA-003); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-004 |
| Steps | 1. Select a Location (DATA-004) and click Search.<br>2. Refresh the page; record the filters and results.<br>3. Repeat the search, open another page from the browser history and press Back; record the filters and results. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-003 · PC SA-004 · PRD FR-023 · PRD FR-024 |
| Technique | TA-009 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Exploration U-10. TQ-014. |

### TC-052 — Employee Name combined with a matching Location

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-022/FR-023 via PC SA-002/SA-003); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-008, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-008 employee's first name (as written on the card) and select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list).<br>2. Select the Location shown on that employee's card.<br>3. Click Search; record results. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-002 · PC SA-003 · OBS-010 · PRD FR-022 · PRD FR-023 |
| Technique | TA-004 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | AND behavior was observed for Job Title + Location only (OBS-010); not for Employee Name combinations (U-03). TQ-015. |

### TC-053 — Employee Name combined with a Location the employee does not have

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-022/FR-023 via PC SA-002/SA-003); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-008, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-008 employee's first name (as written on the card) and select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list).<br>2. Select a Location different from the one on that employee's card.<br>3. Click Search; record results. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-002 · PC SA-003 · OBS-010 · PRD FR-022 · PRD FR-023 |
| Technique | TA-004 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | U-03. TQ-015. |

### TC-054 — End-to-end: redirect login, combined filter, employee details, close, Reset

| Field | Value |
|---|---|
| Type | End-to-End |
| Priority | High — basis: Full realistic workflow across PRD FR-022 – FR-025; PC RK-002 |
| Preconditions | No authenticated session in the browser (fresh browser context, or logged out). |
| Test Data | DATA-001, DATA-012 |
| Steps | 1. Open the Directory URL and log in with the demo account (DATA-001).<br>2. Select the Job Title and the Location of the DATA-012 pair; click Search.<br>3. Wait until result cards are displayed; read the results header and note the filtered record count k ("(k) Records Found", or "(1) Record Found" when k is 1).<br>4. Click the first result card; then click the panel's arrow icon.<br>5. Click Reset.<br>6. Wait until employee result cards are displayed, then read the results header. |
| Expected Result | Employee Name is empty, Job Title and Location display "-- Select --", and the results header reads "(N) Records Found" with N greater than the count k noted in step 3. |
| Expected Result Basis | OBS-001 + OBS-003 + OBS-010 + OBS-018 + OBS-012 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-001 · PC SA-003 · PC SA-004 · PC SA-005 · OBS-001 · OBS-003 · OBS-010 · OBS-012 · OBS-018 · PRD FR-023 · PRD FR-024 · PRD FR-025 |
| Technique | TA-004, TA-005 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | TRUE — Selected by human decision (journal EVT-0017) as the only automation case; in scope, established expected result, deterministic with data-aware preconditions, High priority |
| Status | Active |
| Notes | Data-aware (v1.3.0, TR-015): k and N are both read during the run; no fixed employee names or total counts are used, and N is not compared with the count shown after login, because the shared data changes during a session (OBS-021). DATA-012 requires the pair to return fewer records than the unfiltered list, so a Reset that reloads the unfiltered results gives N greater than k. The header is read only after cards are displayed, because a transient "No Records Found" was seen once while the list loaded (OBS-022, PB-001, unconfirmed; explored by TC-050). |

### TC-055 — Suggestion list for a prefix that matches several employees

| Field | Value |
|---|---|
| Type | Exploratory |
| Priority | Medium — basis: Open behavior within a PRD focus area (PRD FR-022 via PC SA-002); investigation needed before it can be asserted |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-014 |
| Steps | 1. Type the DATA-014 prefix into Employee Name.<br>2. Record the number of suggestions, their order, and whether any matching employee from the displayed cards is missing. |
| Expected Result | Not established by approved requirements. |
| Expected Result Basis | Not established |
| Traceability | PC SA-002 · OBS-013 · PRD FR-022 |
| Technique | TA-001 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Exploratory: expected result not established. Also manual-only under human decision (journal EVT-0017) |
| Status | Active |
| Notes | Exploration U-07 (not explored). TQ-016. |

### TC-056 — Clicking a result card does not change the page URL

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-025 via PC SA-005) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-008, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-008 employee's first name (as written on the card), select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list), and click Search.<br>2. Note the page URL.<br>3. Click the result card. |
| Expected Result | The page URL is still the Directory URL. |
| Expected Result Basis | OBS-018 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-005 · PC OQ-012 · OBS-018 · XGAP-017 · PRD FR-025 |
| Technique | TA-005 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Added in v1.2.0 (TR-006 split); in scope, established, deterministic |
| Status | Active |
| Notes | Split from TC-041 v1.1.0 (TR-006). |

### TC-057 — Closing the detail panel does not change the page URL

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Supporting behavior within a PRD focus area (PRD FR-025 via PC SA-005) |
| Preconditions | Logged in with the demo account (DATA-001). Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. |
| Test Data | DATA-001, DATA-008, DATA-013 |
| Steps | 1. Type the first 4 characters of the DATA-008 employee's first name (as written on the card), select the employee's suggestion (DATA-013: the full name appears exactly once in the suggestion list), and click Search. Click the card (panel opens).<br>2. Click the arrow icon at the top of the panel. |
| Expected Result | The page URL is still the Directory URL. |
| Expected Result Basis | OBS-018 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-005 · OBS-018 · XGAP-017 · PRD FR-025 |
| Technique | TA-005 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Added in v1.2.0 (TR-006 split); in scope, established, deterministic |
| Status | Active |
| Notes | Split from TC-045 v1.1.0 (TR-006). |

### TC-058 — Sidebar "Directory" item is shown as active on the Directory page

| Field | Value |
|---|---|
| Type | Positive |
| Priority | Medium — basis: Navigation into the module; PC OQ-011 boundary (supporting) |
| Preconditions | Logged in with the demo account (DATA-001); Directory page open. |
| Test Data | DATA-001 |
| Steps | 1. Click the "Directory" item in the sidebar.<br>2. Inspect the sidebar. |
| Expected Result | The sidebar "Directory" item is highlighted as the active item. |
| Expected Result Basis | OBS-003 (observed baseline; human decision, journal EVT-0016) |
| Traceability | PC SA-001 · PC OQ-011 · OBS-003 |
| Technique | TA-010 |
| Valid in Scope | TRUE — Exercises in-scope Directory UI (PC SA-001 – SA-005) with the available demo account; no excluded functionality |
| Needs Automation | FALSE — Manual-only: human decision (journal EVT-0017) limits automation to TC-054. Added in v1.2.0 (TR-006 split); in scope, established, deterministic |
| Status | Active |
| Notes | Split from TC-003 v1.1.0 (TR-006). |

## 5. Traceability Matrix

### Source → Test Cases

| Source ID | Source Type | Description | Test Cases |
|---|---|---|---|
| PC BR-001 | Business Rule | UI coverage is limited to the OrangeHRM Directory module. | — (CG-001) |
| PC BR-002 | Business Rule | No API exploration is performed for this task. | — (CG-001) |
| PC BR-003 | Business Rule | No API test cases are generated for this task. | — (CG-001) |
| PC BR-004 | Business Rule | No API test execution is performed for this task. | — (CG-001) |
| PC BR-005 | Business Rule | No API automation is produced for this task. | — (CG-001) |
| PC BR-006 | Business Rule | The Directory module's actual available controls are verified before the UI coverage scope is finalized. | TC-004 |
| PC BR-007 | Business Rule | The test design contains a "Valid in Scope" value. | — (CG-001) |
| PC BR-008 | Business Rule | The test design contains a "Needs Automation" value. | — (CG-001) |
| PC BR-009 | Business Rule | Only test cases with Valid in Scope = TRUE are executed. | — (CG-002) |
| PC BR-010 | Business Rule | Automation is generated only for test cases with Needs Automation = TRUE. | — (CG-002) |
| PC BR-011 | Business Rule | The automation framework for this task is Playwright. | — (CG-002) |
| PC BR-012 | Business Rule | Every healing attempt is documented. | — (CG-002) |
| PC BR-013 | Business Rule | Healing documentation records the reason. | — (CG-002) |
| PC BR-014 | Business Rule | Healing documentation records the change. | — (CG-002) |
| PC BR-015 | Business Rule | Healing documentation records the result. | — (CG-002) |
| PC BR-016 | Business Rule | Credentials are never recorded. | — (CG-001) |
| PC EB-001 | Expected Behavior | The exploration findings are delivered as a Markdown file. | — (CG-002) |
| PC EB-002 | Expected Behavior | The test cases are delivered as a CSV. | — (CG-001) |
| PC EB-003 | Expected Behavior | The correctness of the test suite is reviewed. | — (CG-002) |
| PC EB-004 | Expected Behavior | An HTML execution report is generated. | — (CG-002) |
| PC EB-005 | Expected Behavior | The HTML execution report includes bug reporting. | — (CG-002) |
| PC EB-006 | Expected Behavior | The automation is run using Claude. | — (CG-002) |
| PC EB-007 | Expected Behavior | The automation is run using IntelliJ. | — (CG-002) |
| PC EB-008 | Expected Behavior | If the automation requires healing or fixing, controlled healing is performed. | — (CG-002) |
| PC EB-009 | Expected Behavior | The PRD is delivered as a Markdown file. | — (CG-002) |
| PC EB-010 | Expected Behavior | An Excel milestone summary is delivered. | — (CG-002) |
| PC EB-011 | Expected Behavior | An HTML workflow/sequence diagram is delivered. | — (CG-002) |
| PC EB-012 | Expected Behavior | An automation execution HTML report is delivered. | — (CG-002) |
| PC EB-013 | Expected Behavior | Healing/fixing documentation is delivered. | — (CG-002) |
| PC EB-014 | Expected Behavior | An agent execution HTML report is delivered. | — (CG-002) |
| PC SA-001 | Scope Area | Directory page access | TC-001, TC-002, TC-003, TC-048, TC-049, TC-054, TC-058 |
| PC SA-002 | Scope Area | Directory search | TC-005, TC-014, TC-016, TC-017, TC-018, TC-019, TC-020, TC-022, TC-023, TC-024, TC-025, TC-026, TC-027, TC-028, TC-029, TC-030, TC-031, TC-032, TC-052, TC-053, TC-055 |
| PC SA-003 | Scope Area | Directory filters | TC-005, TC-006, TC-007, TC-008, TC-009, TC-010, TC-011, TC-014, TC-033, TC-051, TC-052, TC-053, TC-054 |
| PC SA-004 | Scope Area | Employee results | TC-009, TC-010, TC-012, TC-013, TC-015, TC-016, TC-020, TC-021, TC-036, TC-037, TC-038, TC-039, TC-040, TC-050, TC-051, TC-054 |
| PC SA-005 | Scope Area | Displayed employee information | TC-034, TC-035, TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-047, TC-054, TC-056, TC-057 |
| PC SA-006 | Scope Area | Exploration and scope finalization | TC-004 |
| PC DEP-001 | Dependency | The OrangeHRM UI at https://opensource-demo.orangehrmlive.com/ is available | TC-001, TC-002 |
| PC DEP-002 | Dependency | The Directory page at https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory | TC-001, TC-002 |
| PC DEP-003 | Dependency | The approved PRD | — (CG-010) |
| PC DEP-004 | Dependency | The selected coverage scope: UI testing of the Directory module only | — (CG-010) |
| PC DEP-005 | Dependency | The test design's Valid in Scope and Needs Automation values | — (CG-010) |
| PC DEP-006 | Dependency | Users, roles or test accounts for the application | TC-001 |
| PC DEP-007 | Dependency | Playwright | — (CG-010) |
| PC DEP-008 | Dependency | Claude | — (CG-010) |
| PC DEP-009 | Dependency | IntelliJ | — (CG-010) |
| PRD FR-022 | Documented Requirement | Directory search focus | TC-005, TC-014, TC-016, TC-017, TC-018, TC-019, TC-020, TC-022, TC-023, TC-024, TC-025, TC-026, TC-027, TC-028, TC-029, TC-030, TC-031, TC-032, TC-052, TC-053, TC-055 |
| PRD FR-023 | Documented Requirement | Directory filters focus | TC-005, TC-006, TC-007, TC-008, TC-009, TC-010, TC-011, TC-014, TC-033, TC-051, TC-052, TC-053, TC-054 |
| PRD FR-024 | Documented Requirement | Employee results focus | TC-009, TC-010, TC-012, TC-013, TC-015, TC-016, TC-020, TC-021, TC-036, TC-037, TC-038, TC-039, TC-040, TC-050, TC-051, TC-054 |
| PRD FR-025 | Documented Requirement | Displayed employee information focus | TC-034, TC-035, TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-047, TC-054, TC-056, TC-057 |
| PRD FR-026 | Documented Requirement | Verify actual controls before scope is final | TC-004 |

**Uncovered sources:**

| Source ID | Reason | Coverage Gap |
|---|---|---|
| PC BR-001 | QA-process rule satisfied by the design, not application behavior | CG-001 |
| PC BR-002 | QA-process rule satisfied by the design, not application behavior | CG-001 |
| PC BR-003 | QA-process rule satisfied by the design, not application behavior | CG-001 |
| PC BR-004 | QA-process rule satisfied by the design, not application behavior | CG-001 |
| PC BR-005 | QA-process rule satisfied by the design, not application behavior | CG-001 |
| PC BR-007 | QA-process rule satisfied by the design, not application behavior | CG-001 |
| PC BR-008 | QA-process rule satisfied by the design, not application behavior | CG-001 |
| PC BR-009 | Owned by another stage | CG-002 |
| PC BR-010 | Owned by another stage | CG-002 |
| PC BR-011 | Owned by another stage | CG-002 |
| PC BR-012 | Owned by another stage | CG-002 |
| PC BR-013 | Owned by another stage | CG-002 |
| PC BR-014 | Owned by another stage | CG-002 |
| PC BR-015 | Owned by another stage | CG-002 |
| PC BR-016 | QA-process rule satisfied by the design, not application behavior | CG-001 |
| PC EB-001 | Owned by another stage | CG-002 |
| PC EB-002 | QA-process rule satisfied by the design, not application behavior | CG-001 |
| PC EB-003 | Owned by another stage | CG-002 |
| PC EB-004 | Owned by another stage | CG-002 |
| PC EB-005 | Owned by another stage | CG-002 |
| PC EB-006 | Owned by another stage | CG-002 |
| PC EB-007 | Owned by another stage | CG-002 |
| PC EB-008 | Owned by another stage | CG-002 |
| PC EB-009 | Owned by another stage | CG-002 |
| PC EB-010 | Owned by another stage | CG-002 |
| PC EB-011 | Owned by another stage | CG-002 |
| PC EB-012 | Owned by another stage | CG-002 |
| PC EB-013 | Owned by another stage | CG-002 |
| PC EB-014 | Owned by another stage | CG-002 |
| PC DEP-003 | Process / tooling dependency, not application behavior | CG-010 |
| PC DEP-004 | Process / tooling dependency, not application behavior | CG-010 |
| PC DEP-005 | Process / tooling dependency, not application behavior | CG-010 |
| PC DEP-007 | Process / tooling dependency, not application behavior | CG-010 |
| PC DEP-008 | Process / tooling dependency, not application behavior | CG-010 |
| PC DEP-009 | Process / tooling dependency, not application behavior | CG-010 |

### Exploration observations considered

| Observation | Classification | Test Cases | Questions | If none: reason |
|---|---|---|---|---|
| OBS-001 | GAP | TC-001, TC-054 | — |  |
| OBS-002 | QUESTION | — | — | QUESTION resolved by human decision (journal EVT-0016): the demo account is used for this task (DATA-001, CG-003); no separate case needed. |
| OBS-003 | GAP | TC-002, TC-003, TC-054, TC-058 | — |  |
| OBS-004 | GAP | TC-004, TC-005 | — |  |
| OBS-005 | GAP | TC-006 | — |  |
| OBS-006 | GAP | TC-007 | — |  |
| OBS-007 | GAP | TC-008 | — |  |
| OBS-008 | GAP | TC-009, TC-034, TC-036 | — |  |
| OBS-009 | GAP | TC-010, TC-035 | — |  |
| OBS-010 | GAP | TC-011, TC-052, TC-053, TC-054 | TQ-015 |  |
| OBS-011 | GAP | TC-012, TC-013 | — |  |
| OBS-012 | GAP | TC-014, TC-015, TC-054 | — |  |
| OBS-013 | GAP | TC-017, TC-018, TC-019, TC-055 | — |  |
| OBS-014 | GAP | TC-022, TC-023, TC-024, TC-027 | TQ-002 |  |
| OBS-015 | GAP | TC-025, TC-031 | TQ-006 |  |
| OBS-016 | GAP | TC-020, TC-021, TC-024, TC-028 | TQ-003 |  |
| OBS-017 | GAP | TC-026, TC-027 | TQ-002 |  |
| OBS-018 | GAP | TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-047, TC-054, TC-056, TC-057 | TQ-010, TQ-011 |  |
| OBS-019 | GAP | TC-036, TC-037, TC-038, TC-039 | TQ-008 |  |
| OBS-020 | GAP | TC-048, TC-049 | TQ-012 |  |
| OBS-021 | QUESTION | — | — | QUESTION resolved by human decision (journal EVT-0016): data-aware design, no fixed counts or names (CG-004); not used as an expected-result basis (TR-005, v1.2.0). |
| OBS-022 | POTENTIAL BUG | TC-050 | TQ-013 |  |

Exploration dependencies: XDEP-001 → TC-001; XDEP-002 → TC-008; XDEP-003 → TC-022, TC-023; XDEP-004 → data-aware design (CG-004).

### Test Case → Sources

| Test Case | Sources |
|---|---|
| TC-001 | PC SA-001, PC DEP-001, PC DEP-002, PC DEP-006, OBS-001, XGAP-001, XDEP-001 |
| TC-002 | PC SA-001, PC DEP-001, PC DEP-002, OBS-003, XGAP-002 |
| TC-003 | PC SA-001, PC OQ-011, OBS-003 |
| TC-004 | PC BR-006, PC SA-006, PRD FR-026, OBS-004, XGAP-003 |
| TC-005 | PC SA-002, PC SA-003, OBS-004, PRD FR-022, PRD FR-023 |
| TC-006 | PC SA-003, OBS-005, XGAP-004, PRD FR-023 |
| TC-007 | PC SA-003, OBS-006, XGAP-005, PRD FR-023 |
| TC-008 | PC SA-003, OBS-007, XGAP-006, XDEP-002, PRD FR-023 |
| TC-009 | PC SA-003, PC SA-004, OBS-008, XGAP-007, PRD FR-023, PRD FR-024 |
| TC-010 | PC SA-003, PC SA-004, OBS-009, XGAP-008, PRD FR-023, PRD FR-024 |
| TC-011 | PC SA-003, OBS-010, XGAP-009, PRD FR-023 |
| TC-012 | PC SA-004, OBS-011, XGAP-010, PRD FR-024 |
| TC-013 | PC SA-004, OBS-011, XGAP-010, PRD FR-024 |
| TC-014 | PC SA-002, PC SA-003, OBS-012, XGAP-011, PRD FR-022, PRD FR-023 |
| TC-015 | PC SA-004, OBS-012, XGAP-011, PRD FR-024 |
| TC-016 | PC SA-002, PC SA-004, PRD FR-022, PRD FR-024 |
| TC-017 | PC SA-002, OBS-013, XGAP-012, PRD FR-022 |
| TC-018 | PC SA-002, OBS-013, XGAP-012, PRD FR-022 |
| TC-019 | PC SA-002, OBS-013, XGAP-012, PRD FR-022 |
| TC-020 | PC SA-002, PC SA-004, OBS-016, XGAP-015, PRD FR-022, PRD FR-024 |
| TC-021 | PC SA-004, OBS-016, XGAP-015, PRD FR-024 |
| TC-022 | PC SA-002, OBS-014, XGAP-013, XDEP-003, PRD FR-022 |
| TC-023 | PC SA-002, OBS-014, XGAP-013, XDEP-003, PRD FR-022 |
| TC-024 | PC SA-002, OBS-014, OBS-016, PRD FR-022 |
| TC-025 | PC SA-002, OBS-015, XGAP-014, PRD FR-022 |
| TC-026 | PC SA-002, OBS-017, XGAP-016, PRD FR-022 |
| TC-027 | PC SA-002, OBS-014, OBS-017, PRD FR-022 |
| TC-028 | PC SA-002, OBS-016, PRD FR-022 |
| TC-029 | PC SA-002, PRD FR-022 |
| TC-030 | PC SA-002, PRD FR-022 |
| TC-031 | PC SA-002, OBS-015, XGAP-014, PRD FR-022 |
| TC-032 | PC SA-002, PRD FR-022 |
| TC-033 | PC SA-003, PRD FR-023 |
| TC-034 | PC SA-005, OBS-008, XGAP-007, PRD FR-025 |
| TC-035 | PC SA-005, OBS-009, XGAP-008, PRD FR-025 |
| TC-036 | PC SA-004, OBS-008, OBS-019, PRD FR-024 |
| TC-037 | PC SA-004, OBS-019, XGAP-018, PRD FR-024 |
| TC-038 | PC SA-004, OBS-019, PRD FR-024 |
| TC-039 | PC SA-004, OBS-019, PRD FR-024 |
| TC-040 | PC SA-004, PRD FR-024 |
| TC-041 | PC SA-005, PC OQ-012, OBS-018, XGAP-017, PRD FR-025 |
| TC-042 | PC SA-005, OBS-018, XGAP-017, PRD FR-025 |
| TC-043 | PC SA-005, OBS-018, XGAP-017, PRD FR-025 |
| TC-044 | PC SA-005, OBS-018, XGAP-017, PRD FR-025 |
| TC-045 | PC SA-005, OBS-018, XGAP-017, PRD FR-025 |
| TC-046 | PC SA-005, OBS-018, PRD FR-025 |
| TC-047 | PC SA-005, OBS-018, PRD FR-025 |
| TC-048 | PC SA-001, OBS-020, XGAP-019 |
| TC-049 | PC SA-001, OBS-020, XGAP-019 |
| TC-050 | PC SA-004, OBS-022, PB-001, PRD FR-024 |
| TC-051 | PC SA-003, PC SA-004, PRD FR-023, PRD FR-024 |
| TC-052 | PC SA-002, PC SA-003, OBS-010, PRD FR-022, PRD FR-023 |
| TC-053 | PC SA-002, PC SA-003, OBS-010, PRD FR-022, PRD FR-023 |
| TC-054 | PC SA-001, PC SA-003, PC SA-004, PC SA-005, OBS-001, OBS-003, OBS-010, OBS-012, OBS-018, PRD FR-023, PRD FR-024, PRD FR-025 |
| TC-055 | PC SA-002, OBS-013, PRD FR-022 |
| TC-056 | PC SA-005, PC OQ-012, OBS-018, XGAP-017, PRD FR-025 |
| TC-057 | PC SA-005, OBS-018, XGAP-017, PRD FR-025 |
| TC-058 | PC SA-001, PC OQ-011, OBS-003 |

## 6. Technique Rationale

| ID | Technique | Area | Reason selected | Resulting Cases |
|---|---|---|---|---|
| TA-001 | Equivalence Partitioning | PC SA-002 / Employee Name input | The field accepts free text with distinct observed classes: matching partial, case variant, whitespace-padded, non-matching, typed-not-selected, selected suggestion, empty, overlong/special. | TC-017, TC-018, TC-019, TC-020, TC-022, TC-026, TC-027, TC-029, TC-055 |
| TA-002 | Equivalence Partitioning | PC SA-002/003/006 / filter controls: default vs set state | Controls have two observed classes (default '-- Select --'/empty vs a selected value); one representative per class covers the reset/default behavior. | TC-004, TC-005, TC-006, TC-007, TC-008, TC-014, TC-015 |
| TA-003 | Boundary Value Analysis | PC SA-004 / result count wording | Observed boundary in the header wording at result counts 0 ('No Records Found'), 1 ('(1) Record Found') and ≥2 ('(N) Records Found'). | TC-012, TC-021, TC-036 |
| TA-004 | Decision Table | PC SA-002/003 / filter combinations | Search outcome depends on which of Employee Name, Job Title and Location are set and whether the name was selected. | TC-009, TC-010, TC-011, TC-012, TC-016, TC-020, TC-023, TC-052, TC-053, TC-054 |
| TA-005 | State Transition | PC SA-005 / detail panel | Observed states closed → open (card click) → closed (arrow icon). | TC-041, TC-045, TC-047, TC-054, TC-056, TC-057 |
| TA-006 | State Transition | PC SA-001 / filter panel | Observed states expanded → collapsed (toggle); the return transition was not evidenced. | TC-048, TC-049 |
| TA-007 | State Transition | PC SA-002 / Employee Name validation message | Observed states: no message → 'Invalid' (Search with unselected text) → still 'Invalid' (retyping) → cleared (suggestion selected). | TC-022, TC-024, TC-025, TC-031 |
| TA-008 | State Transition | PC SA-004 / result loading | Observed states: initial batch (14 cards) → more cards after scrolling; end of list not observed. | TC-037, TC-038, TC-039 |
| TA-009 | Error Guessing | PC SA-002 – SA-005 / supplementary risks | Supplementary only: transient UI states, keyboard use, unusual input, stale state after refresh/Back, display oddities, ordering. Expected results stay Not established unless an observation supports them. | TC-013, TC-028, TC-030, TC-032, TC-033, TC-040, TC-046, TC-050, TC-051 |
| TA-010 | Equivalence Partitioning | PC SA-001 / access state | Two observed classes: no session (redirect to login) and authenticated session (Directory shown). | TC-001, TC-002, TC-003, TC-058 |
| TA-011 | Equivalence Partitioning | PC SA-005 / employee data completeness | Card and panel content vary by employee data: all values present vs a value missing (location). | TC-034, TC-035, TC-042, TC-043, TC-044 |

**Not applied:**

| Technique | Reason |
|---|---|
| Pairwise | Only three filter dimensions with small value classes; the decision table (TA-004) covers the relevant combinations directly, so pairwise reduction is unnecessary. |
| Boundary Value Analysis (input length) | No length or numeric input limit is documented or observed; only the observed result-count wording boundary is used (TA-003). |

### 6.1 Equivalence Partitioning

| TA | Input / condition | Partition | Representative value | Expected behavior | Source | Case |
|---|---|---|---|---|---|---|
| TA-010 | Access state | No session | Fresh browser | Redirect to login | OBS-001 | TC-001 |
| TA-010 | Access state | Authenticated via redirect | Demo account | Directory page shown | OBS-003 | TC-002 |
| TA-001 | Employee Name | Matching first-name prefix | First 4 chars of DATA-002 | Suggestion contains the name | OBS-013 | TC-017 |
| TA-001 | Employee Name | Case variant | Lower-case prefix | Same suggestion | OBS-013 | TC-018 |
| TA-001 | Employee Name | Whitespace-padded | '␠␠prefix␠␠' | Same suggestion | OBS-013 | TC-019 |
| TA-001 | Employee Name | Selected suggestion + Search | DATA-002 | Only that employee | OBS-016 | TC-020 |
| TA-001 | Employee Name | Typed, not selected + Search | Prefix of DATA-002 | 'Invalid' | OBS-014 | TC-022 |
| TA-001 | Employee Name | Non-matching text | DATA-006 | 'No Records Found' suggestion | OBS-017 | TC-026 |
| TA-001 | Employee Name | Non-matching + Search | DATA-006 | Not established | — | TC-027 |
| TA-001 | Employee Name | Last/middle name | Part of last name | Not established | — | TC-029 |
| TA-001 | Employee Name | Empty | '' | Not established | — | TC-016 |
| TA-002 | Filter controls | Default | Page load | Empty / '-- Select --' | OBS-004 | TC-005 |
| TA-002 | Filter controls | Value set, not searched | DATA-004 | Results unchanged | OBS-007 | TC-008 |
| TA-002 | Filter controls | Set, then Reset | DATA-002/003/004 | Defaults restored | OBS-012 | TC-014 |
| TA-011 | Employee data | All values present | DATA-008 | Card shows all fields | OBS-008 | TC-034 |
| TA-011 | Employee data | Location missing | DATA-007 | No location line | OBS-009 | TC-035 |

### 6.2 Boundary Value Analysis

| TA | Limit | Source of limit | Values (below / at / above) | Cases |
|---|---|---|---|---|
| TA-003 | Result-count wording changes at 0 / 1 / ≥2 | OBS-011 ('No Records Found'), OBS-016 ('(1) Record Found'), OBS-008 ('(2) Records Found') | 0 → 'No Records Found'; 1 → '(1) Record Found'; 2+ → '(N) Records Found' | TC-012, TC-021, TC-036 |

### 6.3 Decision Tables

| TA | Conditions | Condition values | Resulting action | Rule / combination | Cases |
|---|---|---|---|---|---|
| TA-004 | Employee Name state; Job Title; Location | Name empty · JT none · Loc none | Not established (Search not observed) | R1 | TC-016 |
| TA-004 | Employee Name state; Job Title; Location | Name empty · JT none · Loc set | Only cards with that location | R2 | TC-009 |
| TA-004 | Employee Name state; Job Title; Location | Name empty · JT set · Loc none | Only cards with that job title | R3 | TC-010 |
| TA-004 | Employee Name state; Job Title; Location | Name empty · JT set · Loc set (pair from one card, DATA-012) | Cards with both values (AND) | R4 | TC-011, TC-054 |
| TA-004 | Employee Name state; Job Title; Location | Name empty · JT set · Loc set (no match) | 'No Records Found', no cards | R5 | TC-012 |
| TA-004 | Employee Name state; Job Title; Location | Name selected · JT none · Loc none | Only the selected employee | R6 | TC-020 |
| TA-004 | Employee Name state; Job Title; Location | Name selected · Loc set (matching) | Not established | R7 | TC-052 |
| TA-004 | Employee Name state; Job Title; Location | Name selected · Loc set (not matching) | Not established | R8 | TC-053 |
| TA-004 | Employee Name state; Job Title; Location | Name typed, not selected · any dropdowns | 'Invalid'; search not run | R9 | TC-022, TC-023 |

_Collapsed combinations and justification:_ R9 collapses all dropdown values, because the name validation blocks the search before filters apply (OBS-014). Name + Job Title combinations are collapsed into R7/R8, since the Location variants already decide whether AND applies to the name; both stay Exploratory (TQ-015).

### 6.4 State Transition Testing

| TA | From state | Event / action | To state | Valid? | Source | Case |
|---|---|---|---|---|---|---|
| TA-005 | Panel closed | Click a result card | Panel open (same URL) | Valid | OBS-018 | TC-041 |
| TA-005 | Panel closed | Click a result card | URL unchanged | Valid | OBS-018 | TC-056 |
| TA-005 | Panel open | Click arrow icon | Panel closed | Valid | OBS-018 | TC-045 |
| TA-005 | Panel open | Click arrow icon | URL unchanged | Valid | OBS-018 | TC-057 |
| TA-005 | Panel open | Click another card | Not established | Unknown | — | TC-047 |
| TA-006 | Filter panel expanded | Click toggle | Collapsed | Valid | OBS-020 | TC-048 |
| TA-006 | Filter panel collapsed | Click toggle | Not established | Unknown | OBS-020 | TC-049 |
| TA-007 | No message | Search with unselected text | 'Invalid' | Valid | OBS-014 | TC-022 |
| TA-007 | 'Invalid' | Retype without selecting | 'Invalid' remains | Valid | OBS-015 | TC-025 |
| TA-007 | 'Invalid' | Select a suggestion | No message | Valid | OBS-016 | TC-024 |
| TA-007 | No message (unselected text) | Escape / leave field | Not established | Unknown | OBS-015 | TC-031 |
| TA-008 | Initial batch rendered | Scroll results | More cards rendered | Valid | OBS-019 | TC-037 |
| TA-008 | Cards rendered | Scroll to end | Not established | Unknown | — | TC-039 |

No state or transition beyond those observed is asserted; unobserved transitions are Exploratory.

### 6.5 Pairwise / Combinatorial

Not applied (see Not applied above). No pairwise coverage is claimed.

### 6.6 Error Guessing (supplementary)

| TA | Error area | Rationale | Expected-result basis | Case |
|---|---|---|---|---|
| TA-009 | Transient toast | Short-lived UI may be missed | OBS-011 (observed baseline) | TC-013 |
| TA-009 | Display oddity after selection | Double space may be a defect | Not established | TC-028 |
| TA-009 | Unusual input | Long/special/markup text | Not established | TC-030 |
| TA-009 | Keyboard use | Common accessibility failure area | Not established | TC-032, TC-033 |
| TA-009 | Ordering | Undefined order causes flaky expectations | Not established | TC-040 |
| TA-009 | Detail-panel actions | Untested actions | Not established | TC-046 |
| TA-009 | Transient empty state | PB-001 (unconfirmed) | Not established | TC-050 |
| TA-009 | Stale state | Refresh / Back | Not established | TC-051 |

## 7. Exploratory Cases

| Case | Why exploratory | Observed behavior | What is unknown | Question | Evidence / Source |
|---|---|---|---|---|---|
| TC-016 | Not observed in exploration | — (not observed) | What Search does when all fields are empty was not observed. | TQ-001 | ExplorationReport §13 |
| TC-027 | Observed partially or ambiguously | OBS-014, OBS-017 | 'Invalid' was observed only for matching-but-unselected text; non-matching typed text was never submitted. | TQ-002 | OBS-014, OBS-017 |
| TC-028 | Observed partially or ambiguously | OBS-016 | After selecting a suggestion, the field showed two spaces between first and last name. | TQ-003 | OBS-016 |
| TC-029 | Not observed in exploration | — (not observed) | Only first-name prefixes were explored. | TQ-004 | ExplorationReport §13 |
| TC-030 | Not observed in exploration | — (not observed) | No length limit or character rule is documented or observed. | TQ-005 | ExplorationReport §13 |
| TC-031 | Observed partially or ambiguously | OBS-015, XGAP-014 | 'Invalid' appeared after Escape + card click; the trigger was not isolated. | TQ-006 | OBS-015, XGAP-014 |
| TC-032 | Not observed in exploration | — (not observed) | Keyboard interaction was not explored. | TQ-007 | ExplorationReport §13 |
| TC-033 | Not observed in exploration | — (not observed) | Keyboard interaction was not explored. | TQ-007 | ExplorationReport §13 |
| TC-039 | Observed partially or ambiguously | OBS-019 | End-of-list behavior and whether all N records eventually load were not observed. | TQ-008 | OBS-019 |
| TC-040 | Not observed in exploration | — (not observed) | No ordering rule for result cards is documented or observed. | TQ-009 | ExplorationReport §13 |
| TC-046 | Observed partially or ambiguously | OBS-018 | Copy/contact icons, QR content and Work Telephone display were not exercised. | TQ-010 | OBS-018 |
| TC-047 | Observed partially or ambiguously | OBS-018 | Behavior when a second card is clicked while the panel is open was not observed. | TQ-011 | OBS-018 |
| TC-049 | Observed partially or ambiguously | OBS-020, XGAP-019 | The re-expanded state of the filter panel was not captured. | TQ-012 | OBS-020, XGAP-019 |
| TC-050 | Unconfirmed potential bug | OBS-022, PB-001 | A transient 'No Records Found' was seen once after navigation (unconfirmed potential bug). | TQ-013 | OBS-022, PB-001 |
| TC-051 | Not observed in exploration | — (not observed) | Persistence of filters/results after refresh or Back was not observed. | TQ-014 | ExplorationReport §13 |
| TC-052 | Observed partially or ambiguously | OBS-010 | AND logic was observed only for Job Title + Location; Employee Name combinations were not observed. | TQ-015 | OBS-010 |
| TC-053 | Observed partially or ambiguously | OBS-010 | AND logic was observed only for Job Title + Location; Employee Name combinations were not observed. | TQ-015 | OBS-010 |
| TC-055 | Observed partially or ambiguously | OBS-013 | How many suggestions are shown for a prefix matching several employees, in which order, and whether the list is truncated, was not observed. | TQ-016 | OBS-013 |

## 8. Open Questions

| ID | Related source | Related test cases | Exact ambiguity | Required clarification | Owner |
|---|---|---|---|---|---|
| TQ-001 | PC SA-002; Exploration U-01 | TC-016 | What Search does when all fields are empty was not observed. | Confirm the expected result of Search with no filters (unfiltered list, message, or no action). | not stated |
| TQ-002 | OBS-014, OBS-017 | TC-027 | 'Invalid' was observed only for matching-but-unselected text; non-matching typed text was never submitted. | Confirm whether non-matching typed text + Search shows 'Invalid', an empty result, or something else. | not stated |
| TQ-003 | OBS-016 | TC-028 | After selecting a suggestion, the field showed two spaces between first and last name. | Is the double space intended (e.g. empty middle name) or a display defect? | not stated |
| TQ-004 | PC SA-002; Exploration U-04 | TC-029 | Only first-name prefixes were explored. | Should last-name and middle-name input produce suggestions? | not stated |
| TQ-005 | PC SA-002; Exploration U-05 | TC-030 | No length limit or character rule is documented or observed. | Define any maximum length and accepted characters for Employee Name. | not stated |
| TQ-006 | OBS-015, XGAP-014 | TC-031 | 'Invalid' appeared after Escape + card click; the trigger was not isolated. | Should 'Invalid' appear on blur/Escape, or only on Search? | not stated |
| TQ-007 | PC SA-002/003; Exploration U-06 | TC-032, TC-033 | Keyboard interaction was not explored. | Define the expected keyboard behavior for suggestions and dropdowns. | not stated |
| TQ-008 | OBS-019; Exploration U-08 | TC-039 | End-of-list behavior and whether all N records eventually load were not observed. | Confirm that scrolling eventually renders all N records and how the end is signalled. | not stated |
| TQ-009 | PC SA-004; Exploration U-09 | TC-040 | No ordering rule for result cards is documented or observed. | Is there a defined sort order for results? | not stated |
| TQ-010 | OBS-018; Exploration U-11 | TC-046 | Copy/contact icons, QR content and Work Telephone display were not exercised. | Define the expected behavior of each detail-panel action. | not stated |
| TQ-011 | OBS-018; Exploration U-12 | TC-047 | Behavior when a second card is clicked while the panel is open was not observed. | Should the panel switch to the second employee? | not stated |
| TQ-012 | OBS-020 | TC-049 | The re-expanded state of the filter panel was not captured. | Confirm that re-expanding restores the fields (and whether values are kept). | not stated |
| TQ-013 | OBS-022, PB-001 | TC-050 | A transient 'No Records Found' was seen once after navigation (unconfirmed potential bug). | Is a transient 'No Records Found' during loading acceptable? If not, it should be confirmed as a defect at execution. | not stated |
| TQ-014 | PC SA-003/004; Exploration U-10 | TC-051 | Persistence of filters/results after refresh or Back was not observed. | Should filters and results persist after refresh or Back? | not stated |
| TQ-015 | OBS-010; Exploration U-03 | TC-052, TC-053 | AND logic was observed only for Job Title + Location; Employee Name combinations were not observed. | Confirm that Employee Name combines with the dropdown filters using AND. | not stated |
| TQ-016 | PC SA-002; Exploration U-07 | TC-055, TC-017 | How many suggestions are shown for a prefix matching several employees, in which order, and whether the list is truncated, was not observed. | Define the expected suggestion-list ordering and maximum length. | not stated |

Resolved upstream questions (by human decision, journal EVT-0016): XQ-001 (account — use the demo account; CG-003) and XQ-002 (volatile data — data-aware design; CG-004). PC OQ-012 is treated as answered for the detail panel only: it opens within the Directory page (OBS-018), so it is in scope.

## 9. Coverage Gaps

| ID | Category | Item | Reason | Impact (if known) | Dependency / blocker | Follow-up required |
|---|---|---|---|---|---|---|
| CG-001 | Intentional exclusion | QA-process rules satisfied by the design itself, not application behavior: PC BR-001 (Directory only), PC BR-002 – BR-005 (no API work), PC BR-007/BR-008 (Valid in Scope / Needs Automation fields present), PC BR-016 (no credentials recorded), PC EB-002 (test cases delivered as CSV) | Process constraints, verified by the artifact (Directory-only cases, zero API cases, flag columns, credential references only, TestCases.csv), not by executable test cases | — | — | No |
| CG-002 | Intentional exclusion | Rules and deliverables owned by other stages: PC BR-009 – BR-015, PC EB-001, PC EB-003 – EB-014 | Delivered or verified by exploration, test-review, manual-execution, automation and reporting stages | — | Downstream stages | No |
| CG-003 | Unavailable role | Directory behavior for roles/accounts other than the demo account | Human decision (journal EVT-0016): use the existing demo account only; coverage limited to it (XQ-001, PC OQ-002, PC GAP-002) | Role-dependent differences would go undetected | No other accounts provided (PC DEP-006) | Yes |
| CG-004 | Missing test data | Fixed result counts and specific employee names | Shared demo data changes during a session (OBS-021, XQ-002). Human decision: data-aware design; no fixed counts or names asserted | Exact-count regressions are not detectable | No controlled data environment (PC RK-005, PC GAP-009) | Yes |
| CG-005 | Intentional exclusion | Search with every individual Job Title and Location value | Representative values chosen at execution time (DATA-003/004); exhaustive value coverage adds no new partition (Exploration U-02) | A value-specific defect could be missed | — | No |
| CG-006 | Environment limitation | Other browsers, responsive/mobile viewports, accessibility checks | Not defined (PC GAP-006, PC OQ-009); not explored (U-14) | Browser/viewport-specific defects not covered | Environment definition | Yes |
| CG-007 | Intentional exclusion | Logout and session expiry while on the Directory | Involves the authentication module, outside the Directory scope (PC BR-001); not explored (U-13) | — | — | No |
| CG-008 | Uncovered observation | Loading indicator during incremental loading | Not observed (Exploration §13); no case can establish an expected result; partly covered by TC-039 (Exploratory) | — | — | Yes |
| CG-009 | Intentional exclusion | API behavior and network traffic | Out of scope (PC BR-002 – BR-005; user instruction) | — | — | No |
| CG-010 | Intentional exclusion | Process dependencies PC DEP-003 (approved PRD), PC DEP-004 (selected coverage scope), PC DEP-005 (Valid in Scope / Needs Automation values), PC DEP-007 (Playwright), PC DEP-008 (Claude), PC DEP-009 (IntelliJ) | Inputs to the QA process and tooling for later stages, not application behavior; satisfied by the approved PRD, ProjectContext, this artifact's flags, and the automation stages | — | Downstream stages (automation) | No |

## 10. Test Data Requirements

| ID | Data required | Category | Used by | Source / how provided | Notes |
|---|---|---|---|---|---|
| DATA-001 | Demo account able to log in and open the Directory | User | TC-002, TC-003, TC-004, TC-005, TC-006, TC-007, TC-008, TC-009, TC-010, TC-011, TC-012, TC-013, TC-014, TC-015, TC-016, TC-017, TC-018, TC-019, TC-020, TC-021, TC-022, TC-023, TC-024, TC-025, TC-026, TC-027, TC-028, TC-029, TC-030, TC-031, TC-032, TC-033, TC-034, TC-035, TC-036, TC-037, TC-038, TC-039, TC-040, TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-047, TC-048, TC-049, TC-050, TC-051, TC-052, TC-053, TC-054, TC-055, TC-056, TC-057, TC-058 | Credentials displayed on the application's login page; use for this task confirmed by the human (journal EVT-0012 decisions, EVT-0016). Never written into results, evidence or reports. | Role coverage limited to this account (CG-003). |
| DATA-002 | An employee chosen from the currently displayed cards whose first name has at least 4 characters, with at least one upper-case letter among the first 4, and whose first-4-character prefix does not begin the first name of any other currently displayed card | Dependent record | TC-014, TC-017, TC-018, TC-019, TC-020, TC-021, TC-022, TC-023, TC-024, TC-025, TC-028, TC-029, TC-031, TC-032 | Current demo data (data-aware selection at execution time) | The prefix is the first 4 characters exactly as written on the card. The upper-case letter makes the lower-case variant (TC-018) a distinct input. |
| DATA-003 | A Job Title value that returns at least one card, chosen at execution time | Dependent record | TC-010, TC-014 | Current Job Title options and results | — |
| DATA-004 | A Location value that returns at least one card (at least 2 for TC-047, and fewer than the unfiltered list for TC-015), chosen at execution time | Dependent record | TC-008, TC-009, TC-014, TC-015, TC-047, TC-051 | Current Location options and results | — |
| DATA-005 | A Job Title + Location pair that returns no cards, determined at execution time by checking single-filter results | Dependent record | TC-012, TC-013 | Current demo data | Determined at execution time from single-filter results; no fixed value. |
| DATA-006 | A synthetic string that matches no employee (e.g. 'zzqxv'); verify no suggestion appears before use | Other | TC-026, TC-027 | Design value | — |
| DATA-007 | A DATA-013-qualified employee whose card has no location | Dependent record | TC-035 | Current demo data | If none exists, TC-035 is Blocked. |
| DATA-008 | A DATA-013-qualified employee whose card shows job title, sub-unit and location | Dependent record | TC-034, TC-041, TC-042, TC-045, TC-052, TC-053, TC-056, TC-057 | Current demo data | — |
| DATA-009 | A DATA-013-qualified employee whose detail panel shows a work email | Dependent record | TC-043, TC-044, TC-046 | Current demo data | Never record the email value. |
| DATA-010 | Unfiltered total greater than the initially rendered card count | Account state | TC-037, TC-039 | Current demo data (observed 130–141 records vs 14 initial cards) | — |
| DATA-011 | Design strings: 256-character string; string with special characters (e.g. !@#$%^&*); markup-like text (e.g. <b>x</b>); digits only | Other | TC-030 | Design values (no limit documented) | Exploratory use only. |
| DATA-012 | A Job Title + Location pair read from one currently displayed result card that shows both a job title and a location, and that returns fewer records than the unfiltered list (compare the pair's results-header count with the unfiltered results-header count, both read at execution time) | Dependent record | TC-011, TC-054 | Current demo data (read from a card at execution time) | Guarantees at least one matching employee without fixed names or counts (TR-003). The fewer-records condition makes TC-054's "N greater than k" check meaningful (TR-015). |
| DATA-013 | Uniqueness condition for name searches: the employee's first name has at least 4 characters and, after typing its first 4 characters, the employee's full name appears exactly once in the suggestion list (confirmed during setup) | Dependent record | TC-020, TC-021, TC-034, TC-035, TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-052, TC-053, TC-056, TC-057 | Current demo data (checked at execution time) | Duplicate full names exist in the demo data (OBS-021, EVD-002); if the condition fails, choose another employee (TR-002). |
| DATA-014 | A 4-character prefix shared by the first names of several currently displayed cards | Dependent record | TC-055 | Current demo data | For TC-055 (U-07). |
| DATA-015 | A Location value that returns between 2 and 14 records, chosen at execution time | Dependent record | TC-036 | Current Location options and results | 14 = size of the initially rendered batch observed in exploration (OBS-019) (TR-007). |

No credential, password or personal value is recorded. Employee data is selected from the live demo data at execution time.

## 11. Coverage Summary

| Metric | Count |
|---|---|
| Total test cases (active) | 58 |
| Positive | 27 |
| Negative | 3 |
| Boundary | 2 |
| Validation | 3 |
| Business Rule | 1 |
| Dependency | 2 |
| Error Handling | 1 |
| Exploratory | 18 |
| End-to-End | 1 |
| Valid in Scope = TRUE | 58 |
| Needs Automation = TRUE | 1 |
| Uncovered sources | 35 |
| Open questions | 16 |
| Coverage gaps | 10 |

_No overall quality score is given. Judgment belongs to the human reviewer._
