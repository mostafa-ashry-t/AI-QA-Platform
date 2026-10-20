# Execution Report

> Produced by the `manual-execution` skill (v1.1.0, prompt `manual-execution` v1.1.0) against the approved TestCases.md v1.3.0 and the
> approved TestReview.md v1.2.0 (ADR-001). Executed through Playwright MCP in a visible browser. No automation was generated. Findings were
> consolidated first in `execution/ExecutionProblemReview.md` for human review (human instruction, journal EVT-0027). Revision 1.1.0 (journal EVT-0036)
> adds candidate bug reports BUG-001 – BUG-005 in `bugs/BugReports.md`, all **Suspected** (human instruction, EVT-0035), and records the TC-024
> re-check of 2026-10-18. No execution result changed. Revision 1.2.0 (journal EVT-0040) re-plans the run against the approved TestCases.md v1.4.0
> and TestReview.md v1.3.0: TC-024, the only case changed in v1.4.0, was re-executed with its new step 2 and now PASSES; the other 57 case
> blocks are byte-identical to v1.3.0, so their results are carried forward unchanged.

## 1. Execution Information

| Field | Value |
|---|---|
| Task ID | `orangehrm-ui-api` |
| Task Name | `OrangeHRM UI & API QA assignment` (scope: Directory UI only) |
| Project Name | `OrangeHRM` |
| Workflow Run ID | `RUN-001` |
| Environment | unavailable — not provided (TaskContext: `not provided`); the public shared demo site was used |
| Application URL | https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory |
| Build / version | OrangeHRM OS 5.9 — read from the page footer |
| Browser | Chromium via Playwright MCP (`@playwright/mcp@latest`); exact version unavailable — not reported by the tool |
| Test data source | DATA-001: demo credentials displayed on the application's login page (values never recorded); DATA-002 – DATA-015: current demo data, chosen at execution time |
| Execution started | 2026-10-15T13:13:36Z |
| Execution ended | 2026-10-15T14:02:10Z |
| Re-execution (v1.4.0) | TC-024 only: 2026-10-18T09:39:40Z – 2026-10-18T09:40:32Z |
| TestCases.md | version 1.4.0 · SHA-256 `9197633342204a94ff1aa710e807c6b8246ff03ea5a35cc61d84192808ecefe7` · approval journal EVT-0037 (results of 2026-10-15 were obtained under v1.3.0, SHA-256 `66e895e7…3d70`, EVT-0029; only TC-024 differs) |
| TestReview.md | version 1.3.0 · SHA-256 `16997b9e2cfc407e038f6f75c3fa0af27dec3f29bdfa99ca3547f75652b937ab` · approval journal EVT-0039 (2026-10-15 run: v1.2.0, EVT-0031) |
| ProjectContext / ExplorationReport | SHA-256 `0b0dcc57d5fc887e8e3c2b0e1f74d0934841430958a2ba3da8f52258d55f24de` / `0edc9da6ebc94b63f27c4e9545f2c44062f87c70b8f53ed9e825096d8b8651d2` |
| Report version | 1.2.0 |
| Status | Approved (`MANUAL_EXECUTION_APPROVED`, journal EVT-0043) |
| Skill version | manual-execution v1.1.0 |
| Prompt version | manual-execution v1.1.0 |

### Revision History

| Version | Date (UTC) | Reason | Changed sections | Re-executed cases | Changed results | Bugs added / modified / withdrawn |
|---|---|---|---|---|---|---|
| 1.0.0 | 2026-10-15 | Initial execution | All | n/a | n/a | — / — / — |
| 1.1.0 | 2026-10-18 | Human instruction (EVT-0035): candidate bug report for every Suspected Issue PR-001 – PR-005; TC-024 step-2 re-check | §3, §4 (TC-024), §6, §8, §9 | TC-024 (step 1 and step-2 re-check only; result unchanged) | none | BUG-001 – BUG-005 / — / — |
| 1.2.0 | 2026-10-18 | Re-plan after TestCases v1.4.0 (`TEST_DESIGN_APPROVED` EVT-0037) and TestReview v1.3.0 (`TEST_REVIEW_APPROVED` EVT-0039): TC-024 re-executed with the corrected steps | §1, §2, §3, §4 (TC-024), §6, §7 (TCI-002), §9 | TC-024 | TC-024: BLOCKED → PASS | — / — / — |

## 2. Execution Scope

### Approved test cases

_All Active cases in the approved TestCases.md v1.4.0: TC-001 … TC-058 (58). All have Valid in Scope = TRUE. v1.4.0 differs from v1.3.0 only in TC-024's steps and notes (journal EVT-0034, check TD-T024c)._

### Selected and executed

