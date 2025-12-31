type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'none';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  none: 4
};

class Logger {
  private minLogLevel: LogLevel;
  private isDevelopment = import.meta.env.DEV;

  constructor() {
    const envLogLevel = import.meta.env.VITE_LOG_LEVEL;
    this.minLogLevel = envLogLevel || (this.isDevelopment ? 'debug' : 'error');
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[this.minLogLevel];
  }

  private formatLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) {
      return;
    }

    const { level, message, timestamp, context } = entry;
    const time = new Date(timestamp).toLocaleTimeString('pt-BR');
    const prefix = `[${time}] [${level.toUpperCase()}]`;

    const style = this.getLogStyle(level);

    switch (level) {
      case 'error':
        console.error(`%c${prefix}`, style, message, context || '');
        break;
      case 'warn':
        console.warn(`%c${prefix}`, style, message, context || '');
        break;
      case 'debug':
        console.debug(`%c${prefix}`, style, message, context || '');
        break;
      default:
        console.log(`%c${prefix}`, style, message, context || '');
    }
  }

  private getLogStyle(level: LogLevel): string {
    const styles: Record<LogLevel, string> = {
      debug: 'color: #888; font-weight: normal',
      info: 'color: #0066cc; font-weight: bold',
      warn: 'color: #ff9800; font-weight: bold',
      error: 'color: #f44336; font-weight: bold',
      none: ''
    };
    return styles[level];
  }

  setLogLevel(level: LogLevel): void {
    this.minLogLevel = level;
    this.info(`Log level changed to: ${level}`);
  }

  getLogLevel(): LogLevel {
    return this.minLogLevel;
  }

  private createEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.formatLog(this.createEntry('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.formatLog(this.createEntry('warn', message, context));
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.formatLog(this.createEntry('error', message, context));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.formatLog(this.createEntry('debug', message, context));
  }
}

export const logger = new Logger();
