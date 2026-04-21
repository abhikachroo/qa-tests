import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * ProjectPage — Project & Switchboard creation
 * Selectors are approximate — TODO: verify via live UI inspection.
 */
export class ProjectPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Project creation form
  // TODO: verify selector
  projectNameInput     = () => this.page.getByLabel(/project name/i);
  createProjectBtn     = () => this.page.getByRole('button', { name: /create project|new project/i });
  projectCreatedMsg    = () => this.page.getByText(/project created|project added/i);

  // Switchboard creation form
  // TODO: verify selector
  switchboardNameInput = () => this.page.getByLabel(/switchboard name|cubicle name/i);
  createSwitchboardBtn = () => this.page.getByRole('button', { name: /create switchboard|add switchboard|new switchboard/i });
  switchboardCreatedMsg = () => this.page.getByText(/switchboard created|switchboard added/i);

  // Select Products page indicator
  // TODO: verify selector
  selectProductsHeading = () => this.page.getByRole('heading', { name: /select products|add products/i });

  async fillProjectName(name: string): Promise<void> {
    await this.projectNameInput().fill(name);
  }

  async clickCreateProject(): Promise<void> {
    await this.createProjectBtn().click();
  }

  async fillSwitchboardName(name: string): Promise<void> {
    await this.switchboardNameInput().fill(name);
  }

  async clickCreateSwitchboard(): Promise<void> {
    await this.createSwitchboardBtn().click();
  }
}
