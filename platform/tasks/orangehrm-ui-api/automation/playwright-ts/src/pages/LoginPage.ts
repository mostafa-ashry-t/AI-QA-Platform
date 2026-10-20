import { Locator, Page } from '@playwright/test';

/**
 * Login page (dependency of the Directory flow; OBS-001).
 * Locators verified read-only on 2026-10-18 (Playwright MCP evaluate on /auth/login):
 * input name="username", input name="password", the form's only submit button.
 */
export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.submit = page.locator('form button[type="submit"]');
  }

  /** Waits for the login form (the state the redirect leads to). */
  async waitForForm(): Promise<void> {
    await this.username.waitFor({ state: 'visible' });
  }

  /** Types the demo credentials; values are never logged. */
  async login(credentials: { username: string; password: string }): Promise<void> {
    await this.username.fill(credentials.username);
    await this.password.fill(credentials.password);
    await this.submit.click();
  }
}
