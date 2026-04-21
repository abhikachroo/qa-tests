/**
 * SLD Manage Quantity — SLD View Validation Tests
 * Feature:   Manage Quantity — SLD (EcoSet Configurator)
 * App URL:   https://ecoset-config-ppr.se.com/
 * Generated: QE-AI test-implementer
 *
 * Covers: TC-019 → TC-026
 * - SLD page renders correctly after quantity is set
 * - SLD accurately reflects root, mid-branch, and end-of-branch quantities
 * - SLD updates dynamically when quantities change
 * - SLD is consistent across page refreshes
 *
 * Precondition (all tests):
 *   - User is logged in
 *   - A Project has been created and a Switchboard configured
 *   - Products have been added to the workbench
 */

import { test, expect }  from '@fixtures';
import { config }        from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

test.describe(`@P1 @Functional @SLD @ManageQuantity SLD View Validation — ${config.displayName} on ${config.environment}`, () => {

  test.beforeEach(async ({ loginModule, workbenchModule }) => {
    await loginModule.doLogin();
    await workbenchModule.navigateToWorkbench();
  });

  // ═══════════════════════════════════════════════════════════════════════
  // P0 — SMOKE
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * TC-019: SLD page loads and diagram is rendered
   * AC Reference: AC-009
   * Priority: P0 Smoke
   */
  test('TC-019: SLD page loads and diagram is rendered with product nodes', async ({
    workbenchModule,
    sldModule,
  }) => {
    await test.step('Navigate from workbench to SLD page', async () => {
      await workbenchModule.goToSLD();
    });

    await test.step('Verify SLD diagram is visible and contains at least one product node', async () => {
      await sldModule.waitForSLDReady();
      await sldModule.verifySLDIsRendered();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // P1 — FUNCTIONAL
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * TC-020: SLD root node quantity matches workbench root card quantity
   * AC Reference: AC-009, AC-010
   * Priority: P1
   */
  test('TC-020: SLD root node quantity matches workbench root card quantity', async ({
    workbenchModule,
    sldModule,
  }) => {
    const qty = DataGenerator.randomQuantityGtOne();

    await test.step(`Set root quantity ${qty} on workbench and save`, async () => {
      await workbenchModule.setRootQuantity(qty);
      await workbenchModule.saveWorkbench();
    });

    await test.step('Navigate to SLD page', async () => {
      await workbenchModule.goToSLD();
    });

    await test.step(`Verify SLD root node shows quantity ${qty}`, async () => {
      await sldModule.waitForSLDReady();
      await sldModule.verifyRootNodeQuantity(qty);
    });
  });

  /**
   * TC-021: SLD end-of-branch node quantity matches workbench end-of-branch card
   * AC Reference: AC-009, AC-011
   * Priority: P1
   */
  test('TC-021: SLD end-of-branch node quantity matches workbench end-of-branch card', async ({
    workbenchModule,
    sldModule,
  }) => {
    const qty = DataGenerator.randomQuantityGtOne();

    await test.step(`Set end-of-branch quantity ${qty} on workbench and save`, async () => {
      await workbenchModule.setEndOfBranchQuantity(qty);
      await workbenchModule.saveWorkbench();
    });

    await test.step('Navigate to SLD page', async () => {
      await workbenchModule.goToSLD();
    });

    await test.step(`Verify SLD end-of-branch node shows quantity ${qty}`, async () => {
      await sldModule.waitForSLDReady();
      await sldModule.verifyEndOfBranchNodeQuantity(qty);
    });
  });

  /**
   * TC-022: All SLD node quantities match their corresponding workbench cards
   * AC Reference: AC-009–AC-011
   * Priority: P1
   */
  test('TC-022: All SLD node quantities match workbench quantities (root + end-of-branch)', async ({
    workbenchModule,
    sldModule,
  }) => {
    const rootQty = DataGenerator.randomQuantityGtOne(5);
    const endQty  = DataGenerator.randomQuantityGtOne(9);

    await test.step(`Set root qty=${rootQty} and end-of-branch qty=${endQty} on workbench`, async () => {
      await workbenchModule.setRootQuantity(rootQty);
      await workbenchModule.setEndOfBranchQuantity(endQty);
      await workbenchModule.saveWorkbench();
    });

    await test.step('Navigate to SLD page', async () => {
      await workbenchModule.goToSLD();
    });

    await test.step('Verify SLD shows correct quantities at both levels', async () => {
      await sldModule.waitForSLDReady();
      await sldModule.verifyRootNodeQuantity(rootQty);
      await sldModule.verifyEndOfBranchNodeQuantity(endQty);
    });
  });

  /**
   * TC-023: Changing quantity on workbench updates SLD on next visit
   * AC Reference: AC-012
   * Priority: P1
   */
  test('TC-023: Changing quantity on workbench updates SLD on next visit', async ({
    workbenchModule,
    sldModule,
  }) => {
    const initialQty = DataGenerator.randomQuantityGtOne(4);
    const updatedQty = initialQty + DataGenerator.randomInt(1, 3);

    await test.step(`Set root quantity to ${initialQty} and navigate to SLD`, async () => {
      await workbenchModule.setRootQuantity(initialQty);
      await workbenchModule.saveWorkbench();
      await workbenchModule.goToSLD();
    });

    await test.step(`Confirm SLD shows initial quantity ${initialQty}`, async () => {
      await sldModule.waitForSLDReady();
      await sldModule.verifyRootNodeQuantity(initialQty);
    });

    await test.step(`Return to workbench and update root quantity to ${updatedQty}`, async () => {
      await workbenchModule.navigateToWorkbench();
      await workbenchModule.setRootQuantity(updatedQty);
      await workbenchModule.saveWorkbench();
    });

    await test.step(`Navigate to SLD again and verify updated quantity ${updatedQty} is shown`, async () => {
      await workbenchModule.goToSLD();
      await sldModule.waitForSLDReady();
      await sldModule.verifyRootNodeQuantity(updatedQty);
    });
  });

  /**
   * TC-024: SLD quantity = 1 edge case — root node display
   * AC Reference: AC-006, AC-009
   * Priority: P1
   *
   * When workbench quantity is 1, SLD node should either:
   * a) Not show a quantity indicator, OR b) Show "1"
   * // TODO: confirm with dev/designer once live UI is confirmed.
   */
  test('TC-024: SLD root node with qty=1 — edge case display (no indicator or shows 1)', async ({
    workbenchModule,
    sldModule,
    sldPage,
  }) => {
    await test.step('Set root quantity to 1 on workbench and save', async () => {
      await workbenchModule.setRootQuantity(1);
      await workbenchModule.saveWorkbench();
    });

    await test.step('Navigate to SLD page', async () => {
      await workbenchModule.goToSLD();
    });

    await test.step('Verify SLD root node qty=1 edge case (hidden or shows "1")', async () => {
      await sldModule.waitForSLDReady();
      const label = sldPage.quantityLabelOnNode(0);
      const isVisible = await label.isVisible({ timeout: 3_000 }).catch(() => false);
      if (isVisible) {
        await expect(
          label,
          'If SLD quantity label is shown for qty=1, it must display "1"',
        ).toContainText('1');
      }
      // If not visible — acceptable (hidden at qty=1)
    });
  });

  /**
   * TC-025: SLD quantity display is consistent after page refresh
   * AC Reference: AC-009, AC-013
   * Priority: P1
   */
  test('TC-025: SLD quantity display is consistent after page refresh', async ({
    workbenchModule,
    sldModule,
    sldPage,
  }) => {
    const qty = DataGenerator.randomQuantityGtOne();

    await test.step(`Set root quantity ${qty} on workbench and navigate to SLD`, async () => {
      await workbenchModule.setRootQuantity(qty);
      await workbenchModule.saveWorkbench();
      await workbenchModule.goToSLD();
    });

    await test.step('Confirm initial SLD root node quantity', async () => {
      await sldModule.waitForSLDReady();
      await sldModule.verifyRootNodeQuantity(qty);
    });

    await test.step('Refresh the SLD page via SLDPage.reload()', async () => {
      await sldPage.reload();
      await sldModule.waitForSLDReady();
    });

    await test.step('Verify root node quantity is unchanged after refresh', async () => {
      await sldModule.verifyRootNodeQuantity(qty);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // P2 — EDGE CASES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * TC-026: SLD renders correctly when mid-branch product has quantity > 1
   * AC Reference: AC-007, AC-009
   * Priority: P2
   */
  test('TC-026: SLD mid-branch node shows correct quantity when set on workbench', async ({
    workbenchModule,
    workbenchPage,
    sldModule,
  }) => {
    const count = await workbenchPage.getProductCardCount();
    test.skip(count < 3, 'Mid-branch test requires at least 3 products in the branch');

    const midIndex = Math.floor(count / 2);
    const qty = DataGenerator.randomQuantityGtOne();

    await test.step(`Set mid-branch quantity ${qty} at position ${midIndex} on workbench`, async () => {
      await workbenchModule.setMidBranchQuantity(midIndex, qty);
      await workbenchModule.saveWorkbench();
    });

    await test.step('Navigate to SLD page', async () => {
      await workbenchModule.goToSLD();
    });

    await test.step(`Verify SLD mid-branch node at position ${midIndex} shows quantity ${qty}`, async () => {
      await sldModule.waitForSLDReady();
      await sldModule.verifyMidBranchNodeQuantity(midIndex, qty);
    });
  });

});
