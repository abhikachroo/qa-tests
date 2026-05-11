import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // "1 product" / "N products" count summary visible on results page
  productCountSummary = (): Locator => this.page.getByText(/\d+\s+product/i);

  // Verified live UI selector: data-testid="product-list-card-<productId>"
  productCard = (productId: string): Locator => this.page.getByTestId(`product-list-card-${productId}`);

  // Verified live UI selector scoped to the selected product card
  productTitleLink = (productId: string): Locator => this.productCard(productId).getByTestId('product-list-card-title');

  // Verified live UI selector: accessible label "Copy productId <productId>"
  productIdControl = (productId: string): Locator => this.page.getByLabel(`Copy productId ${productId}`);

  // Fallback: any visible element containing the product ID string
  productIdText = (productId: string): Locator => this.page.getByText(productId, { exact: false }).first();

  // Verified live UI selector scoped to product card: data-testid="quantity-counter-cta-add"
  addToCartButton = (productId: string): Locator => this.productCard(productId).getByTestId('quantity-counter-cta-add');

  // Verified live UI selector: id="quantity-counter-<productId>"
  quantityInput = (productId: string): Locator => this.page.locator(`#quantity-counter-${productId}`);

  // Verified live UI selectors scoped to product card accessible labels
  decrementButton = (productId: string): Locator => this.productCard(productId).getByLabel('Decrement');
  incrementButton = (productId: string): Locator => this.productCard(productId).getByLabel('Increment');

  // Verified live UI selector: data-testid="price-error-<productId>"
  priceError = (productId: string): Locator => this.page.getByTestId(`price-error-${productId}`);

  // Verified live UI selector: data-testid="cart-button"
  cartButton = (): Locator => this.page.getByTestId('cart-button');

  async clickProductTitle(productId: string): Promise<void> {
    await this.productTitleLink(productId).click();
  }
}
