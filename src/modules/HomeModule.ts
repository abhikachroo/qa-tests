import { expect }    from '@playwright/test';
import { HomePage }  from '@pages/HomePage';
import { Logger }    from '@utils/Logger';
import { config }    from '@config/index';

/**
 * HomeModule — business-logic workflows for the homepage.
 *
 * Responsibilities:
 *   - Navigate to the homepage and handle any cookie consent
 *   - Verify the "Recent Recipes" section heading is visible
 *   - Assert the exact count of recipe cards in the Recent Recipes section
 *   - Verify all recipe cards have visible title headings
 *   - Verify recipe count stability across page reloads
 */
export class HomeModule {
  private logger: Logger;

  constructor(private homePage: HomePage) {
    this.logger = new Logger('HomeModule');
  }

  /**
   * Navigate to the homepage root path and wait for page to fully load.
   * Dismisses the cookie consent banner if present.
   */
  async navigateToHomepage(): Promise<void> {
    this.logger.info(
      `[${config.opco}][${config.environment}] Navigating to homepage: ${config.baseUrl}/`,
    );
    await this.homePage.navigate('/');
    await this.homePage.waitForPageLoad();
    await this.homePage.dismissCookieBannerIfPresent();
    this.logger.info('Homepage loaded successfully');
  }

  /**
   * Asserts that the "Recent Recipes" section heading is visible on the page.
   */
  async verifyRecentRecipesHeadingVisible(): Promise<void> {
    this.logger.info('Verifying "Recent Recipes" section heading is visible');
    await expect(
      this.homePage.recentRecipesHeading(),
      '"Recent Recipes" heading (h2) should be visible on the homepage',
    ).toBeVisible();
    this.logger.info('"Recent Recipes" heading verified');
  }

  /**
   * Asserts that the Recent Recipes section contains exactly the expected
   * number of recipe cards.
   *
   * @param expectedCount - The exact number of recipe cards expected (e.g. 6)
   */
  async verifyRecentRecipeCount(expectedCount: number): Promise<void> {
    this.logger.info(
      `Verifying Recent Recipes section shows exactly ${expectedCount} recipe cards`,
    );
    await this.homePage.scrollToRecentRecipes();
    await expect(
      this.homePage.recipeCards(),
      `Expected exactly ${expectedCount} recipe cards in the "Recent Recipes" section`,
    ).toHaveCount(expectedCount);
    this.logger.info(`Recipe card count verified: ${expectedCount}`);
  }

  /**
   * Asserts that every recipe card in the Recent Recipes section
   * has a visible h3 title heading.
   *
   * @param expectedCount - Number of recipe cards expected (used to verify heading count parity)
   */
  async verifyAllRecipeCardsHaveTitles(expectedCount: number): Promise<void> {
    this.logger.info(
      `Verifying all ${expectedCount} recipe cards have visible h3 title headings`,
    );
    await expect(
      this.homePage.recipeCardHeadings(),
      `Expected ${expectedCount} h3 headings — one per recipe card`,
    ).toHaveCount(expectedCount);
    this.logger.info('All recipe card title headings verified');
  }

  /**
   * Reloads the page and waits for network idle, then re-verifies
   * the recipe count matches the expected value.
   * Used to assert count stability across page reloads.
   *
   * @param expectedCount - The exact number of recipe cards expected after reload
   */
  async reloadAndVerifyRecipeCount(expectedCount: number): Promise<void> {
    this.logger.info('Reloading homepage to verify recipe count stability');
    await this.homePage.reloadPage();
    await this.homePage.dismissCookieBannerIfPresent();
    this.logger.info('Page reloaded — re-verifying recipe count');
    await this.verifyRecentRecipeCount(expectedCount);
  }
}
