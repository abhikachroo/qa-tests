import { test as base } from '@playwright/test';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { SearchProductModule } from '../modules/SearchProductModule';

/**
 * Custom fixtures for Search Product tests.
 *
 * Extends the Playwright base test — does NOT modify src/fixtures/index.ts so
 * existing tests are unaffected.
 *
 * Usage in spec files:
 *   import { test, expect } from '../../fixtures/search.fixtures';
 */
type SearchProductFixtures = {
  searchResultsPage: SearchResultsPage;
  searchProductModule: SearchProductModule;
};

export const test = base.extend<SearchProductFixtures>({
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },

  searchProductModule: async ({ searchResultsPage }, use) => {
    await use(new SearchProductModule(searchResultsPage));
  },
});

export { expect } from '@playwright/test';
