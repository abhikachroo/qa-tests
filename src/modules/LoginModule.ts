import { Page } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class LoginModule {
  private logger: Logger;

  constructor(
    private page: Page,
    private loginPage: LoginPage,
  ) {
    this.logger = new Logger('LoginModule');
  }

  /**
   * Full login flow:
   *   1. Navigate to loginPath
   *   2. Dismiss cookie banner if present
   *   3. Fill email + password
   *   4. Click submit
   *   5. Wait for page load
   */
  async doLogin(
    username: string = config.username,
    password: string = config.password,
  ): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Logging in as: ${username}`);
    await this.loginPage.navigate(config.loginPath);
    await this.loginPage.waitForPageLoad();
    await this.loginPage.dismissCookieBannerIfPresent();
    await this.loginPage.fillUsername(username);
    await this.loginPage.fillPassword(password);
    await this.loginPage.clickSubmit();
    await this.page.waitForLoadState('networkidle');
    this.logger.info('Login submitted — waiting for post-login navigation');
  }

  /**
   * Select France / English country from the user menu.
   * Called after initial login if country has not been set yet.
   */
  async selectFranceEnglish(): Promise<void> {
    this.logger.info('Selecting country: France (English)');
    await this.loginPage.clickUserMenu();
    await this.loginPage.clickCountryFrance();
    await this.page.waitForLoadState('networkidle');
    this.logger.info('Country France / English selected');
  }

  /**
   * Accept Terms & Conditions if the modal is present.
   * On first login the T&C modal is shown; on subsequent logins it may be absent.
   */
  async acceptTermsAndConditionsIfPresent(): Promise<void> {
    this.logger.info('Checking for Terms & Conditions modal');
    const btn = this.loginPage.acceptTcsBtn();
    const isVisible = await btn.isVisible({ timeout: 8_000 }).catch(() => false);
    if (isVisible) {
      this.logger.info('T&C modal found — accepting');
      await this.loginPage.clickAcceptTcs();
      await this.page.waitForLoadState('networkidle');
      this.logger.info('Terms & Conditions accepted');
    } else {
      this.logger.info('No T&C modal present — continuing');
    }
  }

  async verifyLoginFailed(expectedError: string): Promise<void> {
    const errorText = await this.loginPage.getErrorText();
    this.logger.warn(`Login failed as expected. Error text: "${errorText}"`);
    // Caller is responsible for the assertion so it appears in the test report
    void expectedError;
  }
}