| Case | Title | Executed? |
|---|---|---|
| TC-001 | Unauthenticated access to the Directory URL redirects to the login page | Yes |
| TC-002 | Logging in from the redirect returns the user to the Directory page | Yes |
| TC-003 | Sidebar "Directory" link loads the Directory URL | Yes |
| TC-004 | Directory filter panel provides exactly the verified controls | Yes |
| TC-005 | Filter controls show their default state on page load | Yes |
| TC-006 | Job Title options list "-- Select --" first, then values in case-insensitive alphabetical order | Yes |
| TC-007 | Location options list "-- Select --" first, followed by at least one location | Yes |
| TC-008 | Selecting a filter value does not change the results until Search is clicked | Yes |
| TC-009 | Location filter shows only employees at the selected location | Yes |
| TC-010 | Job Title filter shows only employees with the selected job title | Yes |
| TC-011 | Job Title and Location combine: results match both selections | Yes |
| TC-012 | Filter combination with no matching employee shows "No Records Found" and no cards | Yes |
| TC-013 | A search with no results shows an info toast "No Records Found" | Yes |
| TC-014 | Reset returns all filter fields to their defaults | Yes |
| TC-015 | Reset restores the unfiltered results without clicking Search | Yes |
| TC-016 | Search clicked with all filter fields empty | No (Exploratory — steps performed, observations recorded) |
| TC-017 | Typing part of an existing first name shows a matching suggestion | Yes |
| TC-018 | Name suggestions are not case-sensitive | Yes |
| TC-019 | Leading and trailing spaces do not prevent suggestions | Yes |
| TC-020 | Searching a selected name suggestion shows only that employee | Yes |
| TC-021 | Results header uses the singular "(1) Record Found" for one result | Yes |
| TC-022 | Searching with typed text not selected from suggestions shows "Invalid" | Yes |
| TC-023 | Searching with typed text not selected from suggestions does not run the search | Yes |
| TC-024 | Selecting a suggestion clears the "Invalid" message | Yes |
| TC-025 | "Invalid" stays visible while new text is typed after a failed search | Yes |
| TC-026 | Non-matching name text shows "No Records Found" in the suggestion list | Yes |
| TC-027 | Search clicked with non-matching typed text | No (Exploratory — steps performed, observations recorded) |
| TC-028 | Employee Name field text after selecting a suggestion | No (Exploratory — steps performed, observations recorded) |
| TC-029 | Search by last name only or by middle name | No (Exploratory — steps performed, observations recorded) |
| TC-030 | Very long input and special characters in Employee Name | No (Exploratory — steps performed, observations recorded) |
| TC-031 | Leaving Employee Name with unselected text | No (Exploratory — steps performed, observations recorded) |
| TC-032 | Keyboard selection of a name suggestion | No (Exploratory — steps performed, observations recorded) |
| TC-033 | Keyboard operation of the Job Title and Location dropdowns | No (Exploratory — steps performed, observations recorded) |
| TC-034 | Result card shows name, picture, job title, sub-unit and location for an employee with all values | Yes |
| TC-035 | Result card omits the location line for an employee without a location | Yes |
| TC-036 | Results header uses "(N) Records Found" when more than one record matches | Yes |
| TC-037 | Scrolling the results loads additional cards | Yes |
| TC-038 | Results area has no pagination control | Yes |
| TC-039 | Scrolling to the end of the result list | No (Exploratory — steps performed, observations recorded) |
| TC-040 | Order of result cards | No (Exploratory — steps performed, observations recorded) |
| TC-041 | Clicking a result card opens the detail panel | Yes |
| TC-042 | Detail panel shows the clicked employee's name, job title, sub-unit and location | Yes |
| TC-043 | Detail panel shows a Work Email entry for an employee with a work email | Yes |
| TC-044 | Detail panel shows a QR code image | Yes |
| TC-045 | Arrow icon closes the detail panel | Yes |
| TC-046 | Detail panel actions: copy icons, contact icons, QR content, Work Telephone | No (Exploratory — steps performed, observations recorded) |
| TC-047 | Clicking another card while the detail panel is open | No (Exploratory — steps performed, observations recorded) |
| TC-048 | Filter panel toggle collapses the filter panel | Yes |
| TC-049 | Filter panel toggle re-expands the collapsed panel | No (Exploratory — steps performed, observations recorded) |
| TC-050 | Results header while the list loads after sidebar navigation (PB-001) | No (Exploratory — steps performed, observations recorded) |
| TC-051 | Filters and results after a browser refresh or Back navigation | No (Exploratory — steps performed, observations recorded) |
| TC-052 | Employee Name combined with a matching Location | No (Exploratory — steps performed, observations recorded) |
| TC-053 | Employee Name combined with a Location the employee does not have | No (Exploratory — steps performed, observations recorded) |
| TC-054 | End-to-end: redirect login, combined filter, employee details, close, Reset | Yes |
| TC-055 | Suggestion list for a prefix that matches several employees | No (Exploratory — steps performed, observations recorded) |
| TC-056 | Clicking a result card does not change the page URL | Yes |
| TC-057 | Closing the detail panel does not change the page URL | Yes |
| TC-058 | Sidebar "Directory" item is shown as active on the Directory page | Yes |

### Not executed

_The skill gives no PASS/FAIL verdict to Exploratory cases. At the human's request (journal EVT-0027) every Exploratory case still received a genuine attempt: its steps were performed in the browser and the observations are reported in §4 and in the Problem Review._

