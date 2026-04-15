import { test as base } from '@playwright/test';
import { SearchPage, ProductDetailPage, CartPage, CheckoutPage } from '@pages/index';
import { SearchModule, CartModule, CheckoutModule } from '@modules/index';

type TestFixtures = {
  // ── Existing ──────────────────────────────────────────────────────────────
  searchPage:   SearchPage;
  searchModule: SearchModule;

  // ── Guest Checkout ────────────────────────────────────────────────────────
  productDetailPage: ProductDetailPage;
  cartPage:          CartPage;
  checkoutPage:      CheckoutPage;
  cartModule:        CartModule;
  checkoutModule:    CheckoutModule;
};

export const test = base.extend<TestFixtures>({
  // ── Existing ──────────────────────────────────────────────────────────────
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  searchModule: async ({ searchPage }, use) => {
    await use(new SearchModule(searchPage));
  },

  // ── Guest Checkout ────────────────────────────────────────────────────────
  productDetailPage: async ({ page }, use) => {
    await use(new ProductDetailPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  cartModule: async ({ productDetailPage, cartPage }, use) => {
    await use(new CartModule(productDetailPage, cartPage));
  },
  checkoutModule: async ({ checkoutPage }, use) => {
    await use(new CheckoutModule(checkoutPage));
  },
});

export { expect } from '@playwright/test';
