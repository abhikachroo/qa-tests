import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Search shell input remains available on recoverable cart-route error states.
  routeShellSearchInput = (): Locator => this.page.getByTestId('search-bar-input');

  // Controlled application error container seen when direct cart route is unavailable.
  error404Container = (): Locator => this.page.getByTestId('Error404');

  // Product result containing product ID (strategy: semantic result containers + text filter from test plan locator map).
  productCard = (productId: string): Locator =>
    this.page.getByRole('listitem').filter({ hasText: productId }).or(
      this.page.getByRole('article').filter({ hasText: productId }),
    ).or(
      this.page.getByRole('main').filter({ hasText: productId }),
    ).first();

  // Add-to-cart control associated with the matching product result.
  addToCartButton = (productId: string): Locator =>
    this.productCard(productId).getByRole('button', { name: 'Add to cart' }).first();

  // Add-to-cart success or cart update indication. TODO: replace with stable data-testid when provided by application.
  addToCartSuccessIndicator = (): Locator =>
    this.page.getByRole('status').or(this.page.getByText(/added|ajouté|panier|cart/i)).first();

  // Recoverable add-to-cart failure indication. TODO: replace with stable data-testid when backend error contract is known.
  addToCartErrorMessage = (): Locator =>
    this.page.getByRole('alert').or(this.page.getByText(/error|failed|erreur|impossible/i)).first();

  // Header cart entry point.
  cartEntryPoint = (): Locator =>
    this.page.getByRole('link', { name: /cart/i }).filter({ hasText: /Shopping Cart/i }).first();

  // Generic cart content container. TODO: replace with stable cart container data-testid when available.
  cartContents = (): Locator =>
    this.page.locator('[data-testid="cart"], [data-testid*="cart"], [class*="cart"], main').first();

  // Cart line containing the searched product ID. TODO: replace with stable cart-line data-testid when available.
  cartLineByProductId = (productId: string): Locator =>
    this.page.locator('[data-testid*="cart"], [class*="cart"], main').filter({ hasText: productId }).first();

  // Empty-cart messaging. TODO: verify localized copy and selector once cart entry point is stable.
  emptyCartMessage = (): Locator =>
    this.page.getByText(/empty|vide|aucun article|panier vide/i).first();

  async clickAddToCart(productId: string): Promise<void> {
    await this.addToCartButton(productId).click();
  }

  async clickCartEntryPoint(): Promise<void> {
    await this.cartEntryPoint().click();
  }

  async navigateToCartRoute(): Promise<void> {
    await this.navigate('/cart');
  }
}
