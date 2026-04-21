import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — EcoSet Config login screen
 * Locators are approximate and marked // TODO: verify selector
 * Run `npx playwright codegen https://ecoset-config-ppr.se.com/` to confirm.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // TODO: verify selector — confirm via browser inspection
  usernameInput  = () => this.page.getByLabel(/email|username/i);
  passwordInput  = () => this.page.getByLabel(/password/i);
  submitBtn      = () => this.page.getByRole('button', { name: /sign in|login|connect/i });
  errorMessage   = () => this.page.getByRole('alert');

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput().fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput().fill(password);
  }

  async clickSubmit(): Promise<void> {
    await this.submitBtn().click();
  }

  async getErrorText(): Promise<string> {
    return (await this.errorMessage().textContent()) ?? '';
  }
}