| Case | Reason |
|---|---|
| TC-016 | Exploratory: expected result not established (TQ-001) — observed, no verdict |
| TC-027 | Exploratory: expected result not established (TQ-002) — observed, no verdict |
| TC-028 | Exploratory: expected result not established (TQ-003) — observed, no verdict |
| TC-029 | Exploratory: expected result not established (TQ-004) — observed, no verdict |
| TC-030 | Exploratory: expected result not established (TQ-005) — observed, no verdict |
| TC-031 | Exploratory: expected result not established (TQ-006) — observed, no verdict |
| TC-032 | Exploratory: expected result not established (TQ-007) — observed, no verdict |
| TC-033 | Exploratory: expected result not established (TQ-007) — observed, no verdict |
| TC-039 | Exploratory: expected result not established (TQ-008) — observed, no verdict |
| TC-040 | Exploratory: expected result not established (TQ-009) — observed, no verdict |
| TC-046 | Exploratory: expected result not established (TQ-010) — observed, no verdict |
| TC-047 | Exploratory: expected result not established (TQ-011) — observed, no verdict |
| TC-049 | Exploratory: expected result not established (TQ-012) — observed, no verdict |
| TC-050 | Exploratory: expected result not established (TQ-013) — observed, no verdict |
| TC-051 | Exploratory: expected result not established (TQ-014) — observed, no verdict |
| TC-052 | Exploratory: expected result not established (TQ-015) — observed, no verdict |
| TC-053 | Exploratory: expected result not established (TQ-015) — observed, no verdict |
| TC-055 | Exploratory: expected result not established (TQ-016) — observed, no verdict |

## 3. Execution Summary

| Metric | Count |
|---|---|
| Total approved (active) | 58 |
| Selected | 40 |
| Executed | 40 |
| PASS | 40 |
| FAIL | 0 |
| BLOCKED | 0 |
| Not executed (Exploratory, observed) | 18 |
| Test case issues | 4 |
| Deviations recorded | 4 |
| Bugs raised | 5 candidate bugs, all Suspected (BUG-001 – BUG-005); 0 Confirmed |
| Problem Review findings | 8 (0 Confirmed Failure, 5 Suspected Issue, 3 Environment/Test Data Issue) |

_No overall quality score is given._

## 4. Per-Case Results

