# Bug Reports

> Candidate bug reports for the suspected application issues in `execution/ExecutionProblemReview.md` (PR-001 – PR-005), written at
> the human's instruction (journal EVT-0035). **Every bug below is Suspected, not Confirmed:** none comes from a FAIL against an
> approved expected result. Each was observed while executing an Exploratory case or a case precondition, and the expected behavior
> is not documented. Where that is so, the report says "Expected behavior requires confirmation." Environment and test-data issues
> (PR-006 – PR-008) are listed separately and are not application bugs.

| Field | Value |
|---|---|
| Task ID | `orangehrm-ui-api` |
| Workflow Run ID | `RUN-001` |
| Source report | `execution/ExecutionReport.md` v1.2.0 (execution of 2026-10-15, journal EVT-0032; revisions EVT-0036, EVT-0040) |
| Document version | 1.1.0 |
| Status | Approved (`MANUAL_EXECUTION_APPROVED`, journal EVT-0043) |

### Revision History

| Version | Date (UTC) | Reason | Bugs added | Bugs modified | Bugs withdrawn |
|---|---|---|---|---|---|
| 1.0.0 | 2026-10-18 | Initial: candidate reports for Problem Review suspected issues PR-001 – PR-005 (human instruction, journal EVT-0035) | BUG-001, BUG-002, BUG-003, BUG-004, BUG-005 | — | — |
| 1.1.0 | 2026-10-18 | Source report updated to ExecutionReport v1.2.0 (TC-024 PASS under TestCases v1.4.0, journal EVT-0040); review notes and totals updated. No bug content changed | — | — | — |

### Classification used in this document

| Label | Meaning |
|---|---|
| **Confirmed** | An approved expected result was not met (a FAIL), and the case, data and environment were sound. |
| **Suspected** | The behavior looks wrong, but no approved expected result decides it, or it is not yet confirmed. Needs a business or design decision before it is treated as a defect. |

### Severity model

No project-defined severity model exists (TaskContext, knowledge base). The platform default applies:

- **Critical**: core function unusable, data loss or corruption, or a security exposure, with no workaround.
- **High**: a major function fails, or the workaround is impractical.
- **Medium**: a function is partially impaired and a workaround exists.
- **Low**: cosmetic or minor.

### Index

| Bug | Title | Classification | Problem Review | Related test cases | Severity | Priority | Status |
|---|---|---|---|---|---|---|---|
| BUG-001 | Results header shows "No Records Found" while the unfiltered list is loading | Suspected | PR-001 | TC-050 | Low | Medium | Open |
| BUG-002 | Reset does not clear unselected text in Employee Name | Suspected | PR-002 | TC-014, TC-018 | Medium | Medium | Open |
| BUG-003 | Selected employee name shows two spaces when there is no middle name | Suspected | PR-003 | TC-028 | Low | Low | Open |
| BUG-004 | Copy icons in the employee detail panel are never visible | Suspected | PR-004 | TC-046 | Low | Low | Open |
| BUG-005 | "Should not exceed 100 characters" stays visible after the text is shortened | Suspected | PR-005 | TC-030 | Low | Low | Open |

Common environment for all bugs: public shared demo site (no dedicated environment provided) ·
https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory · OrangeHRM OS 5.9 (page footer) · Chromium via
Playwright MCP, exact version not reported · desktop viewport. Log in with the demo account shown on the application's login page
(credentials not recorded here).

---

## BUG-001

### Title

Results header shows "No Records Found" while the unfiltered list is loading

### Classification

**Suspected.** Problem Review PR-001; exploration potential bug PB-001 (unconfirmed). Reproduced 6 of 6 times; whether it is a defect needs a decision (TQ-013).

### Severity

Low. Rationale: the message is shown for about 0.3 – 0.6 s and is then replaced by the correct count and cards; no function is lost, but a user can briefly be told there are no records.

### Priority

