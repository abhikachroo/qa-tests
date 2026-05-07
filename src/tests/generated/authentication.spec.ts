/**
 * Authentication Test Suite — E2E Purchase Flow
 *
 * Covers: AC-001, AC-002, AC-003, AC-013
 * Test IDs: TC-001, TC-002, TC-003, TC-015, TC-017, TC-020
 *
 * Test account: mark.reinger.6213@exka6oev.mailosaur.net / Demo202201
 * Environment: preprod / AUTH_POC
 * Browser: Chromium (default)
 */
import { test, expect } from '@fixtures';
import { config }       from '@config/index';

test.describe(
  `@Auth Authentication -- ${config.displayName} on ${config.environment}`,
  () => {
    // ─────────────────────────────────────────────────────────────────
    // TC-001: Successful login (P0, Smoke)
    // ─────────────────────────────────────────────────────────────────
    test(
      '@P0 @Smoke TC-001 successful login with valid credentials redirects to home dashboard',
      async ({ loginModule, homePage }) => {
        await test.step('Navigate to app and perform login with valid credentials', async () => {
          await loginModule.doLogin(config.username, config.password);
        });

        await test.step('Verify post-login authenticated state on home dashboard', async () => {
          await loginModule.verifyLoginSuccess();
          // "Account & settings" button confirms authenticated session
          await expect(
            homePage.userDetailsButton(),
            '"Account & settings" button should be visible after login',
          ).toBeVisible();
          // Welcome heading visible on homepage
          await expect(
            homePage.welcomeHeading(),
            'Welcome heading should be visible on the post-login dashboard',
          ).toBeVisible();
        });
      },
    );

    // ─────────────────────────────────────────────────────────────────
    // TC-002: Invalid credentials (P0, Negative)
    // ─────────────────────────────────────────────────────────────────
    test(
      '@P0 @Negative TC-002 login with invalid credentials displays error message and stays on login page',
      async ({ loginModule, loginPage, homePage }) => {
        await test.step('Navigate to app and attempt login with invalid credentials', async () => {
          await loginModule.doLogin('invalid@notadomain.xyz', 'WrongPass999');
        });

        await test.step('Verify error message is displayed and user is not authenticated', async () => {
          // Error message should be visible on the Azure B2C login page
          await expect(
            loginPage.errorMessage(),
            'Login error message container should be visible',
          ).toBeVisible();
          // User must NOT be authenticated — no "Account & settings" button
          await expect(
            homePage.userDetailsButton(),
            '"Account & settings" button should NOT be visible after failed login',
          ).not.toBeVisible();
        });
      },
    );

    // ─────────────────────────────────────────────────────────────────
    // TC-003: Empty fields (P1, Negative)
    // ─────────────────────────────────────────────────────────────────
    test(
      '@P1 @Negative TC-003 login with empty email and password shows inline validation errors',
      async ({ loginModule, loginPage }) => {
        await test.step('Navigate to Azure B2C login and submit empty form', async () => {
          await loginModule.doLoginWithoutCredentials();
        });

        await test.step('Verify validation error message is displayed', async () => {
          await expect(
            loginPage.errorMessage(),
            'Validation error message should be visible when submitting empty credentials',
          ).toBeVisible();
        });
      },
    );

    // ─────────────────────────────────────────────────────────────────
    // TC-015: Unauthenticated checkout redirect (P0, Negative)
    // ─────────────────────────────────────────────────────────────────
    test(
      '@P0 @Negative TC-015 unauthenticated user navigating to checkout URL is redirected to login',
      async ({ browser }) => {
        // Use a fresh browser context with no stored session — ensures no auth cookies
        const freshContext = await browser.newContext();
        const freshPage   = await freshContext.newPage();

        await test.step('Navigate directly to checkout URL without authentication', async () => {
          await freshPage.goto(`${config.baseUrl}${config.cartPath}`);
          await freshPage.waitForLoadState('networkidle');
        });

        await test.step('Verify user is redirected to the login page', async () => {
          // The checkout URL should not be accessible without auth
          expect(
            freshPage.url(),
            'URL should NOT still be the checkout page — user must be redirected to login',
          ).not.toContain('/checkout/en-gb/');
          // Login form fields should be visible (Azure B2C login page)
          await expect(
            freshPage.getByRole('textbox', { name: 'Email Address' }),
            'Email input on login page should be visible after redirect',
          ).toBeVisible();
        });

        await freshContext.close();
      },
    );

    // ─────────────────────────────────────────────────────────────────
    // TC-017: Malformed email (P2, Negative)
    // ─────────────────────────────────────────────────────────────────
    test(
      '@P2 @Negative TC-017 login with malformed email shows inline format validation error',
      async ({ loginModule, loginPage }) => {
        await test.step('Navigate to Azure B2C login and submit malformed email (no @ symbol)', async () => {
          await loginModule.doLogin('notanemail', 'anypassword123');
        });

        await test.step('Verify email format validation error is displayed', async () => {
          await expect(
            loginPage.errorMessage(),
            'Validation error message should be visible for malformed email input',
          ).toBeVisible();
        });
      },
    );

    // ─────────────────────────────────────────────────────────────────
    // TC-020: Session persistence after reload (P1, Regression)
    // ─────────────────────────────────────────────────────────────────
    test(
      '@P1 @Regression TC-020 previously authenticated user session persists after page reload without re-login',
      async ({ loginModule, homePage, page }) => {
        await test.step('Log in with valid credentials', async () => {
          await loginModule.doLogin(config.username, config.password);
        });

        await test.step('Confirm user is authenticated before reload', async () => {
          await expect(
            homePage.userDetailsButton(),
            '"Account & settings" button should be visible before reload',
          ).toBeVisible();
        });

        await test.step('Reload the page', async () => {
          await page.reload();
          await page.waitForLoadState('networkidle');
        });

        await test.step('Verify session is still active after reload — no redirect to login', async () => {
          await expect(
            homePage.userDetailsButton(),
            '"Account & settings" button should still be visible after reload — session must persist',
          ).toBeVisible();
          // Confirm we are NOT on the login page
          await expect(
            homePage.welcomeHeading(),
            'Welcome heading should still be visible after reload',
          ).toBeVisible();
        });
      },
    );
  },
);
