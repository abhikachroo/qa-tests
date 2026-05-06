import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage — Layer 2: Locators & basic UI actions
 *
 * Covers the shopping cart page at /checkout/en-gb/
 * All locators verified via live app browsing.
 */
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ────────────────────────────────────────────────────────────────

  /** Quantity counter for a specific SKU — strategy: id (verified live) */
  quantityCounter = (sku: string) => this.page.locator(`#quantity-counter-${sku}`);

  /** Delivery logistic radio — strategy: data-testid (verified live) */
  deliveryLogisticRadio = () => this.page.getByTestId('delivery-logistic-radio');

  /** Pickup logistic radio — strategy: data-testid */
  pickupLogisticRadio = () => this.page.getByTestId('pickup-logistic-radio');

  /** Proceed to checkout CTA — strategy: data-testid (verified live) */
  checkoutBtn = () => this.page.getByTestId('checkout-button');

  /** Remove from cart button — strategy: data-testid */
  removeFromCartBtn = () => this.page.getByTestId('remove-from-cart-button');

  /** Edit cart menu button — strategy: data-testid */
  editCartMenuBtn = () => this.page.getByTestId('edit-cart-menu-button');

  // ── Simple UI actions ────────────────────────────────────────────────────────

  async clickCheckoutButton(): Promise<void> {
    await this.checkoutBtn().click();
  }

  async waitForLogisticsUrl(): Promise<void> {
    await this.page.waitForURL('**/tunnel/**/logistics', { timeout: 30_000 });
  }
}
