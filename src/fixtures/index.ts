import { test as base }     from '@playwright/test';
import {
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
  LoginPage,
  HomePage,
  ProductDetailsPage,
  CartPage,
} from '@pages/index';
import { SearchModule, LoginModule, ProductSearchAddToCartModule } from '@modules/index';

type TestFixtures = {
  // Search fixtures
  searchPage:        SearchPage;
  headerSearchPage:  HeaderSearchPage;
  searchResultsPage: SearchResultsPage;
  searchModule:      SearchModule;
  productDetailsPage: ProductDetailsPage;
  cartPage: CartPage;
  productSearchAddToCartModule: ProductSearchAddToCartModule;
  cartModule: ProductSearchAddToCartModule;
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

  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  productSearchAddToCartModule: async ({ searchModule, headerSearchPage, searchResultsPage, productDetailsPage, cartPage }, use) => {
    await use(new ProductSearchAddToCartModule(searchModule, headerSearchPage, searchResultsPage, productDetailsPage, cartPage));
  },

  cartModule: async ({ productSearchAddToCartModule }, use) => {
    await use(productSearchAddToCartModule);
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
