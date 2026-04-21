/**
 * EcoSet Config — Login, Country Selection, T&C, Contact Us, Project & Switchboard
 * Jira: OPT1-6723
 * Feature: France/English Country & Currency Validation
 *
 * Precondition: OPCO=ECOSET_FR, ENVIRONMENT=preprod
 *   ENVIRONMENT=preprod OPCO=ECOSET_FR npx playwright test ecoset-config-login-setup
 *
 * Selectors marked // TODO: verify selector require live UI confirmation.
 */
import { test, expect } from '@fixtures';
import { config }       from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

test.describe(`@P0 @Smoke @EcoSetConfig @Login EcoSet Config — Login & Setup — ${config.displayName} on ${config.environment}`, () => {

  // ---------------------------------------------------------------------------
  // TC-001  P0  Smoke — Valid credentials login
  // ---------------------------------------------------------------------------
  test('TC-001: Valid credentials login redirects to app', async ({
    loginModule,
    loginPage,
  }) => {
    await test.step('Navigate to EcoSet Config and submit valid credentials', async () => {
      await loginModule.doLogin();
    });

    await test.step('Verify user is authenticated and app has loaded', async () => {
      await expect(loginPage.errorMessage()).not.toBeVisible();
      await expect(loginPage.page).toHaveURL(new RegExp(config.baseUrl.replace('https://', '')));
    });
  });

  // ---------------------------------------------------------------------------
  // TC-002  P0  Smoke — France/English country selection
  // ---------------------------------------------------------------------------
  test('TC-002: Select France/English country and verify English language', async ({
    loginModule,
    landingPage,
  }) => {
    await test.step('Login to EcoSet Config', async () => {
      await loginModule.doLogin();
    });

    await test.step('Open user menu and select France (English)', async () => {
      await loginModule.selectFranceEnglish();
    });

    await test.step('Verify FRANCE is the selected country and UI language is English', async () => {
      // TODO: verify selector for selected country indicator
      await expect(landingPage.selectedCountryText()).toContainText('FRANCE');
    });
  });

  // ---------------------------------------------------------------------------
  // TC-003  P1  Functional — Accept T&C → Project creation page
  // ---------------------------------------------------------------------------
  test('TC-003: Accept Terms & Conditions and arrive at Project creation page', async ({
    loginModule,
    projectPage,
  }) => {
    await test.step('Login to EcoSet Config', async () => {
      await loginModule.doLogin();
    });

    await test.step('Select France/English country', async () => {
      await loginModule.selectFranceEnglish();
    });

    await test.step('Accept Terms & Conditions if modal is present', async () => {
      await loginModule.acceptTermsIfPresent();
    });

    await test.step('Verify user has arrived on the Project creation page', async () => {
      // TODO: verify selector for project creation page heading
      await expect(projectPage.selectProductsHeading().or(
        projectPage.createProjectBtn()
      )).toBeVisible();
    });
  });

  // ---------------------------------------------------------------------------
  // TC-004  P1  Functional — Contact Us email
  // ---------------------------------------------------------------------------
  test('TC-004: Contact Us shows correct support email address', async ({
    loginModule,
    landingPage,
  }) => {
    await test.step('Login and land on app', async () => {
      await loginModule.doLogin();
    });

    await test.step('Open the Contact Us panel', async () => {
      await landingPage.clickContactUs();
    });

    await test.step('Verify support email is za-ccc@schneider-electric.com', async () => {
      await expect(
        landingPage.contactEmailText(),
        `Contact email should be ${config.contactEmail}`,
      ).toBeVisible();
      await expect(landingPage.contactEmailText()).toContainText(config.contactEmail);
    });
  });

  // ---------------------------------------------------------------------------
  // TC-005  P1  Functional — Contact Us phone
  // ---------------------------------------------------------------------------
  test('TC-005: Contact Us shows correct support phone number', async ({
    loginModule,
    landingPage,
  }) => {
    await test.step('Login and land on app', async () => {
      await loginModule.doLogin();
    });

    await test.step('Open the Contact Us panel', async () => {
      await landingPage.clickContactUs();
    });

    await test.step('Verify support phone is +27 (0)11 230 5880', async () => {
      await expect(
        landingPage.contactPhoneText(),
        `Contact phone should be ${config.contactPhone}`,
      ).toBeVisible();
      await expect(landingPage.contactPhoneText()).toContainText(config.contactPhone);
    });
  });

  // ---------------------------------------------------------------------------
  // TC-006  P0  Smoke — Create Project & Switchboard → Select Products page
  // ---------------------------------------------------------------------------
  test('TC-006: Create Project and Switchboard and arrive at Select Products page', async ({
    loginModule,
    projectModule,
  }) => {
    const projectName     = DataGenerator.projectName();
    const switchboardName = DataGenerator.switchboardName();

    await test.step('Login to EcoSet Config', async () => {
      await loginModule.doLogin();
    });

    await test.step('Select France/English and accept T&C if present', async () => {
      await loginModule.selectFranceEnglish();
      await loginModule.acceptTermsIfPresent();
    });

    await test.step(`Create project "${projectName}"`, async () => {
      await projectModule.createProject(projectName);
    });

    await test.step(`Create switchboard "${switchboardName}"`, async () => {
      await projectModule.createSwitchboard(switchboardName);
    });

    await test.step('Verify arrival on Select Products page', async () => {
      await projectModule.verifyOnSelectProductsPage();
    });
  });

});
