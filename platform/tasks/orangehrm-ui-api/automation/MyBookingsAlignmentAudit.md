# SHAFT TC-054 vs My Bookings: Alignment Audit

| Field | Value |
|---|---|
| Date | 2026-10-18 |
| Scope | Framework B (`automation/shaft-java/`), TC-054 only |
| Reference | `C:\Users\QC User\NDC-Uplift-Automation` (My Bookings) |
| Status | **Audit only.** No source file was changed. Awaiting review and approval. |

## 0. Files compared

| Short | My Bookings file | Short | Current TC-054 file (under `automation/shaft-java/`) |
|---|---|---|---|
| MB-TC | `src/test/java/PortalPages/MyBookings/MyBookings_TC.java` | TC | `src/test/java/OrangeHRMPages/Directory/Directory_TC.java` |
| MB-P | `src/main/java/PortalPages/MyBookings/MyBookings_Page.java` | DP | `src/main/java/OrangeHRMPages/Directory/Directory_Page.java` |
| MB-BD | `src/main/java/PortalPages/MyBookings/BookingDetails_Page.java` | EP | `src/main/java/OrangeHRMPages/Directory/EmployeeDetails_Panel.java` |
| MB-LP | `src/main/java/PortalPages/Login/Login_Page.java` | LP | `src/main/java/OrangeHRMPages/Login/Login_Page.java` |
| MB-SM | `src/main/java/PortalPages/SideMenu.java` | — | (no equivalent needed) |
| MB-CM | `src/main/java/Drive_Factory/CommonMethod.java` | CM | `src/main/java/Drive_Factory/CommonMethod.java` |
| MB-DU | `src/main/java/utilities/DataUtils.java` | DU | `src/main/java/utilities/DataUtils.java` |
| — | (none) | SL / TDE | `src/main/java/utilities/StepLogger.java`, `TestDataUnavailableException.java` |
| MB-JSON | `src/test/resources/testDataFiles/PortalMyBookings.json` | JSON | `src/test/resources/testDataFiles/OrangeHRMDirectory.json` |
| MB-ENV | `src/test/resources/Environment.properties` (keys only were read; values not printed) | ENV | `src/test/resources/Environment.properties` |
| MB-SUITE | `src/test/resources/RegressionFile.xml` (does not list `MyBookings_TC`) | NG | `testng.xml` |
| MB-POM | `pom.xml` | POM | `pom.xml` |
| MB-RPT | `src/main/resources/properties/default/Reporting.properties` | CP | `src/main/resources/properties/custom.properties` |

Line numbers refer to the files as they are today.

## 1. Comparison table

Classification: **Required** = change to match My Bookings. **Intentional** = must stay different (reason given). **Optional** = would align more closely, but is not needed. **Decision** = conflicts with the approved scenario; needs your call.

