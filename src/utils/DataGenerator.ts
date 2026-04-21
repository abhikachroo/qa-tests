/**
 * DataGenerator — static helpers for generating non-deterministic test data.
 *
 * Never hardcode test data values directly in tests — always use this class.
 * This ensures uniqueness across parallel runs and avoids data collisions.
 */
export class DataGenerator {
  /** Random email address safe for test use */
  static randomEmail(): string {
    return `user_${Math.random().toString(36).substring(2, 10)}@test.example.com`;
  }

  /** Random alphanumeric string of given length */
  static randomString(length = 10): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  /** Random integer in range [min, max] inclusive */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** Random quantity value strictly > 1 (for quantity management tests) */
  static randomQuantityGtOne(max = 10): number {
    return DataGenerator.randomInt(2, max);
  }

  /** RFC 4122 v4 UUID */
  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  /** ISO date string N days from today */
  static futureDate(daysAhead = 30): string {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  }

  /** Unique project name with timestamp suffix */
  static projectName(prefix = 'AutoTest'): string {
    return `${prefix}-${Date.now()}`;
  }

  /** Unique switchboard name with timestamp suffix */
  static switchboardName(prefix = 'SB'): string {
    return `${prefix}-${Date.now()}`;
  }
}
