# Healing / Fixing Log — TC-054 automation

| Field | Value |
|---|---|
| Task | `orangehrm-ui-api` |
| Workflow run | RUN-001 |
| Scope | TC-054 only (the only case with `Needs Automation = TRUE`) |
| Frameworks | A: Playwright + TypeScript + Playwright Test (`automation/playwright-ts/`) · B: SHAFT Engine + Selenium WebDriver + Java 21 + TestNG + Maven (`automation/shaft-java/`) |
| Approved requirement | `test-design/TestCases.md` v1.4.0 (TEST_DESIGN_APPROVED EVT-0037, TEST_REVIEW_APPROVED EVT-0039, MANUAL_EXECUTION_APPROVED EVT-0043) — **not modified** |
| Date | 2026-10-18 (E-001, H-001 – H-003); 2026-10-19 (H-004, H-005; sections 6–7) |
| Evidence root | `automation-execution/results/<run-id>/<framework>/` (original failure evidence kept unchanged) |

## 1. Rules applied

- Only locators, waits, setup, configuration and test plumbing may be changed.
- Steps, expected results and assertions follow TestCases v1.4.0 and were **not** changed, weakened or removed by any fix.
- A failure is first classified as **application defect**, **test-script defect** or **environment / framework-configuration issue** from the evidence. An application defect would be reported as a bug and never healed. None was found.
- Original failure evidence is preserved; each fix is followed by a rerun of the affected test.
- No retries: both projects run with retries 0, and a fix counts only when a new, separate run passes.

## 2. Summary

| ID | Framework | Run with the failure | Classification | Root cause | Change | Verified by |
|---|---|---|---|---|---|---|
| E-001 | A (Playwright) | run-20261018-A1 | Environment | Playwright 1.64.1 needs Chromium build 1248; only builds 1232–1237 were installed | `npx playwright install chromium` (no code change) | A2 launched the browser |
| H-001 | A (Playwright) | run-20261018-A2 | Test-script defect (wait plumbing) | The wait regex `^\(\d+\) Records? Found$` did not allow the leading space in the header's DOM text `" (111) Records Found"` | Regex allows surrounding whitespace: `^\s*\(\d+\) Records? Found\s*$` | A3 PASS, then A4–A6 PASS |
| H-002 | B (SHAFT) | run-20261018-B1 | Framework configuration | SHAFT 10.1 `TestNGListener.onExecutionStart` reads system property `rp.enable` (ReportPortal) before its defaults exist → NPE; no test started | Surefire `systemPropertyVariables`: `rp.enable=false` (ReportPortal not used) | B2: the test ran |
| H-003 | B (SHAFT) | run-20261018-B2 | Environment + framework defect | SHAFT 10.1 runs its Allure CLI from `<user.home>/.m2/repository/allure/…` without quoting; the profile path `C:\Users\QC User` contains a space, so no report was generated and the final rename crashed the forked JVM (build failure; Surefire counted 0 tests although TestNG recorded the test as PASS) | Optional, empty-by-default Maven property `shaft.extraArgLine` appended to the test JVM `argLine`; on this machine `-Dshaft.extraArgLine=-Duser.home=C:\Users\QCUSER~1` (8.3 short form of the same folder) | B3 BUILD SUCCESS, then B4–B6 |
| H-004 | B (SHAFT) | run-20261019-B12 | Test-script defect (wait plumbing, introduced by the 2026-10-19 simplification) | The simplified `selectOption()` clicked the dropdown option without waiting for the opening list to be visible; the click on "Texas R&D" did not select it | Wait until the option is visible, then click it (`Directory_Page.selectOption`) | B13: both selections and Search passed (B13 then failed at H-005) |
| H-005 | B (SHAFT) | run-20261019-B13 | Framework configuration (introduced by the same simplification) | `screenshotParams_whenToTakeAScreenshot=Always` together with `screenshotParams_highlightElements=true` highlights each element before the action; the click on the details panel's arrow icon took 30 s and did not close the panel | `screenshotParams_highlightElements=false` (screenshots per action kept) | B14 PASS |

Totals: 6 interventions (1 environment, 2 test-script defects, 3 framework configuration / framework defect). Application defects found: **0**. Assertions or expected results changed: **0**.

## 3. Details

### E-001 — Missing Playwright browser build (environment)

