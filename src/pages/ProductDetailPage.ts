import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  productHeading = () => this.page.getByRole('heading', { name: /LISTA - Schuifladekast/ }); // strategy: role+text
  productIdReference = () => this.page.getByTestId('ref-product-productId');
  manufacturerReference = () => this.page.getByTestId('ref-product-manufacturerRefId');
  buyboxQuantitySelector = () => this.page.locator('#buybox-counter'); // strategy: id
  addToCartButton = () => this.page.getByTestId('quantity-counter-cta-add');
  incrementButton = () => this.page.getByLabel('Increment');
  decrementButton = () => this.page.getByLabel('Decrement');
  priceError = (productId: string) => this.page.getByTestId(`price-error-${productId}`);
  cartButton = () => this.page.getByTestId('cart-button');
  loginButton = () => this.page.getByTestId('login-button');

  async navigateToListaProductDetail(): Promise<void> {
    await this.navigate('/catalog/en-gb/products/lista-schuifladekast-mobiel-27x27e-bxdxh-564x572x723mm-5-lades-ral7035-grijs-6968173');
  }
}
