import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SearchResultsPage — Layer 2 (Page)
 *
 * Locators sourced from live DOM inspection of:
 * https://fra-vanilla-preprod.dev.spark.sonepar.com/catalog/en-gb/search/{keyword}?version=1
 *
 * All locators are arrow functions (zero business logic in this class).
 */
export class SearchResultsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // ── No-results state ───────────────────────────────────────────────────────
  /** Outer container shown when no products match the search query */
  noResultsContainer = () => this.page.getByTestId('searchNoResultsFound');

  /** H1 heading — "Sorry, no result for \"{keyword}\"" */
  noResultsHeading   = () => this.page.getByTestId('heading');

  /** Description paragraph below the heading */
  noResultsDesc      = () => this.page.getByTestId('description');

  // ── Product list ───────────────────────────────────────────────────────────
  /** Wrapper DIV for the product listing area */
  productList        = () => this.page.getByTestId('product-list');

  /** Individual product cards — absent when no results */
  productCards       = () => this.page.getByTestId('product-list-card-container');

  // ── Header search bar ──────────────────────────────────────────────────────
  /** Search input — pre-filled with the active search keyword */
  searchInput        = () => this.page.getByTestId('search-bar-input');

  // ── Public page accessor ───────────────────────────────────────────────────
  /** Exposes the underlying Page instance (BasePage.page is protected). */
  getPage(): Page {
    return this.page;
  }
}