Medium. Basis: it appears on every opening of the Directory page by the sidebar or a reload (the main entry to the feature); affected case TC-050 has priority Medium (results presentation, PRD FR-024 via PC SA-004).

### Environment

See "Common environment" above. Observed 2026-10-15 between 13:57:28Z and 13:57:45Z.

### Preconditions

Logged in with the demo account; the Directory page has finished loading.

### Steps to Reproduce

1. Open https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory and log in with the demo account.
2. Wait until the employee cards are displayed.
3. Click the "Directory" item in the left sidebar (or reload the page).
4. Watch the results header text above the cards during the first second.

### Expected Result

Expected behavior requires confirmation. No approved requirement states what the header shows while results load (TC-050 is Exploratory, expected result "Not established by approved requirements."; open question TQ-013).

### Actual Result

After sidebar navigation (5 of 5 tries) and a page reload (1 of 1), the header read "No Records Found" with 0 cards for about 0.3 – 0.6 s, then changed to "(307) Records Found" with 14 cards. After Reset it was not observed. Sampled every 50 ms.

### Evidence

- EVD-133 — other (header timing samples, JSON) — `execution/evidence/EVD-133-tc050-header-timing.json`
- EVD-150 — log — `execution/evidence/EVD-150-execution-observation-log.md`

### Affected Test Cases

- TC-050 (steps performed; Exploratory, no verdict)

_Grouping rationale: one symptom in one place (results header during loading). Possibly related: none._

### Root Cause Assessment

Not established — observed symptom only.

### Traceability

PC SA-004 → TC-050 (Exploratory, observed) → EVD-133 → BUG-001 · related exploration: OBS-022, PB-001 · open question TQ-013

### Status

Open

---

## BUG-002

### Title

Reset does not clear unselected text in Employee Name

### Classification

**Suspected.** Problem Review PR-002. Reproduced twice. No approved case covers Reset with unselected name text (TCI-004).

### Severity

Medium. Rationale: Reset is meant to return the filters to defaults; with unselected text it resets the dropdowns and reloads the list but leaves the text, so the filter area is partly reset. Workaround: delete the text by hand or reload the page.

### Priority

Medium. Basis: Reset is core search behavior (TC-014 priority High, PRD FR-022/FR-023 via PC SA-002/SA-003); only the unselected-text state is affected, and a workaround exists.

### Environment

See "Common environment" above. Observed 2026-10-15 at 13:19:05Z and 13:19:25Z.

### Preconditions

Logged in with the demo account; Directory page open with filters at defaults.

### Steps to Reproduce

1. Open https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory and log in with the demo account.
2. In Employee Name, type the first 4 letters of an employee's first name shown on a card (e.g. "Timo"). Do not select a suggestion.
3. Click Reset.
4. Look at the Employee Name field.

### Expected Result

Expected behavior requires confirmation. The approved TC-014 expects Employee Name to be empty after Reset when a suggestion was selected (basis OBS-012); no approved case states the behavior for unselected text.

### Actual Result

Job Title and Location returned to "-- Select --" and the list reloaded, but Employee Name still contained "Timo".

### Evidence

- EVD-073 — screenshot — `execution/evidence/EVD-073-tc018-attempt1-field-not-cleared.png`
- EVD-074 — screenshot — `execution/evidence/EVD-074-reset-keeps-unselected-name-text.png`
- EVD-150 — log — `execution/evidence/EVD-150-execution-observation-log.md`

### Affected Test Cases

- TC-018 (precondition "click Reset first if any filter is set"; attempt 1 invalidated, see TCI-001)
- TC-014 (related: the approved Reset case with a selected suggestion, which PASSED)

_Grouping rationale: one Reset behavior, seen while setting up TC-018. Possibly related: none._

### Root Cause Assessment

Not established — observed symptom only.

### Traceability

PC SA-002 / PC SA-003 → TC-014, TC-018 (precondition) → EVD-073, EVD-074 → BUG-002 · related exploration: OBS-012 · test case issues TCI-001, TCI-004

