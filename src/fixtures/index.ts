import { test as base }     from '@playwright/test';
import {
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
  ProductCartPage,
  LoginPage,
  HomePage,
} from '@pages/index';
import { SearchModule, ProductCartModule, LoginModule } from '@modules/index';

type TestFixtures = {
  // Search fixtures
  searchPage:        SearchPage;
  headerSearchPage:  HeaderSearchPage;
  searchResultsPage: SearchResultsPage;
  searchModule:      SearchModule;
  // Product cart fixtures
  productCartPage:   ProductCartPage;
  productCartModule: ProductCartModule;
  // Login fixtures
  loginPage:   LoginPage;
  homePage:    HomePage;
  loginModule: LoginModule;
};

export const test = base.extend<TestFixtures>({
  // --- Search ---
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

  // --- Product cart ---
  productCartPage: async ({ page }, use) => {
    await use(new ProductCartPage(page));
  },

  productCartModule: async ({ page, searchModule, searchResultsPage, productCartPage }, use) => {
    await use(new ProductCartModule(page, searchModule, searchResultsPage, productCartPage));
  },

  // --- Login ---
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  loginModule: async ({ loginPage, homePage }, use) => {
    await use(new LoginModule(loginPage, homePage));
  },
});

export { expect } from '@playwright/test';
