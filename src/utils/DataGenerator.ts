/**
 * DataGenerator — static helpers for generating unique, non-deterministic test data.
 * Never hardcode emails, passwords, UUIDs, or dates in tests. Use these methods instead.
 */
export class DataGenerator {
  /**
   * Returns a unique email address safe for parallel test runs.
   * Example: user_k2x9m4ab@test.example.com
   */
  static randomEmail(): string {
    const suffix = Math.random().toString(36).substring(2, 10);
    return `user_${suffix}@test.example.com`;
  }

  /**
   * Returns a random alphanumeric string of the given length.
   */
  static randomString(length = 10): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  /**
   * Returns a random integer in [min, max] inclusive.
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Returns a RFC-4122 v4 UUID.
   */
  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  /**
   * Returns an ISO date string N days in the future (YYYY-MM-DD).
   */
  static futureDate(daysAhead = 30): string {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  }
}
