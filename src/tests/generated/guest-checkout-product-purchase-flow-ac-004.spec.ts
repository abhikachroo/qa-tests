import { test, expect } from '@fixtures';
import { config } from '@config/index';

const knownProductId = '170720241509';

test.describe(`@P1 @GuestCheckout @Cart Guest cart checkout entry behavior — ${config.displayName} on ${config.environment}`, () => {
  test('TC-007 @P1 @GuestCheckout @Cart: Open cart after add-to-cart displays selected product and checkout path', async ({
    page,
    guestCheckoutPage,
    guestCheckoutModule,
  }) => {
    await test.step('Search for the known product and add it to the guest cart', async () => {
      await guestCheckoutModule.searchAndAddProduct(knownProductId);
    });

    await test.step('Open the guest cart from the header cart action', async () => {
      await guestCheckoutModule.openCartFromHeader();
    });

    await test.step('Verify the selected product is present and checkout is enabled', async () => {
      await guestCheckoutModule.verifyProductInCart(knownProductId);
      await expect(
        guestCheckoutPage.checkoutButton(),
        'Checkout button should remain enabled when the guest cart contains the selected product',
      ).toBeEnabled();
    });

    await test.step('Proceed from the cart toward checkout entry', async () => {
      await guestCheckoutPage.checkoutButton().click();
    });

    await test.step('Verify checkout path does not force the guest to sign in', async () => {
      await expect(
        page,
        'Guest checkout entry should not redirect to a forced sign-in route',
      ).not.toHaveURL(/\/(login|sign-in|signin|connexion)(?:[/?#].*)?$/i);
      await expect(
        guestCheckoutPage.checkoutButton(),
        'Checkout/proceed action should remain available after entering the checkout path',
      ).toBeEnabled();
    });
  });

  test('TC-008 @P1 @GuestCheckout @Cart: Empty cart shows actionable empty state and disables checkout', async ({
    page,
    guestCheckoutPage,
    guestCheckoutModule,
  }) => {
    await test.step('Open checkout entry with an isolated empty guest cart', async () => {
      await guestCheckoutModule.openCheckoutEntry();
    });

    await test.step('Verify the empty cart message and disabled checkout state are displayed', async () => {
      await guestCheckoutModule.verifyEmptyCartState();
      await expect(
        guestCheckoutPage.emptyCartMessageArea(),
        'Empty cart message area should be visible for an isolated guest session',
      ).toBeVisible();
      await expect(
        guestCheckoutPage.emptyCartMessageBoard(),
        'Empty cart message board should provide actionable empty-state guidance',
      ).toBeVisible();
      await expect(
        guestCheckoutPage.checkoutButton(),
        'Checkout button should be disabled when no products are in the guest cart',
      ).toBeDisabled();
    });

    await test.step('Navigate from the empty cart state through Explore categories', async () => {
      await guestCheckoutPage.clickExploreCategories();
    });

    await test.step('Verify Explore categories navigates without an error state', async () => {
      await expect(
        page,
        'Explore categories should navigate the guest away from the empty checkout entry',
      ).not.toHaveURL(/\/checkout(?:[/?#].*)?$/i);
      await guestCheckoutModule.verifyStorefrontSearchAvailable();
    });
  });
});
