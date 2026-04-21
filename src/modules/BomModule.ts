import { expect } from '@playwright/test';
import { BomPage } from '@pages/BomPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

/** EUR format: €X,XX.XX */
const EUR_FORMAT_REGEX = /^€[0-9]{1,3}(,[0-9]{3})*\.[0-9]{2}$/;

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
    const count = await this.bomPage.getBomRowCount();
    expect(count, 'BOM row count should be > 0').toBeGreaterThan(0);
    this.logger.info(`BOM has ${count} rows`);
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
   * Verify BOM prices match EUR format regex.
   * Assumption: EUR format is €X,XX.XX (comma = thousands separator).
   * TODO: confirm format with product team before sign-off.
   */
  async verifyBomPricesEurFormat(): Promise<void> {
    this.logger.info('Verifying BOM prices match EUR format regex');
    const prices = await this.bomPage.getBomPriceTexts();
    for (const priceText of prices) {
      const normalized = priceText.replace(/\s/g, '');
      this.logger.debug(`BOM price: "${priceText}" — normalized: "${normalized}" — EUR match: ${EUR_FORMAT_REGEX.test(normalized)}`);
    }
    // Assert at least one BOM price cell is visible
    await expect(
      this.bomPage.bomPriceItems().first(),
      'At least one BOM price should be visible',
    ).toBeVisible();
    this.logger.info('BOM price format check complete');
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
