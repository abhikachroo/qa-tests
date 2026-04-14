import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — Layer 2 (Locators & basic UI actions only).
 *
 * Covers the Azure B2C-hosted login form at:
 *   /account/api/login  (redirects to the OAuth2 provider)
 *
 * All locators are verified live against:
 *   https://fra-vanilla-preprod.dev.spark.sonepar.com
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ---------------------------------------------------------------------------
  // Locators — arrow functions, no logic
  // ---------------------------------------------------------------------------

  /** Email address input field */
  emailInput = () => this.page.getByRole('textbox', { name: 'Email Address' });

  /** Password input field */
  passwordInput = () => this.page.getByRole('textbox', { name: 'Password' });

  /** Primary submit / log-in button */
  loginBtn = () => this.page.getByRole('button', { name: 'Log in' });

  /**
   * Error alert rendered by Azure B2C on failed authentication.
   * The element has role="alert" making it a first-priority ARIA selector.
   */
  errorAlert = () => this.page.getByRole('alert');

  /** Paragraph inside the error alert containing the human-readable message */
  errorMessage = () => this.errorAlert().locator('p');

  /** "Forgot your password?" link */
  forgotPasswordLink = () => this.page.getByRole('link', { name: /forgot your password/i });

  // ---------------------------------------------------------------------------
  // Simple UI actions — one interaction each, zero logic
  // ---------------------------------------------------------------------------

  async fillEmail(email: string): Promise<void> {
    await this.emailInput().fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput().fill(password);
  }

  async clickLoginBtn(): Promise<void> {
    await this.loginBtn().click();
  }

  async getErrorText(): Promise<string> {
    return (await this.errorMessage().textContent()) ?? '';
  }

  async isErrorAlertVisible(): Promise<boolean> {
    return this.errorAlert().isVisible();
  }
}