| ID | Expected | Actual | Status | Reason | Evidence |
|---|---|---|---|---|---|
| TC-001 | The browser ends on the login page URL https://opensource-demo.orangehrmlive.com/web/index.php/auth/login. | Fresh browser context (no session); opened the Directory URL; the browser ended on https://opensource-demo.orangehrmlive.com/web/index.php/auth/login (title OrangeHRM). | PASS | No screenshot: the login page displays the demo credentials. | EVD-150 |
| TC-002 | The Directory page is shown: the page URL is the Directory URL and the header title reads "Directory". | Logged in from the redirect with the demo account (DATA-001, values not recorded); page URL https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory, header title "Directory". | PASS | — | EVD-047, EVD-150 |
| TC-003 | The page URL is the Directory URL. | Clicked the sidebar "Directory" item; page URL is the Directory URL (13:14:14Z). | PASS | — | EVD-150 |
| TC-004 | The filter panel contains exactly: Employee Name (text input), Job Title (dropdown), Location (dropdown), Reset button and Search button. | Filter panel titled "Directory" contains Employee Name (text input), Job Title and Location (dropdowns), Reset (type reset) and Search (type submit); no other input in the form. | PASS | — | EVD-050, EVD-150 |
| TC-005 | Employee Name is empty with the placeholder "Type for hints...", and Job Title and Location both display "-- Select --". | Without interacting: Employee Name empty with placeholder "Type for hints..."; Job Title and Location display "-- Select --". | PASS | — | EVD-050, EVD-150 |
| TC-006 | The first option is "-- Select --" and the remaining options are in case-insensitive alphabetical order. | Job Title list: first option "-- Select --", then 30 values in case-insensitive alphabetical order (0 order violations). | PASS | Snapshot reference only: 30 values incl. Data2026_10_15_17_36_45 and Data2026_10_15_17_47_28 (shared demo data). | EVD-051, EVD-150 |
| TC-007 | The first option is "-- Select --" and at least one location value follows it. | Location list: "-- Select --" first, followed by Canadian Regional HQ, HQ - CA, USA, New York Sales Office, Texas R&D. | PASS | — | EVD-052, EVD-150 |
| TC-008 | The results header text and the displayed cards are unchanged after selecting the value. | Header "(252) Records Found" and 14 cards noted; selected Location Texas R&D without Search; header, card count and first names unchanged immediately and after a 3 s wait. | PASS | — | EVD-057, EVD-150 |
| TC-009 | Every displayed result card shows the selected location. | Location Texas R&D + Search: "(4) Records Found"; all 4 cards show "Texas R&D". | PASS | — | EVD-058, EVD-150 |
| TC-010 | Every displayed result card shows the selected job title. | Job Title QA Engineer + Search: "(1) Record Found"; the card shows "QA Engineer". | PASS | — | EVD-059, EVD-150 |
| TC-011 | Every displayed result card shows both the selected job title and the selected location. | DATA-012 pair Software Engineer + Texas R&D (read from one card) + Search: "(1) Record Found"; the card shows both values. | PASS | — | EVD-060, EVD-150 |
| TC-012 | The results header reads "No Records Found" and no result cards are displayed. | DATA-005 pair QA Engineer + New York Sales Office + Search: header "No Records Found", 0 cards. | PASS | — | EVD-061, EVD-150 |
| TC-013 | An info toast with the text "No Records Found" appears. | Same pair + Search; screenshot taken immediately shows an info toast "Info / No Records Found". | PASS | — | EVD-067, EVD-150 |
| TC-014 | Employee Name is empty and Job Title and Location both display "-- Select --". | Selected suggestion "Timothy Lewis Amiano" (typed "Timo"), Job Title QA Engineer, Location Texas R&D; Reset: Employee Name empty, Job Title and Location "-- Select --". | PASS | — | EVD-069, EVD-150 |
| TC-015 | The results header shows "(N) Records Found" with N greater than the filtered count noted in step 1. | Texas R&D + Search: "(4) Records Found" (k = 4); Reset without Search: "(252) Records Found"; 252 > 4. | PASS | — | EVD-070, EVD-150 |
| TC-016 | Not established by approved requirements. | All filters at defaults + Search: "(252) Records Found", 14 cards (unfiltered list), no message, no toast. | Not executed (Exploratory — observed) | TQ-001 | EVD-071, EVD-150 |
| TC-017 | The suggestion list contains the DATA-002 employee's full name. | Typed "Timo" character by character; suggestion list: "Timothy Lewis Amiano". | PASS | — | EVD-072, EVD-150 |
| TC-018 | The suggestion list contains the DATA-002 employee's full name. | Attempt 1 invalid (precondition not established: Reset left the previous unselected text, field became "timoTimo"). Attempt 2 on a reloaded page: typed "timo"; suggestion list: "Timothy Lewis Amiano". | PASS | DEV-001, TCI-001 | EVD-073, EVD-075, EVD-150 |
| TC-019 | The suggestion list contains the DATA-002 employee's full name. | Typed "␠␠Timo␠␠" (value confirmed); suggestion list: "Timothy Lewis Amiano". | PASS | DEV-001 | EVD-076, EVD-150 |
| TC-020 | Exactly one result card is displayed, and it shows the selected employee's name. | Typed "Timo"; the full name appeared exactly once (DATA-013); selected; Search: "(1) Record Found", one card "Timothy Lewis Amiano". | PASS | DEV-001 | EVD-077, EVD-150 |
| TC-021 | The results header reads exactly "(1) Record Found". | Same steps re-executed independently; header reads exactly "(1) Record Found". | PASS | DEV-001 | EVD-150 |
| TC-022 | The message "Invalid" is displayed under the Employee Name field. | Typed "Timo" without selecting; Search: message "Invalid" under Employee Name. | PASS | DEV-001 | EVD-087, EVD-150 |
| TC-023 | The results header text and displayed cards are unchanged from step 1. | Header "(255) Records Found" and 14 names noted; typed "Timo" without selecting; Search: header and the 14 names unchanged. | PASS | DEV-001 | EVD-088, EVD-150 |
| TC-024 | The "Invalid" message is no longer displayed under Employee Name. | v1.4.0 (2026-10-18): "Timo" + Search: "Invalid", list closed. Deleted the last character and typed it again: list reopened with "Timothy Lewis Amiano", "Invalid" still shown. Selected the suggestion: no "Invalid" message; field "Timothy Lewis Amiano". Earlier: BLOCKED under v1.3.0 (2026-10-15 and re-check 2026-10-18; step 2 not performable, DEV-002, TCI-002). | PASS | Re-executed under v1.4.0 after TCI-002 was fixed | EVD-153, EVD-154 (earlier attempts: EVD-089, EVD-150, EVD-151, EVD-152) |
| TC-025 | The "Invalid" message is still displayed under Employee Name. | "Timo" + Search: "Invalid"; replaced the text with "timo" without selecting: "Invalid" still displayed (suggestion list reopened). | PASS | DEV-001 | EVD-090, EVD-150 |
| TC-026 | The suggestion list shows "No Records Found". | Typed "zzqxv" (DATA-006): suggestion list shows "No Records Found"; no field message. | PASS | DEV-001 | EVD-095, EVD-150 |
| TC-027 | Not established by approved requirements. | "zzqxv" + Search: message "Invalid", header unchanged "(256) Records Found", 14 cards, no toast. | Not executed (Exploratory — observed) | TQ-002 | EVD-096, EVD-150 |
| TC-028 | Not established by approved requirements. | Typed "Rang": suggestions "Ranga Akunuri", "Orange Test"; selected "Ranga Akunuri" (no middle name): field value "Ranga␠␠Akunuri" (two spaces). With a middle name (Timothy Lewis Amiano) single spaces. | Not executed (Exploratory — observed) | TQ-003 | EVD-097, EVD-150 |
| TC-029 | Not established by approved requirements. | Typed "Amia" (part of the DATA-002 last name): suggestion "Timothy Lewis Amiano"; selected + Search: "(1) Record Found", that card. | Not executed (Exploratory — observed) | TQ-004 | EVD-098, EVD-150 |
| TC-030 | Not established by approved requirements. | No maxlength attribute; 266 characters accepted in the field; suggestions "No Records Found"; Search: message "Should not exceed 100 characters". "!@#$%^&*": the 100-character message stayed visible while typing; Search: "Invalid". "<b>x</b>": kept as literal text; Search: "Invalid". "0000": Search: "Invalid". | Not executed (Exploratory — observed) | TQ-005, DEV-003 | EVD-099, EVD-150 |
| TC-031 | Not established by approved requirements. | (a) Unselected "Timo" + Escape: list closed, no message, focus kept. (b) Unselected "Timo" + click outside the field: "Invalid" shown. | Not executed (Exploratory — observed) | TQ-006 | EVD-105, EVD-150 |
| TC-032 | Not established by approved requirements. | "Timo", ArrowDown highlights the suggestion, Enter fills "Timothy Lewis Amiano" without submitting; Search: "(1) Record Found", that employee. | Not executed (Exploratory — observed) | TQ-007 | EVD-106, EVD-150 |
| TC-033 | Not established by approved requirements. | Tab reaches Job Title then Location; Enter opens the list; ArrowDown moves the highlight and the displayed value changes while open; Escape closes and keeps the highlighted value; Enter selects; no search submitted. | Not executed (Exploratory — observed) | TQ-007 | EVD-107, EVD-150 |
| TC-034 | The card shows the employee's name, a profile picture, job title, sub-unit and location. | "Pete" -> "Peter Mac Anderson" (exactly once); Search: card shows the name, a loaded profile picture, Chief Financial Officer, Administration, New York Sales Office. | PASS | DEV-001 | EVD-111, EVD-150 |
| TC-035 | The card shows no location line. | "Rang" -> "Ranga Akunuri" (full name once); Search: the card shows only the name; the location block is hidden (display:none). | PASS | DEV-001 | EVD-112, EVD-150 |
| TC-036 | The results header reads "(N) Records Found", where N equals the number of result cards counted in step 2. | DATA-015 Location Texas R&D + Search: header "(4) Records Found"; 4 cards counted. | PASS | DEV-001 | EVD-113, EVD-150 |
| TC-037 | More result cards are rendered after scrolling than before. | No filters: 14 cards rendered; after 6 mouse-wheel steps over the results: 56 cards rendered. | PASS | DEV-001 | EVD-114, EVD-150 |
| TC-038 | No pagination control is displayed. | Results area: header row, card container, empty bottom container; no pagination element, no page buttons, no next/previous text. | PASS | DEV-001 | EVD-115, EVD-150 |
| TC-039 | Not established by approved requirements. | Scrolled until no more cards load: 263 cards rendered = header "(263) Records Found"; no end-of-list message; no spinner at the end. | Not executed (Exploratory — observed) | TQ-008 | EVD-116, EVD-150 |
| TC-040 | Not established by approved requirements. | First 14 names identical before and after Reset; not alphabetical by first name; consistent with ascending last name (not established). | Not executed (Exploratory — observed) | TQ-009 | EVD-150 |
| TC-041 | A detail panel opens on the right of the Directory page. | "Peter Mac Anderson" search; card click: detail panel present on the right (x=1612, width 250) of the results list (x=304); URL unchanged. | PASS | DEV-001; no panel screenshot (personal data) | EVD-150 |
| TC-042 | The detail panel shows the same name, job title, sub-unit and location as the clicked card. | Card: Peter Mac Anderson / Chief Financial Officer / Administration / New York Sales Office; panel first four lines identical. | PASS | DEV-001 | EVD-150 |
| TC-043 | The detail panel shows the label "Work Email" with a non-empty value. | Panel shows the label "Work Email" followed by a non-empty value [REDACTED: personal data] (read after a 2 s wait; an immediate read had no content yet). | PASS | DEV-001 | EVD-150 |
| TC-044 | A QR code image is displayed in the detail panel. | Panel contains a loaded QR code image (img.orangehrm-qr-code, 140x140). | PASS | DEV-001; QR not screenshotted | EVD-150 |
| TC-045 | The detail panel is no longer displayed. | Panel open; clicked the arrow icon: the panel is no longer present. | PASS | DEV-001 | EVD-124, EVD-150 |
| TC-046 | Not established by approved requirements. | Telephone and envelope buttons: no new tab, no navigation, no toast; one console entry 'Launched external handler for tel:[REDACTED]' was logged with unconfirmed timing. Copy icons exist but stay display:none even on hover, so they could not be clicked. QR not decoded (no decoder available). Work Telephone label and value displayed. | Not executed (Exploratory — observed) | TQ-010 | EVD-150 |
| TC-047 | Not established by approved requirements. | Texas R&D: 4 cards; clicking card 1 opened its panel; clicking card 2 kept one panel and switched it to card 2's employee. | Not executed (Exploratory — observed) | TQ-011 | EVD-150 |
| TC-048 | The filter fields and the Reset/Search buttons are hidden; the panel title "Directory" stays visible. | Caret toggle clicked: Employee Name, Job Title, Location, Reset and Search hidden; title "Directory" visible. | PASS | DEV-001 | EVD-131, EVD-150 |
| TC-049 | Not established by approved requirements. | Collapsed then clicked again: fields and buttons visible again, values at defaults (steps set no values). | Not executed (Exploratory — observed) | TQ-012 | EVD-132, EVD-150 |
| TC-050 | Not established by approved requirements. | Sampled every 50 ms: after sidebar navigation (5x) and page reload (1x) the header showed "No Records Found" with 0 cards for about 0.3 - 0.6 s before "(307) Records Found" and 14 cards (6 of 6). After Reset: not observed. | Not executed (Exploratory — observed) | TQ-013, PB-001 | EVD-133, EVD-150 |
| TC-051 | Not established by approved requirements. | After a Texas R&D search: browser refresh and Back (via Dashboard) both showed default filters and the unfiltered list. | Not executed (Exploratory — observed) | TQ-014 | EVD-150 |
| TC-052 | Not established by approved requirements. | Name Peter Mac Anderson + his card's Location New York Sales Office: "(1) Record Found", his card. | Not executed (Exploratory — observed) | TQ-015 | EVD-137, EVD-150 |
| TC-053 | Not established by approved requirements. | Same name + Location Texas R&D: "No Records Found", 0 cards, info toast. | Not executed (Exploratory — observed) | TQ-015 | EVD-138, EVD-150 |
| TC-054 | Employee Name is empty, Job Title and Location display "-- Select --", and the results header reads "(N) Records Found" with N greater than the count k noted in step 3. | Attempt 1: HTTP 500 page after login (environment). Attempt 2: login returned to the Directory; Chief Financial Officer + New York Sales Office (from one card): k = 1 "(1) Record Found" (< 95 unfiltered); panel opened and closed; Reset; after cards were displayed: Employee Name empty, Job Title and Location "-- Select --", header "(97) Records Found" (97 > 1). | PASS | DEV-004 | EVD-139, EVD-140, EVD-150 |
| TC-055 | Not established by approved requirements. | No 4-character prefix was shared by several displayed cards at run time (data churn). Typed "Rahu": 5 suggestions, all "Rahul Das"; no displayed match missing. | Not executed (Exploratory — observed) | TQ-016, TCI-003 | EVD-141, EVD-150 |
| TC-056 | The page URL is still the Directory URL. | Search Peter Mac Anderson; URL noted; card click: URL is still the Directory URL, panel open. | PASS | DEV-001 | EVD-150 |
| TC-057 | The page URL is still the Directory URL. | Panel opened, arrow clicked: panel closed, URL is the Directory URL. | PASS | DEV-001 | EVD-142, EVD-150 |
| TC-058 | The sidebar "Directory" item is highlighted as the active item. | Sidebar "Directory" clicked: it is the only active menu item (class "oxd-main-menu-item active"). | PASS | DEV-001 | EVD-143, EVD-150 |

