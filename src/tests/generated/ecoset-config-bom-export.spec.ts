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
 *   - TC-020-023: Zip content inspection (CSV/PDF/JSON) requires a zip library (e.g. adm-zip).
 *     Current implementation verifies download existence; full file-type assertions are TODO.
 */
import * as fs        from 'fs';
import { test, expect } from '@fixtures';
import { config }        from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

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
      // TODO: replace with dedicated BOM tab navigation once selector is confirmed
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

    await test.step('Verify zip file exists and is non-empty (BOM Data folder check — TODO: add adm-zip inspection)', async () => {
      // TODO: inspect zip entry names for a "BOM Data" folder using adm-zip or similar
      expect(fs.existsSync('test-results/ecoset-export-tc020.zip'), 'Zip file should exist after export').toBe(true);
      expect(fs.statSync('test-results/ecoset-export-tc020.zip').size, 'Zip file should not be empty').toBeGreaterThan(0);
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

    await test.step('Verify zip contains CSV files (zip content inspection — TODO: add adm-zip)', async () => {
      // TODO: inspect zip entry names for .csv files using adm-zip
      expect(
        fs.existsSync('test-results/ecoset-export-tc021.zip'),
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

    await test.step('Verify zip contains PDF files (zip content inspection — TODO: add adm-zip)', async () => {
      // TODO: inspect zip entry names for .pdf files using adm-zip
      expect(
        fs.existsSync('test-results/ecoset-export-tc022.zip'),
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

    await test.step('Verify zip contains a JSON file (zip content inspection — TODO: add adm-zip)', async () => {
      // TODO: inspect zip entry names for .json files using adm-zip
      expect(
        fs.existsSync('test-results/ecoset-export-tc023.zip'),
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
      productsTotalText = await productsModule.getTotalAmountText();
    });

    await test.step('Navigate through SLD and Design to reach BOM', async () => {
      await productsModule.goToSld();
      await productsModule.designAndVerify2dView();
      await productsModule.mountAllDevices();
      // TODO: navigate directly to BOM tab once selector is confirmed
      await bomPage.clickExportTab();
      await bomPage.waitForPageLoad();
    });

    await test.step('Capture BOM Total Amount and verify it matches Products page total', async () => {
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

    await test.step('Verify error message is visible', async () => {
      await expect(
        loginPage.errorMessage(),
        'Error message should be visible after failed login',
      ).toBeVisible();
    });

    await test.step('Verify error message contains expected error text', async () => {
      await loginModule.verifyLoginFailed('Invalid');
    });
  });

});
