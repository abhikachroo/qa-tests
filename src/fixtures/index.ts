import { test as base }     from '@playwright/test';
import {
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
  LoginPage,
  HomePage,
  CartRecommendationsPage,
} from '@pages/index';
import { SearchModule, LoginModule, CartRecommendationsModule } from '@modules/index';

type TestFixtures = {
  // Search fixtures
  searchPage:        SearchPage;
  headerSearchPage:  HeaderSearchPage;
  searchResultsPage: SearchResultsPage;
  searchModule:      SearchModule;
  // Login fixtures
  loginPage:   LoginPage;
  homePage:    HomePage;
  loginModule: LoginModule;
  // Cart recommendation fixtures
  cartRecommendationsPage:   CartRecommendationsPage;
  cartRecommendationsModule: CartRecommendationsModule;
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

  // --- Cart recommendations ---
  cartRecommendationsPage: async ({ page }, use) => {
    await use(new CartRecommendationsPage(page));
  },

  cartRecommendationsModule: async ({ page, cartRecommendationsPage }, use) => {
    await use(new CartRecommendationsModule(page, cartRecommendationsPage));
  },
});

export { expect } from '@playwright/test';