### 4.1 Execution detail

Step-level observations for every case, with timestamps and the data chosen at execution time, are recorded in EVD-150 (one entry per case, in run order). Test data selected at execution time:

- DATA-001: demo credentials displayed on the login page (values not recorded)
- DATA-002: "Timothy Lewis Amiano" (prefix "Timo")
- DATA-003: Job Title "QA Engineer"
- DATA-004 / DATA-015: Location "Texas R&D" (4 records at run time)
- DATA-005: QA Engineer + New York Sales Office (no match, from single-filter results)
- DATA-006: "zzqxv"
- DATA-007: "Ranga Akunuri" (no location)
- DATA-008 / DATA-009: "Peter Mac Anderson"
- DATA-011: 266-character string, "!@#$%^&*", "<b>x</b>", "0000"
- DATA-012: Software Engineer + Texas R&D (TC-011); Chief Financial Officer + New York Sales Office (TC-054)
- DATA-014: not available at run time (TCI-003); "Rahu" used for observation

## 5. Failure Analysis

None. No case failed.

> A FAIL is not automatically a bug. Only supported APPLICATION_DEFECT failures produce bug reports.

## 6. Blocked Cases

None in the current results.

_History:_ TC-024 was BLOCKED under TestCases v1.3.0 (deviation required: after Search the suggestion list stays closed and step 2 could not be performed; EVD-089, EVD-150, EVD-151, EVD-152). TestCases v1.4.0 added a step that reopens the list; TC-024 was re-executed on 2026-10-18 and passed (EVD-153, EVD-154).

