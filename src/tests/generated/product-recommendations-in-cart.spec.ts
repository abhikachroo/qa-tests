import { test } from '@fixtures';
import { config } from '@config/index';
import { DataGenerator } from '@utils/DataGenerator';

test.describe(`@DFS-67436 @CartRecommendations Product recommendations in cart — ${config.displayName} on ${config.environment}`, () => {
  test.beforeEach(async () => {
    test.info().annotations.push({
      type: 'test-data-run',
      description: `DFS-67436-${DataGenerator.randomString(6)}`,
    });
  });

  test.skip('@P0 @Smoke TC-001: Display recommendations section for authenticated non-empty cart with valid recommendations', async ({
    cartModule,
  }) => {
    await test.step('Open an authenticated non-empty cart with controlled recommendation-present data', async () => {
      await cartModule.openCart();
    });

    await test.step('Verify the recommendation section and card count are visible', async () => {
      await cartModule.verifyRecommendationsPresent();
    });
  });

  test.skip('@P0 @Smoke TC-006: Add recommended product to cart without full page reload and show added state', async ({
    cartModule,
  }) => {
    await test.step('Open an authenticated cart with an addable recommendation product', async () => {
      await cartModule.openCart();
    });

    await test.step('Add the first recommendation and verify added cart state', async () => {
      await cartModule.addFirstRecommendationAndVerifyState();
    });
  });

  test.skip('@P1 @Functional TC-002: Verify recommendation section content, product card details, CMS text, and divider', async ({
    cartModule,
  }) => {
    await test.step('Open an authenticated cart with visible recommendations', async () => {
      await cartModule.openCart();
    });

    await test.step('Verify recommendation CMS content, product details, and divider', async () => {
      await cartModule.verifyRecommendationContent();
    });
  });

  test.skip('@P1 @Functional TC-003: Navigate from cart quick link anchor to recommendations section', async ({
    cartModule,
  }) => {
    await test.step('Open an authenticated cart where the recommendation quick link is visible', async () => {
      await cartModule.openCart();
    });

    await test.step('Use the quick link to navigate to the recommendation section', async () => {
      await cartModule.verifyRecommendationAnchorNavigation();
    });
  });

  test('@P1 @Negative TC-004: Hide recommendations section and cart anchor for an empty cart', async ({
    cartModule,
  }) => {
    await test.step('Open the localized empty cart page', async () => {
      await cartModule.openLocalizedEmptyCart();
    });

    await test.step('Verify empty cart state hides recommendation UI and quick link', async () => {
      await cartModule.verifyEmptyCartWithoutRecommendations();
    });
  });

  test('@P1 @Negative TC-005: Hide recommendations section and cart anchor when recommendation service returns no products', async ({
    cartModule,
  }) => {
    await test.step('Enter authenticated-like PDP state and open the cart', async () => {
      await cartModule.openAuthenticatedProductAndCart();
    });

    await test.step('Verify non-empty cart stays usable without recommendation products', async () => {
      await cartModule.verifyNonEmptyCartWithoutRecommendations();
    });
  });

  test.skip('@P1 @Functional TC-007: Reset recommendation button to add state after removing added recommendation from cart', async ({
    cartModule,
  }) => {
    await test.step('Open an authenticated cart with one recommendation already added', async () => {
      await cartModule.openCart();
    });

    await test.step('Remove the added item and verify the recommendation button resets', async () => {
      await cartModule.removeFirstCartItemAndVerifyRecommendationCanBeAddedAgain();
    });
  });

  test('@P1 @Negative TC-010: Hide recommendations for anonymous cart viewer', async ({
    cartModule,
  }) => {
    await test.step('Open the anonymous localized cart page', async () => {
      await cartModule.openLocalizedEmptyCart();
    });

    await test.step('Verify anonymous cart state hides recommendations and anchor', async () => {
      await cartModule.verifyAnonymousCartWithoutRecommendations();
    });
  });

  test.skip('@P2 @Negative TC-008: Remove recommendations section when cart becomes empty after all products are removed', async ({
    cartModule,
  }) => {
    await test.step('Open an isolated authenticated cart with removable products', async () => {
      await cartModule.openCart();
    });

    await test.step('Remove all cart products and verify recommendations are hidden', async () => {
      await cartModule.removeAllCartItemsAndVerifyEmptyState();
    });
  });

  test.skip('@P2 @Functional TC-009: Keep recommendation list static while adding a recommended product and changing cart state', async ({
    cartModule,
  }) => {
    await test.step('Open an authenticated cart with at least two visible recommendations', async () => {
      await cartModule.openCart();
    });

    await test.step('Add a recommendation and update cart quantity while verifying static recommendations', async () => {
      await cartModule.verifyRecommendationListStaticAfterCartChanges();
    });
  });
});
