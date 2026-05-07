import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // "1 product" / "N products" count summary visible on results page
  productCountSummary = () => this.page.getByText(/\d+\s+product/i);

  // Product count by data-testid (strategy: data-testid — verified live)
  productListCount = () => this.page.getByTestId('product-list-count');

  // Product card identified by containing the searched product ID text
  productCard = (productId: string) =>
    this.page.locator('[data-testid="product-card"]').filter({ hasText: productId }).first();

  // Fallback: any visible element containing the product ID string
  productIdText = (productId: string) =>
    this.page.getByText(productId, { exact: false }).first();

  // Product card for a specific SKU — SKU is embedded in testid (strategy: data-testid)
  productCardBySku = (sku: string) => this.page.getByTestId(`product-list-card-${sku}`);

  // Cart button with item count badge (strategy: data-testid)
  cartButton = () => this.page.getByTestId('cart-button');

  // Add to cart CTA (strategy: data-testid)
  addToCartButton = () => this.page.getByTestId('quantity-counter-cta-add');

  // Quantity counter input for a specific SKU (strategy: id)
  quantityCounterBySku = (sku: string) => this.page.locator(`#quantity-counter-${sku}`);

  // Product reference / SKU text (strategy: data-testid)
  productReference = () => this.page.getByTestId('productReference');

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton().click();
  }

  async getCartButtonAriaLabel(): Promise<string> {
    return (await this.cartButton().getAttribute('aria-label')) ?? '';
  }
}
