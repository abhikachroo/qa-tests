import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * OrderListPage — Layer 2: Locators & basic UI actions only.
 *
 * Covers: https://fra-vanilla-preprod.dev.spark.sonepar.com/account/en-gb/orders
 *
 * All locators are verified against the live Preprod DOM (2026-04-29).
 * All selectors use data-testid (priority 5) or role/accessible name (priority 1)
 * as extracted in the LOCATOR_MAP of the test plan.
 *
 * Zero business logic. Zero assertions. Zero conditionals.
 */
export class OrderListPage extends BasePage {
  constructor(page: Page) { super(page); }

  // ── Page-level landmark ──────────────────────────────────────────────────

  // H1 heading on the Order List page (strategy: role+name, level=1)
  ordersHeading = () => this.page.getByRole('heading', { name: 'Orders', level: 1 });

  // ── Primary Navigation — Orders menu (home page) ─────────────────────────

  // "Orders" button in primary navigation bar (strategy: role+text — confirmed live)
  ordersNavButton = () => this.page.getByRole('button', { name: 'Orders' });

  // "Orders" sub-menu link → /account/en-gb/orders (strategy: id — confirmed live)
  ordersSubMenuLink = () => this.page.locator('#account-orders');

  // Additional sub-menu links for reference
  ordersAwaitingApprovalLink  = () => this.page.locator('#account-ordersawaitingapproval');
  toBeDeliveredLink           = () => this.page.locator('#account-tobedelivered');
  packagingReturnsLink        = () => this.page.locator('#account-packagingreturns');
  productReturnsLink          = () => this.page.locator('#account-productreturnsoverview');
  invoiceCreditNotesLink      = () => this.page.locator('#account-invoicecreditnotes');
  deliveryNotesLink           = () => this.page.locator('#account-deliverynotes');

  // ── Order List — Controls & Filters ─────────────────────────────────────

  // Search field (strategy: data-testid)
  searchField = () => this.page.getByTestId('search-field');

  // Search submit button (strategy: data-testid)
  searchSubmitButton = () => this.page.getByTestId('search-field-search-button');

  // "Collapse all / Expand all" toggle — reliable signal list is rendered (strategy: data-testid)
  expandCollapseAllButton = () => this.page.getByTestId('order-list-expand-button');

  // Select all orders checkbox (strategy: data-testid)
  selectAllCheckbox = () => this.page.getByTestId('orders-selectAll');

  // Filters drawer trigger (strategy: data-testid)
  filtersDrawerButton = () => this.page.getByTestId('filterdrawer-trigger-button');

  // Accounts filter drawer trigger (strategy: data-testid)
  accountsFilterButton = () => this.page.getByTestId('accounts-filterdrawer-trigger-button');

  // Status filter buttons (strategy: data-testid)
  backOrderedFilterButton  = () => this.page.getByTestId('back_ordered-status-filter-button');
  activeFilterButton       = () => this.page.getByTestId('active-status-filter-button');
  completedFilterButton    = () => this.page.getByTestId('completed-status-filter-button');
  acceptedFilterButton     = () => this.page.getByTestId('accepted-status-filter-button');
  cancelledFilterButton    = () => this.page.getByTestId('cancelled-status-filter-button');

  // Sort by dropdown (strategy: data-testid)
  sortDropdown = () => this.page.getByTestId('sort-list-view');

  // View mode buttons (strategy: data-testid)
  tableViewButton    = () => this.page.getByTestId('table-button');
  listViewButton     = () => this.page.getByTestId('list-button');
  calendarViewButton = () => this.page.getByTestId('calendar-button');

  // Export button (strategy: data-testid)
  exportButton         = () => this.page.getByTestId('download-button');
  downloadXlsxButton   = () => this.page.getByTestId('download-details-xlsx');
  downloadCsvButton    = () => this.page.getByTestId('download-details-csv');

  // ── Order List — Order Rows ───────────────────────────────────────────────

  // First visible order details button — used to assert at least one row is rendered
  // (strategy: data-testid prefix pattern — orderId varies per account)
  firstOrderDetailsButton = () => this.page.locator('[data-testid^="orderDetailsButton-"]').first();

  // Generic order row count (all orderDetailsButtons visible on page)
  allOrderDetailsButtons = () => this.page.locator('[data-testid^="orderDetailsButton-"]');

  // ── Pagination ────────────────────────────────────────────────────────────

  // Pagination next-page button (strategy: data-testid)
  paginationNextButton = () => this.page.getByTestId('pagination-next-page');

  // Pagination previous-page button (strategy: data-testid)
  paginationPrevButton = () => this.page.getByTestId('pagination-previous-page');

  // ── Info / Status Banners ─────────────────────────────────────────────────

  // Informational "orders still processing" banner — NOT an error (strategy: data-testid)
  processingMessageBanner = () => this.page.getByTestId('orders-history-processing-message');

  // ── Login form locators — used in unauthenticated redirect assertions ─────

  // Email input from Azure B2C login form (strategy: role=textbox — from LoginPage)
  loginEmailInput = () => this.page.getByRole('textbox', { name: 'Email Address' });

  // ── Simple UI Actions ─────────────────────────────────────────────────────

  /** Click the "Orders" button in the primary navigation to reveal the sub-menu. */
  async clickOrdersNavButton(): Promise<void> {
    await this.ordersNavButton().click();
  }

  /** Click the "Orders" sub-menu link to navigate to the Order List page. */
  async clickOrdersSubMenuLink(): Promise<void> {
    await this.ordersSubMenuLink().click();
  }

  /**
   * Wait for the expand/collapse button to be visible — signals order list is fully rendered.
   *
   * HEALED (Round 1): Increased timeout from 30_000 to 60_000ms.
   * The test account has 4,770 orders; the Orders SPA takes >30s to fetch and render
   * all order data before the expand/collapse toggle becomes interactive.
   * Affected: TC-011.
   */
  async waitForOrderListToRender(): Promise<void> {
    await this.expandCollapseAllButton().waitFor({ state: 'visible', timeout: 60_000 });
  }

  /**
   * Wait explicitly for the H1 "Orders" heading to be visible in the DOM.
   *
   * HEALED (Round 1): New helper added to support TC-010.
   * The Orders SPA renders the H1 asynchronously after its initial data fetch.
   * The default expect() timeout of 10s is insufficient; this waits up to 45s
   * before handing off to the toBeVisible() assertion.
   * Affected: TC-010.
   */
  async waitForOrdersHeading(): Promise<void> {
    await this.ordersHeading().waitFor({ state: 'visible', timeout: 45_000 });
  }

  /** Get the page title string. */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /** Get the current page URL string. */
  async getUrl(): Promise<string> {
    return this.page.url();
  }

  /** Get the count of order detail buttons currently visible on the page. */
  async getOrderRowCount(): Promise<number> {
    return this.allOrderDetailsButtons().count();
  }
}
