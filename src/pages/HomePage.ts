import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) { super(page); }

  // ─── Header navigation — pre-login state ─────────────────────────────────
  // strategy: data-testid, unique on page
  headerLoginLink = () => this.page.getByTestId('login-button');

  // ─── Header navigation — post-login authenticated state ──────────────────
  // strategy: data-testid
  userDetailsButton = () => this.page.getByTestId('user-details-button');
  cartButton        = () => this.page.getByTestId('cart-button');

  // ─── Homepage hero content ────────────────────────────────────────────────
  // strategy: role + name + level
  welcomeHeading = () => this.page.getByRole('heading', { name: 'Welcome', level: 1 });

  // ─── Header search bar ───────────────────────────────────────────────────
  // strategy: data-testid
  searchBarInput = () => this.page.getByTestId('search-bar-input');

  // ─── Recent Recipes section ───────────────────────────────────────────────
  // strategy: id selector — confirmed id="recipes" on section element
  recentRecipesSection = () => this.page.locator('#recipes');

  // strategy: role + name + level (scoped within section)
  recentRecipesHeading = () =>
    this.page.getByRole('heading', { name: 'Recent Recipes', level: 2 });

  // strategy: semantic article element scoped within the recipes section
  // confirmed: exactly 6 <article> elements present at time of test plan creation
  recipeCards = () => this.recentRecipesSection().locator('article');

  // strategy: semantic h3 heading scoped within each recipe card article
  recipeCardHeadings = () => this.recentRecipesSection().locator('article h3');

  // ─── Simple UI actions ────────────────────────────────────────────────────

  async clickHeaderLoginLink(): Promise<void> {
    await this.headerLoginLink().click();
  }

  async getUserDetailsButtonText(): Promise<string> {
    return (await this.userDetailsButton().textContent()) ?? '';
  }

  async getRecentRecipeCount(): Promise<number> {
    return this.recipeCards().count();
  }

  async scrollToRecentRecipes(): Promise<void> {
    await this.recentRecipesSection().scrollIntoViewIfNeeded();
  }

  async reloadPage(): Promise<void> {
    await this.page.reload();
    await this.waitForPageLoad();
  }
}
