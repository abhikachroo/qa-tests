/**
 * products.schema.ts — Layer 5 Zod Schemas
 *
 * Zod validators for the Products API response shapes.
 * Derived from ENDPOINT_MAP + Schema Validation Plan in the API test plan artifact.
 *
 * NOTE: Fields derived from AC items are pragmatically typed.
 * After a live API probe confirms exact field names and types, tighten validators:
 *   - Replace z.union([z.string(), z.number()]) with the confirmed type
 *   - Replace .optional() with required if the field is always present
 *   - Add z.enum([...]) for any category / status fields with known value sets
 */

import { z } from 'zod';

// ── Product Item Schema ───────────────────────────────────────────────────────

/**
 * Validates a single product item as returned in the list or detail endpoint.
 * id: accepts both string and number (confirm which format the API uses)
 * name: non-empty string (required)
 * price: positive number (assumed field — set .optional() until confirmed)
 * sku: non-empty string (assumed field — set .optional() until confirmed)
 * category: non-empty string (assumed field — set .optional() until confirmed)
 */
export const ProductItemSchema = z.object({
  id: z.union([z.string().min(1), z.number().int()]),
  name: z.string().min(1),
  price: z.number().nonnegative().optional(),
  sku: z.string().optional(),
  category: z.string().optional(),
}).passthrough(); // passthrough allows additional fields until API contract is confirmed

export type ProductItem = z.infer<typeof ProductItemSchema>;

// ── Product List Schema ───────────────────────────────────────────────────────

/**
 * Validates GET /products response.
 * Accepts BOTH possible shapes:
 *   1. Root array: [{ id, name, ... }, ...]
 *   2. Wrapper object: { items: [...], total: N, page: N }
 * After confirming the live API shape, replace this union with a single schema.
 */
export const ProductListArraySchema = z.array(ProductItemSchema);

export const ProductListWrapperSchema = z.object({
  items: z.array(ProductItemSchema),
  total: z.number().int().nonnegative().optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  hasNext: z.boolean().optional(),
}).passthrough();

export const ProductListSchema = z.union([
  ProductListArraySchema,
  ProductListWrapperSchema,
]);

export type ProductList = z.infer<typeof ProductListSchema>;
export type ProductListWrapper = z.infer<typeof ProductListWrapperSchema>;

// ── Product Detail Schema ─────────────────────────────────────────────────────

/**
 * Validates GET /products/{id} response (single product).
 * Identical base to ProductItemSchema — may include additional detail-only fields.
 */
export const ProductSchema = ProductItemSchema;
export type Product = z.infer<typeof ProductSchema>;

// ── Error Schemas ─────────────────────────────────────────────────────────────

/**
 * Validates 404 Not Found error response from GET /products/{id}.
 * Uses a union to handle both "error" and "message" field naming conventions.
 * Replace with a single z.object() once the exact field name is confirmed.
 */
export const ProductNotFoundErrorSchema = z.union([
  z.object({ error: z.string().min(1) }).passthrough(),
  z.object({ message: z.string().min(1) }).passthrough(),
  z.object({ code: z.string().min(1), message: z.string().min(1) }).passthrough(),
]);

export type ProductNotFoundError = z.infer<typeof ProductNotFoundErrorSchema>;

/**
 * Validates the error response for a malformed / invalid product ID (e.g., "not-a-valid-id").
 * May be identical to ProductNotFoundErrorSchema — confirm after testing both paths.
 */
export const MalformedIdErrorSchema = ProductNotFoundErrorSchema;
export type MalformedIdError = z.infer<typeof MalformedIdErrorSchema>;

/**
 * Validates the error response when invalid query params are supplied (e.g., limit=0).
 * Only needed if the API returns 400; if it defaults gracefully with 200, this is unused.
 */
export const ValidationErrorSchema = z.union([
  z.object({ error: z.string() }).passthrough(),
  z.object({ message: z.string() }).passthrough(),
  z.object({ code: z.string() }).passthrough(),
]);

export type ValidationError = z.infer<typeof ValidationErrorSchema>;
