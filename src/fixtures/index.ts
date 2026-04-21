import { test as base } from '@playwright/test';
import {
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
  LoginPage,
  EcoSetProjectPage,
  EcoSetProductsPage,
} from '@pages/index';
import {
  SearchModule,
  LoginModule,
  EcoSetConfigModule,
} from '@modules/index';

type TestFixtures = {
  // Search fixtures (existing)
  searchPage:        SearchPage;
  headerSearchPage:  HeaderSearchPage;
  searchResultsPage: SearchResultsPage;
  searchModule:      SearchModule;
  // EcoSet Config fixtures (new)
  loginPage:         LoginPage;
  ecoSetProjectPage: EcoSetProjectPage;
  ecoSetProductsPage: EcoSetProductsPage;
  loginModule:       LoginModule;
  ecoSetConfigModule: EcoSetConfigModule;
};

export const test = base.extend<TestFixtures>({
  // --- Search fixtures (unchanged) ---
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

  // --- EcoSet Config fixtures ---
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  ecoSetProjectPage: async ({ page }, use) => {
    await use(new EcoSetProjectPage(page));
  },
  ecoSetProductsPage: async ({ page }, use) => {
    await use(new EcoSetProductsPage(page));
  },
  loginModule: async ({ page, loginPage }, use) => {
    await use(new LoginModule(page, loginPage));
  },
  ecoSetConfigModule: async ({ page, loginPage, ecoSetProjectPage, ecoSetProductsPage }, use) => {
    await use(new EcoSetConfigModule(page, loginPage, ecoSetProjectPage, ecoSetProductsPage));
  },
});

export { expect } from '@playwright/test';
