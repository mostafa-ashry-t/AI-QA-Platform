# Automation Generation Report

## 1. Generation Information

| Field | Value |
|---|---|
| Task ID | orangehrm-ui-api |
| Workflow Run ID | RUN-001 |
| Report version | 1.3.0 |
| Generated at (UTC) | 2026-10-18 (projects created 10:30Z–10:45Z; healing fixes 10:48Z–10:53Z, see §1 history) |
| Skill / prompt version | automation-generation v1.1.0 / v1.1.0 |
| TestCases.md | v1.4.0 · `9197633342204a94ff1aa710e807c6b8246ff03ea5a35cc61d84192808ecefe7` · TEST_DESIGN_APPROVED EVT-0037 |
| TestCases.csv | `8ebc02a66e3792818ae2a64d088e8be45992fa64053d89ace0558288752d9373` |
| TestReview.md | v1.3.0 · `16997b9e2cfc407e038f6f75c3fa0af27dec3f29bdfa99ca3547f75652b937ab` · TEST_REVIEW_APPROVED EVT-0039 |
| ExecutionReport.md | v1.2.0 · `91079c3841a59968f3d230b0eaf6d05ed7f8aaa2b96177e73e3d995ee634e86a` · MANUAL_EXECUTION_APPROVED EVT-0043 |
| ProjectContext / ExplorationReport | `0b0dcc57d5fc887e8e3c2b0e1f74d0934841430958a2ba3da8f52258d55f24de` / `0edc9da6ebc94b63f27c4e9545f2c44062f87c70b8f53ed9e825096d8b8651d2` |

### Revision History

| Version | Date (UTC) | Reason | Changed files | Cases added / modified / removed |
|---|---|---|---|---|
| 1.0.0 | 2026-10-18 | Initial generation of two independent bindings for the same case (human decision: implement and compare both frameworks), including the plumbing fixes H-001 – H-003 found during automation-execution (`self-healing/healing-log.md`); no expected result or assertion changed | All | TC-054 added (both bindings) |
| 1.1.0 | 2026-10-18 | Human request: restructure the SHAFT binding to the My Bookings framework conventions (TestNG `@BeforeClass` / `@Test` / `@AfterClass` with one browser session per class, `Drive_Factory.CommonMethod`, `utilities.DataUtils`, `SHAFT.TestData.JSON`, page objects in `src/main/java` with chainable methods, TestNG `SoftAssert`). Same steps, same DATA-012 resolver, same five checks and expected values; verified by runs B8 and B9 | `automation/shaft-java/` (old `src/test/java/qa/orangehrm/directory/**` removed) | TC-054 modified (structure only) |
| 1.2.0 | 2026-10-18 | Human request: match the attached My Bookings code (`MyBookings_TC`, `MyBookings_Page`, `BookingDetails_Page`) more closely — audit `automation/MyBookingsAlignmentAudit.md`. Clean test body (no logging or screenshots: page objects log to `EvidenceLog`, `EvidenceListener` writes the evidence); `clickSearch()` / `clickReset()` wait for their own result update; `EmployeeDetails_Page` created by the test (replaces `EmployeeDetails_Panel`); page constructors take only the driver, waits use 30 s constants; `CommonMethod.setupDriver(browser)` as in My Bookings plus `QA_HEADLESS`; My Bookings assertion layout. Same steps, DATA-012 resolver, five checks and expected values; verified by runs B10 (headless) and B11 (headed) | `automation/shaft-java/` (`StepLogger`, `EmployeeDetails_Panel` removed) | TC-054 modified (structure only) |
| 1.3.0 | 2026-10-19 | Human request: simplify the SHAFT code (basic, readable Java; no unnecessary abstractions). Removed `EvidenceLog`, `EvidenceListener`, `TestDataUnavailableException`; screenshots and the step log come from SHAFT (`screenshotParams_whenToTakeAScreenshot=Always`, highlighting off); one 30 s `WebDriverWait` per page object; the two DATA-012 conditions are plain `Assert` checks labeled `[TEST DATA]`; the header-change wait fails on timeout instead of setting a flag. Fixes H-004 (option visibility wait) and H-005 (highlighting off) found in B12/B13. Same steps, DATA-012 resolver, five checks and expected values; verified by run B14 | `automation/shaft-java/` | TC-054 modified (structure only) |

