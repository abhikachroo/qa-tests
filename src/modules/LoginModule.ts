import { expect }             from '@playwright/test';
import { HomePage }           from '@pages/HomePage';
import { AzureB2CLoginPage }  from '@pages/AzureB2CLoginPage';
import { Logger }             from '@utils/Logger';
import { config }             from '@config/index';

/**
 * LoginModule — orchestrates the Azure B2C OAuth2 login flow for
 * https://fra-vanilla-preprod.dev.spark.sonepar.com/
 *
 * Flow:
 *   1. Navigate to homepage
 *   2. Dismiss cookie banner if present
 *   3. Click header Login link → browser redirects to Azure B2C
 *   4. Fill email + password on Azure B2C page
 *   5. Click Sign In → browser redirects back to application homepage
 *   6. Wait for homepage to load in authenticated state
 */
export class LoginModule {
  private logger: Logger;

  constructor(
    private homePage:          HomePage,
    private azureB2CLoginPage: AzureB2CLoginPage,
  ) {
    this.logger = new Logger('LoginModule');
  }

  /**
   * Navigate to the application homepage and click the header Login link.
   * Verifies the browser has been redirected to the Azure B2C domain.
   */
  async navigateToLogin(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to homepage and triggering login redirect`);
    await this.homePage.navigateToHome();
    await this.homePage.dismissCookieBannerIfPresent();
    await this.homePage.clickHeaderLoginLink();
    await this.azureB2CLoginPage.waitForLoginPageLoad();
    this.logger.info('Azure B2C login page loaded');
  }

  /**
   * Perform a full login using the provided credentials (defaults to config values).
   * Waits for the redirect back to the application and page load to complete.
   */
  async performLogin(
    username: string = config.username,
    password: string = config.password,
  ): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Performing login as: ${username}`);
    await this.azureB2CLoginPage.fillEmail(username);
    await this.azureB2CLoginPage.fillPassword(password);
    await this.azureB2CLoginPage.clickSignIn();
    // Wait for redirect back to the application
    await this.homePage.waitForPageLoad();
    this.logger.info('Login completed — application homepage loaded in authenticated state');
  }

  /**
   * Full login from scratch: navigate → fill credentials → submit.
   * Convenience wrapper combining navigateToLogin() + performLogin().
   */
  async doLogin(
    username: string = config.username,
    password: string = config.password,
  ): Promise<void> {
    await this.navigateToLogin();
    await this.performLogin(username, password);
  }

  /**
   * Verify the application homepage URL after login.
   * Expects the URL to be the application baseUrl root.
   */
  async verifyPostLoginUrl(): Promise<void> {
    this.logger.info('Verifying post-login URL is homepage');
    await expect(
      this.homePage['page'],
      'Post-login URL should be the application root',
    ).toHaveURL(/^\/|^\/en|^\/fr|^https:\/\/fra-vanilla-preprod/);
    this.logger.info('Post-login URL verified');
  }

  /**
   * Verify the header Login link is no longer visible (authenticated state).
   * Interim assertion for AC-004 / G-002 — full user widget verification
   * pending selector confirmation.
   */
  async verifyLoginLinkAbsent(): Promise<void> {
    this.logger.info('Verifying header Login link is not visible in authenticated state');
    await expect(
      this.homePage.headerLoginLink(),
      'Header Login link should not be visible when authenticated',
    ).not.toBeVisible();
    this.logger.info('Authenticated header state verified');
  }

  /**
   * Toggle the password show/hide button on the Azure B2C login page
   * and return the resulting input type ('text' or 'password').
   */
  async togglePasswordVisibilityAndGetType(): Promise<string | null> {
    this.logger.info('Clicking password show/hide toggle');
    await this.azureB2CLoginPage.clickPasswordToggle();
    const inputType = await this.azureB2CLoginPage.getPasswordInputType();
    this.logger.info(`Password input type after toggle: ${inputType}`);
    return inputType;
  }
}
