import { test, expect } from '@fixtures';
import { config }       from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

/**
 * Login Flow Test Suite — User Authentication
 *
 * Feature:   User Login Flow
 * App:        https://ecoset-config-ppr.se.com/ (Azure B2C auth)
 * Module:     LoginModule
 * Pages:      LoginPage (Azure B2C form), HomePage (app shell)
 *
 * Scenario coverage:
 *   TC-001  P0 Smoke     — Valid credentials → authenticated dashboard
 *   TC-002  P1 Negative  — Invalid password → error message
 *   TC-003  P1 Negative  — Invalid email format → validation error
 *   TC-004  P2 Edge Case — Empty email field → required-field error
 *   TC-005  P2 Edge Case — Empty password field → required-field error
 *   TC-006  P2 Edge Case — Both fields empty → required-field errors
 */
test.describe(`@Login User Login Flow — ${config.displayName} on ${config.environment}`, () => {

  // ─────────────────────────────────────────────────────────────
  // P0 — Smoke
  // ─────────────────────────────────────────────────────────────

  /**
   * TC-001: Valid credentials — successful login and post-login redirect
   * Priority:    P0 Smoke
   *
   * Preconditions:
   *   - Valid user credentials configured in config.json (username/password)
   *   - Application accessible at config.baseUrl
   *
   * Flow:
   *   1. Navigate to app homepage
   *   2. Dismiss cookie consent banner if present
   *   3. Click the header login link — redirected to Azure B2C login form (cross-domain)
   *   4. Fill email and password on the Azure B2C form
   *   5. Click submit — Azure B2C redirects back to the application homepage
   *   6. Verify URL is back on the app domain (not Azure B2C)
   *   7. Verify authenticated state — "Account & settings" button is visible
   */
  test('@P0 @Smoke TC-001: Valid credentials should redirect to app homepage with authenticated state', async ({
    page,
    loginModule,
  }) => {
    await test.step('Navigate to homepage, dismiss cookie banner, and click the login link', async () => {
      await loginModule.doLogin();
    });

    await test.step('Verify URL redirects back to the application homepage (not Azure B2C domain)', async () => {
      await expect(page).toHaveURL(/fra-vanilla-preprod\.dev\.spark\.sonepar\.com/);
    });

    await test.step('Verify authenticated state — "Account & settings" button is visible', async () => {
      await loginModule.verifyLoginSuccess();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // P1 — Negative Tests
  // ─────────────────────────────────────────────────────────────

  /**
   * TC-002: Invalid password shows error message
   * Priority:    P1 Negative
   *
   * Flow:
   *   1. Navigate to Azure B2C login form
   *   2. Enter valid email with an incorrect (random) password
   *   3. Submit the form
   *   4. Verify the Azure B2C error message element is visible
   *   5. Verify the error text communicates credential failure
   */
  test('@P1 @Regression TC-002: Invalid password should display an authentication error', async ({
    loginModule,
  }) => {
    const invalidPassword = DataGenerator.randomString(12);

    await test.step('Navigate to login form and submit with valid email but wrong password', async () => {
      await loginModule.doLogin(config.username, invalidPassword);
    });

    await test.step('Verify error message is displayed for incorrect password', async () => {
      // FIX TC-002: Updated expected substring to match actual Azure B2C error:
      // "The email and password your entered did not match our record. Please double check and try again."
      await loginModule.verifyLoginError('did not match our record');
    });
  });

  /**
   * TC-003: Invalid email format shows validation error
   * Priority:    P1 Negative
   *
   * Flow:
   *   1. Navigate to Azure B2C login form
   *   2. Enter a string that is not in email format (no @ symbol)
   *   3. Enter any password string
   *   4. Submit the form
   *   5. Verify the Azure B2C error message element is visible
   *   6. Verify the error text references email format
   */
  test('@P1 @Regression TC-003: Invalid email format should display a format validation error', async ({
    loginModule,
  }) => {
    const malformedEmail = DataGenerator.invalidEmailFormat();
    const anyPassword    = DataGenerator.randomString(8);

    await test.step('Navigate to login form and submit with a malformed email address', async () => {
      await loginModule.doLogin(malformedEmail, anyPassword);
    });

    await test.step('Verify email format validation error is displayed', async () => {
      // FIX TC-003: toContainText is case-sensitive — 'email' (lowercase) was not found in
      // 'Email format is invalid' (capital E). Updated to match exact B2C error message.
      await loginModule.verifyLoginError('Email format is invalid');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // P2 — Edge Cases
  // ─────────────────────────────────────────────────────────────

  /**
   * TC-004: Empty email field shows required-field error
   * Priority:    P2 Edge Case
   *
   * Flow:
   *   1. Navigate to Azure B2C login form
   *   2. Leave email field blank, enter any password
   *   3. Submit the form
   *   4. Verify a required-field or email-missing error is displayed
   */
  test('@P2 @Regression TC-004: Empty email field should display a required field error', async ({
    loginModule,
  }) => {
    const anyPassword = DataGenerator.randomString(8);

    await test.step('Navigate to login form and submit with empty email field', async () => {
      await loginModule.doLogin('', anyPassword);
    });

    await test.step('Verify required field error is shown for missing email', async () => {
      // FIX TC-004: Azure B2C treats empty email the same as invalid format,
      // returning 'Email format is invalid'. Updated from lowercase 'email' to match
      // the actual case-sensitive error message returned by Azure B2C.
      await loginModule.verifyLoginError('Email format is invalid');
    });
  });

  /**
   * TC-005: Empty password field shows required-field error
   * Priority:    P2 Edge Case
   *
   * Flow:
   *   1. Navigate to Azure B2C login form
   *   2. Enter valid email, leave password blank
   *   3. Submit the form
   *   4. Verify a required-field or password-missing error is displayed
   */
  test('@P2 @Regression TC-005: Empty password field should display a required field error', async ({
    loginModule,
  }) => {
    await test.step('Navigate to login form and submit with valid email but empty password', async () => {
      await loginModule.doLoginEmailOnly(config.username);
    });

    await test.step('Verify required field error is shown for missing password', async () => {
      // FIX TC-005: toContainText is case-sensitive — 'password' (lowercase) was not found in
      // 'Password can not be empty' (capital P). Updated to match the exact Azure B2C
      // validation message for the empty password field case.
      await loginModule.verifyLoginError('Password can not be empty');
    });
  });

  /**
   * TC-006: Both email and password empty shows required-field errors
   * Priority:    P2 Edge Case
   *
   * Flow:
   *   1. Navigate to Azure B2C login form
   *   2. Leave both email and password blank
   *   3. Submit the form
   *   4. Verify a required-field error is displayed
   */
  test('@P2 @Regression TC-006: Both fields empty should display a required field error', async ({
    loginModule,
  }) => {
    await test.step('Navigate to login form and submit with both fields empty', async () => {
      await loginModule.doLoginWithoutCredentials();
    });

    await test.step('Verify required field error is shown when both fields are empty', async () => {
      // FIX TC-006: Same case-sensitivity fix as TC-003/TC-004 — Azure B2C returns
      // 'Email format is invalid' (capital E); lowercase 'email' was not matched.
      await loginModule.verifyLoginError('Email format is invalid');
    });
  });

});