## 2. Scope

| Case | Title | Needs Automation | Latest manual result | Generated? | Reason / code |
|---|---|---|---|---|---|
| TC-054 | End-to-end: redirect login, combined filter, employee details, close, Reset | TRUE (MD and CSV) | PASS (EVT-0043 approval; attempt 2, DEV-004) | Yes — in both bindings | Only candidate (human decision EVT-0017) |

The other 57 cases have `Needs Automation = FALSE`; none is a candidate. API automation is out of scope.

## 3. Framework and Project

Framework decision: the human decided (2026-10-18) to implement TC-054 in **two independent frameworks** and compare them. Each binding is a self-contained project; neither depends on the other.

| Field | Framework A | Framework B |
|---|---|---|
| Framework | Playwright — PC BR-011 / PRD CON-001 and the human decision | SHAFT Engine on Selenium WebDriver — platform Tooling Rule (CLAUDE.md) and the human decision |
| Binding | `playwright-ts`: TypeScript + Playwright Test + npm | `shaft-java-testng`: Java 21 + TestNG + Maven |
| Library versions (registry, checked 2026-10-18) | @playwright/test 1.64.1 (npm, released 2026-10-14), typescript 5.9.3, @types/node 24.19.2 | SHAFT_ENGINE 10.1.20260123 (Maven Central; newest release targeting Java 21 — 10.1.20260310 and later target JDK 25), which brings Selenium 4.40.0, TestNG 7.12.0, Allure TestNG 2.32.0; Surefire 3.5.4 + AspectJ weaver 1.9.25.1 (as used by SHAFT) |
| Toolchain | Node 18+ (verified 24.19.0); Chromium headless shell build 1248 (`npx playwright install chromium`) | JDK 21 (verified JBR 21.0.5 bundled with IntelliJ IDEA 2024.3; the system Java 8 is a JRE and cannot compile); Maven 3.9.11; Google Chrome |
| Project directory | `automation/playwright-ts/` | `automation/shaft-java/` |
| IDE | IntelliJ IDEA Community 2024.3: Shell Script run configuration `.run/TC-054 Playwright TS.run.xml` | IntelliJ IDEA Community 2024.3: TestNG run configuration `.run/TC-054 SHAFT.run.xml` |

### Generated files

