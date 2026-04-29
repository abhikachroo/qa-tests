import { Page, expect } from '@playwright/test';
import { OrderListPage } from '@pages/OrderListPage';
import { Logger }        from '@utils/Logger';
import { config }        from '@config/index';

/**
 * OrderListModule — Layer 3: Business logic workflows.
 *
 * Orchestrates OrderListPage actions into domain workflows.
 * All Page interaction goes through OrderListPage methods — no direct page.locator() calls.
 * All diagnostic output goes through Logger — no console.log.
 * All URLs read from config — no hardcoded strings.
 */
export class OrderListModule {
  private logger: Logger;

  constructor(
    private page: Page,
    private orderListPage: OrderListPage,
  ) {
    this.logger = new Logger('OrderListModule');
  }

  /**
   * Navigate directly to the Order List page via URL.
   * Requires an authenticated session to be active (pre-established via loginModule).
   */
  async navigateToOrderListDirectly(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating directly to Order List page`);
    await this.orderListPage.navigate(config.ordersPath);
    await this.orderListPage.waitForPageLoad();
    this.logger.info('Direct navigation to Order List complete');
  }

  /**
   * Navigate to the Order List page via the primary navigation menu.
   *
   * Two-click pattern confirmed on live Preprod:
   *   1. Click the "Orders" nav button (primary nav bar)
   *   2. Wait for sub-menu to reveal the "Orders" link
   *   3. Click the "Orders" sub-menu link
   *   4. Wait for page to fully load
   */
  async navigateToOrderListViaMenu(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to Order List via primary nav menu`);
    await this.orderListPage.clickOrdersNavButton();
    await this.orderListPage.ordersSubMenuLink().waitFor({ state: 'visible', timeout: 5_000 });
    this.logger.info('Orders sub-menu is visible');
    await this.orderListPage.clickOrdersSubMenuLink();
    await this.orderListPage.waitForPageLoad();
    await this.orderListPage.waitForOrderListToRender();
    this.logger.info('Order List page loaded via menu navigation');
  }

  /**
   * Verify the Orders nav button is visible and enabled on the authenticated home page.
   */
  async verifyOrdersNavButtonVisible(): Promise<void> {
    this.logger.info('Verifying Orders nav button is visible and enabled');
    await expect(
      this.orderListPage.ordersNavButton(),
      '"Orders" button should be visible in the primary navigation',
    ).toBeVisible();
    await expect(
      this.orderListPage.ordersNavButton(),
      '"Orders" button should be enabled (interactive)',
    ).toBeEnabled();
    this.logger.info('Orders nav button verified — visible and enabled');
  }

  /**
   * Click the Orders nav button and verify the sub-menu appears.
   */
  async openOrdersMenuAndVerifySubMenu(): Promise<void> {
    this.logger.info('Clicking Orders nav button and verifying sub-menu visibility');
    await this.orderListPage.clickOrdersNavButton();
    await expect(
      this.orderListPage.ordersSubMenuLink(),
      '"Orders" sub-menu link (#account-orders) should become visible after clicking nav button',
    ).toBeVisible();
    this.logger.info('Orders sub-menu confirmed visible with Orders link present');
  }

  /**
   * Verify the Order List page has loaded correctly:
   *   - URL contains /account and /orders
   *   - H1 heading "Orders" is visible
   */
  async verifyOrderListPageLoaded(): Promise<void> {
    this.logger.info('Verifying Order List page load state');
    await expect(this.page, 'URL should contain /account and /orders path segments').toHaveURL(/\/account.*\/orders/);
    await expect(
      this.orderListPage.ordersHeading(),
      'H1 heading "Orders" should be visible on the Order List page',
    ).toBeVisible();
    const title = await this.orderListPage.getPageTitle();
    this.logger.info(`Page title: "${title}"`);
    this.logger.info('Order List page load verified successfully');
  }

  /**
   * Verify that the order list is NOT empty — at least one order row is rendered.
   */
  async verifyOrderListNotEmpty(): Promise<void> {
    this.logger.info('Verifying order list contains at least one order row');
    await expect(
      this.orderListPage.expandCollapseAllButton(),
      '"Collapse all" toggle should be visible — signals order rows are rendered',
    ).toBeVisible();
    await expect(
      this.orderListPage.firstOrderDetailsButton(),
      'At least one order row (orderDetailsButton) should be visible',
    ).toBeVisible();
    const count = await this.orderListPage.getOrderRowCount();
    this.logger.info(`Order rows visible on page 1: ${count}`);
    this.logger.info('Order list not-empty assertion passed');
  }

  /**
   * Verify that the session remains authenticated.
   * Checks that the URL does not contain a B2C login domain.
   */
  async verifySessionAuthenticated(): Promise<void> {
    this.logger.info('Verifying session is authenticated (no B2C login redirect)');
    await expect(this.page, 'URL must NOT contain B2C login domain — session should be active').not.toHaveURL(/b2clogin|microsoftonline/);
    await expect(this.page, 'URL must NOT redirect to internal /login path').not.toHaveURL(/\/login/);
    this.logger.info('Session authentication verified — no login redirect detected');
  }

  /**
   * Verify that an unauthenticated user who navigates directly to the Order List
   * is redirected to the Azure B2C login page.
   */
  async verifyUnauthenticatedRedirectToLogin(): Promise<void> {
    this.logger.info('Verifying unauthenticated access to Order List redirects to login');
    await expect(
      this.orderListPage.loginEmailInput(),
      'Azure B2C email input should be visible after redirect — confirms login page is shown',
    ).toBeVisible();
    await expect(this.page, 'URL should NOT remain on the Order List page after unauthenticated access').not.toHaveURL(/\/account\/.*\/orders/);
    this.logger.info('Unauthenticated redirect to login verified successfully');
  }
}
