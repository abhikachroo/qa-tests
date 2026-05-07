import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage — Page Object for the cart / checkout-entry page.
 *
 * URL: /checkout/en-gb/
 * Verified locators extracted via live browser automation.
 */
export class CartPage extends BasePage {
  /** Canonical cart page path */
  static readonly PATH = '/checkout/en-gb/';

  constructor(page: Page) { super(page); }

  // ── Primary CTA ───────────────────────────────────────────────────────────

  /** "Proceed to checkout" button (strategy: data-testid) */
  checkoutBtn = () => this.page.getByTestId('checkout-button');

  /** "Ask for a quote" alternative CTA (strategy: data-testid) */
  cartToQuoteBtn = () => this.page.getByTestId('cart-to-quote-button');

  // ── Delivery Options ──────────────────────────────────────────────────────

  /** Pickup (Click & Collect) radio button (strategy: data-testid) */
  pickupRadio = () => this.page.getByTestId('pickup-logistic-radio');

  /** Home / address delivery radio button (strategy: data-testid) */
  deliveryRadio = () => this.page.getByTestId('delivery-logistic-radio');

  /** "Change delivery address" link (strategy: data-testid) */
  changeAddressLink = () => this.page.getByTestId('logistic-details-change-address');

  /** "Change pickup address" / branch link (strategy: data-testid) */
  changeBranchLink = () => this.page.getByTestId('logistic-details-change-branch');

  // ── Coupon ────────────────────────────────────────────────────────────────

  /** "Use a coupon code" toggle button (strategy: data-testid) */
  couponBtn = () => this.page.getByTestId('use-coupon-button');

  // ── Quantity Controls ─────────────────────────────────────────────────────

  /** Increment quantity button for any cart line (strategy: aria-label) */
  incrementBtn = () => this.page.getByLabel('Increment');

  /** Decrement quantity button for any cart line (strategy: aria-label) */
  decrementBtn = () => this.page.getByLabel('Decrement');

  // ── Cart Management ───────────────────────────────────────────────────────

  /** Edit cart dropdown menu trigger (strategy: data-testid) */
  editCartMenuBtn = () => this.page.getByTestId('edit-cart-menu-button');

  /** Open "rename cart" drawer (strategy: data-testid) */
  showCartEditDrawerBtn = () => this.page.getByTestId('show-cart-edit-drawer');

  /** Delete cart button in dropdown (strategy: data-testid) */
  deleteCartBtn = () => this.page.getByTestId('delete-cart');

  /** Switch cart button (strategy: data-testid) */
  switchCartBtn = () => this.page.getByTestId('switch-cart-button');

  // ── Export ────────────────────────────────────────────────────────────────

  /** Export dropdown trigger (strategy: data-testid) */
  exportDropdownBtn = () => this.page.getByTestId('cart-download-dropdown');

  /** Export as PDF (strategy: data-testid) */
  exportPdfBtn = () => this.page.getByTestId('cart-actions-export-pdf');

  /** Export as CSV (strategy: data-testid) */
  exportCsvBtn = () => this.page.getByTestId('cart-actions-export-csv');

  // ── Favourites ────────────────────────────────────────────────────────────

  /** Add all items to favourites (strategy: data-testid) */
  addAllToFavBtn = () => this.page.getByTestId('add-all-items-to-favorites');

  // ── Empty State ───────────────────────────────────────────────────────────

  /**
   * "Explore categories" CTA — shown when cart has 0 items.
   * (strategy: data-testid)
   */
  exploreCategorizesBtn = () => this.page.getByTestId('messageboard-proceed-button');

  // ── Error / Message Containers ────────────────────────────────────────────

  /** Cart-level message area (validation errors, info, etc.) */
  messageArea = () => this.page.getByTestId('message-area');

  /** Cart message board container (empty state, general messages) */
  messageBoard = () => this.page.getByTestId('message-board');

  // ── Simple UI Actions ─────────────────────────────────────────────────────

  /** Navigate to the cart page and wait for it to load. */
  async navigateToCart(): Promise<void> {
    await this.navigate(CartPage.PATH);
    await this.waitForPageLoad();
    await this.dismissCookieBannerIfPresent();
  }

  /** Click "Proceed to checkout" button. */
  async clickCheckout(): Promise<void> {
    await this.checkoutBtn().click();
  }

  /** Select the delivery radio button. */
  async selectDelivery(): Promise<void> {
    await this.deliveryRadio().check();
  }

  /** Select the pickup radio button. */
  async selectPickup(): Promise<void> {
    await this.pickupRadio().check();
  }

  /** Click the increment button to increase quantity by 1. */
  async incrementQuantity(): Promise<void> {
    await this.incrementBtn().click();
  }

  /** Returns true if the cart is in an empty state (Explore categories CTA visible). */
  async isCartEmpty(): Promise<boolean> {
    return this.exploreCategorizesBtn().isVisible({ timeout: 3_000 }).catch(() => false);
  }
}
