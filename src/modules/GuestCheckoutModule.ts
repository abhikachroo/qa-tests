import { expect } from '@playwright/test';
import { HomePage } from '@pages/HomePage';
import { SearchModule } from '@modules/SearchModule';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { CartPage } from '@pages/CartPage';
import { CheckoutPage, GuestCheckoutProfile } from '@pages/CheckoutPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class GuestCheckoutModule {
  private logger: Logger;

  constructor(
    private homePage: HomePage,
    private searchModule: SearchModule,
    private searchResultsPage: SearchResultsPage,
    private cartPage: CartPage,
    private checkoutPage: CheckoutPage,
  ) {
    this.logger = new Logger('GuestCheckoutModule');
  }

  async searchForProduct(productId: string): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Searching product ${productId}`);
    await this.searchModule.submitSearch(productId);
  }

  async verifyProductVisible(productId: string): Promise<void> {
    this.logger.info(`Verifying product ${productId} is visible`);
    await expect(this.searchResultsPage.productCountSummary()).toBeVisible();
    await expect(this.searchResultsPage.productIdText(productId)).toBeVisible();
  }

  async addProductToCart(productId: string): Promise<void> {
    this.logger.info(`Adding product ${productId} to cart`);
    await this.searchResultsPage.clickProductCardAddToCart(productId);
  }

  async openCartFromHeader(): Promise<void> {
    this.logger.info('Opening cart from header');
    await this.homePage.clickCartButton();
    await this.cartPage.waitForPageLoad();
  }

  async verifyProductInCart(productId: string): Promise<void> {
    this.logger.info(`Verifying product ${productId} appears in cart`);
    await expect(this.cartPage.cartLineItem(productId)).toBeVisible();
    await expect(this.cartPage.proceedToCheckoutButton()).toBeEnabled();
  }

  async verifyEmptyCart(): Promise<void> {
    this.logger.info('Verifying empty cart state');
    await expect(this.cartPage.emptyCartMessage()).toBeVisible();
    await expect(this.cartPage.shoppingRecoveryLink()).toBeVisible();
    await expect(this.cartPage.proceedToCheckoutButton()).not.toBeVisible();
  }

  async proceedToCheckout(): Promise<void> {
    this.logger.info('Proceeding to checkout');
    await this.cartPage.clickProceedToCheckout();
    await this.checkoutPage.waitForPageLoad();
  }

  async continueAsGuest(): Promise<void> {
    this.logger.info('Continuing checkout as guest');
    await this.checkoutPage.clickGuestCheckout();
  }

  async fillGuestProfile(profile: GuestCheckoutProfile): Promise<void> {
    this.logger.info('Filling guest checkout profile');
    await this.checkoutPage.fillEmail(profile.email);
    await this.checkoutPage.fillFirstName(profile.firstName);
    await this.checkoutPage.fillLastName(profile.lastName);
    await this.checkoutPage.fillPhone(profile.phone);
    await this.checkoutPage.fillAddressLine1(profile.addressLine1);
    await this.checkoutPage.fillPostalCode(profile.postalCode);
    await this.checkoutPage.fillCity(profile.city);
  }

  async submitCheckoutStep(): Promise<void> {
    this.logger.info('Submitting current checkout step');
    await this.checkoutPage.clickContinue();
  }

  async verifyValidationDisplayed(): Promise<void> {
    this.logger.info('Verifying checkout validation is displayed');
    await expect(this.checkoutPage.validationError()).toBeVisible();
  }

  async verifyFinalReviewAvailable(): Promise<void> {
    this.logger.info('Verifying final review or place-order action is available');
    await expect(this.checkoutPage.finalReviewHeading().or(this.checkoutPage.placeOrderButton())).toBeVisible();
  }

  async placeOrder(): Promise<void> {
    this.logger.info('Placing guest checkout order');
    await this.checkoutPage.clickPlaceOrder();
  }

  async verifyOrderConfirmation(): Promise<void> {
    this.logger.info('Verifying guest checkout order confirmation');
    await expect(this.checkoutPage.orderConfirmation()).toBeVisible();
  }
}
