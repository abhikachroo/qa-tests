import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Header cart control (strategy: accessible link locator)
  headerCartButton = (): Locator => this.page.getByRole('link', { name: /cart/i }).last();

  // Cart heading (strategy: role+text, approximated from cart semantics)
  cartHeading = (): Locator => this.page.getByRole('heading', { name: /cart|basket/i });

  // Cart line item scoped by product ID (strategy: structural data-testid, product text filter)
  cartLineItem = (productId: string): Locator =>
    this.page
      .locator('[data-testid*="cart"], [data-testid*="basket"], [data-testid*="line-item"]') // TODO: verify selector
      .filter({ hasText: productId })
      .first();

  // Fallback cart product text (strategy: text from test plan locator map)
  cartProductText = (productId: string): Locator =>
    this.page.getByText(productId, { exact: false }).first();

  async clickHeaderCartButton(): Promise<void> {
    await this.headerCartButton().click();
  }
}
