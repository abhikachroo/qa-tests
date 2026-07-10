import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class GuestCheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  headerSearchInput = (): Locator => this.page.getByRole('searchbox', { name: /search|rechercher/i }).first();
  searchDialogInput = (): Locator => this.page.getByRole('searchbox', { name: /search|rechercher/i }).last();
  searchInputFallback = (): Locator => this.page.getByTestId('search-bar-input');
  cartButton = (): Locator => this.page.getByTestId('cart-button');
  checkoutButton = (): Locator => this.page.getByTestId('checkout-button');
  emptyCartMessageArea = (): Locator => this.page.getByTestId('message-area');
  emptyCartMessageBoard = (): Locator => this.page.getByTestId('message-board');
  exploreCategoriesButton = (): Locator => this.page.getByTestId('messageboard-proceed-button');
  loginButton = (): Locator => this.page.getByTestId('login-button');
  signUpButton = (): Locator => this.page.getByTestId('signup-button');
  productCountSummary = (): Locator => this.page.getByText(/\d+\s+product/i);
  productCard = (productId: string): Locator =>
    this.page.getByText(productId, { exact: false }).first();
  productIdText = (productId: string): Locator => this.page.getByText(productId, { exact: false }).first();

  addToCartButtonForProduct = (productId: string): Locator =>
    this.page.getByRole('button', { name: /add to cart|ajouter au panier/i }).first(); // TODO: verify selector against populated product card
  unavailableProductMessage = (): Locator =>
    this.page.getByText(/unavailable|indisponible|not available|non disponible/i).first(); // TODO: verify selector once unavailable fixture exists
  cartLineItem = (productId: string): Locator =>
    this.page.locator('[data-testid="cart-line-item"]').filter({ hasText: productId }).first(); // TODO: verify selector against non-empty cart
  cartQuantityInput = (productId: string): Locator =>
    this.cartLineItem(productId).getByRole('spinbutton').first(); // TODO: verify selector against non-empty cart

  guestCheckoutButton = (): Locator =>
    this.page.getByRole('button', { name: /guest|invité|continuer/i }).first(); // TODO: verify selector when cart contains an item
  guestEmailInput = (): Locator =>
    this.page.getByLabel(/email|e-mail/i).first(); // TODO: verify checkout form label
  firstNameInput = (): Locator =>
    this.page.getByLabel(/first name|prénom/i).first(); // TODO: verify checkout form label
  lastNameInput = (): Locator =>
    this.page.getByLabel(/last name|nom/i).first(); // TODO: verify checkout form label
  phoneInput = (): Locator =>
    this.page.getByLabel(/phone|téléphone/i).first(); // TODO: verify checkout form label
  addressInput = (): Locator =>
    this.page.getByLabel(/address|adresse/i).first(); // TODO: verify checkout form label
  postalCodeInput = (): Locator =>
    this.page.getByLabel(/postal|postcode|code postal/i).first(); // TODO: verify checkout form label
  cityInput = (): Locator =>
    this.page.getByLabel(/city|ville/i).first(); // TODO: verify checkout form label
  continueButton = (): Locator =>
    this.page.getByRole('button', { name: /continue|continuer|next|suivant/i }).first(); // TODO: verify checkout continuation label
  finalSubmitButton = (): Locator =>
    this.page.getByRole('button', { name: /submit|place order|finaliser|commander|payer/i }).first(); // TODO: verify final submit label and policy
  orderSuccessMessage = (): Locator =>
    this.page.getByText(/thank you|merci|confirmation|order|commande/i).first(); // TODO: confirm agreed success signal
  validationMessage = (): Locator =>
    this.page.getByText(/required|obligatoire|invalid|invalide|erreur/i).first(); // TODO: verify validation copy
  loadingIndicator = (): Locator =>
    this.page.getByText(/loading|chargement|processing|traitement/i).first(); // TODO: verify loading copy

  async focusHeaderSearch(): Promise<void> {
    await this.headerSearchInput().click();
  }

  async fillSearchDialog(keyword: string): Promise<void> {
    await this.searchDialogInput().fill(keyword);
  }

  async submitSearchDialog(): Promise<void> {
    await this.searchDialogInput().press('Enter');
  }

  async clickAddToCart(productId: string): Promise<void> {
    await this.addToCartButtonForProduct(productId).click();
  }

  async openCart(): Promise<void> {
    await this.cartButton().click();
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton().click();
  }

  async clickExploreCategories(): Promise<void> {
    await this.exploreCategoriesButton().click();
  }

  async clickGuestCheckout(): Promise<void> {
    await this.guestCheckoutButton().click();
  }

  async fillGuestEmail(email: string): Promise<void> {
    await this.guestEmailInput().fill(email);
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

  async fillAddress(address: string): Promise<void> {
    await this.addressInput().fill(address);
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

  async clickFinalSubmit(): Promise<void> {
    await this.finalSubmitButton().click();
  }
}
