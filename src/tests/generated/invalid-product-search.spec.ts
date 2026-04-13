import { test, expect } from '@fixtures';
import { config } from '@config/index';

/**
 * Feature: Invalid Product ID Search
 * URL:     ${config.baseUrl}/catalog/en-gb/search/<term>
 * Jira:    N/A
 *
 * Verifies that searching for a non-existent product ID shows the correct
 * empty-state heading and sub-text, with no product cards displayed.
 */
test.describe(`@P0 @P1 @P2 @Smoke @Search @InvalidProductSearch Invalid Product ID Search — ${config.displayName} on ${config.environment}`, () => {

  // ─── TC-001 · P0 · Smoke ────────────────────────────────────────────────────
  test('TC-001: Invalid product ID search navigates to no-results page', async ({
    searchModule,
    searchPage,
  }) => {
    await test.step('Navigate directly to search results for an invalid product ID', async () => {
      await searchModule.navigateToInvalidProductSearch('ffsddfds');
    });

    await test.step('Verify the page URL contains the searched term', async () => {
      await expect(searchPage['page']).toHaveURL(/\/catalog\/en-gb\/search\/ffsddfds/);
    });

    await test.step('Verify the no-results H1 heading is visible', async () => {
      await expect(searchPage.noResultsHeading()).toBeVisible();
    });
  });

  // ─── TC-002 · P1 · Functional ───────────────────────────────────────────────
  test('TC-002: No-results heading shows the exact searched invalid product ID', async ({
    searchModule,
  }) => {
    await test.step('Navigate to search results for invalid product ID "ffsddfds"', async () => {
      await searchModule.navigateToInvalidProductSearch('ffsddfds');
    });

    await test.step('Verify the H1 heading contains "Sorry, no result for" and the term "ffsddfds"', async () => {
      await searchModule.verifyNoResultsForTerm('ffsddfds');
    });

    await test.step('Verify no product cards are rendered', async () => {
      await searchModule.verifyZeroProductCards();
    });
  });

  // ─── TC-003 · P1 · Functional ───────────────────────────────────────────────
  test('TC-003: No-results page displays the explanatory sub-text paragraph', async ({
    searchModule,
  }) => {
    await test.step('Navigate to search results for invalid product ID "ffsddfds"', async () => {
      await searchModule.navigateToInvalidProductSearch('ffsddfds');
    });

    await test.step('Verify the H1 no-results heading is present', async () => {
      await searchModule.verifyNoResultsForTerm('ffsddfds');
    });

    await test.step('Verify the sub-text paragraph is visible and contains the expected copy', async () => {
      await searchModule.verifyNoResultsSubText();
    });
  });

  // ─── TC-004 · P2 · Negative ─────────────────────────────────────────────────
  test('TC-004: Search with special characters as product ID shows no-results state', async ({
    searchModule,
  }) => {
    const specialCharsId = '!@#$%^&*()';

    await test.step('Navigate to search results using special characters as product ID', async () => {
      await searchModule.navigateToInvalidProductSearch(specialCharsId);
    });

    await test.step('Verify the no-results heading is displayed', async () => {
      await expect(searchModule['searchPage'].noResultsHeading()).toBeVisible();
      await expect(searchModule['searchPage'].noResultsHeading()).toContainText('Sorry, no result for');
    });

    await test.step('Verify no product cards are rendered', async () => {
      await searchModule.verifyZeroProductCards();
    });
  });

  // ─── TC-005 · P2 · Edge Case ────────────────────────────────────────────────
  test('TC-005: Search with a very long invalid product ID string shows no-results state', async ({
    searchModule,
  }) => {
    // 80-character random-looking string — no DataGenerator.randomString needed
    // as the exact length is intentional for the edge case
    const longInvalidId = 'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcde';

    await test.step('Navigate to search results using a very long invalid product ID', async () => {
      await searchModule.navigateToInvalidProductSearch(longInvalidId);
    });

    await test.step('Verify the no-results heading is displayed', async () => {
      await expect(searchModule['searchPage'].noResultsHeading()).toBeVisible();
      await expect(searchModule['searchPage'].noResultsHeading()).toContainText('Sorry, no result for');
    });

    await test.step('Verify the sub-text paragraph is visible', async () => {
      await searchModule.verifyNoResultsSubText();
    });

    await test.step('Verify no product cards are rendered', async () => {
      await searchModule.verifyZeroProductCards();
    });
  });

});
