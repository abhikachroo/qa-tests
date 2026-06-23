import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // "1 product" / "N products" count summary visible on results page
  productCountSummary = () => this.page.getByText(/\d+\s+product/i);

  // Product can be identified by the copy button or the visible ProductID text in the live snapshot
  productCard = (productId: string) => {
    const escapedProductId = productId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const productIdPattern = new RegExp(`ProductID\\s+${escapedProductId}`, 'i');
    const copyProductIdPattern = new RegExp(`Copy\\s+productId\\s+${escapedProductId}`, 'i');

    return this.page.getByRole('button', { name: copyProductIdPattern }).or(
      this.page.getByText(productIdPattern, { exact: false })
    ).first();
  };

  // Fallback: any visible element containing the product ID string
  productIdText = (productId: string) =>
    this.page.getByText(productId, { exact: false }).first();

  addToCartButtonForProduct = (productId: string) =>
    this.page.getByRole('button', { name: /add.*cart|add.*basket|ajouter.*panier/i }).first();

  error404Container = () => this.page.getByTestId('Error404');
  error404Text      = () => this.page.getByRole('paragraph').filter({ hasText: /error\s*404/i }).first();

  async clickAddToCart(productId: string): Promise<void> {
    await this.addToCartButtonForProduct(productId).click();
  }
}
