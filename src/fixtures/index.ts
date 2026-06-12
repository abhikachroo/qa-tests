import { test as base }     from '@playwright/test';
import {
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
  LoginPage,
  HomePage,
  PdpChatPage,
} from '@pages/index';
import { SearchModule, LoginModule, PdpChatModule } from '@modules/index';

type TestFixtures = {
  searchPage:        SearchPage;
  headerSearchPage:  HeaderSearchPage;
  searchResultsPage: SearchResultsPage;
  searchModule:      SearchModule;
  loginPage:         LoginPage;
  homePage:          HomePage;
  loginModule:       LoginModule;
  pdpChatPage:       PdpChatPage;
  pdpChatModule:     PdpChatModule;
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

  pdpChatPage: async ({ page }, use) => {
    await use(new PdpChatPage(page));
  },

  pdpChatModule: async ({ headerSearchPage, searchResultsPage, pdpChatPage, loginModule }, use) => {
    await use(new PdpChatModule(headerSearchPage, searchResultsPage, pdpChatPage, loginModule));
  },
});

export { expect } from '@playwright/test';
