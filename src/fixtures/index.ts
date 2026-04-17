import { test as base }                               from '@playwright/test';
import {
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
  HomePage,
  AzureB2CLoginPage,
}                                                     from '@pages/index';
import { SearchModule, LoginModule }                  from '@modules/index';

type TestFixtures = {
  // Search feature
  searchPage:        SearchPage;
  headerSearchPage:  HeaderSearchPage;
  searchResultsPage: SearchResultsPage;
  searchModule:      SearchModule;

  // Login feature
  homePage:          HomePage;
  azureB2CLoginPage: AzureB2CLoginPage;
  loginModule:       LoginModule;
};

export const test = base.extend<TestFixtures>({
  // ── Search fixtures ────────────────────────────────────────────────────────
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

  // ── Login fixtures ─────────────────────────────────────────────────────────
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  azureB2CLoginPage: async ({ page }, use) => {
    await use(new AzureB2CLoginPage(page));
  },

  loginModule: async ({ homePage, azureB2CLoginPage }, use) => {
    await use(new LoginModule(homePage, azureB2CLoginPage));
  },
});

export { expect } from '@playwright/test';
