import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productTitle = () => this.page.getByTestId('title-manufacturer');
  productIdReference = (productId: string) => this.page.getByTestId('blocA2').getByLabel(`Copy productId ${productId}`);
  manufacturerReference = () => this.page.getByTestId('ref-product-manufacturerRefId');
  priceUnavailableMessage = (productId: string) => this.page.getByTestId(`price-error-${productId}`);
  quantityInput = () => this.page.locator('#buybox-counter');
  addToCartButton = () => this.page.getByTestId('quantity-counter-cta-add');
  decrementButton = () => this.page.getByLabel('Decrement');
  incrementButton = () => this.page.getByLabel('Increment');
  cartButton = () => this.page.getByTestId('header-cart').getByTestId('cart-button');
}