TC-054 attempt 1 hit an HTTP 500 after login (environment, PR-006); the case was re-executed from step 1 and passed (DEV-004).

TC-024 re-check (2026-10-18, 08:53 – 08:54Z, under the then-current approvals EVT-0029 / EVT-0031): step 1 gave "Invalid" and closed the suggestion list; with the text unchanged, a click, ArrowDown, a double-click, Alt+ArrowDown and Tab / Shift+Tab + ArrowDown did not reopen it (EVD-151, EVD-152). Status at that time: BLOCKED (superseded by the v1.4.0 re-execution above).

## 7. Test Case Issues

| ID | Case | Type | Description | Step | Consequence | Recommended action |
|---|---|---|---|---|---|---|
| TCI-001 | — | Incorrect assumption | The common precondition "click Reset first if any filter is set" does not clear unselected text typed in Employee Name. | Precondition | Following it literally can leave old text in the field (TC-018 attempt 1). | Revise via Test Design: establish defaults by reloading the Directory page, or state that unselected name text must be cleared. |
| TCI-002 | TC-024 | Unexecutable | After Search shows "Invalid" the suggestion list is closed, and step 2 gives no action that reopens it. | 2 | TC-024 BLOCKED under v1.3.0. | Revise via Test Design: add a step that reopens the list (TC-025 showed that retyping the text reopens it). **Resolved:** TestCases v1.4.0 (EVT-0034, approved EVT-0037); TC-024 PASS on re-execution. |
| TCI-003 | TC-055 | Missing data | DATA-014 (4-character prefix shared by several displayed first names) was not available at run time because the shared data changed. | 1 | Observation made with a prefix matching one displayed name and several hidden employees. | Re-run when such a prefix exists, or define DATA-014 against the suggestion list instead of displayed cards. |
| TCI-004 | — | Missing test case | No case covers Reset when Employee Name holds unselected text (see PR-002). | — | The behaviour is not covered by an approved expected result. | Add a case (Exploratory until the expected behaviour is decided) via Test Design. |

