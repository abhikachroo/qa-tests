import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';
import { GuestCheckoutData } from '@modules/GuestCheckoutModule';

const knownProductId = '170720241509';
const phoneSuffixMin = 1_000_000;
const phoneSuffixMax = 9_999_999;
const streetNumberMin = 100;
const streetNumberMax = 999;
const postalCodeMin = 10_000;
const postalCodeMax = 99_999;
const orderSubmissionPolicy = {
  finalSubmitApproved: false,
};

function buildCompleteGuestCheckoutData(): GuestCheckoutData {
  return {
    email: DataGenerator.randomEmail(),
    firstName: `Guest${DataGenerator.randomString(6)}`,
    lastName: `Checkout${DataGenerator.randomString(6)}`,
    phone: `555${DataGenerator.randomInt(phoneSuffixMin, phoneSuffixMax)}`,
    address: `${DataGenerator.randomInt(streetNumberMin, streetNumberMax)} ${DataGenerator.randomString(8)} Street`,
    postalCode: `${DataGenerator.randomInt(postalCodeMin, postalCodeMax)}`,
    city: `City${DataGenerator.randomString(5)}`,
  };
}

test.describe(`@GuestCheckout @OrderSubmission Guest checkout final order submission — ${config.displayName} on ${config.environment}`, () => {
  test('TC-011 @P0 @GuestCheckout @OrderSubmission: Submit final order displays verifiable order success state', async ({
    page,
    guestCheckoutModule,
  }) => {
    test.fixme(
      !orderSubmissionPolicy.finalSubmitApproved,
      'AC-006 final order submission policy is unresolved; guarded test intentionally stops before irreversible final submit.',
    );

    const completeGuestCheckoutData = buildCompleteGuestCheckoutData();

    await test.step('Add the known product to the guest cart', async () => {
      await guestCheckoutModule.searchAndAddProduct(knownProductId);
    });

    await test.step('Open the cart and start guest checkout', async () => {
      await guestCheckoutModule.openCartFromHeader();
      await guestCheckoutModule.startGuestCheckout();
    });

    await test.step('Fill complete generated guest contact and address details', async () => {
      await guestCheckoutModule.fillGuestContactAndAddress(completeGuestCheckoutData);
    });

    await test.step('Continue checkout until the final review is available', async () => {
      await guestCheckoutModule.continueCheckout();
      await guestCheckoutModule.continueCheckout();
    });

    await test.step('Verify the final review contains the product and allows final submission', async () => {
      await guestCheckoutModule.verifyFinalSubmitEnabled(knownProductId);
    });

    await test.step('Guard against irreversible order submission while policy remains unresolved', async () => {
      await expect(
        page,
        'The guarded AC-006 test must remain before any confirmation or order-success route until final submit is approved',
      ).not.toHaveURL(/\/(confirmation|order-success|thank-you)(?:[/?#].*)?$/i);
    });
  });

  test('TC-012 @P2 @GuestCheckout @OrderSubmission: Order submission loading state disables duplicate final submission', async ({
    page,
    guestCheckoutModule,
  }) => {
    test.fixme(
      !orderSubmissionPolicy.finalSubmitApproved,
      'Duplicate-submission behavior requires clicking final submit; AC-006 is guarded until test-safe order creation is approved.',
    );

    const completeGuestCheckoutData = buildCompleteGuestCheckoutData();

    await test.step('Add the known product to the guest cart for duplicate-submission validation', async () => {
      await guestCheckoutModule.searchAndAddProduct(knownProductId);
    });

    await test.step('Open the cart and start guest checkout with the selected product', async () => {
      await guestCheckoutModule.openCartFromHeader();
      await guestCheckoutModule.startGuestCheckout();
    });

    await test.step('Fill complete generated guest checkout data', async () => {
      await guestCheckoutModule.fillGuestContactAndAddress(completeGuestCheckoutData);
    });

    await test.step('Continue checkout to the final review step', async () => {
      await guestCheckoutModule.continueCheckout();
      await guestCheckoutModule.continueCheckout();
    });

    await test.step('Verify the order is ready for a guarded final-submit duplicate check', async () => {
      await guestCheckoutModule.verifyFinalSubmitEnabled(knownProductId);
    });

    await test.step('Stop before clicking final submit because duplicate-order policy is not approved', async () => {
      await expect(
        page,
        'The duplicate-submission test must not reach a terminal order state until final submit is test-safe',
      ).not.toHaveURL(/\/(confirmation|order-success|thank-you)(?:[/?#].*)?$/i);
    });
  });
});
