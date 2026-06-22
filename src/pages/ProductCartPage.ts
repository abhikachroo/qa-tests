import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductCartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  cartButton = () => this.page.getByTestId('cart-button');
  cartCount = () => this.cartButton().locator('[data-testid="cart-count"], [class*="count"], [class*="badge"]').first();
  addToCartButton = () => this.page.getByRole('button', { name: /add\s*to\s*cart|add\s*to\s*basket|ajouter\s*au\s*panier/i }).first();
  confirmationMessage = () => this.page.getByRole('alert').or(this.page.getByText(/added to cart|added to basket|ajouté au panier|panier/i)).first();
  errorMessage = () => this.page.getByRole('alert').or(this.page.getByText(/error|failed|unable|erreur|échec/i)).first();
  cartLineItems = () => this.page.locator('[data-testid="cart-line-item"], [data-testid="cart-item"], [class*="cart-line"], [class*="cart-item"]');
  cartLineItemByProductId = (productId: string) => this.cartLineItems().filter({ hasText: productId }).first();
  productIdText = (productId: string) => this.page.getByText(productId, { exact: false }).first();
  emptyCartState = () => this.page.getByText(/empty cart|your cart is empty|panier vide|votre panier est vide/i).first();
  error404Container = () => this.page.getByTestId('Error404');
  error404Heading = () => this.page.getByRole('heading', { name: "We couldn't find that page" });

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton().click();
  }

  async openCart(): Promise<void> {
    await this.cartButton().click();
  }

  async getCartCountText(): Promise<string> {
    return (await this.cartCount().textContent()) ?? '';
  }
}