| Path | Role | SHA-256 |
|---|---|---|
| `automation/playwright-ts/.gitignore` | ignore rules | `6a8e017fa129b3b65c1ad29f342346df7e2263de5ee6c4407fd4fec36c50bd39` |
| `automation/playwright-ts/.run/TC-054 Playwright TS.run.xml` | IDE run configuration | `3f24858672a1ccbd903e8c22ecf7a7d92e7fd938e874f1efc66fb8977a7c3ce7` |
| `automation/playwright-ts/README.md` | documentation | `bcf1bb07b541b982994d064595989229c15f0590ea7b7e241de6f10f8f665831` |
| `automation/playwright-ts/package.json` | build | `aa22970e74d9ddfdc8faf84b7f1b10138342f03c45d1763980704a686027fc9f` |
| `automation/playwright-ts/playwright.config.ts` | config | `d1a9267641e5aea6e98463d420e143d0dd6d7c7612e1f06f2bf1c8709c1bc64f` |
| `automation/playwright-ts/src/pages/DirectoryPage.ts` | page object | `c800c9562d3d70bfd2daaeed0b650f8651742931e6b75b2b6bad0c9d89b057a7` |
| `automation/playwright-ts/src/pages/LoginPage.ts` | page object | `964fb17823437cf355987ddcfcdc00e00f60c0fa9dcb9afb962543617ac0da76` |
| `automation/playwright-ts/src/support/config.ts` | support | `17913936fb159ded05c7ce983e476ba2152e4e6f9ffc21408b1d9bc000527685` |
| `automation/playwright-ts/src/support/fixtures.ts` | support | `b30080731b2db52e623aa2f39a00a629d73ba3c62e5108bdf81d16af6ea9799d` |
| `automation/playwright-ts/tests/TC-054.spec.ts` | test | `e2622ca47eb49e8addb5e784f05841c199d397a2d427f7ababdf0b24160db472` |
| `automation/playwright-ts/tsconfig.json` | build | `85242a62a989e90f5c1fcd4437a7ebf2dfb816936f23bd252c5f7b03bef2a676` |
| `automation/shaft-java/.gitignore` | ignore rules | `719caec50606589f94b19fbcd5e890e4237668e177a2d957b3fff2cef1bc9f91` |
| `automation/shaft-java/.run/TC-054 SHAFT.run.xml` | IDE run configuration | `ec50f71894edb483adb57507db2d39e27e6f68abc4f31f8d881dd264c33f519c` |
| `automation/shaft-java/README.md` | documentation | `4268ae1f30a34c7f662fc0767c44081bf975be076a34081000cbf32da50c1182` |
| `automation/shaft-java/pom.xml` | build | `7db64213b908f863acae5a3f6e02e3340dd588fad1e475c8b652c5eff01b89b8` |
| `automation/shaft-java/src/main/java/Drive_Factory/CommonMethod.java` | support | `f48bcf1e87bc354c4a10f7664c3faddff9a0866683892b6cb003ab071012998d` |
| `automation/shaft-java/src/main/java/OrangeHRMPages/Directory/Directory_Page.java` | page object | `fd2501e118751d047be1a13c241a94b922cc2b940519c78214371bba761be7f3` |
| `automation/shaft-java/src/main/java/OrangeHRMPages/Directory/EmployeeDetails_Page.java` | page object | `1a2cdc1c73164d544c5b2bf3f1de7888026d389b64c2467b905e6d5e966961de` |
| `automation/shaft-java/src/main/java/OrangeHRMPages/Login/Login_Page.java` | page object | `763545c1247d0fb2dae10bd38d6c137f2381a027b18579672761931dc540e6e5` |
| `automation/shaft-java/src/main/java/utilities/DataUtils.java` | support | `7477a69b82d7cdd1d699f6676ebab04a1ac0771759d35197fdae3ae35ce68e63` |
| `automation/shaft-java/src/main/resources/properties/custom.properties` | config | `ae854f4e2cd7d3593440be1a06af6a16fe463f498e2b2c45a1bbe86d05fbf010` |
| `automation/shaft-java/src/test/java/OrangeHRMPages/Directory/Directory_TC.java` | test | `d768431ac36da673d0e66eeaf45ef5b05930d60eee954a3d25d347086ae72540` |
| `automation/shaft-java/src/test/resources/Environment.properties` | config | `5a06d107ab5b5287a2195479ed488fafa5b7520feaca1f7d7dadc866d8f219e5` |
| `automation/shaft-java/src/test/resources/testDataFiles/OrangeHRMDirectory.json` | test data | `da30846affc248fbfffeac9060955c89e058ce559ef1064cbd93dd0e3e637e56` |
| `automation/shaft-java/testng.xml` | config | `0dc16b71f7db2902f68d31bf0399784db37cb639450a0a09dee220d433e8d7ba` |

`package-lock.json` (npm lock file) is also kept; SHAFT runtime files (default properties, listener service files, report folders) are generated at run time and git-ignored.

## 4. Case Mapping

### TC-054 — End-to-end: redirect login, combined filter, employee details, close, Reset

