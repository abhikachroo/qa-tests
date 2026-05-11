import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productCountSummary = (): Locator => this.page.getByText(/\d+\s+product/i);
  productCard = (productId: string): Locator =>
    this.page.getByTestId('product-list-card-container').filter({ hasText: productId }).first();
  productTitleLink = (productId: string): Locator => this.productCard(productId).getByTestId('product-list-card-title');
  productIdReference = (productId: string): Locator => this.page.getByLabel(`Copy productId ${productId}`);
  productAddToCartButton = (productId: string): Locator =>
    this.productCard(productId).getByRole('button', { name: 'Add to cart' });
  priceError = (productId: string): Locator => this.page.getByTestId(`price-error-${productId}`);
  cartButton = (): Locator => this.page.getByTestId('cart-button');

  productIdText = (productId: string): Locator => this.page.getByText(productId, { exact: false }).first();

  async clickProductTitle(productId: string): Promise<void> {
    await this.productTitleLink(productId).click();
  }
}
