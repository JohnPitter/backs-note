type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatLog(entry: LogEntry): void {
    const { level, message, timestamp, context } = entry;
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (this.isDevelopment) {
      switch (level) {
        case 'error':
          console.error(prefix, message, context || '');
          break;
        case 'warn':
          console.warn(prefix, message, context || '');
          break;
        case 'debug':
          console.debug(prefix, message, context || '');
          break;
        default:
          console.log(prefix, message, context || '');
      }
    }
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
