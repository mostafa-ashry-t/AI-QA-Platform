# Exploration Report

> Produced by the `exploration` skill (v1.0.0, prompt `exploration` v1.0.0) through
> Playwright MCP, used for browser access only, not automation. It records what
> was **observed**. Behavior that ProjectContext does not document is a GAP, not a
> requirement, and a POTENTIAL BUG is unconfirmed.
>
> `ProjectContext (PROJECT_CONTEXT_APPROVED) → Exploration → HARD STOP → EXPLORATION_APPROVED → Test Design`

## 1. Exploration Information

| Field | Value |
|---|---|
| Task ID | `orangehrm-ui-api` |
| Task Name | `OrangeHRM UI & API QA assignment` (scope: Directory UI only; see PC GAP-010) |
| Project Name | `OrangeHRM` |
| Environment | not stated (TaskContext §2: `not provided`). Observed: public demo site, footer "OrangeHRM OS 5.9" |
| Application URL | https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory · API: not in scope (PC BR-002) |
| Workflow Run ID | `RUN-001` |
| Exploration started | 2026-10-15T09:11:57Z |
| Exploration ended | 2026-10-15T09:21:31Z |
| Report version | 1.1.0 |
| Status | Approved (`EXPLORATION_APPROVED`, journal EVT-0015) |
| Skill version | exploration v1.0.0 |
| Prompt version | exploration v1.0.0 |
| Baseline | `context/ProjectContext.md` (approved, SHA-256 `0b0dcc57d5fc887e8e3c2b0e1f74d0934841430958a2ba3da8f52258d55f24de`) |

### Revision History

| Version | Date (UTC) | Reason | Changed sections | Re-exploration performed |
|---|---|---|---|---|
| 1.0.0 | 2026-10-15 | Initial exploration (stage attempt 3; attempts 1–2 failed with EX-E13 and produced no report) | All | n/a |
| 1.1.0 | 2026-10-15 | Pre-approval review (journal EVT-0013): each claim was re-checked against its evidence. Wording that went beyond the evidence was corrected (OBS-003, OBS-015, OBS-018, OBS-019, OBS-020), and the OBS-022 / PB-001 timing was corrected. Redacted login evidence was added (EVD-045, EVD-046) for OBS-001 and OBS-002. Uncovered scenarios are now listed explicitly. Classifications unchanged | §1, §4, §5, §8, §9, §10, §12, §13, §14 | No (evidence re-checked and re-filed from existing tool output; no new browser session) |

## 2. Exploration Scope

### Exploration plan

Built from ProjectContext §12. ProjectContext documents **no** Directory behavior
(PC GAP-001), so the plan compares against what is documented (assumptions, gaps,
open questions) and follows the user's agreed checklist (journal EVT-0010):
navigation, Employee Name, Job Title, Location, Search, Reset, employee results,
filter combinations and relevant edge cases. Per PC OQ-013, that checklist was used
as **guidance only**, not as a baseline.

| Area (PC SA) | Expected behaviors / rules to compare | Flow to follow | Data needed | Status |
|---|---|---|---|---|
| PC SA-001 Directory page access | PC AS-003; PC OQ-002, PC OQ-011; PC RK-004 | Open Directory URL; observe access requirement; sidebar navigation | An account, if required (none supplied) | Explored |
| PC SA-002 Directory search | PC GAP-001, PC GAP-004, PC GAP-005, PC OQ-010 | Employee Name: partial, case, spaces, no match, typed-not-selected, suggestion selected; Search | Existing employee names (observed on page) | Explored |
| PC SA-003 Directory filters | PC GAP-001, PC GAP-004, PC GAP-005, PC OQ-010 | Job Title and Location options; single filter; combinations; Reset; panel toggle | Existing job titles / locations (observed) | Explored (partially: not every option searched) |
| PC SA-004 Employee results | PC GAP-001, PC GAP-004, PC OQ-012 | Results count, cards, empty state, loading more results | — | Explored |
| PC SA-005 Displayed employee information | PC GAP-001, PC GAP-004, PC OQ-012 | Card content; card click / detail view | — | Explored |
| PC SA-006 Exploration and scope finalization | PC BR-006, PC GAP-004 | Verify the actual control list | — | Explored |

QA-process rules applied throughout (not application behavior): PC BR-001 (Directory
only), PC BR-002 (no API exploration), PC BR-016 (no credentials recorded).

### Areas and flows explored

