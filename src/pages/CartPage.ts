import { Page }     from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Product card for a given SKU (strategy: data-testid)
  productCard        = (sku: string) => this.page.getByTestId(`product-list-card-${sku}`);
  // Product title link inside the cart (strategy: data-testid)
  productCardTitle   = () => this.page.getByTestId('product-list-card-title');
  // Proceed to checkout CTA (strategy: data-testid)
  checkoutButton     = () => this.page.getByTestId('checkout-button');
  // Remove item from cart (strategy: data-testid)
  removeFromCartBtn  = () => this.page.getByTestId('remove-from-cart-button');
  // Header cart badge / nav link (strategy: data-testid)
  cartBadge          = () => this.page.getByTestId('cart-button');
  // Delivery logistic radio (strategy: data-testid)
  deliveryRadio      = () => this.page.getByTestId('delivery-logistic-radio');
  // Pickup logistic radio (strategy: data-testid)
  pickupRadio        = () => this.page.getByTestId('pickup-logistic-radio');
  // Per-SKU quantity counter input (strategy: id)
  quantityCounter    = (sku: string) => this.page.locator(`#quantity-counter-${sku}`);
  // General message area (strategy: data-testid)
  messageArea        = () => this.page.getByTestId('message-area');

  // --- Simple UI actions ---

  async clickCheckoutButton(): Promise<void> {
    await this.checkoutButton().click();
  }

  async clickRemoveFromCart(): Promise<void> {
    await this.removeFromCartBtn().click();
  }

  async getCartBadgeText(): Promise<string> {
    return (await this.cartBadge().textContent()) ?? '';
  }
}
