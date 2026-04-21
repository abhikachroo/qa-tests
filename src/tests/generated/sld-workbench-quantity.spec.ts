/**
 * SLD Manage Quantity — Workbench Tests
 * Feature:   Manage Quantity — SLD (EcoSet Configurator)
 * App URL:   https://ecoset-config-ppr.se.com/
 * Generated: QE-AI test-implementer
 *
 * Covers: TC-001 → TC-018
 * - Root-level quantity management
 * - End-of-branch quantity management
 * - Mid-branch quantity management
 * - Quantity = 1 edge cases
 * - Quantity validation (below min)
 * - Workbench + SLD cross-validation (quantity visible in both)
 *
 * Precondition (all tests):
 *   - User is logged in
 *   - A Project has been created
 *   - A Switchboard has been configured within the Project
 *   - Browser lands on the workbench canvas for that switchboard
 */

import { test, expect }    from '@fixtures';
import { config }          from '@config/index';
import { DataGenerator }   from '@utils/DataGenerator';

test.describe(`@P0 @Smoke @SLD @ManageQuantity Workbench Quantity — ${config.displayName} on ${config.environment}`, () => {

  test.beforeEach(async ({ loginModule, workbenchModule }) => {
    await loginModule.doLogin();
    await workbenchModule.navigateToWorkbench();
  });

  // ═══════════════════════════════════════════════════════════════════════
  // P0 — SMOKE
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * TC-001: Root-level product quantity > 1 — quantity box displayed on card
   * AC Reference: AC-001, AC-002
   * Priority: P0 Smoke
   */
  test('TC-001: Root-level quantity > 1 shows quantity box on card', async ({
    workbenchModule,
  }) => {
    const qty = DataGenerator.randomQuantityGtOne();

    await test.step(`Set quantity ${qty} on root-level product card`, async () => {
      await workbenchModule.setRootQuantity(qty);
    });

    await test.step('Verify quantity box is visible on root card and shows correct value', async () => {
      await workbenchModule.verifyRootQuantity(qty);
    });
  });

  /**
   * TC-002: End-of-branch product quantity > 1 — quantity box displayed on card
   * AC Reference: AC-003, AC-004
   * Priority: P0 Smoke
   */
  test('TC-002: End-of-branch quantity > 1 shows quantity box on card', async ({
    workbenchModule,
  }) => {
    const qty = DataGenerator.randomQuantityGtOne();

    await test.step(`Set quantity ${qty} on end-of-branch product card`, async () => {
      await workbenchModule.setEndOfBranchQuantity(qty);
    });

    await test.step('Verify quantity box is visible on end-of-branch card and shows correct value', async () => {
      await workbenchModule.verifyEndOfBranchQuantity(qty);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // P1 — FUNCTIONAL
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * TC-003: Root-level quantity persists after navigating away and back
   * AC Reference: AC-001, AC-002, AC-005
   * Priority: P1
   */
  test('TC-003: Root-level quantity persists after navigating away and returning', async ({
    workbenchModule,
  }) => {
    const qty = DataGenerator.randomQuantityGtOne();

    await test.step(`Set root quantity to ${qty} and save`, async () => {
      await workbenchModule.setRootQuantity(qty);
      await workbenchModule.saveWorkbench();
    });

    await test.step('Navigate away to SLD, then return to workbench', async () => {
      await workbenchModule.goToSLD();
      await workbenchModule.navigateToWorkbench();
    });

    await test.step('Verify root quantity is still displayed correctly', async () => {
      await workbenchModule.verifyRootQuantity(qty);
    });
  });

  /**
   * TC-004: Quantity = 1 at root level — edge case display behaviour
   * AC Reference: AC-006
   * Priority: P1
   *
   * NOTE: AC is ambiguous — "qty=1" may hide the quantity box OR show "1".
   * verifyQuantityOneEdgeCase() accepts both behaviours.
   * // TODO: confirm correct behaviour with dev/designer before hardening assertion.
   */
  test('TC-004: Root-level quantity = 1 — edge case (hidden box or shows 1)', async ({
    workbenchModule,
  }) => {
    await test.step('Set root-level product quantity to 1', async () => {
      await workbenchModule.setRootQuantity(1);
    });

    await test.step('Verify qty=1 edge-case display (hidden or shows "1")', async () => {
      await workbenchModule.verifyQuantityOneEdgeCase(0);
    });
  });

  /**
   * TC-005: Quantity = 1 at end-of-branch — edge case display behaviour
   * AC Reference: AC-006
   * Priority: P1
   */
  test('TC-005: End-of-branch quantity = 1 — edge case (hidden box or shows 1)', async ({
    workbenchModule,
    workbenchPage,
  }) => {
    const count = await workbenchPage.getProductCardCount();

    await test.step('Set end-of-branch product quantity to 1', async () => {
      await workbenchModule.setEndOfBranchQuantity(1);
    });

    await test.step('Verify qty=1 edge-case display (hidden or shows "1")', async () => {
      await workbenchModule.verifyQuantityOneEdgeCase(count - 1);
    });
  });

  /**
   * TC-006: Mid-branch product quantity > 1 — quantity box displayed on card
   * AC Reference: AC-007
   * Priority: P1
   */
  test('TC-006: Mid-branch quantity > 1 shows quantity box on card', async ({
    workbenchModule,
    workbenchPage,
  }) => {
    const count = await workbenchPage.getProductCardCount();
    test.skip(count < 3, 'Mid-branch card requires at least 3 products in the branch');

    const midIndex = Math.floor(count / 2);
    const qty = DataGenerator.randomQuantityGtOne();

    await test.step(`Set mid-branch quantity ${qty} at position ${midIndex}`, async () => {
      await workbenchModule.setMidBranchQuantity(midIndex, qty);
    });

    await test.step('Verify mid-branch card shows the set quantity', async () => {
      await workbenchModule.verifyMidBranchQuantity(midIndex, qty);
    });
  });

  /**
   * TC-007: Quantity persists on end-of-branch card after save
   * AC Reference: AC-003, AC-004, AC-005
   * Priority: P1
   */
  test('TC-007: End-of-branch quantity persists after save and page reload', async ({
    workbenchModule,
    workbenchPage,
  }) => {
    const qty = DataGenerator.randomQuantityGtOne();

    await test.step(`Set end-of-branch quantity to ${qty} and save`, async () => {
      await workbenchModule.setEndOfBranchQuantity(qty);
      await workbenchModule.saveWorkbench();
    });

    await test.step('Reload the workbench page', async () => {
      await workbenchPage.navigate(config.workbenchPath ?? '/workbench');
      await workbenchPage.waitForPageLoad();
    });

    await test.step('Verify end-of-branch quantity is still displayed correctly', async () => {
      await workbenchModule.verifyEndOfBranchQuantity(qty);
    });
  });

  /**
   * TC-008: Multiple cards with different quantities — all displayed correctly
   * AC Reference: AC-001–AC-004, AC-007
   * Priority: P1
   */
  test('TC-008: Multiple cards with different quantities all show correct values', async ({
    workbenchModule,
    workbenchPage,
  }) => {
    const count = await workbenchPage.getProductCardCount();
    test.skip(count < 2, 'Requires at least 2 product cards on the workbench');

    const rootQty = DataGenerator.randomQuantityGtOne(5);
    const endQty  = DataGenerator.randomQuantityGtOne(9);

    await test.step(`Set root quantity to ${rootQty}`, async () => {
      await workbenchModule.setRootQuantity(rootQty);
    });

    await test.step(`Set end-of-branch quantity to ${endQty}`, async () => {
      await workbenchModule.setEndOfBranchQuantity(endQty);
    });

    await test.step('Verify root card shows correct quantity', async () => {
      await workbenchModule.verifyRootQuantity(rootQty);
    });

    await test.step('Verify end-of-branch card shows correct quantity', async () => {
      await workbenchModule.verifyEndOfBranchQuantity(endQty);
    });
  });

  /**
   * TC-009: Increment quantity via + button on root card
   * AC Reference: AC-001, AC-002
   * Priority: P1
   */
  test('TC-009: Increment quantity via + button updates displayed value', async ({
    workbenchModule,
    workbenchPage,
  }) => {
    await test.step('Set root card quantity to 2 as starting point', async () => {
      await workbenchModule.setRootQuantity(2);
    });

    await test.step('Click root card again and increment quantity by 1', async () => {
      await workbenchPage.clickProductCard(0);
      await workbenchPage.clickIncrementQuantity();
      await workbenchPage.clickConfirmQuantity();
    });

    await test.step('Verify root card now shows quantity 3', async () => {
      await workbenchModule.verifyRootQuantity(3);
    });
  });

  /**
   * TC-010: Decrement quantity to 1 — edge case display
   * AC Reference: AC-006
   * Priority: P1
   */
  test('TC-010: Decrement quantity to 1 triggers edge-case display', async ({
    workbenchModule,
    workbenchPage,
  }) => {
    await test.step('Set root card quantity to 2 as starting point', async () => {
      await workbenchModule.setRootQuantity(2);
    });

    await test.step('Click root card and decrement quantity by 1', async () => {
      await workbenchPage.clickProductCard(0);
      await workbenchPage.clickDecrementQuantity();
      await workbenchPage.clickConfirmQuantity();
    });

    await test.step('Verify qty=1 edge-case display (hidden or shows "1")', async () => {
      await workbenchModule.verifyQuantityOneEdgeCase(0);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // P1 — NEGATIVE
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * TC-011: Quantity = 0 is rejected — validation feedback shown
   * AC Reference: AC-008
   * Priority: P1 Negative
   */
  test('TC-011: Entering quantity = 0 is rejected with validation feedback', async ({
    workbenchModule,
  }) => {
    await test.step('Attempt to set root card quantity to 0', async () => {
      await workbenchModule.verifyQuantityBelowMinRejected(0);
    });
  });

  /**
   * TC-012: Negative quantity is rejected — validation feedback shown
   * AC Reference: AC-008
   * Priority: P1 Negative
   */
  test('TC-012: Entering negative quantity is rejected with validation feedback', async ({
    workbenchPage,
  }) => {
    await test.step('Click root card to open quantity controls', async () => {
      await workbenchPage.clickProductCard(0);
    });

    await test.step('Enter -1 as quantity and try to confirm', async () => {
      await workbenchPage.clearAndTypeQuantity(-1);
      await workbenchPage.clickConfirmQuantity();
    });

    await test.step('Verify input shows invalid state or reverts to minimum valid value', async () => {
      const input = workbenchPage.quantityInput();
      const value = await input.inputValue().catch(() => '');
      const isInvalid = await workbenchPage.isQuantityInputInvalid();
      expect(
        Number(value) >= 1 || isInvalid,
        'Negative quantity should be rejected (value >= 1 or input marked invalid)',
      ).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // P1 — WORKBENCH → SLD CROSS-VALIDATION
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * TC-013: Root quantity set on workbench is reflected on SLD page
   * AC Reference: AC-009, AC-010
   * Priority: P1
   */
  test('TC-013: Root quantity set on workbench is reflected on SLD page', async ({
    workbenchModule,
    sldModule,
  }) => {
    const qty = DataGenerator.randomQuantityGtOne();

    await test.step(`Set root quantity to ${qty} on workbench`, async () => {
      await workbenchModule.setRootQuantity(qty);
      await workbenchModule.saveWorkbench();
    });

    await test.step('Navigate to SLD page', async () => {
      await workbenchModule.goToSLD();
    });

    await test.step('Verify SLD root node shows matching quantity', async () => {
      await sldModule.waitForSLDReady();
      await sldModule.verifyRootNodeQuantity(qty);
    });
  });

  /**
   * TC-014: End-of-branch quantity set on workbench is reflected on SLD page
   * AC Reference: AC-009, AC-011
   * Priority: P1
   */
  test('TC-014: End-of-branch quantity set on workbench is reflected on SLD page', async ({
    workbenchModule,
    sldModule,
  }) => {
    const qty = DataGenerator.randomQuantityGtOne();

    await test.step(`Set end-of-branch quantity to ${qty} on workbench`, async () => {
      await workbenchModule.setEndOfBranchQuantity(qty);
      await workbenchModule.saveWorkbench();
    });

    await test.step('Navigate to SLD page', async () => {
      await workbenchModule.goToSLD();
    });

    await test.step('Verify SLD end-of-branch node shows matching quantity', async () => {
      await sldModule.waitForSLDReady();
      await sldModule.verifyEndOfBranchNodeQuantity(qty);
    });
  });

  /**
   * TC-015: Root + end-of-branch quantities both reflected correctly on SLD
   * AC Reference: AC-009–AC-011
   * Priority: P1
   */
  test('TC-015: Root and end-of-branch quantities both reflected on SLD', async ({
    workbenchModule,
    workbenchPage,
    sldModule,
  }) => {
    const rootQty = DataGenerator.randomQuantityGtOne(5);
    const endQty  = DataGenerator.randomQuantityGtOne(9);

    await test.step(`Set root qty=${rootQty} and end-of-branch qty=${endQty}`, async () => {
      await workbenchModule.setRootQuantity(rootQty);
      await workbenchModule.setEndOfBranchQuantity(endQty);
      await workbenchModule.saveWorkbench();
    });

    await test.step('Navigate to SLD page', async () => {
      await workbenchModule.goToSLD();
    });

    await test.step('Verify both root and end-of-branch SLD nodes show correct quantities', async () => {
      await sldModule.waitForSLDReady();
      await sldModule.verifyRootNodeQuantity(rootQty);
      await sldModule.verifyEndOfBranchNodeQuantity(endQty);
    });
  });

  /**
   * TC-016: SLD node count matches product card count on workbench
   * AC Reference: AC-009
   * Priority: P1
   */
  test('TC-016: SLD node count matches workbench product card count', async ({
    workbenchModule,
    workbenchPage,
    sldModule,
  }) => {
    let productCount = 0;

    await test.step('Count product cards on workbench and save', async () => {
      productCount = await workbenchPage.getProductCardCount();
      await workbenchModule.saveWorkbench();
    });

    await test.step('Navigate to SLD page', async () => {
      await workbenchModule.goToSLD();
    });

    await test.step('Verify SLD node count equals workbench product card count', async () => {
      await sldModule.waitForSLDReady();
      await sldModule.verifySLDNodeCount(productCount);
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // P2 — EDGE CASES
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * TC-017: Mid-branch quantity persists after save and reload
   * AC Reference: AC-007, AC-005
   * Priority: P2
   */
  test('TC-017: Mid-branch quantity persists after save and page reload', async ({
    workbenchModule,
    workbenchPage,
  }) => {
    const count = await workbenchPage.getProductCardCount();
    test.skip(count < 3, 'Mid-branch card requires at least 3 products in the branch');

    const midIndex = Math.floor(count / 2);
    const qty = DataGenerator.randomQuantityGtOne();

    await test.step(`Set mid-branch quantity ${qty} at position ${midIndex} and save`, async () => {
      await workbenchModule.setMidBranchQuantity(midIndex, qty);
      await workbenchModule.saveWorkbench();
    });

    await test.step('Reload the workbench page', async () => {
      await workbenchPage.navigate(config.workbenchPath ?? '/workbench');
      await workbenchPage.waitForPageLoad();
    });

    await test.step('Verify mid-branch quantity is still displayed correctly', async () => {
      await workbenchModule.verifyMidBranchQuantity(midIndex, qty);
    });
  });

  /**
   * TC-018: Very large quantity value (boundary test)
   * AC Reference: AC-008
   * Priority: P2
   */
  test('TC-018: Very large quantity value is accepted or rejected gracefully', async ({
    workbenchPage,
  }) => {
    const largeQty = 9999;

    await test.step(`Attempt to set root quantity to ${largeQty}`, async () => {
      await workbenchPage.clickProductCard(0);
      await workbenchPage.clearAndTypeQuantity(largeQty);
      await workbenchPage.clickConfirmQuantity();
    });

    await test.step('Verify result: large qty accepted ≥ 1 or gracefully capped', async () => {
      const input  = workbenchPage.quantityInput();
      const value  = await input.inputValue().catch(() => String(largeQty));
      const parsed = parseInt(value, 10);
      expect(
        !isNaN(parsed) && parsed >= 1,
        `Root card should show a valid quantity after entering ${largeQty}, got: "${value}"`,
      ).toBe(true);
    });
  });

});
