import { Page, expect } from '@playwright/test';
import { OrderListPage } from '@pages/OrderListPage';
import { Logger }        from '@utils/Logger';
import { config }        from '@config/index';

export class OrderListModule {
  private logger: Logger;

  constructor(private orderListPage: OrderListPage) {
    this.logger = new Logger('OrderListModule');
  }

  /**
   * Navigate to the Order list page via the Orders mega-menu.
   *
   * Steps:
   *   1. Click the "Orders" nav button to open the mega-menu dropdown
   *   2. Wait for the "Orders" sub-link to become visible
   *   3. Click the "Orders" sub-link → navigates to /account/en-gb/orders
   *   4. Wait for the H1 "Orders" heading to become visible — used instead of
   *      waitForLoadState('networkidle') because the Orders page renders a
   *      "Share Your Feedback!" modal that continuously fires background
   *      requests, preventing networkidle from resolving within the timeout.
   */
  async navigateToOrderList(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to Order list via mega-menu`);
    await this.orderListPage.clickOrdersNavButton();
    await this.orderListPage.ordersSubLink().waitFor({ state: 'visible' });
    await this.orderListPage.clickOrdersSubLink();
    await this.orderListPage.ordersHeading().waitFor({ state: 'visible', timeout: 30_000 });
    this.logger.info('Order list page loaded');
  }

  /**
   * Verify the Order list page has loaded correctly.
   *
   * Checks:
   *   - H1 heading "Orders" is visible
   *   - URL contains /account/en-gb/orders
   *
   * @param page - Playwright Page object (passed from test for URL assertion)
   */
  async verifyOrderListPageLoaded(page: Page): Promise<void> {
    this.logger.info('Verifying Order list page has loaded');
    await expect(
      this.orderListPage.ordersHeading(),
      'Orders page H1 heading should be visible',
    ).toBeVisible();
    await expect(
      page,
      'URL should contain /account/en-gb/orders',
    ).toHaveURL(/\/account\/en-gb\/orders/);
    this.logger.info('Order list page load verified');
  }

  /**
   * Verify the order list is not empty — at least one order row is rendered.
   *
   * Uses the generic prefix match `[data-testid^="order-checkbox-"]` to find
   * any order row regardless of the specific order ID embedded in the testid.
   * The test account has 4,759 confirmed orders in Preprod — assertion is guaranteed to pass.
   */
  async verifyOrderListIsNotEmpty(): Promise<void> {
    this.logger.info('Verifying order list contains at least one order row');
    await expect(
      this.orderListPage.firstOrderRow(),
      'At least one order row ([data-testid^="order-checkbox-"]) should be visible — order list must not be empty',
    ).toBeVisible();
    this.logger.info('Order list non-empty assertion passed');
  }
}
