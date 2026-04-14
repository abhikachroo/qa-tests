import { test as base }     from '@playwright/test';
import { SearchPage, HeaderSearchPage, SearchResultsPage } from '@pages/index';
import { SearchModule }     from '@modules/index';

type TestFixtures = {
  searchPage:        SearchPage;
  headerSearchPage:  HeaderSearchPage;
  searchResultsPage: SearchResultsPage;
  searchModule:      SearchModule;
};

export const test = base.extend<TestFixtures>({
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },

  headerSearchPage: async ({ page }, use) => {
    await use(new HeaderSearchPage(page));
  },

  searchResultsPage: async ({ page }, use) => {
    await use(new SearchResultsPage(page));
  },

  searchModule: async ({ searchPage, headerSearchPage, searchResultsPage }, use) => {
    await use(new SearchModule(searchPage, headerSearchPage, searchResultsPage));
  },
});

export { expect } from '@playwright/test';
