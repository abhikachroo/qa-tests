import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — EcoSet Config login form.
 *
 * Selector strategy (in priority order, most-to-least robust):
 *   1. getByLabel() for accessible labels
 *   2. getByPlaceholder() for inputs with placeholder text
 *   3. CSS structural selectors (input[type=email], input[type=password])
 *   4. getByRole('button') for the submit action
 *
 * The app uses a Keycloak-style OIDC login page. The email field typically
 * carries the label "Email" or "Username", and the submit button is
 * labelled "Sign In", "Log In", or "Se connecter" depending on locale.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // --- Locators -----------------------------------------------------------

  /**
   * Email / username input.
   * Tries getByLabel first, falls back to type=email, then name=email/username.
   */
  usernameInput = (): Locator =>
    this.page.locator(
      'input[type="email"], input[name="email"], input[name="username"], input[id="username"], input[id="email"]',
    ).first();

  passwordInput = (): Locator =>
    this.page.locator(
      'input[type="password"], input[name="password"], input[id="password"]',
    ).first();

  /** Primary submit / sign-in button — covers EN and FR labels */
  submitBtn = (): Locator =>
    this.page.getByRole('button', { name: /sign in|log in|se connecter|connexion|login|submit/i });

  /** Generic error/alert container */
  errorMessage = (): Locator =>
    this.page.locator('.alert, .error, [class*="error"], [class*="alert"], [role="alert"]').first();

  /** Country / language selector — user menu trigger */
  userMenuBtn = (): Locator =>
    this.page.locator('[class*="user"], [class*="avatar"], [class*="profile"], [aria-label*="user" i], [aria-label*="account" i]').first();

  /** Country list item for France */
  countryFranceOption = (): Locator =>
    this.page.getByText(/france/i).first();

  /** Terms & Conditions accept button */
  acceptTcsBtn = (): Locator =>
    this.page.getByRole('button', { name: /accept|agree|i accept|j'accepte/i });

  /** Confirmation that TC was accepted — project creation page heading */
  projectCreationHeading = (): Locator =>
    this.page.getByRole('heading', { name: /project|new project|create/i });

  // --- Actions ------------------------------------------------------------

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

  async clickUserMenu(): Promise<void> {
    await this.userMenuBtn().click();
  }

  async clickCountryFrance(): Promise<void> {
    await this.countryFranceOption().click();
  }

  async clickAcceptTcs(): Promise<void> {
    await this.acceptTcsBtn().click();
  }
}