| Field | Framework A | Framework B |
|---|---|---|
| Test | `tests/TC-054.spec.ts` → test "TC-054 End-to-end: redirect login, combined filter, employee details, close, Reset" | `src/test/java/OrangeHRMPages/Directory/Directory_TC.java` → `TC054_verifyThatResetRestoresDefaultsAfterCombinedFilterAndEmployeeDetails` (precondition and step 1 in `@BeforeClass`); page objects `src/main/java/OrangeHRMPages/Login/Login_Page.java`, `src/main/java/OrangeHRMPages/Directory/Directory_Page.java`, `EmployeeDetails_Page.java`; screenshots and step log by SHAFT (Allure report) |
| Expected result (verbatim) | Employee Name is empty, Job Title and Location display "-- Select --", and the results header reads "(N) Records Found" with N greater than the count k noted in step 3. | same |
| Assertion | Five parts of the single expected state, read after step 6: Employee Name input value `""`; Job Title text `"-- Select --"`; Location text `"-- Select --"`; trimmed header matches `^\(\d+\) Records Found$`; N (parsed from it) > k (read in step 3 of the same run). `expect.soft`, messages "TC-054 expected: …" | Same five checks and expected values with TestNG `SoftAssert` + `assertAll()` (My Bookings convention; all parts reported, the test fails if any part fails); `-- Select --` and the header pattern read from `testDataFiles/OrangeHRMDirectory.json` |
| Test data | DATA-001 → `QA_USERNAME` / `QA_PASSWORD`. DATA-012 → resolver `displayedPairs()`: first displayed card (in the results container) that shows both a job title (card subtitle) and a location (the card body's 2nd description, after the sub-unit; EVD-003, OBS-008); the "fewer records than unfiltered" condition is checked after step 3 (k < unfiltered count read before step 2) | same resolver logic |
| Related bugs | none asserted. BUG-002 (Suspected) concerns a different behavior; no suspected bug is asserted as correct. PB-001 (transient "No Records Found") is guarded by reading the header only after cards are displayed | same |

| Step | Approved text (verbatim) | Code (summary) | Waits for |
|---|---|---|---|
| Pre | No authenticated session in the browser (fresh browser context, or logged out). | Fresh browser context (A, cookie count logged) / fresh WebDriver session (B, the redirect to the login URL is logged) per test | — |
| 1 | Open the Directory URL and log in with the demo account (DATA-001). | Open `/web/index.php/directory/viewDirectory`; on the login form type the env credentials (A: `fill`, untraced; B: `typeSecure`); click Login | Login form visible; URL back on the Directory path; Search button visible |
| (data) | DATA-012 resolution (TestCases §10) | Read unfiltered header; read pairs from displayed cards | Cards visible and header shows a count |
| 2 | Select the Job Title and the Location of the DATA-012 pair; click Search. | Open each label-anchored dropdown, click the option with the exact text; click Search. Missing option: A → `[TEST DATA] test data not available: DATA-012`; B → the option click fails (element not found) | Listbox visible; dropdown shows the chosen text |
| 3 | Wait until result cards are displayed; read the results header and note the filtered record count k ("(k) Records Found", or "(1) Record Found" when k is 1). | Wait for the header to change from the unfiltered text (A: bounded, result logged; B: fails on timeout); then cards visible and count pattern; k parsed; k < unfiltered else `[TEST DATA]` | Header changed; cards visible; count pattern |
| 4 | Click the first result card; then click the panel's arrow icon. | Click first card in the results container; click the arrow icon in the detail panel | Panel visible; then panel hidden |
| 5 | Click Reset. | Note header text; click Reset | — |
| 6 | Wait until employee result cards are displayed, then read the results header. | Wait for the header to change (A: bounded, result logged; B: fails on timeout); cards visible; read header, Employee Name value, both dropdown texts | Header changed; cards visible |

## 5. Locators

| ID | Element | Locator (A, as in code) | Locator (B, as in code) | Strategy | Source | Notes |
|---|---|---|---|---|---|---|
| L-01 | Login user name | `input[name="username"]` | `By.name("username")` | attribute | Verification 2026-10-18 (read-only Playwright MCP evaluate on `/auth/login`) | Login page is a dependency (OBS-001) |
| L-02 | Login password | `input[name="password"]` | `By.name("password")` | attribute | same verification | |
| L-03 | Login button | `form button[type="submit"]` | `//form//button[@type='submit']` | attribute | same verification | Only submit button on the form |
| L-04 | Employee Name input | `//label[normalize-space()='Employee Name']/ancestor::div[.//input][1]//input` | same XPath | label_anchored | LOC-001 | |
| L-05 | Job Title dropdown | `//label[normalize-space()='Job Title']/ancestor::div[.//div[contains(@class,'oxd-select-text-input')]][1]//div[contains(@class,'oxd-select-text-input')]` | same XPath | label_anchored | LOC-002 | Anchored to its label, not to position |
| L-06 | Location dropdown | as L-05 with `'Location'` | same XPath | label_anchored | LOC-003 | |
| L-07 | Dropdown option | `getByRole('listbox').getByRole('option', { name, exact: true })` | `//div[@role='listbox']//div[@role='option'][normalize-space()=<literal>]` | role | LOC-004 | Option text from DATA-012 |
| L-08 | Search / Reset | `form button[type="submit"]` / `form button[type="reset"]` | `//form//button[@type='submit']` / `[@type='reset']` | attribute | LOC-006 / LOC-007 | |
| L-09 | Results header | `span.oxd-text--span` filtered by text `/Records? Found$/` | `//span[contains(@class,'oxd-text--span')][contains(normalize-space(),'Found')]` | text | LOC-008 | Anchored on the text pattern (class is generic) |
| L-10 | Result cards | `.orangehrm-container .orangehrm-directory-card` | `//div[contains(@class,'orangehrm-container')]//div[contains(concat(' ',normalize-space(@class),' '),' orangehrm-directory-card ')]` | structural | LOC-009 inside LOC-015 | First card = `(…)[1]` / `.first()` (the step names "the first result card") |
| L-11 | Card fields | `.orangehrm-directory-card-subtitle`, `.orangehrm-directory-card-description` (2nd), `.orangehrm-directory-card-header` | `.//p[contains(@class,…)]` equivalents | structural | LOC-009; EVD-003 (card body: sub-unit then location), OBS-008 | Scoped to one card |
| L-12 | Detail panel / arrow icon | `.orangehrm-corporate-directory-sidebar`, `… i.bi-arrow-right` | `//div[contains(@class,'orangehrm-corporate-directory-sidebar')]` / `…//i[contains(@class,'bi-arrow-right')]` | attribute | LOC-011 | |

None of: generated classes, absolute XPath, unanchored indexes, MCP refs.

## 6. Test Data and Credentials

| Item | Source at run time | Notes |
|---|---|---|
| DATA-001 | Environment variables `QA_USERNAME`, `QA_PASSWORD` (values never recorded) | Fail fast with `[CONFIGURATION] Missing required environment variable: <NAME>`. A: login step not traced. B: `typeSecure` (Allure shows "Type securely"). IDE run configurations list the names with empty values |
| DATA-012 | Read from a displayed card (see §4) | No fixed names or counts. Runs on 2026-10-18 resolved "Probation Trainee PLW1462" + "New York Sales Office" (k = 6) |
| Other settings | `QA_BASE_URL`, `QA_BROWSER`, `QA_HEADLESS` (both); `QA_ARTIFACTS_DIR`, `QA_RUN_ID`, `QA_TIMEOUT_MS` (A only — B waits 30 s and its evidence is SHAFT's report) | Non-secret, with defaults |

## 7. Waits, Assertions and Failure Handling

- Waits: login form visible; Directory URL + Search visible; listbox visible; dropdown text equals the chosen option; results header changed from the previous text (A: bounded, the result is logged and the approved assertion still decides; B: a timeout fails the test); cards visible and header shows a count; detail panel visible / hidden. Timeout: A `QA_TIMEOUT_MS` = 30 000 ms; B one `WebDriverWait` of 30 s per page object. No fixed sleeps, no `networkidle`.
- Assertions: the approved expected result only, five parts. A uses retrying web-first waits plus `expect.soft` on values read once the state is reached (messages "TC-054 expected: …"); B uses TestNG `SoftAssert` + `assertAll()` with My Bookings-style messages ("… should …", actual header included).
- Failure evidence: `automation-execution/results/<run-id>/<framework>/TC-054/` — `steps.log` always; `final.png` on pass; `failure.png` on failure; A adds `trace.zip` (steps after login). B writes no evidence files of its own: SHAFT records every action with a screenshot in its Allure report (`whenToTakeAScreenshot=Always`); the report is copied into each run folder. Machine-readable: A `results.json`, `junit.xml`, HTML report; B `testng-results.xml`, Surefire reports, Allure results and single-file Allure HTML.
- Test-data and configuration failures are labeled `[TEST DATA]` / `[CONFIGURATION]` so they cannot be mistaken for assertion failures (B: `[TEST DATA]` messages on two hard `Assert` checks).
- Retries: 0 in both (Playwright `retries: 0`; SHAFT `retryMaximumNumberOfAttempts=0`; Surefire `rerunFailingTestsCount=0`).

## 8. How to Run

### Command line (Claude Code)

```
# both: set QA_USERNAME and QA_PASSWORD in the environment (names only here)
cd automation/playwright-ts && npx playwright test
cd automation/shaft-java    && mvn test     # JAVA_HOME = a JDK 21
# Windows profile path with a space: mvn test "-Dshaft.extraArgLine=-Duser.home=<8.3 short path>"
```

### IDE

IntelliJ IDEA Community: open each project folder separately (`pom.xml` as project for B). Shared run configurations in `.run/`: **TC-054 Playwright TS** (Shell Script) and **TC-054 SHAFT** (TestNG suite). Fill `QA_USERNAME` / `QA_PASSWORD` locally in Edit Configurations; they stay in the local workspace.

### First-run setup

A: `npm ci` and `npx playwright install chromium`. B: the first `mvn test-compile` downloads SHAFT and its dependencies (≈ 73 s here); on the first run SHAFT downloads its Allure CLI (2.35.1) and writes default property and listener files into the project (ignored by `.gitignore`).

## 9. Static Validation

| Check | Description | Result | Command / notes |
|---|---|---|---|
| SV-1 | Build / compile | pass | A: `npx tsc --noEmit` (0 errors). B: `mvn test-compile` with JDK 21 (exit 0) |
| SV-2 | Test discovery = selected cases | pass | A: `npx playwright test --list` → 1 test (TC-054). B: `testng.xml` → 1 class, 1 test method |
| SV-3 | Forbidden patterns | pass | No `Thread.sleep`, `waitForTimeout`, `networkidle`, implicit waits or retries > 0 in either project |
| SV-4 | Secret scan | pass | No credential values in sources, configs, run configurations (empty env values), or any run output (149 files + 105 zip members scanned, 0 hits) |
| SV-5 | Traceability (steps, locators, data) | pass | Steps labeled with the verbatim approved text; every locator traced in §5; DATA-001/DATA-012 resolvers in §6 |
| SV-6 | Asserted expected result = approved | pass | §4: five parts of the verbatim expected result; nothing else asserted |
| SV-7 | Approved upstream artifacts unchanged | pass | TestCases MD/CSV, TestReview, ExecutionReport, ExecutionProblemReview, BugReports, BugReportTracker.xlsx, ProjectContext, ExplorationReport, PRD, TaskContext hashes equal the approved ones (2026-10-18) |

Execution results are not part of this report: see `automation-execution/` and `reports/FrameworkComparison.md`.

## 10. Risks, Assumptions and Open Questions

| ID | Type | Description | Impact | Owner |
|---|---|---|---|---|
| AG-R01 | Risk | Shared demo data changes during a session (OBS-021): DATA-012 pairs and counts differ between runs | Handled by the data-aware design (k and N read in the same run) | — |
| AG-R02 | Risk | PB-001 transient "No Records Found" while loading | Header read only after cards are displayed | — |
| AG-R03 | Assumption | The header change after Search/Reset signals the new result set (no loader or API signal is established in the exploration evidence) | A missing reload after Reset still fails the approved N > k assertion with real values | — |
| AG-R04 | Risk | SHAFT 10.1 needs `-Duser.home=<short path>` on Windows profiles with a space (H-003); newer SHAFT requires JDK 25 | Documented in README; version pinned | not stated |
| AG-R05 | Risk | Playwright browsers are tied to the exact Playwright version (E-001) | First-run setup documented | — |
