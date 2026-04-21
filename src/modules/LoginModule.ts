import { expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { LandingPage } from '@pages/LandingPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class LoginModule {
  private logger: Logger;

  constructor(
    private loginPage: LoginPage,
    private landingPage: LandingPage,
  ) {
    this.logger = new Logger('LoginModule');
  }

  /**
   * Navigate to the app root, fill credentials, submit, and wait for post-login landing.
   */
  async doLogin(
    username: string = config.username,
    password: string = config.password,
  ): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Logging in as: ${username}`);
    await this.loginPage.navigate(config.loginPath);
    await this.loginPage.waitForPageLoad();
    await this.loginPage.fillUsername(username);
    await this.loginPage.fillPassword(password);
    await this.loginPage.clickSubmit();
    await this.loginPage.waitForPageLoad();
    this.logger.info('Login submitted');
  }

  /**
   * Verify the login error message contains the expected text.
   * Used for negative test TC-025.
   */
  async verifyLoginFailed(expectedError: string): Promise<void> {
    this.logger.warn(`Expecting login failure with message: "${expectedError}"`);
    await expect(
      this.loginPage.errorMessage(),
      `Error message should contain "${expectedError}"`,
    ).toBeVisible();
    await expect(
      this.loginPage.errorMessage(),
      `Error message should contain expected text`,
    ).toContainText(expectedError);
    this.logger.info('Login failure verified');
  }

  /**
   * Select France/English country from the user menu country picker.
   * Handles the T&C modal if it appears.
   */
  async selectFranceEnglish(): Promise<void> {
    this.logger.info('Selecting France / English country');
    await this.landingPage.clickUserMenu();
    await this.landingPage.selectCountry('FRANCE');
    await this.landingPage.waitForPageLoad();
    this.logger.info('France/English country selected');
  }

  /**
   * Accept Terms & Conditions if the modal is present.
   */
  async acceptTermsIfPresent(): Promise<void> {
    const visible = await this.landingPage.isTermsModalVisible();
    if (visible) {
      this.logger.info('T&C modal detected — accepting');
      await this.landingPage.clickAcceptTerms();
      await this.landingPage.waitForPageLoad();
      this.logger.info('T&C accepted');
    } else {
      this.logger.info('No T&C modal — skipping');
    }
  }
}
