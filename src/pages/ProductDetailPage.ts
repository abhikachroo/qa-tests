import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Product title heading (strategy: role+text)
  productHeading = (): Locator => this.page.getByRole('heading', { level: 1, name: /LISTA.*Schuifladekast/i });

  // Verified locator: data-testid="ref-product-productId"
  productIdReference = (): Locator => this.page.getByTestId('ref-product-productId');

  // Verified locator: data-testid="ref-product-manufacturerRefId"
  manufacturerReference = (): Locator => this.page.getByTestId('ref-product-manufacturerRefId');

  // Verified locator: data-testid="quantity-counter-cta-add"
  addToCartButton = (): Locator => this.page.getByTestId('quantity-counter-cta-add');

  // Verified locator: id="buybox-counter"
  quantityInput = (): Locator => this.page.locator('#buybox-counter');

  // Verified locator: aria-label="Increment"
  incrementButton = (): Locator => this.page.getByLabel('Increment');

  // Verified locator: aria-label="Decrement"
  decrementButton = (): Locator => this.page.getByLabel('Decrement');

  // Verified locator: data-testid="product-compare-<productId>"
  compareButton = (productId: string): Locator => this.page.getByTestId(`product-compare-${productId}`);

  // Verified locator: data-testid="price-error-<productId>"
  priceError = (productId: string): Locator => this.page.getByTestId(`price-error-${productId}`);

  // Header cart link/count (strategy: data-testid)
  cartButton = (): Locator => this.page.getByTestId('cart-button');

  // Guest pricing banner (strategy: visible text)
  guestPricingBanner = (): Locator => this.page.getByText(/Log in or sign up to access your personalized pricing!/i);
}
