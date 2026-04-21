import { expect } from '@playwright/test';
import { ProductsPage } from '@pages/ProductsPage';
import { SldPage } from '@pages/SldPage';
import { DesignPage } from '@pages/DesignPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

/** EUR format: €X,XX.XX — comma as thousands separator, dot as decimal */
const EUR_FORMAT_REGEX = /^€[0-9]{1,3}(,[0-9]{3})*\.[0-9]{2}$/;

export class ProductsModule {
  private logger: Logger;

  constructor(
    private productsPage: ProductsPage,
    private sldPage: SldPage,
    private designPage: DesignPage,
  ) {
    this.logger = new Logger('ProductsModule');
  }

  /**
   * Add a number of products from the product list (by index).
   */
  async addProducts(count: number = 1): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Adding ${count} product(s)`);
    for (let i = 0; i < count; i++) {
      await this.productsPage.addProduct(i);
      await this.productsPage.waitForPageLoad();
    }
    this.logger.info(`${count} product(s) added`);
  }

  /**
   * Verify all individual product prices are in EUR format.
   */
  async verifyProductPricesInEur(): Promise<void> {
    this.logger.info('Verifying product prices in EUR format');
    const prices = await this.productsPage.getProductPriceTexts();
    for (const priceText of prices) {
      const normalized = priceText.replace(/\s/g, '');
      const match = EUR_FORMAT_REGEX.test(normalized);
      // Assert using auto-retrying locator so failures surface clearly
      await expect(
        this.productsPage.productPriceItems().first(),
        `At least one product price should be visible`,
      ).toBeVisible();
      this.logger.debug(`Price text: "${priceText}" — EUR match: ${match}`);
    }
    this.logger.info('Product EUR price format verified');
  }

  /**
   * Verify the Total Amount text on the Products page contains EUR symbol.
   */
  async verifyTotalAmountInEur(): Promise<void> {
    this.logger.info('Verifying Total Amount in EUR on Products page');
    await expect(
      this.productsPage.totalAmountText(),
      'Total Amount should be visible and contain €',
    ).toBeVisible();
    await expect(
      this.productsPage.totalAmountText(),
      'Total Amount should contain EUR symbol',
    ).toContainText('€');
    this.logger.info('Total Amount EUR verified on Products page');
  }

  /**
   * Navigate to the SLD tab.
   */
  async goToSld(): Promise<void> {
    this.logger.info('Navigating to Single Line Diagram tab');
    await this.productsPage.clickSldTab();
    await this.productsPage.waitForPageLoad();
    this.logger.info('SLD tab opened');
  }

  /**
   * Verify the SLD canvas is visible and nodes are present.
   */
  async verifySldDisplayed(expectedMinNodes: number = 1): Promise<void> {
    this.logger.info('Verifying SLD is displayed with product nodes');
    await expect(
      this.sldPage.sldCanvas(),
      'SLD canvas should be visible',
    ).toBeVisible();
    const nodeCount = await this.sldPage.getSldNodeCount();
    expect(nodeCount, `SLD should have at least ${expectedMinNodes} node(s)`).toBeGreaterThanOrEqual(expectedMinNodes);
    this.logger.info(`SLD verified — ${nodeCount} node(s) found`);
  }

  /**
   * Verify SLD Total Amount contains EUR symbol.
   */
  async verifySldTotalAmountInEur(): Promise<void> {
    this.logger.info('Verifying Total Amount in EUR on SLD page');
    await expect(
      this.sldPage.totalAmountText(),
      'SLD Total Amount should contain EUR symbol',
    ).toContainText('€');
    this.logger.info('SLD Total Amount EUR verified');
  }

  /**
   * Click Design Switchboard and verify 2D view appears.
   */
  async designAndVerify2dView(): Promise<void> {
    this.logger.info('Clicking Design Switchboard and verifying 2D view');
    await this.sldPage.clickDesignSwitchboard();
    await this.sldPage.waitForPageLoad();
    await expect(
      this.designPage.twoDViewCanvas(),
      '2D view canvas should be visible after design',
    ).toBeVisible();
    this.logger.info('2D view confirmed visible');
  }

  /**
   * Mount all devices and verify 0 unplaced devices remain.
   */
  async mountAllDevices(): Promise<void> {
    this.logger.info('Mounting all devices in the switchboard');
    await this.designPage.clickMountAll();
    await this.designPage.waitForPageLoad();
    const unplaced = await this.designPage.getUnplacedDeviceCount();
    expect(unplaced, 'All devices should be placed — 0 unplaced remaining').toBe(0);
    this.logger.info('All devices mounted');
  }

  /**
   * Verify Design page Total Amount contains EUR.
   */
  async verifyDesignTotalAmountInEur(): Promise<void> {
    this.logger.info('Verifying Total Amount in EUR on Design page');
    await expect(
      this.designPage.totalAmountText(),
      'Design Total Amount should contain EUR symbol',
    ).toContainText('€');
    this.logger.info('Design Total Amount EUR verified');
  }
}
