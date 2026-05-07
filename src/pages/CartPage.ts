import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage — Layer 2: Locators & basic UI actions for the Cart review page.
 *
 * Route: /checkout/en-gb/
 * All locators verified live against fra-vanilla-preprod.dev.spark.sonepar.com (2026-05-07).
 * Source: LOCATOR_MAP in e2e-add-to-cart-checkout-test-plan artifact.
 */
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Cart summary elements ──────────────────────────────────────────────────

  /** Cart heading: "Shopping Cart" (strategy: data-testid) */
  cartName = () => this.page.getByTestId('cart-name');

  /** Cart container wrapper (strategy: data-testid) */
  cartContainer = () => this.page.getByTestId('cart-container');

  /** Product count label: "1 product" / "N products" (strategy: data-testid) */
  cartNumberOfProducts = () => this.page.getByTestId('cart-number-of-products');

  /** Product list container (strategy: data-testid) */
  cartItemList = () => this.page.getByTestId('cart-item-list');

  /** Product reference (SKU) displayed in cart row (strategy: data-testid) */
  productReference = () => this.page.getByTestId('productReference');

  /** Product title link inside the cart row (strategy: data-testid) */
  productCardTitle = () => this.page.getByTestId('product-list-card-title');

  // ── Logistics area ─────────────────────────────────────────────────────────

  /** Logistic area container (strategy: data-testid) */
  logisticArea = () => this.page.getByTestId('logistic-area');

  /** Delivery address container in logistic area (strategy: data-testid) */
  deliveryContainer = () => this.page.getByTestId('cart-logistic-details-delivery-container');

  /** Delivery promise chip label (strategy: data-testid) */
  deliveryPromiseLabel = () => this.page.getByTestId('delivery-promise-label');

  // ── CTAs ───────────────────────────────────────────────────────────────────

  /**
   * "Proceed to checkout" CTA button.
   *
   * NOTE: The data-testid 'checkout-button' is reused across all 3 tunnel steps.
   * This locator is disambiguated by filtering on the button text to prevent
   * false matches if multiple instances are rendered.
   * (strategy: data-testid + text filter)
   */
  proceedToCheckoutButton = () =>
    this.page.getByTestId('checkout-button').filter({ hasText: /proceed to checkout/i });

  /**
   * "Remove from cart" button — used in test cleanup (beforeEach).
   * Returns ALL instances when multiple items are in the cart.
   * (strategy: data-testid)
   */
  removeFromCartButton = () => this.page.getByTestId('remove-from-cart-button');

  /** Change delivery address link (strategy: data-testid) */
  changeDeliveryAddressLink = () =>
    this.page.getByTestId('logistic-details-change-delivery-address');

  // ── Simple UI actions ──────────────────────────────────────────────────────

  async clickProceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton().click();
  }

  async clickRemoveFromCart(): Promise<void> {
    await this.removeFromCartButton().first().click();
  }

  async getCartProductCount(): Promise<string> {
    return (await this.cartNumberOfProducts().textContent()) ?? '';
  }

  async getProductReferenceText(): Promise<string> {
    return (await this.productReference().textContent()) ?? '';
  }
}
