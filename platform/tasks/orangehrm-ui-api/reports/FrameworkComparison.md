# Framework Comparison — TC-054 (OrangeHRM Directory UI)

| Field | Value |
|---|---|
| Task | `orangehrm-ui-api` · workflow run RUN-001 |
| Test case | TC-054 only — "End-to-end: redirect login, combined filter, employee details, close, Reset" (TestCases v1.4.0, approved) |
| Framework A | Playwright 1.64.1 + TypeScript 5.9.3 + Playwright Test, Node 24.19.0, Chromium headless shell 156.0.8078.4 (build 1248) |
| Framework B | SHAFT_ENGINE 10.1.20260123 + Selenium WebDriver 4.40.0 + Java 21 (JBR 21.0.5) + TestNG 7.12.0 + Maven 3.9.11 (Surefire 3.5.4), locally installed Google Chrome via Selenium Manager (exact browser version not recorded by the run outputs) |
| Environment | Windows 11 Pro, one machine, headless, viewport 1920×1080, live shared demo site `https://opensource-demo.orangehrmlive.com` |
| Date | 2026-10-18 (runs between 10:47Z and 10:57Z) |
| Sources | `automation-execution/execution-metrics.json` (extracted from `results.json`, `testng-results.xml`, `steps.log`, console logs), `self-healing/healing-log.md` |
| Update | 2026-10-19: §8 and §9 added (runs A7 and B7 – B15, current SHAFT code v1.3.0). §1 – §7 are kept unchanged as the original comparison: their SHAFT measurements and observations describe **SHAFT code v1.0.0** |

How to read this report: **[M]** marks a measured fact from the run outputs; **[Q]** marks a qualitative observation by the implementer. Qualitative points are opinions grounded in this one test case, not general rankings.

> **Code versions.** §1 – §7 compare Playwright code 1.0.0 + H-001 with **SHAFT code v1.0.0** (AutomationGeneration.md v1.0.0, journal EVT-0045), measured on 2026-10-18. The SHAFT binding was later restructured (v1.1.0, EVT-0052; v1.2.0, EVT-0054), simplified (v1.3.0, EVT-0056) and fixed twice (H-004, H-005). Statements in §1 – §7 about SHAFT code size, assertions, screenshots and step logging are therefore historical; the current values are in §8. The Playwright code has not changed since H-001.

## Part A — Original comparison (2026-10-18, SHAFT code v1.0.0)

## 1. Results [M] — runs of 2026-10-18, SHAFT code v1.0.0

| Run | Framework | Outcome | Test duration (ms) | Runner total (ms) | Wall-clock (ms) | k | N | Notes |
|---|---|---|---|---|---|---|---|---|
| A1 | Playwright | failed (environment) | 2 | 641 | not measured | — | — | Browser build 1248 not installed (E-001) |
| A2 | Playwright | failed (script) | 37 016 | 39 697 | 42 089 | — | — | Header wait regex (H-001); timed out after 30 s |
| A3 | Playwright | **passed** | 11 169 | 12 313 | 14 512 | 6 | 111 | after H-001 |
| A4 | Playwright | **passed** | 11 494 | 12 526 | 14 788 | 6 | 107 | |
| A5 | Playwright | **passed** | 10 036 | 11 108 | 13 376 | 6 | 105 | |
| A6 | Playwright | **passed** | 7 647 | 8 756 | 11 101 | 6 | 106 | |
| B1 | SHAFT | not run | — | — | 23 857 | — | — | Listener NPE `rp.enable` (H-002) |
| B2 | SHAFT | test passed, build failed | 13 353 | 28 423 | 41 848 | 6 | 111 | Allure CLI path with a space (H-003) |
| B3 | SHAFT | **passed** | 12 607 | 17 650 | 35 135 | 6 | 110 | after H-002, H-003 |
| B4 | SHAFT | **passed** | 12 099 | 17 004 | 32 392 | 6 | 106 | |
| B5 | SHAFT | **passed** | 14 903 | 19 565 | 35 001 | 6 | 105 | |
| B6 | SHAFT | **passed** | 12 768 | 17 405 | 32 963 | 6 | 107 | |

