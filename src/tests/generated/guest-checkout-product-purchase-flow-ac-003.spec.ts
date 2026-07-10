import { test, expect } from '@fixtures';
import { config } from '@config/index';

const knownProductId = '170720241509';

test.describe(`@P1 @GuestCheckout @Cart Guest checkout cart — ${config.displayName} on ${config.environment}`, () => {
  test('TC-005 @P1 @GuestCheckout @Cart: Add searched product to cart updates cart state and confirms action', async ({
    guestCheckoutModule,
    guestCheckoutPage,
  }) => {
    await test.step('Search for the orderable product and add it to the cart', async () => {
      await guestCheckoutModule.searchAndAddProduct(knownProductId);
    });

    await test.step('Verify the cart action is available after add-to-cart completion', async () => {
      await expect(
        guestCheckoutPage.cartButton(),
        'Cart button should remain visible after adding a product as a guest',
      ).toBeVisible();
      await expect(
        guestCheckoutPage.cartButton(),
        'Cart button should remain enabled after adding a product as a guest',
      ).toBeEnabled();
    });

    await test.step('Open the cart from the header', async () => {
      await guestCheckoutModule.openCartFromHeader();
    });

    await test.step('Verify the cart contains the searched product and guest checkout can continue', async () => {
      await guestCheckoutModule.verifyProductInCart(knownProductId);
    });
  });

  test.fixme(
    'TC-006 @P1 @GuestCheckout @Cart: Add-to-cart unavailable state prevents cart mutation for non-orderable product',
    async () => {
      test.fixme(
        true,
        'Unavailable/non-orderable product fixture is not available for AC-003; provide unavailableProductId before enabling this negative coverage.',
      );
    },
  );
});
