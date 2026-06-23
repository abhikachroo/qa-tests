import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  cartEntryPoint = () => this.page.getByRole('link', { name: /cart\s*,\s*\d+\s+items\.?/i }).first();
  cartIndicator  = () => this.page.getByTestId('cart-indicator').or(this.page.getByRole('link', { name: /cart\s*,\s*\d+\s+items\.?/i })).first();
  cartDrawer     = () => this.page.getByRole('dialog').filter({ hasText: /cart|basket|panier/i }).first();
  emptyCartState = () => this.page.getByText(/empty cart|basket is empty|panier vide|votre panier est vide/i).first();

  cartLineItem = (productId: string) =>
    this.page.locator('[data-testid="cart-line-item"], [class*="cart-line"], [class*="basket-line"]').filter({ hasText: productId }).first();

  async openCartFromHeader(): Promise<void> {
    await this.cartEntryPoint().click();
  }

  async getCartIndicatorText(): Promise<string> {
    return (await this.cartIndicator().textContent()) ?? '';
  }
}
