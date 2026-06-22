import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  cartLink = (): Locator =>
    this.page.getByRole('link', { name: /cart|basket|panier/i }).first(); // TODO: verify selector against header cart navigation

  cartProductLineItem = (productId: string): Locator =>
    this.page.getByText(productId, { exact: false }).first();

  productLineItems = (): Locator =>
    this.page.locator('[data-testid*="cart-line"], [class*="cart-line"], [class*="line-item"]'); // TODO: verify selector against cart line item markup

  emptyCartMessage = (): Locator =>
    this.page.getByText(/empty cart|cart is empty|your cart is empty|panier vide/i).first(); // TODO: verify selector against cart empty state

  checkoutButton = (): Locator =>
    this.page.getByRole('button', { name: /checkout|proceed|commander/i }).first();

  quantityValue = (productId: string): Locator =>
    this.cartProductLineItem(productId).locator('xpath=ancestor::*[contains(@class, "cart") or contains(@data-testid, "cart")][1] input, xpath=ancestor::*[contains(@class, "cart") or contains(@data-testid, "cart")][1] [data-testid*="quantity"]'); // TODO: verify selector against quantity markup

  async openCart(): Promise<void> {
    await this.cartLink().click();
    await this.waitForPageLoad();
  }

  async navigateToCart(): Promise<void> {
    await this.navigate('/cart');
    await this.waitForPageLoad();
  }
}
