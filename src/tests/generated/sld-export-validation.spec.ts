/**
 * SLD Manage Quantity — Export Validation Tests
 * Feature:   Manage Quantity — SLD (EcoSet Configurator)
 * App URL:   https://ecoset-config-ppr.se.com/
 * Generated: QE-AI test-implementer
 *
 * Covers: TC-027 → TC-032
 * - Bulk export with SLD checkbox — download succeeds + content matches in-app view
 * - Raw/category SLD export — download succeeds + content matches in-app view
 * - Cross-validation: both exported SLD files match the in-app SLD with correct quantities
 *
 * KNOWN BLOCKER: Exported SLD file format (PDF/SVG/XML) is unconfirmed.
 * ExportModule.parseQuantitiesFromSLDContent() uses SVG/XML/JSON heuristics.
 * // TODO: confirm file format with development team and update parser if needed.
 *
 * Precondition (all tests):
 *   - User is logged in
 *   - A Project has been created and a Switchboard configured
 *   - Products with known quantities exist on the workbench
 */

import { test, expect }  from '@fixtures';
import { config }        from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

test.describe(`@P1 @Functional @SLD @ManageQuantity @Export SLD Export Validation — ${config.displayName} on ${config.environment}`, () => {

  // Shared quantities set in beforeEach for export content validation
  const ROOT_QTY = DataGenerator.randomQuantityGtOne(5);
  const END_QTY  = DataGenerator.randomQuantityGtOne(9);

  test.beforeEach(async ({ loginModule, workbenchModule }) => {
    await loginModule.doLogin();
    await workbenchModule.navigateToWorkbench();
    await workbenchModule.setRootQuantity(ROOT_QTY);
    await workbenchModule.setEndOfBranchQuantity(END_QTY);
    await workbenchModule.saveWorkbench();
  });

  // ═══════════════════════════════════════════════════════════════════════
  // P0 — SMOKE
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * TC-027: Bulk export with SLD checkbox — download file is non-empty
   * AC Reference: AC-014, AC-015
   * Priority: P0 Smoke
   */
  test('TC-027: Bulk export with SLD checkbox — download succeeds and file is non-empty', async ({
    workbenchModule,
    exportModule,
  }) => {
    await test.step('Navigate to Export page from workbench', async () => {
      await workbenchModule.goToExport();
    });

    await test.step('Enable bulk export with SLD checkbox and trigger download', async () => {
      const content = await exportModule.verifyBulkSLDDownloadSucceeded();
      expect(content.length, 'Downloaded bulk SLD file must not be empty').toBeGreaterThan(0);
    });
  });

  /**
   * TC-028: Raw/category SLD export — download file is non-empty
   * AC Reference: AC-016, AC-017
   * Priority: P0 Smoke
   */
  test('TC-028: Raw/category SLD export — download succeeds and file is non-empty', async ({
    workbenchModule,
    exportModule,
  }) => {
    await test.step('Navigate to Export page from workbench', async () => {
      await workbenchModule.goToExport();
    });

    await test.step('Select raw/category SLD option and trigger download', async () => {
      const content = await exportModule.verifyRawSLDDownloadSucceeded();
      expect(content.length, 'Downloaded raw SLD file must not be empty').toBeGreaterThan(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // P1 — FUNCTIONAL (content validation)
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * TC-029: Bulk SLD export file content contains correct product quantities
   * AC Reference: AC-014, AC-015, AC-018
   * Priority: P1
   */
  test('TC-029: Bulk SLD export content contains the correct root and end-of-branch quantities', async ({
    workbenchModule,
    exportModule,
  }) => {
    let exportContent = '';

    await test.step('Navigate to Export page and perform bulk SLD export', async () => {
      await workbenchModule.goToExport();
      exportContent = await exportModule.performBulkSLDExport();
    });

    await test.step(`Verify bulk SLD file contains root qty=${ROOT_QTY} and end-of-branch qty=${END_QTY}`, async () => {
      await exportModule.verifyExportedSLDContainsQuantities(
        exportContent,
        [ROOT_QTY, END_QTY],
        'bulk',
      );
    });
  });

  /**
   * TC-030: Raw/category SLD export file content contains correct product quantities
   * AC Reference: AC-016, AC-017, AC-018
   * Priority: P1
   */
  test('TC-030: Raw/category SLD export content contains the correct quantities', async ({
    workbenchModule,
    exportModule,
  }) => {
    let exportContent = '';

    await test.step('Navigate to Export page and perform raw/category SLD export', async () => {
      await workbenchModule.goToExport();
      exportContent = await exportModule.performRawSLDExport();
    });

    await test.step(`Verify raw SLD file contains root qty=${ROOT_QTY} and end-of-branch qty=${END_QTY}`, async () => {
      await exportModule.verifyExportedSLDContainsQuantities(
        exportContent,
        [ROOT_QTY, END_QTY],
        'raw',
      );
    });
  });

  /**
   * TC-031: Both exported SLD files (bulk + raw) contain matching quantity values
   * AC Reference: AC-018
   * Priority: P1
   */
  test('TC-031: Bulk SLD and raw/category SLD files contain matching quantity values', async ({
    workbenchModule,
    exportModule,
  }) => {
    let bulkContent = '';
    let rawContent  = '';

    await test.step('Navigate to Export page', async () => {
      await workbenchModule.goToExport();
    });

    await test.step('Download bulk SLD export', async () => {
      bulkContent = await exportModule.performBulkSLDExport();
    });

    await test.step('Download raw/category SLD export', async () => {
      rawContent = await exportModule.performRawSLDExport();
    });

    await test.step('Cross-validate: bulk and raw SLD files contain identical quantities', async () => {
      await exportModule.verifySLDFilesMatch(bulkContent, rawContent);
    });
  });

  /**
   * TC-032: Exported SLD quantities match in-app SLD view quantities
   * AC Reference: AC-009, AC-014–AC-018
   * Priority: P1
   */
  test('TC-032: Exported SLD quantities match in-app SLD view quantities', async ({
    workbenchModule,
    sldModule,
    exportModule,
  }) => {
    let bulkContent = '';

    await test.step('Navigate to SLD page and verify in-app quantities', async () => {
      await workbenchModule.goToSLD();
      await sldModule.waitForSLDReady();
      await sldModule.verifyRootNodeQuantity(ROOT_QTY);
      await sldModule.verifyEndOfBranchNodeQuantity(END_QTY);
    });

    await test.step('Navigate to Export page and perform bulk SLD download', async () => {
      await workbenchModule.navigateToWorkbench();
      await workbenchModule.goToExport();
      bulkContent = await exportModule.performBulkSLDExport();
    });

    await test.step('Verify exported SLD file contains quantities matching the in-app SLD view', async () => {
      await exportModule.verifyExportedSLDContainsQuantities(
        bulkContent,
        [ROOT_QTY, END_QTY],
        'bulk',
      );
    });
  });

});
