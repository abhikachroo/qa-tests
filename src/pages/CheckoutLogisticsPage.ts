import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutLogisticsPage — Layer 2: Locators & basic UI actions for Checkout Step 1/2.
 *
 * Route: /checkout/en-gb/tunnel/{cartId}/logistics
 * All locators verified live against fra-vanilla-preprod.dev.spark.sonepar.com (2026-05-07).
 * Source: LOCATOR_MAP in e2e-add-to-cart-checkout-test-plan artifact.
 */
export class CheckoutLogisticsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Step navigation indicator ──────────────────────────────────────────────

  /**
   * Tunnel stepper showing "1/2 - Logistics" progress.
   * (strategy: data-testid)
   */
  stepIndicator = () => this.page.getByTestId('cart-tunnel-stepper');

  // ── Page content ───────────────────────────────────────────────────────────

  /** Logistics container wrapper (strategy: data-testid) */
  logisticsContainer = () => this.page.getByTestId('logistics-container');

  /** Page title element: shows "Delivery" (strategy: data-testid) */
  logisticsPageTitle = () => this.page.getByTestId('logistics_page_title');

  /** Delivery address box card (strategy: data-testid) */
  deliveryAddressBox = () => this.page.getByTestId('delivery-address-box');

  /** Delivery promise label for the first shipping group (strategy: data-testid) */
  deliveryPromiseLabel = () =>
    this.page.getByTestId('shipping-intent-group-0-delivery-promise');

  /** Standard delivery description row (strategy: data-testid) */
  standardDeliveryDescription = () =>
    this.page.getByTestId('Standard delivery-description');

  /** Order summary / pricing container (strategy: data-testid) */
  orderCheckoutContainer = () => this.page.getByTestId('order-checkout-container');

  // ── CTAs ───────────────────────────────────────────────────────────────────

  /**
   * "Continue to verification" CTA.
   *
   * NOTE: 'checkout-button' data-testid is shared across all tunnel steps.
   * Disambiguated by filtering on button text.
   * (strategy: data-testid + text filter)
   */
  continueToVerificationButton = () =>
    this.page.getByTestId('checkout-button').filter({ hasText: /continue to verification/i });

  // ── Simple UI actions ──────────────────────────────────────────────────────

  async clickContinueToVerification(): Promise<void> {
    await this.continueToVerificationButton().click();
  }

  async getStepIndicatorText(): Promise<string> {
    return (await this.stepIndicator().textContent()) ?? '';
  }

  async getLogisticsTitleText(): Promise<string> {
    return (await this.logisticsPageTitle().textContent()) ?? '';
  }
}
