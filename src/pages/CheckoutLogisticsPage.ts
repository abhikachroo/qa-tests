import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutLogisticsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Locators ─────────────────────────────────────────────────────────────

  // Progress indicator text "1/2" (strategy: text match)
  progressIndicator = () => this.page.getByText(/1\/2/);

  // Delivery scenario radio buttons (strategy: data-testid)
  // Scenario IDs: STANDARD_1_DELIVERY | STANDARD_2_DELIVERY | STANDARD_3_DELIVERY
  logisticScenarioRadio = (scenario: string) =>
    this.page.getByTestId(`logistic-scenario-${scenario}`);

  // Primary CTA — "continue to verification" (strategy: data-testid)
  continueToVerificationBtn = () => this.page.getByTestId('checkout-button');

  // Secondary navigation (strategy: data-testid)
  backBtn        = () => this.page.getByTestId('back-button');
  changeDateBtn  = () => this.page.getByTestId('button-shipping-date-drawer');
  addCommentBtn  = () => this.page.getByTestId('add-comment-button');

  // ── Simple UI actions ────────────────────────────────────────────────────

  async selectLogisticScenario(scenario: string): Promise<void> {
    await this.logisticScenarioRadio(scenario).click();
  }

  async clickContinueToVerification(): Promise<void> {
    await this.continueToVerificationBtn().click();
  }

  async clickBack(): Promise<void> {
    await this.backBtn().click();
  }
}
