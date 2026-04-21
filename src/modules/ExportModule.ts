import { expect, Download } from '@playwright/test';
import { ExportPage } from '@pages/ExportPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';
import * as path from 'path';
import * as fs from 'fs';

export class ExportModule {
  private logger: Logger;

  constructor(
    private exportPage: ExportPage,
  ) {
    this.logger = new Logger('ExportModule');
  }

  /**
   * Trigger bulk export and wait for the download event.
   * Returns the Download object for further inspection.
   */
  async triggerBulkExport(): Promise<Download> {
    this.logger.info(`[${config.opco}][${config.environment}] Triggering bulk export`);
    const download = await this.exportPage.waitForDownload();
    this.logger.info(`Bulk export download started: ${download.suggestedFilename()}`);
    return download;
  }

  /**
   * Save a download to a temp path and return it for zip inspection.
   */
  async saveDownload(download: Download, filename: string = 'bulk-export.zip'): Promise<string> {
    const savePath = path.join('test-results', filename);
    await download.saveAs(savePath);
    expect(fs.existsSync(savePath), `Downloaded file should exist at: ${savePath}`).toBe(true);
    this.logger.info(`Download saved to: ${savePath}`);
    return savePath;
  }

  /**
   * Verify the exported zip filename ends with .zip.
   */
  async verifyZipFilename(download: Download): Promise<void> {
    const filename = download.suggestedFilename();
    this.logger.info(`Verifying zip filename: "${filename}"`);
    expect(filename, 'Export file should have .zip extension').toMatch(/\.zip$/i);
  }
}
