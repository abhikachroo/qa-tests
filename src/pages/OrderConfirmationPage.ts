import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * OrderConfirmationPage — Layer 2: Locators & basic UI actions for the Order Confirmation page.
 *
 * Route: /checkout/tunnel/confirmation/{orderId}
 * All locators verified live against fra-vanilla-preprod.dev.spark.sonepar.com (2026-05-07).
 * Source: LOCATOR_MAP in e2e-add-to-cart-checkout-test-plan artifact.
 *
 * Observed order reference text format: "Your order Ref vanilla-735318349396512768 Copy"
 */
export class OrderConfirmationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Main confirmation elements ─────────────────────────────────────────────

  /** Full confirmation page wrapper (strategy: data-testid) */
  confirmationPage = () => this.page.getByTestId('confirmation-page');

  /** Confirmation container (strategy: data-testid) */
  confirmationContainer = () => this.page.getByTestId('confirmation-container');

  /**
   * "Order confirmed!" heading — h2 element.
   * (strategy: role+text — matches live app exactly)
   */
  confirmationHeading = () => this.page.getByRole('heading', { name: 'Order confirmed!' });

  /**
   * Order reference text element.
   * Live text observed: "Your order Ref vanilla-{numericId} Copy"
   * Assert with: toContainText(/Ref vanilla-\d+/)
   * (strategy: data-testid)
   */
  orderReferenceText = () => this.page.getByTestId('order-confirmation-text');

  /** Email confirmation notice (strategy: data-testid) */
  emailConfirmationNotice = () =>
    this.page.getByTestId('order-confirmation-email-notification');

  // ── Order info column ──────────────────────────────────────────────────────

  /** Order info column section (strategy: data-testid) */
  orderInfoColumn = () => this.page.getByTestId('orderInfo-column');

  /** Purchase Order value echoed back on confirmation (strategy: data-testid) */
  purchaseOrderValue = () => this.page.getByTestId('orderInfo-purchaseOrder-value');

  /** Cart name echoed back on confirmation (strategy: data-testid) */
  cartNameValue = () => this.page.getByTestId('orderInfo-cartName-value');

  /** Created by value (strategy: data-testid) */
  createdByValue = () => this.page.getByTestId('orderInfo-createdBy-value');

  // ── Payment section ────────────────────────────────────────────────────────

  /** Payment heading (strategy: data-testid) */
  paymentHeading = () => this.page.getByTestId('payment-heading');

  // ── CTAs ───────────────────────────────────────────────────────────────────

  /**
   * "Go to Order history" button.
   * (strategy: data-testid)
   */
  goToOrderHistoryButton = () => this.page.getByTestId('go-to-order-history-button');

  // ── Simple UI actions ──────────────────────────────────────────────────────

  async clickGoToOrderHistory(): Promise<void> {
    await this.goToOrderHistoryButton().click();
  }

  async getOrderReferenceText(): Promise<string> {
    return (await this.orderReferenceText().textContent()) ?? '';
  }
}
