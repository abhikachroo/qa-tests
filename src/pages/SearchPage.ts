import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SearchPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ─── Legacy locators (kept for backward compatibility) ──────────────────────
  /** @deprecated Use noResultsHeading() instead — selector does not match the live UI */
  noResultsMessage = () => this.page.getByText(/we couldn't find that page/i);
  productCards     = () => this.page.locator('[data-testid="product-card"], [class*="product-card"], [class*="product-item"]');

  // ─── Invalid-search empty-state locators ─────────────────────────────────────
  /** H1: 'Sorry, no result for "{keyword}"' */
  noResultsHeading   = () => this.page.getByRole('heading', { level: 1 });
  /** Paragraph below the heading that begins with "We're having difficulty…" */
  noResultsSubText   = () => this.page.locator('p').filter({ hasText: /we're having difficulty finding a match/i });

  // ─── Search bar ───────────────────────────────────────────────────────────────
  searchInput        = () => this.page.getByRole('searchbox', { name: 'Search input' });
  submitSearchBtn    = () => this.page.getByRole('button', { name: 'Submit search' });

  // ─── Actions ─────────────────────────────────────────────────────────────────
  async getProductCount(): Promise<number> {
    return this.productCards().count();
  }

  async fillSearchInput(term: string): Promise<void> {
    await this.searchInput().fill(term);
  }

  async clickSubmitSearch(): Promise<void> {
    await this.submitSearchBtn().click();
  }

  async getNoResultsHeadingText(): Promise<string> {
    return (await this.noResultsHeading().textContent()) ?? '';
  }
}
