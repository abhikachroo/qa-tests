import { test as base }        from '@playwright/test';
import {
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
  LoginPage,
  LandingPage,
  ProjectPage,
  ProductsPage,
  SldPage,
  DesignPage,
  BomPage,
  ExportPage,
} from '@pages/index';
import {
  SearchModule,
  LoginModule,
  ProjectModule,
  ProductsModule,
  BomModule,
  ExportModule,
} from '@modules/index';

type TestFixtures = {
  // ── Search (existing) ─────────────────────────────────────────────────────
  searchPage:        SearchPage;
  headerSearchPage:  HeaderSearchPage;
  searchResultsPage: SearchResultsPage;
  searchModule:      SearchModule;

  // ── EcoSet Config ─────────────────────────────────────────────────────────
  loginPage:     LoginPage;
  landingPage:   LandingPage;
  projectPage:   ProjectPage;
  productsPage:  ProductsPage;
  sldPage:       SldPage;
  designPage:    DesignPage;
  bomPage:       BomPage;
  exportPage:    ExportPage;

  loginModule:    LoginModule;
  projectModule:  ProjectModule;
  productsModule: ProductsModule;
  bomModule:      BomModule;
  exportModule:   ExportModule;
};

export const test = base.extend<TestFixtures>({
  // ── Search fixtures ──────────────────────────────────────────────────────
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

  // ── EcoSet Config page fixtures ──────────────────────────────────────────
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },
  projectPage: async ({ page }, use) => {
    await use(new ProjectPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  sldPage: async ({ page }, use) => {
    await use(new SldPage(page));
  },
  designPage: async ({ page }, use) => {
    await use(new DesignPage(page));
  },
  bomPage: async ({ page }, use) => {
    await use(new BomPage(page));
  },
  exportPage: async ({ page }, use) => {
    await use(new ExportPage(page));
  },

  // ── EcoSet Config module fixtures ────────────────────────────────────────
  loginModule: async ({ loginPage, landingPage }, use) => {
    await use(new LoginModule(loginPage, landingPage));
  },
  projectModule: async ({ projectPage }, use) => {
    await use(new ProjectModule(projectPage));
  },
  productsModule: async ({ productsPage, sldPage, designPage }, use) => {
    await use(new ProductsModule(productsPage, sldPage, designPage));
  },
  bomModule: async ({ bomPage }, use) => {
    await use(new BomModule(bomPage));
  },
  exportModule: async ({ exportPage }, use) => {
    await use(new ExportModule(exportPage));
  },
});

export { expect } from '@playwright/test';
