import { test, expect } from '@fixtures';
import { config }       from '@config/index';

/**
 * Login — Happy Path
 * Feature:     Login
 * Environment: preprod
 * OPCO:        AUTH_POC (fra-vanilla-preprod.dev.spark.sonepar.com)
 *
 * Scope:       Successful end-to-end login with valid credentials only.
 * Out of scope: Negative flows, session persistence, logout, cross-browser
 *               (all excluded per requirements).
 */
test.describe(`@P0 @Smoke @Login Login Happy Path — ${config.displayName} on ${config.environment}`, () => {

  /**
   * TC-001: Successful login with valid credentials
   *
   * Priority:     P0 Smoke
   * AC Coverage:  AC-001 (login page renders), AC-002 (email field), AC-003 (password field),
   *               AC-004 (submit button), AC-005 (redirect on success),
   *               AC-006 (welcome heading), AC-007 (navigation present)
   *
   * Preconditions:
   *   - Application is accessible at config.baseUrl
   *   - Login page is reachable at config.loginPath
   *   - Credentials in config.json are valid for the preprod/AUTH_POC environment
   *
   * Flow:
   *   1. Navigate to the login page
   *   2. Dismiss cookie consent banner if present
   *   3. Fill in the email address
   *   4. Fill in the password
   *   5. Click the submit button
   *   6. Verify the URL no longer contains /login (redirect occurred)
   *   7. Verify the welcome heading is displayed on the landing page
   *   8. Verify the main navigation bar is present
   */
  test('TC-001: Successful login with valid credentials redirects to authenticated landing page', async ({
    loginModule,
  }) => {

    await test.step('Navigate to login page and submit valid credentials', async () => {
      await loginModule.doLogin();
    });

    await test.step('Verify authenticated landing page is displayed', async () => {
      await loginModule.verifyAuthenticatedState();
    });

  });

});
