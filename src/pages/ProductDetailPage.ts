import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductDetailPage — Layer 2: Locators & basic UI actions
 *
 * Covers the Product Detail Page (PDP) for any product.
 * All locators verified via live app browsing (data-testid strategy where available).
 * SKU-specific locators accept the product ID as a parameter.
 */
export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ────────────────────────────────────────────────────────────────

  /** Product heading (H1) — strategy: role */
  productHeading = () => this.page.getByRole('heading', { level: 1 });

  /** Buybox quantity input — strategy: id (verified live) */
  quantityInput = () => this.page.locator('#buybox-counter');

  /** Add to cart CTA — strategy: data-testid (verified live) */
  addToCartBtn = () => this.page.getByTestId('quantity-counter-cta-add');

  /** Cart button in header (for badge/counter checking) — strategy: data-testid */
  cartHeaderBtn = () => this.page.getByTestId('cart-button');

  /** Decrement quantity button — strategy: aria-label */
  decrementBtn = () => this.page.getByLabel('Decrement');

  /** Increment quantity button — strategy: aria-label */
  incrementBtn = () => this.page.getByLabel('Increment');

  /** Step message / error area per SKU — strategy: data-testid */
  stepMessage = (sku: string) => this.page.getByTestId(`stepMessage-${sku}`);

  /** General message div — strategy: data-testid */
  messageDiv = () => this.page.getByTestId('messageDiv');

  // ── Simple UI actions ────────────────────────────────────────────────────────

  async clickAddToCart(): Promise<void> {
    await this.addToCartBtn().click();
  }

  async getProductHeadingText(): Promise<string> {
    return (await this.productHeading().textContent()) ?? '';
  }

  async getQuantityValue(): Promise<string> {
    return this.quantityInput().inputValue();
  }
}
