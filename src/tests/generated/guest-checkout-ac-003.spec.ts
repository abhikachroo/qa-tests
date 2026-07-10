import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';

test.describe(`@GuestCheckout Guest Checkout Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @GuestCheckout TC-005: Navigate to cart after adding product shows selected product and checkout action', async ({
    guestCheckoutModule,
    cartPage,
  }) => {
    await test.step('Search for the guest checkout product from the storefront header', async () => {
      await guestCheckoutModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Add the selected product to the guest cart', async () => {
      await guestCheckoutModule.verifyProductVisible(PRODUCT_ID);
      await guestCheckoutModule.addProductToCart(PRODUCT_ID);
    });

    await test.step('Open the cart from the header cart button', async () => {
      await guestCheckoutModule.openCartFromHeader();
    });

    await test.step('Verify the cart line item and checkout action are available', async () => {
      await guestCheckoutModule.verifyProductInCart(PRODUCT_ID);
      await expect(
        cartPage.cartLineItem(PRODUCT_ID),
        `Cart should display a line item for product ${PRODUCT_ID}`,
      ).toBeVisible();
      await expect(
        cartPage.proceedToCheckoutButton(),
        'Guest cart should expose a visible proceed-to-checkout action when a product is present',
      ).toBeVisible();
      await expect(
        cartPage.proceedToCheckoutButton(),
        'Guest cart proceed-to-checkout action should be enabled when a product is present',
      ).toBeEnabled();
    });
  });

  test('@P2 @Negative @GuestCheckout TC-006: Open cart with no products shows empty-cart state and shopping recovery path', async ({
    homePage,
    guestCheckoutModule,
    cartPage,
  }) => {
    await test.step('Navigate to the storefront as a fresh guest user', async () => {
      await homePage.navigate('/');
    });

    await test.step('Open the empty cart from the header cart button', async () => {
      await guestCheckoutModule.openCartFromHeader();
    });

    await test.step('Verify the empty cart state, recovery path, and blocked checkout action', async () => {
      await guestCheckoutModule.verifyEmptyCart();
      await expect(
        cartPage.cartLineItem(PRODUCT_ID),
        `Empty guest cart should not display a line item for product ${PRODUCT_ID}`,
      ).toHaveCount(0);
      await expect(
        cartPage.shoppingRecoveryLink(),
        'Empty guest cart should expose a shopping recovery link',
      ).toBeVisible();
      await expect(
        cartPage.proceedToCheckoutButton(),
        'Empty guest cart should not expose checkout progression',
      ).not.toBeVisible();
    });
  });
});
