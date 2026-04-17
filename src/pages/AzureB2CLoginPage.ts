import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AzureB2CLoginPage — locators and simple UI actions for the Azure B2C
 * authentication page that the application redirects to during login.
 *
 * Confirmed selectors from live UI inspection (2026-04-17):
 * - URL domain: login-fra-vanilla-test.dev.spark.sonepar.com (custom B2C domain)
 * - Email input:    textbox labelled "Email Address" — matches getByLabel(/email/i)
 * - Password input: textbox labelled "Password" — matches getByLabel(/^password$/i)
 * - Submit button:  button "Log in" — matches getByRole('button', { name: /log in/i })
 * - Show/hide pwd:  button "Show password" — matches getByRole('button', { name: /show password/i })
 */
export class AzureB2CLoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Email input — use getByLabel for resilience against ID changes
  emailInput         = () => this.page.getByLabel(/email/i);

  // Password input — use getByLabel
  passwordInput      = () => this.page.getByLabel(/^password$/i);

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
