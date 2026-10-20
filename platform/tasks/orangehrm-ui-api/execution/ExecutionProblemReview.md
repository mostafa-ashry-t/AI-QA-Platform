# Execution Problem Review

> Consolidates every failure and suspicious behaviour observed in the manual-execution run of 2026-10-15 (ExecutionReport.md v1.0.0),
> before any formal bug report is written (human instruction, journal EVT-0027). Assessments: Confirmed Failure (an approved expected result was not met),
> Suspected Issue (behaviour looks wrong but no approved expectation decides it, or it is unconfirmed), Environment/Test Data Issue.
>
> **Update 2026-10-18 (journal EVT-0035 / EVT-0036):** at the human's instruction, every Suspected Issue (PR-001 – PR-005) now has a
> candidate bug report in `bugs/BugReports.md` (BUG-001 – BUG-005), each labeled **Suspected**, not Confirmed. PR-006 – PR-008 stay
> environment/test-data issues and are not bugs. TC-024 was re-checked live (§7). Assessments and execution results are unchanged.
>
> **Update 2026-10-18 (journal EVT-0040):** after TestCases v1.4.0 (EVT-0037) and TestReview v1.3.0 (EVT-0039) were approved, TC-024 was
> re-executed with its corrected steps and PASSED (EVD-153, EVD-154). TCI-002 is resolved. No finding's assessment changed.

## 1. Summary

| Assessment | Count | Findings |
|---|---|---|
| Confirmed Failure | 0 | — |
| Suspected Issue | 5 | PR-001, PR-002, PR-003, PR-004, PR-005 |
| Environment/Test Data Issue | 3 | PR-006, PR-007, PR-008 |

| Finding | Candidate bug (2026-10-18) |
|---|---|
| PR-001 | BUG-001 (Suspected) |
| PR-002 | BUG-002 (Suspected) |
| PR-003 | BUG-003 (Suspected) |
| PR-004 | BUG-004 (Suspected) |
| PR-005 | BUG-005 (Suspected) |
| PR-006, PR-007, PR-008 | None: environment / test data, listed separately in BugReports.md |

Execution totals: 40 PASS, 0 FAIL, 0 BLOCKED, 18 Exploratory observed (TC-024 was BLOCKED under v1.3.0 and PASSED under v1.4.0). **No confirmed failure**: no approved expected result was contradicted.

## 2. Confirmed Failures

None. No executed case failed.

## 3. Suspected Issues (unconfirmed)

### PR-001 — Results header shows "No Records Found" while the unfiltered list is loading (PB-001 reproduced)

| Field | Value |
|---|---|
| Related test cases | TC-050 |
| Initial assessment | Suspected Issue |
| Candidate bug | BUG-001 (Suspected) — `bugs/BugReports.md` |
| Expected | Not established by approved requirements (TC-050 is Exploratory; TQ-013). Exploration recorded it as unconfirmed potential bug PB-001. |
| Actual (observed) | After sidebar navigation (5 of 5) and page reload (1 of 1) the header read "No Records Found" with 0 cards for about 0.3 - 0.6 s, then "(307) Records Found" with 14 cards. After Reset it did not occur. |
| Reproduction steps | 1. Log in to https://opensource-demo.orangehrmlive.com with the demo account. 2. Open the Directory page. 3. Click the sidebar "Directory" item (or reload the page). 4. Watch the results header during the first second. |
| Evidence | EVD-133, EVD-150 |
| Missing information / further verification | Business decision whether a transient empty-state message during loading is acceptable (TQ-013). Reproduced on one browser only; screen recording not captured. |

### PR-002 — Reset does not clear unselected text in Employee Name

| Field | Value |
|---|---|
| Related test cases | TC-018, TC-014 |
| Initial assessment | Suspected Issue |
| Candidate bug | BUG-002 (Suspected) — `bugs/BugReports.md` |
| Expected | No approved case covers this state. TC-014 (selected suggestion) expects Employee Name to be empty after Reset; OBS-012 recorded Reset clearing the field. |
| Actual (observed) | With "Timo" typed but not selected, Reset set both dropdowns to "-- Select --" and reloaded the list, but Employee Name still contained "Timo" (reproduced twice: 13:19:05Z and 13:19:25Z). |
| Reproduction steps | 1. Open the Directory page. 2. Type a few characters into Employee Name without selecting a suggestion. 3. Click Reset. 4. Observe the Employee Name field. |
| Evidence | EVD-073, EVD-074, EVD-150 |
| Missing information / further verification | Intended Reset behaviour for unselected text is not documented; a test case is missing (TCI-004). |

### PR-003 — Selected name shows two spaces when the employee has no middle name

