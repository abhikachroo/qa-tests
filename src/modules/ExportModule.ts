import * as fs   from 'fs';
import { expect }      from '@playwright/test';
import { ExportPage }  from '@pages/ExportPage';
import { Logger }      from '@utils/Logger';
import { config }      from '@config/index';

/**
 * ExportModule — business logic for the EcoSet Export feature.
 *
 * Handles bulk SLD export and raw/category SLD export flows.
 * Validates downloaded file content against in-app SLD quantities.
 *
 * NOTE: The exported SLD file format (PDF/SVG/XML) is currently unknown.
 * parseDownloadedSLD() uses SVG/XML/JSON heuristics.
 * // TODO: confirm exported SLD file format with the development team.
 */
export class ExportModule {
  private logger: Logger;

  constructor(private exportPage: ExportPage) {
    this.logger = new Logger('ExportModule');
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async navigateToExport(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Navigating to Export page`);
    await this.exportPage.navigate(config.exportPath ?? '/export');
    await this.exportPage.waitForPageLoad();
    await this.exportPage.dismissCookieBannerIfPresent();
    this.logger.info('Export page loaded');
  }

  // ── Bulk SLD export ──────────────────────────────────────────────────────

  async performBulkSLDExport(): Promise<string> {
    this.logger.info('Performing bulk export with SLD checkbox');
    await this.exportPage.checkBulkExport();
    await this.exportPage.checkSLDOption();
    const download = await this.exportPage.triggerDownloadAndCapture();
    const downloadPath = await download.path();
    if (!downloadPath) {
      throw new Error('Bulk SLD export: download path is null — download may have failed');
    }
    const content = fs.readFileSync(downloadPath, 'utf-8');
    this.logger.info(`Bulk SLD export downloaded: ${download.suggestedFilename()} (${content.length} bytes)`);
    return content;
  }

  async verifyBulkSLDDownloadSucceeded(): Promise<string> {
    this.logger.info('Verifying bulk SLD download');
    const content = await this.performBulkSLDExport();
    expect(content.length, 'Downloaded bulk SLD file should not be empty').toBeGreaterThan(0);
    this.logger.info('Bulk SLD download verified');
    return content;
  }

  // ── Raw / category SLD export ─────────────────────────────────────────────

  async performRawSLDExport(): Promise<string> {
    this.logger.info('Performing raw/category SLD export');
    await this.exportPage.selectRawSLDOption();
    const download = await this.exportPage.triggerDownloadAndCapture();
    const downloadPath = await download.path();
    if (!downloadPath) {
      throw new Error('Raw SLD export: download path is null — download may have failed');
    }
    const content = fs.readFileSync(downloadPath, 'utf-8');
    this.logger.info(`Raw SLD export downloaded: ${download.suggestedFilename()} (${content.length} bytes)`);
    return content;
  }

  async verifyRawSLDDownloadSucceeded(): Promise<string> {
    this.logger.info('Verifying raw SLD download');
    const content = await this.performRawSLDExport();
    expect(content.length, 'Downloaded raw SLD file should not be empty').toBeGreaterThan(0);
    this.logger.info('Raw SLD download verified');
    return content;
  }

  // ── Content validation ─────────────────────────────────────────────────────

  /**
   * Parse quantity values from an exported SLD file content string.
   * Supports SVG/XML/JSON formats.
   * // TODO: update once actual SLD file format is confirmed.
   */
  parseQuantitiesFromSLDContent(content: string): number[] {
    this.logger.info('Parsing quantities from SLD file content');

    const attrMatches = [...content.matchAll(/(?:qty|quantity|count)="(\d+)"/gi)].map(
      (m) => parseInt(m[1], 10),
    );
    const textMatches = [...content.matchAll(/<text[^>]*>(\d+)<\/text>/gi)].map(
      (m) => parseInt(m[1], 10),
    );
    const jsonMatches = [...content.matchAll(/"(?:qty|quantity|count)"\s*:\s*(\d+)/gi)].map(
      (m) => parseInt(m[1], 10),
    );

    const all = [...attrMatches, ...textMatches, ...jsonMatches].filter((n) => !isNaN(n) && n > 0);
    this.logger.info(`Parsed ${all.length} quantity value(s) from SLD content`, all);
    return all;
  }

  async verifyExportedSLDContainsQuantities(
    content: string,
    expectedQtys: number[],
    exportType: 'bulk' | 'raw' = 'bulk',
  ): Promise<void> {
    this.logger.info(`Verifying ${exportType} SLD content contains quantities`, expectedQtys);
    const parsedQtys = this.parseQuantitiesFromSLDContent(content);

    for (const qty of expectedQtys) {
      expect(
        parsedQtys,
        `${exportType} SLD file should contain quantity ${qty} — parsed: [${parsedQtys.join(', ')}]`,
      ).toContain(qty);
    }
    this.logger.info(`${exportType} SLD content quantity verification passed`);
  }

  async verifySLDFilesMatch(bulkContent: string, rawContent: string): Promise<void> {
    this.logger.info('Cross-validating bulk SLD vs raw SLD file quantities');
    const bulkQtys = this.parseQuantitiesFromSLDContent(bulkContent).sort((a, b) => a - b);
    const rawQtys  = this.parseQuantitiesFromSLDContent(rawContent).sort((a, b) => a - b);

    expect(
      bulkQtys,
      `Bulk SLD quantities [${bulkQtys}] should match raw SLD quantities [${rawQtys}]`,
    ).toEqual(rawQtys);
    this.logger.info('Both SLD export files contain matching quantities');
  }
}
