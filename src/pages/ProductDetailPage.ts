import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Verified live UI selector: product title heading contains LISTA product name
  productTitleHeading = (): Locator => this.page.getByRole('heading', { name: /LISTA - Schuifladekast/i });

  // Verified live UI selector: data-testid="ref-product-productId"
  productId = (): Locator => this.page.getByTestId('ref-product-productId');

  // Verified live UI selector: data-testid="quantity-counter-cta-add"
  addToCartButton = (): Locator => this.page.getByTestId('quantity-counter-cta-add');

  // Verified live UI selector: id="buybox-counter"
  quantityInput = (): Locator => this.page.locator('#buybox-counter');

  // Verified live UI selector: data-testid="price-error-<productId>"
  priceError = (productId: string): Locator => this.page.getByTestId(`price-error-${productId}`);

  async waitForProductDetail(productId: string): Promise<void> {
    await this.page.waitForURL(`**/products/**${productId}`, { timeout: 30_000 });
  }
}
