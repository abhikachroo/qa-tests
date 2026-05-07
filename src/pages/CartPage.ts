import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Cart heading (strategy: data-testid)
  cartName                 = () => this.page.getByTestId('cart-name');
  // Cart container (strategy: data-testid)
  cartContainer            = () => this.page.getByTestId('cart-container');
  // Product count label e.g. "1 product" (strategy: data-testid)
  cartNumberOfProducts     = () => this.page.getByTestId('cart-number-of-products');
  // Product list within cart (strategy: data-testid)
  cartItemList             = () => this.page.getByTestId('cart-item-list');
  // Product SKU reference text (strategy: data-testid)
  productReference         = () => this.page.getByTestId('productReference');
  // "Proceed to checkout" CTA — checkout-button testid reused on multiple pages (strategy: data-testid)
  proceedToCheckoutButton  = () => this.page.getByTestId('checkout-button').filter({ hasText: /proceed to checkout/i });
  // Remove from cart — used in beforeEach cleanup (strategy: data-testid)
  removeFromCartButton     = () => this.page.getByTestId('remove-from-cart-button');
  // Logistic area section (strategy: data-testid)
  logisticArea             = () => this.page.getByTestId('logistic-area');
  // Delivery address container (strategy: data-testid)
  deliveryAddressContainer = () => this.page.getByTestId('cart-logistic-details-delivery-container');

  async clickProceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton().click();
  }

  async clickRemoveFromCart(): Promise<void> {
    await this.removeFromCartButton().click();
  }

  async getNumberOfProductsText(): Promise<string> {
    return (await this.cartNumberOfProducts().textContent()) ?? '';
  }

  async isRemoveFromCartVisible(): Promise<boolean> {
    return this.removeFromCartButton().isVisible({ timeout: 5_000 }).catch(() => false);
  }
}