### Deviations

| ID | Case | Step | Original step | Deviation | Reason | Consequence | Performed? |
|---|---|---|---|---|---|---|---|
| DEV-001 | TC-018 and later cases with the precondition | Precondition | Directory page open (sidebar "Directory"). Filters at defaults: click Reset first if any filter is set. | Defaults established by clicking the sidebar "Directory" item (page reload) instead of Reset. | Reset does not clear unselected Employee Name text (EVD-074), so Reset cannot establish the precondition. | None on the tested behaviour; the precondition text itself names the sidebar path. | Yes (incidental) |
| DEV-002 | TC-024 | 2 | Select the employee's suggestion from the list. | Would require editing the Employee Name text to reopen the suggestion list. | After Search the list closes and does not reopen on click or ArrowDown. | Changes the steps; not performed; TC-024 BLOCKED. | No (substantive) |
| DEV-003 | TC-030 | 1 | Enter each DATA-011 value in turn (256-character string). | A 266-character string was entered (a first try had 253). | Executor miscount. | Exploratory only; the length partition above 100 characters is still covered. | Yes (incidental) |
| DEV-004 | TC-054 | 1 | Open the Directory URL and log in with the demo account (DATA-001). | Case re-executed from step 1 (attempt 2) after an HTTP 500 at login in attempt 1. | Environment error (shared demo site; data total changed 307 -> 95 at the same time). | Result is from attempt 2; attempt 1 reported in the Problem Review. | Yes (incidental) |

Tooling note: from TC-037 onward some step sequences (mouse-wheel scrolling, repeated search set-up, timing samples) were sent as single Playwright input sequences through `browser_run_code_unsafe`. Only user-equivalent input (typing, clicking, wheel, navigation) and read-only reads were used; no page state was modified by script.

## 8. Bugs Raised

Candidate bug reports written at the human's instruction (journal EVT-0035) for every Suspected Issue in `execution/ExecutionProblemReview.md`.
**All are Suspected, none Confirmed:** no executed case failed; each comes from an Exploratory observation or a case precondition, and its expected
behavior requires confirmation. Details in `bugs/BugReports.md`.

| Bug | Title | Classification | Problem Review | Affected cases | Severity | Priority | Status |
|---|---|---|---|---|---|---|---|
| BUG-001 | Results header shows "No Records Found" while the unfiltered list is loading | Suspected | PR-001 | TC-050 | Low | Medium | Open |
| BUG-002 | Reset does not clear unselected text in Employee Name | Suspected | PR-002 | TC-014, TC-018 | Medium | Medium | Open |
| BUG-003 | Selected employee name shows two spaces when there is no middle name | Suspected | PR-003 | TC-028 | Low | Low | Open |
| BUG-004 | Copy icons in the employee detail panel are never visible | Suspected | PR-004 | TC-046 | Low | Low | Open |
| BUG-005 | "Should not exceed 100 characters" stays visible after the text is shortened | Suspected | PR-005 | TC-030 | Low | Low | Open |

PR-006 – PR-008 (environment / test data) are not bugs. TC-024 (TCI-002) is a test case issue, not a bug.

## 9. Coverage

### Approved vs executed

| Metric | Count | Cases |
|---|---|---|
| Approved (active) | 58 | TC-001 – TC-058 |
| Executed | 40 | all non-Exploratory cases |
| Passed | 40 | TC-001, TC-002, TC-003, TC-004, TC-005, TC-006, TC-007, TC-008, TC-009, TC-010, TC-011, TC-012, TC-013, TC-014, TC-015, TC-017, TC-018, TC-019, TC-020, TC-021, TC-022, TC-023, TC-024, TC-025, TC-026, TC-034, TC-035, TC-036, TC-037, TC-038, TC-041, TC-042, TC-043, TC-044, TC-045, TC-048, TC-054, TC-056, TC-057, TC-058 |
| Failed | 0 | — |
| Blocked | 0 | — |
| Not executed | 18 | TC-016, TC-027, TC-028, TC-029, TC-030, TC-031, TC-032, TC-033, TC-039, TC-040, TC-046, TC-047, TC-049, TC-050, TC-051, TC-052, TC-053, TC-055 (Exploratory, observed) |

### Source coverage (from TestCases traceability)