| # | Area | My Bookings | Current TC-054 | References | Difference and impact | Recommended alignment | Class |
|---|---|---|---|---|---|---|---|
| 1.1 | Packages, naming | `PortalPages.MyBookings` in both `src/main` (pages) and `src/test` (test); `<Feature>_TC`, `<Feature>_Page`; `Drive_Factory`, `utilities` | `OrangeHRMPages.Directory` / `OrangeHRMPages.Login`; `Directory_TC`, `Directory_Page`, `Login_Page`; same `Drive_Factory`, `utilities` | MB-TC:1,17; MB-P:1,42; TC:1,29; DP:1,37 | Matches. | None. | — |
| 1.2 | Second page object name | Every page object is `_Page`, including the details screen (`BookingDetails_Page`); components have no suffix (`SideMenu`) | `EmployeeDetails_Panel` introduces a new `_Panel` suffix | MB-BD:22; MB-SM:15; EP:14 | Naming that does not exist in My Bookings. | Rename to `EmployeeDetails_Page`. | Required |
| 1.3 | Extra utility classes | None besides `DataUtils`, `CommonMethod` | `StepLogger`, `TestDataUnavailableException` | SL:24; TDE:4 | Not in My Bookings. They provide the platform's evidence files and the test-data vs defect distinction (see 10.1, 4.4). | Keep. | Intentional |
| 2.1 | Class lifecycle | `@BeforeClass`: JSON, `setupDriver`, `getDriver`, `maximizeBrowser`, chained login, first page wait. `@AfterClass(alwaysRun = true)`: `quitDriver()` only | Same `@BeforeClass` shape plus `StepLogger`; `@AfterClass(alwaysRun = true)` also writes fallback evidence | MB-TC:27-47, 62-65; TC:40-63, 74-83 | Structure matches. The extra evidence fallback is the only difference. | Keep the fallback (10.1). | Intentional |
| 2.2 | Login placement | Login is setup in `@BeforeClass`; no test asserts on it | Approved **step 1** (open the Directory URL, redirect, log in) also runs in `@BeforeClass` | MB-TC:35-46; TC:53-62 | If step 1 fails, TestNG reports a configuration failure and **TC-054 as SKIPPED**, not FAILED. The approved flow's first step is judged outside the test. B8/B9 setup times also inflate `runner_total` but not the test duration. | Either keep (matches My Bookings) or keep only driver + window in `@BeforeClass` and run precondition + step 1 as the first chained calls of the `@Test`. Recommended: move it into the `@Test`. | **Decision** |
| 2.3 | `@BeforeMethod` | `openCleanMyBookingsPage()` resets state and hard-asserts a clean form before each test | None | MB-TC:54-59 | One test per class here, so nothing to reset. A second test would need it. | Do not add for one test. | Optional |
| 2.4 | `@AfterMethod` | None in `MyBookings_TC` (siblings use it only to quit, e.g. `ImportPnr_TC:43-46`) | `saveEvidence(ITestResult)` writes screenshot + `steps.log` | TC:66-71 | Required by platform principle 3 (evidence per run, referenced in the journal). | Keep. | Intentional |
| 2.5 | `@Test` attributes | `@Test(priority = n)` with a Javadoc line; no `description` | `@Test(priority = 1, description = "...")` plus Javadoc | MB-TC:67-69; TC:85-87 | Extra attribute; the Allure name comes from it. | Remove `description`, keep the Javadoc. | Optional |
| 2.6 | Method name | `TC01_verifyThat...` (class-local number) | `TC054_verifyThatResetRestoresDefaultsAfterCombinedFilterAndEmployeeDetails` | MB-TC:69; TC:87 | Same pattern; the number is the approved case ID, which the metrics extractor and journal trace by. | Keep `TC054_`. | Intentional |
| 3.1 | `setupDriver` signature | `setupDriver(String browser)` | `setupDriver(String browser, boolean headless, int timeoutMs)` | MB-CM:14; CM:19 | Not a drop-in of the shared utility. Needed because the walkthrough runs headed and CI runs headless; My Bookings only goes headless on Linux. | Keep the two parameters, documented as the one extension. | Intentional |
| 3.2 | `setupDriver` body | Explicit `EDGE` branch, then `CHROME` with prefs and the 3 common args, Linux block (`--headless=new`, `--no-sandbox`, `--disable-dev-shm-usage`, `--disable-gpu`), else | `EDGE` folded into `else`; headless block merged with `--window-size`; three `SHAFT.Properties...set()` lines | MB-CM:18-58; CM:24-62 | Same behaviour, different layout. A reviewer cannot diff it against the shared original. | Restore My Bookings' branch order and comments verbatim; add only the headless/timeout lines. | Required |
| 3.3 | Redundant settings | — | `retryMaximumNumberOfAttempts(0)`, `autoMaximizeBrowserWindow(false)` duplicate CP:8,13; `--window-size` duplicates `maximizeBrowser()`'s resize (B9: headless maximize returned 800×600 and was resized) | CM:26, 50; CP:8,13; TC:167-172 | Dead configuration. | Remove line 26 and `--window-size`; keep the timeout `set()`. Re-verify headless with a run. | Optional |
| 3.4 | Window and browser | `maximizeBrowser()` resizes below 1280 px; `resolveBrowser()` handles the `{{BROWSER}}` placeholder | Same `maximizeBrowser()`; `resolveBrowser()` maps blank/`chromium` to `chrome` | MB-TC:559-576; TC:167-181 | `chromium` is the documented `QA_BROWSER` value shared with Playwright. | Keep. | Intentional |
| 4.1 | JSON loading and access | `new SHAFT.TestData.JSON("PortalMyBookings.json")`; `testData.getTestData("expected.x")` inline in assertions | Same constructor and access | MB-TC:29, 76-79; TC:42, 141-149 | Matches. | None. | — |
| 4.2 | JSON structure | Business data blocks + `expected` block; no comment or metadata keys | `_comment`, `testCase.{id,dataPairId}`, `expected.{defaultOption,resultsHeaderPattern}` | MB-JSON:1-39; JSON:1-11 | `_comment` and `testCase` are not My Bookings conventions. | Remove `_comment` (move the note to the README); keep `testCase` (used by `StepLogger` and data-error messages) or turn it into constants. | Optional |
| 4.3 | Dynamic data | Static approved booking, plus runtime discovery in a private TC helper (`discoverApprovedBooking()`, record `DiscoveredBooking`) | Runtime DATA-012 pair in a private TC helper (`firstDisplayedPair`), record `JobTitleLocationPair` declared in the page | MB-TC:488-529; TC:158-165; DP:190-203, 219-220 | Same pattern; record placement differs. Values cannot be static (no hard-coded titles, locations or counts). | Keep runtime data. Optionally move the record into the TC like `DiscoveredBooking`. Since the page builds it, keeping it in the page is simpler. | Intentional |
| 4.4 | Missing-data handling | `requireValue()` → `Assert.assertFalse` (an assertion failure) | `TestDataUnavailableException` (`[TEST DATA] ...`) | MB-TC:550-553; TC:102, 109-111, 115-117, 161-163 | Data unavailability must not be reported as a product failure (platform classification). | Keep. | Intentional |
| 4.5 | `DataUtils.get` | Reads `Environment.properties` only; static block swallows `IOException`; also `getJsonData`, `getPropertyValue` (unused by My Bookings) | Environment variable first, then properties; throws on missing file; `getRequired()` | MB-DU:15-63; DU:15-43 | Needed for env-only credentials. My Bookings' `getJsonData` builds `testDataFiles` + name without `/`, so it is not copied. | Keep. | Intentional |
| 5.1 | Login chain | `new Login_Page(driver).navigateToLoginPage(url).enterAgencyCode().enterEmail().enterPassword().clickLoginButton();` | `new Login_Page(driver).navigateToLoginPage(dirUrl)`, then a log line, then `loginPage.enterUsername().enterPassword().clickLoginButton();` | MB-TC:35-40; TC:54-59 | Split in two to log the redirect URL between them. | One chain; log the redirect afterwards from the page that follows, or keep the split for the step-1 evidence line. | Optional |
| 5.2 | `clickLoginButton` return | Returns `Login_Page` | Returns `void` | MB-LP:102-105; LP:59-61 | Breaks the "every action returns a page" rule. | Return `this`. | Required |
| 5.3 | Wait method name | `waitUntilLoaded()` | `waitUntilDisplayed()` | MB-LP:60-63; MB-P:145; LP:40-45 | Naming inconsistency; My Bookings uses `waitUntilLoaded` on every page. | Rename to `waitUntilLoaded()` (returning `this`, as in MB-P). | Required |
| 5.4 | Typing credentials | `driver.element().type(...)` | `driver.element().typeSecure(...)` | MB-LP:79, 85; LP:50, 55 | SHAFT masks the values in its report; credentials must never appear in logs or reports. | Keep. | Intentional |
| 5.5 | Login URL | `Portal_Url` is the login URL | Opens the protected Directory URL and expects the redirect (`navigateToURL(url, "/auth/login")`) | MB-TC:36; LP:35-38 | Required by approved step 1 ("Open the Directory URL"). `navigateToLoginPage` with a Directory URL reads oddly. | Keep the behaviour; optionally rename the parameter or the method. | Intentional |
| 5.6 | Post-login wait | `waitUntilLoggedIn()` exists, but MB-TC uses `navigateViaSideMenu()` as the post-login wait | `Directory_Page.waitUntilLoaded()` (URL + Search button) | MB-TC:42-46; TC:61 | Same idea. | None. | — |
| 6.1 | Locator declarations | `private final By` with type prefixes (`Txt_`, `Btn_`, `Ddl_`, `Dpick_`, `Tbl_`, `Dlg_`, `Lnk_`), section banners `// ---------- X ----------` | Same style; adds `Lst_` (DP:52) and `Pnl_` (EP:20) | MB-P:50-95; MB-BD:29-50; DP:48-66; EP:20-21 | Two prefixes My Bookings never uses. Its closest equivalents are `Dlg_` (overlay, MB-P:95) and `Txt_...Root` (container, MB-BD:29). | `Lst_DropdownOptions` → `Dlg_DropdownListbox`; `Pnl_EmployeeDetails` → `Txt_EmployeeDetailsRoot`. | Optional |
| 6.2 | Login_Page locator style | Non-final `private By` grouped by `// Text Fields`, `// Buttons` comments | `private final By`, no group comments | MB-LP:11-52; LP:24-26 | My Bookings is itself inconsistent (Login vs MyBookings pages); TC follows the newer MB-P style. | Add the group comments; keep `final` (as in MB-P and MB-BD). | Optional |
| 6.3 | Dynamic locators | Private helper methods (`dropdownOption`, `rowByBookingReference`) or `private static By detailValue` | `private static By selectFor`, `dropdownOption` + `xpathLiteral` | MB-P:97-118; MB-BD:52-54; DP:68-75, 256-260 | Same pattern. `xpathLiteral` guards option text with quotes (runtime data). | Keep. | Intentional |
| 6.4 | Relative card locators | Not used (column-index XPaths) | `.//p[...]` searched inside each card element | DP:64-66, 192-199 | OrangeHRM renders cards, not a table, and has no ids. | Keep. | Intentional |
| 6.5 | Routes and URL helper | `private static final String DETAILS_ROUTE`; site root derived inside `navigateFromDashboard` | `public static final DIRECTORY_ROUTE`; `public static urlFor(baseUrl)` used by the test | MB-BD:25; MB-P:138-142; DP:39, 83-85; TC:55 | Exposes page internals to the test. | Make the route `private`; add `Directory_Page.navigateToDirectoryUrl(baseUrl)` or give `Login_Page` the URL from `DataUtils`. | Optional |
| 6.6 | Value getters | `normalize(driver.element().getText(x))`; private `getInputValue(By)` via `getAttribute("value")`; `elementCount(By)` | `driver.element().get().text(x)`, `get().domProperty(x,"value")`; inline `findElements().isEmpty()` | MB-P:254-256, 437-443; DP:174-184, 235 | Different SHAFT APIs for the same reads. `getAttribute` is deprecated in Selenium 4.40, and the SHAFT 10.1 replacements are already used here. | Add My Bookings-named private helpers (`getInputValue`, `elementCount`) implemented with the SHAFT 10.1 calls. | Optional |
| 6.7 | Unused API | — | `EmployeeDetails_Panel.isDisplayed()` is not called | EP:45-47 | Dead code. | Rename to My Bookings style (`isEmployeeDetailsDisplayed`) only if a check uses it; otherwise remove. | Optional |
| 6.8 | Page exceptions | `IllegalStateException` with the actual value (`"Dropdown option 'x' was not selected - label shows 'y'"`) | Public nested `OptionNotOfferedException`; selection timeout message without the actual label | MB-P:346-353; DP:223-227, 232-242 | The nested type lets the test classify "option not offered" as a data problem (4.4). The timeout message is less informative than My Bookings'. | Keep the exception; adopt My Bookings' try/catch so the actual label appears. | Intentional / Optional |
| 7.1 | Search and wait encapsulation | `clickSearch()` clicks and then waits for the response internally (`waitForSearchResponse`); the test never calls a wait | `clickSearch()` / `clickReset()` only click; the test must call `waitUntilResultsUpdated()` next | MB-P:222-229, 360-367; DP:119-149; TC:104-107, 126-129 | A caller can forget the wait; the two-call protocol does not exist in My Bookings. | `clickSearch()` / `clickReset()` click and wait (private `waitForResultsUpdate()`); keep `wasResultsHeaderUpdated()` public. The step labels and log lines stay the same. | Required |
| 7.2 | Chain to Search | `myBookingsPage.enterX(...).enterY(...).clickSearch();` in one statement | Two selections in `try`, then `clickSearch()` separately | MB-TC:101-102, 144-146; TC:98-104 | Broken chain. | `selectJobTitle(..).selectLocation(..).clickSearch()` in one chain inside the same `try`. | Required |
| 7.3 | Moving to the next page object | An action returns `this` (`clickOrderIdForBookingReference`); the test creates the next page: `new BookingDetails_Page(driver).waitUntilLoaded(orderId)` | `openFirstEmployeeDetails()` returns the panel; `panel.close()` returns `Directory_Page`; package-private 3-arg constructor | MB-P:246-250; MB-TC:172-174; DP:153-157; EP:23-43 | A different navigation model (page-returns-page) that My Bookings does not use. | `Directory_Page.clickFirstEmployeeCard()` returns `this`; the test calls `new EmployeeDetails_Page(driver).waitUntilLoaded().clickCloseIcon();`, which waits for the panel to close. Public `(driver)` constructor. | Required |
| 8.1 | Timeouts | Per-page `private static final Duration` (`SEARCH_TIMEOUT`, `LOAD_TIMEOUT` = 30 s); constructor takes only the driver | `Directory_Page(driver, timeoutMs)`, the panel gets a `Duration`, but `Login_Page` has a fixed `LOAD_TIMEOUT` 30 s | MB-P:44, 120-122; MB-BD:24, 56-58; DP:44, 77-80; EP:18, 23; LP:19 | Inconsistent inside TC-054 and unlike My Bookings. | All pages: `(SHAFT.GUI.WebDriver driver)` constructor + `private static final Duration LOAD_TIMEOUT = Duration.ofSeconds(30)`. `QA_TIMEOUT_MS` then only sets SHAFT's element timeout; update the README. | Required |
| 8.2 | Wait construction | Inline `new WebDriverWait(...).withMessage(...)` | `waiter(message)` helper | MB-P:208-211, 238-241; DP:244-248 | Cosmetic. | Inline, as My Bookings does. | Optional |
| 8.3 | Result-refresh signal | Staleness of the previous result element, then a "settled" predicate | Header text must change (bounded); the result is kept in a flag instead of failing | MB-P:360-377; DP:137-149 | Exploration established no loader or API signal (OBS-019), and it is unverified whether OrangeHRM replaces the card nodes. Failing inside the wait would also pre-empt the approved checks. | Keep the header signal; a staleness signal needs a live check first. | Intentional |
| 8.4 | Normalization | `private static normalize`: `replaceAll("\\s+"," ").trim()` | Identical | MB-P:445-447; DP:262-264 | Matches. | None. | — |
| 9.1 | SoftAssert usage | `SoftAssert softAssert = new SoftAssert();` … `softAssert.assertAll();`; hard `Assert` for preconditions | Same; preconditions use `TestDataUnavailableException` | MB-TC:72-92, 212-217; TC:142-153 | Matches, except 4.4. | None. | — |
| 9.2 | Assertion layout and messages | Arguments on separate lines; getters called inline; messages like `"... should ..."` / `"... is wrong"` | Values read into locals first (needed for the `observed` log); messages prefixed `"TC-054 expected: ..."` | MB-TC:73-91; TC:131-152 | Style only; the meaning is identical. | Use the multi-line layout and My Bookings wording, keeping the actual values in each message. Keep the locals (evidence). | Optional |
| 10.1 | Screenshots and logging | No custom evidence; SHAFT listener + Allure; MB default `screenshotParamsWhenToTakeAScreenshot=Never` | `StepLogger`: approved step text, observed values, `final.png` / `failure.png`, `steps.log` under `QA_ARTIFACTS_DIR/QA_RUN_ID` | MB-RPT:18; SL:34-85; TC:50-138 | Required by the platform's evidence and journal rules. Execution metrics and runs B1–B9 depend on this layout. | Keep. | Intentional |
| 10.2 | Stale config comment | — | CP lines 2-3 say values "are also applied at run time by `support/BaseTest.java`", a class the refactor removed | CP:2-3 | Incorrect documentation. | Point it to `Drive_Factory/CommonMethod.java`. | Required |
| 10.3 | Ineffective setting | — | `screenshotParams_whenToTakeAScreenshot=ValidationPointsOnly` only applies to SHAFT validations, which TC-054 no longer uses (TestNG `SoftAssert`) | CP:16-17 | No longer does anything; `StepLogger` provides the screenshots. | Set it to `Never` (as My Bookings does) or leave it with a comment. | Optional |
| 11.1 | Credentials | `Portal_Email`, `Portal_Password` (and DB credentials) stored in `Environment.properties` | Only in the `QA_USERNAME` / `QA_PASSWORD` environment variables; `getRequired` names the variable, never its value | MB-ENV:9-14 (keys); DU:35-43; ENV:1-3; TC:57-58 | Your explicit instruction and the CLAUDE.md Secrets Rule. | Keep. | Intentional |
| 11.2 | Setting key names | `browser`, `Portal_Url` | `QA_BROWSER`, `QA_BASE_URL`, `QA_HEADLESS`, `QA_TIMEOUT_MS`, `QA_ARTIFACTS_DIR` | MB-ENV:1-7; ENV:4-8 | These names are the shared environment contract with the Playwright framework and the run configurations. | Keep. | Intentional |
| 12.1 | Maven | SHAFT 7.4.20231015, Java 17, Surefire 3.1.2, `testng`/`junit` profiles, listener via Surefire properties, extra dependencies (javafaker, junit, javax.mail) | SHAFT 10.1.20260123, Java 21, Surefire 3.5.4, one dependency, `suiteXmlFiles`, `rp.enable=false` (H-002), `shaft.extraArgLine` (H-003), `rerunFailingTestsCount=0` | MB-POM:12-133; POM:18-75 | Java 21 is a requirement (10.1.20260123 is the last SHAFT release for it); H-002/H-003 are healed defects. | Keep. Do not copy unused dependencies or profiles. | Intentional |
| 12.2 | Suite file | `src/test/resources/RegressionFile.xml`: `parallel="false" preserve-order="true" verbose="2"`, `<test name="X Module">`, `<methods><include .../></methods>`; does not include `MyBookings_TC` | `testng.xml` at the project root with a `<listeners>` element | MB-SUITE:3-13; NG:1-12 | Format differs; the file location is referenced by POM:52, the README and `.run/TC-054 SHAFT.run.xml`. | Adopt My Bookings' attributes and `<methods><include>` in `testng.xml`; keep the file where it is. | Optional |
| 12.3 | Listener registration | `META-INF/services` + Surefire `listener` property, `usedefaultlisteners=false` | `META-INF/services` **and** `testng.xml` `<listeners>` | MB-POM:120-129; NG:4-6; `src/test/resources/META-INF/services/org.testng.ITestNGListener` | Registered twice. TestNG normally de-duplicates by class; not verified here. | Remove the `<listeners>` element (My Bookings relies on META-INF); confirm with a run. | Optional |