- Unauthenticated access to the Directory URL and the login redirect (SA-001).
- Directory page layout, sidebar item, header, filter panel and its collapse toggle (SA-001, SA-006).
- Employee Name autocomplete: partial name, lower case, leading/trailing spaces, non-matching text, typed-but-not-selected text, selected suggestion (SA-002).
- Job Title and Location option lists; Location only; Job Title only; Job Title + Location (match and no-match); Reset (SA-003).
- Results count wording, cards, empty state, info toast, incremental loading on scroll (SA-004).
- Card content and the employee detail panel opened by clicking a card (SA-005).

### Areas intentionally not explored

| Area | Reason |
|---|---|
| All OrangeHRM modules other than Directory (Admin, PIM, Leave, Time, Recruitment, My Info, Performance, Dashboard, Maintenance, Claim, Buzz) | Out of scope per PC §3, PC BR-001 |
| API behavior (direct requests and network traffic) | Out of scope per PC BR-002; user instruction "Do not test APIs" |
| PC SA-007 – SA-010 | Later stages (test design, execution, automation, deliverables) |

### Out-of-scope areas followed as dependencies

| Area | Why it was necessary | Related in-scope flow |
|---|---|---|
| Login page (`/web/index.php/auth/login`) | The Directory URL redirected to it; logging in was required to reach the Directory (OBS-001). Used only to log in. | PC SA-001 |

## 3. Environment

| Item | Value | Source |
|---|---|---|
| Application URL | https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory | PRD UIR-002; user message (EVT-0010) |
| Environment | not stated; public demo instance, footer "OrangeHRM OS 5.9" | TaskContext §2; observed (login page) |
| Browser / MCP server | Playwright MCP `playwright` (`npx @playwright/mcp@latest --output-dir .playwright-mcp`), visible (headed) browser; browser name and version not reported by the tool | `.mcp.json`; tool output |
| Viewport | about 1920 px wide (from screenshot dimensions); not configured | screenshots |
| Account used | Demo account displayed on the login page; use confirmed by the user in-session (2026-10-15). Credentials are not recorded (PC BR-016) | user confirmation |
| Exploration date/time | 2026-10-15T09:11:57Z – 09:21:31Z | system clock |

## 4. Exploration Method

- The approved ProjectContext (`PROJECT_CONTEXT_APPROVED`, journal EVT-0009) was the expected-behavior baseline.
- Playwright MCP (`playwright` server) was used for browser access as an exploration tool, not as automation. The server was verified first with a `browser_tabs list` call.
- Each planned area was explored, and expected was compared with actual. Each observation received exactly one classification.
- Evidence was captured for every non-MATCH observation, or the reason it could not be captured was recorded.
- Read-only `browser_evaluate` was used to read attributes, option lists, counts and card text. One `browser_run_code_unsafe` call was used only to send mouse-wheel scroll input (a user-equivalent action) and read the card count afterward. No DOM was changed.
- No data-changing action was performed.
- Deviations from the plan:
  - Credentials were not in the task inputs. The application displays demo credentials, and per the skill rule the human was **asked** before they were used (answer: use them).
  - The checklist's "every option" depth was reduced to representative values (see §13).
- v1.1.0 review: every observation was re-checked against its saved evidence. Where a statement went beyond the evidence, it was narrowed to what the evidence shows. No browser session was opened for the revision.

## 5. Observations

