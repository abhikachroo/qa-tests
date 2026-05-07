import { test as base }     from '@playwright/test';
import {
  SearchPage,
  HeaderSearchPage,
  SearchResultsPage,
  LoginPage,
  HomePage,
  CartPage,
  CheckoutLogisticsPage,
  CheckoutVerificationPage,
  OrderConfirmationPage,
} from '@pages/index';
import { SearchModule, LoginModule, CheckoutModule } from '@modules/index';

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
  // Checkout fixtures
  cartPage:                 CartPage;
  checkoutLogisticsPage:    CheckoutLogisticsPage;
  checkoutVerificationPage: CheckoutVerificationPage;
  orderConfirmationPage:    OrderConfirmationPage;
  checkoutModule:           CheckoutModule;
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

  // --- Checkout ---
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutLogisticsPage: async ({ page }, use) => {
    await use(new CheckoutLogisticsPage(page));
  },

  checkoutVerificationPage: async ({ page }, use) => {
    await use(new CheckoutVerificationPage(page));
  },

  orderConfirmationPage: async ({ page }, use) => {
    await use(new OrderConfirmationPage(page));
  },

  checkoutModule: async (
    {
      page,
      searchResultsPage,
      cartPage,
      checkoutLogisticsPage,
      checkoutVerificationPage,
      orderConfirmationPage,
    },
    use,
  ) => {
    await use(
      new CheckoutModule(
        page,
        searchResultsPage,
        cartPage,
        checkoutLogisticsPage,
        checkoutVerificationPage,
        orderConfirmationPage,
      ),
    );
  },
});

export { expect } from '@playwright/test';
