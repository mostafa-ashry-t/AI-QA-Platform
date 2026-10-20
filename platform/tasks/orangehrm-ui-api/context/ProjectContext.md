# Project Context

> Produced by the `project-context` skill (skill v1.1.1, prompt `project-context` v1.1.0)
> from this task's PRD. Documented intent only; the live application was not consulted.
>
> `PRD (PRD_APPROVED) → Project Context → HARD STOP → PROJECT_CONTEXT_APPROVED → Exploration`
>
> **PRD** below means `platform/tasks/orangehrm-ui-api/prd/PRD.md` v1.2.0, approved
> with `PRD_APPROVED` (journal EVT-0007). PRD item IDs are always written as
> `PRD <ID>` (e.g. `PRD FR-021`). Unqualified `SA-`, `BR-`, `EB-`, `DEP-`, `AS-`,
> `RK-`, `GAP-` and `OQ-` IDs belong to this document.

## 1. Task Information

| Field | Value |
|---|---|
| Task ID | `orangehrm-ui-api` |
| Task Name | `OrangeHRM UI & API QA assignment` (as recorded in TaskContext.md; see GAP-010) |
| Task Type | `project` |
| Project Name | `OrangeHRM` |
| Status | Approved |
| Sources read | `platform/tasks/orangehrm-ui-api/prd/PRD.md` (v1.2.0, Approved); `platform/tasks/orangehrm-ui-api/context/TaskContext.md` (§1 Identity only); `platform/tasks/orangehrm-ui-api/journal/workflow-run.json` (`active_run_id`); `platform/tasks/orangehrm-ui-api/journal/execution-log.json` (PRD approval EVT-0007). Knowledge base: none referenced by the PRD. |

**Scope in one line:** UI testing of the OrangeHRM **Directory module only**; API
testing is explicitly out of scope (PRD §6, `PRD FR-021`, `PRD CON-006`).

**What the PRD does not contain:** any description of how the Directory module
behaves. It names the module, its location and four exploration focus areas, and
marks all detailed behavior as "Requires exploration" (PRD §12, §20). This
document therefore defines *where to look and what governs the QA work*, not
*what the application does* (GAP-001).

## 2. Scope Decomposition

Product areas (SA-001 to SA-005) come from the PRD's Directory scope. QA process
areas (SA-006 to SA-010) come from the assignment milestones the PRD keeps for
this task.

| ID | Name | Description | Contains | Why distinct | Source |
|---|---|---|---|---|---|
| SA-001 | Directory page access | Reaching the Directory module page under test | The UI entry point and the Directory page location | It is the precondition for every other product area, and the only Directory fact the PRD gives (its location) | `PRD UIR-001`, `PRD UIR-002` |
| SA-002 | Directory search | The module's search capability | Whatever search controls exploration verifies (none are named in the PRD) | Named as a separate focus area | `PRD FR-022` — "UI exploration focuses on directory search." |
| SA-003 | Directory filters | The module's filters | Whatever filter controls exploration verifies (none are named in the PRD) | Named as a separate focus area, distinct from search in the PRD's wording; the difference is not defined (GAP-005) | `PRD FR-023` — "UI exploration focuses on the Directory filters." |
| SA-004 | Employee results | The results the module returns | Whatever result presentation exploration verifies | Named as a separate focus area: the output of search and filters | `PRD FR-024` — "UI exploration focuses on the employee results." |
| SA-005 | Displayed employee information | The employee information the module displays | Whatever employee information exploration verifies | Named as a separate focus area: the content of results, as opposed to the result set | `PRD FR-025` — "UI exploration focuses on the displayed employee information." |
| SA-006 | Exploration and scope finalization | Exploring the Directory UI, verifying its actual controls, and delivering the findings | UI exploration, control verification before scope is finalized, findings document | First milestone that touches the application; it fixes the scope the later areas use | `PRD FR-003`, `PRD FR-005`, `PRD FR-026` |
| SA-007 | Test design and review | Producing and reviewing the UI test design | Test cases as CSV with the "Valid in Scope" and "Needs Automation" fields; correctness review | Produces the selection fields that drive SA-008 and SA-009 | `PRD FR-006`, `PRD FR-007`, `PRD BR-001`, `PRD BR-002` |
| SA-008 | Manual execution and reporting | Executing selected test cases and reporting results | Execution of Valid in Scope = TRUE cases; HTML execution report with bug reporting | Governed by its own selection rule and report | `PRD FR-008`, `PRD FR-009`, `PRD FR-010`, `PRD BR-003` |
| SA-009 | Playwright automation, execution and healing | Generating, running and healing UI automation | Playwright automation for Needs Automation = TRUE cases; running with Claude and IntelliJ; controlled healing and its documentation | Separate framework, tools and healing rules | `PRD FR-011` – `PRD FR-015`, `PRD BR-004` – `PRD BR-007`, `PRD CON-001`, `PRD CON-002` |
| SA-010 | Final deliverables | The deliverables the assignment lists | PRD.md, Exploration.md, Test Design CSV, Playwright automation, Excel milestone summary, HTML workflow/sequence diagram, automation execution HTML report, healing/fixing documentation, agent execution HTML report | Packaging of outputs, separate from producing them | `PRD FR-002`, `PRD FR-016` – `PRD FR-020` |