| ID | Area | Expected | Actual | Classification | Evidence | Source | Notes |
|---|---|---|---|---|---|---|---|
| OBS-001 | PC SA-001 | Not documented (ProjectContext silent). PC AS-003 only assumes the page is reachable at the URL; whether an account is needed is open (PC OQ-002) | Opening the Directory URL with no session redirected to `https://opensource-demo.orangehrmlive.com/web/index.php/auth/login` (page title "OrangeHRM", heading "Login", fields Username/Password, "Login" button, "Forgot your password?") | GAP | EVD-046 (URL and title), EVD-045 (page structure, redacted), EVD-001 (form screenshot) | none — ProjectContext silent | XGAP-001. Relates to PC GAP-002, PC RK-004, PC AS-003 |
| OBS-002 | PC SA-001 | Not documented (ProjectContext silent). PC DEP-006 / PC OQ-002: which account to use is unanswered | The login page displays a demo username and password in a hint box above the form. They were used after explicit user confirmation | QUESTION | EVD-045 (snapshot with both credential values redacted) | none — ProjectContext silent | XQ-001. EVD-044 (v1.0.0, not captured) is superseded by EVD-045 |
| OBS-003 | PC SA-001 | Not documented (ProjectContext silent) | After login the application returned to the originally requested Directory URL. Header title "Directory"; sidebar item "Directory" (href `/web/index.php/directory/viewDirectory`) highlighted with class `active`; page title "OrangeHRM". Clicking the sidebar "Directory" link loaded the same URL; afterwards all filters were empty. They were already empty before the click (Reset at 09:19Z), so this does not show that navigation clears filters | GAP | EVD-002, EVD-035, EVD-036, EVD-037 | none — ProjectContext silent | XGAP-002. Relates to PC OQ-011 |
| OBS-004 | PC SA-006 | Not documented: PC GAP-004 says the controls are unverified | Filter panel titled "Directory" contains exactly: **Employee Name** (text input, placeholder "Type for hints..."), **Job Title** (dropdown, default "-- Select --"), **Location** (dropdown, default "-- Select --"), **Reset** (`type="reset"`), **Search** (`type="submit"`). No other search or filter control is present. No control has an `id` | GAP | EVD-002, EVD-003 | none — ProjectContext silent | XGAP-003. Input for PC GAP-004 / PC GAP-005 / PC OQ-010 (not resolved here) |
| OBS-005 | PC SA-003 | Not documented (ProjectContext silent) | Job Title options: "-- Select --" plus 28 values in case-insensitive alphabetical order: Account Assistant, Automaton Tester, Chief Executive Officer, Chief Financial Officer, Chief Technical Officer, Content Specialist, Customer Success Manager, Database Administrator, Finance Manager, Financial Analyst, Head of Support, HR Associate, HR Manager, IT Manager, Network Administrator, Payroll Administrator, Pre-Sales Coordinator, QA Engineer, QA Lead, qwer, rsjsrii, Sales Representative, Social Media Marketer, Software Architect, Software Engineer, Support Specialist, VP - Client Services, VP - Sales & Marketing | GAP | EVD-004, EVD-005 | none — ProjectContext silent | XGAP-004. Values such as "qwer" and "rsjsrii" suggest the list comes from shared, editable demo data (see OBS-021) |
| OBS-006 | PC SA-003 | Not documented (ProjectContext silent) | Location options: "-- Select --", Canadian Regional HQ, HQ - CA, USA, New York Sales Office, Texas R&D | GAP | EVD-006, EVD-007 | none — ProjectContext silent | XGAP-005 |
| OBS-007 | PC SA-002, PC SA-003 | Not documented (ProjectContext silent) | Selecting a dropdown value does not change the results. The count stayed "(130) Records Found" until **Search** was clicked | GAP | EVD-043, EVD-008 | none — ProjectContext silent | XGAP-006 |
| OBS-008 | PC SA-004, PC SA-005 | Not documented (ProjectContext silent) | Location "Texas R&D" + Search → "(2) Records Found". Each card shows: name, profile picture, job title, sub-unit ("Human Resources"), location ("Texas R&D") with a location-pin icon | GAP | EVD-008, EVD-009 | none — ProjectContext silent | XGAP-007 |
| OBS-009 | PC SA-003, PC SA-005 | Not documented (ProjectContext silent) | Job Title "HR Manager" alone + Search → "(2) Records Found". One card shows job title, sub-unit and location; the other shows job title and sub-unit only (no location line). In the unfiltered list, many cards show only a name and a placeholder picture | GAP | EVD-038, EVD-039, EVD-002 | none — ProjectContext silent | XGAP-008. Displayed fields depend on the employee's data |
| OBS-010 | PC SA-003 | Not documented (ProjectContext silent) | Filters combine as AND: Job Title "HR Manager" + Location "Texas R&D" → "(1) Record Found" (the only employee in both single-filter results) | GAP | EVD-040, EVD-041, EVD-038, EVD-008 | none — ProjectContext silent | XGAP-009 |
| OBS-011 | PC SA-004 | Not documented (ProjectContext silent) | Job Title "QA Engineer" + Location "Texas R&D" → header text "No Records Found", no cards, and an info toast "Info / No Records Found" (present in the DOM right after the search; no longer visible when the screenshot was taken) | GAP | EVD-010, EVD-011 | none — ProjectContext silent | XGAP-010 |
| OBS-012 | PC SA-002, PC SA-003 | Not documented (ProjectContext silent) | **Reset** cleared Employee Name and set both dropdowns back to "-- Select --", and reloaded the unfiltered results ("(137) Records Found", 14 cards) without clicking Search | GAP | EVD-012, EVD-013 | none — ProjectContext silent | XGAP-011 |
| OBS-013 | PC SA-002 | Not documented (ProjectContext silent) | Employee Name offers autocomplete suggestions while typing. "Sara" → suggestion "Sara Tencrady"; "sara" (lower case) → same suggestion; "␠␠Sara␠␠" (leading/trailing spaces) → same suggestion | GAP | EVD-014, EVD-015, EVD-018, EVD-024 | none — ProjectContext silent | XGAP-012. Suggestions are not case-sensitive and ignore surrounding spaces |
| OBS-014 | PC SA-002 | Not documented (ProjectContext silent) | Typing "Sara" **without** selecting a suggestion and clicking Search shows the message **"Invalid"** under the field (red border). The search is not performed: the results stay at "(137) Records Found". A partial or free-text name is not accepted as a search value | GAP | EVD-016, EVD-017 | none — ProjectContext silent | XGAP-013 |
| OBS-015 | PC SA-002 | Not documented (ProjectContext silent) | After a failed search, "Invalid" stayed visible while new text was typed ("sara"). Later, with unselected text ("␠␠Sara␠␠") in the field and no message shown, pressing Escape and then clicking a result card left "Invalid" displayed under the field. Which of the two actions triggered it was not isolated | GAP | EVD-018, EVD-026 | none — ProjectContext silent | XGAP-014 |
| OBS-016 | PC SA-002, PC SA-004 | Not documented (ProjectContext silent) | Selecting the suggestion "Sara Tencrady" clears "Invalid" and fills the field with "Sara␠␠Tencrady" (two spaces). Search → "**(1) Record Found**" (singular wording) and one card: Sara Tencrady / Payroll Administrator / Human Resources / Texas R&D | GAP | EVD-019, EVD-020, EVD-021 | none — ProjectContext silent | XGAP-015 |
| OBS-017 | PC SA-002 | Not documented (ProjectContext silent) | Non-matching text "zzqxv" → the suggestion list shows "No Records Found" and no error is shown while typing. The results from the previous search stay displayed | GAP | EVD-022, EVD-023 | none — ProjectContext silent | XGAP-016 |
| OBS-018 | PC SA-005 | Not documented (ProjectContext silent). Whether a detail view outside the module is in scope is PC OQ-012 | Clicking a card opens a **detail panel on the right of the same page** (URL unchanged; no other module opened). The panel shows: an arrow icon, name, profile picture, job title, sub-unit, location, a contact-icon row, "Work Email" with a value and a copy icon, and a QR code image. A "Work Telephone" label exists in the DOM but did not appear in the screenshot, and the value element next to it was empty. After clicking the arrow icon, the panel was no longer present and the URL was unchanged | GAP | EVD-025, EVD-026, EVD-027, EVD-028, EVD-029 | none — ProjectContext silent | XGAP-017. Email value redacted in text evidence |
| OBS-019 | PC SA-004 | Not documented (ProjectContext silent) | No pagination control. 14 cards load first (out of 140). Scrolling the results container with the mouse wheel (6 steps) increased the rendered cards to 42. At measurement time, no element with the classes `oxd-loading-spinner` / `oxd-loading-spinner-container` was present; whether a loader appears during loading was not observed | GAP | EVD-030, EVD-031, EVD-032 | none — ProjectContext silent | XGAP-018 |
| OBS-020 | PC SA-001 | Not documented (ProjectContext silent) | The caret button at the top right of the filter panel collapses the panel (form hidden; icon `bi-caret-down-fill`). It was clicked again and the click succeeded, but the re-expanded state was not captured before the next action reloaded the page | GAP | EVD-033, EVD-034 | none — ProjectContext silent | XGAP-019 |
| OBS-021 | PC SA-004 | Not documented. PC RK-005 / PC GAP-009 / PC OQ-009: data control and environment are undefined | The unfiltered total changed during the 10-minute session: 130 (09:15Z) → 137 (09:17Z) → 140 (09:19Z) → 141 (09:20Z), with no data changed by this exploration. Many records look like generated test data (e.g. repeated "Linda Anderson" and "Linda Anderson_<number>") | QUESTION | EVD-002, EVD-012, EVD-030, EVD-036 | PC RK-005, PC GAP-009 | XQ-002 |
| OBS-022 | PC SA-004 | Not documented (ProjectContext silent) | After clicking the sidebar "Directory" link with no filters set, the results header showed "**No Records Found**". It was seen at 09:20:22Z (a wait for the text "Records Found" matched it) and again in a DOM read completed before 09:20:26Z. A re-check completed between 09:20:35Z and 09:20:40Z showed "(141) Records Found" with 14 cards and empty filters. How long the message stayed visible was not measured | POTENTIAL BUG | EVD-035, EVD-036, EVD-037 | none — ProjectContext silent | PB-001. **Unconfirmed**: observed once, not reproduced |

