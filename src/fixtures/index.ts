import { test as base } from '@playwright/test';
import {
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
  ProductDetailPage,
  LoginPage,
  HomePage,
} from '@pages/index';
import { SearchModule, LoginModule } from '@modules/index';

type TestFixtures = {
  searchPage: SearchPage;
  headerSearchPage: HeaderSearchPage;
  searchResultsPage: SearchResultsPage;
  productDetailPage: ProductDetailPage;
  searchModule: SearchModule;
  loginPage: LoginPage;
  homePage: HomePage;
  loginModule: LoginModule;
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

  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },

  searchModule: async ({ searchPage, headerSearchPage, searchResultsPage, productDetailPage }, use) => {
    await use(new SearchModule(searchPage, headerSearchPage, searchResultsPage, productDetailPage));
  },

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
