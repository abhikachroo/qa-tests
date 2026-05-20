import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  shoppingCartHeading = (): Locator => this.page.getByRole('heading', { name: 'Shopping Cart' });
  headerCartButton = (): Locator => this.page.getByTestId('cart-button');

  recommendationsWrapper = (): Locator =>
    this.page.locator('[class*="recommendationsWrapper"]'); // class substring from DFS-67436 discovery

  recommendationTitle = (): Locator =>
    this.page.getByRole('heading', { name: /Recommended for you/i });

  recommendationQuickLink = (): Locator =>
    this.page.getByRole('link', { name: /recommended/i }); // accessibility/role from planned CMS anchor label

  recommendationCards = (): Locator =>
    this.recommendationsWrapper().locator(
      '[data-testid*="recommend"], [data-testid^="product-list-card-"], [data-testid="product-card"]',
    );

  recommendationCardTitles = (): Locator =>
    this.recommendationsWrapper().getByTestId('product-list-card-title');

  recommendationAddButtons = (): Locator =>
    this.recommendationsWrapper().getByRole('button', { name: /add|add to cart/i });

  recommendationAddedButtons = (): Locator =>
    this.recommendationsWrapper().getByRole('button', { name: /added|added to cart/i });

  recommendationImages = (): Locator => this.recommendationsWrapper().locator('img');

  recommendationPrices = (): Locator =>
    this.recommendationsWrapper().locator('[data-testid*="price"], [class*="price" i]');

  recommendationDivider = (): Locator =>
    this.recommendationsWrapper().locator('hr, [role="separator"], [class*="divider" i]');

  cartProductCards = (): Locator =>
    this.page.locator('[data-testid^="product-list-card-"], [data-testid="product-card"]');

  cartProductTitles = (): Locator => this.page.getByTestId('product-list-card-title');
  removeCartItemButtons = (): Locator => this.page.getByTestId('remove-from-cart-button');
  quantityInputs = (): Locator => this.page.locator('[id^="quantity-counter-"]'); // id prefix from quantity controls
  incrementQuantityButton = (): Locator => this.page.getByLabel('Increment');
  decrementQuantityButton = (): Locator => this.page.getByLabel('Decrement');
  checkoutButton = (): Locator => this.page.getByTestId('checkout-button');

  emptyCartHeading = (): Locator => this.page.getByRole('heading', { name: 'Your cart is empty' });
  emptyCartMessageBoard = (): Locator => this.page.getByTestId('message-board');
  exploreCategoriesButton = (): Locator => this.page.getByTestId('messageboard-proceed-button');
  loginButton = (): Locator => this.page.getByTestId('login-button');
  signupButton = (): Locator => this.page.getByTestId('signup-button');
  personalizedPricingPrompt = (): Locator =>
    this.page.getByText(/Log in or sign up to access your personalized pricing/i);

  productAddToCartButton = (): Locator => this.page.getByTestId('quantity-counter-cta-add');
  productQuantityInput = (): Locator => this.page.locator('#buybox-counter'); // id from PDP buybox

  async goToCart(): Promise<void> {
    await this.navigate('/checkout');
  }

  async goToLocalizedEmptyCart(): Promise<void> {
    await this.navigate('/checkout/en-gb/');
  }

  async goToAuthenticatedProductPage(): Promise<void> {
    await this.navigate('/catalog/en-gb/products/fluke-fluke-digital-thermometer-1-input-0362772?isLoggedIn=true');
  }

  async clickHeaderCartButton(): Promise<void> {
    await this.headerCartButton().click();
  }

  async clickRecommendationQuickLink(): Promise<void> {
    await this.recommendationQuickLink().click();
  }

  async clickFirstRecommendationAddButton(): Promise<void> {
    await this.recommendationAddButtons().first().click();
  }

  async clickFirstRemoveCartItemButton(): Promise<void> {
    await this.removeCartItemButtons().first().click();
  }

  async clickIncrementQuantity(): Promise<void> {
    await this.incrementQuantityButton().first().click();
  }

  async fillProductQuantity(quantity: string): Promise<void> {
    await this.productQuantityInput().fill(quantity);
  }

  async clickProductAddToCart(): Promise<void> {
    await this.productAddToCartButton().click();
  }

  async getRecommendationProductNames(): Promise<string[]> {
    return this.recommendationCardTitles().allTextContents();
  }

  async getCartProductCount(): Promise<number> {
    return this.cartProductCards().count();
  }
}
