import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class ProductCartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  cartLineItem = (productId: string): Locator =>
    this.page.getByText(productId, { exact: false }).first();

  emptyCartMessage = (): Locator =>
    this.page.getByText(/empty cart|cart is empty|panier vide|votre panier est vide/i).first();

  cartSummary = (): Locator =>
    this.page.getByRole('heading', { name: /cart|panier/i }).or(this.page.getByText(/cart|panier/i)).first();

  cartCountZero = (): Locator =>
    this.page.getByText(/^0$/).first();

  error404Container = (): Locator => this.page.getByTestId('Error404');
  error404Text = (): Locator => this.page.getByRole('paragraph').filter({ hasText: /Error 404/i });
  addToCartControls = (): Locator => this.page.getByRole('button', { name: /add.*cart|ajouter.*panier|ajouter/i });
  headerSearchInput = (): Locator => this.page.getByTestId('search-bar-input');
  cartButton = (): Locator => this.page.getByTestId('cart-button');

  async navigateToUnsupportedSearchRoute(productId: string): Promise<void> {
    await this.navigate(`/search/${productId}`);
  }
}
