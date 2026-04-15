import { expect } from '@playwright/test';
import { CheckoutPage } from '@pages/CheckoutPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

/**
 * CheckoutModule — Layer 3
 * Business workflows for completing a guest checkout.
 * Orchestrates CheckoutPage — never calls page.locator() directly.
 *
 * NOTE: The checkout form field structure is approximated from standard
 * e-commerce patterns. Selectors in CheckoutPage may need updating once
 * the real checkout form is inspected end-to-end in preprod.
 */
export class CheckoutModule {
  private logger: Logger;

  constructor(private checkoutPage: CheckoutPage) {
    this.logger = new Logger('CheckoutModule');
  }

  /**
   * Fill in the guest contact and delivery details.
   * All field values come from the config or generated test data passed in.
   */
  async fillGuestDetails(details: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    addressLine1: string;
    city: string;
    postcode: string;
  }): Promise<void> {
    this.logger.info(
      `[${config.opco}][${config.environment}] Filling guest checkout details for: ${details.email}`,
    );
    await this.checkoutPage.fillEmail(details.email);
    await this.checkoutPage.fillFirstName(details.firstName);
    await this.checkoutPage.fillLastName(details.lastName);
    await this.checkoutPage.fillPhone(details.phone);
    await this.checkoutPage.fillAddressLine1(details.addressLine1);
    await this.checkoutPage.fillCity(details.city);
    await this.checkoutPage.fillPostcode(details.postcode);
    this.logger.info('Guest details form filled');
  }

  /**
   * Advance through checkout steps using the Continue button.
   * Call once per step that requires advancing.
   */
  async advanceToNextStep(): Promise<void> {
    this.logger.info('Advancing to next checkout step');
    await this.checkoutPage.clickContinue();
    await this.checkoutPage.waitForPageLoad();
  }

  /**
   * Submit the final order.
   */
  async submitOrder(): Promise<void> {
    this.logger.info('Submitting order');
    await this.checkoutPage.clickPlaceOrder();
    await this.checkoutPage.waitForPageLoad();
    this.logger.info('Order submit action completed');
  }

  /**
   * Verify the order confirmation page is displayed.
   */
  async verifyOrderConfirmation(): Promise<void> {
    this.logger.info('Verifying order confirmation state');
    await expect(
      this.checkoutPage.orderConfirmationHeading(),
      'Order confirmation heading should be visible after successful order placement',
    ).toBeVisible();
    const ref = await this.checkoutPage.getOrderReference();
    this.logger.info(`Order confirmed. Reference: ${ref}`);
  }

  /**
   * Verify the guest is on the checkout page (URL assertion).
   */
  async verifyOnCheckoutPage(): Promise<void> {
    this.logger.info('Verifying checkout page URL');
    await expect(
      this.checkoutPage['page'],
      'URL should contain /checkout/ after clicking checkout as guest',
    ).toHaveURL(/\/checkout\//);
  }
}
