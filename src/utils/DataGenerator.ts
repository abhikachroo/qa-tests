export class DataGenerator {
  static randomEmail(): string {
    return `user_${Math.random().toString(36).substring(2, 10)}@test.com`;
  }

  static randomString(length = 10): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  static futureDate(daysAhead = 30): string {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  }
}
