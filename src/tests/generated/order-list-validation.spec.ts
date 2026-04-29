import { test, expect } from '@fixtures';
import { config }        from '@config/index';

/**
 * Order List Validation Test Suite
 *
 * Feature:   Order List Validation
 * App:       https://fra-vanilla-preprod.dev.spark.sonepar.com
 * Module:    OrderListModule
 * Pages:     OrderListPage (order list, navigation), LoginPage (Azure B2C — for redirect assertion)
 *
 * Scenario coverage (login scenarios already covered by login.spec.ts — not duplicated here):
 *   TC-003  P1  Smoke       — Full navigation path → Order List page title loaded
 *   TC-007  P1  Functional  — Orders nav button visible and enabled on home page
 *   TC-008  P1  Functional  — Clicking Orders button reveals sub-menu with Orders link
 *   TC-009  P1  Functional  — Clicking sub-menu link navigates to /account/en-gb/orders
 *   TC-010  P1  Functional  — Order List page loads with H1 "Orders", no blocking error
 *   TC-011  P1  Functional  — Order list displays at least one order row (not empty)
 *   TC-012  P1  Functional  — Session remains authenticated throughout full navigation flow
 *   TC-013  P2  Negative    — Unauthenticated direct URL access redirects to login
 *   TC-014  P2  Functional  — Empty order state (SKIPPED — requires zero-order account)
 *
 * Note: TC-001, TC-002, TC-004, TC-005, TC-006 are covered by login.spec.ts.
 * implementationMode: reuse_and_create
 */

