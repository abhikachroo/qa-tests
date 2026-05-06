import { Page }     from '@playwright/test';
import { BasePage } from './BasePage';

export class OrderConfirmationPage extends BasePage {
  constructor(page: Page) { super(page); }

  // "Order confirmed!" heading (strategy: role + text)
  confirmationHeading   = () => this.page.getByRole('heading', { name: 'Order confirmed!' });
  // Order reference text block (strategy: data-testid)
  orderReferenceText    = () => this.page.getByTestId('order-confirmation-text');
  // Email notification block (strategy: data-testid)
  emailNotification     = () => this.page.getByTestId('order-confirmation-email-notification');
  // Ordered product line-item link (strategy: data-testid)
  lineItemProductLink   = () => this.page.getByTestId('line-item-product-link');
  // Echoed purchase order value (strategy: data-testid)
  purchaseOrderValue    = () => this.page.getByTestId('orderInfo-purchaseOrder-value');
  // Payment method display (strategy: data-testid)
  paymentMethod         = () => this.page.getByTestId('payment-paymentMethod');
  // Payment price display (strategy: data-testid)
  paymentPrice          = () => this.page.getByTestId('payment-price');
  // Total price incl. VAT (strategy: data-testid)
  totalPriceAllIncluded = () => this.page.getByTestId('total-price-all-included-amount');
  // Go to order history CTA (strategy: data-testid)
  goToOrderHistoryBtn   = () => this.page.getByTestId('go-to-order-history-button');
  // Cart badge (should be 0 after order) (strategy: data-testid)
  cartBadge             = () => this.page.getByTestId('cart-button');
  // Product line-item brand name (strategy: data-testid)
  lineItemBrandName     = () => this.page.getByTestId('line-item-brand-name');
  // Product line-item title (strategy: data-testid)
  lineItemProductTitle  = () => this.page.getByTestId('line-item-product-title');
  // Delivery promise (strategy: data-testid)
  deliveryPromise       = () => this.page.getByTestId('shipping-intent-group-0-delivery-promise');

  // --- Simple UI actions ---

  async getOrderReferenceText(): Promise<string> {
    return (await this.orderReferenceText().textContent()) ?? '';
  }

  async getCartBadgeText(): Promise<string> {
    return (await this.cartBadge().textContent()) ?? '';
  }
}