## 3. Task Scope

### In Scope

- UI testing of the OrangeHRM Directory module only: SA-001 to SA-005
  (`PRD FR-021`, `PRD UIR-002`, `PRD CON-004`).
- The assignment milestones, applied to the UI only: SA-006 to SA-009
  (PRD §6 — "Milestones 1 to 5, as stated in the assignment (SRC-001), applied to the UI only.").
- The final deliverables, for the UI only: SA-010 (PRD §6).

### Explicitly Out of Scope

- All OrangeHRM UI modules other than Directory (PRD §6 — "All OrangeHRM UI modules other than Directory").
- API testing: API exploration, API test design and API test cases, API test
  execution, and API automation (`PRD CON-006`; PRD §6). The PRD removed
  `PRD FR-004`, `PRD APIR-001` and `PRD DEP-002` for this reason.

### Scope Boundaries

- **Directory vs other modules.** Only the Directory module is covered (`PRD CON-004`).
  Where a Directory interaction leads to another module's page, the PRD does not
  say whether that page is covered (OQ-012).
- **How the Directory is reached.** The PRD gives the Directory page URL
  (`PRD UIR-002`) and the UI entry point (`PRD UIR-001`). It does not say whether
  reaching the Directory through the application's own navigation is part of the
  coverage, or whether access needs a user account (OQ-002, OQ-011).
- **UI vs API.** Everything on the API side is out of scope (`PRD CON-006`). The
  API URL is kept only as a source record (PRD §2, `SRC-003`).
- **Project Context vs Exploration.** This document holds documented intent. All
  Directory behavior, controls, fields and data are established by Exploration
  (`PRD FR-026`; PRD §12 — "**Requires exploration**").

## 4. Roles and Permissions

| Role | Allowed actions | Restricted actions | Source |
|---|---|---|---|
| None documented in the PRD. | — | — | PRD §7 — "No application roles or users are named in the sources." |

No application roles, users or permissions are documented (GAP-002, OQ-002).
Claude and IntelliJ are named only as tools for running the automation, not as
application actors (PRD §7).

## 5. Business Rules

_These govern the QA work. The PRD documents no business rules of the Directory
module itself (GAP-001)._

### BR-001

- **Description:** UI coverage is limited to the OrangeHRM Directory module.
- **Source:** `PRD FR-021`, `PRD CON-004` — "UI coverage is limited to the Directory module."
- **Scope area:** SA-001 – SA-005

### BR-002

- **Description:** No API exploration is performed for this task.
- **Source:** `PRD CON-006` — "no API exploration"
- **Scope area:** SA-006

