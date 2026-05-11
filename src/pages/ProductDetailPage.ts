import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productTags = (): Locator => this.page.getByTestId('product-tags');
  productIdChip = (): Locator => this.page.getByTestId('ref-product-productId');
  buyBox = (): Locator => this.page.getByTestId('BuyBox');
  priceError = (productId: string): Locator => this.page.getByTestId(`price-error-${productId}`);
  quantityCounter = (productId: string): Locator => this.page.getByTestId(`quantityCounter-${productId}`);
  quantityInput = (): Locator => this.buyBox().locator('#buybox-counter');
  addToCartButton = (): Locator => this.buyBox().getByTestId('quantity-counter-cta-add');
  decrementButton = (): Locator => this.buyBox().getByLabel('Decrement');
  incrementButton = (): Locator => this.buyBox().getByLabel('Increment');
  cartButton = (): Locator => this.page.getByTestId('cart-button');
  successToast = (): Locator => this.page.getByRole('status').filter({ hasText: /cart|basket|added/i });
  cartDrawer = (): Locator => this.page.getByTestId('cart-drawer');

  async waitForProductDetail(productId: string): Promise<void> {
    await this.page.waitForURL(`**/products/**${productId}**`, { timeout: 30_000 });
  }
}