### Status

Open

---

## BUG-003

### Title

Selected employee name shows two spaces when there is no middle name

### Classification

**Suspected.** Problem Review PR-003. Same pattern as exploration OBS-016; open question TQ-003.

### Severity

Low. Rationale: cosmetic text only; searching with the selected name still returns the right employee.

### Priority

Low. Basis: cosmetic; affected case TC-028 has priority Medium only because the behavior needs investigation.

### Environment

See "Common environment" above. Observed 2026-10-15 at 13:24:12Z.

### Preconditions

Logged in with the demo account; Directory page open; an employee without a middle name exists in the current data.

### Steps to Reproduce

1. Open https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory and log in with the demo account.
2. In Employee Name, type the start of the first name of an employee who has no middle name (e.g. "Rang" for "Ranga Akunuri").
3. Select that employee's suggestion.
4. Inspect the text in the Employee Name field (e.g. check the character codes between first and last name).

### Expected Result

Expected behavior requires confirmation (TC-028 Exploratory; TQ-003: is the double space intended or a display defect?).

### Actual Result

The field contained "Ranga␠␠Akunuri" (two spaces, character codes 32 32). For an employee with a middle name ("Timothy Lewis Amiano") the spaces were single. The card name text also contains the double space.

### Evidence

- EVD-097 — screenshot — `execution/evidence/EVD-097-tc028-double-space.png`
- EVD-150 — log — `execution/evidence/EVD-150-execution-observation-log.md`

### Affected Test Cases

- TC-028 (step 2; Exploratory, no verdict)

_Grouping rationale: one display symptom. Possibly related: none._

### Root Cause Assessment

Not established — observed symptom only.

### Traceability

PC SA-002 → TC-028 (Exploratory, observed) → EVD-097 → BUG-003 · related exploration: OBS-016 · open question TQ-003

### Status

Open

---

## BUG-004

### Title

Copy icons in the employee detail panel are never visible

### Classification

**Suspected, low confidence.** Problem Review PR-004. The intended design is unknown (TQ-010); the icons may be intended to show on a different hover target or viewport.

### Severity

Low. Rationale: the copy action cannot be used; the values can still be selected and copied by hand. If copy is an intended feature, this would be a partially impaired function (Medium).

### Priority

Low. Basis: intended behavior not established (TC-046 priority Medium for investigation); a manual workaround exists.

### Environment

See "Common environment" above. Observed 2026-10-15 at 13:34:11Z.

### Preconditions

Logged in with the demo account; an employee whose detail panel shows Work Telephone and Work Email.

### Steps to Reproduce

1. Open https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory and log in with the demo account.
2. Click an employee card whose panel shows Work Telephone and Work Email.
3. Move the mouse over the Work Telephone row, then the Work Email row.
4. Look for a copy icon next to each value.

### Expected Result

Expected behavior requires confirmation (TC-046 Exploratory; TQ-010: define the expected behavior of each detail-panel action).

### Actual Result

Two copy buttons (icon class `bi-files`) exist in the panel next to Work Telephone and Work Email, but stay `display:none` even while the mouse is over the row or its hover wrapper, so they cannot be clicked.

### Evidence

- EVD-150 — log — `execution/evidence/EVD-150-execution-observation-log.md`
- No screenshot was captured for this observation. The DOM reads (reserved as EVD-130) are transcribed in EVD-150 and were not stored as a separate file. Contact values are redacted as `[REDACTED: personal data]`.

### Affected Test Cases

- TC-046 (copy-icon step; Exploratory, no verdict)

_Grouping rationale: one control in one panel. Possibly related: none._

### Root Cause Assessment

Not established — observed symptom only.

### Traceability

PC SA-005 → TC-046 (Exploratory, observed) → EVD-150 → BUG-004 · related exploration: OBS-018 · open question TQ-010

### Status

Open

