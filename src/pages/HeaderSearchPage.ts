import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HeaderSearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Confirmed selector from live UI inspection: data-testid="search-bar-input"
  searchInput  = () => this.page.getByTestId('search-bar-input');

  // Submit button identified by accessible role + name
  submitButton = () => this.page.getByRole('button', { name: 'Submit search' });

  // Cart header button / badge — data-testid confirmed live (strategy: data-testid)
  cartButton   = () => this.page.getByTestId('cart-button');

  async fillSearchInput(keyword: string): Promise<void> {
    await this.searchInput().click();
    await this.searchInput().fill(keyword);
  }

  /**
   * Wait for the search input to be visible — reliable readiness signal for both
   * guest and authenticated pages, regardless of background network activity.
   *
   * HEAL (Round 1): Added as the stable alternative to waitForPageLoad('networkidle'),
   * which times out on the authenticated homepage due to ongoing user-specific API calls.
   * Called by SearchModule.submitSearch() before interacting with the search bar.
   */
  async waitForSearchInputVisible(): Promise<void> {
    await this.searchInput().waitFor({ state: 'visible' });
  }

  /**
   * Click the Submit Search button.
   *
   * HEAL (Round 1): OneTrust cookie consent banner (#onetrust-consent-sdk)
   * was intercepting pointer events on this button — observed post-login
   * (B2C redirect) and in standalone search flows.
   * Added dismissCookieBannerIfPresent() before the click as a defensive guard.
   */
  async clickSubmitButton(): Promise<void> {
    await this.dismissCookieBannerIfPresent();
    await this.submitButton().click();
  }

  async waitForSearchNavigation(keyword: string): Promise<void> {
    await this.page.waitForURL(`**/search/${keyword}**`, { timeout: 30_000 });
  }

  async getSearchInputValue(): Promise<string> {
    return (await this.searchInput().inputValue()) ?? '';
  }

  async clickCartButton(): Promise<void> {
    await this.cartButton().click();
  }
}
