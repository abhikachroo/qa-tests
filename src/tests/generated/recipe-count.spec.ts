import { test, expect } from '@fixtures';
import { config }       from '@config/index';

/**
 * Recipe Count on Homepage — Test Suite
 *
 * Feature:   Recipe Count on Homepage
 * App:        https://recipe-beta-azure.vercel.app/
 * Module:     HomeModule
 * Page:       HomePage
 *
 * DOM anchor: section#recipes — confirmed id="recipes" on the Recent Recipes
 *             section element at time of test authoring.
 *
 * Scenario coverage:
 *   TC-001  P0 Smoke      — Homepage loads and "Recent Recipes" heading is visible
 *   TC-002  P0 Smoke      — Recent Recipes section displays exactly 6 recipe cards
 *   TC-003  P1 Functional — Each recipe card contains a visible h3 title heading
 *   TC-004  P2 Edge Case  — Recipe count remains exactly 6 after a page reload
 */

const EXPECTED_RECIPE_COUNT = 6;

test.describe(`@P0 @Smoke @RecipeCount Recipe Count on Homepage — ${config.displayName} on ${config.environment}`, () => {

  // ─────────────────────────────────────────────────────────────────────────
  // P0 — Smoke
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * TC-001: Homepage loads and "Recent Recipes" heading is visible
   * Priority:    P0 Smoke
   * AC Reference: Verify the "Recent Recipes" section is present on the homepage
   *
   * Preconditions:
   *   - Application accessible at config.baseUrl
   *   - No authentication required
   *
   * Flow:
   *   1. Navigate to the homepage root path (/)
   *   2. Wait for page to fully load (networkidle)
   *   3. Dismiss cookie consent banner if present
   *   4. Assert the "Recent Recipes" h2 heading is visible
   */
  test('TC-001: Homepage loads and "Recent Recipes" section heading is visible', async ({
    homeModule,
  }) => {
    await test.step('Navigate to the homepage and wait for full page load', async () => {
      await homeModule.navigateToHomepage();
    });

    await test.step('Verify "Recent Recipes" section heading is visible on the homepage', async () => {
      await homeModule.verifyRecentRecipesHeadingVisible();
    });
  });

  /**
   * TC-002: Recent Recipes section displays exactly 6 recipe cards
   * Priority:    P0 Smoke
   * AC Reference: Assert exactly 6 recipes are visible under the "Recent Recipes" section
   *
   * Preconditions:
   *   - Homepage accessible, no auth required
   *
   * Flow:
   *   1. Navigate to the homepage
   *   2. Scroll to the Recent Recipes section (section#recipes)
   *   3. Count the <article> elements within the section
   *   4. Assert count equals exactly 6
   */
  test('TC-002: Recent Recipes section displays exactly 6 recipe cards', async ({
    homeModule,
  }) => {
    await test.step('Navigate to the homepage and wait for full page load', async () => {
      await homeModule.navigateToHomepage();
    });

    await test.step('Scroll to the Recent Recipes section and assert exactly 6 recipe cards are displayed', async () => {
      await homeModule.verifyRecentRecipeCount(EXPECTED_RECIPE_COUNT);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // P1 — Functional
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * TC-003: Each recipe card contains a visible h3 title heading
   * Priority:    P1 Functional
   * AC Reference: Each recipe card must display a title (h3 heading)
   *
   * Flow:
   *   1. Navigate to the homepage
   *   2. Verify all 6 recipe cards each have an h3 heading
   */
  test('@P1 @Regression TC-003: Each recipe card contains a visible h3 title heading', async ({
    homeModule,
  }) => {
    await test.step('Navigate to the homepage and wait for full page load', async () => {
      await homeModule.navigateToHomepage();
    });

    await test.step('Verify all recipe cards have visible h3 title headings (one per card)', async () => {
      await homeModule.verifyAllRecipeCardsHaveTitles(EXPECTED_RECIPE_COUNT);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // P2 — Edge Cases
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * TC-004: Recipe count remains exactly 6 after a page reload
   * Priority:    P2 Edge Case
   * AC Reference: Count should be consistent — no cards lost or duplicated on reload
   *
   * Flow:
   *   1. Navigate to the homepage
   *   2. Verify initial count is 6
   *   3. Reload the page (full browser reload, wait for networkidle)
   *   4. Re-assert count is still exactly 6
   */
  test('@P2 @Regression TC-004: Recipe count remains exactly 6 after a full page reload', async ({
    homeModule,
  }) => {
    await test.step('Navigate to the homepage and verify initial recipe count is 6', async () => {
      await homeModule.navigateToHomepage();
      await homeModule.verifyRecentRecipeCount(EXPECTED_RECIPE_COUNT);
    });

    await test.step('Reload the page and re-verify recipe count is still exactly 6', async () => {
      await homeModule.reloadAndVerifyRecipeCount(EXPECTED_RECIPE_COUNT);
    });
  });

});
