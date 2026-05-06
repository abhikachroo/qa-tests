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
  // OneTrust SDK overlay -- may still be intercepting pointer events after banner dismiss
  private cookieSdkOverlay = () => this.page.locator('#onetrust-consent-sdk');

  async fillSearchInput(keyword: string): Promise<void> {
    await this.searchInput().click();
    await this.searchInput().fill(keyword);
  }

  /**
   * Click the header search submit button.
   *
   * Defensive guard: wait for the OneTrust SDK overlay to be hidden/detached before
   * clicking. The overlay can still intercept pointer events for a short time after
   * dismissCookieBannerIfPresent() resolves (the container animates out asynchronously).
   * This guard resolves immediately if the overlay is already gone, adding zero latency
   * in the common case.
   */
  async clickSubmitButton(): Promise<void> {
    await Promise.race([
      this.cookieSdkOverlay().waitFor({ state: 'hidden',   timeout: 5_000 }).catch(() => undefined),
      this.cookieSdkOverlay().waitFor({ state: 'detached', timeout: 5_000 }).catch(() => undefined),
    ]);
    await this.submitButton().click();
  }

  async waitForSearchNavigation(keyword: string): Promise<void> {
    await this.page.waitForURL(`**/search/${keyword}**`, { timeout: 30_000 });
  }

  async getSearchInputValue(): Promise<string> {
    return (await this.searchInput().inputValue()) ?? '';
  }
}
