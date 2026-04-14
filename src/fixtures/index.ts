import { test as base } from '@playwright/test';
import { LoginPage, SearchPage } from '@pages/index';
import { LoginModule, SearchModule } from '@modules/index';

type TestFixtures = {
  loginPage:    LoginPage;
  loginModule:  LoginModule;
  searchPage:   SearchPage;
  searchModule: SearchModule;
};

export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  loginModule: async ({ loginPage }, use) => {
    await use(new LoginModule(loginPage));
  },

  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },

  searchModule: async ({ searchPage }, use) => {
    await use(new SearchModule(searchPage));
  },
});

export { expect } from '@playwright/test';