| Item | Value |
|---|---|
| Original failure | `browserType.launch: Executable doesn't exist at …\ms-playwright\chromium_headless_shell-1248\…` — the test failed after 2 ms, before any page was opened |
| Evidence | `run-20261018-A1/playwright-ts/results.json`, `html-report/`, `test-output/…/error-context.md` |
| Diagnosis | The cache held Chromium builds 1232, 1234, 1237 (older Playwright versions). The pinned `@playwright/test` 1.64.1 expects build 1248. Not related to the application or the script. |
| Change | `npx playwright install chromium` → Chrome Headless Shell 156.0.8078.4 (build 1248). No file in the project changed. |
| Result | Run A2 launched the browser and reached the application. |
| Lesson | First-run setup must include the browser install for the pinned Playwright version (now documented in the project README and the skill). |

### H-001 — Results-header wait regex too strict (test-script defect)

| Item | Value |
|---|---|
| Original failure | `Error: results header shows a record count — expect(locator).toHaveText(expected) failed — Expected pattern: /^\(\d+\) Records? Found$/ — Received string: " (111) Records Found" — Timeout: 30000ms` at `src/pages/DirectoryPage.ts:72`, called from the DATA-012 resolution (before step 2) |
| Evidence | `run-20261018-A2/playwright-ts/TC-054/failure.png`, `trace.zip`, `steps.log`; `html-report/`; `results.json` |
| What the evidence shows | Step 1 passed (redirect to `/auth/login`, login, back to the Directory URL). The locator resolved 62 times to the correct `span` with text `" (111) Records Found"`; only the leading space made the anchored regex fail. The application behaved as approved (OBS-001, OBS-003). |
| Classification | Test-script defect: `toHaveText(RegExp)` matches the element's raw text, which keeps the surrounding whitespace. Not an application defect. |
| Change | `automation/playwright-ts/src/pages/DirectoryPage.ts` — `waitForResults()` regex `^\s*\(\d+\) Records? Found\s*$`. The count is still parsed from the trimmed text (`parseCount`). |
| Not changed | The expected-result assertions (in `tests/TC-054.spec.ts`): Employee Name `""`, Job Title / Location `"-- Select --"`, header `^\(\d+\) Records Found$` on the trimmed header, `N > k`. |
| Result | A3 PASS (k = 6, N = 111). A4, A5, A6 PASS with the same code. |
| Framework note | Framework B was not affected: Selenium's `getText()` result is trimmed before parsing. |

### H-002 — SHAFT listener NPE on `rp.enable` (framework configuration)

| Item | Value |
|---|---|
| Original failure | Forked JVM crash: `NullPointerException: Cannot invoke "String.trim()" because the return value of "java.lang.System.getProperty(String)" is null` at `com.shaft.listeners.TestNGListener.onExecutionStart(TestNGListener.java:120)`. Surefire: `Tests run: 0`, BUILD FAILURE. |
| Evidence | `run-20261018-B1/shaft-java/maven-console.log`, `2026-10-18T13-49-48_096-jvmRun1.dump`, `.dumpstream` |
| Diagnosis | Byte-code inspection of `TestNGListener.onExecutionStart` (SHAFT_ENGINE 10.1.20260123): after `engineSetup`, it calls `System.getProperty("rp.enable").trim()`. On the first run SHAFT copies its default property files (including `reportportal.properties`) into `src/main/resources/properties/default/`, but the property is not yet a system property at that point. |
| Change | `automation/shaft-java/pom.xml` — Surefire `<systemPropertyVariables><rp.enable>false</rp.enable></systemPropertyVariables>`. ReportPortal is not used by this project. |
| Result | B2: TestNG ran the test (see H-003). |

### H-003 — SHAFT Allure report step fails on a path with a space (environment + framework defect)

| Item | Value |
|---|---|
| Original failure | After the test: `File Action "RenameFile" failed. Root cause: "java.io.FileNotFoundException: Source '…\shaft-java\allure-report\index.html' does not exist"` from `AllureManager.renameAllureReport` ← `openAllureReportAfterExecution` ← `TestNGListener.onExecutionFinish`. The fork crashed: Surefire `Tests run: 0`, BUILD FAILURE. |
| What actually happened to TC-054 in B2 | TestNG `testng-results.xml`: `tc054EndToEnd` **PASS** (13 353 ms); Allure result `passed`; steps.log k = 6, N = 111, all five assertions passed. B2 is recorded as **test passed, run harness failed** — not as a passing run. |
| Evidence | `run-20261018-B2/shaft-java/maven-console.log`, `testng-results.xml`, `allure-results/`, `TC-054/steps.log`, `TC-054/final.png`, `2026-10-18T13-50-45_764-jvmRun1.dump` |
| Diagnosis | In SHAFT 10.1, `openAllureReportAfterExecution()` runs unconditionally (no property disables it). Byte-code shows the Allure binary path is built as `<user.home>/.m2/repository/allure/allure-<version>/bin/allure` and passed to a terminal command without quotes. `user.home` = `C:\Users\QC User` (space). Running the same Allure 2.35.1 CLI manually with a quoted path generated the report (3.4 MB `index.html`), which confirms the cause. |
| Change | `automation/shaft-java/pom.xml` — property `shaft.extraArgLine` (empty by default) appended to the test JVM `argLine`. On this machine runs pass `-Dshaft.extraArgLine=-Duser.home=C:\Users\QCUSER~1`, the Windows 8.3 short name of the same profile folder (no space). Nothing machine-specific is stored in the project. |
| Rejected alternatives | Disabling the SHAFT listener (loses SHAFT reporting); catching the exception (would hide failures); moving the project (not allowed). |
| Result | B3: `Tests run: 1, Failures: 0, Errors: 0`, BUILD SUCCESS, Allure single-file report generated. B4, B5, B6 the same. |

