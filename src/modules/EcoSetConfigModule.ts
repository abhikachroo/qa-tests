import { Page, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { EcoSetProjectPage } from '@pages/EcoSetProjectPage';
import { EcoSetProductsPage } from '@pages/EcoSetProductsPage';
import { Logger } from '@utils/Logger';
import { DataGenerator } from '@utils/DataGenerator';
import { config } from '@config/index';

export class EcoSetConfigModule {
  private logger: Logger;

  constructor(
    private page: Page,
    private loginPage: LoginPage,
    private projectPage: EcoSetProjectPage,
    private productsPage: EcoSetProductsPage,
  ) {
    this.logger = new Logger('EcoSetConfigModule');
  }

  // -------------------------------------------------------------------------
  // Country / Language
  // -------------------------------------------------------------------------

  /**
   * Verify that France (English) is the active country/language.
   * Asserts that the user-menu or page locale indicator shows "France".
   */
  async verifyFranceEnglishSelected(): Promise<void> {
    this.logger.info('Verifying France / English is selected');
    await expect(
      this.page.getByText(/france/i).first(),
      'France should be visible as the selected country',
    ).toBeVisible();
    this.logger.info('France / English country verified');
  }

  // -------------------------------------------------------------------------
  // Contact Us
  // -------------------------------------------------------------------------

  /**
   * Open the Contact Us panel and verify email + phone number.
   */
  async verifyContactDetails(): Promise<void> {
    this.logger.info(`[${config.opco}] Verifying contact details`);
    await this.projectPage.clickContactUs();
    await expect(
      this.projectPage.contactEmailText(config.contactEmail),
      `Contact email should be: ${config.contactEmail}`,
    ).toBeVisible();
    await expect(
      this.projectPage.contactPhoneText(config.contactPhone),
      `Contact phone should be: ${config.contactPhone}`,
    ).toBeVisible();
    this.logger.info('Contact details verified');
  }

  // -------------------------------------------------------------------------
  // Project & Switchboard creation
  // -------------------------------------------------------------------------

  /**
   * Create a new project and a new switchboard, then assert we arrive at
   * the Select Products page.
   * Returns the generated project name for later assertions.
   */
  async createProjectAndSwitchboard(): Promise<{ projectName: string; switchboardName: string }> {
    const projectName    = DataGenerator.projectName();
    const switchboardName = DataGenerator.switchboardName();
    this.logger.info(`Creating project: "${projectName}" with switchboard: "${switchboardName}"`);

    await this.projectPage.clickNewProject();
    await this.projectPage.fillProjectName(projectName);
    await this.projectPage.clickConfirmProject();
    await this.page.waitForLoadState('networkidle');

    await this.projectPage.clickNewSwitchboard();
    await this.projectPage.fillSwitchboardName(switchboardName);
    await this.projectPage.clickConfirmSwitchboard();
    await this.page.waitForLoadState('networkidle');

    this.logger.info('Project and Switchboard created');
    return { projectName, switchboardName };
  }

  /**
   * Assert that the Select Products page heading is visible.
   */
  async verifyOnSelectProductsPage(): Promise<void> {
    this.logger.info('Verifying Select Products page is displayed');
    await expect(
      this.projectPage.selectProductsHeading(),
      'Select Products heading should be visible after switchboard creation',
    ).toBeVisible();
    this.logger.info('Select Products page confirmed');
  }

  // -------------------------------------------------------------------------
  // Products — EUR pricing
  // -------------------------------------------------------------------------

  /**
   * Add one product from the catalogue.
   */
  async addOneProduct(): Promise<void> {
    this.logger.info('Adding a product from the catalogue');
    await this.productsPage.clickAddProduct();
    await this.page.waitForLoadState('networkidle');
    this.logger.info('Product added');
  }

  /**
   * Verify that at least one price cell shows EUR currency (€).
   */
  async verifyEurPricingVisible(): Promise<void> {
    this.logger.info('Verifying EUR pricing is displayed');
    await expect(
      this.productsPage.eurPriceCell(),
      'At least one EUR price (€) should be visible in the products list',
    ).toBeVisible();
    this.logger.info('EUR pricing verified');
  }

  /**
   * Verify Total Amount field is visible and contains EUR symbol.
   */
  async verifyTotalAmountEur(): Promise<void> {
    this.logger.info('Verifying Total Amount is displayed in EUR');
    await expect(
      this.productsPage.totalAmountValue(),
      'Total Amount field should be visible',
    ).toBeVisible();
    const totalText = await this.productsPage.getTotalAmountText();
    this.logger.info(`Total Amount text: "${totalText}"`);
    expect(totalText, 'Total Amount should contain EUR symbol €').toMatch(/€/);
  }

  // -------------------------------------------------------------------------
  // Single Line Diagram
  // -------------------------------------------------------------------------

  /**
   * Navigate to the SLD tab and verify the diagram is rendered.
   */
  async navigateToSldAndVerify(): Promise<void> {
    this.logger.info('Navigating to Single Line Diagram tab');
    await this.productsPage.clickSldTab();
    await this.page.waitForLoadState('networkidle');
    await expect(
      this.productsPage.sldCanvas(),
      'SLD canvas or SVG should be visible',
    ).toBeVisible();
    await expect(
      this.productsPage.sldTotalAmount(),
      'Total Amount in EUR should be visible on SLD tab',
    ).toBeVisible();
    this.logger.info('SLD verified');
  }

  // -------------------------------------------------------------------------
  // Design / 2D view
  // -------------------------------------------------------------------------

  /**
   * Navigate to the Design tab and verify the 2D view.
   */
  async navigateToDesignAndVerify(): Promise<void> {
    this.logger.info('Navigating to Design (2D) tab');
    await this.productsPage.clickDesignTab();
    await this.page.waitForLoadState('networkidle');
    await expect(
      this.productsPage.designTwoDView(),
      '2D design view should be visible',
    ).toBeVisible();
    await expect(
      this.productsPage.designTotalAmount(),
      'Total Amount in EUR should be visible on Design tab',
    ).toBeVisible();
    this.logger.info('Design 2D view verified');
  }

  // -------------------------------------------------------------------------
  // Bill of Materials
  // -------------------------------------------------------------------------

  /**
   * Navigate to BOM tab and verify EUR prices and Total Amount.
   */
  async navigateToBomAndVerify(): Promise<void> {
    this.logger.info('Navigating to Bill of Materials tab');
    await this.productsPage.clickBomTab();
    await this.page.waitForLoadState('networkidle');
    await expect(
      this.productsPage.bomTable(),
      'BOM table should be visible',
    ).toBeVisible();
    await expect(
      this.productsPage.bomEurPriceCell(),
      'EUR price cell in BOM should be visible',
    ).toBeVisible();
    const bomTotal = await this.productsPage.getBomTotalText();
    this.logger.info(`BOM Total Amount: "${bomTotal}"`);
    expect(bomTotal, 'BOM Total Amount should contain EUR symbol €').toMatch(/€/);
    this.logger.info('BOM verified');
  }

  // -------------------------------------------------------------------------
  // Bulk Export
  // -------------------------------------------------------------------------

  /**
   * Navigate to Export tab, trigger Bulk Export and wait for the download
   * success indicator.
   */
  async performBulkExportAndVerify(): Promise<void> {
    this.logger.info('Navigating to Export tab');
    await this.productsPage.clickExportTab();
    await this.page.waitForLoadState('networkidle');
    this.logger.info('Triggering Bulk Export');
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.productsPage.clickBulkExport(),
    ]);
    const filename = download.suggestedFilename();
    this.logger.info(`Export download started: "${filename}"`);
    expect(filename, 'Downloaded file should be a zip archive').toMatch(/\.zip$/i);
    this.logger.info('Bulk Export download verified');
  }
}
