import { APIResponse, expect } from '@playwright/test';
import { ZodSchema } from 'zod';
import { Logger } from './Logger';

const logger = new Logger('ApiAssert');

/**
 * ApiAssert — Layer 5 Assertion Utility
 *
 * Central assertion helper for all API test specs.
 * Import in test files — never assert inline without going through these methods.
 *
 * IMPORTANT: response.json() consumes the body stream.
 * assertSchema() and assertBody() each call .json() once internally.
 * Never call response.json() again after invoking one of these methods.
 */
export class ApiAssert {
  /**
   * Assert exact HTTP status code.
   * On mismatch, reads the body and includes it in the failure message.
   * Always call this BEFORE any body access.
   */
  static async assertStatus(response: APIResponse, expected: number): Promise<void> {
    const actual = response.status();
    if (actual !== expected) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }
      logger.error(`Status mismatch — expected ${expected}, got ${actual}`, { body });
      expect(
        actual,
        `Expected HTTP ${expected} but received ${actual}. Body: ${JSON.stringify(body)}`,
      ).toBe(expected);
    }
  }

  /**
   * Assert the HTTP status is one of several accepted values.
   * Useful when the API can legitimately return multiple status codes
   * (e.g., 400 or 404 for a malformed ID).
   */
  static async assertStatusIn(response: APIResponse, expected: number[]): Promise<void> {
    const actual = response.status();
    if (!expected.includes(actual)) {
      let body: unknown;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }
      logger.error(`Status not in [${expected.join(', ')}], got ${actual}`, { body });
      expect(
        expected,
        `Expected status in [${expected.join(', ')}] but received ${actual}. Body: ${JSON.stringify(body)}`,
      ).toContain(actual);
    }
  }

  /**
   * Assert a response header value.
   * Accepts a string (exact match) or RegExp.
   */
  static assertHeader(
    response: APIResponse,
    name: string,
    expected: string | RegExp,
  ): void {
    const actual = response.headers()[name.toLowerCase()];
    logger.debug(`Header "${name}": "${actual ?? '(missing)'}", expected: ${expected}`);
    if (actual === undefined) {
      throw new Error(`Expected header "${name}" to be present but it was missing`);
    }
    if (expected instanceof RegExp) {
      expect(
        actual,
        `Header "${name}": expected to match ${expected}, got "${actual}"`,
      ).toMatch(expected);
    } else {
      expect(
        actual,
        `Header "${name}": expected "${expected}", got "${actual}"`,
      ).toBe(expected);
    }
  }

  /**
   * Parse the response body as JSON and validate against the Zod schema.
   * Returns the typed parsed value for further assertions.
   *
   * IMPORTANT: Consumes the body stream — call once and store the return value.
   */
  static async assertSchema<T>(
    response: APIResponse,
    schema: ZodSchema<T>,
  ): Promise<T> {
    const raw = await response.json();
    const result = schema.safeParse(raw);
    if (!result.success) {
      const issues = result.error.issues.map(
        (issue) => `  - [${issue.path.join('.')}] ${issue.message} (${issue.code})`,
      );
      const message = [
        'Schema validation failed:',
        ...issues,
        '',
        'Actual body:',
        JSON.stringify(raw, null, 2),
      ].join('\n');
      logger.error('Schema validation failed', { issues: result.error.issues, raw });
      throw new Error(message);
    }
    logger.debug('Schema validation passed');
    return result.data;
  }

  /**
   * Parse the response body as JSON once and pass it to an assertion callback.
   * Use this for targeted assertions beyond schema validation.
   *
   * IMPORTANT: Consumes the body stream — do not call response.json() again after this.
   */
  static async assertBody(
    response: APIResponse,
    assertions: (body: unknown) => void,
  ): Promise<void> {
    const body = await response.json();
    logger.debug('Asserting body', { body });
    assertions(body);
  }

  /**
   * Parse the response body as JSON and assert it contains all key/value pairs in `subset`.
   * Deep partial match — only the keys present in `subset` are checked.
   *
   * IMPORTANT: Consumes the body stream — call once per response.
   */
  static async assertJsonContains(
    response: APIResponse,
    subset: Record<string, unknown>,
  ): Promise<void> {
    const body = (await response.json()) as Record<string, unknown>;
    logger.debug('Asserting JSON contains', { subset, body });
    for (const [key, value] of Object.entries(subset)) {
      expect(
        body,
        `Expected body to contain key "${key}" with value ${JSON.stringify(value)}`,
      ).toMatchObject({ [key]: value });
    }
  }
}
