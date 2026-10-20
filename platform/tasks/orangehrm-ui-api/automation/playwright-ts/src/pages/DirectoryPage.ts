import { expect, Locator, Page } from '@playwright/test';
import { settings } from '../support/config';

/** Results-header count; "No Records Found" and transient states give null. */
export function parseCount(header: string): number | null {
  const m = /^\((\d+)\) Records? Found$/.exec(header.trim());
  return m ? Number(m[1]) : null;
}

/**
 * Directory page. Every locator traces to an ExplorationReport candidate locator
 * (LOC-###) or to a recorded verification; see ../AutomationGeneration.md §5.
 */
export class DirectoryPage {
  static readonly PATH = '/web/index.php/directory/viewDirectory';

  /** LOC-001, anchored to its label "Employee Name". */
  readonly employeeName: Locator;
  /** LOC-002 / LOC-003, anchored to their labels. */
  readonly jobTitle: Locator;
  readonly location: Locator;
  /** LOC-006 / LOC-007 */
  readonly search: Locator;
  readonly reset: Locator;
  /** LOC-008: anchored on the text pattern, not on the generic class alone. */
  readonly resultsHeader: Locator;
  /** LOC-009 inside LOC-015 (results container). */
  readonly cards: Locator;
  /** LOC-011 */
  readonly detailPanel: Locator;
  readonly detailPanelArrow: Locator;

  constructor(private readonly page: Page) {
    this.employeeName = page.locator("xpath=//label[normalize-space()='Employee Name']/ancestor::div[.//input][1]//input");
    this.jobTitle = this.selectFor('Job Title');
    this.location = this.selectFor('Location');
    this.search = page.locator('form button[type="submit"]');
    this.reset = page.locator('form button[type="reset"]');
    this.resultsHeader = page.locator('span.oxd-text--span').filter({ hasText: /Records? Found$/ });
    this.cards = page.locator('.orangehrm-container .orangehrm-directory-card');
    this.detailPanel = page.locator('.orangehrm-corporate-directory-sidebar');
    this.detailPanelArrow = this.detailPanel.locator('i.bi-arrow-right');
  }

  private selectFor(label: string): Locator {
    return this.page.locator(
      `xpath=//label[normalize-space()='${label}']/ancestor::div[.//div[contains(@class,'oxd-select-text-input')]][1]//div[contains(@class,'oxd-select-text-input')]`,
    );
  }

  async open(): Promise<void> {
    await this.page.goto(DirectoryPage.PATH);
  }

  /** The state the login returns to: the Directory URL with its filter form. */
  async waitForDirectory(): Promise<void> {
    await this.page.waitForURL('**' + DirectoryPage.PATH);
    await this.search.waitFor({ state: 'visible' });
  }

  async headerText(): Promise<string> {
    return (await this.resultsHeader.first().innerText()).trim();
  }

  /**
   * Waits until result cards are displayed and the header shows a record count,
   * then returns the count. The header is read only after cards are displayed
   * (PB-001: a transient "No Records Found" was once seen while the list loaded).
   */
  async waitForResults(): Promise<{ header: string; count: number }> {
    await this.cards.first().waitFor({ state: 'visible' });
    // The header's DOM text has surrounding whitespace (" (111) Records Found", run A2); healing H-001.
    await expect(this.resultsHeader.first(), 'results header shows a record count').toHaveText(/^\s*\(\d+\) Records? Found\s*$/);
    const header = await this.headerText();
    return { header, count: parseCount(header) as number };
  }

  /**
   * Bounded wait for the results header to differ from the text read before an
   * action (Search / Reset). Returns false if it did not change within the
   * central timeout; the caller then reads and asserts the actual state, so a
   * missing reload still fails the approved assertion with the real values.
   */
  async waitForHeaderChange(previous: string): Promise<boolean> {
    try {
      await expect(this.resultsHeader.first()).not.toHaveText(previous, { timeout: settings.timeoutMs });
      return true;
    } catch (e) {
      // Only the bounded wait's own timeout is tolerated; anything else is rethrown.
      if (e instanceof Error && /Timeout \d+ms exceeded|timed out/i.test(e.message)) return false;
      throw e;
    }
  }

  /** Opens a custom dropdown (LOC-002/003) and clicks the option with this exact text (LOC-004). */
  async choose(dropdown: Locator, option: string): Promise<boolean> {
    await dropdown.click();
    const listbox = this.page.getByRole('listbox');
    await listbox.waitFor({ state: 'visible' });
    const opt = listbox.getByRole('option', { name: option, exact: true });
    if ((await opt.count()) === 0) {
      await this.page.keyboard.press('Escape');
      return false;
    }
    await opt.click();
    await expect(dropdown).toHaveText(option);
    return true;
  }

  /**
   * DATA-012 candidates: Job Title + Location pairs read from currently displayed
   * cards that show both (card subtitle = job title; the card body's 2nd
   * description = location, after the sub-unit; EVD-003, OBS-008).
   */
  async displayedPairs(): Promise<Array<{ name: string; jobTitle: string; location: string }>> {
    const pairs: Array<{ name: string; jobTitle: string; location: string }> = [];
    const total = await this.cards.count();
    for (let i = 0; i < total; i++) {
      const card = this.cards.nth(i);
      const subtitle = card.locator('.orangehrm-directory-card-subtitle');
      const location = card.locator('.orangehrm-directory-card-description').nth(1);
      if (!(await subtitle.isVisible()) || !(await location.isVisible())) continue;
      const jobTitle = (await subtitle.innerText()).trim();
      const loc = (await location.innerText()).trim();
      if (jobTitle && loc) {
        pairs.push({ name: (await card.locator('.orangehrm-directory-card-header').innerText()).trim(), jobTitle, location: loc });
      }
    }
    return pairs;
  }
}
