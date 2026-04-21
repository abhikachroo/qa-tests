import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * EcoSetProductsPage — covers Products selection, pricing display,
 * Single Line Diagram (SLD), Design / 2D view, Bill of Materials (BOM),
 * and Bulk Export within EcoSet Config.
 */
export class EcoSetProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // --- Product catalogue --------------------------------------------------
  /** First available product add button in the catalogue */
  addProductBtn = (): Locator =>
    this.page.getByRole('button', { name: /add|add product|\+/i }).first();

  /** EUR price cells — matches "€X,XX.XX" or "€ X.XX" patterns */
  eurPriceCell = (): Locator =>
    this.page.locator('text=/€\s*[\d,\.]+/').first();

  /** Total amount area — used across Products, SLD, Design, BOM views */
  totalAmountLabel = (): Locator =>
    this.page.locator('[class*="total"], [class*="price-total"], [class*="amount-total"]').first();

  totalAmountValue = (): Locator =>
    this.page.locator('[class*="total-price"], [class*="totalPrice"], [class*="total-amount"]').first();

  // --- Navigation tabs ----------------------------------------------------
  sldTab = (): Locator =>
    this.page.getByRole('tab', { name: /single line|sld|diagram/i });

  designTab = (): Locator =>
    this.page.getByRole('tab', { name: /design|2d|switchboard design/i });

  bomTab = (): Locator =>
    this.page.getByRole('tab', { name: /bill of material|bom|materials/i });

  exportTab = (): Locator =>
    this.page.getByRole('tab', { name: /export/i });

  // --- SLD view -----------------------------------------------------------
  sldCanvas = (): Locator =>
    this.page.locator('canvas, svg, [class*="sld"], [class*="diagram"]').first();

  sldTotalAmount = (): Locator =>
    this.page.locator('[class*="total"]').first();

  // --- Design / 2D view ---------------------------------------------------
  designTwoDView = (): Locator =>
    this.page.locator('[class*="2d"], [class*="two-d"], canvas').first();

  mountDeviceBtn = (): Locator =>
    this.page.getByRole('button', { name: /mount|place|add device/i }).first();

  designTotalAmount = (): Locator =>
    this.page.locator('[class*="total"]').first();

  // --- BOM view -----------------------------------------------------------
  bomTable = (): Locator =>
    this.page.locator('table, [class*="bom"]').first();

  bomEurPriceCell = (): Locator =>
    this.page.locator('text=/€\s*[\d,\.]+/').first();

  bomTotalAmount = (): Locator =>
    this.page.locator('[class*="total"]').first();

  // --- Export view --------------------------------------------------------
  bulkExportBtn = (): Locator =>
    this.page.getByRole('button', { name: /bulk export|export|download/i });

  exportSuccessIndicator = (): Locator =>
    this.page.locator('[class*="success"], [class*="download"], [class*="export-done"]').first();

  // --- Actions ------------------------------------------------------------
  async clickAddProduct(): Promise<void> {
    await this.addProductBtn().click();
  }

  async clickSldTab(): Promise<void> {
    await this.sldTab().click();
  }

  async clickDesignTab(): Promise<void> {
    await this.designTab().click();
  }

  async clickBomTab(): Promise<void> {
    await this.bomTab().click();
  }

  async clickExportTab(): Promise<void> {
    await this.exportTab().click();
  }

  async clickBulkExport(): Promise<void> {
    await this.bulkExportBtn().click();
  }

  async clickMountDevice(): Promise<void> {
    await this.mountDeviceBtn().click();
  }

  async getTotalAmountText(): Promise<string> {
    return (await this.totalAmountValue().textContent()) ?? '';
  }

  async getBomTotalText(): Promise<string> {
    return (await this.bomTotalAmount().textContent()) ?? '';
  }
}
