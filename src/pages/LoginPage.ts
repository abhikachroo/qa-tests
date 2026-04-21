import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — EcoSet Configurator login screen.
 * Locators are arrow functions (lazy evaluation).
 * No business logic, no assertions.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ─────────────────────────────────────────────────────────────
  usernameInput    = () => this.page.getByLabel(/e-mail|username|email/i).first();
  passwordInput    = () => this.page.getByLabel(/password|mot de passe/i).first();
  submitBtn        = () => this.page.getByRole('button', { name: /sign in|log in|connexion|se connecter/i });
  errorBanner      = () => this.page.locator('[role="alert"], .error-message, .login-error');
  countrySelector  = () => this.page.getByRole('combobox', { name: /country|pays/i });
  languageSelector = () => this.page.getByRole('combobox', { name: /language|langue/i });
  userMenuBtn      = () => this.page.getByRole('button', { name: /account|profile|mon compte/i }).first();
  dashboardHeading = () => this.page.getByRole('heading', { name: /dashboard|accueil|project/i }).first();

  // ── Actions ───────────────────────────────────────────────────────────────
  async fillUsername(username: string): Promise<void> {
    await this.usernameInput().fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput().fill(password);
  }

  async clickSubmit(): Promise<void> {
    await this.submitBtn().click();
  }

  async selectCountry(country: string): Promise<void> {
    const sel = this.countrySelector();
    if (await sel.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await sel.selectOption({ label: country });
    }
  }

  async selectLanguage(language: string): Promise<void> {
    const sel = this.languageSelector();
    if (await sel.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await sel.selectOption({ label: language });
    }
  }

  async getErrorText(): Promise<string> {
    return (await this.errorBanner().textContent()) ?? '';
  }

  /**
   * Wait for URL to change away from the login/signin path after successful login.
   * Called from LoginModule — keeps page.waitForURL() inside the Page layer.
   */
  async waitForRedirectAfterLogin(): Promise<void> {
    await this.page.waitForURL(
      (url) => !url.pathname.includes('login') && !url.pathname.includes('signin'),
      { timeout: 30_000 },
    );
  }
}
