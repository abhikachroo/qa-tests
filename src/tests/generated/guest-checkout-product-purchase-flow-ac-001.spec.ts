import { test, expect } from '@fixtures';
import { config } from '@config/index';

test.describe(`@P1 @GuestCheckout Guest checkout product purchase flow — ${config.opco} on ${config.environment}`, () => {
  test('@P1 @GuestCheckout TC-001: Open preprod storefront as guest exposes search without sign-in', async ({
    guestCheckoutModule,
    guestCheckoutPage,
  }) => {
    await test.step('Open the storefront as a guest user', async () => {
      await guestCheckoutModule.openStorefront();
    });

    await test.step('Verify guest users can access header search without forced sign-in', async () => {
      await guestCheckoutModule.verifyStorefrontSearchAvailable();
      await expect(
        guestCheckoutPage.headerSearchInput(),
        'Header search input should remain visible for unauthenticated guests',
      ).toBeVisible();
      await expect(
        guestCheckoutPage.headerSearchInput(),
        'Header search input should remain interactive for unauthenticated guests',
      ).toBeEnabled();
    });
  });

  test('@P1 @GuestCheckout TC-002: Guest access to checkout entry redirects to cart state rather than sign-in', async ({
    guestCheckoutModule,
    guestCheckoutPage,
  }) => {
    await test.step('Open the checkout entry as a guest user', async () => {
      await guestCheckoutModule.openCheckoutEntry();
    });

    await test.step('Verify the checkout entry shows cart state with optional authentication links', async () => {
      await guestCheckoutModule.verifyCheckoutEntryForGuest();
      await expect(
        guestCheckoutPage.emptyCartMessageArea(),
        'Checkout entry should show cart or empty-cart state before prompting authentication',
      ).toBeVisible();
      await expect(
        guestCheckoutPage.loginButton(),
        'Login should be available as an optional action, not a blocking modal',
      ).toBeVisible();
      await expect(
        guestCheckoutPage.signUpButton(),
        'Sign-up should be available as an optional action, not a blocking modal',
      ).toBeVisible();
    });
  });
});
