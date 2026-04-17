import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AzureB2CLoginPage — locators and simple UI actions for the Azure B2C
 * authentication page that the application redirects to during login.
 *
 * Confirmed selectors from live UI inspection (2026-04-17):
 * - URL domain:     login-fra-vanilla-test.dev.spark.sonepar.com (custom B2C domain)
 * - Email input:    <input id="email" aria-label="Email Address"> — getByLabel('Email Address', { exact: true })
 *                   NOTE: regex /email/i also matches the form's aria-label — use exact string
 * - Password input: <input id="password" aria-label="Password"> — getByLabel('Password', { exact: true })
 * - Submit button:  <button>"Log in"</button> — getByRole('button', { name: /log in/i })
 * - Show/hide pwd:  <button>"Show password"</button> — getByRole('button', { name: /show password/i })
 */
export class AzureB2CLoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Email input — exact label match avoids ambiguity with form aria-label "Sign in with your email address"
  emailInput         = () => this.page.getByLabel('Email Address', { exact: true });

  // Password input — exact label match
  passwordInput      = () => this.page.getByLabel('Password', { exact: true });

  // Primary submit button — confirmed text "Log in" on live B2C page
  signInButton       = () => this.page.getByRole('button', { name: /log in/i });

  // Password show/hide toggle — confirmed text "Show password" on live B2C page
  passwordToggleBtn  = () => this.page.getByRole('button', { name: /show password/i });

  // Error message container shown on failed authentication
  errorMessage       = () => this.page.locator('#requiredFieldMissing, .error, [class*="error"]').first();

  async fillEmail(email: string): Promise<void> {
    await this.emailInput().fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput().fill(password);
  }

  async clickSignIn(): Promise<void> {
    await this.signInButton().click();
  }

  async clickPasswordToggle(): Promise<void> {
    await this.passwordToggleBtn().click();
  }

  async getPasswordInputType(): Promise<string | null> {
    return this.passwordInput().getAttribute('type');
  }

  async getErrorText(): Promise<string> {
    return (await this.errorMessage().textContent()) ?? '';
  }

  async waitForLoginPageLoad(): Promise<void> {
    await this.signInButton().waitFor({ state: 'visible', timeout: 30_000 });
  }
}
