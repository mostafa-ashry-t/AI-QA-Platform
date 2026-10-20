# EVD-154 — TC-024 execution log, TestCases v1.4.0 (2026-10-18)

Executor transcription of a Playwright MCP session in a visible browser. Times (UTC) are the tool's snapshot / screenshot file
times and in-page `new Date()` reads. Credentials were typed from the application's login page (DATA-001) and are not recorded:
[REDACTED: password].

Basis: TestCases.md v1.4.0 (approved EVT-0037) and TestReview.md v1.3.0 (approved EVT-0039). Case: TC-024 "Selecting a suggestion
clears the "Invalid" message". Expected result (verbatim): The "Invalid" message is no longer displayed under Employee Name.

| Time (UTC) | Step | Action | Observation |
|---|---|---|---|
| 09:39:40 | Precondition | Opened https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory (no session) | Redirected to the login page |
| 09:39:49 | Precondition | Logged in with the demo account (DATA-001) | Directory page, "Records Found" header displayed |
| 09:39:58 | Precondition | Clicked the sidebar "Directory" item; waited for the header | "(169) Records Found", 14 cards; Employee Name empty, Job Title and Location "-- Select --" (filters at defaults; no Reset needed) |
| 09:39:58 | Test data | Read the displayed card names (read-only) | DATA-002 = "Timothy Lewis Amiano": first name 7 characters, prefix "Timo" contains upper-case "T", no other displayed first name begins with "Timo" |
| 09:40:06 | 1 | Typed "Timo" character by character | Suggestion "Timothy Lewis Amiano" displayed |
| 09:40:09 | 1 | Clicked Search without selecting | — |
| 09:40:10 | 1 | Read state (read-only) | "Invalid" under Employee Name; no suggestion list; value "Timo" |
| 09:40:18 | 2 | Clicked in the field; pressed End, Backspace, then typed "o" | — |
| 09:40:20 | 2 | Read state after 2 s (read-only) | Suggestion list open with one option "Timothy Lewis Amiano"; "Invalid" still displayed; value "Timo" |
| 09:40:29 | 3 | Clicked the suggestion "Timothy Lewis Amiano" | — |
| 09:40:30 | 3 | Read state after 1 s (read-only) | No "Invalid" message (0 error messages); field value "Timothy Lewis Amiano"; field has no error class; list closed |
| 09:40:32 | — | Screenshot | EVD-153 |

State was read with a read-only evaluate (`[role=listbox]`, `[role=option]` texts, `.oxd-input-field-error-message` texts, the
input value and class). No script changed the page.

Result: PASS. Every step was performed exactly as written in v1.4.0, and the expected result was observed.

Browser console during the session: one VERBOSE DOM entry on the login page (autocomplete attribute suggestion); nothing else.
