import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SearchResultsPage — Layer 2: Locators & basic UI actions for the Search Results page.
 *
 * Route: /catalog/en-gb/search/{keyword}
 *
 * Locators added in checkout E2E pass (2026-05-07):
 *   - productListCard, productListCount, productListCardTitle
 *   - quantityCounter, addToCartButton, cartButton
 * All new locators verified live from LOCATOR_MAP in e2e-add-to-cart-checkout-test-plan artifact.
 */
export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Existing locators (preserved) ─────────────────────────────────────────

  /** "1 product" / "N products" count summary visible on results page */
  productCountSummary = () => this.page.getByText(/\d+\s+product/i);

  /** Product card identified by containing the searched product ID text */
  productCard = (productId: string) =>
    this.page.locator('[data-testid="product-card"]').filter({ hasText: productId }).first();

  /** Fallback: any visible element containing the product ID string */
  productIdText = (productId: string) =>
    this.page.getByText(productId, { exact: false }).first();

  // ── New locators — verified LOCATOR_MAP (checkout E2E, 2026-05-07) ─────────

  /**
   * Product list count summary element — shows "1 product" text.
   * (strategy: data-testid)
   */
  productListCount = () => this.page.getByTestId('product-list-count');

  /**
   * SKU-specific product card — identified by the product ID suffix in its testid.
   * Usage: productListCard('6968173') → getByTestId('product-list-card-6968173')
   * (strategy: data-testid — SKU-scoped)
   */
  productListCard = (productId: string) =>
    this.page.getByTestId(`product-list-card-${productId}`);

  /**
   * Product title/name link inside the search result card.
   * (strategy: data-testid)
   */
  productListCardTitle = () => this.page.getByTestId('product-list-card-title');

  /**
   * Product reference (SKU text) displayed on the card.
   * (strategy: data-testid)
   */
  productReference = () => this.page.getByTestId('productReference');

  /**
   * Quantity counter number input for a specific SKU.
   * Usage: quantityCounter('6968173') → locator('#quantity-counter-6968173')
   * (strategy: id — SKU-scoped)
   */
  quantityCounter = (productId: string) =>
    this.page.locator(`#quantity-counter-${productId}`);

  /**
   * "Add to cart" CTA button (quantity-counter-cta-add).
   * Clicking this increments the cart by the current quantity counter value (default: 1).
   * (strategy: data-testid)
   */
  addToCartButton = () => this.page.getByTestId('quantity-counter-cta-add');

  /**
   * Cart badge/link in the header.
   * aria-label reflects item count: e.g. "Cart {price}, 1 items."
   * Assert cart count with: toHaveAttribute('aria-label', /1 items/)
   * (strategy: data-testid)
   */
  cartButton = () => this.page.getByTestId('cart-button');

  // ── Simple UI actions ──────────────────────────────────────────────────────

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton().click();
  }

  async getCartButtonAriaLabel(): Promise<string> {
    return (await this.cartButton().getAttribute('aria-label')) ?? '';
  }
}
