import { expect }          from '@playwright/test';
import { WorkbenchPage }   from '@pages/WorkbenchPage';
import { Logger }          from '@utils/Logger';
import { config }          from '@config/index';

/**
 * WorkbenchModule — business-logic workflows for the EcoSet workbench.
 * All browser interaction goes through WorkbenchPage methods.
 */
export class WorkbenchModule {
  private logger: Logger;

  constructor(private workbenchPage: WorkbenchPage) {
    this.logger = new Logger('WorkbenchModule');
  }

  // ── Navigation ──────────────────────────────────────────────────────────

  async navigateToWorkbench(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to workbench`);
    await this.workbenchPage.navigate(config.workbenchPath ?? '/workbench');
    await this.workbenchPage.waitForPageLoad();
    await this.workbenchPage.dismissCookieBannerIfPresent();
    this.logger.info('Workbench loaded');
  }

  // ── Quantity management ─────────────────────────────────────────────────

  async setQuantityOnCard(cardIndex: number, quantity: number): Promise<void> {
    this.logger.info(`Setting quantity=${quantity} on card index ${cardIndex}`);
    await this.workbenchPage.clickProductCard(cardIndex);
    await this.workbenchPage.clearAndTypeQuantity(quantity);
    await this.workbenchPage.clickConfirmQuantity();
    this.logger.info(`Quantity ${quantity} applied to card ${cardIndex}`);
  }

  async setRootQuantity(quantity: number): Promise<void> {
    this.logger.info(`Setting root-level quantity to ${quantity}`);
    await this.setQuantityOnCard(0, quantity);
  }

  async setEndOfBranchQuantity(quantity: number): Promise<void> {
    const count = await this.workbenchPage.getProductCardCount();
    const lastIndex = count - 1;
    this.logger.info(`Setting end-of-branch quantity (card ${lastIndex}) to ${quantity}`);
    await this.setQuantityOnCard(lastIndex, quantity);
  }

  async setMidBranchQuantity(positionFromRoot: number, quantity: number): Promise<void> {
    this.logger.info(`Setting mid-branch quantity at position ${positionFromRoot} to ${quantity}`);
    await this.setQuantityOnCard(positionFromRoot, quantity);
  }

  // ── Verification ────────────────────────────────────────────────────────

  async verifyQuantityDisplayedOnCard(cardIndex: number, expectedQty: number): Promise<void> {
    this.logger.info(`Verifying card ${cardIndex} shows quantity ${expectedQty}`);
    const badge = this.workbenchPage.quantityBoxOnCard(cardIndex);
    await expect(badge, `Quantity badge on card ${cardIndex} should be visible`).toBeVisible();
    await expect(
      badge,
      `Card ${cardIndex} should display quantity "${expectedQty}"`,
    ).toContainText(String(expectedQty));
    this.logger.info(`Card ${cardIndex} quantity verified: ${expectedQty}`);
  }

  /**
   * Verify qty=1 edge case: box hidden OR box shows "1".
   * AC is ambiguous — both behaviours are acceptable.
   * // TODO: confirm correct behaviour with dev/designer once live UI is confirmed.
   */
  async verifyQuantityOneEdgeCase(cardIndex: number): Promise<void> {
    this.logger.warn(
      `qty=1 edge case on card ${cardIndex}: AC ambiguous (hide box vs show "1"). ` +
      `Asserting: box hidden OR box shows "1".`,
    );
    const badge = this.workbenchPage.quantityBoxOnCard(cardIndex);
    const isVisible = await badge.isVisible({ timeout: 3_000 }).catch(() => false);
    if (isVisible) {
      await expect(
        badge,
        'If quantity box is shown when qty=1, it must display "1"',
      ).toContainText('1');
    }
    this.logger.info(`qty=1 edge-case check passed for card ${cardIndex} (visible=${isVisible})`);
  }

  async verifyRootQuantity(expectedQty: number): Promise<void> {
    await this.verifyQuantityDisplayedOnCard(0, expectedQty);
  }

  async verifyEndOfBranchQuantity(expectedQty: number): Promise<void> {
    const count = await this.workbenchPage.getProductCardCount();
    await this.verifyQuantityDisplayedOnCard(count - 1, expectedQty);
  }

  async verifyMidBranchQuantity(positionFromRoot: number, expectedQty: number): Promise<void> {
    await this.verifyQuantityDisplayedOnCard(positionFromRoot, expectedQty);
  }

  /**
   * Verify quantity input rejects values below 1.
   * Uses WorkbenchPage.isQuantityInputInvalid() — keeps DOM evaluation in the Page layer.
   */
  async verifyQuantityBelowMinRejected(cardIndex: number): Promise<void> {
    this.logger.info(`Verifying qty < 1 is rejected on card ${cardIndex}`);
    await this.workbenchPage.clickProductCard(cardIndex);
    await this.workbenchPage.clearAndTypeQuantity(0);
    await this.workbenchPage.clickConfirmQuantity();

    const input = this.workbenchPage.quantityInput();
    const value = await input.inputValue().catch(() => '');
    const isInvalid = await this.workbenchPage.isQuantityInputInvalid();

    expect(
      Number(value) >= 1 || isInvalid,
      'Entering qty=0 should either keep qty>=1 or mark input invalid',
    ).toBe(true);
    this.logger.info('qty < 1 validation confirmed');
  }

  // ── Navigation helpers ──────────────────────────────────────────────────

  async goToSLD(): Promise<void> {
    this.logger.info('Navigating to SLD view from workbench');
    await this.workbenchPage.navigateToSLD();
    await this.workbenchPage.waitForPageLoad();
  }

  async goToExport(): Promise<void> {
    this.logger.info('Navigating to Export page from workbench');
    await this.workbenchPage.navigateToExport();
    await this.workbenchPage.waitForPageLoad();
  }

  async saveWorkbench(): Promise<void> {
    this.logger.info('Saving workbench');
    await this.workbenchPage.clickSave();
    await this.workbenchPage.waitForPageLoad();
    this.logger.info('Workbench saved');
  }
}
