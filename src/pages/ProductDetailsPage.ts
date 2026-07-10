import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productIdText = (productId: string) => this.page.getByText(productId, { exact: false }).first();

  // TODO: verify selector against product detail page once direct product routes are reachable.
  addToCartButton = () => this.page.getByRole('button', { name: /add to cart|add|ajouter au panier/i }).first();

  // TODO: verify selector against product detail page once direct product routes are reachable.
  addToCartSuccessMessage = () => this.page.getByText(/added to cart|ajouté au panier|cart updated/i).first();

  // TODO: verify selector against restricted buyer-session behavior once auth rules are confirmed.
  authorizationMessage = () => this.page.getByText(/login|sign in|permission|unauthorized|connectez-vous|autorisation/i).first();

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton().click();
  }

  async pressAddToCart(): Promise<void> {
    await this.addToCartButton().press('Enter');
  }
}
