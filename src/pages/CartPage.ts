import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  cartNavigationControl = (): Locator =>
    this.page.getByRole('link', { name: /cart|panier|basket/i }).or(
      this.page.getByRole('button', { name: /cart|panier|basket/i }),
    );

  cartHeading = (): Locator => this.page.getByRole('heading', { name: /cart|panier|basket/i });

  cartContentRegion = (): Locator =>
    this.page.getByRole('main').or(this.page.locator('[data-testid="cart"], [data-testid="cart-page"], [data-testid="mini-cart"]'));

  cartLineItem = (productId: string): Locator =>
    this.page.locator('[data-testid="cart-line-item"], [data-testid="cart-item"], [class*="cart-line"], [class*="cart-item"]').filter({ hasText: productId }).first(); // TODO: verify selector

  productIdentifier = (productId: string): Locator => this.page.getByText(productId, { exact: false }).first();

  quantityField = (): Locator =>
    this.page.getByLabel(/quantity|quantit/i).or(this.page.locator('[data-testid*="quantity"], input[name*="quantity"]'));

  emptyCartMessage = (): Locator => this.page.getByText(/empty cart|panier vide|votre panier est vide/i);

  notFoundState = (): Locator =>
    this.page.getByRole('heading', { name: /page not found|we couldn't find that page|404/i }).or(
      this.page.getByRole('main').getByText(/page not found|we couldn't find that page|404/i),
    ).first();

  async openCartFromNavigation(): Promise<void> {
    await this.cartNavigationControl().first().click();
  }

  async waitForCartView(): Promise<void> {
    await this.waitForPageLoad();
  }
}
