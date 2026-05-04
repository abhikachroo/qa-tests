import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from './BaseApiClient';
import type { ListProductsParams } from '@api/models/products.types';

/**
 * ProductsApiClient — Layer 5
 *
 * Domain API client for the Products catalogue endpoints.
 * All methods return raw APIResponse — callers (test specs) are responsible
 * for parsing the body and asserting the schema via ApiAssert.
 *
 * Endpoints:
 *   GET /products         — list all products (with optional pagination params)
 *   GET /products/{id}    — get a single product by ID
 *
 * Auth: None required — all endpoints are public.
 */
export class ProductsApiClient extends BaseApiClient {
  private static readonly BASE_PATH = '/products';

  constructor(request: APIRequestContext) {
    super(request, 'ProductsApiClient');
  }

  /**
   * GET /products
   * Lists all products. Accepts optional pagination query parameters.
   *
   * @param params - Optional { page, limit } — param names assumed; confirm against live API.
   */
  async listProducts(params?: ListProductsParams): Promise<APIResponse> {
    this.logger.info('listProducts', params);
    const query = this.buildQuery(params);
    return this.get(`${ProductsApiClient.BASE_PATH}${query}`);
  }

  /**
   * GET /products/{id}
   * Retrieves a single product by its ID. Works for valid IDs (200),
   * non-existent IDs (404), and malformed IDs (400 or 404).
   *
   * @param id - Product identifier (numeric string such as "6968173", or malformed string for negative tests)
   */
  async getProduct(id: string): Promise<APIResponse> {
    this.logger.info(`getProduct id=${id}`);
    return this.get(`${ProductsApiClient.BASE_PATH}/${encodeURIComponent(id)}`);
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private buildQuery(params?: ListProductsParams): string {
    if (!params) return '';
    const parts: string[] = [];
    if (params.page !== undefined)  parts.push(`page=${params.page}`);
    if (params.limit !== undefined) parts.push(`limit=${params.limit}`);
    return parts.length > 0 ? `?${parts.join('&')}` : '';
  }
}
