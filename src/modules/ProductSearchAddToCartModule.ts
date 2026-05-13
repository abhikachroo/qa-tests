import { expect, Page } from '@playwright/test';
import { HeaderSearchPage } from '@pages/HeaderSearchPage';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { ProductDetailsPage } from '@pages/ProductDetailsPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class ProductSearchAddToCartModule {
  private logger: Logger;

  constructor(
    private page: Page,
    private headerSearchPage: HeaderSearchPage,
    private searchResultsPage: SearchResultsPage,
    private productDetailsPage: ProductDetailsPage,
  ) {
    this.logger = new Logger('ProductSearchAddToCartModule');
  }

  async openHomepageUnauthenticated(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening homepage as unauthenticated user`);
    await this.headerSearchPage.navigate('/');
    await this.headerSearchPage.waitForPageLoad();
    await this.headerSearchPage.dismissCookieBannerIfPresent();
  }

  async submitProductSearch(productId: string): Promise<void> {
    this.logger.info(`Submitting product search for ${productId}`);
    await this.headerSearchPage.fillSearchInput(productId);
    await this.headerSearchPage.clickSubmitButton();
    await this.headerSearchPage.waitForSearchNavigation(productId);
  }

  async openSearchResultsDirectly(productId: string): Promise<void> {
    this.logger.info(`Opening search results directly for ${productId}`);
    await this.searchResultsPage.navigate(`/catalog/en-gb/search/${productId}?version=1`);
    await this.searchResultsPage.waitForPageLoad();
    await this.searchResultsPage.dismissCookieBannerIfPresent();
  }

  async openProductDetailsFromResults(productId: string): Promise<void> {
    this.logger.info(`Opening product details from search results for ${productId}`);
    await this.searchResultsPage.clickProductTitle();
    await this.page.waitForURL(`**/products/**${productId}`, { timeout: 30_000 });
    await this.productDetailsPage.waitForPageLoad();
  }

  async openProductDetailsDirectly(productId: string): Promise<void> {
    this.logger.info(`Opening product details directly for ${productId}`);
    await this.productDetailsPage.navigate(`/catalog/en-gb/products/lista-schuifladekast-mobiel-27x27e-bxdxh-564x572x723mm-5-lades-ral7035-grijs-${productId}`);
    await this.productDetailsPage.waitForPageLoad();
    await this.productDetailsPage.dismissCookieBannerIfPresent();
  }

  async clearSearchAndPressEnter(): Promise<void> {
    this.logger.info('Clearing header search input and pressing Enter');
    await this.headerSearchPage.clearSearchInput();
    await this.headerSearchPage.pressEnterInSearchInput();
  }

  async verifyHomepageSearchReady(): Promise<void> {
    this.logger.info('Verifying unauthenticated homepage search controls');
    await expect(this.headerSearchPage.searchInput()).toBeVisible();
    await expect(this.headerSearchPage.searchInput()).toBeEnabled();
    await expect(this.headerSearchPage.submitButton()).toBeVisible();
    await expect(this.headerSearchPage.submitButton()).toBeDisabled();
    await expect(this.headerSearchPage.loginLink()).toBeVisible();
    await expect(this.headerSearchPage.signupLink()).toBeVisible();
  }

  async verifySearchResults(productId: string, expectedCountText: string): Promise<void> {
    this.logger.info(`Verifying search results for ${productId}`);
    await expect(this.searchResultsPage.productList()).toBeVisible();
    await expect(this.searchResultsPage.productCountSummary()).toContainText(expectedCountText);
    await expect(this.searchResultsPage.productCard(productId)).toBeVisible();
    await expect(this.searchResultsPage.productIdReference(productId)).toBeVisible();
  }

  async verifyResultsAddToCartDisabled(productId: string): Promise<void> {
    this.logger.info(`Verifying results Add to cart is disabled for ${productId}`);
    await expect(this.searchResultsPage.productCard(productId)).toBeVisible();
    await expect(this.searchResultsPage.quantityInput(productId)).toBeVisible();
    await expect(this.searchResultsPage.addToCartButton()).toBeVisible();
    await expect(this.searchResultsPage.addToCartButton()).toBeDisabled();
    await expect(this.searchResultsPage.cartButton()).toContainText('0');
  }

  async verifyProductDetails(productId: string, expectedTitleContains: string): Promise<void> {
    this.logger.info(`Verifying product details for ${productId}`);
    await expect(this.productDetailsPage.productTitle()).toContainText(expectedTitleContains);
    await expect(this.productDetailsPage.productIdReference(productId)).toContainText(productId);
    await expect(this.productDetailsPage.priceUnavailableMessage(productId)).toContainText('Unable to display price');
  }

  async verifyDetailsAddToCartDisabled(): Promise<void> {
    this.logger.info('Verifying details Add to cart and quantity controls are disabled');
    await expect(this.productDetailsPage.quantityInput()).toBeVisible();
    await expect(this.productDetailsPage.addToCartButton()).toBeVisible();
    await expect(this.productDetailsPage.addToCartButton()).toBeDisabled();
    await expect(this.productDetailsPage.decrementButton()).toBeDisabled();
    await expect(this.productDetailsPage.incrementButton()).toBeDisabled();
    await expect(this.productDetailsPage.cartButton()).toContainText('0');
  }

  async verifySearchInputRemainsEmpty(): Promise<void> {
    this.logger.info('Verifying empty search input does not navigate to search results');
    await expect(this.headerSearchPage.searchInput()).toHaveValue('');
    await expect(this.headerSearchPage.submitButton()).toBeDisabled();
    await expect(this.page).not.toHaveURL(/\/catalog\/en-gb\/search\//);
  }

  async verifyNoLoginRedirectAfterSearch(productId: string): Promise<void> {
    this.logger.info(`Verifying search does not redirect to login for ${productId}`);
    await expect(this.page).toHaveURL(new RegExp(`/catalog/en-gb/search/${productId}`));
    await expect(this.page).not.toHaveURL(/\/login/);
    await expect(this.searchResultsPage.productList()).toBeVisible();
  }
}