Definitions: *test duration* = the test itself (Playwright result `duration`; TestNG `test-method` `duration-ms` of `tc054EndToEnd`, which excludes `@BeforeMethod`/`@AfterMethod`); *runner total* = Playwright `stats.duration` / TestNG `<test>` `duration-ms` (includes browser start and teardown); *wall-clock* = shell time around the whole command (`npx playwright test` / `mvn test`, including Maven start-up and SHAFT's Allure report generation).

All passing runs asserted the approved expected result: Employee Name empty, Job Title and Location "-- Select --", header "(N) Records Found", N > k. DATA-012 resolved to the same pair in every run (job title "Probation Trainee PLW1462", location "New York Sales Office", read from the first card showing both).

### Summary of the passing runs (n = 4 each)

| Metric | Playwright (A3–A6) | SHAFT (B3–B6) |
|---|---|---|
| Pass rate after fixes | 4 / 4 | 4 / 4 |
| Test duration — mean (min–max) | 10 087 ms (7 647–11 494) | 13 094 ms (12 099–14 903) |
| Runner total — mean | 11 176 ms | 17 906 ms |
| Wall-clock — mean | 13 444 ms | 33 873 ms |
| Attempts until first clean pass | 3 (1 environment, 1 script fix) | 3 (2 framework/environment fixes) |

Caveats [M]: 4 runs per framework, alternating A/B on one machine against a shared public demo site whose data changed during the session (N moved between 105 and 111). This is an indicative measurement for one test case, not a benchmark.

## 2. Stability, waits and synchronization — SHAFT code v1.0.0

| Aspect | Playwright | SHAFT / Selenium |
|---|---|---|
| Flaky results after fixes [M] | none in 4 runs | none in 4 runs |
| Built-in waiting [Q] | Auto-waiting actions and retrying `expect` assertions; one `expect(...).not.toHaveText(previous)` call expresses "wait for the header to change" | SHAFT element actions wait for the element (up to `defaultElementIdentificationTimeout`); conditions such as "header changed" or "panel hidden" needed explicit Selenium `WebDriverWait` lambdas |
| Fixed sleeps [M] | 0 | 0 |
| Retries [M] | 0 (`retries: 0`) | 0 (`retryMaximumNumberOfAttempts=0`, `rerunFailingTestsCount=0`) |
| Same synchronization design [M] | Header-change wait before reading k and N, then cards visible + count pattern (PB-001 guard) | identical logic |

## 3. Code complexity and maintainability — SHAFT code v1.0.0 (current figures in §8)

| Measure [M] | Playwright | SHAFT |
|---|---|---|
| Test-code files | 6 (`.ts`, incl. `playwright.config.ts`) | 5 (`.java`) |
| Effective lines (non-blank, non-comment) | 335 | 360 |
| Build / configuration lines | 30 (`package.json`, `tsconfig.json`) | 101 (`pom.xml` 69, `testng.xml` 12, `custom.properties` 20) |
| Direct dependencies | 3 (`@playwright/test`, `typescript`, `@types/node`) | 1 (`SHAFT_ENGINE`) |
| Installed footprint | 6 npm packages, 45 MB `node_modules` + 118 MB browser download | 342 jars, 455.6 MB on the test classpath |
| First build / install time | `npm install` 5 s (+ browser install) | first `mvn test-compile` 73 s (dependency download) |

Observations [Q]:
- Both projects use the same structure (config → page objects → one test) and the same step labels, so they are easy to compare and to maintain side by side.
- The TypeScript version is shorter where Playwright offers a primitive directly (role-based option lookup, retrying assertions, tracing control). The Java version is longer mainly in `DirectoryPage` (XPath strings, `WebDriverWait` lambdas, an XPath literal helper for option texts with quotes).
- SHAFT reduces boilerplate for driver creation, typing secrets (`typeSecure`) and assertions with report messages, but its large transitive dependency set and version constraints (the newest SHAFT releases need JDK 25; 10.1.20260123 is the last for Java 21) add maintenance work.

## 4. Locators and assertions — SHAFT code v1.0.0 (SHAFT assertions changed in v1.3.0, see §8)

| Aspect | Playwright | SHAFT |
|---|---|---|
| Locator sources [M] | Same LOC-### sources for both (LOC-001–004, 006–009, 011, 015) plus the login fields verified on 2026-10-18 | same |
| Locator style [M] | CSS for stable attributes/classes, XPath for label-anchored fields, `getByRole('listbox' / 'option')` for dropdown options | `By.name` for login fields, XPath elsewhere (platform Tooling Rule: ID/XPath preference) |
| Assertion style [M] | `expect.soft` for the five parts of the single expected result: all parts are reported even if one fails | `SHAFT.Validations.assertThat()…withCustomReportMessage(…).perform()`: hard asserts, stops at the first failing part |
| Assertion messages [M] | Each message quotes "TC-054 expected: …" | same |

## 5. Reporting, screenshots and debugging — SHAFT code v1.0.0 (SHAFT screenshots changed in v1.3.0, see §8)

| Aspect | Playwright | SHAFT |
|---|---|---|
| Native report [M] | Playwright HTML report (folder, ~680 KB per run) + `results.json` + `junit.xml` | Allure single-file HTML (~3.4 MB per run) + TestNG `testng-results.xml` + Surefire reports |
| Step visibility [M] | Steps appear as `test.step` blocks with the approved step text | Every SHAFT action (navigate, type securely, click, get text, assert) appears as an Allure step automatically; the approved step labels are logged via `SHAFT.Report.log` |
| Screenshots [M] | Full-page `final.png` on pass, `failure.png` on failure (fixture) | `final.png` / `failure.png` (viewport) from `@AfterMethod`. SHAFT took no screenshots of its own: with `ValidationPointsOnly` it captures at element validations, and TC-054's assertions are value checks (`object`/`number`), so the Allure results contain text/HTML attachments only |
| Trace / replay [M] | Trace (`trace.zip`) on failure with DOM snapshots and network, login step excluded | none built in |
| Secret handling [M] | Login step not traced; secret scan of all outputs: 0 hits | `typeSecure` masks the values in Allure ("Type securely"); secret scan: 0 hits |
| Debugging experience [Q] | H-001 was diagnosed from the error alone: the report showed the locator resolved 62 times to the right element with text `" (111) Records Found"` | H-002 and H-003 were inside the framework; diagnosis needed fork dump files and byte-code inspection of SHAFT classes |

## 6. Healing / fixing experience — as of 2026-10-18 (two further SHAFT fixes in §8)

| Item | Playwright | SHAFT |
|---|---|---|
| Interventions [M] | 2: E-001 (browser install), H-001 (wait regex) | 2: H-002 (`rp.enable`), H-003 (Allure CLI path with a space) |
| Kind [M] | environment, test-script | framework configuration, environment + framework defect |
| Application defects found [M] | 0 | 0 |
| Assertions changed [M] | 0 | 0 |
| Limitations observed [Q] | Browser binaries are tied to the exact Playwright version; a version bump needs `npx playwright install`. | SHAFT 10.1 always generates and renames its Allure report at the end of the run (no switch to turn it off), so a report problem fails the whole build even when the test passed (B2). A profile path with a space needs the documented workaround. |

## 7. Conclusions of 2026-10-18 (SHAFT code v1.0.0)

Measured [M]:
- Both frameworks implement TC-054 completely and pass it 4 out of 4 times after their fixes, with the same data, the same synchronization design and the same assertions.
- At test level SHAFT took about 30 % longer on average (13.1 s vs 10.1 s); end to end, including tooling start-up and report generation, a SHAFT command took about 2.5× as long (33.9 s vs 13.4 s).
- Getting to the first clean run took 3 attempts in each framework; Playwright's problems were in the environment and the test script, SHAFT's were in the framework and its interaction with the environment.

Qualitative [Q]:
- For this project Playwright + TypeScript gave faster feedback and the better debugging tools (trace viewer, precise assertion errors).
- SHAFT + Java fits the platform's Java/TestNG stack and produces a richer report out of the box (every action logged, secrets masked automatically), at the cost of a heavier toolchain and less transparent failures inside the framework.
- Neither result is a general ranking: it rests on one test case, one machine and four runs per framework.

## Part B — Update of 2026-10-19: later runs and the current code

## 8. Later runs and the current SHAFT code (v1.3.0)

No test was rerun for this update. Values come from `automation-execution/execution-metrics.json`, `self-healing/healing-log.md` and the journal (EVT-0050 – EVT-0059). Current code: Playwright 1.0.0 + H-001 (unchanged); SHAFT 1.3.0 + H-004 + H-005 (AutomationGeneration.md v1.3.0).

### 8.1 Runs after the original comparison [M]

| Run | Framework | Code version | Mode | Outcome | Test duration (ms) | Runner total (ms) | Wall-clock (ms) | k | N | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| A7 | Playwright | 1.0.0 + H-001 | headed | **passed** | 8 252 | 12 139 | 20 006 | 1 | 140 | Walkthrough (EVT-0050) |
| B7 | SHAFT | 1.0.0 | headed | **passed** | 11 414 | 19 618 | 39 573 | 1 | 140 | Walkthrough (EVT-0051) |
| B8 | SHAFT | 1.1.0 | headed | **passed** | 7 439 | 33 062 | 51 770 | 1 | 161 | Login moved to `@BeforeClass`; navigation took 14.7 s (site) |
| B9 | SHAFT | 1.1.0 | headless | **passed** | 5 228 | 19 711 | 38 616 | 1 | 8 | Shared data briefly small (header "(8) Records Found") |
| B10 | SHAFT | 1.2.0 | headless | **passed** | not recorded | 24 350 | 35 000 | 1 | 112 | testng-results.xml overwritten by B11 |
| B11 | SHAFT | 1.2.0 | headed | **passed** | 5 722 | 17 827 | 33 000 | 1 | 113 | |
| B12 | SHAFT | 1.3.0 | headless | failed | 66 981 | 106 875 | 142 000 | — | — | H-004 (option clicked before the list was visible); site slow |
| B13 | SHAFT | 1.3.0 + H-004 | headless | failed | 71 086 | 127 486 | 156 000 | 1 | — | H-005 (element highlighting broke the close click); site slow |
| B14 | SHAFT | 1.3.0 + H-004 + H-005 | headless | **passed** | 48 620 | 132 816 | 162 000 | 1 | 140 | Site slow (plain request 9.5 – 12.4 s) |
| B15 | SHAFT | 1.3.0 + H-004 + H-005 | headed | **passed** | 18 000 | 32 336 | 61 000 | 1 | 178 | Site normal (0.7 – 0.9 s); `mvn clean test` |

k and N for B12 – B15 were read from SHAFT step screenshots, because SHAFT v1.3.0 does not store the values it reads. Wall-clock for B10 – B15 was measured with one-second resolution.

### 8.2 What can and cannot be compared

Not comparable, so no new performance conclusion is drawn:

- **Test duration.** From SHAFT v1.1.0 on, login runs in `@BeforeClass`, so the TestNG test-method duration excludes step 1; Playwright's test duration includes it.
- **B12 – B14.** Measured while the demo site answered a plain request in 9.5 – 12.4 s instead of under 1 s. These durations reflect the site, not the frameworks.
- **A7 vs B15.** Both headed, but on different days, with different shared data (N 140 vs 178). B15 ran `mvn clean test` (includes compilation), and SHAFT v1.3.0 takes a screenshot of every action (23 per run). Their runner totals (12 139 ms vs 32 336 ms) are shown above as recorded, not as a like-for-like measurement.
- The only like-for-like timing comparison remains §1 (four runs each, alternating, same session), and it describes SHAFT code v1.0.0.

Comparable facts on the current code [M]:

| Measure | Playwright (1.0.0 + H-001) | SHAFT (1.3.0 + H-004 + H-005) |
|---|---|---|
| Passing runs on the current code | A3 – A7: 5 / 5 | B14, B15: 2 / 2 |
| Failures after the first clean pass | 0 | 2 (B12, B13): both regressions introduced by the 2026-10-19 simplification, fixed as H-004 / H-005 |
| Fixes in total | 2 (E-001 environment, H-001 test script) | 4 (H-002 framework configuration, H-003 environment + framework defect, H-004 test script, H-005 framework configuration) |
| Assertions or expected results changed | 0 | 0 |
| Headed runs | A7 | B7, B8, B11, B15 |
| Test-code files / effective lines | 6 / 335 (unchanged) | 6 / 317 (v1.0.0: 5 / 360) |
| Build / configuration lines (total lines) | 31 (`package.json` 18, `tsconfig.json` 13) | 115 (`pom.xml` 78, `testng.xml` 12, `custom.properties` 25) |
| Expected-result checks | `expect.soft` for the five parts | TestNG `SoftAssert` for the five parts, then `assertAll()` (v1.0.0: hard asserts that stopped at the first failing part) |
| Test-data guards before the checks | `TestDataUnavailableError` when DATA-012 is missing or does not reduce the count | Hard `Assert` with a `[TEST DATA]` message for the same two conditions |
| Screenshots | `final.png` on pass; `failure.png` and `trace.zip` on failure | One screenshot per SHAFT action (23 per run in B14 / B15), element highlighting off (H-005) |
| Values read during the run | Logged in `TC-054/steps.log` (k, N, state after Reset) | Not stored; actions and locators only |
| Native report size per run | ~680 KB report folder (§5) | Allure single file 6.8 – 6.9 MB (B14, B15) |
| Run from IntelliJ IDEA | Shared run configuration exists; no IDE run recorded | Shared run configuration exists; IDE run **pending, not verified** |

Counting method: effective lines = non-blank lines that are not `//` or `/* */` comments. The same method reproduces the 335 Playwright lines of §3, so the SHAFT figures are comparable. Configuration files were counted as total lines; §3 gave 30 for the same, unchanged Playwright files (a one-line counting difference).

### 8.3 Environmental limitations

- One Windows machine; one public, shared demo site whose data (N between 8 and 178 across runs) and response time changed during the sessions.
- Headed and headless runs, and runs on two days, are mixed in §8.1.
- The current SHAFT code has two passing runs, one of them on a slow site; no repeated runs under normal conditions exist, so no statistical statement about its speed or stability is possible.
- No test was rerun for this update.

## 9. Conclusions as of 2026-10-19

Measured [M]:
- Both frameworks pass TC-054 on their current code (A7 headed; B14 headless and B15 headed), with the approved expected result and no changed assertion.
- SHAFT needed four fixes and Playwright two. Two of SHAFT's fixes (H-004, H-005) were regressions introduced by refactoring the test code, not new framework problems.
- After the simplification the SHAFT test code is slightly smaller than the Playwright code (317 vs 335 effective lines), while its build and configuration files remain larger (115 vs 31 lines).
- Playwright's evidence records the values read (k, N, final state); SHAFT v1.3.0 records a screenshot of every action but not the values.

Not established:
- Whether the current SHAFT code is faster or slower than SHAFT v1.0.0 or than Playwright. The §1 timings (Playwright faster at test level and end to end) apply to SHAFT v1.0.0 only.

Qualitative [Q]: the §7 observations on debugging and toolchain weight still apply; the simplified SHAFT code is easier to read, but the two regressions show that its waits need the same care as before.
