import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // "1 product" / "N products" count summary visible on results page
  productCountSummary = (): Locator => this.page.getByText(/\d+\s+product/i);

  // Product card identified by containing the searched product ID text
  productCard = (productId: string): Locator =>
    this.page
      .getByRole('article')
      .filter({ hasText: productId })
      .or(this.page.getByRole('listitem').filter({ hasText: productId }))
      .or(this.page.getByText(productId, { exact: false }))
      .first();

  // Fallback: any visible element containing the product ID string
  productIdText = (productId: string): Locator =>
    this.page.getByText(productId, { exact: false }).first();

  addToCartButtonForProduct = (productId: string): Locator =>
    this.page
      .getByRole('article')
      .filter({ hasText: productId })
      .getByRole('button', { name: /add to cart|add|ajouter|panier/i })
      .or(
        this.page
          .getByRole('listitem')
          .filter({ hasText: productId })
          .getByRole('button', { name: /add to cart|add|ajouter|panier/i }),
      )
      .or(this.page.getByRole('button', { name: /add to cart|add|ajouter|panier/i }).first())
      .first(); // TODO: verify selector

  addToCartConfirmation = (): Locator =>
    this.page.getByRole('alert').or(this.page.getByText(/added to cart|ajouté|panier/i)); // TODO: verify selector

  cartCountIndicator = (): Locator =>
    this.page.locator('[data-testid*="cart"], [aria-label*="cart"], [aria-label*="panier"]').filter({ hasText: /\d+/ }).first(); // TODO: verify selector

  unavailableStateForProduct = (productId: string): Locator =>
    this.productCard(productId).getByText(/unavailable|out of stock|indisponible|rupture/i);

  async clickAddToCartForProduct(productId: string): Promise<void> {
    await this.addToCartButtonForProduct(productId).click();
  }
}
