import { expect } from '@playwright/test';
import { BomPage } from '@pages/BomPage';
import { Logger } from '@utils/Logger';
import { EUR_FORMAT_REGEX } from '@modules/ProductsModule';
import { config } from '@config/index';

export class BomModule {
  private logger: Logger;

  constructor(
    private bomPage: BomPage,
  ) {
    this.logger = new Logger('BomModule');
  }

  /**
   * Verify BOM rows are visible (at least one product row).
   */
  async verifyBomProductsVisible(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Verifying BOM products visible`);
    await expect(
      this.bomPage.bomLineItems().first(),
      'BOM should have at least one product row',
    ).toBeVisible();
    await expect(
      this.bomPage.bomLineItems(),
      'BOM row count should be > 0',
    ).not.toHaveCount(0);
    this.logger.info('BOM product rows verified');
  }

  /**
   * Verify BOM Total Amount contains EUR symbol.
   */
  async verifyBomTotalAmountInEur(): Promise<void> {
    this.logger.info('Verifying BOM Total Amount in EUR');
    await expect(
      this.bomPage.totalAmountText(),
      'BOM Total Amount should be visible and contain €',
    ).toBeVisible();
    await expect(
      this.bomPage.totalAmountText(),
      'BOM Total Amount should contain EUR symbol',
    ).toContainText('€');
    this.logger.info('BOM Total Amount EUR verified');
  }

  /**
   * Extract the raw Total Amount text from the BOM page.
   * Used for cross-view reconciliation (TC-024).
   */
  async getBomTotalAmountText(): Promise<string> {
    return this.bomPage.getTotalAmountText();
  }

  /**
   * Verify BOM prices are visible and contain EUR symbol.
   * Assumption: EUR format is €X,XX.XX (comma = thousands separator).
   * TODO: confirm format with product team before sign-off.
   */
  async verifyBomPricesEurFormat(): Promise<void> {
    this.logger.info('Verifying BOM prices are in EUR format');
    await expect(
      this.bomPage.bomPriceItems().first(),
      'At least one BOM price should be visible',
    ).toBeVisible();
    await expect(
      this.bomPage.bomPriceItems().first(),
      'BOM price should contain EUR symbol',
    ).toContainText('€');
    this.logger.info('BOM price EUR format check complete');
  }

  /**
   * Navigate to the Export tab.
   */
  async goToExport(): Promise<void> {
    this.logger.info('Navigating to Export tab');
    await this.bomPage.clickExportTab();
    await this.bomPage.waitForPageLoad();
    this.logger.info('Export tab opened');
  }
}
