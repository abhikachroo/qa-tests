import { test as base }     from '@playwright/test';
import {
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
  LoginPage,
  WorkbenchPage,
  SLDPage,
  ExportPage,
} from '@pages/index';
import {
  SearchModule,
  LoginModule,
  WorkbenchModule,
  SLDModule,
  ExportModule,
} from '@modules/index';

type TestFixtures = {
  // ── Search (existing) ──────────────────────────────────────────────────
  searchPage:        SearchPage;
  headerSearchPage:  HeaderSearchPage;
  searchResultsPage: SearchResultsPage;
  searchModule:      SearchModule;

  // ── SLD / EcoSet ───────────────────────────────────────────────────────
  loginPage:         LoginPage;
  workbenchPage:     WorkbenchPage;
  sldPage:           SLDPage;
  exportPage:        ExportPage;

  loginModule:       LoginModule;
  workbenchModule:   WorkbenchModule;
  sldModule:         SLDModule;
  exportModule:      ExportModule;
};

export const test = base.extend<TestFixtures>({

  // ── Search fixtures (preserved) ─────────────────────────────────────────
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

  // ── SLD / EcoSet page fixtures ──────────────────────────────────────────
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  workbenchPage: async ({ page }, use) => {
    await use(new WorkbenchPage(page));
  },
  sldPage: async ({ page }, use) => {
    await use(new SLDPage(page));
  },
  exportPage: async ({ page }, use) => {
    await use(new ExportPage(page));
  },

  // ── SLD / EcoSet module fixtures ────────────────────────────────────────
  loginModule: async ({ loginPage }, use) => {
    await use(new LoginModule(loginPage));
  },
  workbenchModule: async ({ workbenchPage }, use) => {
    await use(new WorkbenchModule(workbenchPage));
  },
  sldModule: async ({ sldPage }, use) => {
    await use(new SLDModule(sldPage));
  },
  exportModule: async ({ exportPage }, use) => {
    await use(new ExportModule(exportPage));
  },
});

export { expect } from '@playwright/test';