## 6. MATCHES

None observed. ProjectContext documents no Directory behavior (PC GAP-001), so no
observation has a documented expectation to match.

## 7. FINDINGS

None observed. No observation contradicts a documented ProjectContext expectation.

## 8. GAPS

| ID | Observation | Observed behavior | Missing documented expectation | Impact (if known) | Evidence | Related PC GAP / area |
|---|---|---|---|---|---|---|
| XGAP-001 | OBS-001 | Directory needs an authenticated session; unauthenticated access redirects to login | Whether access requires an account | Every Directory test needs a login precondition | EVD-046, EVD-045, EVD-001 | PC GAP-002, PC RK-004, PC AS-003 / SA-001 |
| XGAP-002 | OBS-003 | Post-login return to the requested URL; sidebar "Directory" item active; sidebar link reloads Directory | Navigation to and within the module | Sets the SA-001 boundary (PC OQ-011 still open) | EVD-002, EVD-035, EVD-036, EVD-037 | PC OQ-011 / SA-001 |
| XGAP-003 | OBS-004 | The actual control set: Employee Name, Job Title, Location, Reset, Search | The Directory controls | Input to finalizing scope (PC BR-006) | EVD-002, EVD-003 | PC GAP-004, PC GAP-005 / SA-006 |
| XGAP-004 | OBS-005 | 28 Job Title options, alphabetical | Job Title values and order | Option list is data-driven and may change | EVD-004, EVD-005 | PC GAP-001, PC GAP-009 / SA-003 |
| XGAP-005 | OBS-006 | 4 Location options | Location values | — | EVD-006, EVD-007 | PC GAP-001 / SA-003 |
| XGAP-006 | OBS-007 | Filters apply only on Search | When results update | — | EVD-043, EVD-008 | PC GAP-001 / SA-002, SA-003 |
| XGAP-007 | OBS-008 | Single Location filter result and card fields | Result content | — | EVD-008, EVD-009 | PC GAP-001 / SA-004, SA-005 |
| XGAP-008 | OBS-009 | Single Job Title filter; card fields vary by employee data | Which fields a card shows | Card assertions must allow for missing fields | EVD-038, EVD-039, EVD-002 | PC GAP-001 / SA-003, SA-005 |
| XGAP-009 | OBS-010 | Filters combine with AND | How filters combine | — | EVD-040, EVD-041, EVD-038, EVD-008 | PC GAP-001 / SA-003 |
| XGAP-010 | OBS-011 | Empty state: "No Records Found" header plus info toast | Empty-result behavior | — | EVD-010, EVD-011 | PC GAP-001 / SA-004 |
| XGAP-011 | OBS-012 | Reset clears all fields and reloads unfiltered results | Reset behavior | — | EVD-012, EVD-013 | PC GAP-001 / SA-002, SA-003 |
| XGAP-012 | OBS-013 | Autocomplete; case-insensitive; surrounding spaces ignored for suggestions | Name search behavior | — | EVD-014, EVD-015, EVD-018, EVD-024 | PC GAP-001 / SA-002 |
| XGAP-013 | OBS-014 | Unselected free text → "Invalid", no search | Name validation | Partial-name searching is only possible via a suggestion | EVD-016, EVD-017 | PC GAP-001 / SA-002 |
| XGAP-014 | OBS-015 | "Invalid" persists while retyping; it appeared after Escape followed by a card click with unselected text (trigger not isolated) | When the validation message appears and clears | — | EVD-018, EVD-026 | PC GAP-001 / SA-002 |
| XGAP-015 | OBS-016 | Selected suggestion → single result; "(1) Record Found"; field text has two spaces | Selected-name search and count wording | — | EVD-019, EVD-020, EVD-021 | PC GAP-001 / SA-002, SA-004 |
| XGAP-016 | OBS-017 | Non-matching text → "No Records Found" in suggestions; old results remain | No-match name behavior | — | EVD-022, EVD-023 | PC GAP-001 / SA-002 |
| XGAP-017 | OBS-018 | Card click → in-page detail panel with contact details and QR code; panel gone after clicking the arrow icon | Displayed employee information | The detail panel is within the Directory page; PC OQ-012 still needs an answer on scope | EVD-025 – EVD-029 | PC GAP-001, PC OQ-012 / SA-005 |
| XGAP-018 | OBS-019 | Incremental loading on scroll; no pagination | How further results load | — | EVD-030, EVD-031, EVD-032 | PC GAP-001 / SA-004 |
| XGAP-019 | OBS-020 | Filter panel collapses via the toggle (re-expanded state not captured) | Panel layout behavior | — | EVD-033, EVD-034 | PC GAP-001 / SA-001 |