### BR-003

- **Description:** No API test cases are generated for this task.
- **Source:** `PRD CON-006`, `PRD FR-006` — "no API test cases are generated"
- **Scope area:** SA-007

### BR-004

- **Description:** No API test execution is performed for this task.
- **Source:** `PRD CON-006` — "no API test execution"
- **Scope area:** SA-008

### BR-005

- **Description:** No API automation is produced for this task.
- **Source:** `PRD CON-006` — "no API automation"
- **Scope area:** SA-009

### BR-006

- **Description:** The Directory module's actual available controls are verified before the UI coverage scope is finalized.
- **Source:** `PRD FR-026` — "Verify the Directory module's actual available controls before the UI coverage scope is finalized."
- **Scope area:** SA-006

### BR-007

- **Description:** The test design contains a "Valid in Scope" value.
- **Source:** `PRD BR-001`, `PRD DR-004`
- **Scope area:** SA-007

### BR-008

- **Description:** The test design contains a "Needs Automation" value.
- **Source:** `PRD BR-002`, `PRD DR-005`
- **Scope area:** SA-007

### BR-009

- **Description:** Only test cases with Valid in Scope = TRUE are executed.
- **Source:** `PRD BR-003` — "Only test cases with Valid in Scope = TRUE are executed."
- **Scope area:** SA-008

### BR-010

- **Description:** Automation is generated only for test cases with Needs Automation = TRUE.
- **Source:** `PRD BR-004` — "Playwright automation is generated only for test cases with Needs Automation = TRUE."
- **Scope area:** SA-009

### BR-011

- **Description:** The automation framework for this task is Playwright.
- **Source:** `PRD CON-001` — task-specific decision; the global platform rule (CLAUDE.md Tooling Rule) is unchanged and does not apply to this task's automation.
- **Scope area:** SA-009

### BR-012

- **Description:** Every healing attempt is documented.
- **Source:** `PRD FR-015` — "Document every healing attempt."
- **Scope area:** SA-009

### BR-013

- **Description:** Healing documentation records the reason.
- **Source:** `PRD BR-005`
- **Scope area:** SA-009

### BR-014

- **Description:** Healing documentation records the change.
- **Source:** `PRD BR-006`
- **Scope area:** SA-009

### BR-015

- **Description:** Healing documentation records the result.
- **Source:** `PRD BR-007`
- **Scope area:** SA-009

### BR-016

- **Description:** Credentials are never recorded.
- **Source:** PRD §20 — "Credentials are never recorded."; `PRD OQ-006`
- **Scope area:** SA-001, SA-006 – SA-009

## 6. Expected Behaviors

_The PRD documents no expected behavior of the Directory module: its controls,
results and displayed information are all marked "Requires exploration"
(PRD §12, §20; GAP-001). The items below are the documented expected outcomes of
the QA work._

| ID | Expected behavior (as documented) | Source | Scope area |
|---|---|---|---|
| EB-001 | The exploration findings are delivered as a Markdown file. | `PRD FR-005` | SA-006 |
| EB-002 | The test cases are delivered as a CSV. | `PRD FR-006` | SA-007 |
| EB-003 | The correctness of the test suite is reviewed. | `PRD FR-007` | SA-007 |
| EB-004 | An HTML execution report is generated. | `PRD FR-009` | SA-008 |
| EB-005 | The HTML execution report includes bug reporting. | `PRD FR-010` | SA-008 |
| EB-006 | The automation is run using Claude. | `PRD FR-012` | SA-009 |
| EB-007 | The automation is run using IntelliJ. | `PRD FR-013` | SA-009 |
| EB-008 | If the automation requires healing or fixing, controlled healing is performed. | `PRD FR-014` | SA-009 |
| EB-009 | The PRD is delivered as a Markdown file. | `PRD FR-001`, `PRD FR-002` | SA-010 |
| EB-010 | An Excel milestone summary is delivered. | `PRD FR-016` | SA-010 |
| EB-011 | An HTML workflow/sequence diagram is delivered. | `PRD FR-017` | SA-010 |
| EB-012 | An automation execution HTML report is delivered. | `PRD FR-018` | SA-010 |
| EB-013 | Healing/fixing documentation is delivered. | `PRD FR-019` | SA-010 |
| EB-014 | An agent execution HTML report is delivered. | `PRD FR-020` | SA-010 |

