import { test as base } from '@playwright/test';
import { ProductsApiClient } from '@api/clients/ProductsApiClient';

/**
 * api.fixtures.ts — Layer 6 API Fixtures
 *
 * Extends the Playwright base test with typed ProductsApiClient fixtures.
 * Import `apiTest` from this module in all *.api.spec.ts files.
 * Never import `test` from '@playwright/test' or '@fixtures' in API spec files.
 *
 * All Products endpoints are unauthenticated — only one fixture variant needed.
 * If authentication is added in future, add an authenticatedProductsClient here.
 */

type ApiFixtures = {
  /**
   * Unauthenticated ProductsApiClient.
   * Use for all Products API tests (endpoints are public — no token required).
   */
  unauthProductsClient: ProductsApiClient;
};

export const apiTest = base.extend<ApiFixtures>({
  unauthProductsClient: async ({ request }, use) => {
    const client = new ProductsApiClient(request);
    await use(client);
    // No teardown required — unauthenticated client, no session to invalidate
  },
});

export { expect } from '@playwright/test';
