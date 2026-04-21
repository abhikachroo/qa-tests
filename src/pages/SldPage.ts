import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SldPage — Single Line Diagram view
 * Selectors are approximate — TODO: verify via live UI inspection.
 */
export class SldPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // TODO: verify selector
  sldCanvas        = () => this.page.locator('[data-testid="sld-canvas"], [class*="sld-diagram"], [class*="single-line"]');
  sldProductNodes  = () => this.page.locator('[data-testid="sld-node"], [class*="sld-node"]');
  totalAmountText  = () => this.page.getByText(/total.*€|€.*total/i);

  // Design switchboard navigation
  // TODO: verify selector
  designBtn        = () => this.page.getByRole('button', { name: /design.*switchboard|design/i });

  async getSldNodeCount(): Promise<number> {
    return this.sldProductNodes().count();
  }

  async getTotalAmountText(): Promise<string> {
    return (await this.totalAmountText().textContent()) ?? '';
  }

  async clickDesignSwitchboard(): Promise<void> {
    await this.designBtn().click();
  }
}