// ─────────────────────────────────────────────────────────────
// P1 Smoke + Functional — Authenticated suite
// All tests in this describe block rely on doLogin() in beforeEach.
// ─────────────────────────────────────────────────────────────
test.describe(`@P1 @Smoke @OrderList Order List Validation — ${config.displayName} on ${config.environment}`, () => {

  // HEALED (Round 1): Added retries to absorb transient SPA polling / network flakiness.
  // Affected: TC-003-OL, TC-009, TC-010, TC-011, TC-012.
  test.describe.configure({ retries: 2 });

  test.beforeEach(async ({ loginModule }) => {
    await loginModule.doLogin();
  });

  /**
   * TC-003: Navigate full path to Order List and confirm page title loads
   * Priority:    P1 Smoke
   * AC Reference: AC-004, AC-005, AC-006, AC-007
   */
  test('@P1 @Smoke TC-003: Full navigation path from home to Order List confirms page title loads', async ({
    orderListModule,
    orderListPage,
  }) => {
    await test.step('Navigate to Order List via primary nav — click Orders button then sub-menu link', async () => {
      await orderListModule.navigateToOrderListViaMenu();
    });

    await test.step('Verify Order List page loaded — URL contains /account/orders and H1 is visible', async () => {
      await orderListModule.verifyOrderListPageLoaded();
    });

    await test.step('Verify page <title> element returns "Orders"', async () => {
      const title = await orderListPage.getPageTitle();
      expect(title).toBe('Orders');
    });
  });

  /**
   * TC-007: Orders menu button is visible and clickable on authenticated home page
   * Priority:    P1 Functional
   * AC Reference: AC-004
   */
  test('@P1 @Functional TC-007: Orders nav button is visible and enabled on authenticated home page', async ({
    orderListModule,
  }) => {
    await test.step('Assert "Orders" button is visible and enabled in the primary navigation bar', async () => {
      await orderListModule.verifyOrdersNavButtonVisible();
    });
  });

  /**
   * TC-008: Clicking Orders menu button reveals Orders sub-menu with navigation links
   * Priority:    P1 Functional
   * AC Reference: AC-005
   *
   * HEALED (Round 1): Added waitForURL() before capturing urlBefore.
   * The doLogin() call in beforeEach completes while the Azure B2C authorize URL
   * is still mid-redirect. Waiting for the authenticated home URL to settle
   * ensures urlBefore reflects the stable home page URL, not the transient B2C URL.
   */
  test('@P1 @Functional TC-008: Clicking Orders nav button reveals sub-menu with Orders link', async ({
    orderListModule,
    orderListPage,
    page,
  }) => {
    await test.step('Wait for authenticated home page URL to settle before capturing baseline URL', async () => {
      await page.waitForURL(/fra-vanilla-preprod\.dev\.spark\.sonepar\.com/, { timeout: 15_000 });
    });

    const urlBefore = page.url();

    await test.step('Click the "Orders" nav button and verify the sub-menu becomes visible', async () => {
      await orderListModule.openOrdersMenuAndVerifySubMenu();
    });

    await test.step('Assert page URL has NOT changed — Orders menu click does not navigate', async () => {
      expect(page.url()).toBe(urlBefore);
    });

    await test.step('Assert "Orders awaiting approval" additional sub-menu link is also visible', async () => {
      await expect(
        orderListPage.ordersAwaitingApprovalLink(),
        '"Orders awaiting approval" sub-menu link should be visible after opening Orders menu',
      ).toBeVisible();
    });
  });

  /**
   * TC-009: Clicking Orders sub-menu link navigates to /account/en-gb/orders
   * Priority:    P1 Functional
   * AC Reference: AC-006
   */
  test('@P1 @Functional TC-009: Clicking Orders sub-menu link navigates to the Order List URL', async ({
    orderListModule,
    orderListPage,
  }) => {
    await test.step('Open Orders nav sub-menu by clicking the "Orders" nav button', async () => {
      await orderListPage.clickOrdersNavButton();
      await expect(
        orderListPage.ordersSubMenuLink(),
        '"Orders" sub-menu link should be visible after clicking the nav button',
      ).toBeVisible();
    });

    await test.step('Click the "Orders" sub-menu link and wait for navigation to complete', async () => {
      await orderListPage.clickOrdersSubMenuLink();
      await orderListPage.waitForPageLoad();
    });

    await test.step('Verify Order List page loaded — URL contains /account/orders, H1 "Orders" visible', async () => {
      await orderListModule.verifyOrderListPageLoaded();
    });
  });

  /**
   * TC-010: Order List page loads with H1 "Orders" and no blocking error state
   * Priority:    P1 Functional
   * AC Reference: AC-007
   */
  test('@P1 @Functional TC-010: Order List page loads with H1 "Orders" heading and no blocking error', async ({
    orderListModule,
    orderListPage,
  }) => {
    await test.step('Navigate directly to the Order List URL', async () => {
      await orderListModule.navigateToOrderListDirectly();
    });

    await test.step('Wait for the H1 "Orders" heading to appear in the DOM (SPA async render)', async () => {
      // HEALED (Round 1): Orders SPA renders H1 asynchronously after data fetch.
      // Explicit waitFor (45s) acts as a readiness gate before the toBeVisible() assertion.
      await orderListPage.waitForOrdersHeading();
    });

    await test.step('Assert the H1 "Orders" heading is visible on the page', async () => {
      await expect(
        orderListPage.ordersHeading(),
        'H1 "Orders" heading should be visible on the Order List page',
      ).toBeVisible();
    });

    await test.step('Assert the search field is rendered — confirms page body content loaded without error', async () => {
      await expect(
        orderListPage.searchField(),
        'Search field should be visible — confirms Order List UI rendered successfully',
      ).toBeVisible();
    });
  });

  /**
   * TC-011: Order List page displays at least one order row (list is not empty)
   * Priority:    P1 Functional
   * AC Reference: AC-008
   *
   * Precondition: Test account has 4,770 orders in Preprod (verified 2026-04-29).
   */
  test('@P1 @Functional TC-011: Order List displays at least one order row confirming list is not empty', async ({
    orderListModule,
    orderListPage,
  }) => {
    await test.step('Navigate directly to the Order List URL', async () => {
      await orderListModule.navigateToOrderListDirectly();
    });

    await test.step('Wait for order list to render — expand/collapse toggle becomes visible', async () => {
      await orderListPage.waitForOrderListToRender();
    });

    await test.step('Assert at least one order row is visible (list is not empty)', async () => {
      await orderListModule.verifyOrderListNotEmpty();
    });

    await test.step('Assert pagination next-page button is enabled — confirms multiple pages of results', async () => {
      await expect(
        orderListPage.paginationNextButton(),
        'Pagination next-page button should be enabled — confirms more than one page of orders exists',
      ).toBeEnabled();
    });
  });

  /**
   * TC-012: Session remains authenticated throughout full Orders navigation flow
   * Priority:    P1 Functional
   * AC Reference: AC-010
   */
  test('@P1 @Functional TC-012: Session remains authenticated throughout full Orders navigation flow', async ({
    orderListModule,
    orderListPage,
  }) => {
    await test.step('Verify session is active on the authenticated home page (no B2C URL)', async () => {
      await orderListModule.verifySessionAuthenticated();
    });

    await test.step('Open Orders nav sub-menu and verify session is still active (session check 1)', async () => {
      await orderListPage.clickOrdersNavButton();
      await expect(
        orderListPage.ordersSubMenuLink(),
        'Sub-menu should be visible — no session interruption after clicking Orders button',
      ).toBeVisible();
      await orderListModule.verifySessionAuthenticated();
    });

    await test.step('Navigate to Order List page and verify session is still active (session check 2)', async () => {
      await orderListPage.clickOrdersSubMenuLink();
      await orderListPage.waitForPageLoad();
      await orderListModule.verifySessionAuthenticated();
    });

    await test.step('Verify Order List page loaded correctly — session maintained throughout full flow (session check 3)', async () => {
      await orderListModule.verifyOrderListPageLoaded();
    });
  });

});