## 2. Key excerpts

**7.1 Search waits for its own response (My Bookings) vs a separate wait (TC-054)**

```java
// MB-P:223-229
public MyBookings_Page clickSearch() {
    hideChatWidget();
    WebElement previousResult = currentResultElement();
    driver.element().click(Btn_Search);
    waitForSearchResponse(previousResult);
    return this;
}
```
```java
// DP:120-124, then TC:104-107
public Directory_Page clickSearch() {
    headerBeforeLastAction = getResultsHeader();
    driver.element().click(Btn_Search);
    return this;
}
...
directoryPage.clickSearch();
stepLog.step(3, "...");
directoryPage.waitUntilResultsUpdated();
```

**7.3 Next page: created by the test (My Bookings) vs returned by the page (TC-054)**

```java
// MB-TC:172-174
myBookingsPage.clickOrderIdForBookingReference(bookingReference);
BookingDetails_Page bookingDetailsPage = new BookingDetails_Page(driver).waitUntilLoaded(orderId);
```
```java
// TC:121-122
directoryPage.openFirstEmployeeDetails()
             .close();
```

**8.1 Timeouts**

```java
// MB-BD:24, 56-58
private static final Duration LOAD_TIMEOUT = Duration.ofSeconds(30);
public BookingDetails_Page(SHAFT.GUI.WebDriver driver) { this.driver = driver; }
```
```java
// DP:77-80 and LP:19 (two styles in the same project)
public Directory_Page(SHAFT.GUI.WebDriver driver, int timeoutMs) { ... Duration.ofMillis(timeoutMs); }
private static final Duration LOAD_TIMEOUT = Duration.ofSeconds(30);
```

