import { expect } from '@playwright/test';
import { HeaderSearchPage } from '@pages/HeaderSearchPage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { ProductDetailPage } from '@pages/ProductDetailPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class ProductSearchAddToCartModule {
  private logger: Logger;

  constructor(
    private headerSearchPage: HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
    private productDetailPage: ProductDetailPage,
  ) {
    this.logger = new Logger('ProductSearchAddToCartModule');
  }

  async verifyGuestHeaderState(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Verifying guest storefront header state`);
    await expect(this.headerSearchPage.loginButton(), 'Guest login link should be visible').toBeVisible();
    await expect(this.headerSearchPage.cartButton(), 'Guest cart control should be visible').toBeVisible();
  }

  async verifySearchResultAddToCartDisabled(productId: string): Promise<void> {
    this.logger.info(`Verifying disabled Add to Cart on search result for product ${productId}`);
    await expect(this.searchResultsPage.productList(), 'Product list should be visible').toBeVisible();
    await expect(this.searchResultsPage.productCard(productId), `Product card ${productId} should be visible`).toBeVisible();
    await expect(this.searchResultsPage.productIdCopyControl(productId), `Product ID ${productId} should be visible`).toBeVisible();
    await expect(this.searchResultsPage.productTitleLink(productId), 'Product title should be visible').toBeVisible();
    await expect(this.searchResultsPage.resultAddToCartButton(productId), 'Search result Add to Cart should be visible').toBeVisible();
    await expect(this.searchResultsPage.resultAddToCartButton(productId), 'Search result Add to Cart should be disabled').toBeDisabled();
  }

  async openProductDetailFromResults(productId: string): Promise<void> {
    this.logger.info(`Opening product detail page for product ${productId}`);
    await this.searchResultsPage.openProductResult(productId);
    await this.productDetailPage.waitForProductDetail(productId);
    await this.productDetailPage.waitForPageLoad();
  }

  async verifyProductDetailAddToCartDisabled(productId: string, expectedPriceMessage: string): Promise<void> {
    this.logger.info(`Verifying disabled Add to Cart in BuyBox for product ${productId}`);
    await expect(this.productDetailPage.productIdChip(), `PDP product ID should contain ${productId}`).toContainText(productId);
    await expect(this.productDetailPage.buyBox(), 'BuyBox should be visible').toBeVisible();
    await expect(this.productDetailPage.priceError(productId), 'Price error should be visible').toContainText(expectedPriceMessage);
    await expect(this.productDetailPage.quantityCounter(productId), 'Quantity counter should be visible').toBeVisible();
    await expect(this.productDetailPage.addToCartButton(), 'PDP Add to Cart should be visible').toBeVisible();
    await expect(this.productDetailPage.addToCartButton(), 'PDP Add to Cart should be disabled').toBeDisabled();
  }

  async verifyDisabledAddToCartCannotMutateCart(productId: string, expectedCartCount: string): Promise<void> {
    this.logger.info(`Verifying disabled Add to Cart cannot mutate cart for product ${productId}`);
    await expect(this.productDetailPage.cartButton(), 'Cart indicator should remain visible').toContainText(expectedCartCount);
    await expect(this.productDetailPage.addToCartButton(), 'PDP Add to Cart should remain disabled').toBeDisabled();
    await expect(this.productDetailPage.cartDrawer(), 'Cart drawer should not open for disabled Add to Cart').not.toBeVisible();
    await expect(this.productDetailPage.successToast(), 'No add-to-cart success toast should appear').not.toBeVisible();
  }

  async verifyEmptySearchSubmissionIsDisabled(productId: string): Promise<void> {
    this.logger.info('Verifying empty search cannot be submitted');
    await this.headerSearchPage.navigate('/');
    await this.headerSearchPage.waitForPageLoad();
    await this.headerSearchPage.dismissCookieBannerIfPresent();
    await this.headerSearchPage.clearSearchInput();
    await expect(this.headerSearchPage.searchInput(), 'Header search input should be empty').toHaveValue('');
    await expect(this.headerSearchPage.submitButton(), 'Submit search should be disabled for empty input').toBeDisabled();
    await this.headerSearchPage.focusSearchInput();
    await this.headerSearchPage.pressEnterInSearchInput();
    await expect(this.searchResultsPage.productCard(productId), `Product card ${productId} should not be shown from empty search`).not.toBeVisible();
  }
}