## 7. Dependencies

| ID | Type | Dependency | Why it is needed | Source |
|---|---|---|---|---|
| DEP-001 | External system | The OrangeHRM UI at https://opensource-demo.orangehrmlive.com/ is available | Every product area is reached through it | `PRD DEP-001`, `PRD UIR-001` |
| DEP-002 | Module | The Directory page at https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory | It is the module under test | `PRD UIR-002` |
| DEP-003 | Data | The approved PRD | Exploration (Milestone 2) needs it | `PRD DEP-006`, `PRD DR-002` |
| DEP-004 | Data | The selected coverage scope: UI testing of the Directory module only | Exploration (Milestone 2) needs it; provided | `PRD DEP-007`, `PRD DR-003` |
| DEP-005 | Data | The test design's Valid in Scope and Needs Automation values | Execution and automation select test cases by them | `PRD DEP-008`, `PRD DR-004`, `PRD DR-005` |
| DEP-006 | Data | Users, roles or test accounts for the application | Needed for exploration and execution; not provided | `PRD OQ-006`; PRD §20 |
| DEP-007 | External system | Playwright | The automation framework for this task | `PRD DEP-005`, `PRD CON-001` |
| DEP-008 | External system | Claude | Running the automation | `PRD DEP-003` |
| DEP-009 | External system | IntelliJ | Running the automation | `PRD DEP-004` |

No API dependency: API testing is out of scope (`PRD CON-006`; `PRD DEP-002` removed).

## 8. Assumptions

| ID | Assumption | Status | Basis / Source |
|---|---|---|---|
| AS-001 | The assignment text in the PRD's source record is complete and current. | Unconfirmed | `PRD AS-001`; the referenced attachment was never received (`PRD GAP-001`) |
| AS-002 | One task covers the whole assignment (Milestones 1–5), limited to UI testing of the Directory module. | Unconfirmed | `PRD AS-002` |
| AS-003 | The Directory page is reachable at the URL in `PRD UIR-002`. | Unconfirmed | That URL was supplied by the user and was not accessed (PRD §12). Exploration will confirm or refute it. |

## 9. Risks

| ID | Description | Why it matters | Related requirement / area | Basis | Source |
|---|---|---|---|---|---|
| RK-001 | No acceptance criteria exist for any milestone. | Completion of each stage cannot be judged against agreed criteria. | All SA | Documented | `PRD GAP-003` |
| RK-002 | No Directory behavior is documented, so expected results will rest on what exploration observes. | A defect present during exploration could be recorded as expected behavior and carried into test design. | SA-002 – SA-005 | Derived | PRD §12, §20 ("Requires exploration") |
| RK-003 | The Directory controls are unverified; the detailed UI scope may change after exploration. | SA-002 – SA-005 may need re-splitting, and later stages may be planned on the wrong controls. | SA-002 – SA-006 | Documented | `PRD GAP-007` — "The detailed UI scope may change after exploration." |
| RK-004 | No users, roles or test accounts have been provided. | Exploration and execution may be blocked if the Directory requires an account. | SA-001, SA-006, SA-008 | Documented | `PRD OQ-006` — "Needed for exploration and execution." |
| RK-005 | The environment, browsers and devices are not defined, and nothing states who controls the application's data. | Results (e.g. which employees appear) may not be reproducible between exploration, test design and execution. | SA-004, SA-005, SA-008 | Derived | PRD §6 Scope Not Defined — "Environments, browsers and devices." |
| RK-006 | The task's framework (Playwright) differs from the global platform rule (Selenium + SHAFT). | Downstream stages that follow the global rule by default could produce the wrong automation. | SA-009 | Derived | `PRD CON-001`, `PRD GAP-004` |
| RK-007 | It is unclear whether the "Agent execution HTML report" is the same as the HTML execution report. | One report may be missed or produced twice. | SA-008, SA-010 | Documented | `PRD OQ-003` |
| RK-008 | The original assignment document was not received. | Requirements that appear only in that document are missing from this context. | All SA | Documented | `PRD GAP-001` |

