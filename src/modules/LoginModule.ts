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
}
