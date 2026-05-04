import { apiTest, expect } from '@fixtures/api';
import { ApiAssert } from '@utils/ApiAssert';
import { config } from '@config/index';
import {
  ProductListSchema,
  ProductSchema,
  ProductNotFoundErrorSchema,
  MalformedIdErrorSchema,
  ValidationErrorSchema,
} from '@api/schemas';

/**
 * Products API Test Suite
 *
 * Covers:
 *   GET /products         — list all products
 *   GET /products/{id}    — get product by ID
 *
 * Scenario order: P0 first → P1 → P2
 * All 15 scenarios: TC-API-001 through TC-API-015
 *
 * Known valid preprod ID: 6968173 (confirmed from product-search-submit.spec.ts)
 * All endpoints are unauthenticated — uses unauthProductsClient fixture only.
 */

const VALID_PRODUCT_ID = '6968173';
const NON_EXISTENT_ID  = '99999999';
const MALFORMED_ID     = 'not-a-valid-id';

apiTest.describe(
  `@P0 @API @Products Products API — ${config.displayName} on ${config.environment}`,
  () => {

    // ═══════════════════════════════════════════════════════════════════════
    // P0 SCENARIOS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * TC-API-001: GET /products returns 200 with non-empty JSON body
     * Core smoke test — a failure here blocks all downstream assertions.
     */
    apiTest('TC-API-001: GET /products returns 200 with non-empty JSON body', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.listProducts>>;

      await apiTest.step('Send GET /products request', async () => {
        response = await unauthProductsClient.listProducts();
      });

      await apiTest.step('Assert HTTP 200 status', async () => {
        await ApiAssert.assertStatus(response, 200);
      });

      await apiTest.step('Assert response body is non-empty JSON', async () => {
        const body = await ApiAssert.assertSchema(response, ProductListSchema);
        // body is either an array or a wrapper object
        const items = Array.isArray(body) ? body : body.items;
        expect(
          items.length,
          'Expected at least one product in preprod catalogue',
        ).toBeGreaterThan(0);
      });
    });

    /**
     * TC-API-003: GET /products/{id} with valid ID returns 200 and correct product
     * Uses known preprod ID 6968173. Prefer dynamic ID from list as primary approach.
     */
    apiTest('TC-API-003: GET /products/{id} with valid ID returns 200 and correct product', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.getProduct>>;

      await apiTest.step(`Send GET /products/${VALID_PRODUCT_ID}`, async () => {
        response = await unauthProductsClient.getProduct(VALID_PRODUCT_ID);
      });

      await apiTest.step('Assert HTTP 200 status', async () => {
        await ApiAssert.assertStatus(response, 200);
      });

      await apiTest.step('Assert response body matches ProductSchema and ID is correct', async () => {
        const product = await ApiAssert.assertSchema(response, ProductSchema);
        // id may be returned as number or string — compare loosely
        expect(
          String(product.id),
          'Returned product ID should match the requested ID',
        ).toBe(VALID_PRODUCT_ID);
        expect(product.name, 'Product name must be a non-empty string').toBeTruthy();
      });
    });

    /**
     * TC-API-005: GET /products/{id} with non-existent ID returns 404
     * Critical contract check — 200 with empty body or 500 is a P0 defect.
     */
    apiTest('TC-API-005: GET /products/{id} with non-existent ID returns 404', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.getProduct>>;

      await apiTest.step(`Send GET /products/${NON_EXISTENT_ID} (non-existent)`, async () => {
        response = await unauthProductsClient.getProduct(NON_EXISTENT_ID);
      });

      await apiTest.step('Assert HTTP 404 status', async () => {
        await ApiAssert.assertStatus(response, 404);
      });

      await apiTest.step('Assert response body does not contain product data (no data leak)', async () => {
        await ApiAssert.assertBody(response, (body) => {
          const b = body as Record<string, unknown>;
          // Must not look like a product response
          expect(b).not.toHaveProperty('name');
        });
      });
    });

    // ═══════════════════════════════════════════════════════════════════════
    // P1 SCENARIOS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * TC-API-002: GET /products response body validates against ProductListSchema
     * Deep Zod schema assertion on the full list response.
     */
    apiTest('TC-API-002: GET /products response body validates against ProductListSchema', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.listProducts>>;

      await apiTest.step('Send GET /products', async () => {
        response = await unauthProductsClient.listProducts();
      });

      await apiTest.step('Assert HTTP 200 status', async () => {
        await ApiAssert.assertStatus(response, 200);
      });

      await apiTest.step('Assert full response validates against ProductListSchema', async () => {
        const body = await ApiAssert.assertSchema(response, ProductListSchema);
        const items = Array.isArray(body) ? body : body.items;
        // Each item in the list must have an id and a non-empty name
        for (const item of items) {
          expect(item.id, 'Each product must have an id').toBeDefined();
          expect(item.name, 'Each product must have a non-empty name').toBeTruthy();
        }
      });
    });

    /**
     * TC-API-004: GET /products/{id} response body validates against ProductSchema
     * Deep field-level schema assertion on the single product detail response.
     */
    apiTest('TC-API-004: GET /products/{id} response body validates against ProductSchema', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.getProduct>>;

      await apiTest.step(`Send GET /products/${VALID_PRODUCT_ID}`, async () => {
        response = await unauthProductsClient.getProduct(VALID_PRODUCT_ID);
      });

      await apiTest.step('Assert HTTP 200 status', async () => {
        await ApiAssert.assertStatus(response, 200);
      });

      await apiTest.step('Assert response validates against ProductSchema with correct field types', async () => {
        const product = await ApiAssert.assertSchema(response, ProductSchema);
        expect(product.id, 'id must be defined').toBeDefined();
        expect(typeof product.name, 'name must be a string').toBe('string');
        expect(product.name.length, 'name must be non-empty').toBeGreaterThan(0);
      });
    });

    /**
     * TC-API-006: GET /products/{id} 404 response includes structured error body
     * Validates the error body structure — not just the status code.
     */
    apiTest('TC-API-006: GET /products/{id} 404 response includes structured error body', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.getProduct>>;

      await apiTest.step(`Send GET /products/${NON_EXISTENT_ID}`, async () => {
        response = await unauthProductsClient.getProduct(NON_EXISTENT_ID);
      });

      await apiTest.step('Assert HTTP 404 status', async () => {
        await ApiAssert.assertStatus(response, 404);
      });

      await apiTest.step('Assert 404 error body matches ProductNotFoundErrorSchema', async () => {
        await ApiAssert.assertSchema(response, ProductNotFoundErrorSchema);
      });
    });

    /**
     * TC-API-007: GET /products/{id} with malformed ID returns 4xx error
     * Status 400 or 404 are both acceptable; 500 is always a defect.
     */
    apiTest('TC-API-007: GET /products/{id} with malformed ID returns 4xx error', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.getProduct>>;

      await apiTest.step(`Send GET /products/${MALFORMED_ID} (malformed ID)`, async () => {
        response = await unauthProductsClient.getProduct(MALFORMED_ID);
      });

      await apiTest.step('Assert status is 4xx (400 or 404 — not 200, not 500)', async () => {
        await ApiAssert.assertStatusIn(response, [400, 404]);
      });

      await apiTest.step('Assert error body validates against MalformedIdErrorSchema', async () => {
        await ApiAssert.assertSchema(response, MalformedIdErrorSchema);
      });
    });

    /**
     * TC-API-011: Product from GET /products/{id} matches corresponding item from list
     * End-to-end consistency check — list and detail must be coherent.
     */
    apiTest('TC-API-011: Product retrieved via GET /products/{id} matches item from list', async ({
      unauthProductsClient,
    }) => {
      let listResponse: Awaited<ReturnType<typeof unauthProductsClient.listProducts>>;
      let detailResponse: Awaited<ReturnType<typeof unauthProductsClient.getProduct>>;
      let firstItemId: string;

      await apiTest.step('Step 1: GET /products and extract first product ID', async () => {
        listResponse = await unauthProductsClient.listProducts();
        await ApiAssert.assertStatus(listResponse, 200);
        const listBody = await ApiAssert.assertSchema(listResponse, ProductListSchema);
        const items = Array.isArray(listBody) ? listBody : listBody.items;
        expect(items.length, 'List must contain at least one product').toBeGreaterThan(0);
        firstItemId = String(items[0].id);
      });

      await apiTest.step(`Step 2: GET /products/{id} using ID from list`, async () => {
        detailResponse = await unauthProductsClient.getProduct(firstItemId!);
        await ApiAssert.assertStatus(detailResponse, 200);
      });

      await apiTest.step('Step 3: Assert detail product ID matches the ID requested from list', async () => {
        const product = await ApiAssert.assertSchema(detailResponse, ProductSchema);
        expect(
          String(product.id),
          'Detail endpoint product ID must match the ID extracted from list',
        ).toBe(firstItemId);
        expect(product.name, 'Product name must be non-empty in detail response').toBeTruthy();
      });
    });

    /**
     * TC-API-012: Each product item in GET /products contains correctly typed fields
     * Field-type validation — fails if any item has type coercion issues.
     */
    apiTest('TC-API-012: Each product item in GET /products contains correctly typed fields', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.listProducts>>;

      await apiTest.step('Send GET /products', async () => {
        response = await unauthProductsClient.listProducts();
      });

      await apiTest.step('Assert HTTP 200 status', async () => {
        await ApiAssert.assertStatus(response, 200);
      });

      await apiTest.step('Assert each item has correctly typed id and name fields', async () => {
        const body = await ApiAssert.assertSchema(response, ProductListSchema);
        const items = Array.isArray(body) ? body : body.items;
        for (const item of items) {
          expect(
            item.id !== null && item.id !== undefined,
            `Item id must not be null or undefined — got: ${JSON.stringify(item.id)}`,
          ).toBe(true);
          expect(
            typeof item.name === 'string' && item.name.length > 0,
            `Item name must be a non-empty string — got: ${JSON.stringify(item.name)}`,
          ).toBe(true);
        }
      });
    });

    /**
     * TC-API-014: GET /products returns Content-Type: application/json header
     */
    apiTest('TC-API-014: GET /products returns Content-Type: application/json header', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.listProducts>>;

      await apiTest.step('Send GET /products', async () => {
        response = await unauthProductsClient.listProducts();
      });

      await apiTest.step('Assert HTTP 200 status', async () => {
        await ApiAssert.assertStatus(response, 200);
      });

      await apiTest.step('Assert Content-Type header is application/json', async () => {
        ApiAssert.assertHeader(response, 'content-type', /application\/json/);
      });
    });

    /**
     * TC-API-015: GET /products/{id} returns Content-Type: application/json header
     */
    apiTest('TC-API-015: GET /products/{id} returns Content-Type: application/json header', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.getProduct>>;

      await apiTest.step(`Send GET /products/${VALID_PRODUCT_ID}`, async () => {
        response = await unauthProductsClient.getProduct(VALID_PRODUCT_ID);
      });

      await apiTest.step('Assert HTTP 200 status', async () => {
        await ApiAssert.assertStatus(response, 200);
      });

      await apiTest.step('Assert Content-Type header is application/json', async () => {
        ApiAssert.assertHeader(response, 'content-type', /application\/json/);
      });
    });

    // ═══════════════════════════════════════════════════════════════════════
    // P2 SCENARIOS
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * TC-API-008: GET /products with out-of-bounds page returns 200 with empty collection
     * NOTE: Pagination param name "page" is assumed — confirm against live API.
     * If API does not support pagination, this test should be skipped.
     */
    apiTest('TC-API-008: GET /products with out-of-bounds page returns 200 with empty collection', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.listProducts>>;

      await apiTest.step('Send GET /products?page=99999 (out-of-bounds page)', async () => {
        response = await unauthProductsClient.listProducts({ page: 99999 });
      });

      await apiTest.step('Assert HTTP 200 status (not 404 or 500)', async () => {
        await ApiAssert.assertStatus(response, 200);
      });

      await apiTest.step('Assert response is a valid list schema with zero or empty items', async () => {
        const body = await ApiAssert.assertSchema(response, ProductListSchema);
        const items = Array.isArray(body) ? body : body.items;
        expect(
          Array.isArray(items),
          'Items must be an array even for out-of-bounds page',
        ).toBe(true);
        expect(
          items.length,
          'Items array must be empty for an out-of-bounds page number',
        ).toBe(0);
      });
    });

    /**
     * TC-API-009: GET /products with limit=0 returns 400 or defaults gracefully (not 500)
     * NOTE: Param name "limit" is assumed — confirm against live API.
     * Accepts either 200 (API defaults gracefully) or 400 (API rejects invalid limit).
     */
    apiTest('TC-API-009: GET /products with limit=0 returns 400 or defaults gracefully (not 500)', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.listProducts>>;

      await apiTest.step('Send GET /products?limit=0', async () => {
        response = await unauthProductsClient.listProducts({ limit: 0 });
      });

      await apiTest.step('Assert status is 200 or 400 (never 500)', async () => {
        await ApiAssert.assertStatusIn(response, [200, 400]);
      });

      await apiTest.step('Assert response body matches appropriate schema based on status', async () => {
        const status = response.status();
        if (status === 200) {
          await ApiAssert.assertSchema(response, ProductListSchema);
        } else {
          await ApiAssert.assertSchema(response, ValidationErrorSchema);
        }
      });
    });

    /**
     * TC-API-010: GET /products response shape matches known contract baseline
     */
    apiTest('TC-API-010: GET /products response shape matches known contract baseline', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.listProducts>>;

      await apiTest.step('Send GET /products', async () => {
        response = await unauthProductsClient.listProducts();
      });

      await apiTest.step('Assert HTTP 200 status', async () => {
        await ApiAssert.assertStatus(response, 200);
      });

      await apiTest.step('Assert response shape validates against ProductListSchema (contract baseline)', async () => {
        const body = await ApiAssert.assertSchema(response, ProductListSchema);
        const isArray = Array.isArray(body);
        const isWrapper = !isArray && typeof body === 'object' && 'items' in body;
        expect(
          isArray || isWrapper,
          `Response must be a root array or wrapper object with "items" key. Got: ${JSON.stringify(Object.keys(body as object))}`,
        ).toBe(true);
      });
    });

    /**
     * TC-API-013: GET /products/{id} response shape matches known contract baseline
     */
    apiTest('TC-API-013: GET /products/{id} response shape matches known contract baseline', async ({
      unauthProductsClient,
    }) => {
      let response: Awaited<ReturnType<typeof unauthProductsClient.getProduct>>;

      await apiTest.step(`Send GET /products/${VALID_PRODUCT_ID}`, async () => {
        response = await unauthProductsClient.getProduct(VALID_PRODUCT_ID);
      });

      await apiTest.step('Assert HTTP 200 status', async () => {
        await ApiAssert.assertStatus(response, 200);
      });

      await apiTest.step('Assert response shape validates against ProductSchema (contract baseline)', async () => {
        const product = await ApiAssert.assertSchema(response, ProductSchema);
        expect(product.id, 'Contract baseline: id field must always be present').toBeDefined();
        expect(product.name, 'Contract baseline: name field must always be non-empty').toBeTruthy();
      });
    });

  },
);
