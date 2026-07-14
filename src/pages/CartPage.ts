import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  headerCartLink = () =>
    this.page
      .getByRole('link', { name: /cart[\s\u00a0]*,[\s\u00a0]*\d+[\s\u00a0]*items?\.?|shopping[\s\u00a0]*cart|cart|basket|bag|panier|checkout/i })
      .or(this.page.getByText(/shopping[\s\u00a0]*cart|cart[\s\u00a0]*,[\s\u00a0]*\d+[\s\u00a0]*items?\.?/i).first())
      .or(this.page.getByRole('button', { name: /cart[\s\u00a0]*,[\s\u00a0]*\d+[\s\u00a0]*items?\.?|shopping[\s\u00a0]*cart|cart|basket|bag|panier|checkout/i }))
      .or(this.page.getByRole('button').filter({ hasText: /shopping[\s\u00a0]*cart/i }))
      .first();
  productLineItem = (productId: string) => this.page.getByText(productId, { exact: false }).first();

  // TODO: verify selector against checkout cart page once direct checkout browsing is stable.
  emptyCartMessage = () => this.page.getByText(/empty cart|your cart is empty|panier vide/i).first();

  // TODO: verify selector against checkout cart page once direct checkout browsing is stable.
  quantityInputForProduct = (productId: string) =>
    this.page.locator('[data-testid="cart-line-item"], [class*="cart-line"], [class*="basket-line"]').filter({ hasText: productId }).locator('input[type="number"], [data-testid*="quantity"]').first();

  notFoundMessage = () => this.page.getByText(/page not found|404|not found/i).first();

  async clickHeaderCartLink(): Promise<void> {
    await this.headerCartLink().click();
  }

  async pressHeaderCartLink(): Promise<void> {
    await this.headerCartLink().press('Enter');
  }

  async waitForCheckoutRoute(): Promise<void> {
    await this.page.waitForURL(/\/checkout\/en-gb\//, { timeout: 30_000 });
  }
}
