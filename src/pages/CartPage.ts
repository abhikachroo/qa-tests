import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  // Cart page heading (strategy: role+name)
  cartHeading = () => this.page.getByRole('heading', { name: 'Shopping Cart' });

  // Product card by product ID (strategy: data-testid)
  productInCart = (productId: string) =>
    this.page.getByTestId(`product-list-card-${productId}`);

  // Quantity input for a specific product (strategy: id)
  quantityInput = (productId: string) =>
    this.page.locator(`#quantity-counter-${productId}`);

  // Delivery / pickup mode selectors (strategy: data-testid)
  deliveryLogisticRadio = () => this.page.getByTestId('delivery-logistic-radio');
  pickupLogisticRadio   = () => this.page.getByTestId('pickup-logistic-radio');

  // Primary CTA — "Proceed to checkout" (strategy: data-testid)
  proceedToCheckoutBtn = () => this.page.getByTestId('checkout-button');

  // Secondary actions (strategy: data-testid)
  removeFromCartBtn = () => this.page.getByTestId('remove-from-cart-button');
  deleteCartBtn     = () => this.page.getByTestId('delete-cart');
  editCartMenuBtn   = () => this.page.getByTestId('edit-cart-menu-button');

  // Header cart link / badge (strategy: data-testid)
  cartButton = () => this.page.getByTestId('cart-button');

  // Message area for cart-level alerts (strategy: data-testid)
  messageArea = () => this.page.getByTestId('message-area');

  // ── Simple UI actions ────────────────────────────────────────────────────

  async clickProceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutBtn().click();
  }

  async clickRemoveFromCart(): Promise<void> {
    await this.removeFromCartBtn().click();
  }

  async clickDeleteCart(): Promise<void> {
    await this.deleteCartBtn().click();
  }

  async getCartButtonText(): Promise<string> {
    return (await this.cartButton().textContent()) ?? '';
  }
}