## 9. QUESTIONS

| ID | Observation | Behavior | Why clarification is required | Evidence | Related PC OQ / rule | Owner |
|---|---|---|---|---|---|---|
| XQ-001 | OBS-002 | The application itself displays demo credentials, which were used with in-session user confirmation | PC OQ-002 asks which account to use. Is the displayed demo account the sanctioned account for test design and execution, or should another role/account be used? Role-dependent Directory behavior was not explored | EVD-045 (redacted) | PC OQ-002, PC DEP-006, PC BR-016 | not stated |
| XQ-002 | OBS-021 | The shared demo dataset changes during a session (130 → 141 in about 5 minutes) and contains generated-looking records | Expected counts and names cannot be fixed values. Which data baseline should test design rely on (e.g. relative assertions, or a controlled environment)? | EVD-002, EVD-012, EVD-030, EVD-036 | PC RK-005, PC GAP-009, PC OQ-009 | not stated |

## 10. POTENTIAL BUGS

> Suspected, not confirmed. Formal bug reporting belongs to a later stage.

### PB-001 (OBS-022) — temporary "No Records Found" after navigation

> **Status: unconfirmed potential bug.** Observed once and not reproduced. This is
> not a confirmed defect and no bug report has been raised. Confirmation is a human
> decision; formal bug reporting belongs to a later stage.

