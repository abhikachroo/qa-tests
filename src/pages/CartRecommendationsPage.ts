import { Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class CartRecommendationsPage extends BasePage {
  constructor(page: Page) { super(page); }

  // Header cart link / cart count (strategy: visible desktop/mobile header cart test id)
  headerCartLink = (): Locator => this.page.getByTestId('header-cart').filter({ visible: true }).first();

  // Recommendations section container (strategy: data-testid/CMS text fallback; selector must be verified in seeded authenticated cart state)
  recommendationsSection = (): Locator => this.page.locator('[data-testid="recommendations-section"], [data-testid="cart-recommendations"], section:has-text("Recommended for you"), section:has-text("Recommandé")');

  // Recommendations heading (strategy: role+text; CMS copy may be localized)
  recommendationsHeading = (): Locator => this.page.getByRole('heading', { name: /recommended for you|recommandé/i });

  // Recommendations explanatory copy (strategy: structural text within section; selector must be verified in seeded authenticated cart state)
  recommendationsCopy = (): Locator => this.recommendationsSection().locator('p, [data-testid="recommendations-copy"]').first();

  // Recommendation cards (strategy: data-testid/CSS structural fallback; selector must be verified in seeded authenticated cart state)
  recommendationCards = (): Locator => this.page.locator('[data-testid="recommendation-card"], [data-testid^="recommendation-product"], article:has(button)');

  // Cart navigation quick link to recommendations (strategy: role+text, localized fallback)
  recommendationsQuickLink = (): Locator => this.page.getByRole('link', { name: /recommended for you|recommendations|recommandé/i });

  // Recommendation card content locators (strategy: scoped structural fallback)
  cardName = (card: Locator): Locator => card.getByRole('link').first();
  cardImage = (card: Locator): Locator => card.getByRole('img').first();
  cardPrice = (card: Locator): Locator => card.locator('[data-testid="price"], [class*="price"], text=/€|EUR/').first();
  cardAddToCartButton = (card: Locator): Locator => card.getByRole('button', { name: /add to cart|add|ajouter/i }).first();
  cartLineItems = (): Locator => this.page.locator('[data-testid="cart-line-item"], [data-testid^="cart-entry"], article:has(button[name])');
  cartVisualDivider = (): Locator => this.recommendationsSection().locator('hr, [role="separator"], [data-testid="recommendations-divider"]').first();

  async openCartFromHeader(): Promise<void> {
    await this.headerCartLink().click();
  }

  async clickRecommendationsQuickLink(): Promise<void> {
    await this.recommendationsQuickLink().click();
  }

  async clickFirstRecommendationAddToCart(): Promise<void> {
    await this.cardAddToCartButton(this.recommendationCards().first()).click();
  }

  async clickRecommendationAddToCart(card: Locator): Promise<void> {
    await this.cardAddToCartButton(card).click();
  }

  async removeFirstCartLineItem(): Promise<void> {
    await this.cartLineItems().first().getByRole('button', { name: /remove|delete|supprimer/i }).click();
  }
}
