import { expect }    from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage }  from '@pages/HomePage';
import { Logger }    from '@utils/Logger';
import { config }    from '@config/index';

export class LoginModule {
  private logger: Logger;

  constructor(
    private loginPage: LoginPage,
    private homePage:  HomePage,
  ) {
    this.logger = new Logger('LoginModule');
  }

  /**
   * Full end-to-end login flow.
   *
   * Steps:
   *   1. Navigate to app homepage
   *   2. Dismiss cookie banner if present
   *   3. Click the header login link — redirects to Azure B2C domain
   *   4. Fill email and password on the Azure B2C form
   *   5. Click submit — Azure B2C redirects back to the app
   *   6. Wait for page load
   *
   * @param username - Defaults to config.username (from config.json)
   * @param password - Defaults to config.password (from config.json)
   */
  async doLogin(
    username: string = config.username,
    password: string = config.password,
  ): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Starting login for: ${username}`);
    await this.homePage.navigate('/');
    await this.homePage.waitForPageLoad();
    await this.homePage.dismissCookieBannerIfPresent();
    await this.homePage.clickHeaderLoginLink();
    await this.loginPage.waitForPageLoad();
    this.logger.info('Azure B2C login form loaded');
    await this.loginPage.fillEmail(username);
    await this.loginPage.fillPassword(password);
    await this.loginPage.clickSubmit();
    await this.homePage.waitForPageLoad();
    this.logger.info('Login flow completed — post-login state pending verification');
  }

  /**
   * Attempt login with only the email step (no password).
   * Used for TC-005: empty password field validation.
   *
   * Steps:
   *   1. Navigate to app homepage and reach Azure B2C login form
   *   2. Fill only the email field
   *   3. Click submit without filling the password
   *
   * @param email - Email to pre-fill
   */
  async doLoginEmailOnly(email: string = config.username): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Attempting login with email only: ${email}`);
    await this.homePage.navigate('/');
    await this.homePage.waitForPageLoad();
    await this.homePage.dismissCookieBannerIfPresent();
    await this.homePage.clickHeaderLoginLink();
    await this.loginPage.waitForPageLoad();
    this.logger.info('Azure B2C login form loaded');
    await this.loginPage.fillEmail(email);
    await this.loginPage.clickSubmit();
    this.logger.info('Submitted with empty password field');
  }

  /**
   * Navigate to the Azure B2C login form without filling any fields,
   * then immediately submit to trigger empty-field validation.
   * Used for TC-004 (empty email) and TC-006 (both fields empty).
   */
  async doLoginWithoutCredentials(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Submitting login form with no credentials`);
    await this.homePage.navigate('/');
    await this.homePage.waitForPageLoad();
    await this.homePage.dismissCookieBannerIfPresent();
    await this.homePage.clickHeaderLoginLink();
    await this.loginPage.waitForPageLoad();
    this.logger.info('Azure B2C login form loaded — submitting empty');
    await this.loginPage.clickSubmit();
    this.logger.info('Empty form submitted');
  }

  /**
   * Assert post-login authenticated state.
   * Verifies the "Account & settings" button (user-details-button) is visible,
   * which replaces the pre-login "Login"/"Sign up" controls.
   */
  async verifyLoginSuccess(): Promise<void> {
    this.logger.info('Verifying post-login authenticated state');
    await expect(
      this.homePage.userDetailsButton(),
      '"Account & settings" button should be visible after successful login',
    ).toBeVisible();
    this.logger.info('Login success verified — user-details-button is present');
  }

  /**
   * Assert that the Azure B2C error message container is visible
   * and contains the expected error text.
   *
   * Used in negative test cases (TC-002, TC-003, TC-004, TC-005, TC-006).
   *
   * @param expectedText - Partial text expected to appear in the error message
   */
  async verifyLoginError(expectedText: string): Promise<void> {
    this.logger.info(`Verifying login error message contains: "${expectedText}"`);
    await expect(
      this.loginPage.errorMessage(),
      `Error message element should be visible on the Azure B2C login page`,
    ).toBeVisible();
    await expect(
      this.loginPage.errorMessage(),
      `Error message should contain: "${expectedText}"`,
    ).toContainText(expectedText);
    this.logger.info('Login error verified successfully');
  }
}
