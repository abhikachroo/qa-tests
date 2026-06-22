import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductCartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  headerCartButton = (): Locator => this.page.getByTestId('cart-button');

  productCard = (productId: string): Locator =>
    this.page.locator('[data-testid="product-card"]').filter({ hasText: productId }).first();

  productSpecificCard = (productId: string): Locator =>
    this.page.getByTestId(`product-list-card-${productId}`);

  addToCartButton = (productId: string): Locator =>
    this.productSpecificCard(productId).getByTestId('quantity-counter-cta-add');

  addToCartFeedback = (productId: string): Locator =>
    this.page.getByTestId(`stepMessage-${productId}`);

  cartLineItemByProductId = (productId: string): Locator =>
    this.page.getByText(productId, { exact: false }).first();

  cartPageNotFoundContainer = (): Locator => this.page.getByTestId('Error404');

  async clickAddToCart(productId: string): Promise<void> {
    await this.addToCartButton(productId).click();
  }

  async clickHeaderCart(): Promise<void> {
    await this.headerCartButton().click();
  }

  async waitForCartExperience(): Promise<void> {
    await this.page.waitForURL(/\/checkout\/en-gb\/?/, { timeout: 30_000 });
  }
}