| Field | Value |
|---|---|
| Related test cases | TC-028 |
| Initial assessment | Suspected Issue |
| Candidate bug | BUG-003 (Suspected) — `bugs/BugReports.md` |
| Expected | Not established (TC-028 Exploratory; TQ-003). |
| Actual (observed) | Selecting "Ranga Akunuri" filled the field with "Ranga␠␠Akunuri" (two spaces, char codes 32 32); with a middle name the spaces are single. The card header text also contains the double space. Same pattern as exploration OBS-016. |
| Reproduction steps | 1. Type "Rang" into Employee Name. 2. Select "Ranga Akunuri". 3. Inspect the field value. |
| Evidence | EVD-097, EVD-150 |
| Missing information / further verification | Cosmetic; confirm whether an empty middle name should collapse the space. |

### PR-004 — Copy icons in the detail panel are never visible

| Field | Value |
|---|---|
| Related test cases | TC-046 |
| Initial assessment | Suspected Issue |
| Candidate bug | BUG-004 (Suspected) — `bugs/BugReports.md` |
| Expected | Not established (TC-046 Exploratory; TQ-010). |
| Actual (observed) | Two copy buttons (bi-files) exist in the panel next to Work Telephone and Work Email, but stay display:none even while the mouse is over the row or its hover wrapper, so a user cannot click them. |
| Reproduction steps | 1. Open an employee's detail panel that shows Work Telephone and Work Email. 2. Hover over each value row. 3. Look for a copy icon. |
| Evidence | EVD-150 |
| Missing information / further verification | Low confidence: may be intended or depend on a different hover target or viewport; needs the intended design. Contact-button effect (tel:/mailto:) also unconfirmed. |

### PR-005 — "Should not exceed 100 characters" stays visible after the text is shortened

| Field | Value |
|---|---|
| Related test cases | TC-030 |
| Initial assessment | Suspected Issue |
| Candidate bug | BUG-005 (Suspected) — `bugs/BugReports.md` |
| Expected | Not established (TC-030 Exploratory; TQ-005). |
| Actual (observed) | After Search with a 266-character name the message "Should not exceed 100 characters" appeared; after replacing the text with an 8-character string the message remained until the next Search (then "Invalid"). |
| Reproduction steps | 1. Enter more than 100 characters in Employee Name and click Search. 2. Replace the text with a short string. 3. Observe the message before clicking Search. |
| Evidence | EVD-099, EVD-150 |
| Missing information / further verification | Minor; whether messages should clear on input is not documented. Also new information: a 100-character limit exists (exploration had not observed one). |

## 4. Environment / Test Data Issues

### PR-006 — HTTP 500 after login (TC-054 attempt 1)

| Field | Value |
|---|---|
| Related test cases | TC-054 |
| Initial assessment | Environment/Test Data Issue |
| Expected | Login returns to the Directory page (OBS-003). |
| Actual (observed) | After submitting the demo credentials the browser showed "This page isn't working ... HTTP ERROR 500" (14:00:06Z). The retry 20 s later succeeded with no 5xx responses; the unfiltered total had changed from 307 to 95, consistent with a demo data reset at that time. |
| Reproduction steps | 1. Clear the session. 2. Open the Directory URL and log in with the demo account. 3. Observe the page after login. |
| Evidence | EVD-139, EVD-150 |
| Missing information / further verification | Not reproduced; the failing request URL was not captured in attempt 1. Likely the shared demo environment; cannot be confirmed. |

### PR-007 — Sidebar click did not reload the page once (not reproduced)

| Field | Value |
|---|---|
| Related test cases | TC-047 |
| Initial assessment | Environment/Test Data Issue |
| Expected | Clicking the sidebar "Directory" item reloads the Directory page (OBS-003, TC-003). |
| Actual (observed) | At 13:34:35Z, with a detail panel open, a sidebar click left the previous state (navigation timestamp unchanged). The same action at 13:36:14Z and 13:56:50Z reloaded normally. |
| Reproduction steps | 1. Open an employee's detail panel. 2. Click the sidebar "Directory" item. 3. Check whether the page reloads. |
| Evidence | EVD-150 |
| Missing information / further verification | Single occurrence; may be an automation-tool timing effect. Needs manual re-check. |

### PR-008 — Shared demo data changed continuously during the run

| Field | Value |
|---|---|
| Related test cases | TC-055, TC-008, TC-022 |
| Initial assessment | Environment/Test Data Issue |
| Expected | Data-aware design assumes data can change (CG-004). |
| Actual (observed) | Unfiltered total: 252 (13:14Z) -> 263 (13:30Z) -> 307 (13:57Z) -> 95 (14:00Z, reset) -> 97 (14:00:59Z); names changed (e.g. a Texas R&D card replaced). DATA-014 was not available for TC-055. |
| Reproduction steps | 1. Observe the unfiltered "(N) Records Found" over 30 minutes. |
| Evidence | EVD-150 |
| Missing information / further verification | No controlled data environment (PC RK-005); no defect implied. |

## 5. Test Case Issues (not application issues)

