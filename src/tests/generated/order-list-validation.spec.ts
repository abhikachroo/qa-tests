import { test, expect } from '@fixtures';
import { config }        from '@config/index';

/**
 * Order List Validation Test Suite
 *
 * Feature:   Order List Validation
 * App:        https://fra-vanilla-preprod.dev.spark.sonepar.com
 * Module:     OrderListModule (navigation + list assertions), LoginModule (authentication)
 * Pages:      OrderListPage, LoginPage (Azure B2C), HomePage
 *
 * Scenario coverage:
 *   TC-001  P0 Smoke — Login → Orders mega-menu → Orders sub-link → page load → non-empty list assertion
 *
 * AC Coverage:
 *   AC-001 — User can log in with valid credentials
 *   AC-002 — Orders nav button opens the mega-menu dropdown
 *   AC-003 — Orders sub-link navigates to /account/en-gb/orders
 *   AC-004 — Order list page loads (H1 "Orders" visible, networkidle)
 *   AC-005 — URL route is /account/en-gb/orders
 *   AC-006 — Order list contains ≥1 order row
 *
 * Test data:
 *   - Credentials sourced from config.json (username / password) — never hardcoded
 *   - Pre-existing Preprod orders confirmed: 4,759 orders as of 2026-04-29
 *   - No test data setup required — existing account data is sufficient
 */
test.describe(`@OrderListValidation @P0 @Smoke Order List Validation — ${config.displayName} on ${config.environment}`, () => {

  /**
   * TC-001: Login, navigate to Orders via mega-menu sub-link, and verify order list is not empty
   * Priority:    P0 Smoke
   * AC Refs:     AC-001, AC-002, AC-003, AC-004, AC-005, AC-006
   *
   * Preconditions:
   *   - User is NOT logged in (fresh browser context)
   *   - Test account (config.username) has ≥1 pre-existing order in Preprod
   *   - Cookie banner may appear on first load — handled automatically by LoginModule.doLogin()
   *
   * Flow:
   *   1. Login via LoginModule.doLogin() (full E2E: home → cookie banner → login link → Azure B2C → redirect)
   *   2. Verify authenticated state — "Account & settings" button visible (AC-001)
   *   3. Open Orders mega-menu and click Orders sub-link → /account/en-gb/orders (AC-002, AC-003)
   *   4. Wait for page networkidle — H1 heading "Orders" visible (AC-004)
   *   5. Verify URL contains /account/en-gb/orders (AC-005)
   *   6. Verify at least one order row is visible in the list (AC-006)
   *
   * Note: A processing notice banner ("Some orders are still processing...") may be visible
   * after page load — this is informational and does NOT indicate an error. It is not asserted.
   */
  test('TC-001: Login, navigate to Orders via mega-menu sub-link, and verify order list is not empty', async ({
    page,
    loginModule,
    orderListModule,
  }) => {

    await test.step('Login with configured OPCO credentials via full E2E flow', async () => {
      await loginModule.doLogin();
    });

    await test.step('Verify authenticated state — "Account & settings" button is visible (AC-001)', async () => {
      await loginModule.verifyLoginSuccess();
    });

    await test.step('Open Orders mega-menu and navigate to Order list page via sub-link (AC-002, AC-003)', async () => {
      await orderListModule.navigateToOrderList();
    });

    await test.step('Verify Order list page has loaded — H1 heading and URL are correct (AC-004, AC-005)', async () => {
      await orderListModule.verifyOrderListPageLoaded(page);
    });

    await test.step('Verify the order list contains at least one order row — list is not empty (AC-006)', async () => {
      await orderListModule.verifyOrderListIsNotEmpty();
    });

  });

});
