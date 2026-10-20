import { test, expect, TestDataUnavailableError } from '../src/support/fixtures';
import { credentials } from '../src/support/config';
import { LoginPage } from '../src/pages/LoginPage';
import { DirectoryPage, parseCount } from '../src/pages/DirectoryPage';

/*
 * TC-054 — End-to-end: redirect login, combined filter, employee details, close, Reset
 * Source: test-design/TestCases.md v1.4.0 (TEST_DESIGN_APPROVED EVT-0037, TEST_REVIEW_APPROVED EVT-0039,
 * MANUAL_EXECUTION_APPROVED EVT-0043; manual result PASS).
 * Expected result (verbatim): Employee Name is empty, Job Title and Location display "-- Select --",
 * and the results header reads "(N) Records Found" with N greater than the count k noted in step 3.
 * Data-aware: no fixed employee names, counts or credentials.
 */
test(
  'TC-054 End-to-end: redirect login, combined filter, employee details, close, Reset',
  { tag: ['@TC-054', '@e2e'], annotation: [{ type: 'case', description: 'TC-054' }] },
  async ({ page, qa }) => {
    const login = new LoginPage(page);
    const directory = new DirectoryPage(page);

    qa.precondition('No authenticated session in the browser (fresh browser context, or logged out).');
    qa.observed('cookies in the fresh browser context', (await page.context().cookies()).length);

    await qa.step(1, 'Open the Directory URL and log in with the demo account (DATA-001).', async () => {
      await directory.open();
      await login.waitForForm();
      qa.observed('URL after opening the Directory URL', page.url());
      await login.login(credentials());
      await directory.waitForDirectory();
      qa.observed('URL after login', page.url());
    });

    await qa.startTracing();

    // DATA-012: resolved at run time from the currently displayed cards.
    const unfiltered = await directory.waitForResults();
    qa.observed('unfiltered results header (for the DATA-012 condition)', unfiltered.header);
    const pairs = await directory.displayedPairs();
    if (pairs.length === 0) {
      throw new TestDataUnavailableError('DATA-012', 'no displayed card shows both a job title and a location');
    }
    const pair = pairs[0];
    qa.observed('DATA-012 pair (from the card of ' + pair.name + ')', { jobTitle: pair.jobTitle, location: pair.location });

    await qa.step(2, 'Select the Job Title and the Location of the DATA-012 pair; click Search.', async () => {
      if (!(await directory.choose(directory.jobTitle, pair.jobTitle))) {
        throw new TestDataUnavailableError('DATA-012', `Job Title option "${pair.jobTitle}" not offered`);
      }
      if (!(await directory.choose(directory.location, pair.location))) {
        throw new TestDataUnavailableError('DATA-012', `Location option "${pair.location}" not offered`);
      }
      await directory.search.click();
    });

    const k = await qa.step(3, 'Wait until result cards are displayed; read the results header and note the filtered record count k ("(k) Records Found", or "(1) Record Found" when k is 1).', async () => {
      const changed = await directory.waitForHeaderChange(unfiltered.header);
      if (!changed) {
        throw new TestDataUnavailableError('DATA-012', `results header stayed "${unfiltered.header}" after Search: the pair does not return fewer records than the unfiltered list`);
      }
      const filtered = await directory.waitForResults();
      qa.observed('filtered results header', filtered.header);
      qa.observed('k', filtered.count);
      if (!(filtered.count < (unfiltered.count))) {
        throw new TestDataUnavailableError('DATA-012', `pair returned ${filtered.count} records, not fewer than the unfiltered ${unfiltered.count}`);
      }
      return filtered.count;
    });

    await qa.step(4, "Click the first result card; then click the panel's arrow icon.", async () => {
      const firstName = (await directory.cards.first().locator('.orangehrm-directory-card-header').innerText()).trim();
      await directory.cards.first().click();
      await directory.detailPanel.waitFor({ state: 'visible' });
      qa.observed('detail panel opened for the first card', firstName);
      await directory.detailPanelArrow.click();
      await directory.detailPanel.waitFor({ state: 'hidden' });
      qa.observed('detail panel after the arrow click', 'not displayed');
    });

    const headerBeforeReset = await directory.headerText();
    await qa.step(5, 'Click Reset.', async () => {
      await directory.reset.click();
    });

    const after = await qa.step(6, 'Wait until employee result cards are displayed, then read the results header.', async () => {
      const changed = await directory.waitForHeaderChange(headerBeforeReset);
      qa.observed('results header changed after Reset within the timeout', changed);
      await directory.cards.first().waitFor({ state: 'visible' });
      const header = await directory.headerText();
      const state = {
        header,
        employeeName: await directory.employeeName.inputValue(),
        jobTitle: (await directory.jobTitle.innerText()).trim(),
        location: (await directory.location.innerText()).trim(),
      };
      qa.observed('state after Reset', state);
      return state;
    });

    // Expected result (one observable state; each part reported separately).
    const N = parseCount(after.header);
    expect.soft(after.employeeName, 'TC-054 expected: Employee Name is empty').toBe('');
    expect.soft(after.jobTitle, 'TC-054 expected: Job Title displays "-- Select --"').toBe('-- Select --');
    expect.soft(after.location, 'TC-054 expected: Location displays "-- Select --"').toBe('-- Select --');
    expect.soft(after.header, 'TC-054 expected: results header reads "(N) Records Found"').toMatch(/^\(\d+\) Records Found$/);
    expect.soft(N ?? -1, `TC-054 expected: N greater than k (k = ${k}, header "${after.header}")`).toBeGreaterThan(k);
    qa.observed('N', N);
  },
);
