import { test, expect } from '@fixtures';
import { config } from '@config/index';

test.describe(`@P2 @Negative @CartRecommendations @Accessibility Personalized Product Recommendations In Cart — ${config.displayName} on ${config.environment}`, () => {
  test('@P2 @Negative @CartRecommendations @Accessibility TC-013: Navigate recommendation quick link and card actions by keyboard', async ({
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

    await test.step('Verify the recommendation quick link is available for keyboard access', async () => {
      await cartRecommendationsModule.verifyQuickLinkVisible();
    });

    await test.step('Activate the recommendation quick link with the keyboard', async () => {
      const quickLink = cartRecommendationsPage.recommendationsQuickLink();

      await quickLink.focus();
      await expect(quickLink, 'Recommendation quick link must receive keyboard focus').toBeFocused();
      await quickLink.press('Enter');
      await expect(
        cartRecommendationsPage.recommendationCards().first(),
        'Recommendation cards must be reachable after keyboard activation of the quick link',
      ).toBeVisible();
    });

    await test.step('Activate the first recommendation card action with the keyboard', async () => {
      const firstCardAction = cartRecommendationsPage.cardAddToCartButton().first();

      await firstCardAction.focus();
      await expect(firstCardAction, 'Recommendation card action must receive keyboard focus').toBeFocused();
      await expect(firstCardAction, 'Recommendation card action must be keyboard operable').toBeEnabled();
      await firstCardAction.press('Enter');
      await expect(page.getByTestId('cart-button'), 'Cart control must remain available after keyboard card action').toBeVisible();
    });
  });
});