## 10. Gaps and Open Questions

### Gaps

| ID | Gap (missing / unclear / contradictory / untestable) | Related requirement / area | Impact (if known) | Owner |
|---|---|---|---|---|
| GAP-001 | Missing: the PRD documents no Directory module behavior, business rules, fields, messages or data. Only the module, its location and four focus areas are stated. | SA-002 – SA-005; `PRD FR-022` – `PRD FR-025` | Expected behavior for test design must come from exploration (RK-002). | not stated |
| GAP-002 | Missing: no application roles, users or permissions are documented. | Section 4; SA-001 | Whether access or results depend on a role is unknown. | not stated |
| GAP-003 | Missing: no acceptance criteria for any milestone. | All SA; `PRD GAP-003` | See RK-001. | not stated |
| GAP-004 | Unverified: the Directory module's actual controls. The UI scope cannot be finalized until exploration verifies them. | SA-002 – SA-006; `PRD GAP-007`, `PRD FR-026` | See RK-003. | not stated |
| GAP-005 | Unclear: the PRD names "search" (`PRD FR-022`) and "filters" (`PRD FR-023`) as separate focus areas but does not say what distinguishes them. | SA-002, SA-003 | SA-002 and SA-003 may merge or split once the controls are known. | not stated |
| GAP-006 | Missing: environment, browsers and devices. | SA-006 – SA-009; PRD §6 | See RK-005. | not stated |
| GAP-007 | Missing: no non-functional requirements. | All SA; `PRD GAP-005` | None can be verified. | not stated |
| GAP-008 | Missing: the original assignment document was not received. | All SA; `PRD GAP-001` | See RK-008. | not stated |
| GAP-009 | Missing: test data. Nothing states which employees, names or values may be used to exercise search and filters. | SA-002 – SA-005; DEP-006 | Test design will depend on the data that exploration finds. | not stated |
| GAP-010 | Inconsistent: the task name in TaskContext.md says "UI & API", but the approved PRD excludes API testing. | Section 1; `PRD CON-006` | Naming only; scope follows the approved PRD. | not stated |

### Open Questions

