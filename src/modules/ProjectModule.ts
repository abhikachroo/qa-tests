import { expect } from '@playwright/test';
import { ProjectPage } from '@pages/ProjectPage';
import { Logger } from '@utils/Logger';
import { DataGenerator } from '@utils/DataGenerator';
import { config } from '@config/index';

export class ProjectModule {
  private logger: Logger;

  constructor(
    private projectPage: ProjectPage,
  ) {
    this.logger = new Logger('ProjectModule');
  }

  /**
   * Create a new project with an auto-generated name.
   * Returns the project name used.
   */
  async createProject(name?: string): Promise<string> {
    const projectName = name ?? DataGenerator.projectName();
    this.logger.info(`[${config.opco}][${config.environment}] Creating project: "${projectName}"`);
    await this.projectPage.fillProjectName(projectName);
    await this.projectPage.clickCreateProject();
    await this.projectPage.waitForPageLoad();
    this.logger.info('Project created');
    return projectName;
  }

  /**
   * Create a new switchboard with an auto-generated name.
   * Returns the switchboard name used.
   */
  async createSwitchboard(name?: string): Promise<string> {
    const switchboardName = name ?? DataGenerator.switchboardName();
    this.logger.info(`Creating switchboard: "${switchboardName}"`);
    await this.projectPage.fillSwitchboardName(switchboardName);
    await this.projectPage.clickCreateSwitchboard();
    await this.projectPage.waitForPageLoad();
    this.logger.info('Switchboard created');
    return switchboardName;
  }

  /**
   * Verify the Select Products page heading is visible after creation.
   */
  async verifyOnSelectProductsPage(): Promise<void> {
    this.logger.info('Verifying arrival on Select Products page');
    await expect(
      this.projectPage.selectProductsHeading(),
      'Select Products heading should be visible',
    ).toBeVisible();
    this.logger.info('On Select Products page confirmed');
  }
}
