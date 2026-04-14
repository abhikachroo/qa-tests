import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

/**
 * Invalid Login — Test Suite
 *
 * Feature:    Invalid Login
 * Scope:      Entering an unrecognised email + incorrect password displays an error message.
 * Out of Scope: Empty-field validation, account lockout, SQL injection, email format validation.
 *
 * Application: https://fra-vanilla-preprod.dev.spark.sonepar.com
 * Login form:  Azure B2C at /account/api/login (OAuth2 redirect)
 *
 * Error message verified live:
 *   "The email and password your entered did not match our record.
 *    Please double check and try again."
 */

/** Exact error string mandated by the acceptance criteria */
const INVALID_CREDENTIALS_ERROR =
  'The email and password your entered did not match our record. Please double check and try again.';

test.describe(
  `@P0 @Smoke @InvalidLogin Invalid Login — ${config.displayName} on ${config.environment}`,
  () => {
    // -------------------------------------------------------------------------
    // TC-001 · P0 · Smoke
    // -------------------------------------------------------------------------
    test(
      'TC-001: Invalid email and password should display an error message',
      async ({ loginModule }) => {
        await test.step('Navigate to the login page', async () => {
          await loginModule.navigateToLoginPage();
        });

        await test.step('Submit the form with an invalid email and incorrect password', async () => {
          await loginModule.submitLoginForm(
            DataGenerator.randomEmail(),
            DataGenerator.randomString(12),
          );
        });

        await test.step('Verify the error alert is visible', async () => {
          await loginModule.verifyLoginErrorMessage(INVALID_CREDENTIALS_ERROR);
        });
      },
    );

    // -------------------------------------------------------------------------
    // TC-002 · P1 · Functional
    // -------------------------------------------------------------------------
    test(
      'TC-002: Error message should match the exact expected text',
      async ({ loginModule, loginPage }) => {
        await test.step('Navigate to the login page', async () => {
          await loginModule.navigateToLoginPage();
        });

        await test.step('Submit the form with an unrecognised email and wrong password', async () => {
          await loginModule.submitLoginForm(
            DataGenerator.randomEmail(),
            DataGenerator.randomString(12),
          );
        });

        await test.step('Verify the error message matches the exact acceptance-criteria text', async () => {
          await expect(
            loginPage.errorMessage(),
            'Error message should match the exact AC string',
          ).toHaveText(INVALID_CREDENTIALS_ERROR);
        });
      },
    );

    // -------------------------------------------------------------------------
    // TC-003 · P2 · Edge Case
    // -------------------------------------------------------------------------
    test(
      'TC-003: Error message should persist after a second consecutive failed login attempt',
      async ({ loginModule, loginPage }) => {
        await test.step('Navigate to the login page', async () => {
          await loginModule.navigateToLoginPage();
        });

        await test.step('Submit the form with invalid credentials (first attempt)', async () => {
          await loginModule.submitLoginForm(
            DataGenerator.randomEmail(),
            DataGenerator.randomString(12),
          );
        });

        await test.step('Verify error alert is visible after first attempt', async () => {
          await loginModule.verifyLoginErrorMessage(INVALID_CREDENTIALS_ERROR);
        });

        await test.step('Submit the form again with different invalid credentials (second attempt)', async () => {
          await loginModule.submitLoginForm(
            DataGenerator.randomEmail(),
            DataGenerator.randomString(12),
          );
        });

        await test.step('Verify error alert is still visible after second attempt', async () => {
          await expect(
            loginPage.errorAlert(),
            'Error alert should remain visible after a second failed attempt',
          ).toBeVisible();
          await expect(
            loginPage.errorMessage(),
            'Error message should still match the AC text after second attempt',
          ).toContainText(INVALID_CREDENTIALS_ERROR);
        });
      },
    );
  },
);
