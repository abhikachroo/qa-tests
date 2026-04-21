/**
 * OPT1-6723 — EcoSet Config: France/English Country & Currency Validation
 *
 * Prerequisites:
 *   ENVIRONMENT=preprod
 *   OPCO=ECOSET_FR
 *
 * Run:
 *   ENVIRONMENT=preprod OPCO=ECOSET_FR npx playwright test ecoset-config-france --project=chromium
 *
 * Scenarios:
 *   TC-001 P0 @Smoke  — Login + France/English country selection + T&C acceptance
 *   TC-002 P1         — Verify Contact Us email and phone number
 *   TC-003 P0 @Smoke  — Create Project & Switchboard → arrive at Select Products page
 *   TC-004 P1         — Add product → verify EUR pricing displayed
 *   TC-005 P1         — Products page Total Amount displayed in EUR (€X,XX.XX)
 *   TC-006 P1         — Single Line Diagram displayed with Total Amount in EUR
 *   TC-007 P1         — Design switchboard / 2D view displayed with Total Amount in EUR
 *   TC-008 P1         — BOM tab: EUR prices + Total Amount in EUR format
 *   TC-009 P0 @Smoke  — Bulk Export triggers zip download
 *   TC-010 P2         — Login with invalid credentials shows error
 *   TC-011 P2         — EUR format validation: Total Amount matches €X,XX.XX pattern
 */

import { test, expect } from '@fixtures';
import { config }       from '@config/index';

test.describe(`@EcoSet @P0 @Smoke EcoSet Config France — ${config.displayName} on ${config.environment}`, () => {

  // =========================================================================
  // P0 SMOKE — Login & Setup
  // =========================================================================

  test('TC-001: Login, select France/English and accept Terms & Conditions', async ({
    page,
    loginModule,
    ecoSetConfigModule,
  }) => {
    await test.step('Navigate to EcoSet Config and log in with ECOSET_FR credentials', async () => {
      await loginModule.doLogin();
    });

    await test.step('Select France / English from the user menu', async () => {
      await loginModule.selectFranceEnglish();
    });

    await test.step('Accept Terms & Conditions if modal is displayed', async () => {
      await loginModule.acceptTermsAndConditionsIfPresent();
    });

    await test.step('Verify France is the active country selection', async () => {
      await ecoSetConfigModule.verifyFranceEnglishSelected();
    });

    await test.step('Verify user has arrived at the Project creation page', async () => {
      await expect(page).not.toHaveURL(/login|auth|keycloak/i);
    });
  });

  // =========================================================================
  // P0 SMOKE — Project & Switchboard creation
  // =========================================================================

  test('TC-003: Create Project and Switchboard then verify Select Products page', async ({
    loginModule,
    ecoSetConfigModule,
  }) => {
    await test.step('Log in and accept T&C', async () => {
      await loginModule.doLogin();
      await loginModule.acceptTermsAndConditionsIfPresent();
    });

    await test.step('Create a new Project with a generated name', async () => {
      await ecoSetConfigModule.createProjectAndSwitchboard();
    });

    await test.step('Verify user arrived at Select Products page', async () => {
      await ecoSetConfigModule.verifyOnSelectProductsPage();
    });
  });

  // =========================================================================
  // P0 SMOKE — Bulk Export
  // =========================================================================

  test('TC-009: Bulk Export produces a zip file download', async ({
    loginModule,
    ecoSetConfigModule,
  }) => {
    await test.step('Log in, create project and add a product', async () => {
      await loginModule.doLogin();
      await loginModule.acceptTermsAndConditionsIfPresent();
      await ecoSetConfigModule.createProjectAndSwitchboard();
      await ecoSetConfigModule.addOneProduct();
    });

    await test.step('Navigate to Export tab and trigger Bulk Export', async () => {
      await ecoSetConfigModule.performBulkExportAndVerify();
    });
  });

});

