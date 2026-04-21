import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DesignPage — Switchboard design / device mounting / 2D view
 * Selectors are approximate — TODO: verify via live UI inspection.
 */
export class DesignPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Device mounting
  // TODO: verify selector
  unplacedDeviceItems = () => this.page.locator('[data-testid="unplaced-device"], [class*="unplaced"]');
  mountAllBtn         = () => this.page.getByRole('button', { name: /mount all|place all|auto.*place/i });

  // 2D view canvas
  // TODO: verify selector
  twoDViewCanvas      = () => this.page.locator('[data-testid="2d-view"], [class*="2d-view"], [class*="enclosure-view"]');

  // Total amount
  // TODO: verify selector
  totalAmountText     = () => this.page.getByText(/total.*€|€.*total/i);

  // BOM navigation
  // TODO: verify selector
  bomTab              = () => this.page.getByRole('tab', { name: /bill of material|BOM/i });

  async clickMountAll(): Promise<void> {
    await this.mountAllBtn().click();
  }

  async getTotalAmountText(): Promise<string> {
    return (await this.totalAmountText().textContent()) ?? '';
  }

  async getUnplacedDeviceCount(): Promise<number> {
    return this.unplacedDeviceItems().count();
  }

  async clickBomTab(): Promise<void> {
    await this.bomTab().click();
  }
}
