import { test, expect } from '@fixtures';
import { config } from '@config/index';

const PRODUCT_ID = '170720241509';
const ASYNC_FEEDBACK_DELAY_MS = 1_500;

test.describe(`@P2 @ProductSearchAndAddToCart Product search and add to cart loading states — ${config.displayName} on ${config.environment}`, () => {
  test('@P2 @Functional TC-007: Display loading feedback during search and add-to-cart operations', async ({
    page,
    searchModule,
    headerSearchPage,
    searchResultsPage,
    productCartModule,
  }) => {
    await test.step('Throttle search and cart requests for observable async feedback', async () => {
      await page.route(`**/search/${PRODUCT_ID}**`, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, ASYNC_FEEDBACK_DELAY_MS));
        await route.continue();
      });

      await page.route(/.*(cart|basket|panier).*/i, async (route) => {
        await new Promise((resolve) => setTimeout(resolve, ASYNC_FEEDBACK_DELAY_MS));
        await route.continue();
      });
    });

    await test.step('Trigger product search and verify pending search feedback appears', async () => {
      const searchPromise = searchModule.submitSearch(PRODUCT_ID);

      await expect(
        headerSearchPage.searchLoadingIndicator(),
        'Search should expose a status or progress indicator while results load',
      ).toBeVisible();

      await searchPromise;
    });

    await test.step('Verify search results are available for the requested product', async () => {
      await expect(
        searchResultsPage.productCard(PRODUCT_ID),
        `Product card for ${PRODUCT_ID} should be visible after search completes`,
      ).toBeVisible();
    });

    await test.step('Open the matching product and verify add-to-cart is actionable', async () => {
      await productCartModule.openMatchingProduct(PRODUCT_ID);
      await expect(
        searchResultsPage.addToCartButton(),
        'Add-to-cart button should be available before submitting the add request',
      ).toBeEnabled();
    });

    await test.step('Add the product to cart and verify pending add-to-cart feedback appears', async () => {
      const addToCartPromise = productCartModule.addCurrentProductToCart();

      await expect(
        searchResultsPage.addToCartPendingIndicator(),
        'Add-to-cart should expose a status or progress indicator while the cart update is pending',
      ).toBeVisible();

      await addToCartPromise;
    });

    await test.step('Open cart and verify final success state contains the product', async () => {
      await productCartModule.openCart();
      await productCartModule.verifyProductInCart(PRODUCT_ID);
    });
  });

  test('@P2 @Functional TC-008: Open cart with no items and show empty-cart state', async ({
    page,
    headerSearchPage,
    productCartPage,
    productCartModule,
  }) => {
    await test.step('Start with an isolated empty browser storage state', async () => {
      await page.context().clearCookies();
      await headerSearchPage.navigate('/');
      await page.evaluate(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
      });
      await headerSearchPage.navigate('/');
      await headerSearchPage.waitForPageLoad();
      await headerSearchPage.dismissCookieBannerIfPresent();
    });

    await test.step('Open the shopping cart from the header', async () => {
      await expect(
        headerSearchPage.cartButton(),
        'Header cart button should be visible before opening the cart',
      ).toBeVisible();
      await productCartModule.openCart();
    });

    await test.step('Verify the empty-cart summary is shown without errors', async () => {
      await expect(
        productCartPage.cartSummary(),
        'Cart heading or summary should be visible after the cart loads',
      ).toBeVisible();
      await productCartModule.verifyEmptyCartState(PRODUCT_ID);
      await productCartModule.verifyProductNotInCart(PRODUCT_ID);
    });
  });
});