**11.1 Credentials**

```java
// MB-TC:38-39 (values come from Environment.properties)
.enterEmail(DataUtils.get("Portal_Email"))
.enterPassword(DataUtils.get("Portal_Password"))
```
```java
// TC:57-58 (values come only from environment variables)
loginPage.enterUsername(DataUtils.getRequired("QA_USERNAME"))
         .enterPassword(DataUtils.getRequired("QA_PASSWORD"))
```

## 3. What any refactor must preserve

| Item | Where it is today | Rule for the refactor |
|---|---|---|
| Precondition + step 1 (no session → Directory URL → redirect → login) | TC:50-62 | Same actions and logged step text |
| DATA-012 pair from the first displayed card with a job title and a location | TC:91-95, 158-165; DP:190-203 | Unchanged logic; no hard-coded names, titles, locations or counts |
| Step 2 select Job Title + Location, Search; option-not-offered → `TestDataUnavailableException` | TC:97-104 | Same classification |
| Step 3 filtered count `k`; header must change; `k < unfiltered` else data error | TC:106-117 | Same checks and the same `TestDataUnavailableException` cases |
| Step 4 open the first card's details, close with the arrow | TC:119-123; EP:29-43 | Same waits (opened, then closed) |
| Steps 5–6 Reset, wait, read the state | TC:125-138 | Same reads |
| Five checks: Employee Name `""`; Job Title = `expected.defaultOption`; Location = `expected.defaultOption`; header matches `expected.resultsHeaderPattern`; `n != null && n > k`; `assertAll()` | TC:141-153 | Unchanged expressions and expected values; messages may be reworded only if their meaning is kept |
| Credentials | DU:35-43; LP:49-57 | Environment variables only, `typeSecure`, never logged |
| Evidence | SL; `automation-execution/results/run-*-B1` … `B9` | Existing folders untouched; a new run gets a new run ID (B10) |
| Approved upstream hashes | TestCases.md 919763334220…, CSV 8ebc02a66e37…, TestReview 16997b9e2cfc…, ExecutionReport 91079c3841a5…, BugReports fdf88544f341…, PC 0b0dcc57d5fc…, ER 0edc9da6ebc9…, PRD 0f5b808c178c… | Not edited. The refactor changes only `automation/shaft-java/`, and then `AutomationGeneration.md` (v1.2.0 hash table), `execution-metrics.json` and a new journal event |
| Playwright framework | `automation/playwright-ts/` | Not touched |