---

## BUG-005

### Title

"Should not exceed 100 characters" stays visible after the text is shortened

### Classification

**Suspected.** Problem Review PR-005; open question TQ-005.

### Severity

Low. Rationale: a stale validation message is shown until the next Search; no data or function is affected.

### Priority

Low. Basis: minor message behavior; affected case TC-030 has priority Medium only because the behavior needs investigation.

### Environment

See "Common environment" above. Observed 2026-10-15 at 13:25:27Z.

### Preconditions

Logged in with the demo account; Directory page open.

### Steps to Reproduce

1. Open https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory and log in with the demo account.
2. In Employee Name, enter a string of more than 100 characters and click Search.
3. Replace the text with a short string (e.g. 8 characters). Do not click Search.
4. Look at the message under Employee Name.

### Expected Result

Expected behavior requires confirmation (TC-030 Exploratory; TQ-005: define the maximum length and accepted characters; whether messages clear on input is not documented).

### Actual Result

After Search with a 266-character string the message "Should not exceed 100 characters" appeared. After the text was replaced with the 8-character string "!@#$%^&*" the message remained displayed while typing, until the next Search, which then showed "Invalid".

### Evidence

- EVD-099 — screenshot — `execution/evidence/EVD-099-tc030-long-input-100-char-message.png`
- EVD-150 — log — `execution/evidence/EVD-150-execution-observation-log.md`

### Affected Test Cases

- TC-030 (steps performed; Exploratory, no verdict; DEV-003: a 266-character string was used instead of 256)

_Grouping rationale: one message behavior. Possibly related: none._

### Root Cause Assessment

Not established — observed symptom only.

### Traceability

PC SA-002 → TC-030 (Exploratory, observed) → EVD-099 → BUG-005 · open question TQ-005

### Status

Open

---

## Environment and test-data issues (not application bugs)

These Problem Review findings are **not** reported as application bugs: the evidence points to the shared demo environment or its data, or the behavior was not reproduced.

| Finding | Summary | Related cases | Why not a bug | Evidence |
|---|---|---|---|---|
| PR-006 | HTTP 500 page after login (TC-054 attempt 1, 14:00:06Z) | TC-054 | Not reproduced; the retry 20 s later succeeded; the data total changed 307 → 95 at the same time, consistent with a demo-site reset. Failing request not captured. | EVD-139, EVD-150 |
| PR-007 | Sidebar "Directory" click did not reload the page once (13:34:35Z) | TC-047 | Single occurrence; the same action reloaded normally twice later; may be a tool timing effect. | EVD-150 |
| PR-008 | Shared demo data changed continuously (totals 252 → 263 → 307 → 95 → 97; 142 on 2026-10-18) | TC-055, TC-008, TC-022 | Uncontrolled shared data (PC RK-005); no defect implied. Caused TCI-003. | EVD-150 |

## Review notes

- **TC-024 (TCI-002), not a bug.** Re-checked live on 2026-10-18 (EVD-151, EVD-152): after Search shows "Invalid" the suggestion list stays closed; a click, ArrowDown, double-click, Alt+ArrowDown and Tab / Shift+Tab + ArrowDown did not reopen it while the text was unchanged. This is a test-case problem: Test Design v1.4.0 (Draft, journal EVT-0034) adds a step that deletes and retypes the last character. TC-024 stays BLOCKED until v1.4.0 is approved, reviewed and executed. **Update:** v1.4.0 was approved (EVT-0037, EVT-0039) and TC-024 was re-executed on 2026-10-18: PASS (EVD-153, EVD-154).
- **No Confirmed bugs.** No executed case failed (40 PASS, 0 FAIL, 0 BLOCKED; 18 Exploratory observed).
- **Bugs reported without a FAIL.** The skill's default raises bugs only for FAIL results caused by an application defect. These five candidate reports were written at the human's explicit instruction (EVT-0035) and are labeled Suspected for that reason.
