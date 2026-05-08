import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productHeading = (): Locator => this.page.getByRole('heading', { name: /LISTA - Schuifladekast/ });
  productIdReference = (): Locator => this.page.getByTestId('ref-product-productId');
  manufacturerReference = (): Locator => this.page.getByTestId('ref-product-manufacturerRefId');
  buyboxQuantityInput = (): Locator => this.page.locator('#buybox-counter');
  addToCartButton = (): Locator => this.page.getByTestId('quantity-counter-cta-add');
  priceError = (productId: string): Locator => this.page.getByTestId(`price-error-${productId}`);
  incrementButton = (): Locator => this.page.getByLabel('Increment');
  decrementButton = (): Locator => this.page.getByLabel('Decrement');

  async navigateToProductDetail(path: string): Promise<void> {
    await this.navigate(path);
  }
}