| ID | Question | Related requirement / area | Impact (if known) | Owner |
|---|---|---|---|---|
| OQ-001 | Can the original assignment document be attached, or is the assignment text in the source record complete? | All SA; `PRD OQ-001` | Resolves GAP-008. | not stated |
| OQ-002 | Which users, roles or test accounts should be used to reach and test the Directory? (Credentials will never be recorded.) | SA-001, SA-006, SA-008; `PRD OQ-006` | Resolves GAP-002 and RK-004. | not stated |
| OQ-003 | Is the "Agent execution HTML report" the same as the Milestone 4 HTML execution report? | SA-008, SA-010; `PRD OQ-003` | Resolves RK-007. | not stated |
| OQ-004 | What makes healing "controlled": limits, approvals, or a maximum number of attempts? | SA-009; `PRD OQ-004` | Defines EB-008. | not stated |
| OQ-005 | What should the Excel milestone summary and the HTML workflow/sequence diagram contain? | SA-010; `PRD OQ-005` | Defines EB-010, EB-011. | not stated |
| OQ-006 | Must the automation be run with both Claude and IntelliJ, or with either? | SA-009; `PRD OQ-008` | Defines EB-006, EB-007. | not stated |
| OQ-007 | What criteria define the "correctness" of the test suite in the review? | SA-007; `PRD OQ-009` | Defines EB-003. | not stated |
| OQ-008 | Is the assignment's "Exploration.md" satisfied by the platform's exploration report (`exploration/ExplorationReport.md`), or must a file with that exact name be delivered? | SA-006, SA-010; `PRD OQ-010` | Naming of EB-001's deliverable. | not stated |
| OQ-009 | Which environment, browsers and devices should exploration and execution use? | SA-006 – SA-009; GAP-006 | Resolves GAP-006. | not stated |
| OQ-010 | Once the controls are known, should search and filters stay separate scope areas? | SA-002, SA-003; GAP-005 | Resolves GAP-005. | not stated |
| OQ-011 | Is reaching the Directory through the application's own navigation part of the coverage, or only the Directory page itself? | SA-001; Section 3 boundaries | Sets the SA-001 boundary. | not stated |
| OQ-012 | If a Directory interaction opens a page or view outside the Directory module, is that page in scope? | SA-004, SA-005; `PRD CON-004` | Sets the module boundary. | not stated |
| OQ-013 | The user's message of 2026-10-14 (journal EVT-0006) listed detailed exploration expectations (named controls, card behavior, edge cases). They are not in the approved PRD. Should they be adopted as scope (which would need a PRD revision), or used only as guidance for Exploration? | SA-002 – SA-006 | Decides whether those expectations are a baseline or a checklist. | not stated |

## 11. Traceability

| PRD Section | Requirement (PRD ID, or quote) | Business Rule / Expected Behavior | Scope Area |
|---|---|---|---|
| §6 Scope | "Directory module only"; other modules and API testing out of scope | BR-001 – BR-005 | SA-001 – SA-005; Section 3 |
| §7 Actors / Roles | "No application roles or users are named in the sources." | — (GAP-002) | Section 4 |
| §8 Functional Requirements | `PRD FR-001`, `PRD FR-002` | EB-009 | SA-010 |
| §8 | `PRD FR-003`, `PRD FR-005`, `PRD FR-026` | BR-006, EB-001 | SA-006 |
| §8 | `PRD FR-004` (removed) | BR-002 | Out of scope |
| §8 | `PRD FR-006`, `PRD FR-007` | BR-003, EB-002, EB-003 | SA-007 |
| §8 | `PRD FR-008`, `PRD FR-009`, `PRD FR-010` | BR-004, BR-009, EB-004, EB-005 | SA-008 |
| §8 | `PRD FR-011` – `PRD FR-015` | BR-005, BR-010, BR-012, EB-006, EB-007, EB-008 | SA-009 |
| §8 | `PRD FR-016` – `PRD FR-020` | EB-010 – EB-014 | SA-010 |
| §8 | `PRD FR-021` | BR-001 | SA-001 – SA-005 |
| §8 | `PRD FR-022` | — (GAP-001, GAP-005) | SA-002 |
| §8 | `PRD FR-023` | — (GAP-001, GAP-005) | SA-003 |
| §8 | `PRD FR-024` | — (GAP-001) | SA-004 |
| §8 | `PRD FR-025` | — (GAP-001) | SA-005 |
| §9 Business Rules | `PRD BR-001`, `PRD BR-002` | BR-007, BR-008 | SA-007 |
| §9 | `PRD BR-003` | BR-009 | SA-008 |
| §9 | `PRD BR-004` | BR-010 | SA-009 |
| §9 | `PRD BR-005`, `PRD BR-006`, `PRD BR-007` | BR-013, BR-014, BR-015 | SA-009 |
| §10 Acceptance Criteria | Not provided | — (GAP-003) | — |
| §11 Data Requirements | `PRD DR-002` – `PRD DR-005` | BR-007, BR-008 | SA-006, SA-007; DEP-003 – DEP-005 |
| §12 UI Requirements | `PRD UIR-001`, `PRD UIR-002` | — (AS-003) | SA-001; DEP-001, DEP-002 |
| §13 API Requirements | `PRD APIR-001` (removed); "API testing is explicitly out of scope for this task" | BR-002 – BR-005 | Out of scope |
| §14 Non-Functional Requirements | Not provided | — (GAP-007) | — |
| §15 Dependencies | `PRD DEP-001`, `PRD DEP-003` – `PRD DEP-008` | — | DEP-001 – DEP-009 |
| §16 Constraints | `PRD CON-001` | BR-011 | SA-009 |
| §16 | `PRD CON-002` | EB-006, EB-007 | SA-009 |
| §16 | `PRD CON-004` | BR-001 | SA-001 – SA-005 |
| §16 | `PRD CON-006` | BR-002 – BR-005 | Out of scope |
| §17 Assumptions | `PRD AS-001`, `PRD AS-002` | — | AS-001, AS-002 |
| §18 Gaps and Open Questions | `PRD GAP-001`, `PRD GAP-003`, `PRD GAP-005`, `PRD GAP-007`; `PRD OQ-001`, `PRD OQ-003` – `PRD OQ-006`, `PRD OQ-008` – `PRD OQ-010` | — | GAP-001 – GAP-008; OQ-001 – OQ-008 |
| §20 QA Preparation Notes | "Credentials are never recorded." | BR-016 | SA-001, SA-006 – SA-009 |

