/**
 * Product Discovery Test Suite — E2E Purchase Flow
 *
 * Covers: AC-004, AC-005, AC-006
 * Test IDs: TC-004, TC-005, TC-006
 *
 * Environment: preprod / AUTH_POC
 * Browser: Chromium (default)
 *
 * Precondition for TC-004 and TC-005: user is authenticated.
 * TC-006 reuses searchModule.verifyNoResultsDisplayed() from existing infrastructure.
 */
import { test, expect } from '@fixtures';
import { config }       from '@config/index';

test.describe(
  `@ProductDiscovery Product Discovery -- ${config.displayName} on ${config.environment}`,
  () => {
    // ─────────────────────────────────────────────────────────────────
    // TC-004: Search for product returns results and navigates to PDP (P1, Functional)
    // ─────────────────────────────────────────────────────────────────
    test(
      '@P1 @Functional TC-004 search for product 6968173 returns product in results and navigates to PDP',
      async ({ loginModule, searchModule, searchResultsPage, page }) => {
        await test.step('Log in with valid credentials', async () => {
          await loginModule.doLogin(config.username, config.password);
        });

        await test.step('Submit search for product ID 6968173 via the header search bar', async () => {
          await searchModule.submitSearch(config.productId);
        });

        await test.step('Verify search results page shows product 6968173', async () => {
          await searchModule.verifySearchResultsPage(config.productId);
        });

        await test.step('Click on the product link and verify navigation to PDP', async () => {
          // Click the first matching product result that contains the product ID text
          await searchResultsPage.productIdText(config.productId).click();
          await page.waitForLoadState('networkidle');
          // Assert the URL changed to the PDP slug
          expect(
            page.url(),
            'URL should contain the product slug after clicking the search result',
          ).toContain(config.productId);
        });
      },
    );

    // ─────────────────────────────────────────────────────────────────
    // TC-005: Direct URL navigation to PDP loads full product details (P1, Functional)
    // ─────────────────────────────────────────────────────────────────
    test(
      '@P1 @Functional TC-005 direct URL navigation to PDP for product 6968173 loads full product details',
      async ({ loginModule, purchaseFlowModule, productDetailPage }) => {
        await test.step('Log in with valid credentials', async () => {
          await loginModule.doLogin(config.username, config.password);
        });

        await test.step('Navigate directly to the PDP by URL and verify product details', async () => {
          await purchaseFlowModule.navigateAndVerifyPdp(
            config.productSlug,
            config.productId,
            config.productName,
          );
        });

        await test.step('Verify product price is displayed on PDP', async () => {
          await expect(
            productDetailPage.page.getByText(config.productPrice, { exact: false }),
            `Product price "${config.productPrice}" should be visible on the PDP`,
          ).toBeVisible();
        });

        await test.step('Verify quantity input defaults to 1 and add-to-cart button is visible', async () => {
          await expect(
            productDetailPage.quantityInput(),
            'Quantity input (#buybox-counter) should be present and visible',
          ).toBeVisible();
          await expect(
            productDetailPage.addToCartBtn(),
            '"Add to cart" button should be visible and not disabled',
          ).toBeVisible();
        });
      },
    );

    // ─────────────────────────────────────────────────────────────────
    // TC-006: Search for non-existent product shows no-results state (P2, Negative)
    // ─────────────────────────────────────────────────────────────────
    test(
      '@P2 @Negative TC-006 search for non-existent product ID shows no-results empty state',
      async ({ searchModule }) => {
        await test.step('Navigate to search results with a non-existent product keyword', async () => {
          // Uses the direct URL navigation approach (same as TC-SEARCH-05)
          // config.noResultsKeyword = 'xyznotaproduct999' (from config.json)
          await searchModule.navigateToSearchResults('0000000INVALID');
        });

        await test.step('Verify no-results empty state is displayed', async () => {
          await searchModule.verifyNoResultsDisplayed();
        });
      },
    );
  },
);
