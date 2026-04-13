import { test as base } from '@fixtures';
import { SearchResultsPage } from '@pages/SearchResultsPage';
import { SearchProductModule } from '@modules/SearchProductModule';

/**
 * Extended fixtures for Search Product tests.
 *
 * Extends the base fixtures (src/fixtures/index.ts) with SearchResultsPage
 * and SearchProductModule. Import from this file in search product test specs.
 *
 * Usage:
 *   import { test, expect } from '@fixtures/search.fixtures';
 */
type SearchTestFixtures = {
  searchResultsPage:   SearchResultsPage;
  searchProductModule: SearchProductModule;
};

export const test = base.extend<SearchTestFixtures>({
  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },

  searchProductModule: async ({ searchResultsPage }, use) => {
    await use(new SearchProductModule(searchResultsPage));
  },
});

export { expect } from '@playwright/test';
