// Comprehensive logging utility for Arogyam Clinic
// Provides structured logging with different levels and security features

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'security' | 'performance';
  component: string;
  message: string;
  data?: any;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoggerConfig {
  enableConsole: boolean;
  enableRemote: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error' | 'security' | 'performance';
  maxLogEntries: number;
  enableSecurityLogging: boolean;
  enablePerformanceLogging: boolean;
}

// Default configuration
const DEFAULT_CONFIG: LoggerConfig = {
  enableConsole: true,
  enableRemote: false,
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  maxLogEntries: 1000,
  enableSecurityLogging: true,
  enablePerformanceLogging: true
};

// Log levels priority
const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  security: 4,
  performance: 5
};

class Logger {
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private component: string;

  constructor(component: string, config?: Partial<LoggerConfig>) {
    this.component = component;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // Check if log level should be processed
  private shouldLog(level: string): boolean {
    return LOG_LEVELS[level as keyof typeof LOG_LEVELS] >= LOG_LEVELS[this.config.logLevel];
  }

  // Create log entry
  private createLogEntry(
    level: LogEntry['level'],
    message: string,
    data?: any
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component: this.component,
      message,
      data,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };

    // Add to buffer
    this.logBuffer.push(entry);

    // Maintain buffer size
    if (this.logBuffer.length > this.config.maxLogEntries) {
      this.logBuffer.shift();
    }

    return entry;
  }

  // Format log message for console
  private formatConsoleMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const level = entry.level.toUpperCase().padEnd(8);
    const component = `[${entry.component}]`.padEnd(20);
    
    let message = `${timestamp} ${level} ${component} ${entry.message}`;
    
    if (entry.data) {
      message += ` | Data: ${JSON.stringify(entry.data, null, 2)}`;
    }
    
    return message;
  }

  // Send log to remote service (placeholder for production)
  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemote) return;

    try {
      // In production, this would send to your logging service
      // Example: Sentry, LogRocket, or custom logging API
      if (entry.level === 'security' || entry.level === 'error') {
        // Always send security and error logs
      }
    } catch (error) {
      // Don't let logging errors break the app
    }
  }

  // Log methods
  debug(message: string, data?: any): void {
    if (!this.shouldLog('debug')) return;
    
    const entry = this.createLogEntry('debug', message, data);
    
    if (this.config.enableConsole) {
      console.debug(this.formatConsoleMessage(entry));
    }
    
    this.sendToRemote(entry);
  }

  info(message: string, data?: any): void {
    if (!this.shouldLog('info')) return;
    
    const entry = this.createLogEntry('info', message, data);
    
    if (this.config.enableConsole) {
      console.info(this.formatConsoleMessage(entry));
    }
    
    this.sendToRemote(entry);
  }

  warn(message: string, data?: any): void {
    if (!this.shouldLog('warn')) return;
    
    const entry = this.createLogEntry('warn', message, data);
    
    if (this.config.enableConsole) {
      console.warn(this.formatConsoleMessage(entry));
    }
    
    this.sendToRemote(entry);
  }

  error(message: string, data?: any): void {
    if (!this.shouldLog('error')) return;
    
    const entry = this.createLogEntry('error', message, data);
    
    if (this.config.enableConsole) {
      console.error(this.formatConsoleMessage(entry));
    }
    
    this.sendToRemote(entry);
  }

  // Security-specific logging
  security(message: string, data?: any): void {
    if (!this.config.enableSecurityLogging || !this.shouldLog('security')) return;
    
    const entry = this.createLogEntry('security', message, data);
    
    if (this.config.enableConsole) {
      console.warn(`🔒 SECURITY: ${this.formatConsoleMessage(entry)}`);
    }
    
    // Always send security logs to remote service
    this.sendToRemote(entry);
  }

  // Performance-specific logging
  performance(message: string, data?: any): void {
    if (!this.config.enablePerformanceLogging || !this.shouldLog('performance')) return;
    
    const entry = this.createLogEntry('performance', message, data);
    
    if (this.config.enableConsole) {
      console.log(`⚡ PERFORMANCE: ${this.formatConsoleMessage(entry)}`);
    }
    
    this.sendToRemote(entry);
  }

  // Get all logs (useful for debugging)
  getLogs(): LogEntry[] {
    return [...this.logBuffer];
  }

  // Clear log buffer
  clearLogs(): void {
    this.logBuffer = [];
  }

  // Export logs (useful for support)
  exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }

  // Update configuration
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Factory function to create logger instances
export function createLogger(component: string, config?: Partial<LoggerConfig>): Logger {
  return new Logger(component, config);
}

// Global logger for app-wide events
export const globalLogger = createLogger('Global');

// Security logger for security events
export const securityLogger = createLogger('Security', {
  logLevel: 'security',
  enableSecurityLogging: true
});

// Performance logger for performance events
export const performanceLogger = createLogger('Performance', {
  logLevel: 'performance',
  enablePerformanceLogging: true
});

// Export default logger
export default createLogger;
