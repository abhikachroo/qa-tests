import { test as base } from '@playwright/test';
import { SearchPage } from '@pages/index';
import { SearchModule } from '@modules/index';

type TestFixtures = {
  searchPage:   SearchPage;
  searchModule: SearchModule;
};

export const test = base.extend<TestFixtures>({
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },

  searchModule: async ({ searchPage }, use) => {
    await use(new SearchModule(searchPage));
  },
});

export { expect } from '@playwright/test';
