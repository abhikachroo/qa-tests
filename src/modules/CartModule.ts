import { expect } from '@playwright/test';
import { CartPage } from '@pages/CartPage';
import { Logger } from '@utils/Logger';
import { config } from '@config/index';

export class CartModule {
  private logger: Logger;

  constructor(private cartPage: CartPage) {
    this.logger = new Logger('CartModule');
  }

  async openCart(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening cart page`);
    await this.cartPage.goToCart();
    await this.cartPage.waitForPageLoad();
    await this.cartPage.dismissCookieBannerIfPresent();
  }

  async openLocalizedEmptyCart(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening localized empty cart page`);
    await this.cartPage.goToLocalizedEmptyCart();
    await this.cartPage.waitForPageLoad();
    await this.cartPage.dismissCookieBannerIfPresent();
  }

  async openAuthenticatedProductAndCart(): Promise<void> {
    this.logger.info(`[${config.opco}][${config.environment}] Opening authenticated PDP state before cart validation`);
    await this.cartPage.goToAuthenticatedProductPage();
    await this.cartPage.dismissCookieBannerIfPresent();
    await expect(this.cartPage.productQuantityInput(), 'Authenticated PDP quantity input should be visible').toBeVisible();
    await this.cartPage.fillProductQuantity('1');
    await expect(this.cartPage.productAddToCartButton(), 'Authenticated PDP Add to Cart should be enabled after quantity entry').toBeEnabled();
    await this.cartPage.clickProductAddToCart();
    await expect(this.cartPage.headerCartButton(), 'Header cart button should be available after adding product').toBeVisible();
    await this.cartPage.clickHeaderCartButton();
    await expect(this.cartPage.shoppingCartHeading(), 'Cart heading should be visible after header cart navigation').toBeVisible();
    await expect(this.cartPage.cartProductTitles().first(), 'Cart should show at least one product after PDP cart navigation').toBeVisible();
  }

  async verifyCartPageVisible(): Promise<void> {
    this.logger.info('Verifying cart page shell is visible');
    await expect(this.cartPage.shoppingCartHeading(), 'Shopping Cart heading should be visible').toBeVisible();
  }

  async verifyEmptyCartWithoutRecommendations(): Promise<void> {
    this.logger.info('Verifying empty cart hides recommendations');
    await expect(this.cartPage.emptyCartHeading(), 'Empty-cart heading should be visible').toBeVisible();
    await expect(this.cartPage.emptyCartMessageBoard(), 'Empty-cart message board should be visible').toBeVisible();
    await expect(this.cartPage.exploreCategoriesButton(), 'Explore categories CTA should be visible').toBeVisible();
    await expect(this.cartPage.recommendationTitle(), 'Recommendation title should not be visible for empty cart').not.toBeVisible();
    await expect(this.cartPage.recommendationQuickLink(), 'Recommendation quick link should not be visible for empty cart').not.toBeVisible();
    await expect(this.cartPage.recommendationCards(), 'Recommendation cards should not render for empty cart').toHaveCount(0);
  }

  async verifyAnonymousCartWithoutRecommendations(): Promise<void> {
    this.logger.info('Verifying anonymous cart hides recommendations');
    await expect(this.cartPage.loginButton(), 'Anonymous header should show login control').toBeVisible();
    await expect(this.cartPage.recommendationTitle(), 'Recommendation title should not be visible anonymously').not.toBeVisible();
    await expect(this.cartPage.recommendationQuickLink(), 'Recommendation quick link should not be visible anonymously').not.toBeVisible();
    await expect(this.cartPage.recommendationCards(), 'Recommendation cards should not render anonymously').toHaveCount(0);
  }

  async verifyNonEmptyCartWithoutRecommendations(): Promise<void> {
    this.logger.info('Verifying non-empty no-result cart remains usable without recommendations');
    await this.verifyCartPageVisible();
    await expect(this.cartPage.cartProductTitles().first(), 'At least one cart product title should be visible').toBeVisible();
    await expect(this.cartPage.checkoutButton(), 'Checkout button should remain available for non-empty cart').toBeVisible();
    await expect(this.cartPage.recommendationTitle(), 'Recommendation title should not be visible when no recommendation products exist').not.toBeVisible();
    await expect(this.cartPage.recommendationQuickLink(), 'Recommendation quick link should not render when no recommendations exist').not.toBeVisible();
    await expect(this.cartPage.recommendationCards(), 'No recommendation cards should be rendered for no-result state').toHaveCount(0);
  }

  async verifyRecommendationsPresent(): Promise<void> {
    this.logger.info('Verifying visible recommendation section and card count');
    await this.verifyCartPageVisible();
    await expect(this.cartPage.recommendationTitle(), 'Recommendation title should be visible').toBeVisible();
    await expect(this.cartPage.recommendationCards().first(), 'At least one recommendation card should be visible').toBeVisible();
    await expect.poll(async () => this.cartPage.recommendationCards().count(), {
      message: 'Recommendation cards should be between 1 and 10',
    }).toBeGreaterThanOrEqual(1);
    await expect.poll(async () => this.cartPage.recommendationCards().count(), {
      message: 'Recommendation cards should be capped at 10',
    }).toBeLessThanOrEqual(10);
    await expect(this.cartPage.recommendationQuickLink(), 'Recommendation quick link should be visible').toBeVisible();
  }

  async verifyRecommendationContent(): Promise<void> {
    this.logger.info('Verifying recommendation content, product details, and divider');
    await expect(this.cartPage.recommendationTitle(), 'CMS title should be visible').toBeVisible();
    await expect(this.cartPage.recommendationDivider().first(), 'Divider should separate cart content from recommendations').toBeVisible();
    await expect(this.cartPage.recommendationCardTitles().first(), 'Recommendation product title should be visible').toBeVisible();
    await expect(this.cartPage.recommendationImages().first(), 'Recommendation product image should be visible').toBeVisible();
    await expect(this.cartPage.recommendationPrices().first(), 'Recommendation product price should be visible').toBeVisible();
    await expect(this.cartPage.recommendationAddButtons().first(), 'Recommendation Add to Cart button should be visible').toBeVisible();
  }

  async verifyRecommendationAnchorNavigation(): Promise<void> {
    this.logger.info('Verifying recommendation quick link anchors to section');
    await expect(this.cartPage.recommendationQuickLink(), 'Recommendation quick link should be enabled').toBeEnabled();
    await this.cartPage.clickRecommendationQuickLink();
    await expect(this.cartPage.recommendationTitle(), 'Recommendation section should remain visible after anchor click').toBeVisible();
  }

  async addFirstRecommendationAndVerifyState(): Promise<void> {
    this.logger.info('Adding first recommendation to cart and verifying static list state');
    const beforeNames = await this.cartPage.getRecommendationProductNames();
    const beforeCartCount = await this.cartPage.getCartProductCount();
    await this.cartPage.clickFirstRecommendationAddButton();
    await expect(this.cartPage.recommendationAddedButtons().first(), 'Clicked recommendation button should show added state').toBeVisible();
    await expect(this.cartPage.cartProductCards(), 'Cart product count should increase after adding recommendation').toHaveCount(beforeCartCount + 1);
    await expect.poll(async () => this.cartPage.getRecommendationProductNames(), {
      message: 'Recommendation list should remain static after add-to-cart',
    }).toEqual(beforeNames);
  }

  async removeFirstCartItemAndVerifyRecommendationCanBeAddedAgain(): Promise<void> {
    this.logger.info('Removing added recommendation and verifying add button reset');
    await this.cartPage.clickFirstRemoveCartItemButton();
    await expect(this.cartPage.recommendationAddButtons().first(), 'Recommendation button should reset to add state after removal').toBeVisible();
  }

  async removeAllCartItemsAndVerifyEmptyState(): Promise<void> {
    this.logger.info('Removing all visible cart items and verifying empty cart state');
    const initialCount = await this.cartPage.getCartProductCount();
    for (let index = 0; index < initialCount; index += 1) {
      await this.cartPage.clickFirstRemoveCartItemButton();
    }
    await expect(this.cartPage.emptyCartHeading(), 'Cart should show empty state after all items are removed').toBeVisible();
    await expect(this.cartPage.recommendationTitle(), 'Recommendation title should disappear when cart becomes empty').not.toBeVisible();
    await expect(this.cartPage.recommendationQuickLink(), 'Recommendation quick link should disappear when cart becomes empty').not.toBeVisible();
  }

  async verifyRecommendationListStaticAfterCartChanges(): Promise<void> {
    this.logger.info('Verifying recommendation list remains static after cart changes');
    const beforeNames = await this.cartPage.getRecommendationProductNames();
    await this.cartPage.clickFirstRecommendationAddButton();
    await expect(this.cartPage.recommendationAddedButtons().first(), 'Added state should be visible after add-to-cart').toBeVisible();
    await expect.poll(async () => this.cartPage.getRecommendationProductNames(), {
      message: 'Recommendation list should remain unchanged after adding a recommendation',
    }).toEqual(beforeNames);
    await this.cartPage.clickIncrementQuantity();
    await expect.poll(async () => this.cartPage.getRecommendationProductNames(), {
      message: 'Recommendation list should remain unchanged after quantity update',
    }).toEqual(beforeNames);
  }
}
