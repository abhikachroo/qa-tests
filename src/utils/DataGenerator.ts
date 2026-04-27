/**
 * DataGenerator — Layer 4 Utility
 *
 * Provides deterministic-random test data for use in test specs and modules.
 * All methods are static. Never hardcode test data in specs — always use this class.
 */
export class DataGenerator {
  /**
   * Generate a unique random email address safe for parallel test runs.
   * @example user_a3f9b2c1@test.com
   */
  static randomEmail(): string {
    return `user_${Math.random().toString(36).substring(2, 10)}@test.com`;
  }

  /**
   * Generate a random alphanumeric string of the specified length.
   * Useful for invalid passwords, search keywords, display names, etc.
   */
  static randomString(length = 10): string {
    let result = '';
    while (result.length < length) {
      result += Math.random().toString(36).substring(2);
    }
    return result.substring(0, length);
  }

  /**
   * Generate a random integer in the inclusive range [min, max].
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a RFC 4122-compliant v4 UUID.
   */
  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  /**
   * Generate an ISO date string N days in the future.
   * @param daysAhead - Number of days ahead of today (default 30)
   */
  static futureDate(daysAhead = 30): string {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  }

  /**
   * Generate a string that is clearly not a valid email address format.
   * Useful for testing client-side email validation.
   */
  static invalidEmailFormat(): string {
    return `notanemail_${Math.random().toString(36).substring(2, 8)}`;
  }
}
