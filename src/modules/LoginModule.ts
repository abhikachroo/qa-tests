import { Page, expect } from '@playwright/test';
import { LoginPage }   from '@pages/LoginPage';
import { Logger }      from '@utils/Logger';
import { config }      from '@config/index';

/**
 * LoginModule — business-logic workflows for the login feature.
 * Orchestrates LoginPage actions. Never calls page.locator() directly.
 */
export class LoginModule {
  private logger: Logger;

  constructor(
    private page: Page,
    private loginPage: LoginPage,
  ) {
    this.logger = new Logger('LoginModule');
  }

  /**
   * Navigate to the login page, fill credentials, and submit the form.
   * Defaults to the configured OPCO credentials — override for negative tests.
   */
  async doLogin(
    username: string = config.username,
    password: string = config.password,
  ): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Logging in as: ${username}`);
    await this.loginPage.navigate(config.loginPath);
    await this.loginPage.waitForPageLoad();
    await this.loginPage.dismissCookieBannerIfPresent();
    await this.loginPage.fillEmail(username);
    await this.loginPage.fillPassword(password);
    await this.loginPage.clickSubmit();
    await this.loginPage.waitForPageLoad();
    this.logger.info('Login form submitted — waiting for post-login state');
  }

  /**
   * Assert that the authenticated landing page is displayed:
   *   - URL no longer contains /login
   *   - Welcome heading is visible
   *   - Main navigation is present
   */
  async verifyAuthenticatedState(): Promise<void> {
    this.logger.info('Verifying post-login authenticated state');
    await expect(
      this.page,
      'URL should not contain /login after successful authentication',
    ).not.toHaveURL(/\/login/);
    await expect(
      this.loginPage.welcomeHeading(),
      'Welcome heading should be visible on the landing page',
    ).toBeVisible();
    await expect(
      this.loginPage.mainNavigation(),
      'Main navigation bar should be present after login',
    ).toBeVisible();
    this.logger.info('Authenticated state verified successfully');
  }
}
