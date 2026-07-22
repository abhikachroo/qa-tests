import { expect } from '@playwright/test';
import { GuestCheckoutPage } from '@pages/GuestCheckoutPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export type GuestCheckoutData = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
};

export class GuestCheckoutModule {
  private logger: Logger;

  constructor(private guestCheckoutPage: GuestCheckoutPage) {
    this.logger = new Logger('GuestCheckoutModule');
  }

  async openStorefront(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening storefront as guest`);
    await this.guestCheckoutPage.navigate('/');
    await this.guestCheckoutPage.waitForPageLoad();
    await this.guestCheckoutPage.dismissCookieBannerIfPresent();
  }

  async openCheckoutEntry(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening checkout entry as guest`);
    await this.guestCheckoutPage.navigate('/checkout');
    await this.guestCheckoutPage.waitForPageLoad();
    await this.guestCheckoutPage.dismissCookieBannerIfPresent();
  }

  async searchProductFromHeader(productId: string): Promise<void> {
    this.logger.info(`Searching product from header: ${productId}`);
    await this.openStorefront();
    await this.guestCheckoutPage.focusHeaderSearch();
    await this.guestCheckoutPage.fillSearchDialog(productId);
    await this.guestCheckoutPage.submitSearchDialog();
    await this.guestCheckoutPage.waitForPageLoad();
  }

  async addProductToCart(productId: string): Promise<void> {
    this.logger.info(`Adding product to cart: ${productId}`);
    await this.guestCheckoutPage.clickAddToCart(productId);
    await this.guestCheckoutPage.waitForPageLoad();
  }

  async searchAndAddProduct(productId: string): Promise<void> {
    await this.searchProductFromHeader(productId);
    await this.addProductToCart(productId);
  }

  async openCartFromHeader(): Promise<void> {
    this.logger.info('Opening cart from header');
    await this.guestCheckoutPage.openCart();
    await this.guestCheckoutPage.waitForPageLoad();
  }

  async startGuestCheckout(): Promise<void> {
    this.logger.info('Starting guest checkout');
    await this.guestCheckoutPage.clickCheckout();
    await this.guestCheckoutPage.waitForPageLoad();
    await this.guestCheckoutPage.clickGuestCheckout();
    await this.guestCheckoutPage.waitForPageLoad();
  }

  async fillGuestContactAndAddress(data: GuestCheckoutData): Promise<void> {
    this.logger.info(`Filling guest checkout contact and address for generated email: ${data.email}`);
    await this.guestCheckoutPage.fillGuestEmail(data.email);
    await this.guestCheckoutPage.fillFirstName(data.firstName);
    await this.guestCheckoutPage.fillLastName(data.lastName);
    await this.guestCheckoutPage.fillPhone(data.phone);
    await this.guestCheckoutPage.fillAddress(data.address);
    await this.guestCheckoutPage.fillPostalCode(data.postalCode);
    await this.guestCheckoutPage.fillCity(data.city);
  }

  async continueCheckout(): Promise<void> {
    this.logger.info('Continuing guest checkout');
    await this.guestCheckoutPage.clickContinue();
    await this.guestCheckoutPage.waitForPageLoad();
  }

  async submitFinalOrder(): Promise<void> {
    this.logger.warn('Submitting final guest checkout order; ensure this is allowed for the target preprod environment');
    await this.guestCheckoutPage.clickFinalSubmit();
    await this.guestCheckoutPage.waitForPageLoad();
  }

  async verifyStorefrontSearchAvailable(): Promise<void> {
    await expect(this.guestCheckoutPage.headerSearchInput(), 'Header search input should be available to guests').toBeVisible();
    await expect(this.guestCheckoutPage.headerSearchInput(), 'Header search input should be interactive').toBeEnabled();
  }

  async verifyCheckoutEntryForGuest(): Promise<void> {
    await expect(this.guestCheckoutPage.emptyCartMessageArea(), 'Guest checkout/cart entry should show a cart state').toBeVisible();
    await expect(this.guestCheckoutPage.loginButton(), 'Login link should remain optional').toBeVisible();
    await expect(this.guestCheckoutPage.signUpButton(), 'Sign-up link should remain optional').toBeVisible();
  }

  async verifySearchResultContainsProduct(productId: string): Promise<void> {
    await expect(this.guestCheckoutPage.productCountSummary(), 'Product count summary should be visible').toBeVisible();
    await expect(this.guestCheckoutPage.productIdText(productId), `Product ID ${productId} should be visible`).toBeVisible();
  }

  async verifyProductInCart(productId: string): Promise<void> {
    await expect(this.guestCheckoutPage.productIdText(productId), `Cart should contain product ${productId}`).toBeVisible();
    await expect(this.guestCheckoutPage.checkoutButton(), 'Checkout action should be available').toBeEnabled();
  }

  async verifyEmptyCartState(): Promise<void> {
    await expect(this.guestCheckoutPage.emptyCartMessageArea(), 'Empty cart message area should be visible').toBeVisible();
    await expect(this.guestCheckoutPage.emptyCartMessageBoard(), 'Empty cart message board should be visible').toBeVisible();
    await expect(this.guestCheckoutPage.checkoutButton(), 'Checkout should not be enabled for empty cart').toBeDisabled();
    await expect(this.guestCheckoutPage.exploreCategoriesButton(), 'Explore categories should be available').toBeVisible();
  }

  async verifyCheckoutValidationVisible(): Promise<void> {
    await expect(this.guestCheckoutPage.validationMessage(), 'Validation message should be visible').toBeVisible();
  }

  async verifyFinalSubmitEnabled(productId: string): Promise<void> {
    await expect(this.guestCheckoutPage.productIdText(productId), `Order summary should contain product ${productId}`).toBeVisible();
    await expect(this.guestCheckoutPage.finalSubmitButton(), 'Final order submit should be enabled').toBeEnabled();
  }

  async verifyOrderSuccess(): Promise<void> {
    await expect(this.guestCheckoutPage.orderSuccessMessage(), 'Order success signal should be visible').toBeVisible();
  }

  async verifyDuplicateSubmissionGuarded(): Promise<void> {
    await expect(this.guestCheckoutPage.finalSubmitButton(), 'Final submit should be disabled while processing').toBeDisabled();
  }
}
