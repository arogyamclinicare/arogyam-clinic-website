// Production Logging Utility
// Provides structured logging with different levels for production vs development

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  context?: string;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private isProduction: boolean;
  private logLevel: LogLevel;
  private context: string;

  constructor(context: string = 'App') {
    this.isProduction = process.env.NODE_ENV === 'production';
    // In production, only show ERROR and WARN, in development show everything
    this.logLevel = this.isProduction ? LogLevel.WARN : LogLevel.DEBUG;
    this.context = context;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      context: this.context,
      sessionId: this.getSessionId()
    };
  }

  private getSessionId(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sessionId') || 'unknown';
    }
    return 'server';
  }

  private logToStorage(entry: LogEntry) {
    if (typeof window !== 'undefined' && this.isProduction) {
      try {
        const existingLogs = JSON.parse(localStorage.getItem('appLogs') || '[]');
        existingLogs.push(entry);
        // Keep only last 100 logs
        if (existingLogs.length > 100) {
          existingLogs.splice(0, existingLogs.length - 100);
        }
        localStorage.setItem('appLogs', JSON.stringify(existingLogs));
      } catch (e) {
        // Silently fail if storage is full
      }
    }
  }

  private logToConsole(entry: LogEntry) {
    if (!this.isProduction) {
      const prefix = `[${entry.context}]`;
      const timestamp = new Date(entry.timestamp).toLocaleTimeString();
      
      switch (entry.level) {
        case LogLevel.ERROR:
          console.error(`${prefix} ${timestamp} ERROR:`, entry.message, entry.data || '');
          break;
        case LogLevel.WARN:
          console.warn(`${prefix} ${timestamp} WARN:`, entry.message, entry.data || '');
          break;
        case LogLevel.INFO:
          console.info(`${prefix} ${timestamp} INFO:`, entry.message, entry.data || '');
          break;
        case LogLevel.DEBUG:
          console.log(`${prefix} ${timestamp} DEBUG:`, entry.message, entry.data || '');
          break;
      }
    }
  }

  // Public logging methods
  error(message: string, data?: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry = this.createLogEntry(LogLevel.ERROR, message, data);
      this.logToStorage(entry);
      this.logToConsole(entry);
      
      // In production, always log errors to console for debugging
      if (this.isProduction) {
        console.error(`[${this.context}] ERROR:`, message, data || '');
      }
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry = this.createLogEntry(LogLevel.WARN, message, data);
      this.logToStorage(entry);
      this.logToConsole(entry);
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry = this.createLogEntry(LogLevel.INFO, message, data);
      this.logToStorage(entry);
      this.logToConsole(entry);
    }
  }

  debug(message: string, data?: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry = this.createLogEntry(LogLevel.DEBUG, message, data);
      this.logToStorage(entry);
      this.logToConsole(entry);
    }
  }

  // Performance logging
  performance(name: string, duration: number, data?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      this.info(`Performance: ${name}`, { duration: `${duration.toFixed(2)}ms`, ...data });
    }
  }

  // Check if we're in production mode
  isProductionMode(): boolean {
    return this.isProduction;
  }

  // Security logging
  security(event: string, data?: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      this.warn(`Security: ${event}`, data);
    }
  }

  // User action logging
  userAction(action: string, data?: any) {
    if (this.shouldLog(LogLevel.INFO)) {
      this.info(`User Action: ${action}`, data);
    }
  }

  // Get stored logs (for debugging)
  getStoredLogs(): LogEntry[] {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('appLogs') || '[]');
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  // Clear stored logs
  clearStoredLogs() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('appLogs');
    }
  }

  // Export logs for support
  exportLogs(): string {
    const logs = this.getStoredLogs();
    return JSON.stringify(logs, null, 2);
  }
}

// Create default logger instance
export const logger = new Logger();

// Create context-specific loggers
export const createLogger = (context: string) => new Logger(context);

// Export for use in components
export default logger;
