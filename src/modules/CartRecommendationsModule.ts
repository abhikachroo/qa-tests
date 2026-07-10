import { expect, Page } from '@playwright/test';
import { CartRecommendationsPage } from '@pages/CartRecommendationsPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class CartRecommendationsModule {
  private logger: Logger;

  constructor(
    private page: Page,
    private cartRecommendationsPage: CartRecommendationsPage,
  ) {
    this.logger = new Logger('CartRecommendationsModule');
  }

  async openCart(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening cart from header`);
    await this.cartRecommendationsPage.openCartFromHeader();
    await this.cartRecommendationsPage.waitForPageLoad();
  }

  async verifyRecommendationsVisible(): Promise<void> {
    this.logger.info('Verifying recommendations section is visible');
    await expect(this.cartRecommendationsPage.recommendationsSection()).toBeVisible();
    await expect(this.cartRecommendationsPage.recommendationsHeading()).toBeVisible();
    await expect(this.cartRecommendationsPage.recommendationCards().first()).toBeVisible();
  }

  async verifyRecommendationCardLimit(maxCards = 10): Promise<void> {
    this.logger.info(`Verifying at most ${maxCards} recommendation cards are rendered`);
    await expect(this.cartRecommendationsPage.recommendationCards()).not.toHaveCount(0);
    await expect(async () => {
      const count = await this.cartRecommendationsPage.recommendationCards().count();
      expect(count).toBeLessThanOrEqual(maxCards);
    }).toPass();
  }

  async verifyQuickLinkVisible(): Promise<void> {
    this.logger.info('Verifying recommendations quick link is visible and enabled');
    await expect(this.cartRecommendationsPage.recommendationsQuickLink()).toBeVisible();
    await expect(this.cartRecommendationsPage.recommendationsQuickLink()).toBeEnabled();
  }

  async activateQuickLinkAndVerifySection(): Promise<void> {
    this.logger.info('Activating recommendations quick link');
    const previousUrl = this.page.url();
    await this.cartRecommendationsPage.clickRecommendationsQuickLink();
    await expect(this.cartRecommendationsPage.recommendationsHeading()).toBeVisible();
    await expect(this.page).not.toHaveURL(previousUrl + '#full-reload-marker');
  }

  async verifyRecommendationCardsHaveRequiredContent(): Promise<void> {
    this.logger.info('Verifying recommendation cards expose required product content');
    await expect(this.cartRecommendationsPage.recommendationCards()).not.toHaveCount(0);
    const cards = this.cartRecommendationsPage.recommendationCards();
    const count = await cards.count();
    for (let index = 0; index < count; index += 1) {
      const card = cards.nth(index);
      await expect(this.cartRecommendationsPage.cardName(card)).toBeVisible();
      await expect(this.cartRecommendationsPage.cardImage(card)).toBeVisible();
      await expect(this.cartRecommendationsPage.cardPrice(card)).toBeVisible();
      await expect(this.cartRecommendationsPage.cardAddToCartButton(card)).toBeEnabled();
    }
  }

  async addFirstRecommendationAndVerifyCartUpdates(): Promise<void> {
    this.logger.info('Adding first recommended product to cart');
    const beforeUrl = this.page.url();
    await this.cartRecommendationsPage.clickFirstRecommendationAddToCart();
    await expect(this.cartRecommendationsPage.recommendationCards().first()).toBeVisible();
    await expect(this.cartRecommendationsPage.headerCartLink()).toBeVisible();
    await expect(this.page).toHaveURL(beforeUrl);
  }

  async verifyDuplicateAddPreventedWhilePending(): Promise<void> {
    this.logger.info('Verifying duplicate add is prevented while add-to-cart is pending');
    const addButton = this.cartRecommendationsPage.cardAddToCartButton(this.cartRecommendationsPage.recommendationCards().first());
    await addButton.click();
    await expect(addButton).toBeDisabled();
  }

  async removeRecommendedProductAndVerifyAddableState(): Promise<void> {
    this.logger.info('Removing recommended product and verifying card returns to addable state');
    await this.cartRecommendationsPage.removeFirstCartLineItem();
    await expect(this.cartRecommendationsPage.cardAddToCartButton(this.cartRecommendationsPage.recommendationCards().first())).toBeEnabled();
  }

  async verifyRecommendationsHiddenWhenUnavailable(): Promise<void> {
    this.logger.info('Verifying recommendations section and quick link are hidden when unavailable');
    await expect(this.cartRecommendationsPage.recommendationsSection()).not.toBeVisible();
    await expect(this.cartRecommendationsPage.recommendationsQuickLink()).not.toBeVisible();
  }

  async verifyCartUsableWithoutRecommendations(): Promise<void> {
    this.logger.info('Verifying cart remains usable when recommendations are unavailable');
    await expect(this.cartRecommendationsPage.headerCartLink()).toBeVisible();
    await expect(this.cartRecommendationsPage.cartLineItems().first()).toBeVisible();
  }

  async verifyCmsCopyAndDivider(): Promise<void> {
    this.logger.info('Verifying CMS copy and visual divider for recommendations');
    await expect(this.cartRecommendationsPage.recommendationsHeading()).toBeVisible();
    await expect(this.cartRecommendationsPage.recommendationsCopy()).toBeVisible();
    await expect(this.cartRecommendationsPage.cartVisualDivider()).toBeVisible();
  }
}
