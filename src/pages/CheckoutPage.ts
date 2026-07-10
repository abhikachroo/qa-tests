import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type GuestCheckoutProfile = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  postalCode: string;
  city: string;
};

export class CheckoutPage extends BasePage {
  constructor(page: Page) { super(page); }

  guestCheckoutButton = () =>
    this.page.getByRole('button', { name: /guest|continue as guest|invité|sans compte/i }).first(); // TODO: verify selector

  emailInput = () =>
    this.page.getByLabel(/email|e-mail/i).or(this.page.getByPlaceholder(/email|e-mail/i)).first();

  firstNameInput = () =>
    this.page.getByLabel(/first name|firstname|prénom/i).or(this.page.getByPlaceholder(/first name|firstname|prénom/i)).first();

  lastNameInput = () =>
    this.page.getByLabel(/last name|lastname|nom/i).or(this.page.getByPlaceholder(/last name|lastname|nom/i)).first();

  phoneInput = () =>
    this.page.getByLabel(/phone|mobile|téléphone/i).or(this.page.getByPlaceholder(/phone|mobile|téléphone/i)).first();

  addressLine1Input = () =>
    this.page.getByLabel(/address|adresse/i).or(this.page.getByPlaceholder(/address|adresse/i)).first();

  postalCodeInput = () =>
    this.page.getByLabel(/postal|zip|code postal/i).or(this.page.getByPlaceholder(/postal|zip|code postal/i)).first();

  cityInput = () =>
    this.page.getByLabel(/city|ville/i).or(this.page.getByPlaceholder(/city|ville/i)).first();

  continueButton = () =>
    this.page.getByRole('button', { name: /continue|next|suivant|valider|continuer/i }).first();

  placeOrderButton = () =>
    this.page.getByRole('button', { name: /place order|submit order|confirm order|commander|confirmer/i }).first();

  validationError = () =>
    this.page.getByRole('alert').or(this.page.getByText(/required|invalid|obligatoire|invalide/i)).first();

  finalReviewHeading = () =>
    this.page.getByRole('heading', { name: /review|summary|récapitulatif|confirmation/i }).first();

  orderConfirmation = () =>
    this.page.getByText(/order confirmed|thank you|confirmation|commande confirmée|merci/i).first();

  async clickGuestCheckout(): Promise<void> {
    await this.guestCheckoutButton().click();
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput().fill(email);
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput().fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput().fill(lastName);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput().fill(phone);
  }

  async fillAddressLine1(addressLine1: string): Promise<void> {
    await this.addressLine1Input().fill(addressLine1);
  }

  async fillPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput().fill(postalCode);
  }

  async fillCity(city: string): Promise<void> {
    await this.cityInput().fill(city);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton().click();
  }

  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderButton().click();
  }
}
