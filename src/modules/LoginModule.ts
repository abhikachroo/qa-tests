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
   *   7. Dismiss cookie banner if it re-appears after B2C redirect
   *
   * HEAL (Round 1): OneTrust cookie banner re-appears after the Azure B2C
   * authentication redirect. Added dismissCookieBannerIfPresent() after
   * waitForPageLoad() to clear the overlay before any subsequent interactions.
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
    await this.homePage.dismissCookieBannerIfPresent();
    this.logger.info('Login flow completed — post-login state pending verification');
  }

  /**
   * HEAL (Round 1 cleanup): Fixed typo — this.homeOage → this.homePage.
   */
  async doLoginEmailOnly(email: string = config.username): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Attempting login with email only: ${email}`);
    await this.homePage.navigate('/');
    await this.homePage.waitForPageLoad();
    await this.homePage.dismissCookieBannerIfPresent();
    await this.homePage.clickHeaderLoginLink();
    await this.loginPage.emailInput().waitFor({ state: 'visible' });
    this.logger.info('Azure B2C login form loaded');
    await this.loginPage.fillEmail(email);
    await this.loginPage.clickSubmit();
    await this.loginPage.errorMessage().waitFor({ state: 'visible', timeout: 15000 });
    this.logger.info('Submitted with empty password field — error element is visible');
  }

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

  async verifyLoginSuccess(): Promise<void> {
    this.logger.info('Verifying post-login authenticated state');
    await expect(
      this.homePage.userDetailsButton(),
      '"Account & settings" button should be visible after successful login',
    ).toBeVisible();
    this.logger.info('Login success verified — user-details-button is present');
  }

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
