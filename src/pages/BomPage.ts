import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * BomPage — Bill of Materials view
 * Selectors are approximate — TODO: verify via live UI inspection.
 */
export class BomPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // BOM line items
  // TODO: verify selector
  bomLineItems       = () => this.page.locator('[data-testid="bom-row"], [class*="bom-row"], tbody tr');
  bomPriceItems      = () => this.page.locator('[data-testid="bom-price"], [class*="bom-price"]');

  // Total amount
  // TODO: verify selector
  totalAmountText    = () => this.page.getByText(/total.*€|€.*total/i);
  totalAmountCell    = () => this.page.locator('[data-testid="bom-total"], [class*="bom-total"]');

  // Export navigation
  // TODO: verify selector
  exportTab          = () => this.page.getByRole('tab', { name: /export/i });

  async getBomRowCount(): Promise<number> {
    return this.bomLineItems().count();
  }

  async getTotalAmountText(): Promise<string> {
    return (await this.totalAmountText().textContent()) ?? '';
  }

  async getBomPriceTexts(): Promise<string[]> {
    const handles = await this.bomPriceItems().all();
    return Promise.all(handles.map(h => h.textContent().then(t => t ?? '')));
  }

  async clickExportTab(): Promise<void> {
    await this.exportTab().click();
  }
}
