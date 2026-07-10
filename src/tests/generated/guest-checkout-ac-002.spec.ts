import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';
const EXPECTED_GUEST_CART_QUANTITY = '1';

test.describe(`@GuestCheckout Guest Checkout add-to-cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @GuestCheckout TC-003: Add product ID 170720241509 to cart shows cart confirmation', async ({
    guestCheckoutModule,
    searchResultsPage,
  }) => {
    await test.step('Search for the selected product as a guest', async () => {
      await guestCheckoutModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the selected product is visible and ready to add', async () => {
      await guestCheckoutModule.verifyProductVisible(PRODUCT_ID);
      await expect(
        searchResultsPage.productCardAddToCartButton(PRODUCT_ID),
        'Product card should expose an enabled add-to-cart action for the guest user',
      ).toBeEnabled();
    });

    await test.step('Add the selected product to the guest cart', async () => {
      await guestCheckoutModule.addProductToCart(PRODUCT_ID);
    });

    await test.step('Verify the selected product appears in the guest cart', async () => {
      await guestCheckoutModule.openCartFromHeader();
      await guestCheckoutModule.verifyProductInCart(PRODUCT_ID);
    });
  });

  test('@P2 @Negative @GuestCheckout TC-004: Add-to-cart action prevents unintended duplicate cart additions', async ({
    guestCheckoutModule,
    searchResultsPage,
    cartPage,
  }) => {
    await test.step('Search for the selected product as a guest', async () => {
      await guestCheckoutModule.searchForProduct(PRODUCT_ID);
    });

    await test.step('Verify the selected product add-to-cart action is available', async () => {
      await guestCheckoutModule.verifyProductVisible(PRODUCT_ID);
      await expect(
        searchResultsPage.productCardAddToCartButton(PRODUCT_ID),
        'Product card should expose an enabled add-to-cart action before the first add attempt',
      ).toBeEnabled();
    });

    await test.step('Submit the first add-to-cart request', async () => {
      await guestCheckoutModule.addProductToCart(PRODUCT_ID);
    });

    await test.step('Attempt an immediate duplicate add-to-cart request', async () => {
      await searchResultsPage
        .productCardAddToCartButton(PRODUCT_ID)
        .click({ timeout: 1_000 })
        .catch(() => undefined);
    });

    await test.step('Verify the guest cart keeps a single quantity for the selected product', async () => {
      await guestCheckoutModule.openCartFromHeader();
      await guestCheckoutModule.verifyProductInCart(PRODUCT_ID);
      await expect(
        cartPage.quantityInput(PRODUCT_ID),
        'Cart quantity should remain one after an immediate duplicate add-to-cart attempt',
      ).toHaveValue(EXPECTED_GUEST_CART_QUANTITY);
    });
  });
});