| ID | Case | Issue | Recommended action |
|---|---|---|---|
| TCI-001 | — | The common precondition "click Reset first if any filter is set" does not clear unselected text typed in Employee Name. | Revise via Test Design: establish defaults by reloading the Directory page, or state that unselected name text must be cleared. |
| TCI-002 | TC-024 | After Search shows "Invalid" the suggestion list is closed, and step 2 gives no action that reopens it. | Revise via Test Design: add a step that reopens the list (TC-025 showed that retyping the text reopens it). Re-checked 2026-10-18 (EVD-151, EVD-152); Test Design v1.4.0 (Draft, EVT-0034) adds the step. **Resolved:** TestCases v1.4.0 (EVT-0034, approved EVT-0037); TC-024 PASS on 2026-10-18 (EVD-153, EVD-154). |
| TCI-003 | TC-055 | DATA-014 (4-character prefix shared by several displayed first names) was not available at run time because the shared data changed. | Re-run when such a prefix exists, or define DATA-014 against the suggestion list instead of displayed cards. |
| TCI-004 | — | No case covers Reset when Employee Name holds unselected text (see PR-002). | Add a case (Exploratory until the expected behaviour is decided) via Test Design. |

## 6. Observations answering open questions (no verdict)

| Question | Observation |
|---|---|
| TQ-001 | Search with all fields empty shows the unfiltered list (TC-016). |
| TQ-002 | Non-matching typed text + Search shows "Invalid" and does not search (TC-027). |
| TQ-004 | Last-name text produces suggestions; matching also finds text inside names ("Rang" -> "Orange Test") (TC-028, TC-029). |
| TQ-005 | A 100-character limit is enforced on Search (TC-030). |
| TQ-006 | "Invalid" appears when the field loses focus (click outside), not on Escape (TC-031). |
| TQ-007 | Suggestions and dropdowns are operable by keyboard; Escape keeps the highlighted dropdown value (TC-032, TC-033). |
| TQ-008 | Scrolling renders all N records; no end-of-list message (TC-039). |
| TQ-009 | Order is stable across Reset; consistent with last-name order (TC-040). |
| TQ-011 | Clicking another card switches the open panel (TC-047). |
| TQ-012 | Re-expanding the filter panel restores the fields (TC-049). |
| TQ-014 | Filters are not kept after refresh or Back (TC-051). |
| TQ-015 | Employee Name combines with Location as AND (TC-052, TC-053). |
| TQ-016 | A prefix matching several employees returned 5 suggestions; whether 5 is a cap is not established (TC-055). |

## 7. Review notes (2026-10-18)

### TC-024 — suggestion list cannot be reopened without editing the text (TCI-002, not an application bug)

| Field | Value |
|---|---|
| Related test cases | TC-024 (BLOCKED under v1.3.0; PASS under v1.4.0), TC-025 (PASS) |
| Assessment | Test case issue (TCI-002); not an application bug |
| Re-check | 2026-10-18 08:53 – 08:54Z, Playwright MCP, visible browser, under the then-current approvals (TestCases v1.3.0 EVT-0029, TestReview v1.2.0 EVT-0031) |
| Actual (observed) | "Timo" + Search without selecting: "Invalid" shown, suggestion list closed. With the text unchanged, a click in the field, ArrowDown, a double-click, Alt+ArrowDown, and Tab / Shift+Tab + ArrowDown did not reopen the list; "Invalid" stayed and the value stayed "Timo". Same as the 2026-10-15 attempt (EVD-089). |
| Evidence | EVD-151 (screenshot), EVD-152 (diagnostic log) |
| Consequence | TC-024 stays BLOCKED. Test Design v1.4.0 (Draft, journal EVT-0034) adds step 2 "Delete the last character of the text and type it again, so the suggestion list reopens." It needs `TEST_DESIGN_APPROVED`, a test-review re-review and `TEST_REVIEW_APPROVED` before TC-024 can be executed again. |
| Outcome (2026-10-18, 09:39 – 09:40Z) | TestCases v1.4.0 approved (EVT-0037), TestReview v1.3.0 approved (EVT-0039). TC-024 re-executed as written in v1.4.0: after Search "Invalid" appeared; deleting and retyping the last character reopened the list ("Invalid" still shown); selecting "Timothy Lewis Amiano" removed the message. **PASS** (EVD-153 screenshot, EVD-154 log). |
| Data note | The unfiltered total was "(142) Records Found" and the filter panel was displayed collapsed on arrival (shared demo data changes, PR-008). |

## 8. Decision record

2026-10-18 (journal EVT-0035): the human asked for a candidate bug report for every suspected issue, each clearly labeled Confirmed or Suspected, with environment and test-data issues kept separate. Result: BUG-001 – BUG-005, all Suspected; no Confirmed bug. Bug reports stay Draft until `MANUAL_EXECUTION_APPROVED`.