- **Expected behavior:** Not documented (ProjectContext silent). No expectation is asserted here.
- **Actual behavior:**
  1. 09:20:21Z: sidebar "Directory" link clicked; all filters empty.
  2. 09:20:22Z: a wait for the text "Records Found" matched **"No Records Found"**.
  3. DOM read completed before 09:20:26Z: the results header still showed "No Records Found" (EVD-035).
  4. Re-check completed between 09:20:35Z and 09:20:40Z: "(141) Records Found", 14 cards, filters empty, no toast (EVD-036, EVD-037).
- **Not observed:** how long the message stayed visible (it was gone by the re-check; the exact moment is unknown), whether a loading indicator was shown at the same time, and the network timing (API traffic is out of scope).
- **Reason for suspicion:** In two separate reads (09:20:22Z and one completed before 09:20:26Z), the page told the user that no records exist. Later, 141 records were available with the same (empty) filters. The page showed incorrect information, not just an undocumented behavior. One possible explanation is a loading state rendered as an empty state, but this is not established.
- **Evidence:** EVD-035 (DOM read: "No Records Found"), EVD-036 (DOM re-check: "(141) Records Found"), EVD-037 (screenshot of the re-check state). No screenshot of the "No Records Found" state itself was captured.
- **What would confirm it:**
  - Repeat the sidebar navigation (and a page reload) several times.
  - Capture the header text with timestamps, or a screen recording, from the click until the cards appear.
  - Check whether the message also appears on first load and after Reset.
  - The reviewer then decides whether a transient "No Records Found" during loading is acceptable.

## 11. Candidate Locators

> For the automation stage. Observed attribute values only: no Playwright locator syntax, no MCP snapshot refs, no automation code.
> No element in the Directory filter panel or results has an `id`. `data-v-*`
> attributes are framework build hashes and are not recommended as stable anchors.

