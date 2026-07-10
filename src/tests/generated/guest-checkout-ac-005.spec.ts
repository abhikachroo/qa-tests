import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

const PRODUCT_ID = '170720241509';

const buildValidGuestProfile = () => ({
  email: DataGenerator.randomEmail(),
  firstName: `Guest${DataGenerator.randomString(6)}`,
  lastName: `Order${DataGenerator.randomString(6)}`,
  phone: `06${DataGenerator.randomInt(10_000_000, 99_999_999)}`,
  addressLine1: `${DataGenerator.randomInt(1, 99)} Rue ${DataGenerator.randomString(8)}`,
  postalCode: `${DataGenerator.randomInt(10_000, 95_999)}`,
  city: `Paris${DataGenerator.randomString(4)}`,
});

test.describe(`@P0 @Smoke @GuestCheckout Guest Checkout Order Confirmation — ${config.displayName} on ${config.environment}`, () => {
  test('@P0 @Smoke @GuestCheckout TC-009: Place guest checkout order with valid data shows order confirmation', async ({
    guestCheckoutModule,
    checkoutPage,
  }) => {
    const guestProfile = buildValidGuestProfile();

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

    await test.step('Proceed from cart to checkout as a guest user', async () => {
      await guestCheckoutModule.verifyProductInCart(PRODUCT_ID);
      await guestCheckoutModule.proceedToCheckout();
      await guestCheckoutModule.continueAsGuest();
    });

    await test.step('Enter valid required guest checkout details', async () => {
      await guestCheckoutModule.fillGuestProfile(guestProfile);
    });

    await test.step('Submit the guest checkout details and verify final order review is available', async () => {
      await guestCheckoutModule.submitCheckoutStep();
      await guestCheckoutModule.verifyFinalReviewAvailable();
      await expect(
        checkoutPage.placeOrderButton(),
        'Final guest checkout review should expose the place-order action before submitting the order',
      ).toBeVisible();
      await expect(
        checkoutPage.placeOrderButton(),
        'Final guest checkout place-order action should be enabled after valid guest data is submitted',
      ).toBeEnabled();
    });

    await test.step('Place the guest checkout order from the final review', async () => {
      await guestCheckoutModule.placeOrder();
    });

    await test.step('Verify the guest order confirmation state is displayed', async () => {
      await guestCheckoutModule.verifyOrderConfirmation();
      await expect(
        checkoutPage.orderConfirmation(),
        'Guest checkout should complete with an observable success message or order confirmation state',
      ).toBeVisible();
    });
  });

  test('@P1 @Negative @GuestCheckout TC-010: Prevent duplicate guest order submission while place-order request is in progress', async ({
    guestCheckoutModule,
    checkoutPage,
  }) => {
    const guestProfile = buildValidGuestProfile();

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

    await test.step('Proceed from cart to final guest checkout review with valid data', async () => {
      await guestCheckoutModule.verifyProductInCart(PRODUCT_ID);
      await guestCheckoutModule.proceedToCheckout();
      await guestCheckoutModule.continueAsGuest();
      await guestCheckoutModule.fillGuestProfile(guestProfile);
      await guestCheckoutModule.submitCheckoutStep();
      await guestCheckoutModule.verifyFinalReviewAvailable();
    });

    await test.step('Verify the place-order action is ready for the initial submission', async () => {
      await expect(
        checkoutPage.placeOrderButton(),
        'Place-order action should be visible before the initial guest order submission',
      ).toBeVisible();
      await expect(
        checkoutPage.placeOrderButton(),
        'Place-order action should be enabled before the initial guest order submission',
      ).toBeEnabled();
    });

    await test.step('Attempt duplicate submission while the guest order request is in progress', async () => {
      const placeOrderSubmission = guestCheckoutModule.placeOrder();
      await expect(
        checkoutPage.placeOrderButton(),
        'Place-order control should become disabled while the guest order request is in progress to prevent duplicate submissions',
      ).toBeDisabled();
      await placeOrderSubmission;
    });

    await test.step('Verify only one observable guest order confirmation is produced', async () => {
      await guestCheckoutModule.verifyOrderConfirmation();
      await expect(
        checkoutPage.orderConfirmation(),
        'Guest checkout should show a single confirmation state after duplicate submission is blocked',
      ).toBeVisible();
    });
  });
});
