import { Page, Download } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ExportPage — Export dialog / panel in EcoSet Configurator.
 *
 * Locators are arrow functions. Zero business logic.
 * Download triggering and content parsing live in ExportModule.
 */
export class ExportPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Export dialog / panel ───────────────────────────────────────────────
  exportDialog         = () => this.page.locator('[data-testid="export-dialog"], .export-panel, [role="dialog"]').first(); // TODO: verify selector
  exportTitle          = () => this.page.getByRole('heading', { name: /export/i }).first();

  // ── Export type checkboxes / options ────────────────────────────────────
  /** "Bulk export" checkbox — exports everything including SLD */
  bulkExportCheckbox   = () => this.page.getByRole('checkbox', { name: /bulk export|tout exporter/i }).first(); // TODO: verify selector

  /** "SLD" checkbox inside the bulk export panel */
  sldCheckbox          = () => this.page.getByRole('checkbox', { name: /sld|single line diagram/i }).first(); // TODO: verify selector

  /** "Raw / category SLD" export option */
  rawSLDOption         = () => this.page.getByRole('radio', { name: /raw|catégorie|category sld/i }).first(); // TODO: verify selector

  // ── Action buttons ───────────────────────────────────────────────────────
  downloadBtn          = () => this.page.getByRole('button', { name: /download|télécharger|export/i }).first();
  cancelBtn            = () => this.page.getByRole('button', { name: /cancel|annuler/i }).first();

  // ── Status / feedback ────────────────────────────────────────────────────
  successToast         = () => this.page.locator('[data-testid="export-success"], .toast-success, [role="status"]').first(); // TODO: verify selector
  errorToast           = () => this.page.locator('[data-testid="export-error"], .toast-error, [role="alert"]').first(); // TODO: verify selector

  // ── Actions ──────────────────────────────────────────────────────────────
  async checkBulkExport(): Promise<void> {
    const cb = this.bulkExportCheckbox();
    if (!(await cb.isChecked())) {
      await cb.check();
    }
  }

  async checkSLDOption(): Promise<void> {
    const cb = this.sldCheckbox();
    if (!(await cb.isChecked())) {
      await cb.check();
    }
  }

  async selectRawSLDOption(): Promise<void> {
    await this.rawSLDOption().check();
  }

  async clickDownload(): Promise<void> {
    await this.downloadBtn().click();
  }

  async clickCancel(): Promise<void> {
    await this.cancelBtn().click();
  }

  /**
   * Trigger download and return the Download object.
   * Uses page.waitForEvent('download') to capture the browser download event.
   */
  async triggerDownloadAndCapture(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadBtn().click(),
    ]);
    return download;
  }

  async isSuccessToastVisible(): Promise<boolean> {
    return this.successToast().isVisible({ timeout: 10_000 }).catch(() => false);
  }
}