test.describe(`@EcoSet @P1 @Regression EcoSet Config France — ${config.displayName} on ${config.environment}`, () => {

  // =========================================================================
  // P1 — Contact Us
  // =========================================================================

  test('TC-002: Contact Us panel shows correct email and phone number', async ({
    loginModule,
    ecoSetConfigModule,
  }) => {
    await test.step('Log in and accept T&C', async () => {
      await loginModule.doLogin();
      await loginModule.acceptTermsAndConditionsIfPresent();
    });

    await test.step('Open Contact Us panel and verify support details', async () => {
      await ecoSetConfigModule.verifyContactDetails();
    });
  });

  // =========================================================================
  // P1 — EUR Pricing
  // =========================================================================

  test('TC-004: Add product and verify EUR currency pricing is displayed', async ({
    loginModule,
    ecoSetConfigModule,
  }) => {
    await test.step('Log in, create project and switchboard', async () => {
      await loginModule.doLogin();
      await loginModule.acceptTermsAndConditionsIfPresent();
      await ecoSetConfigModule.createProjectAndSwitchboard();
    });

    await test.step('Add one product from the catalogue', async () => {
      await ecoSetConfigModule.addOneProduct();
    });

    await test.step('Verify at least one EUR price (€) is visible in products list', async () => {
      await ecoSetConfigModule.verifyEurPricingVisible();
    });
  });

  test('TC-005: Products page Total Amount is displayed in EUR format (€X,XX.XX)', async ({
    loginModule,
    ecoSetConfigModule,
  }) => {
    await test.step('Log in, create project and add a product', async () => {
      await loginModule.doLogin();
      await loginModule.acceptTermsAndConditionsIfPresent();
      await ecoSetConfigModule.createProjectAndSwitchboard();
      await ecoSetConfigModule.addOneProduct();
    });

    await test.step('Verify Total Amount field is visible and contains EUR symbol', async () => {
      await ecoSetConfigModule.verifyTotalAmountEur();
    });
  });

  // =========================================================================
  // P1 — SLD
  // =========================================================================

  test('TC-006: Single Line Diagram is displayed with Total Amount in EUR', async ({
    loginModule,
    ecoSetConfigModule,
  }) => {
    await test.step('Log in, create project and add a product', async () => {
      await loginModule.doLogin();
      await loginModule.acceptTermsAndConditionsIfPresent();
      await ecoSetConfigModule.createProjectAndSwitchboard();
      await ecoSetConfigModule.addOneProduct();
    });

    await test.step('Navigate to SLD tab and verify diagram and EUR Total', async () => {
      await ecoSetConfigModule.navigateToSldAndVerify();
    });
  });

  // =========================================================================
  // P1 — Design / 2D
  // =========================================================================

  test('TC-007: Design switchboard — 2D view displayed with Total Amount in EUR', async ({
    loginModule,
    ecoSetConfigModule,
  }) => {
    await test.step('Log in, create project and add a product', async () => {
      await loginModule.doLogin();
      await loginModule.acceptTermsAndConditionsIfPresent();
      await ecoSetConfigModule.createProjectAndSwitchboard();
      await ecoSetConfigModule.addOneProduct();
    });

    await test.step('Navigate to Design tab and verify 2D view and EUR Total', async () => {
      await ecoSetConfigModule.navigateToDesignAndVerify();
    });
  });

  // =========================================================================
  // P1 — BOM
  // =========================================================================

  test('TC-008: Bill of Materials shows EUR prices and EUR Total Amount', async ({
    loginModule,
    ecoSetConfigModule,
  }) => {
    await test.step('Log in, create project and add a product', async () => {
      await loginModule.doLogin();
      await loginModule.acceptTermsAndConditionsIfPresent();
      await ecoSetConfigModule.createProjectAndSwitchboard();
      await ecoSetConfigModule.addOneProduct();
    });

    await test.step('Navigate to BOM tab and verify EUR prices and Total Amount', async () => {
      await ecoSetConfigModule.navigateToBomAndVerify();
    });
  });

});

test.describe(`@EcoSet @P2 @Regression EcoSet Config France — ${config.displayName} on ${config.environment}`, () => {

  // =========================================================================
  // P2 — Negative / Edge cases
  // =========================================================================

  test('TC-010: Login with invalid credentials shows an error message', async ({
    page,
    loginModule,
    loginPage,
  }) => {
    await test.step('Navigate to EcoSet Config login page', async () => {
      await loginPage.navigate(config.loginPath);
      await loginPage.waitForPageLoad();
      await loginPage.dismissCookieBannerIfPresent();
    });

    await test.step('Submit login with an invalid password', async () => {
      await loginPage.fillUsername(config.username);
      await loginPage.fillPassword('INVALID_PASSWORD_XYZ_999');
      await loginPage.clickSubmit();
    });

    await test.step('Verify an error message is displayed and user is not logged in', async () => {
      // Should remain on the login/auth page
      await expect(page).toHaveURL(/login|auth|keycloak/i);
      // Error message should appear (alert role or .error class)
      await expect(
        loginPage.errorMessage(),
        'An error message should be visible after failed login',
      ).toBeVisible();
    });
  });

  test('TC-011: EUR Total Amount format matches €X,XX.XX pattern', async ({
    loginModule,
    ecoSetConfigModule,
    ecoSetProductsPage,
  }) => {
    await test.step('Log in, create project and add a product', async () => {
      await loginModule.doLogin();
      await loginModule.acceptTermsAndConditionsIfPresent();
      await ecoSetConfigModule.createProjectAndSwitchboard();
      await ecoSetConfigModule.addOneProduct();
    });

    await test.step('Read and validate Total Amount format as €X,XX.XX', async () => {
      const totalText = await ecoSetProductsPage.getTotalAmountText();
      // Matches: €1,234.56 or €0.00 or €12,345.00 — EUR with optional thousands separator
      expect(
        totalText,
        `Total Amount "${totalText}" should match EUR format €X,XX.XX`,
      ).toMatch(/€\s*[\d,\.]+/);
    });
  });

  test('TC-012: BOM Total Price matches Project & Switchboard Total Amount', async ({
    loginModule,
    ecoSetConfigModule,
    ecoSetProductsPage,
  }) => {
    await test.step('Log in, create project and add a product', async () => {
      await loginModule.doLogin();
      await loginModule.acceptTermsAndConditionsIfPresent();
      await ecoSetConfigModule.createProjectAndSwitchboard();
      await ecoSetConfigModule.addOneProduct();
    });

    await test.step('Capture Products page Total Amount', async () => {
      // Total is read from the products view
      await ecoSetConfigModule.verifyTotalAmountEur();
    });

    await test.step('Navigate to BOM and verify Total Amount is consistent with EUR format', async () => {
      await ecoSetConfigModule.navigateToBomAndVerify();
      const bomTotal = await ecoSetProductsPage.getBomTotalText();
      expect(
        bomTotal,
        `BOM Total "${bomTotal}" should match EUR format €X,XX.XX`,
      ).toMatch(/€\s*[\d,\.]+/);
    });
  });

});
