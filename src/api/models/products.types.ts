/**
 * products.types.ts — Layer 5 Type Interfaces
 *
 * TypeScript interfaces for the Products API request and response shapes.
 * These are derived from the ENDPOINT_MAP in the API test plan.
 *
 * NOTE: Field names marked (assumed) were inferred from AC items.
 * Validate against live API responses and update Zod schemas accordingly.
 */

// ── Query Parameter Shapes ────────────────────────────────────────────────────

export interface ListProductsParams {
  /** Page number for pagination (assumed param name — confirm against live API) */
  page?: number;
  /** Page size limit (assumed param name — confirm against live API) */
  limit?: number;
}

// ── Response Shapes ───────────────────────────────────────────────────────────

/**
 * A single product item as returned within the list endpoint.
 * All fields except `id` and `name` are assumed from AC — confirm before finalising Zod schema.
 */
export interface ProductItem {
  id: string | number;
  name: string;
  price?: number;          // assumed
  sku?: string;            // assumed
  category?: string;       // assumed
  [key: string]: unknown;  // allows for additional fields not yet documented
}

/**
 * Response shape for GET /products.
 * May be a root array or a wrapper object — shape must be confirmed against live API.
 * Zod schema: ProductListSchema (union of both shapes).
 */
export type ProductListResponse = ProductItem[] | ProductListWrapper;

export interface ProductListWrapper {
  items: ProductItem[];
  total?: number;
  page?: number;
  limit?: number;
  hasNext?: boolean;
  [key: string]: unknown;
}

/**
 * Response shape for GET /products/{id} (single product detail).
 * May include additional fields not present in the list response.
 */
export interface ProductDetail extends ProductItem {
  // Additional detail-only fields (if any) discovered during live probe
  [key: string]: unknown;
}

// ── Error Response Shapes ─────────────────────────────────────────────────────

/**
 * 404 Not Found error response from GET /products/{id}.
 * Exact field name (error vs message vs code) must be confirmed against live 404 response.
 */
export interface ProductNotFoundError {
  error?: string;
  message?: string;
  code?: string;
  [key: string]: unknown;
}

/**
 * Error response for malformed / invalid ID inputs.
 * May be identical to ProductNotFoundError — confirm after testing both paths.
 */
export type MalformedIdError = ProductNotFoundError;

/**
 * Validation error for invalid query parameters (e.g., limit=0).
 * Only returned if the API responds with 400; otherwise API defaults gracefully.
 */
export type ValidationError = ProductNotFoundError;
