import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage — /checkout/en-gb/
 *
 * All locators confirmed live via DOM inspection on 2026-04-29.
 * Strategy: data-testid (priority 1) and id (priority 3).
 */
export class CartPage extends BasePage {
  constructor(page: Page) { super(page); }

  // ── CTAs ──────────────────────────────────────────────────────────
  /** "Proceed to checkout" button — data-testid confirmed live */
  checkoutButton         = () => this.page.getByTestId('checkout-button');

  /** "Ask for a quote" secondary action */
  quoteButton            = () => this.page.getByTestId('cart-to-quote-button');

  /** Remove from cart action */
  removeFromCartButton   = () => this.page.getByTestId('remove-from-cart-button');

  // ── Logistic radios ───────────────────────────────────────────────
  /** Delivery option radio — data-testid confirmed live */
  deliveryRadio          = () => this.page.getByTestId('delivery-logistic-radio');

  /** Pickup option radio — data-testid confirmed live */
  pickupRadio            = () => this.page.getByTestId('pickup-logistic-radio');

  // ── Product card ──────────────────────────────────────────────────
  /** Product card link for a given SKU — data-testid confirmed live */
  productCard            = (sku: string) => this.page.getByTestId(`product-list-card-${sku}`);

  /** Product title link — data-testid confirmed live */
  productTitle           = () => this.page.getByTestId('product-list-card-title');

  /** Quantity input by SKU (id strategy) — confirmed live */
  quantityInput          = (sku: string) => this.page.locator(`#quantity-counter-${sku}`);

  // ── Error / message areas ─────────────────────────────────────────
  /** General message area */
  messageArea            = () => this.page.getByTestId('message-area');

  /** Per-product step message */
  stepMessage            = (sku: string) => this.page.getByTestId(`stepMessage-${sku}`);

  // ── Simple UI actions ─────────────────────────────────────────────

  async clickCheckoutButton(): Promise<void> {
    await this.checkoutButton().click();
  }

  async getQuantityValue(sku: string): Promise<string> {
    return this.quantityInput(sku).inputValue();
  }

  async getProductTitleText(): Promise<string> {
    return (await this.productTitle().textContent()) ?? '';
  }
}
