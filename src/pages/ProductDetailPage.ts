import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductDetailPage — Layer 2
 * Locators and simple UI actions for the Product Detail Page.
 * URL pattern: /catalog/en-gb/products/{product-slug}
 */
export class ProductDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ────────────────────────────────────────────────────────────────

  /** Primary product title heading */
  productTitle = () => this.page.getByRole('heading', { level: 1 });

  /** "Add to cart" / "Add to basket" button on the PDP */
  // TODO: verify selector — observed as a button with text matching add/cart/basket on preprod
  addToCartBtn = () =>
    this.page.getByRole('button', { name: /add to (cart|basket|trolley)/i });

  /** Quantity input field */
  // TODO: verify selector
  quantityInput = () =>
    this.page.getByRole('spinbutton').or(this.page.getByLabel(/quantity/i));

  /** Product price element */
  // TODO: verify selector — guests may see "Unable to display price"
  priceDisplay = () => this.page.locator('[data-testid="product-price"], [class*="price"]').first();

  /** Success / confirmation toast or message after adding to cart */
  // TODO: verify selector
  addToCartConfirmation = () =>
    this.page.locator('[data-testid="cart-toast"], [class*="cart-notification"], [role="alert"]').first();

  /** Cart icon / mini-cart count badge in the header */
  // TODO: verify selector
  cartCountBadge = () =>
    this.page.locator('[data-testid="cart-count"], [class*="cart-count"], [class*="basket-count"]').first();

  // ── Actions ─────────────────────────────────────────────────────────────────

  async navigateToProduct(productPath: string): Promise<void> {
    await this.navigate(productPath);
  }

  async getProductTitle(): Promise<string> {
    return (await this.productTitle().textContent()) ?? '';
  }

  async isAddToCartEnabled(): Promise<boolean> {
    return this.addToCartBtn().isEnabled();
  }

  async clickAddToCart(): Promise<void> {
    await this.addToCartBtn().click();
  }

  async getCartCount(): Promise<string> {
    return (await this.cartCountBadge().textContent()) ?? '0';
  }
}
