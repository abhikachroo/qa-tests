import { test as base }     from '@playwright/test';
import {
  LoginPage,
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
} from '@pages/index';
import { LoginModule }  from '@modules/LoginModule';
import { SearchModule } from '@modules/SearchModule';

type TestFixtures = {
  // Login
  loginPage:   LoginPage;
  loginModule: LoginModule;
  // Search
  searchPage:        SearchPage;
  headerSearchPage:  HeaderSearchPage;
  searchResultsPage: SearchResultsPage;
  searchModule:      SearchModule;
};

export const test = base.extend<TestFixtures>({
  // ── Login fixtures ──────────────────────────────────────────────────────────
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  loginModule: async ({ page, loginPage }, use) => {
    await use(new LoginModule(page, loginPage));
  },

  // ── Search fixtures ──────────────────────────────────────────────────────────
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
