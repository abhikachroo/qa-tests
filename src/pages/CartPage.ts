import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) { super(page); }

  cartLineItem = (productId: string) =>
    this.page.getByText(productId, { exact: false }).first();

  emptyCartMessage = () =>
    this.page.getByText(/empty|no products|panier vide|aucun article/i).first();

  shoppingRecoveryLink = () =>
    this.page.getByRole('link', { name: /continue shopping|shop|catalog|continuer|boutique/i }).first();

  proceedToCheckoutButton = () =>
    this.page.getByRole('button', { name: /checkout|commander|validate|proceed|continuer/i }).first();

  quantityInput = (productId: string) =>
    this.page
      .locator('[data-testid="cart-line-item"], [data-testid="cart-item"], li, tr')
      .filter({ hasText: productId })
      .locator('input[type="number"], [data-testid*="quantity"]')
      .first(); // TODO: verify selector against live cart markup

  async clickProceedToCheckout(): Promise<void> {
    await this.proceedToCheckoutButton().click();
  }
}
