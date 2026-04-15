import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage — Layer 2
 * Locators and simple UI actions for the Cart / Basket page.
 * URL pattern: /checkout/en-gb/
 *
 * Observed via live app browsing (preprod):
 * - "Checkout as guest" button lives in a "Get delivered" section
 * - Button is disabled when cart is empty
 */
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ────────────────────────────────────────────────────────────────

  /** "Checkout as guest" button in the "Get delivered" section */
  // TODO: verify selector — confirmed present on /checkout/en-gb/ during app browsing
  checkoutAsGuestBtn = () =>
    this.page.getByRole('button', { name: /checkout as guest/i }).or(
      this.page.getByRole('link', { name: /checkout as guest/i }),
    );

  /** Cart line item rows */
  // TODO: verify selector
  cartItems = () =>
    this.page.locator('[data-testid="cart-item"], [class*="cart-item"], [class*="basket-item"]');

  /** Product name in the first cart line item */
  // TODO: verify selector
  firstCartItemName = () =>
    this.cartItems().first().locator('[data-testid="product-name"], [class*="product-name"]');

  /** Quantity shown for the first cart line item */
  // TODO: verify selector
  firstCartItemQty = () =>
    this.cartItems().first().locator('[data-testid="quantity"], [class*="quantity"]');

  /** Cart total price element */
  // TODO: verify selector
  cartTotal = () =>
    this.page.locator('[data-testid="cart-total"], [class*="cart-total"], [class*="order-total"]').first();

  /** Empty cart message */
  // TODO: verify selector
  emptyCartMessage = () =>
    this.page.getByText(/your (cart|basket) is empty/i).or(
      this.page.getByText(/no items/i),
    );

  // ── Actions ─────────────────────────────────────────────────────────────────

  async navigateToCart(cartPath: string): Promise<void> {
    await this.navigate(cartPath);
  }

  async getCartItemCount(): Promise<number> {
    return this.cartItems().count();
  }

  async getFirstItemName(): Promise<string> {
    return (await this.firstCartItemName().textContent()) ?? '';
  }

  async isCheckoutAsGuestEnabled(): Promise<boolean> {
    return this.checkoutAsGuestBtn().isEnabled();
  }

  async clickCheckoutAsGuest(): Promise<void> {
    await this.checkoutAsGuestBtn().click();
  }
}
