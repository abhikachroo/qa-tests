type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO:  1,
  WARN:  2,
  ERROR: 3,
};

export class Logger {
  private minLevel: LogLevel;

  constructor(private context: string) {
    const raw = (process.env.LOG_LEVEL ?? 'INFO').toUpperCase() as LogLevel;
    this.minLevel = LEVEL_PRIORITY[raw] !== undefined ? raw : 'INFO';
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[this.minLevel]) return;

    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] [${level}] [${this.context}] ${message}`;
    if (data !== undefined) {
      console.log(entry, JSON.stringify(data, null, 2));
    } else {
      console.log(entry);
    }
  }

  debug(message: string, data?: unknown): void { this.log('DEBUG', message, data); }
  info(message: string, data?: unknown): void  { this.log('INFO',  message, data); }
  warn(message: string, data?: unknown): void  { this.log('WARN',  message, data); }
  error(message: string, data?: unknown): void { this.log('ERROR', message, data); }
}
