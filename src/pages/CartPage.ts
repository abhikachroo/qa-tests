import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Cart heading (strategy: data-testid)
  cartName             = () => this.page.getByTestId('cart-name');
  // Product count label, e.g. "1 product" (strategy: data-testid)
  cartNumberOfProducts = () => this.page.getByTestId('cart-number-of-products');
  // Product reference / SKU displayed in cart (strategy: data-testid)
  productReference     = () => this.page.getByTestId('productReference');
  // Full cart item list container (strategy: data-testid)
  cartItemList         = () => this.page.getByTestId('cart-item-list');
  // Remove from cart button — used in beforeEach cleanup (strategy: data-testid)
  removeFromCartButton = () => this.page.getByTestId('remove-from-cart-button');
  // Proceed to checkout CTA — disambiguated by hasText in module (strategy: data-testid)
  checkoutButton       = () => this.page.getByTestId('checkout-button');
  // Delivery promise label (strategy: data-testid)
  deliveryPromiseLabel = () => this.page.getByTestId('delivery-promise-label');

  async navigateToCart(): Promise<void> {
    await this.navigate('/checkout/en-gb/');
    await this.waitForPageLoad();
  }

  async clickProceedToCheckout(): Promise<void> {
    await this.checkoutButton().filter({ hasText: /proceed to checkout/i }).click();
  }

  async clickRemoveFromCart(): Promise<void> {
    await this.removeFromCartButton().click();
  }

  async getProductCount(): Promise<string> {
    return (await this.cartNumberOfProducts().textContent()) ?? '';
  }
}
