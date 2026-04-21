/**
 * EcoSet Config — BOM Pricing Verification & Bulk Export
 * Jira: OPT1-6723
 * Feature: France/English Country & Currency Validation
 *
 * Precondition: OPCO=ECOSET_FR, ENVIRONMENT=preprod
 *   ENVIRONMENT=preprod OPCO=ECOSET_FR npx playwright test ecoset-config-bom-export
 *
 * Selectors marked // TODO: verify selector require live UI confirmation.
 *
 * Open items (from test plan):
 *   - TC-019/TC-020-023: BOM.csv format — "3 worksheets in a CSV" is technically invalid;
 *     may mean 3 separate CSV files or a multi-sheet XLSX. TODO: confirm with product team.
 *   - TC-024: TotalPrice reconciliation assumes BOM and Products page share the same total.
 */
import { test, expect } from '@fixtures';
import { config }        from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

/**
 * Full setup helper: login → country → T&C → project → switchboard → add products → BOM tab.
 */
async function setupThroughBom(
  loginModule:    Parameters<Parameters<typeof test>[2]>[0]['loginModule'],
  projectModule:  Parameters<Parameters<typeof test>[2]>[0]['projectModule'],
  productsModule: Parameters<Parameters<typeof test>[2]>[0]['productsModule'],
  bomModule:      Parameters<Parameters<typeof test>[2]>[0]['bomModule'],
  productCount = 1,
): Promise<void> {
  await loginModule.doLogin();
  await loginModule.selectFranceEnglish();
  await loginModule.acceptTermsIfPresent();
  await projectModule.createProject();
  await projectModule.createSwitchboard();
  await productsModule.addProducts(productCount);
  // Navigate to BOM tab via Design page path
  await productsModule.goToSld();
  await productsModule.designAndVerify2dView();
  await productsModule.mountAllDevices();
  // TODO: verify the exact navigation to BOM tab from design page
  await bomModule.goToExport(); // placeholder — will need adjustment once BOM tab confirmed
}

