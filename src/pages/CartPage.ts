import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage — /checkout/en-gb/
 * All locators verified via live DOM inspection on 2026-04-29.
 */
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ────────────────────────────────────────────────────────────

  /** "Proceed to checkout" CTA (strategy: data-testid — verified) */
  checkoutButton = () => this.page.getByTestId('checkout-button');

  /** Product title link in cart line item (strategy: data-testid — verified) */
  productTitleLink = () => this.page.getByTestId('product-list-card-title');

  /** Product card by SKU (strategy: data-testid — verified) */
  productCard = (sku: string) => this.page.getByTestId(`product-list-card-${sku}`);

  /** Quantity input field for a specific SKU (strategy: id — verified) */
  quantityInput = (sku: string) => this.page.locator(`#quantity-counter-${sku}`);

  /** Delivery logistic radio button (strategy: data-testid — verified) */
  deliveryRadio = () => this.page.getByTestId('delivery-logistic-radio');

  /** Pickup logistic radio button (strategy: data-testid — verified) */
  pickupRadio = () => this.page.getByTestId('pickup-logistic-radio');

  /** Remove from cart button (strategy: data-testid — verified) */
  removeFromCartButton = () => this.page.getByTestId('remove-from-cart-button');

  /** General message/error area (strategy: data-testid — verified) */
  messageArea = () => this.page.getByTestId('message-area');

  /** Cart heading (strategy: role+name) */
  cartHeading = () => this.page.getByRole('heading', { name: /shopping cart/i });

  // ── Actions ─────────────────────────────────────────────────────────────

  async clickProceedToCheckout(): Promise<void> {
    await this.checkoutButton().click();
  }

  async getQuantityValue(sku: string): Promise<string> {
    return this.quantityInput(sku).inputValue();
  }

  async isCheckoutButtonEnabled(): Promise<boolean> {
    return this.checkoutButton().isEnabled();
  }
}
