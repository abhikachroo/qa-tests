import { expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

/**
 * LoginModule — Layer 3 (Business logic workflows).
 *
 * Orchestrates LoginPage actions into domain-level steps.
 * No page.locator() calls here — all browser interaction goes through LoginPage methods.
 */
export class LoginModule {
  private logger: Logger;

  constructor(private loginPage: LoginPage) {
    this.logger = new Logger('LoginModule');
  }

  // ---------------------------------------------------------------------------
  // Workflows
  // ---------------------------------------------------------------------------

  /**
   * Navigate to the login page and wait for the form to be ready.
   */
  async navigateToLoginPage(): Promise<void> {
    this.logger.info(
      `[${config.opco}][${config.environment}] Navigating to login page: ${config.loginPath}`,
    );
    await this.loginPage.navigate(config.loginPath);
    await this.loginPage.waitForPageLoad();
    this.logger.info('Login page loaded and ready');
  }

  /**
   * Fills in and submits the login form with the supplied credentials.
   * Does NOT assert outcome — callers decide what to assert.
   */
  async submitLoginForm(email: string, password: string): Promise<void> {
    this.logger.info(
      `[${config.opco}][${config.environment}] Submitting login form with email: ${email}`,
    );
    await this.loginPage.fillEmail(email);
    await this.loginPage.fillPassword(password);
    await this.loginPage.clickLoginBtn();
    this.logger.info('Login form submitted');
  }

  /**
   * Asserts that the error alert is visible and contains the expected message.
   * Use for negative / invalid-credentials tests.
   */
  async verifyLoginErrorMessage(expectedMessage: string): Promise<void> {
    this.logger.info('Verifying login error message is displayed');
    await expect(
      this.loginPage.errorAlert(),
      'Error alert should be visible after failed login attempt',
    ).toBeVisible();
    await expect(
      this.loginPage.errorMessage(),
      `Error message should contain: "${expectedMessage}"`,
    ).toContainText(expectedMessage);
    this.logger.info(`Login error verified: "${expectedMessage}"`);
  }

  /**
   * Asserts that the error alert is NOT present (i.e. no error shown).
   */
  async verifyNoErrorDisplayed(): Promise<void> {
    this.logger.info('Verifying no error alert is displayed');
    await expect(
      this.loginPage.errorAlert(),
      'Error alert should not be visible',
    ).not.toBeVisible();
    this.logger.info('No error alert confirmed');
  }
}
