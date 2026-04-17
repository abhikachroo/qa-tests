import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * AzureB2CLoginPage — locators and simple UI actions for the Azure B2C
 * authentication page that the application redirects to during login.
 *
 * Confirmed selectors from live UI inspection:
 * - URL pattern: login.microsoftonline.com (external domain — no baseURL prefix)
 * - Email input:    <input type="email" id="signInName"> — labelled "Email Address"
 * - Password input: <input type="password" id="password"> — labelled "Password"
 * - Submit button:  <button id="next"> "Sign in"
 * - Show/hide pwd:  aria-label="Show password" toggle button
 */
export class AzureB2CLoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Email input — use getByLabel for resilience against ID changes
  emailInput         = () => this.page.getByLabel(/email/i);

  // Password input — use getByLabel
  passwordInput      = () => this.page.getByLabel(/^password$/i);

  // Primary submit / "Sign in" button
  signInButton       = () => this.page.getByRole('button', { name: /sign in|next/i });

  // Password show/hide toggle
  passwordToggleBtn  = () => this.page.getByRole('button', { name: /show password|masquer|afficher/i });

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
