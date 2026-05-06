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

  async fillSearchInput(keyword: string): Promise<void> {
    await this.searchInput().click();
    await this.searchInput().fill(keyword);
  }

  /**
   * Click the header search submit button.
   *
   * Defensive guard: call dismissCookieBannerIfPresent() (inherited from BasePage)
   * before clicking. The OneTrust SDK overlay can still intercept pointer events
   * for a short time after the banner is dismissed.
   *
   * dismissCookieBannerIfPresent() now uses page.evaluate() to forcibly remove the
   * overlay from the DOM — deterministic and immune to CSS animation timing.
   *
   * Additionally, the click uses { force: true } as a belt-and-suspenders fallback:
   * if any residual overlay element still intercepts pointer events after the evaluate()
   * removal, force:true bypasses Playwright's actionability checks and fires the
   * click directly, preventing a timeout at this step.
   */
  async clickSubmitButton(): Promise<void> {
    await this.dismissCookieBannerIfPresent();
    await this.submitButton().click({ force: true });
  }

  async waitForSearchNavigation(keyword: string): Promise<void> {
    await this.page.waitForURL(`**/search/${keyword}**`, { timeout: 30_000 });
  }

  async getSearchInputValue(): Promise<string> {
    return (await this.searchInput().inputValue()) ?? '';
  }
}