| ID | Element | Page / URL | Stable `id` | Attribute usable for XPath | Locator notes | Stability observations | Related OBS / EVD |
|---|---|---|---|---|---|---|---|
| LOC-001 | Employee Name input | Directory | none | `placeholder="Type for hints..."` | The only `input` in the filter form; label "Employee Name" is a separate `label` element (`class="oxd-label"`) | Placeholder text is UI text (may be localized) | OBS-004, OBS-013 / EVD-003 |
| LOC-002 | Job Title dropdown | Directory | none | `class="oxd-select-text-input"` (1st of 2), `tabindex="0"` | Not unique by class; disambiguate by label text "Job Title" | Position-dependent if not anchored to the label | OBS-004, OBS-005 / EVD-003 |
| LOC-003 | Location dropdown | Directory | none | `class="oxd-select-text-input"` (2nd of 2) | Disambiguate by label text "Location" | Position-dependent if not anchored to the label | OBS-004, OBS-006 / EVD-003 |
| LOC-004 | Dropdown list and options | Directory | none | `role="listbox"`, `class="oxd-select-dropdown --positon-bottom"`; options `role="option"` | Present only while a dropdown is open; option identified by text | Class contains the spelling "positon" as observed | OBS-005, OBS-006 / EVD-004, EVD-006 |
| LOC-005 | Employee Name suggestion list | Directory | none | `role="listbox"`, `class="oxd-autocomplete-dropdown --positon-bottom"`; options `role="option"` | Present only while suggestions are shown; "No Records Found" also appears as an option | Content is data-dependent | OBS-013, OBS-017 / EVD-014, EVD-022 |
| LOC-006 | Search button | Directory | none | `type="submit"`, text "Search" | Unique `submit` in the form | — | OBS-004 / EVD-003 |
| LOC-007 | Reset button | Directory | none | `type="reset"`, text "Reset" | Unique `reset` in the form | — | OBS-004, OBS-012 / EVD-003 |
| LOC-008 | Results count text | Directory | none | `span` with `class="oxd-text oxd-text--span"` and text "(N) Records Found" / "(1) Record Found" / "No Records Found" | Class is generic; anchor on the text pattern | Text and number vary (OBS-016, OBS-021) | OBS-004, OBS-011, OBS-016 / EVD-003, EVD-010, EVD-020 |
| LOC-009 | Result card and its fields | Directory | none | Card `class` contains `orangehrm-directory-card`; name `p` with `orangehrm-directory-card-header`; job title `orangehrm-directory-card-subtitle`; sub-unit/location `orangehrm-directory-card-description` | Repeated element; identify a card by its header text | Some fields hidden (`display: none`) when the employee has no value | OBS-008, OBS-009 / EVD-003 |
| LOC-010 | Employee Name validation message | Directory | none | `span` with class containing `oxd-input-field-error-message`, text "Invalid" | Appears below the field | — | OBS-014, OBS-015 / EVD-016 |
| LOC-011 | Employee detail panel | Directory | none | `class="orangehrm-corporate-directory-sidebar"`; close icon `i` with `class="oxd-icon bi-arrow-right"`; QR image `class="orangehrm-qr-code"` | Present only after a card click | — | OBS-018 / EVD-027 |
| LOC-012 | Filter panel toggle | Directory | none | `button` with `class="oxd-icon-button"` inside the element with class `oxd-table-filter-header`; icon class `bi-caret-down-fill` when collapsed | One such button in the header | Icon class while expanded was not captured | OBS-020 / EVD-003, EVD-033 |
| LOC-013 | Sidebar "Directory" menu item | All pages (side panel) | none | `href="/web/index.php/directory/viewDirectory"`; `class="oxd-main-menu-item active"` on the Directory page | Inside the navigation with `aria-label="Sidepanel"` | `active` class depends on the current page | OBS-003 / EVD-035 |
| LOC-014 | Info toast | Directory | none | class contains `oxd-toast` | Transient | Disappears within seconds | OBS-011 / EVD-010 |
| LOC-015 | Results scroll container | Directory | none | `class="orangehrm-container"` | Scrolling inside it loads more cards | — | OBS-019 / EVD-030, EVD-031 |

## 12. Dependencies Discovered

_Observed only._

