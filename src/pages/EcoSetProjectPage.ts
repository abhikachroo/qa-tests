import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * EcoSetProjectPage — covers the Project creation wizard, Switchboard creation,
 * and the Contact Us panel within EcoSet Config.
 */
export class EcoSetProjectPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // --- Contact Us ---------------------------------------------------------
  contactUsBtn = (): Locator =>
    this.page.getByRole('button', { name: /contact us|contact/i });

  contactUsPanel = (): Locator =>
    this.page.locator('[class*="contact"], [class*="support"], [aria-label*="contact" i]').first();

  contactEmailText = (email: string): Locator =>
    this.page.getByText(email);

  contactPhoneText = (phone: string): Locator =>
    this.page.getByText(phone);

  // --- Project creation ---------------------------------------------------
  newProjectBtn = (): Locator =>
    this.page.getByRole('button', { name: /new project|create project|\+ project/i });

  projectNameInput = (): Locator =>
    this.page.getByRole('textbox', { name: /project name|name/i });

  confirmProjectBtn = (): Locator =>
    this.page.getByRole('button', { name: /create|confirm|save|ok/i });

  // --- Switchboard creation -----------------------------------------------
  newSwitchboardBtn = (): Locator =>
    this.page.getByRole('button', { name: /new switchboard|add switchboard|\+ switchboard/i });

  switchboardNameInput = (): Locator =>
    this.page.getByRole('textbox', { name: /switchboard name|name/i });

  confirmSwitchboardBtn = (): Locator =>
    this.page.getByRole('button', { name: /create|confirm|save|ok/i });

  /** Heading on the Select Products page — confirms navigation succeeded */
  selectProductsHeading = (): Locator =>
    this.page.getByRole('heading', { name: /select products|products|catalogue/i });

  // --- Actions ------------------------------------------------------------
  async clickContactUs(): Promise<void> {
    await this.contactUsBtn().click();
  }

  async clickNewProject(): Promise<void> {
    await this.newProjectBtn().click();
  }

  async fillProjectName(name: string): Promise<void> {
    await this.projectNameInput().fill(name);
  }

  async clickConfirmProject(): Promise<void> {
    await this.confirmProjectBtn().click();
  }

  async clickNewSwitchboard(): Promise<void> {
    await this.newSwitchboardBtn().click();
  }

  async fillSwitchboardName(name: string): Promise<void> {
    await this.switchboardNameInput().fill(name);
  }

  async clickConfirmSwitchboard(): Promise<void> {
    await this.confirmSwitchboardBtn().click();
  }
}
