import { test as base }     from '@playwright/test';
import {
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
  LoginPage,
  HomePage,
  OrdersQuotesPage,
} from '@pages/index';
import { SearchModule, LoginModule, OrdersQuotesModule } from '@modules/index';

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
  // Orders Quotes fixtures
  ordersQuotesPage:   OrdersQuotesPage;
  ordersQuotesModule: OrdersQuotesModule;
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

  // --- Orders Quotes ---
  ordersQuotesPage: async ({ page }, use) => {
    await use(new OrdersQuotesPage(page));
  },

  ordersQuotesModule: async ({ ordersQuotesPage }, use) => {
    await use(new OrdersQuotesModule(ordersQuotesPage));
  },
});

export { expect } from '@playwright/test';
