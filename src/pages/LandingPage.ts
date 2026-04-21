import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * LandingPage — Post-login landing / country picker / T&C screen
 * Selectors are approximate — TODO: verify via live UI inspection.
 */
export class LandingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // User menu / country selector
  // TODO: verify selector
  userMenuBtn         = () => this.page.getByRole('button', { name: /user|account|profile/i });
  countryOption       = (label: string) => this.page.getByRole('option', { name: label });
  countryMenuBtn      = () => this.page.getByRole('button', { name: /country|pays/i });
  selectedCountryText = () => this.page.getByTestId('selected-country');

  // Terms & Conditions
  // TODO: verify selector
  termsModal          = () => this.page.getByRole('dialog');
  acceptTermsBtn      = () => this.page.getByRole('button', { name: /accept|agree|ok/i });

  // Contact Us
  // TODO: verify selector
  contactUsBtn        = () => this.page.getByRole('button', { name: /contact us/i });
  contactUsPanel      = () => this.page.getByRole('dialog', { name: /contact/i });
  contactEmailText    = () => this.page.getByText(/za-ccc@schneider-electric\.com/i);
  contactPhoneText    = () => this.page.getByText(/\+27.*230.*5880/i);

  async clickUserMenu(): Promise<void> {
    await this.userMenuBtn().click();
  }

  async selectCountry(label: string): Promise<void> {
    await this.countryMenuBtn().click();
    await this.countryOption(label).click();
  }

  async clickAcceptTerms(): Promise<void> {
    await this.acceptTermsBtn().click();
  }

  async clickContactUs(): Promise<void> {
    await this.contactUsBtn().click();
  }

  async getContactEmail(): Promise<string> {
    return (await this.contactEmailText().textContent()) ?? '';
  }

  async getContactPhone(): Promise<string> {
    return (await this.contactPhoneText().textContent()) ?? '';
  }

  async isTermsModalVisible(): Promise<boolean> {
    return this.termsModal().isVisible({ timeout: 5_000 }).catch(() => false);
  }
}