## 4. Final decision list (prioritized)

### Must match My Bookings

1. **7.1** `clickSearch()` / `clickReset()` wait for the result update themselves (private wait); remove the public `waitUntilResultsUpdated()`; keep `wasResultsHeaderUpdated()`.
2. **7.3 + 1.2** Rename `EmployeeDetails_Panel` → `EmployeeDetails_Page` with a public `(driver)` constructor, `waitUntilLoaded()` and `clickCloseIcon()`. `Directory_Page.clickFirstEmployeeCard()` returns `this`, and the test creates the details page itself.
3. **8.1** Every page constructor takes only the driver; timeouts become `private static final Duration LOAD_TIMEOUT = Duration.ofSeconds(30)`. The README states that `QA_TIMEOUT_MS` sets SHAFT's element timeout only.
4. **7.2** One chain: `selectJobTitle(..).selectLocation(..).clickSearch()`, inside the existing `try`.
5. **5.2 + 5.3** `Login_Page.clickLoginButton()` returns `this`; `waitUntilDisplayed()` → `waitUntilLoaded()`.
6. **3.2** `CommonMethod.setupDriver` follows My Bookings' branch order and comments verbatim, plus only the headless/timeout lines.
7. **10.2** Fix the `custom.properties` comment that names the removed `BaseTest.java`.

