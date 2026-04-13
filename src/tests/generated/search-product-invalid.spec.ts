import { test, expect } from '../../fixtures/search.fixtures';
import { DataGenerator } from '../../utils/DataGenerator';
import { config } from '@config/index';

/**
 * Test Suite: Search Product — Invalid Product ID Error State
 *
 * Feature:  Search Product
 * App URL:  https://fra-vanilla-preprod.dev.spark.sonepar.com
 * Branch:   feat/qe-ai/search-invalid-product-tests
 *
 * Coverage:
 *   TC-001 @P0 @Smoke     — No-results container visible for invalid product ID
 *   TC-002 @P1 @Functional — No-results heading contains the searched keyword
 *   TC-003 @P1 @Functional — No-results description paragraph is visible
 *   TC-004 @P2 @Negative   — Zero product cards rendered when no results found
 */
test.describe(
  `@SearchProduct @P0 Search Product — Invalid ID Error State — ${config.displayName} on ${config.environment}`,
  () => {

    // ─────────────────────────────────────────────────────────────────────────
    // TC-001 · @P0 · Smoke
    // ─────────────────────────────────────────────────────────────────────────
    test(
      'TC-001: Invalid product ID search shows no-results error state',
      async ({ searchProductModule }) => {
        const invalidId = DataGenerator.invalidProductId();

        await test.step('Navigate to search results for an invalid product ID', async () => {
          await searchProductModule.navigateToSearchResults(invalidId);
        });

        await test.step('Verify the no-results error container is visible', async () => {
          await searchProductModule.verifyNoResultsContainerVisible();
        });
      },
    );

    // ─────────────────────────────────────────────────────────────────────────
    // TC-002 · @P1 · Functional
    // ─────────────────────────────────────────────────────────────────────────
    test(
      'TC-002: No-results heading contains the searched keyword',
      async ({ searchProductModule }) => {
        const invalidId = DataGenerator.invalidProductId();

        await test.step('Navigate to search results for an invalid product ID', async () => {
          await searchProductModule.navigateToSearchResults(invalidId);
        });

        await test.step('Verify no-results heading contains the keyword', async () => {
          await searchProductModule.verifyNoResultsHeadingContainsKeyword(invalidId);
        });
      },
    );

    // ─────────────────────────────────────────────────────────────────────────
    // TC-003 · @P1 · Functional
    // ─────────────────────────────────────────────────────────────────────────
    test(
      'TC-003: No-results description paragraph is visible',
      async ({ searchProductModule }) => {
        const invalidId = DataGenerator.invalidProductId();

        await test.step('Navigate to search results for an invalid product ID', async () => {
          await searchProductModule.navigateToSearchResults(invalidId);
        });

        await test.step('Verify the no-results description text is visible', async () => {
          await searchProductModule.verifyNoResultsDescriptionVisible();
        });
      },
    );

    // ─────────────────────────────────────────────────────────────────────────
    // TC-004 · @P2 · Negative
    // ─────────────────────────────────────────────────────────────────────────
    test(
      'TC-004: Zero product cards are rendered for an invalid product ID search',
      async ({ searchProductModule }) => {
        const invalidId = DataGenerator.invalidProductId();

        await test.step('Navigate to search results for an invalid product ID', async () => {
          await searchProductModule.navigateToSearchResults(invalidId);
        });

        await test.step('Verify no product cards are present in the results list', async () => {
          await searchProductModule.verifyZeroProductCards();
        });
      },
    );

  },
);
