import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productList = () => this.page.getByTestId('product-list');
  productCountSummary = () => this.page.getByTestId('product-list-count');
  productCard = (productId: string) => this.page.getByTestId(`product-list-card-${productId}`);
  productTitleLink = () => this.page.getByTestId('product-list-card-title');
  productIdReference = (productId: string) => this.page.getByLabel(`Copy productId ${productId}`);
  addToCartButton = () => this.page.getByTestId('quantity-counter-cta-add');
  quantityInput = (productId: string) => this.page.locator(`#quantity-counter-${productId}`);
  cartButton = () => this.page.getByTestId('header-cart').getByTestId('cart-button');

  productIdText = (productId: string) => this.page.getByText(productId, { exact: false }).first();

  async clickProductTitle(): Promise<void> {
    await this.productTitleLink().click();
  }
}
