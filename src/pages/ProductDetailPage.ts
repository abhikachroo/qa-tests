import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productIdReference = (): Locator => this.page.getByTestId('ref-product-productId');
  priceError = (productId: string): Locator => this.page.getByTestId(`price-error-${productId}`);
  buyboxQuantitySelector = (): Locator => this.page.locator('#buybox-counter');
  addToCartButton = (): Locator => this.page.getByTestId('quantity-counter-cta-add');
  cartButton = (): Locator => this.page.getByTestId('cart-button');

  async waitForProductDetailUrl(productId: string): Promise<void> {
    await this.page.waitForURL(`**${productId}**`, { timeout: 30_000 });
  }
}
