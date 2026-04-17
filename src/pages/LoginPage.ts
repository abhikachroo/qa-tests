import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LoginPage — locators and simple UI actions for the login form.
 * Zero business logic. All multi-step orchestration lives in LoginModule.
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ---------------------------------------------------------------------------
  // Locators (arrow functions — never plain Locator properties)
  // ---------------------------------------------------------------------------

  emailInput    = () => this.page.getByLabel(/email/i);
  passwordInput = () => this.page.getByLabel(/password|mot de passe/i);
  submitBtn     = () => this.page.getByRole('button', { name: /sign in|log in|connexion|se connecter/i });
  errorMessage  = () => this.page.locator('[data-testid="login-error"], .login-error, [role="alert"]').first();

  // Post-login verification locators
  welcomeHeading      = () => this.page.getByRole('heading', { name: /welcome|bienvenue/i });
  accountSettingsBtn  = () => this.page.getByRole('button', { name: /account.*settings|mon compte/i });
  mainNavigation      = () => this.page.getByRole('navigation').first();

  // ---------------------------------------------------------------------------
  // Simple UI actions (one interaction each — no conditional logic)
  // ---------------------------------------------------------------------------

  async fillEmail(email: string): Promise<void> {
    await this.emailInput().fill(email);
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
