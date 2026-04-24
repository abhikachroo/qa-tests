import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Azure B2C login form locators

  // Email input field (strategy: role=textbox — avoids form aria-label collision)
  emailInput = () => this.page.getByRole('textbox', { name: 'Email Address' });

  // Password input field (strategy: role=textbox — consistent with emailInput)
  passwordInput = () => this.page.getByRole('textbox', { name: 'Password' });

  // Azure B2C primary submit button (strategy: id — verified via live app)
  submitBtn = () => this.page.locator('#next');

  // Show/hide password toggle (strategy: aria-label)
  showPasswordBtn = () => this.page.getByLabel('Show password');

  // Forgot password link (strategy: id)
  forgotPasswordLink = () => this.page.locator('#forgotPassword');

  // Error message container (strategy: data-testid)
  errorMessage = () => this.page.getByTestId('error-message');

  // Sign-up link on login page (strategy: data-testid)
  signUpLink = () => this.page.getByTestId('signup-url');

  // --- Simple UI actions ---

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
