import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  cartEntryPoint = () => this.page.getByRole('link', { name: /cart|basket|panier/i }).first(); // TODO: verify selector
  cartIndicator  = () => this.page.getByTestId('cart-indicator').or(this.page.getByRole('link', { name: /cart|basket|panier/i })).first(); // TODO: verify selector
  cartDrawer     = () => this.page.getByRole('dialog').filter({ hasText: /cart|basket|panier/i }).first(); // TODO: verify selector
  emptyCartState = () => this.page.getByText(/empty cart|basket is empty|panier vide|votre panier est vide/i).first(); // TODO: verify selector

  cartLineItem = (productId: string) =>
    this.page.locator('[data-testid="cart-line-item"], [class*="cart-line"], [class*="basket-line"]').filter({ hasText: productId }).first(); // TODO: verify selector

  async openCartFromHeader(): Promise<void> {
    await this.cartEntryPoint().click();
  }

  async getCartIndicatorText(): Promise<string> {
    return (await this.cartIndicator().textContent()) ?? '';
  }
}
