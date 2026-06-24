import { test as base }     from '@playwright/test';
import {
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
  LoginPage,
  HomePage,
  ProductChatPdpPage,
} from '@pages/index';
import { SearchModule, LoginModule, ProductChatPdpModule } from '@modules/index';

type TestFixtures = {
  searchPage: SearchPage;
  headerSearchPage: HeaderSearchPage;
  searchResultsPage: SearchResultsPage;
  searchModule: SearchModule;
  loginPage: LoginPage;
  homePage: HomePage;
  loginModule: LoginModule;
  productChatPdpPage: ProductChatPdpPage;
  productChatPdpModule: ProductChatPdpModule;
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

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  loginModule: async ({ loginPage, homePage }, use) => {
    await use(new LoginModule(loginPage, homePage));
  },

  productChatPdpPage: async ({ page }, use) => {
    await use(new ProductChatPdpPage(page));
  },

  productChatPdpModule: async ({ productChatPdpPage, searchModule, loginModule }, use) => {
    await use(new ProductChatPdpModule(productChatPdpPage, searchModule, loginModule));
  },
});

export { expect } from '@playwright/test';
