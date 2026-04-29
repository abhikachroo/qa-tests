import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SearchResultsPage — /catalog/en-gb/search/{keyword}
 * Extended with add-to-cart locators for the E2E order flow.
 */
export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Existing locators (preserved) ───────────────────────────────────────

  /** "1 product" / "N products" count summary visible on results page */
  productCountSummary = () => this.page.getByText(/\d+\s+product/i);

  /** Product card identified by containing the searched product ID text */
  productCard = (productId: string) =>
    this.page.locator('[data-testid="product-card"]').filter({ hasText: productId }).first();

  /** Fallback: any visible element containing the product ID string */
  productIdText = (productId: string) =>
    this.page.getByText(productId, { exact: false }).first();

  // ── New locators for E2E order flow (verified via live DOM inspection 2026-04-29) ──

  /** Product card link by SKU — data-testid="product-list-card-{sku}" (strategy: data-testid — verified) */
  productCardBySku = (sku: string) => this.page.getByTestId(`product-list-card-${sku}`);

  /** Product title link — data-testid="product-list-card-title" (strategy: data-testid — verified) */
  productTitleLink = () => this.page.getByTestId('product-list-card-title');

  /** "Add to cart" button — data-testid="quantity-counter-cta-add" (strategy: data-testid — verified) */
  addToCartButton = () => this.page.getByTestId('quantity-counter-cta-add');

  /** Quantity input for a specific SKU — id="quantity-counter-{sku}" (strategy: id — verified) */
  quantityInputBySku = (sku: string) => this.page.locator(`#quantity-counter-${sku}`);

  /** Cart header button / badge — data-testid="cart-button" (strategy: data-testid — verified) */
  cartHeaderButton = () => this.page.getByTestId('cart-button');

  /** Step message / error for a specific SKU (strategy: data-testid — verified) */
  stepMessage = (sku: string) => this.page.getByTestId(`stepMessage-${sku}`);

  // ── Actions ─────────────────────────────────────────────────────────────

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton().click();
  }

  async clickCartHeaderButton(): Promise<void> {
    await this.cartHeaderButton().click();
  }

  async waitForSearchResults(sku: string): Promise<void> {
    await this.page.waitForURL(`**/search/${sku}**`, { timeout: 30_000 });
    await this.waitForPageLoad();
  }
}