| ID | Dependency observed | How it was observed | Documented? (PC DEP-### or "undocumented → OBS-###") | Evidence |
|---|---|---|---|---|
| XDEP-001 | An authenticated session is required to reach the Directory | Unauthenticated URL access redirected to login | Partly: PC DEP-006 (accounts, not provided); requirement itself undocumented → OBS-001 | EVD-046, EVD-045, EVD-001 |
| XDEP-002 | Results depend on Search being clicked after filter values change | Count unchanged until Search | undocumented → OBS-007 | EVD-043, EVD-008 |
| XDEP-003 | Name search depends on selecting an autocomplete suggestion | Unselected text → "Invalid", no search | undocumented → OBS-014 | EVD-016, EVD-017 |
| XDEP-004 | Option lists and results depend on shared, changing demo data | Totals changed during the session; generated-looking values | Partly: PC RK-005, PC GAP-009 → OBS-021 | EVD-002, EVD-004, EVD-036 |

## 13. Coverage Limits

| Type | Item | Reason |
|---|---|---|
| Area not explored | Search with each individual Job Title and Location value | Representative values only (Texas R&D, HR Manager, QA Engineer), to keep exploration scope-driven, not exhaustive |
| Area not explored | Employee Name combined with Job Title / Location | Not performed in this session |
| Area not explored | Employee Name with very long input, special characters, or keyboard selection of suggestions | Not performed in this session |
| Area not explored | Detail-panel actions: copy icons, contact icons, QR code content, Work Telephone value | Not exercised; QR content not decoded |
| Flow not completed | Scrolling to the end of the result list | Stopped after 42 of 140 cards had loaded; the end-of-list behavior was not observed |
| Inaccessible area | Behavior for other roles or non-admin accounts | Only the displayed demo account was used (XQ-001) |
| Unavailable data | Stable expected counts and names | Shared demo data changed during the session (OBS-021, XQ-002) |
| Environment limitation | Browser name and version | Not reported by the Playwright MCP tool; a single desktop viewport (about 1920 px) was used; responsive layouts not explored |
| Environment limitation | API / network traffic | Out of scope (PC BR-002); no network inspection was done |
| Flow not completed | Filter panel re-expanded state | Toggle clicked again, but the state was not captured before the next action reloaded the page (OBS-020) |
| Flow not completed | PB-001 reproduction | Seen once; not repeated, no screenshot of the "No Records Found" state, duration not measured |
| Flow not completed | Loader during incremental loading | Only checked after scrolling had finished (OBS-019) |
| Flow not completed | Trigger of "Invalid" on leaving the field | Escape and the card click were not separated (OBS-015) |
| Plan items (QA-process rules) | PC BR-001, PC BR-002, PC BR-016 | Not application behavior. Complied with during exploration (Directory only; no API; credentials not recorded) |
| Plan items | PC AS-003 | The Directory page loads at the URL, but only after login (OBS-001, OBS-003). The assumption remains for the reviewer to confirm or refine |

### Uncovered scenarios (explicit list)

None of the following was performed. No behavior is claimed for any of them.

| # | Area | Scenario not explored |
|---|---|---|
| U-01 | PC SA-002/003 | Search clicked with all fields empty (from an unfiltered state) |
| U-02 | PC SA-003 | Search with each remaining Job Title value (26 of 28 not searched; only HR Manager and QA Engineer were) and each remaining Location value (3 of 4 not searched) |
| U-03 | PC SA-002/003 | Employee Name combined with Job Title and/or Location |
| U-04 | PC SA-002 | Searching by last name only, middle name, or a multi-word partial name |
| U-05 | PC SA-002 | Very long input, special characters, digits, or script/markup-like text in Employee Name |
| U-06 | PC SA-002/003 | Keyboard-only use: arrow-key/Enter selection of suggestions and dropdown options; type-ahead in dropdowns |
| U-07 | PC SA-002 | Names with several matches (suggestion list ordering and limits) |
| U-08 | PC SA-004 | Scrolling to the end of the list; the final batch; behavior after all 140+ records load |
| U-09 | PC SA-004 | Ordering of result cards (the sort rule was not analyzed) |
| U-10 | PC SA-004 | Whether filters and results persist after a browser refresh or Back navigation |
| U-11 | PC SA-005 | Detail panel for an employee with a work telephone, without an email, or without a photo; copy icons; contact icons; QR code content |
| U-12 | PC SA-005 | Clicking a second card while the panel is open; panel behavior after a new search |
| U-13 | PC SA-001 | Other roles or accounts; logout or session expiry while on the Directory |
| U-14 | PC SA-001 | Responsive / mobile viewports, other browsers, accessibility checks |
| U-15 | PC SA-004 | Reproduction of PB-001 (transient "No Records Found") on first load, reload and after Reset |

### Data changed during exploration

| Action | Data created / changed | Left in environment? |
|---|---|---|
| Login with the displayed demo account | A browser session only; no records created, updated or deleted | No persistent data. Browser closed at 09:21:31Z |

## 14. Exploration Summary

| Classification | Count |
|---|---|
| MATCH | 0 |
| FINDING | 0 |
| GAP | 19 |
| QUESTION | 2 |
| POTENTIAL BUG | 1 |
| **Total observations** | **22** |

Candidate locators: 15 (LOC-001 – LOC-015). Evidence items: 46. Of these, 45 are captured; EVD-044 (not captured) is superseded by the redacted EVD-045.

Coverage limitations: see §13, including the explicit list of 15 uncovered
scenarios (U-01 – U-15). The main limits are representative filter values only,
no Employee Name + dropdown combinations, the result list not scrolled to its end,
detail-panel actions not exercised, a single account and role, PB-001 not
reproduced, and volatile shared demo data.

_No overall quality verdict is given. Judgment belongs to the human reviewer._
