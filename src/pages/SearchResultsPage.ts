import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // "1 product" / "N products" count summary visible on results page
  productCountSummary = () => this.page.getByText(/\d+\s+product/i);

  // Product card verified by data-testid for product 6968173 and compatible fallback for existing cards.
  productCard = (productId: string) =>
    this.page.getByTestId(`product-list-card-${productId}`).or(
      this.page.locator('[data-testid="product-card"]').filter({ hasText: productId }).first(),
    );

  productTitle = () => this.page.getByTestId('product-list-card-title');

  // Fallback: any visible element containing the product ID string
  productIdText = (productId: string) =>
    this.page.getByText(productId, { exact: false }).first();

  quantitySelector = (productId: string) => this.page.locator(`#quantity-counter-${productId}`); // strategy: id
  addToCartButton = (productId: string) =>
    this.productCard(productId).getByTestId('quantity-counter-cta-add').or(
      this.page.getByTestId('quantity-counter-cta-add').first(),
    );
  incrementButton = (productId: string) =>
    this.productCard(productId).getByLabel('Increment').or(this.page.getByLabel('Increment').first());
  decrementButton = (productId: string) =>
    this.productCard(productId).getByLabel('Decrement').or(this.page.getByLabel('Decrement').first());
  cartButton = () => this.page.getByTestId('cart-button');
  loginButton = () => this.page.getByTestId('login-button');

  async navigateToProductSearch(productId: string): Promise<void> {
    await this.navigate(`/catalog/en-gb/search/${productId}?version=1`);
  }

  async clickProductTitle(): Promise<void> {
    await this.productTitle().first().click();
  }
}