### Must remain different (valid reasons)

- Credentials only in environment variables; env-first `DataUtils.get`, `getRequired`, `typeSecure` (11.1, 4.5, 5.4).
- DATA-012 read at run time; `TestDataUnavailableException` and `OptionNotOfferedException` to separate data problems from product failures (4.3, 4.4, 6.8).
- `StepLogger`, `@AfterMethod` evidence and the `@AfterClass` fallback (10.1, 2.4, 2.1).
- `TC054_` method prefix with the approved ID (2.6).
- Header-change refresh signal that records the outcome instead of failing (8.3).
- SHAFT 10.1.20260123 / Java 21, `rp.enable=false`, `shaft.extraArgLine`, no reruns (12.1).
- Name and relative-XPath locators for OrangeHRM's card layout (6.4); opening the protected Directory URL for step 1 (5.5).
- `setupDriver` headless/timeout parameters; `QA_*` setting names; `chromium` alias (3.1, 11.2, 3.4).

### Needs your decision

- **2.2** Keep the precondition and step 1 in `@BeforeClass` (as My Bookings does; a login failure is then reported as SKIPPED) or run them inside the `@Test` (a login failure is then FAILED TC-054). Recommended: inside the `@Test`, with only driver setup and window size in `@BeforeClass`.

### Optional (not needed for alignment)

- 2.5 drop `@Test(description)`; 3.3 remove redundant settings; 4.2 drop `_comment`; 5.1 single login chain; 6.1 `Lst_`/`Pnl_` prefixes; 6.2 group comments in `Login_Page`; 6.5 private route + navigation method; 6.6 My Bookings-named helpers; 6.7 unused `isDisplayed()`; 6.8 actual-label message on a selection timeout; 8.2 inline waits; 9.2 assertion layout and wording; 10.3 screenshot setting; 12.2 suite attributes; 12.3 single listener registration.

### After approval

Apply the approved items only, compile, run TC-054 once headed or headless (B10), then update `AutomationGeneration.md` (v1.2.0 hash table), `execution-metrics.json`, the README and a new journal event. No Git operations.
