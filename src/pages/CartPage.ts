import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Route shell search input from extracted 404 shell manifest.
  routeShellSearchInput = (): Locator => this.page.getByTestId('search-bar-input');

  // Error container from extracted /cart 404 manifest.
  error404Container = (): Locator => this.page.getByTestId('Error404');

  // Product card identified by containing the searched product ID text.
  productCard = (productId: string): Locator =>
    this.page.locator('[data-testid="product-card"]').filter({ hasText: productId }).first();

  // Add-to-cart button/control inside a product card. TODO: verify selector once stable add-to-cart test id is exposed.
  addToCartButton = (productId: string): Locator =>
    this.productCard(productId).getByRole('button', { name: /add|cart|panier|ajouter/i }).first();

  // Header or confirmation cart entry point. TODO: verify selector against authenticated/orderable product state.
  cartEntryPoint = (): Locator =>
    this.page.getByRole('link', { name: /cart|basket|panier/i }).or(
      this.page.getByRole('button', { name: /cart|basket|panier/i }),
    ).first();

  // Generic cart content container. TODO: replace with stable data-testid when provided by application.
  cartContents = (): Locator =>
    this.page.locator('[data-testid="cart"], [data-testid*="cart"], [class*="cart"]').first();

  // Cart line containing the searched product ID. TODO: replace with stable cart-line data-testid when available.
  cartLineByProductId = (productId: string): Locator =>
    this.page.locator('[data-testid*="cart"], [class*="cart"], main').filter({ hasText: productId }).first();

  // Empty-cart messaging. TODO: verify localized copy and selector once cart entry point is stable.
  emptyCartMessage = (): Locator =>
    this.page.getByText(/empty|vide|aucun article|panier vide/i).first();

  async clickAddToCart(productId: string): Promise<void> {
    await this.addToCartButton(productId).click();
  }

  async openCart(): Promise<void> {
    await this.cartEntryPoint().click();
  }
}
