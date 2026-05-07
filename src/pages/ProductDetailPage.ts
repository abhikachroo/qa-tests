import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductDetailPage — Layer 2 Page Object
 *
 * Covers the Product Detail Page (PDP) for a single product.
 * All locators sourced from the LOCATOR_MAP extracted via live browser
 * automation on the preprod environment (product ID 6968173).
 *
 * Route: /catalog/en-gb/products/{slug}-{productId}
 */
export class ProductDetailPage extends BasePage {
  constructor(page: Page) { super(page); }

  // ── Inputs ──────────────────────────────────────────────────

  // Quantity input in the buybox — strategy: id (no data-testid available)
  quantityInput = () => this.page.locator('#buybox-counter');

  // Customer reference text input — strategy: id
  customerRefInput = () => this.page.locator('#customerRefInput');

  // ── Buttons ─────────────────────────────────────────────────

  // Primary "Add to cart" CTA — strategy: data-testid
  addToCartBtn = () => this.page.getByTestId('quantity-counter-cta-add');

  // Increment quantity — strategy: aria-label
  incrementQtyBtn = () => this.page.getByLabel('Increment');

  // Decrement quantity — strategy: aria-label
  decrementQtyBtn = () => this.page.getByLabel('Decrement');

  // Product ID reference badge (copy button) — strategy: data-testid
  productIdBadge = () => this.page.getByTestId('ref-product-productId');

  // Manufacturer ref badge (copy button) — strategy: data-testid
  manufacturerRefBadge = () => this.page.getByTestId('ref-product-manufacturerRefId');

  // ── Status / Feedback ────────────────────────────────────────

  // Step / status message specific to product 6968173 — strategy: data-testid
  stepMessage = () => this.page.getByTestId('stepMessage-6968173');

  // General message area on PDP — strategy: data-testid
  messageDiv = () => this.page.getByTestId('messageDiv');

  // ── Simple UI Actions ────────────────────────────────────────

  /** Navigate directly to the PDP for the given product URL slug */
  async navigateToPdp(slugWithId: string): Promise<void> {
    await this.navigate(`/catalog/en-gb/products/${slugWithId}`);
    await this.waitForPageLoad();
  }

  /** Click the primary "Add to cart" button */
  async clickAddToCart(): Promise<void> {
    await this.addToCartBtn().click();
  }

  /** Read the current quantity value from the buybox counter */
  async getQuantityValue(): Promise<string> {
    return (await this.quantityInput().inputValue()) ?? '1';
  }

  /** Set a specific quantity in the buybox counter */
  async setQuantity(value: string): Promise<void> {
    await this.quantityInput().fill(value);
  }
}
