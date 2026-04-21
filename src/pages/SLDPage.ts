import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SLDPage — Single Line Diagram view in EcoSet Configurator.
 *
 * Locators are arrow functions. Zero business logic.
 * Validation logic lives in SLDModule.
 */
export class SLDPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── SLD diagram container ────────────────────────────────────────────────
  sldDiagramContainer  = () => this.page.locator('[data-testid="sld-diagram"], .sld-diagram, #sld-view').first(); // TODO: verify selector
  sldLoadingSpinner    = () => this.page.locator('[data-testid="sld-loading"], .sld-spinner').first();

  // ── Product nodes ────────────────────────────────────────────────────────
  allSLDNodes          = () => this.page.locator('[data-testid="sld-node"], .sld-node, .sld-product-node');
  sldNodeAt            = (index: number): Locator => this.allSLDNodes().nth(index);
  quantityLabelOnNode  = (index: number): Locator =>
    this.sldNodeAt(index).locator('[data-testid="sld-qty"], .sld-qty-label, .qty-indicator').first(); // TODO: verify selector
  productLabelOnNode   = (index: number): Locator =>
    this.sldNodeAt(index).locator('[data-testid="sld-product-label"], .product-label').first(); // TODO: verify selector

  // ── Level shortcuts ──────────────────────────────────────────────────────
  rootNode             = () => this.sldNodeAt(0);
  endOfBranchNode      = () => this.allSLDNodes().last();

  // ── Page header ──────────────────────────────────────────────────────────
  sldPageHeading       = () => this.page.getByRole('heading', { name: /single line|sld|schéma/i }).first();

  // ── Actions ──────────────────────────────────────────────────────────────
  async waitForSLDLoaded(): Promise<void> {
    await this.sldLoadingSpinner().waitFor({ state: 'hidden', timeout: 30_000 }).catch(() => {
      /* spinner may not be present — continue */
    });
    await this.waitForPageLoad();
  }

  async getSLDNodeCount(): Promise<number> {
    return this.allSLDNodes().count();
  }

  async getQuantityOnNode(index: number): Promise<string> {
    return (await this.quantityLabelOnNode(index).textContent()) ?? '';
  }

  async getProductLabelOnNode(index: number): Promise<string> {
    return (await this.productLabelOnNode(index).textContent()) ?? '';
  }

  async isNodeVisible(index: number): Promise<boolean> {
    return this.sldNodeAt(index).isVisible();
  }

  /**
   * Reload the SLD page.
   * Exposed as a Page method so tests do not access the protected `page` property directly.
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }
}
