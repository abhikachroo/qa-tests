import { expect }     from '@playwright/test';
import { LoginPage }  from '@pages/LoginPage';
import { Logger }     from '@utils/Logger';
import { config }     from '@config/index';

/**
 * LoginModule — orchestrates EcoSet Configurator authentication.
 *
 * All credentials and URLs read from config — never hardcoded.
 * All browser interaction goes through LoginPage methods.
 */
export class LoginModule {
  private logger: Logger;

  constructor(private loginPage: LoginPage) {
    this.logger = new Logger('LoginModule');
  }

  /**
   * Full login flow:
   * 1. Navigate to login path
   * 2. Dismiss cookie banner if present
   * 3. Optionally select country / language
   * 4. Fill credentials and submit
   * 5. Wait for post-login redirect (via LoginPage.waitForRedirectAfterLogin)
   */
  async doLogin(
    username: string = config.username ?? '',
    password: string = config.password ?? '',
  ): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Logging in as: ${username}`);

    await this.loginPage.navigate(config.loginPath ?? '/');
    await this.loginPage.waitForPageLoad();
    await this.loginPage.dismissCookieBannerIfPresent();

    if (config.country) {
      await this.loginPage.selectCountry(config.country);
    }
    if (config.language) {
      await this.loginPage.selectLanguage(config.language);
    }

    await this.loginPage.fillUsername(username);
    await this.loginPage.fillPassword(password);
    await this.loginPage.clickSubmit();
    await this.loginPage.waitForRedirectAfterLogin();
    await this.loginPage.waitForPageLoad();
    this.logger.info('Login completed successfully');
  }

  /** Verify login failed and the error banner shows expected text. */
  async verifyLoginFailed(expectedErrorSnippet: string): Promise<void> {
    this.logger.warn(`Verifying login failure — expected: "${expectedErrorSnippet}"`);
    await expect(
      this.loginPage.errorBanner(),
      'Login error banner should be visible',
    ).toBeVisible();
    await expect(
      this.loginPage.errorBanner(),
      `Error banner should contain: "${expectedErrorSnippet}"`,
    ).toContainText(expectedErrorSnippet);
    this.logger.info('Login failure verified');
  }

  /** Verify the user is authenticated by checking a post-login element. */
  async verifyAuthenticated(): Promise<void> {
    this.logger.info('Verifying authenticated state');
    const userMenu  = this.loginPage.userMenuBtn();
    const dashboard = this.loginPage.dashboardHeading();
    const eitherVisible =
      await userMenu.isVisible({ timeout: 10_000 }).catch(() => false) ||
      await dashboard.isVisible({ timeout: 3_000 }).catch(() => false);
    expect(eitherVisible, 'A post-login UI element should be visible after successful login').toBe(true);
    this.logger.info('Authenticated state confirmed');
  }
}
