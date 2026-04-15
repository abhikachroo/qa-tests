import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CheckoutPage — Layer 2
 * Locators and simple UI actions for the Guest Checkout form pages.
 * URL pattern: /checkout/en-gb/... (multi-step or single-page checkout)
 *
 * NOTE: Exact field labels and selectors are approximated from standard
 * e-commerce patterns + Sonepar Spark preprod observation.
 * All selectors below are marked // TODO: verify selector where uncertain.
 */
export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Contact / Account step ──────────────────────────────────────────────────

  /** Email address input in the guest checkout contact step */
  // TODO: verify selector
  emailInput = () =>
    this.page.getByLabel(/email/i).or(this.page.getByPlaceholder(/email/i));

  /** First name input */
  // TODO: verify selector
  firstNameInput = () =>
    this.page.getByLabel(/first name/i).or(this.page.getByPlaceholder(/first name/i));

  /** Last name input */
  // TODO: verify selector
  lastNameInput = () =>
    this.page.getByLabel(/last name/i).or(this.page.getByPlaceholder(/last name/i));

  /** Phone / mobile number input */
  // TODO: verify selector
  phoneInput = () =>
    this.page.getByLabel(/phone|mobile|telephone/i).or(
      this.page.getByPlaceholder(/phone|mobile/i),
    );

  // ── Delivery address step ───────────────────────────────────────────────────

  /** Street / address line 1 input */
  // TODO: verify selector
  addressLine1Input = () =>
    this.page.getByLabel(/address line 1|street/i).or(
      this.page.getByPlaceholder(/street|address/i),
    );

  /** City input */
  // TODO: verify selector
  cityInput = () =>
    this.page.getByLabel(/city|town/i).or(this.page.getByPlaceholder(/city|town/i));

  /** Postcode / ZIP input */
  // TODO: verify selector
  postcodeInput = () =>
    this.page.getByLabel(/postcode|zip|postal/i).or(
      this.page.getByPlaceholder(/postcode|zip/i),
    );

  // ── Navigation / submission ─────────────────────────────────────────────────

  /** "Continue" / "Next" button to advance to next checkout step */
  // TODO: verify selector
  continueBtn = () =>
    this.page.getByRole('button', { name: /continue|next|proceed/i });

  /** "Place order" / "Submit order" final CTA */
  // TODO: verify selector
  placeOrderBtn = () =>
    this.page.getByRole('button', { name: /place order|submit order|confirm order|order now/i });

  /** Order confirmation heading / success state */
  // TODO: verify selector
  orderConfirmationHeading = () =>
    this.page.getByRole('heading', { name: /order (confirmed|placed|received|thank)/i }).or(
      this.page.getByText(/thank you for your order/i),
    );

  /** Order number / reference shown on confirmation page */
  // TODO: verify selector
  orderReference = () =>
    this.page.locator('[data-testid="order-number"], [data-testid="order-reference"], [class*="order-number"]').first();

  // ── Actions ──────────────────────────────────────────────────────────────────

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

  async fillAddressLine1(address: string): Promise<void> {
    await this.addressLine1Input().fill(address);
  }

  async fillCity(city: string): Promise<void> {
    await this.cityInput().fill(city);
  }

  async fillPostcode(postcode: string): Promise<void> {
    await this.postcodeInput().fill(postcode);
  }

  async clickContinue(): Promise<void> {
    await this.continueBtn().click();
  }

  async clickPlaceOrder(): Promise<void> {
    await this.placeOrderBtn().click();
  }

  async getOrderReference(): Promise<string> {
    return (await this.orderReference().textContent()) ?? '';
  }

  async isOrderConfirmationVisible(): Promise<boolean> {
    return this.orderConfirmationHeading().isVisible();
  }
}
