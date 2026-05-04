import { APIRequestContext, APIResponse } from '@playwright/test';
import { config } from '@config/index';
import { Logger } from '@utils/Logger';

/**
 * BaseApiClient — Layer 5
 *
 * Abstract base class for all domain API clients.
 * Owns HTTP transport: auth headers, base URL injection, and structured logging.
 * Never performs assertions — callers receive raw APIResponse.
 * Never calls response.json() — callers parse the body exactly once.
 */
export abstract class BaseApiClient {
  protected readonly baseUrl: string;
  private token: string | null = null;
  protected readonly logger: Logger;

  constructor(
    protected readonly request: APIRequestContext,
    context: string,
  ) {
    this.baseUrl = config.apiUrl;
    this.logger = new Logger(context);
  }

  /** Set the bearer token for all subsequent requests from this instance. */
  setToken(token: string): void {
    this.token = token;
    this.logger.debug('Token set');
  }

  /** Clear the token (used in 401/403 test scenarios). */
  clearToken(): void {
    this.token = null;
    this.logger.debug('Token cleared');
  }

  protected authHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...extra,
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  protected async get(
    path: string,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    const url = `${this.baseUrl}${path}`;
    this.logger.info(`GET ${url}`);
    const response = await this.request.get(url, {
      headers: this.authHeaders(headers),
    });
    this.logger.debug(`Response ${response.status()} for GET ${path}`);
    return response;
  }

  protected async post(
    path: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    const url = `${this.baseUrl}${path}`;
    this.logger.info(`POST ${url}`);
    const response = await this.request.post(url, {
      data: body,
      headers: this.authHeaders(headers),
    });
    this.logger.debug(`Response ${response.status()} for POST ${path}`);
    return response;
  }

  protected async put(
    path: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    const url = `${this.baseUrl}${path}`;
    this.logger.info(`PUT ${url}`);
    const response = await this.request.put(url, {
      data: body,
      headers: this.authHeaders(headers),
    });
    this.logger.debug(`Response ${response.status()} for PUT ${path}`);
    return response;
  }

  protected async patch(
    path: string,
    body: unknown,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    const url = `${this.baseUrl}${path}`;
    this.logger.info(`PATCH ${url}`);
    const response = await this.request.patch(url, {
      data: body,
      headers: this.authHeaders(headers),
    });
    this.logger.debug(`Response ${response.status()} for PATCH ${path}`);
    return response;
  }

  protected async delete(
    path: string,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    const url = `${this.baseUrl}${path}`;
    this.logger.info(`DELETE ${url}`);
    const response = await this.request.delete(url, {
      headers: this.authHeaders(headers),
    });
    this.logger.debug(`Response ${response.status()} for DELETE ${path}`);
    return response;
  }
}
