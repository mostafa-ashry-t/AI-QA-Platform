# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: TC-054.spec.ts >> TC-054 End-to-end: redirect login, combined filter, employee details, close, Reset
- Location: tests\TC-054.spec.ts:14:5

# Error details

```
Error: results header shows a record count

expect(locator).toHaveText(expected) failed

Locator: locator('span.oxd-text--span').filter({ hasText: /Records? Found$/ }).first()
Expected pattern: /^\(\d+\) Records? Found$/
Received string:  " (111) Records Found"
Timeout: 30000ms

Call log:
  - results header shows a record count locator('span.oxd-text--span').filter({ hasText: /Records? Found$/ }).first() with timeout 30000ms
  - waiting for locator('span.oxd-text--span').filter({ hasText: /Records? Found$/ }).first()
    62 × locator resolved to <span data-v-7b563373="" data-v-5a621acd="" class="oxd-text oxd-text--span"> (111) Records Found</span>
       - unexpected value " (111) Records Found"

```

```yaml
- text: (111) Records Found
```

# Test source

```ts
  1   | import { expect, Locator, Page } from '@playwright/test';
  2   | import { settings } from '../support/config';
  3   | 
  4   | /** Results-header count; "No Records Found" and transient states give null. */
  5   | export function parseCount(header: string): number | null {
  6   |   const m = /^\((\d+)\) Records? Found$/.exec(header.trim());
  7   |   return m ? Number(m[1]) : null;
  8   | }
  9   | 
  10  | /**
  11  |  * Directory page. Every locator traces to an ExplorationReport candidate locator
  12  |  * (LOC-###) or to a recorded verification; see ../AutomationGeneration.md §5.
  13  |  */
  14  | export class DirectoryPage {
  15  |   static readonly PATH = '/web/index.php/directory/viewDirectory';
  16  | 
  17  |   /** LOC-001, anchored to its label "Employee Name". */
  18  |   readonly employeeName: Locator;
  19  |   /** LOC-002 / LOC-003, anchored to their labels. */
  20  |   readonly jobTitle: Locator;
  21  |   readonly location: Locator;
  22  |   /** LOC-006 / LOC-007 */
  23  |   readonly search: Locator;
  24  |   readonly reset: Locator;
  25  |   /** LOC-008: anchored on the text pattern, not on the generic class alone. */
  26  |   readonly resultsHeader: Locator;
  27  |   /** LOC-009 inside LOC-015 (results container). */
  28  |   readonly cards: Locator;
  29  |   /** LOC-011 */
  30  |   readonly detailPanel: Locator;
  31  |   readonly detailPanelArrow: Locator;
  32  | 
  33  |   constructor(private readonly page: Page) {
  34  |     this.employeeName = page.locator("xpath=//label[normalize-space()='Employee Name']/ancestor::div[.//input][1]//input");
  35  |     this.jobTitle = this.selectFor('Job Title');
  36  |     this.location = this.selectFor('Location');
  37  |     this.search = page.locator('form button[type="submit"]');
  38  |     this.reset = page.locator('form button[type="reset"]');
  39  |     this.resultsHeader = page.locator('span.oxd-text--span').filter({ hasText: /Records? Found$/ });
  40  |     this.cards = page.locator('.orangehrm-container .orangehrm-directory-card');
  41  |     this.detailPanel = page.locator('.orangehrm-corporate-directory-sidebar');
  42  |     this.detailPanelArrow = this.detailPanel.locator('i.bi-arrow-right');
  43  |   }
  44  | 
  45  |   private selectFor(label: string): Locator {
  46  |     return this.page.locator(
  47  |       `xpath=//label[normalize-space()='${label}']/ancestor::div[.//div[contains(@class,'oxd-select-text-input')]][1]//div[contains(@class,'oxd-select-text-input')]`,
  48  |     );
  49  |   }
  50  | 
  51  |   async open(): Promise<void> {
  52  |     await this.page.goto(DirectoryPage.PATH);
  53  |   }
  54  | 
  55  |   /** The state the login returns to: the Directory URL with its filter form. */
  56  |   async waitForDirectory(): Promise<void> {
  57  |     await this.page.waitForURL('**' + DirectoryPage.PATH);
  58  |     await this.search.waitFor({ state: 'visible' });
  59  |   }
  60  | 
  61  |   async headerText(): Promise<string> {
  62  |     return (await this.resultsHeader.first().innerText()).trim();
  63  |   }
  64  | 
  65  |   /**
  66  |    * Waits until result cards are displayed and the header shows a record count,
  67  |    * then returns the count. The header is read only after cards are displayed
  68  |    * (PB-001: a transient "No Records Found" was once seen while the list loaded).
  69  |    */
  70  |   async waitForResults(): Promise<{ header: string; count: number }> {
  71  |     await this.cards.first().waitFor({ state: 'visible' });
> 72  |     await expect(this.resultsHeader.first(), 'results header shows a record count').toHaveText(/^\(\d+\) Records? Found$/);
      |                                                                                     ^ Error: results header shows a record count
  73  |     const header = await this.headerText();
  74  |     return { header, count: parseCount(header) as number };
  75  |   }
  76  | 
  77  |   /**
  78  |    * Bounded wait for the results header to differ from the text read before an
  79  |    * action (Search / Reset). Returns false if it did not change within the
  80  |    * central timeout; the caller then reads and asserts the actual state, so a
  81  |    * missing reload still fails the approved assertion with the real values.
  82  |    */
  83  |   async waitForHeaderChange(previous: string): Promise<boolean> {
  84  |     try {
  85  |       await expect(this.resultsHeader.first()).not.toHaveText(previous, { timeout: settings.timeoutMs });
  86  |       return true;
  87  |     } catch (e) {
  88  |       // Only the bounded wait's own timeout is tolerated; anything else is rethrown.
  89  |       if (e instanceof Error && /Timeout \d+ms exceeded|timed out/i.test(e.message)) return false;
  90  |       throw e;
  91  |     }
  92  |   }
  93  | 
  94  |   /** Opens a custom dropdown (LOC-002/003) and clicks the option with this exact text (LOC-004). */
  95  |   async choose(dropdown: Locator, option: string): Promise<boolean> {
  96  |     await dropdown.click();
  97  |     const listbox = this.page.getByRole('listbox');
  98  |     await listbox.waitFor({ state: 'visible' });
  99  |     const opt = listbox.getByRole('option', { name: option, exact: true });
  100 |     if ((await opt.count()) === 0) {
  101 |       await this.page.keyboard.press('Escape');
  102 |       return false;
  103 |     }
  104 |     await opt.click();
  105 |     await expect(dropdown).toHaveText(option);
  106 |     return true;
  107 |   }
  108 | 
  109 |   /**
  110 |    * DATA-012 candidates: Job Title + Location pairs read from currently displayed
  111 |    * cards that show both (card subtitle = job title; the card body's 2nd
  112 |    * description = location, after the sub-unit; EVD-003, OBS-008).
  113 |    */
  114 |   async displayedPairs(): Promise<Array<{ name: string; jobTitle: string; location: string }>> {
  115 |     const pairs: Array<{ name: string; jobTitle: string; location: string }> = [];
  116 |     const total = await this.cards.count();
  117 |     for (let i = 0; i < total; i++) {
  118 |       const card = this.cards.nth(i);
  119 |       const subtitle = card.locator('.orangehrm-directory-card-subtitle');
  120 |       const location = card.locator('.orangehrm-directory-card-description').nth(1);
  121 |       if (!(await subtitle.isVisible()) || !(await location.isVisible())) continue;
  122 |       const jobTitle = (await subtitle.innerText()).trim();
  123 |       const loc = (await location.innerText()).trim();
  124 |       if (jobTitle && loc) {
  125 |         pairs.push({ name: (await card.locator('.orangehrm-directory-card-header').innerText()).trim(), jobTitle, location: loc });
  126 |       }
  127 |     }
  128 |     return pairs;
  129 |   }
  130 | }
  131 | 
```