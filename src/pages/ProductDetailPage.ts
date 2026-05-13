import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productHeading = () => this.page.getByRole('heading', { level: 1 });
  productIdReference = (productId: string): Locator =>
    this.page.getByRole('button', { name: new RegExp(`ProductID\\s*${productId}`) });
  buyboxQuantityInput = () => this.page.locator('#buybox-counter'); // strategy: id
  addToCartButton = () => this.page.getByTestId('quantity-counter-cta-add');
  decrementButton = () => this.page.getByLabel('Decrement');
  incrementButton = () => this.page.getByLabel('Increment');
  priceError = (productId: string): Locator => this.page.getByTestId(`price-error-${productId}`);

  async navigateToProduct(productSlug: string): Promise<void> {
    await this.navigate(`/catalog/en-gb/products/${productSlug}`);
  }
}