### H-004 — Option clicked before the dropdown list was visible (test-script defect)

| Item | Value |
|---|---|
| Original failure | `TimeoutException: … Location … to have text "Texas R&D". Current text: "-- Select --"` at `Directory_Page.selectOption` ← `selectLocation` ← `Directory_TC:52` |
| Evidence | `run-20261019-B12/shaft-java/maven-console.log`, `testng-results.xml`, `allure-results/` (screenshot of step `Click "Texas R&D"`: the highlighted option is an empty box below the field; the list is not visible) |
| Classification | Test-script defect. The previous version waited for the list before clicking; the simplification removed that wait. Not an application defect (the same pair was selected in B9 and B13). |
| Change | `Directory_Page.selectOption`: `wait.until(visibilityOfElementLocated(option))` before `driver.element().click(option)` |
| Result | B13: Job Title and Location selected, Search returned "(1) Record Found" |

### H-005 — SHAFT element highlighting broke a click (framework configuration)

| Item | Value |
|---|---|
| Original failure | `TimeoutException: … orangehrm-corporate-directory-sidebar … to become invisible` at `EmployeeDetails_Page.clickCloseIcon`; the SHAFT step `Click` on the arrow icon itself took 30 232 ms |
| Evidence | `run-20261019-B13/shaft-java/maven-console.log`, `testng-results.xml`, `allure-results/` (screenshot: panel open, arrow icon highlighted) |
| Classification | Framework configuration. The same click passed in B10/B11, before `whenToTakeAScreenshot` was switched from `ValidationPointsOnly` to `Always`; with `Always`, SHAFT highlights every element before acting on it. Not an application defect. |
| Change | `custom.properties`: `screenshotParams_highlightElements=false`; screenshots per action stay on |
| Result | B14 PASS (k = 1, N = 140) |
| Note | B12–B14 ran while the demo site answered a plain request in 9.5–12.4 s (curl), so their durations are not comparable with earlier runs |

## 4. Items reviewed and not healed

| Item | Decision |
|---|---|
| N differed between runs (111, 110, 107, 106, 105, 106, 107) and from the unfiltered count read at login (A4: 108 then N = 107) | Shared demo data changes during a session (OBS-021). Already handled by the approved data-aware design: k and N are read in the same run and only `N > k` is asserted. No change. |
| Java scaffold tracing (`tracing.start()` followed by `startChunk()`) | Suspected latent issue, checked with a probe against Playwright 1.64.1: works. No change. |
| Selenium/SHAFT "Reconfiguration failed: No configuration found" log4j messages | Logging noise from SHAFT's log4j setup; no effect on results. Not changed. |

## 5. Result

| Framework | Final state | Passing runs after fixes |
|---|---|---|
| A — Playwright TS | PASS | 4 / 4 (A3–A6) |
| B — SHAFT Java | PASS | 4 / 4 (B3–B6), plus B2 test-level PASS with harness failure; after the 2026-10-19 simplification: B14 PASS (B12, B13 failed — H-004, H-005); B15 PASS (headed, unchanged code) |

Approved test requirements, assertions and bug classifications are unchanged. No new bug report was created: no failure was caused by the application.

## 6. Healing workflow as actually executed

Every intervention followed the same five steps. All of them were carried out by the AI agent (Claude Code) inside an interactive session, after a human request to run, fix or simplify the automation; nothing ran unattended.

| Step | What was done | Where it is recorded |
|---|---|---|
| 1. Detect | A run's Maven / TestNG / Playwright result was not a pass (or the build failed after a passing test) | `automation-execution/execution-metrics.json`, journal `automation_runs` |
| 2. Preserve | The run folder was kept unchanged under its own run ID; the next run used a new ID | `automation-execution/results/<run-id>/` |
| 3. Diagnose and classify | Error message → stack frame → screenshot / step log / Allure step → framework internals where needed (H-002, H-003: SHAFT byte code; H-004, H-005: SHAFT step screenshots) | Section 3 of this log |
| 4. Minimal change | One root cause per change, in one binding: environment action (E-001), configuration (H-002, H-003, H-005) or wait/parsing code (H-001, H-004) | Section 2 "Change" |
| 5. Verify | A new, separate run; retries stay 0 | Section 2 "Verified by"; per-attempt table below |

