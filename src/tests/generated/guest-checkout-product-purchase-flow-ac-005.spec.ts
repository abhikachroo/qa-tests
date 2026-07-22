import { test, expect } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';
import type { GuestCheckoutData } from '@modules/GuestCheckoutModule';

const knownProductId = '170720241509';
const minimumStreetNumber = 1;
const maximumStreetNumber = 999;
const minimumPostalCode = 10000;
const maximumPostalCode = 99999;
const minimumPhoneSuffix = 10000000;
const maximumPhoneSuffix = 99999999;

const buildValidGuestCheckoutData = (): GuestCheckoutData => ({
  email: DataGenerator.randomEmail(),
  firstName: `Guest${DataGenerator.randomString(5)}`,
  lastName: `Checkout${DataGenerator.randomString(5)}`,
  phone: `06${DataGenerator.randomInt(minimumPhoneSuffix, maximumPhoneSuffix)}`,
  address: `${DataGenerator.randomInt(minimumStreetNumber, maximumStreetNumber)} Test Safe Avenue`,
  postalCode: `${DataGenerator.randomInt(minimumPostalCode, maximumPostalCode)}`,
  city: `TestCity${DataGenerator.randomString(4)}`,
});

const buildInvalidGuestCheckoutData = (): GuestCheckoutData => ({
  email: DataGenerator.invalidEmailFormat(),
  firstName: '',
  lastName: '',
  phone: DataGenerator.randomString(6),
  address: '',
  postalCode: DataGenerator.randomString(4),
  city: '',
});

test.describe(`@P0 @P1 @GuestCheckout @Checkout Guest checkout form and review readiness — ${config.displayName} on ${config.environment}`, () => {
  test('TC-009 @P0 @GuestCheckout @Checkout @Smoke: Complete guest checkout with valid test-safe data enables final order submission', async ({
    guestCheckoutModule,
    guestCheckoutPage,
  }) => {
    const guestData = buildValidGuestCheckoutData();

    await test.step('Add the known orderable product to the guest cart', async () => {
      await guestCheckoutModule.searchAndAddProduct(knownProductId);
    });

    await test.step('Open the cart and start guest checkout without signing in', async () => {
      await guestCheckoutModule.openCartFromHeader();
      await guestCheckoutModule.startGuestCheckout();
    });

    await test.step('Fill generated guest contact and shipping address details', async () => {
      await guestCheckoutModule.fillGuestContactAndAddress(guestData);
    });

    await test.step('Continue through the available checkout progression toward final review', async () => {
      await guestCheckoutModule.continueCheckout();
    });

    await test.step('Verify the final order submission is enabled while keeping the product in summary', async () => {
      await guestCheckoutModule.verifyFinalSubmitEnabled(knownProductId);
      await expect(
        guestCheckoutPage.finalSubmitButton(),
        'Final submit should be enabled at review, but the test must not click it',
      ).toBeEnabled();
      await expect(
        guestCheckoutPage.productIdText(knownProductId),
        `Final review summary should keep product ${knownProductId}`,
      ).toBeVisible();
    });
  });

  test('TC-010 @P1 @GuestCheckout @Checkout @Negative: Checkout prevents continuation when required guest fields are missing or malformed', async ({
    guestCheckoutModule,
    guestCheckoutPage,
  }) => {
    const invalidGuestData = buildInvalidGuestCheckoutData();

    await test.step('Add the known orderable product to the guest cart', async () => {
      await guestCheckoutModule.searchAndAddProduct(knownProductId);
    });

    await test.step('Open the cart and start guest checkout without signing in', async () => {
      await guestCheckoutModule.openCartFromHeader();
      await guestCheckoutModule.startGuestCheckout();
    });

    await test.step('Fill malformed guest data and leave required fields blank', async () => {
      await guestCheckoutModule.fillGuestContactAndAddress(invalidGuestData);
    });

    await test.step('Attempt to continue checkout with invalid guest form data', async () => {
      await guestCheckoutModule.continueCheckout();
    });

    await test.step('Verify checkout validation blocks final order submission', async () => {
      await guestCheckoutModule.verifyCheckoutValidationVisible();
      await expect(
        guestCheckoutPage.finalSubmitButton(),
        'Final submit should not be available while required guest checkout fields are invalid',
      ).not.toBeVisible();
    });

    await test.step('Verify malformed values remain available for guest correction', async () => {
      await expect(
        guestCheckoutPage.guestEmailInput(),
        'Invalid email value should remain visible for correction',
      ).toHaveValue(invalidGuestData.email);
      await expect(
        guestCheckoutPage.phoneInput(),
        'Invalid phone value should remain visible for correction',
      ).toHaveValue(invalidGuestData.phone);
      await expect(
        guestCheckoutPage.postalCodeInput(),
        'Invalid postal code value should remain visible for correction',
      ).toHaveValue(invalidGuestData.postalCode);
    });
  });
});
