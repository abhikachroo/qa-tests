import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProductDetailPage — Page Object for the PDP (Product Detail Page).
 *
 * Verified locators extracted via live browser automation on:
 *   https://fra-vanilla-preprod.dev.spark.sonepar.com/catalog/en-gb/products/
 *   lista-schuifladekast-mobiel-27x27e-bxdxh-564x572x723mm-5-lades-ral7035-grijs-6968173
 */
export class ProductDetailPage extends BasePage {
  constructor(page: Page) { super(page); }

  // ── Quantity & Add-to-Cart ────────────────────────────────────────────────

  /** Quantity counter input in the buybox (strategy: id — confirmed live) */
  quantityInput = () => this.page.locator('#buybox-counter');

  /** Primary "Add to cart" button in the buybox (strategy: data-testid) */
  addToCartBtn = () => this.page.getByTestId('quantity-counter-cta-add');

  /** Increment quantity button (strategy: aria-label) */
  incrementBtn = () => this.page.getByLabel('Increment');

  /** Decrement quantity button (strategy: aria-label) */
  decrementBtn = () => this.page.getByLabel('Decrement');

  // ── Product Identity ──────────────────────────────────────────────────────

  /**
   * Product ID display element — shows the Sonepar article number.
   * Doubles as a copy-to-clipboard button (strategy: data-testid).
   */
  productIdBadge = () => this.page.getByTestId('ref-product-productId');

  /**
   * Manufacturer reference display element (strategy: data-testid).
   * e.g. "78.491.020" for product 6968173.
   */
  manufacturerRefBadge = () => this.page.getByTestId('ref-product-manufacturerRefId');

  /** Customer reference input (strategy: id — free-text label field) */
  customerRefInput = () => this.page.locator('#customerRefInput');

  // ── Feedback & Status ─────────────────────────────────────────────────────

  /**
   * Step / status message for a specific product ID.
   * e.g. getByTestId('stepMessage-6968173')
   * Pass the product ID to target the correct element.
   */
  stepMessage = (productId: string) =>
    this.page.getByTestId(`stepMessage-${productId}`);

  /** General message / error div on the PDP (strategy: data-testid) */
  messageDiv = () => this.page.getByTestId('messageDiv');

  // ── Secondary Actions ─────────────────────────────────────────────────────

  /** Add to compare checkbox (strategy: data-testid, product-specific) */
  compareBtn = (productId: string) =>
    this.page.getByTestId(`product-compare-${productId}`);

  /** Add to favourites button (strategy: data-testid, product-specific) */
  addToFavBtn = (productId: string) =>
    this.page.getByTestId(`add-to-favorites-${productId}`);

  /** Price details tooltip button (strategy: data-testid, product-specific) */
  priceTooltipBtn = (productId: string) =>
    this.page.getByTestId(`price-tooltip-${productId}-button`);

  /** Stock locator / Show branches button (strategy: data-testid) */
  stockLocatorBtn = () => this.page.getByTestId('stockLocator');

  // ── Navigation ────────────────────────────────────────────────────────────

  /** Cart button in the global header (strategy: data-testid) */
  cartHeaderBtn = () => this.page.getByTestId('cart-button');

  /** Go-to-previous-page breadcrumb link (strategy: aria-label) */
  backBtn = () => this.page.getByLabel('Go to previous page');

  // ── Simple UI Actions ─────────────────────────────────────────────────────

  /**
   * Navigate to a product detail page by slug.
   * @param slug  Full path segment after the base URL, e.g.
   *              '/catalog/en-gb/products/lista-...-6968173'
   */
  async navigateToPdp(slug: string): Promise<void> {
    await this.navigate(slug);
    await this.waitForPageLoad();
    await this.dismissCookieBannerIfPresent();
  }

  /** Set the quantity input to a specific numeric value. */
  async setQuantity(value: number): Promise<void> {
    await this.quantityInput().fill(String(value));
  }

  /** Click the primary "Add to cart" button. */
  async clickAddToCart(): Promise<void> {
    await this.addToCartBtn().click();
  }

  /** Read the text content of the productId badge element. */
  async getProductIdText(): Promise<string> {
    return (await this.productIdBadge().textContent()) ?? '';
  }
}
