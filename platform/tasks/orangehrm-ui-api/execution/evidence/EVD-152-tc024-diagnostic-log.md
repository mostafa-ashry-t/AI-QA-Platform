# EVD-152 — TC-024 step-2 diagnostic log (2026-10-18)

Executor transcription of a Playwright MCP session in a visible browser. Timestamps (UTC) are the tool's snapshot / screenshot
file times. Credentials were typed from the application's login page (DATA-001) and are not recorded: [REDACTED: password].

Basis: TestCases.md v1.3.0 (approved EVT-0029) and TestReview.md v1.2.0 (approved EVT-0031), both current at the time of this
session. Purpose: determine why TC-024 step 2 ("Select the employee's suggestion from the list.") cannot be performed (TCI-002).

| Time (UTC) | Action | Observation |
|---|---|---|
| 08:53:14 | Opened https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory (no session) | Redirected to the login page |
| 08:53:25 | Logged in with the demo account (DATA-001) | Directory page |
| 08:53:29 | Waited for the results header | "(142) Records Found"; filter panel displayed collapsed |
| 08:53:38 | Clicked the filter panel toggle | Employee Name, Job Title, Location ("-- Select --"), Reset, Search displayed |
| 08:53:44 | Typed "Timo" in Employee Name (character by character) | — |
| 08:53:47 | Waited for suggestions | Suggestion "Timothy Lewis Amiano" displayed |
| 08:53:48 | Clicked Search without selecting (TC-024 step 1) | "Invalid" under Employee Name; suggestion list closed; field value "Timo" |
| 08:53:53 | Clicked in the Employee Name field; waited 2 s | No suggestion list (no listbox, 0 options); "Invalid" still displayed; value "Timo" |
| 08:54:01 | Pressed ArrowDown; waited 2 s | Same: no list; "Invalid"; value "Timo" |
| 08:54:06 | Double-clicked the field (text selected) | — |
| 08:54:08 | Pressed Alt+ArrowDown; waited 2 s | Same: no list; "Invalid"; value "Timo" |
| 08:54:15 | Pressed Tab, then Shift+Tab (focus back in the field), then ArrowDown; waited 2 s | Same: no list; "Invalid"; value "Timo"; focus in Employee Name |
| 08:54:23 | Screenshot | EVD-151 |

List / message state was read with a read-only evaluate (presence of `[role=listbox]`, `[role=option]` texts, the field's error
message text and input value). No script changed the page.

Result: with the text unchanged, no user action reopened the suggestion list, so TC-024 step 2 as written in v1.3.0 cannot be
performed. TC-024 stays BLOCKED (same as the 2026-10-15 attempt, EVD-089). Test Design v1.4.0 (Draft, journal EVT-0034) adds a
step that deletes and retypes the last character to reopen the list.

Browser console during the session: one VERBOSE DOM entry on the login page (autocomplete attribute suggestion); nothing else.
