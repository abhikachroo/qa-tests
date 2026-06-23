import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  cartIcon = () => this.page.getByRole('link', { name: /cart|basket|panier/i });
  cartDrawer = () => this.page.getByRole('dialog').filter({ hasText: /cart|basket|panier/i });
  cartItemByProductId = (productId: string) => this.page.getByText(productId, { exact: false }).first();
  cartQuantity = () => this.page.locator('[data-testid="cart-item-quantity"], input[name*="quantity"], [aria-label*="quantity" i]').first();
  cartCount = () => this.page.locator('[data-testid="cart-count"], [aria-label*="cart" i]').first();
  successMessage = () => this.page.getByRole('status').or(this.page.getByText(/added.*cart|added.*basket|success/i));
  errorMessage = () => this.page.getByRole('alert').or(this.page.getByText(/unable|failed|error/i));
  emptyOrSessionMessage = () => this.page.getByRole('heading', { name: /empty/i });
  errorPageContainer = () => this.page.getByTestId('Error404');

  async openCart(): Promise<void> {
    await this.cartIcon().click();
  }

  async getCartCountText(): Promise<string> {
    return (await this.cartCount().textContent()) ?? '';
  }
}