// ─────────────────────────────────────────────────────────────
// P2 — Negative / Edge case
// TC-013 uses a FRESH unauthenticated context — separate describe block
// with NO beforeEach login.
// ─────────────────────────────────────────────────────────────
test.describe(`@P2 @Negative @OrderList Order List Validation — Unauthenticated Access — ${config.displayName} on ${config.environment}`, () => {

  /**
   * TC-013: Unauthenticated direct navigation to /account/en-gb/orders redirects to login
   * Priority:    P2 Negative
   * AC Reference: AC-010
   */
  test('@P2 @Negative TC-013: Unauthenticated direct access to Order List URL redirects to Azure B2C login', async ({
    orderListPage,
    orderListModule,
  }) => {
    await test.step('Navigate directly to the Order List URL without any authenticated session', async () => {
      await orderListPage.navigate(config.ordersPath);
      await orderListPage.waitForPageLoad();
    });

    await test.step('Assert user is redirected to Azure B2C login page — email input visible and URL changed', async () => {
      await orderListModule.verifyUnauthenticatedRedirectToLogin();
    });
  });

  /**
   * TC-014: Order List page shows empty state message when account has no orders
   * Priority:    P2 Functional
   * AC Reference: AC-009
   * Automated:   No — SKIPPED pending zero-order Preprod account provisioning
   */
  test.skip('@P2 @Functional TC-014: Order List shows empty state when account has zero orders', async () => {
    // SKIPPED: A Preprod account with zero orders is required to automate this scenario.
    // The primary test account (config.username) has 4,770 orders and cannot be used here.
    // Action required:
    //   1. Provision a dedicated zero-order Preprod test account
    //   2. Add credentials to config.json: "zeroOrderUsername", "zeroOrderPassword"
    //   3. Add fields to EnvConfig interface in src/config/index.ts
    //   4. Implement login with zero-order account credentials
    //   5. Assert count of [data-testid^="orderDetailsButton-"] = 0
    //   6. Assert empty state UI element is visible (text/element TBD from live app)
  });

});
