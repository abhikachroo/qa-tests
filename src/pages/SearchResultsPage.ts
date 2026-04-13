import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SearchResultsPage — Layer 2 (Locators & basic UI actions)
 *
 * Covers the Spark catalog search results and no-results pages.
 * URL pattern: /catalog/en-gb/search/{keyword}?version=1
 *
 * Selectors verified against live app at:
 *   https://fra-vanilla-preprod.dev.spark.sonepar.com (2026-04-13)
 */
export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── Page accessor ────────────────────────────────────────────────
  /** Exposes the underlying Playwright Page for URL assertions in tests. */
  getPage(): Page { return this.page; }

  // ── Header search ────────────────────────────────────────────────
  /** The search input in the global header. data-testid="search-bar-input" */
  searchBarInput       = () => this.page.getByTestId('search-bar-input');
  submitSearchButton   = () => this.page.getByLabel('Submit search');

  // ── Search results (valid keyword) ───────────────────────────────
  /** Container for the full product list. data-testid="product-list" */
  productListContainer = () => this.page.getByTestId('product-list');
  /** "568 products" text node. data-testid="product-list-count" */
  productListCount     = () => this.page.getByTestId('product-list-count');
  /** Individual product cards. data-testid="product-list-card-container" */
  productCards         = () => this.page.getByTestId('product-list-card-container');
  /** "Results for <keyword>" banner. data-testid="results-for-heading" */
  resultsForHeading    = () => this.page.getByTestId('results-for-heading');

  // ── No-results state ─────────────────────────────────────────────
  /** Container shown when no products match the query. data-testid="searchNoResultsFound" */
  noResultsContainer   = () => this.page.getByTestId('searchNoResultsFound');
  /** Heading: "Sorry, no result for \"<keyword>\"". Scoped inside noResultsContainer. */
  noResultsHeading     = () => this.page.getByTestId('searchNoResultsFound').getByTestId('heading');
  /** Description paragraph inside the no-results container. */
  noResultsDescription = () => this.page.getByTestId('searchNoResultsFound').getByTestId('description');

  // ── Actions ─────────────────────────────────────────────────────
  async fillSearchInput(keyword: string): Promise<void> {
    await this.searchBarInput().fill(keyword);
  }

  async submitSearch(): Promise<void> {
    await this.searchBarInput().press("Enter");
  }

  async getSearchBarValue(): Promise<string> {
    return (await this.searchBarInput().inputValue()) ?? "";
  }

  async getProductCount(): Promise<number> {
    return this.productCards().count();
  }

  async getProductListCountText(): Promise<string> {
    return (await this.productListCount().textContent()) ?? "";
  }
}