| Source | Test cases | Executed | PASS | FAIL | BLOCKED | Bugs |
|---|---|---|---|---|---|---|
| OBS-001 | TC-001, TC-054 | 2 | 2 | 0 | 0 | — |
| OBS-003 | TC-002, TC-003, TC-054, TC-058 | 4 | 4 | 0 | 0 | — |
| OBS-004 | TC-004, TC-005 | 2 | 2 | 0 | 0 | — |
| OBS-005 | TC-006 | 1 | 1 | 0 | 0 | — |
| OBS-006 | TC-007 | 1 | 1 | 0 | 0 | — |
| OBS-007 | TC-008 | 1 | 1 | 0 | 0 | — |
| OBS-008 | TC-009, TC-034, TC-036 | 3 | 3 | 0 | 0 | — |
| OBS-009 | TC-010, TC-035 | 2 | 2 | 0 | 0 | — |
| OBS-010 | TC-011, TC-052, TC-053, TC-054 | 2 | 2 | 0 | 0 | — |
| OBS-011 | TC-012, TC-013 | 2 | 2 | 0 | 0 | — |
| OBS-012 | TC-014, TC-015, TC-054 | 3 | 3 | 0 | 0 | BUG-002 |
| OBS-013 | TC-017, TC-018, TC-019, TC-055 | 3 | 3 | 0 | 0 | BUG-002 |
| OBS-014 | TC-022, TC-023, TC-024, TC-027 | 3 | 3 | 0 | 0 | — |
| OBS-015 | TC-025, TC-031 | 1 | 1 | 0 | 0 | — |
| OBS-016 | TC-020, TC-021, TC-024, TC-028 | 3 | 3 | 0 | 0 | BUG-003 |
| OBS-017 | TC-026, TC-027 | 1 | 1 | 0 | 0 | — |
| OBS-018 | TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-047, TC-054, TC-056, TC-057 | 8 | 8 | 0 | 0 | BUG-004 |
| OBS-019 | TC-036, TC-037, TC-038, TC-039 | 3 | 3 | 0 | 0 | — |
| OBS-020 | TC-048, TC-049 | 1 | 1 | 0 | 0 | — |
| OBS-022 | TC-050 | 0 | 0 | 0 | 0 | BUG-001 |
| PC BR-006 | TC-004 | 1 | 1 | 0 | 0 | — |
| PC DEP-001 | TC-001, TC-002 | 2 | 2 | 0 | 0 | — |
| PC DEP-002 | TC-001, TC-002 | 2 | 2 | 0 | 0 | — |
| PC DEP-006 | TC-001 | 1 | 1 | 0 | 0 | — |
| PC SA-001 | TC-001, TC-002, TC-003, TC-048, TC-049, TC-054, TC-058 | 6 | 6 | 0 | 0 | — |
| PC SA-002 | TC-005, TC-014, TC-016, TC-017, TC-018, TC-019, TC-020, TC-022, TC-023, TC-024, TC-025, TC-026, TC-027, TC-028, TC-029, TC-030, TC-031, TC-032, TC-052, TC-053, TC-055 | 11 | 11 | 0 | 0 | BUG-002, BUG-003, BUG-005 |
| PC SA-003 | TC-005, TC-006, TC-007, TC-008, TC-009, TC-010, TC-011, TC-014, TC-033, TC-051, TC-052, TC-053, TC-054 | 9 | 9 | 0 | 0 | BUG-002 |
| PC SA-004 | TC-009, TC-010, TC-012, TC-013, TC-015, TC-016, TC-020, TC-021, TC-036, TC-037, TC-038, TC-039, TC-040, TC-050, TC-051, TC-054 | 11 | 11 | 0 | 0 | BUG-001 |
| PC SA-005 | TC-034, TC-035, TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-047, TC-054, TC-056, TC-057 | 10 | 10 | 0 | 0 | BUG-004 |
| PC SA-006 | TC-004 | 1 | 1 | 0 | 0 | — |
| PRD FR-022 | TC-005, TC-014, TC-016, TC-017, TC-018, TC-019, TC-020, TC-022, TC-023, TC-024, TC-025, TC-026, TC-027, TC-028, TC-029, TC-030, TC-031, TC-032, TC-052, TC-053, TC-055 | 11 | 11 | 0 | 0 | BUG-002, BUG-003, BUG-005 |
| PRD FR-023 | TC-005, TC-006, TC-007, TC-008, TC-009, TC-010, TC-011, TC-014, TC-033, TC-051, TC-052, TC-053, TC-054 | 9 | 9 | 0 | 0 | BUG-002 |
| PRD FR-024 | TC-009, TC-010, TC-012, TC-013, TC-015, TC-016, TC-020, TC-021, TC-036, TC-037, TC-038, TC-039, TC-040, TC-050, TC-051, TC-054 | 11 | 11 | 0 | 0 | BUG-001 |
| PRD FR-025 | TC-034, TC-035, TC-041, TC-042, TC-043, TC-044, TC-045, TC-046, TC-047, TC-054, TC-056, TC-057 | 10 | 10 | 0 | 0 | BUG-004 |
| PRD FR-026 | TC-004 | 1 | 1 | 0 | 0 | — |