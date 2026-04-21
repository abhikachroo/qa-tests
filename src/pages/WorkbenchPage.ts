import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * WorkbenchPage — EcoSet switchboard workbench canvas.
 *
 * Locators are arrow functions. Zero business logic.
 * Orchestration lives in WorkbenchModule.
 *
 * Selector notes (approximated from AC descriptions):
 * Lines marked // TODO: verify selector could not be confirmed against the live DOM.
 */
export class WorkbenchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Canvas / global ────────────────────────────────────────────────────
  workbenchCanvas      = () => this.page.locator('[data-testid="workbench-canvas"], .workbench-canvas, #workbench').first();
  addProductBtn        = () => this.page.getByRole('button', { name: /add product|ajouter un produit/i }).first();
  saveBtn              = () => this.page.getByRole('button', { name: /save|enregistrer/i }).first();

  // ── Product cards (generic) ────────────────────────────────────────────
  allProductCards      = () => this.page.locator('[data-testid="product-card"], .product-card, .workbench-item');
  productCardAt        = (index: number): Locator => this.allProductCards().nth(index);
  quantityBoxOnCard    = (index: number): Locator =>
    this.productCardAt(index).locator('[data-testid="quantity-badge"], .quantity-box, .qty-badge').first();
  quantityInput        = () => this.page.locator('[data-testid="quantity-input"], input[name="quantity"], input[aria-label*="quantit"]').first(); // TODO: verify selector

  // ── Quantity controls ─────────────────────────────────────────────────
  quantityIncrementBtn = () => this.page.getByRole('button', { name: /\+|increment|increase/i }).first();
  quantityDecrementBtn = () => this.page.getByRole('button', { name: /\-|decrement|decrease/i }).first();
  confirmQuantityBtn   = () => this.page.getByRole('button', { name: /apply|confirm|ok|valider/i }).first();

  // ── Branch navigation ──────────────────────────────────────────────────
  rootProductCard      = () => this.productCardAt(0);
  endOfBranchCard      = () => this.allProductCards().last();
  midBranchCardAt      = (index: number): Locator => this.productCardAt(index);

  // ── Page navigation tabs ───────────────────────────────────────────────
  sldTabLink           = () => this.page.getByRole('tab', { name: /sld|single line/i }).first();
  exportTabLink        = () => this.page.getByRole('tab', { name: /export/i }).first();

  // ── Actions ───────────────────────────────────────────────────────────
  async clickAddProduct(): Promise<void> {
    await this.addProductBtn().click();
  }

  async clickProductCard(index: number): Promise<void> {
    await this.productCardAt(index).click();
  }

  async clearAndTypeQuantity(value: number): Promise<void> {
    const input = this.quantityInput();
    await input.clear();
    await input.fill(String(value));
  }

  async clickIncrementQuantity(): Promise<void> {
    await this.quantityIncrementBtn().click();
  }

  async clickDecrementQuantity(): Promise<void> {
    await this.quantityDecrementBtn().click();
  }

  async clickConfirmQuantity(): Promise<void> {
    await this.confirmQuantityBtn().click();
  }

  async clickSave(): Promise<void> {
    await this.saveBtn().click();
  }

  async navigateToSLD(): Promise<void> {
    await this.sldTabLink().click();
  }

  async navigateToExport(): Promise<void> {
    await this.exportTabLink().click();
  }

  async getQuantityDisplayedOnCard(index: number): Promise<string> {
    return (await this.quantityBoxOnCard(index).textContent()) ?? '';
  }

  async getProductCardCount(): Promise<number> {
    return this.allProductCards().count();
  }

  async isQuantityBoxVisible(index: number): Promise<boolean> {
    return this.quantityBoxOnCard(index).isVisible();
  }

  /**
   * Check whether the quantity input is in an invalid/error state.
   * Inspects HTML constraint validation + common error class patterns.
   * Called from WorkbenchModule — keeps DOM evaluation inside the Page layer.
   */
  async isQuantityInputInvalid(): Promise<boolean> {
    return this.quantityInput().evaluate((el: HTMLInputElement) =>
      !el.validity.valid ||
      el.classList.contains('error') ||
      el.getAttribute('aria-invalid') === 'true',
    ).catch(() => false);
  }
}