**PRD sections with no derived item:** §1 Document Information, §2 Source
Information, §3 Problem Statement, §4 Goal, §5 User Story ("Not provided."),
§19 Traceability. They identify the PRD and its sources and add no requirement.
The PRD's resolved or closed items (`PRD GAP-002`, `PRD GAP-004`, `PRD GAP-006`,
`PRD GAP-008`, `PRD OQ-002`, `PRD OQ-007`, `PRD OQ-011`) produced no open item
here. Their decisions appear as BR-001 – BR-005 and BR-011.

**Items without a PRD source:** None.

## 12. QA Scope Preparation

> Preparation for downstream stages only. No exploration has been performed.

### Areas requiring exploration

| Scope area | What needs to be observed | Related BR / EB / GAP / OQ |
|---|---|---|
| SA-001 | Whether the Directory page loads at its URL, and whether an account is needed to reach it | AS-003, OQ-002, OQ-011, RK-004 |
| SA-002 | Which search controls exist and how a search is performed | GAP-001, GAP-004, GAP-005, OQ-010 |
| SA-003 | Which filter controls exist and what values they offer | GAP-001, GAP-004, GAP-005, OQ-010 |
| SA-004 | How results are presented, and what happens when nothing matches | GAP-001, GAP-004, OQ-012 |
| SA-005 | Which employee information is displayed for each result | GAP-001, GAP-004, OQ-012 |
| SA-006 | The verified control list that finalizes the UI scope | BR-006, GAP-004 |

### UI areas requiring exploration

- The Directory page (SA-001; `PRD UIR-002`).
- Directory search, filters, employee results and displayed employee information
  (SA-002 – SA-005; `PRD FR-022` – `PRD FR-025`).

### API areas requiring exploration

- None. API testing is explicitly out of scope (`PRD CON-006`; BR-002 – BR-005).

### Business rules requiring validation

- BR-001 (Directory only) and BR-002 – BR-005 (no API work): in every downstream stage.
- BR-006 (controls verified before scope is finalized): at Exploration.
- BR-007, BR-008 (test design fields): at Test Design and Test Review.
- BR-009 (execution selection): at Manual Execution.
- BR-010, BR-011 (automation selection and Playwright): at Automation Generation.
- BR-012 – BR-015 (healing documentation): at Automation Execution / Self-Healing.
- BR-016 (no credentials recorded): in every stage that stores evidence or reports.

### Data requiring validation

- Users, roles and test accounts to use (DEP-006, OQ-002). Credentials are never recorded.
- Employee data available for search and filters (GAP-009).
- Environment, browsers and devices (GAP-006, OQ-009).
