import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productIdText = (productId: string): Locator =>
    this.page.getByText(productId, { exact: false }).first();

  addToCartButton = (): Locator =>
    this.page.getByRole('button', { name: /add to cart/i });

  availabilityIndicator = (): Locator =>
    this.page.getByText(/in stock|available|availability|purchasable/i).first(); // TODO: verify selector against PDP availability copy

  cartConfirmation = (): Locator =>
    this.page.getByText(/added to cart|added|cart updated|success/i).first(); // TODO: verify selector against add-to-cart toast

  cartCount = (): Locator =>
    this.page.locator('[data-testid*="cart"], [aria-label*="cart" i]').first(); // TODO: verify selector against header cart count

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton().click();
  }

  async doubleClickAddToCart(): Promise<void> {
    await this.addToCartButton().dblclick();
  }
}
