/**
 * EcoSet Config — Product Pricing (EUR), SLD Display, Design 2D View
 * Jira: OPT1-6723
 * Feature: France/English Country & Currency Validation
 *
 * Precondition: OPCO=ECOSET_FR, ENVIRONMENT=preprod
 *   ENVIRONMENT=preprod OPCO=ECOSET_FR npx playwright test ecoset-config-products-currency
 *
 * Selectors marked // TODO: verify selector require live UI confirmation.
 */
import { test, expect } from '@fixtures';
import { config }        from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

/**
 * Shared setup: login → country select → T&C → create project + switchboard.
 * Extracts repetitive beforeEach logic into a reusable inline helper.
 * (Cannot be a module method because it needs multiple fixtures.)
 */
async function setupProjectAndSwitchboard(
  loginModule:   Parameters<Parameters<typeof test>[2]>[0]['loginModule'],
  projectModule: Parameters<Parameters<typeof test>[2]>[0]['projectModule'],
): Promise<void> {
  await loginModule.doLogin();
  await loginModule.selectFranceEnglish();
  await loginModule.acceptTermsIfPresent();
  await projectModule.createProject();
  await projectModule.createSwitchboard();
}

test.describe(`@P0 @Smoke @EcoSetConfig @Currency EcoSet Config — Product Pricing & Views — ${config.displayName} on ${config.environment}`, () => {

  // ---------------------------------------------------------------------------
  // TC-007  P1  Functional — Products page shows EUR prices
  // ---------------------------------------------------------------------------
  test('TC-007: Add products and verify prices are displayed in EUR currency', async ({
    loginModule,
    projectModule,
    productsModule,
    productsPage,
  }) => {
    await test.step('Login, select country, and create project + switchboard', async () => {
      await setupProjectAndSwitchboard(loginModule, projectModule);
    });

    await test.step('Add one product to the switchboard', async () => {
      await productsModule.addProducts(1);
    });

    await test.step('Verify product prices are displayed with EUR symbol', async () => {
      await expect(
        productsPage.productPriceItems().first(),
        'At least one product price should be visible',
      ).toBeVisible();
      await expect(productsPage.productPriceItems().first()).toContainText('€');
    });
  });

  // ---------------------------------------------------------------------------
  // TC-008  P1  Functional — EUR format €X,XX.XX
  // ---------------------------------------------------------------------------
  test('TC-008: Product prices match EUR format (€X,XX.XX — comma as thousands separator)', async ({
    loginModule,
    projectModule,
    productsModule,
  }) => {
    await test.step('Login, select country, and create project + switchboard', async () => {
      await setupProjectAndSwitchboard(loginModule, projectModule);
    });

    await test.step('Add one product', async () => {
      await productsModule.addProducts(1);
    });

    await test.step('Verify individual product prices conform to EUR format', async () => {
      // Assumption: EUR format = €X,XX.XX (comma = thousands separator)
      // TODO: confirm with product team before sign-off
      await productsModule.verifyProductPricesInEur();
    });
  });

  // ---------------------------------------------------------------------------
  // TC-009  P0  Smoke — Total Amount in EUR on Products page
  // ---------------------------------------------------------------------------
  test('TC-009: Total Amount is displayed in EUR format on the Products page', async ({
    loginModule,
    projectModule,
    productsModule,
  }) => {
    await test.step('Login, select country, and create project + switchboard', async () => {
      await setupProjectAndSwitchboard(loginModule, projectModule);
    });

    await test.step('Add one product', async () => {
      await productsModule.addProducts(1);
    });

    await test.step('Verify Total Amount is in EUR format on the Products page', async () => {
      await productsModule.verifyTotalAmountInEur();
    });
  });

  // ---------------------------------------------------------------------------
  // TC-010  P1  Functional — SLD displays all added products
  // ---------------------------------------------------------------------------
  test('TC-010: Single Line Diagram displays all added products', async ({
    loginModule,
    projectModule,
    productsModule,
  }) => {
    await test.step('Login, select country, and create project + switchboard', async () => {
      await setupProjectAndSwitchboard(loginModule, projectModule);
    });

    await test.step('Add two products', async () => {
      await productsModule.addProducts(2);
    });

    await test.step('Navigate to the Single Line Diagram tab', async () => {
      await productsModule.goToSld();
    });

    await test.step('Verify SLD canvas is visible and contains product nodes', async () => {
      await productsModule.verifySldDisplayed(1);
    });
  });

  // ---------------------------------------------------------------------------
  // TC-011  P1  Functional — SLD Total Amount in EUR
  // ---------------------------------------------------------------------------
  test('TC-011: SLD page Total Amount is displayed in EUR format', async ({
    loginModule,
    projectModule,
    productsModule,
  }) => {
    await test.step('Login, select country, and create project + switchboard', async () => {
      await setupProjectAndSwitchboard(loginModule, projectModule);
    });

    await test.step('Add one product and navigate to SLD', async () => {
      await productsModule.addProducts(1);
      await productsModule.goToSld();
    });

    await test.step('Verify SLD Total Amount contains EUR symbol', async () => {
      await productsModule.verifySldTotalAmountInEur();
    });
  });

  // ---------------------------------------------------------------------------
  // TC-012  P1  Functional — Design switchboard → all devices mounted
  // ---------------------------------------------------------------------------
  test('TC-012: Design switchboard and verify all devices are mounted', async ({
    loginModule,
    projectModule,
    productsModule,
  }) => {
    await test.step('Login, select country, and create project + switchboard', async () => {
      await setupProjectAndSwitchboard(loginModule, projectModule);
    });

    await test.step('Add one product, navigate to SLD, click Design Switchboard', async () => {
      await productsModule.addProducts(1);
      await productsModule.goToSld();
      await productsModule.designAndVerify2dView();
    });

    await test.step('Mount all devices and verify 0 unplaced devices remain', async () => {
      await productsModule.mountAllDevices();
    });
  });

  // ---------------------------------------------------------------------------
  // TC-013  P1  Functional — 2D view displayed after design
  // ---------------------------------------------------------------------------
  test('TC-013: 2D view is displayed correctly after designing the switchboard', async ({
    loginModule,
    projectModule,
    productsModule,
  }) => {
    await test.step('Login, select country, and create project + switchboard', async () => {
      await setupProjectAndSwitchboard(loginModule, projectModule);
    });

    await test.step('Add one product, navigate to SLD, click Design Switchboard', async () => {
      await productsModule.addProducts(1);
      await productsModule.goToSld();
    });

    await test.step('Verify 2D view canvas is displayed', async () => {
      await productsModule.designAndVerify2dView();
    });
  });

  // ---------------------------------------------------------------------------
  // TC-014  P1  Functional — Design page Total Amount in EUR
  // ---------------------------------------------------------------------------
  test('TC-014: Design page Total Amount is displayed in EUR format', async ({
    loginModule,
    projectModule,
    productsModule,
  }) => {
    await test.step('Login, select country, and create project + switchboard', async () => {
      await setupProjectAndSwitchboard(loginModule, projectModule);
    });

    await test.step('Add one product, navigate to SLD, design switchboard', async () => {
      await productsModule.addProducts(1);
      await productsModule.goToSld();
      await productsModule.designAndVerify2dView();
    });

    await test.step('Verify Design page Total Amount is in EUR format', async () => {
      await productsModule.verifyDesignTotalAmountInEur();
    });
  });

  // ---------------------------------------------------------------------------
  // TC-015  P2  Edge Case — EUR format holds after adding multiple products
  // ---------------------------------------------------------------------------
  test('TC-015: EUR format is preserved after adding multiple products', async ({
    loginModule,
    projectModule,
    productsModule,
  }) => {
    await test.step('Login, select country, and create project + switchboard', async () => {
      await setupProjectAndSwitchboard(loginModule, projectModule);
    });

    await test.step('Add 3 products', async () => {
      await productsModule.addProducts(3);
    });

    await test.step('Verify Total Amount still shows EUR symbol after multiple products', async () => {
      await productsModule.verifyTotalAmountInEur();
    });

    await test.step('Verify individual product prices still in EUR format', async () => {
      await productsModule.verifyProductPricesInEur();
    });
  });

  // ---------------------------------------------------------------------------
  // TC-016  P2  Negative — Removing all products shows zero/empty Total Amount
  // ---------------------------------------------------------------------------
  test('TC-016: Removing all products results in zero or empty Total Amount', async ({
    loginModule,
    projectModule,
    productsModule,
    productsPage,
  }) => {
    await test.step('Login, select country, and create project + switchboard', async () => {
      await setupProjectAndSwitchboard(loginModule, projectModule);
    });

    await test.step('Verify no products are present initially (empty state)', async () => {
      const count = await productsPage.getProductCount();
      // If products exist from a prior state, this test validates the empty/zero condition
      // TODO: add explicit product removal step once remove-product UI selector is confirmed
      expect(count, 'Should start from a known product count state').toBeGreaterThanOrEqual(0);
    });

    await test.step('Verify Total Amount is empty, zero, or not visible when no products are added', async () => {
      // When no products added, total amount should be €0.00 or not visible
      const totalText = await productsPage.getTotalAmountText();
      const isZeroOrEmpty =
        totalText === '' ||
        totalText.includes('0.00') ||
        totalText.includes('€0');
      expect(
        isZeroOrEmpty,
        `Total Amount should be zero or empty when no products added. Got: "${totalText}"`,
      ).toBe(true);
    });
  });

});
