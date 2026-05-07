import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage — Layer 2 Page Object
 *
 * Covers the Cart / Checkout entry page at /checkout/en-gb/
 * All locators sourced from the LOCATOR_MAP extracted via live browser
 * automation on the preprod environment.
 *
 * Route: /checkout/en-gb/
 */
export class CartPage extends BasePage {
  constructor(page: Page) { super(page); }

  // ── Delivery Option Radios ────────────────────────────────────

  // "Delivery" radio option — strategy: data-testid
  deliveryRadio = () => this.page.getByTestId('delivery-logistic-radio');

  // "Pickup" radio option — strategy: data-testid
  pickupRadio = () => this.page.getByTestId('pickup-logistic-radio');

  // ── Action Buttons ────────────────────────────────────────────

  // "Proceed to checkout" primary CTA — strategy: data-testid
  checkoutBtn = () => this.page.getByTestId('checkout-button');

  // "Ask for a quote" alternative action — strategy: data-testid
  quoteBtn = () => this.page.getByTestId('cart-to-quote-button');

  // Change delivery address — strategy: data-testid
  changeDeliveryAddressBtn = () => this.page.getByTestId('logistic-details-change-address');

  // Change pickup branch — strategy: data-testid
  changePickupBranchBtn = () => this.page.getByTestId('logistic-details-change-branch');

  // Use coupon code — strategy: data-testid
  couponBtn = () => this.page.getByTestId('use-coupon-button');

  // Empty-cart state CTA — strategy: data-testid
  exploreCategoriesBtn = () => this.page.getByTestId('messageboard-proceed-button');

  // ── Message / Error Areas ─────────────────────────────────────

  // Cart-level message container — strategy: data-testid
  messageArea = () => this.page.getByTestId('message-area');

  // Cart message board (empty state / errors) — strategy: data-testid
  messageBoard = () => this.page.getByTestId('message-board');

  // ── Simple UI Actions ─────────────────────────────────────────

  /** Navigate to the cart page */
  async navigateToCart(): Promise<void> {
    await this.navigate('/checkout/en-gb/');
    await this.waitForPageLoad();
  }

  /** Select the delivery option radio */
  async selectDeliveryOption(): Promise<void> {
    await this.deliveryRadio().check();
  }

  /** Select the pickup option radio */
  async selectPickupOption(): Promise<void> {
    await this.pickupRadio().check();
  }

  /** Click "Proceed to checkout" */
  async clickProceedToCheckout(): Promise<void> {
    await this.checkoutBtn().click();
  }

  /** Wait for the browser to navigate away from the cart page to a checkout step */
  async waitForCheckoutNavigation(): Promise<void> {
    await this.page.waitForURL(/\/checkout\/en-gb\/(?!$)/, { timeout: 30_000 });
  }

  /** Wait for an order confirmation URL (pattern confirmed once first order is placed) */
  async waitForOrderConfirmation(): Promise<void> {
    // TODO: update URL regex once a real order is placed and confirmation URL is confirmed
    await this.page.waitForURL(/\/checkout\/en-gb\//, { timeout: 60_000 });
  }
}