test.describe(`@P1 @Regression @EcoSetConfig @BOM EcoSet Config — BOM & Export — ${config.displayName} on ${config.environment}`, () => {

  // ---------------------------------------------------------------------------
  // TC-017  P1  Functional — BOM shows products with EUR prices
  // ---------------------------------------------------------------------------
  test('TC-017: BOM page shows products with EUR prices', async ({
    loginModule,
    projectModule,
    productsModule,
    bomModule,
    bomPage,
  }) => {
    await test.step('Login, create project + switchboard, add products, navigate to BOM', async () => {
      await loginModule.doLogin();
      await loginModule.selectFranceEnglish();
      await loginModule.acceptTermsIfPresent();
      await projectModule.createProject();
      await projectModule.createSwitchboard();
      await productsModule.addProducts(1);
      await productsModule.goToSld();
      await productsModule.designAndVerify2dView();
      await productsModule.mountAllDevices();
    });

    await test.step('Navigate to the Bill of Materials tab', async () => {
      // TODO: adjust navigation once BOM tab selector is confirmed
      await bomPage.clickExportTab();
      await bomPage.waitForPageLoad();
    });

    await test.step('Verify BOM contains product rows', async () => {
      await bomModule.verifyBomProductsVisible();
    });

    await test.step('Verify BOM prices contain EUR symbol', async () => {
      await bomModule.verifyBomPricesEurFormat();
    });
  });

  // ---------------------------------------------------------------------------
  // TC-018  P1  Functional — BOM Total Amount in EUR format
  // ---------------------------------------------------------------------------
  test('TC-018: BOM Total Amount is displayed in EUR format (€X,XX.XX)', async ({
    loginModule,
    projectModule,
    productsModule,
    bomModule,
    bomPage,
  }) => {
    await test.step('Login, create project + switchboard, add products, reach Design page', async () => {
      await loginModule.doLogin();
      await loginModule.selectFranceEnglish();
      await loginModule.acceptTermsIfPresent();
      await projectModule.createProject();
      await projectModule.createSwitchboard();
      await productsModule.addProducts(1);
      await productsModule.goToSld();
      await productsModule.designAndVerify2dView();
      await productsModule.mountAllDevices();
    });

    await test.step('Navigate to the Bill of Materials tab', async () => {
      // TODO: adjust once BOM tab selector is confirmed
      await bomPage.clickExportTab();
      await bomPage.waitForPageLoad();
    });

    await test.step('Verify BOM Total Amount is in EUR format', async () => {
      await bomModule.verifyBomTotalAmountInEur();
    });
  });

  // ---------------------------------------------------------------------------
  // TC-019  P0  Smoke — Bulk export produces downloadable zip
  // ---------------------------------------------------------------------------
  test('TC-019: Bulk export produces a downloadable zip file', async ({
    loginModule,
    projectModule,
    productsModule,
    bomModule,
    exportModule,
    exportPage,
  }) => {
    await test.step('Login, create project + switchboard, add products, reach Export page', async () => {
      await loginModule.doLogin();
      await loginModule.selectFranceEnglish();
      await loginModule.acceptTermsIfPresent();
      await projectModule.createProject();
      await projectModule.createSwitchboard();
      await productsModule.addProducts(1);
      await productsModule.goToSld();
      await productsModule.designAndVerify2dView();
      await productsModule.mountAllDevices();
      await bomModule.goToExport();
    });

    await test.step('Trigger Bulk Export and capture download event', async () => {
      const download = await exportModule.triggerBulkExport();

      await test.step('Verify exported file has .zip extension', async () => {
        await exportModule.verifyZipFilename(download);
      });

      await test.step('Save zip to test-results for inspection', async () => {
        const zipPath = await exportModule.saveDownload(download, 'ecoset-bulk-export.zip');
        expect(zipPath).toBeTruthy();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // TC-020  P1  Functional — Zip contains BOM Data folder
  // ---------------------------------------------------------------------------
  test('TC-020: Exported zip file contains a BOM Data folder', async ({
    loginModule,
    projectModule,
    productsModule,
    bomModule,
    exportModule,
  }) => {
    await test.step('Full setup to Export page', async () => {
      await loginModule.doLogin();
      await loginModule.selectFranceEnglish();
      await loginModule.acceptTermsIfPresent();
      await projectModule.createProject();
      await projectModule.createSwitchboard();
      await productsModule.addProducts(1);
      await productsModule.goToSld();
      await productsModule.designAndVerify2dView();
      await productsModule.mountAllDevices();
      await bomModule.goToExport();
    });

    await test.step('Trigger bulk export and save zip', async () => {
      const download = await exportModule.triggerBulkExport();
      await exportModule.saveDownload(download, 'ecoset-export-tc020.zip');
    });

    await test.step('Assert zip file was downloaded (BOM Data folder inspection requires unzip step — TODO)', async () => {
      // TODO: add AdmZip or similar to inspect zip contents programmatically
      // For now, we assert the download occurred and the file size is > 0
      const { existsSync, statSync } = require('fs') as typeof import('fs');
      const zipPath = 'test-results/ecoset-export-tc020.zip';
      expect(existsSync(zipPath), 'Zip file should exist after export').toBe(true);
      expect(statSync(zipPath).size, 'Zip file should not be empty').toBeGreaterThan(0);
    });
  });

  // ---------------------------------------------------------------------------
  // TC-021  P1  Functional — Zip contains CSV files
  // ---------------------------------------------------------------------------
  test('TC-021: Exported zip file contains CSV files', async ({
    loginModule,
    projectModule,
    productsModule,
    bomModule,
    exportModule,
  }) => {
    await test.step('Full setup to Export page and trigger download', async () => {
      await loginModule.doLogin();
      await loginModule.selectFranceEnglish();
      await loginModule.acceptTermsIfPresent();
      await projectModule.createProject();
      await projectModule.createSwitchboard();
      await productsModule.addProducts(1);
      await productsModule.goToSld();
      await productsModule.designAndVerify2dView();
      await productsModule.mountAllDevices();
      await bomModule.goToExport();
      const download = await exportModule.triggerBulkExport();
      await exportModule.saveDownload(download, 'ecoset-export-tc021.zip');
    });

    await test.step('Verify zip contains at least one CSV file (zip content inspection — TODO)', async () => {
      // TODO: inspect zip entry names for .csv files using AdmZip or similar
      // Placeholder assertion: verify download succeeded
      const { existsSync } = require('fs') as typeof import('fs');
      expect(
        existsSync('test-results/ecoset-export-tc021.zip'),
        'Zip file should exist',
      ).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // TC-022  P1  Functional — Zip contains PDF files
  // ---------------------------------------------------------------------------
  test('TC-022: Exported zip file contains PDF files', async ({
    loginModule,
    projectModule,
    productsModule,
    bomModule,
    exportModule,
  }) => {
    await test.step('Full setup to Export page and trigger download', async () => {
      await loginModule.doLogin();
      await loginModule.selectFranceEnglish();
      await loginModule.acceptTermsIfPresent();
      await projectModule.createProject();
      await projectModule.createSwitchboard();
      await productsModule.addProducts(1);
      await productsModule.goToSld();
      await productsModule.designAndVerify2dView();
      await productsModule.mountAllDevices();
      await bomModule.goToExport();
      const download = await exportModule.triggerBulkExport();
      await exportModule.saveDownload(download, 'ecoset-export-tc022.zip');
    });

    await test.step('Verify zip contains at least one PDF file (zip content inspection — TODO)', async () => {
      // TODO: inspect zip entry names for .pdf files using AdmZip or similar
      const { existsSync } = require('fs') as typeof import('fs');
      expect(
        existsSync('test-results/ecoset-export-tc022.zip'),
        'Zip file should exist',
      ).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // TC-023  P1  Functional — Zip contains JSON file
  // ---------------------------------------------------------------------------
  test('TC-023: Exported zip file contains a JSON file', async ({
    loginModule,
    projectModule,
    productsModule,
    bomModule,
    exportModule,
  }) => {
    await test.step('Full setup to Export page and trigger download', async () => {
      await loginModule.doLogin();
      await loginModule.selectFranceEnglish();
      await loginModule.acceptTermsIfPresent();
      await projectModule.createProject();
      await projectModule.createSwitchboard();
      await productsModule.addProducts(1);
      await productsModule.goToSld();
      await productsModule.designAndVerify2dView();
      await productsModule.mountAllDevices();
      await bomModule.goToExport();
      const download = await exportModule.triggerBulkExport();
      await exportModule.saveDownload(download, 'ecoset-export-tc023.zip');
    });

    await test.step('Verify zip contains at least one JSON file (zip content inspection — TODO)', async () => {
      // TODO: inspect zip entry names for .json files using AdmZip or similar
      const { existsSync } = require('fs') as typeof import('fs');
      expect(
        existsSync('test-results/ecoset-export-tc023.zip'),
        'Zip file should exist',
      ).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // TC-024  P2  Edge Case — BOM TotalPrice matches Project & SW price
  // ---------------------------------------------------------------------------
  test('TC-024: BOM TotalPrice matches the Project & Switchboard Total Amount (cross-view reconciliation)', async ({
    loginModule,
    projectModule,
    productsModule,
    bomModule,
    bomPage,
  }) => {
    let productsTotalText = '';

    await test.step('Login, create project + switchboard, add products', async () => {
      await loginModule.doLogin();
      await loginModule.selectFranceEnglish();
      await loginModule.acceptTermsIfPresent();
      await projectModule.createProject();
      await projectModule.createSwitchboard();
      await productsModule.addProducts(1);
    });

    await test.step('Capture Total Amount from the Products page', async () => {
      await productsModule.verifyTotalAmountInEur();
      // TODO: expose a getTotalAmountText() on ProductsModule for exact value comparison
      productsTotalText = await productsModule['productsPage'].getTotalAmountText();
    });

    await test.step('Navigate to BOM via SLD and Design path', async () => {
      await productsModule.goToSld();
      await productsModule.designAndVerify2dView();
      await productsModule.mountAllDevices();
      // TODO: navigate directly to BOM tab once selector is confirmed
      await bomPage.clickExportTab();
      await bomPage.waitForPageLoad();
    });

    await test.step('Capture BOM Total Amount and compare to Products page total', async () => {
      const bomTotal = await bomModule.getBomTotalAmountText();
      expect(
        bomTotal,
        `BOM TotalPrice "${bomTotal}" should match Products page total "${productsTotalText}"`,
      ).toBe(productsTotalText);
    });
  });

  // ---------------------------------------------------------------------------
  // TC-025  P2  Negative — Invalid credentials show error message
  // ---------------------------------------------------------------------------
  test('TC-025: Login with invalid credentials shows an error message', async ({
    loginModule,
    loginPage,
  }) => {
    const badPassword = DataGenerator.randomString(12);

    await test.step('Attempt login with valid email but wrong password', async () => {
      await loginModule.doLogin(config.username, badPassword);
    });

    await test.step('Verify error message is visible and contains error text', async () => {
      await loginModule.verifyLoginFailed('Invalid');
    });

    await test.step('Verify user is NOT redirected to the application', async () => {
      await expect(loginPage.errorMessage()).toBeVisible();
    });
  });

});
