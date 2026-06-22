import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  cartLink = (): Locator => this.page.getByRole('link', { name: /Cart/i });
  cartCountLink = (): Locator => this.page.getByRole('link', { name: /Cart\s*,\s*\d+\s+items?/i });
  cartItemByProductId = (productId: string): Locator => this.page.getByText(productId, { exact: false }).first();
  notFoundHeading = (): Locator => this.page.getByRole('heading', { name: /We couldn't find that page/i });
  cartSuccessMessage = (): Locator => this.page.getByText(/added|cart|panier/i).first();
  quantityInputForProduct = (productId: string): Locator =>
    this.page.locator('[data-testid*="cart"], [class*="cart"], table, main').filter({ hasText: productId }).first();

  async clickHeaderCart(): Promise<void> {
    await this.cartLink().click();
  }

  async navigateToCartPath(): Promise<void> {
    await this.navigate('/cart');
  }

  async getCartLinkText(): Promise<string> {
    return (await this.cartLink().textContent()) ?? '';
  }
}
