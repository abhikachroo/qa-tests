import { Page, Download } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ExportPage — Export / Bulk Export view
 * Selectors are approximate — TODO: verify via live UI inspection.
 */
export class ExportPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // TODO: verify selector
  bulkExportBtn      = () => this.page.getByRole('button', { name: /bulk export|export all/i });
  exportConfirmBtn   = () => this.page.getByRole('button', { name: /confirm|ok|export/i });
  downloadLink       = () => this.page.getByRole('link', { name: /download|zip/i });
  exportSuccessMsg   = () => this.page.getByText(/export.*complete|download.*ready|zip.*ready/i);

  async clickBulkExport(): Promise<void> {
    await this.bulkExportBtn().click();
  }

  async confirmExport(): Promise<void> {
    const confirmVisible = await this.exportConfirmBtn()
      .isVisible({ timeout: 3_000 })
      .catch(() => false);
    if (confirmVisible) {
      await this.exportConfirmBtn().click();
    }
  }

  async waitForDownload(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.bulkExportBtn().click(),
    ]);
    return download;
  }
}
