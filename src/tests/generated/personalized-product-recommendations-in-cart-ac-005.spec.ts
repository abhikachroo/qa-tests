import { test, expect } from '@fixtures';
import { config } from '@config/index';

test.describe(`@P1 @Functional @CartRecommendations Personalized Product Recommendations In Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P1 @Functional @CartRecommendations TC-006: Render product name image price and Add to Cart action on recommendation cards', async ({
    page,
    loginModule,
    cartRecommendationsModule,
  }) => {
    await test.step('Sign in with configured OPCO credentials', async () => {
      await loginModule.doLogin();
    });

    await test.step('Verify the header cart control is available', async () => {
      await expect(page.getByTestId('cart-button')).toBeVisible();
    });

    await test.step('Open the signed-in cart from the header', async () => {
      await cartRecommendationsModule.openCart();
    });

    await test.step('Verify recommendation cards show required product content and add action', async () => {
      await cartRecommendationsModule.verifyRecommendationCardsHaveRequiredContent();
    });
  });

  test('@P2 @Negative @CartRecommendations TC-007: Handle recommendation card with incomplete optional metadata gracefully', async ({
    page,
    loginModule,
    cartRecommendationsModule,
    cartRecommendationsPage,
  }) => {
    await test.step('Sign in with configured OPCO credentials', async () => {
      await loginModule.doLogin();
    });

    await test.step('Verify the header cart control is available', async () => {
      await expect(page.getByTestId('cart-button')).toBeVisible();
    });

    await test.step('Open the signed-in cart from the header', async () => {
      await cartRecommendationsModule.openCart();
    });

    await test.step('Verify recommendations remain visible when optional metadata is incomplete', async () => {
      await cartRecommendationsModule.verifyRecommendationsVisible();
    });

    await test.step('Verify the first recommendation card still exposes actionable required metadata', async () => {
      const firstCard = cartRecommendationsPage.recommendationCards().first();
      await expect(cartRecommendationsPage.cardImage(firstCard)).toBeVisible();
      await expect(cartRecommendationsPage.cardPrice(firstCard)).toBeVisible();
      await expect(cartRecommendationsPage.cardAddToCartButton(firstCard)).toBeEnabled();
    });
  });
});
