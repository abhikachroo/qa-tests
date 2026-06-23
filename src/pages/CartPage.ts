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

  // Product card identified by the accessible copy-product-id button in the search result.
  productCard = (productId: string): Locator =>
    this.page.getByRole('button', { name: new RegExp(`Copy productId ${productId}`, 'i') }).first();

  // Add-to-cart button/control in the search result.
  addToCartButton = (_productId: string): Locator =>
    this.page.getByRole('button', { name: /^Add to cart$/i }).first();

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
    if (this.page.url() === 'about:blank') {
      await this.page.goto('/');
      await this.waitForPageLoad();
      if (typeof (this as unknown as { dismissCookieBannerIfPresent?: () => Promise<void> }).dismissCookieBannerIfPresent === 'function') {
        await (this as unknown as { dismissCookieBannerIfPresent: () => Promise<void> }).dismissCookieBannerIfPresent();
      }
    }

    await this.cartEntryPoint().click();
  }
}