### Per-attempt record (skill fields)

| ID | Failed run | Classification | Files changed (SHA-256 after) | SHA-256 before | Verification run | Result |
|---|---|---|---|---|---|---|
| E-001 | A1 | environment | none (browser install) | — | A2 (browser launched), A3 PASS | fixed |
| H-001 | A2 | test_script | `automation/playwright-ts/src/pages/DirectoryPage.ts` | not recorded | A3 PASS | fixed |
| H-002 | B1 | configuration | `automation/shaft-java/pom.xml` | not recorded | B2 (test ran; build failed on H-003), B3 PASS | fixed |
| H-003 | B2 | framework_defect (with an environment trigger) | `automation/shaft-java/pom.xml` (`7db64213…`) | not recorded | B3 PASS | fixed |
| H-004 | B12 | test_script | `automation/shaft-java/src/main/java/OrangeHRMPages/Directory/Directory_Page.java` (`fd2501e1…`, unchanged since) | not recorded | B13 (selection worked; run failed on H-005), B14 PASS | fixed |
| H-005 | B13 | configuration | `automation/shaft-java/src/main/resources/properties/custom.properties` (`ae854f4e…`, unchanged since) | not recorded | B14 PASS (headless), B15 PASS (headed) | fixed |

`assertion_changed` = false for all six: no fix touched the test class's assertions or the expected values (H-004 and H-005 changed only a page-object wait and a SHAFT property; the five `softAssert` lines and `assertAll()` are the same as before the simplification). Static checks on the current SHAFT code (2026-10-19): compile passes (B14, B15), no `Thread.sleep`, implicit waits, retries or catch-and-ignore; retries 0 in `custom.properties` and `pom.xml`; no credential value in the project files.

## 7. Demonstrated capabilities versus not demonstrated

| Capability (Self-Healing Skill v1.0.0) | Status | Evidence / reason |
|---|---|---|
| Diagnose a failure from preserved evidence and classify it | **Demonstrated** (6 times) | Sections 2–3; classes seen: environment, test_script (2), configuration (2), framework_defect |
| Fix only plumbing, configuration or environment; never assertions | **Demonstrated** | All six changes above; `assertion_changed` = false |
| Verify each fix with a new, separate run (no retries) | **Demonstrated** | A2/A3, B2/B3, B13/B14, B15 |
| Preserve the original failure evidence | **Demonstrated** | Run folders A1, A2, B1, B2, B12, B13 kept with their console logs, results and screenshots |
| Report an application defect instead of healing it | **Not demonstrated** | No failure was caused by the application, so this path never ran |
| `test_data` handling | **Not demonstrated** | No `[TEST DATA]` failure occurred |
| Escalation after 3 attempts | **Not demonstrated** | Every failure was fixed within one attempt |
| Read-only Playwright MCP confirmation of a locator | **Not used** | Not needed for any of the six causes |
| Autonomous or unattended healing (e.g. in CI, without a human request) | **Not available** | The skill is a set of instructions the agent follows in a session; there is no scheduler or CI hook, and SHAFT's own fallbacks stay off (`clickUsingJavascriptWhenWebDriverClickFails=false`, no retries) |
| Runtime "self-healing locators" | **Not available, by design** | No locator is replaced at run time; a locator change is always a reviewed code change |

### Gaps against the skill's own rules

| Rule | Gap | Consequence |
|---|---|---|
| "Every change carries a comment with the healing ID" | H-004's comment explains the wait but does not name H-004; H-005's property line has no comment. The earlier fixes have no ID comments either. | Traceability goes through this log and the journal, not through the code. Not fixed here, because the current code is approved and must not change. |
| Files with SHA-256 before and after (SH-V01) | "Before" hashes were not captured at the time of any fix | Only "after" hashes (current files) can be given; reconstructing old hashes would be unverifiable |
| Journal `healing_attempts` (schema 1.7.0) | EVT-0048 and EVT-0058 recorded the fixes only as `fixes` text lines | Added as structured `healing_attempts` in a later documentation event (see journal), without rewriting the earlier events |
| H-004 and H-005 origin | Both defects were introduced by the human-requested simplification (EVT-0056), not found in previously working code | They show that the workflow catches regressions in the agent's own changes; they are not evidence of healing failures that existed before
