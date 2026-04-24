import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // "1 product" / "N products" count summary visible on results page
  productCountSummary = () => this.page.getByText(/\d+\s+product/i);

  // Product card identified by containing the searched product ID text
  productCard = (productId: string) =>
    this.page.locator('[data-testid="product-card"]').filter({ hasText: productId }).first();

  // Fallback: any visible element containing the product ID string
  productIdText = (productId: string) =>
    this.page.getByText(productId, { exact: false }).first();

  // Add to Cart CTA button — data-testid confirmed live via accessibility snapshot on preprod SRP
  // Locator source: LOCATOR_MAP (strategy: data-testid)
  addToCartBtn = () => this.page.getByTestId('quantity-counter-cta-add');

  /**
   * Returns true if the Add to Cart button carries the native HTML disabled attribute.
   * Note: the button uses a native `disabled` attribute (not aria-disabled), confirmed via
   * live UI inspection — therefore toBeDisabled() is the correct assertion.
   */
  async isAddToCartDisabled(): Promise<boolean> {
    return this.addToCartBtn().isDisabled();
  }
}
