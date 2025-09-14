/**
 * Production-Ready Error Handling System
 * Secure error handling for healthcare applications
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  DATABASE = 'database',
  NETWORK = 'network',
  SYSTEM = 'system',
  SECURITY = 'security',
  BUSINESS_LOGIC = 'business_logic'
}

export interface ErrorContext {
  userId?: string;
  requestId?: string;
  timestamp: string;
  userAgent?: string;
  ip?: string;
  feature: string;
  action: string;
}

export interface SecureError {
  id: string;
  code: string;
  message: string;
  userMessage: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context: ErrorContext;
  stack?: string;
  originalError?: Error;
}

class ProductionErrorHandler {
  private static instance: ProductionErrorHandler;
  private errorLog: SecureError[] = [];

  private constructor() {
    // Empty block
  }

  public static getInstance(): ProductionErrorHandler {
    if (!ProductionErrorHandler.instance) {
      ProductionErrorHandler.instance = new ProductionErrorHandler();
    }
    return ProductionErrorHandler.instance;
  }

  /**
   * Handle errors with proper sanitization for healthcare
   */
  public handleError(
    error: Error | unknown,
    category: ErrorCategory,
    feature: string,
    action: string,
    context?: Partial<ErrorContext>
  ): SecureError {
    const errorId = this.generateErrorId();
    const timestamp = new Date().toISOString();
    
    const secureError: SecureError = {
      id: errorId,
      code: this.generateErrorCode(category),
      message: this.sanitizeErrorMessage(error),
      userMessage: this.getUserFriendlyMessage(category),
      severity: this.determineSeverity(category, error),
      category,
      context: {
        ...context,
        timestamp,
        feature,
        action
      }
    };

    // Add stack trace only in development
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
      secureError.stack = error instanceof Error ? error.stack : undefined;
      secureError.originalError = error instanceof Error ? error : undefined;
    }

    this.logError(secureError);
    this.notifyIfCritical(secureError);

    return secureError;
  }

  /**
   * Handle PDF generation errors specifically
   */
  public handlePDFError(
    error: Error | unknown,
    patientId?: string,
    consultationId?: string
  ): SecureError {
    return this.handleError(
      error,
      ErrorCategory.BUSINESS_LOGIC,
      'pdf_generation',
      'generate_prescription',
      {
        userId: patientId,
        requestId: consultationId
      }
    );
  }

  /**
   * Handle authentication errors
   */
  public handleAuthError(
    error: Error | unknown,
    userId?: string,
    action: string = 'authentication'
  ): SecureError {
    return this.handleError(
      error,
      ErrorCategory.AUTHENTICATION,
      'authentication',
      action,
      { userId }
    );
  }

  /**
   * Handle database errors with PII protection
   */
  public handleDatabaseError(
    error: Error | unknown,
    query?: string,
    userId?: string
  ): SecureError {
    return this.handleError(
      error,
      ErrorCategory.DATABASE,
      'database',
      'query_execution',
      { 
        userId,
        requestId: query ? this.hashSensitiveData(query) : undefined
      }
    );
  }

  private generateErrorId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateErrorCode(category: ErrorCategory): string {
    const categoryCode = category.toUpperCase().replace('_', '');
    const timestamp = Date.now().toString().slice(-6);
    return `${categoryCode}_${timestamp}`;
  }

  private sanitizeErrorMessage(error: Error | unknown): string {
    if (error instanceof Error) {
      // Remove PII and sensitive information
      return error.message
        .replace(/\b[\w.-]+@[\w.-]+.\w+\b/g, '[EMAIL_REDACTED]')
        .replace(/\b\d{10,15}\b/g, '[PHONE_REDACTED]')
        .replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD_REDACTED]')
        .replace(/password|token|secret|key/gi, '[SENSITIVE_DATA]');
    }
    return 'Unknown error occurred';
  }

  private getUserFriendlyMessage(category: ErrorCategory): string {
    const messages = {
      [ErrorCategory.AUTHENTICATION]: 'Authentication failed. Please try logging in again.',
      [ErrorCategory.AUTHORIZATION]: 'You do not have permission to perform this action.',
      [ErrorCategory.VALIDATION]: 'Please check your input and try again.',
      [ErrorCategory.DATABASE]: 'A temporary issue occurred. Please try again later.',
      [ErrorCategory.NETWORK]: 'Network connectivity issue. Please check your connection.',
      [ErrorCategory.SYSTEM]: 'A system error occurred. Our team has been notified.',
      [ErrorCategory.SECURITY]: 'Security validation failed. Please contact support.',
      [ErrorCategory.BUSINESS_LOGIC]: 'Unable to complete the requested operation.'
    };
    return messages[category] || 'An unexpected error occurred.';
  }

  private determineSeverity(category: ErrorCategory, _error: Error | unknown): ErrorSeverity {
    // Critical security and authentication errors
    if (category === ErrorCategory.SECURITY || category === ErrorCategory.AUTHENTICATION) {
      return ErrorSeverity.CRITICAL;
    }

    // High severity for database and system errors
    if (category === ErrorCategory.DATABASE || category === ErrorCategory.SYSTEM) {
      return ErrorSeverity.HIGH;
    }

    // Medium for validation and network
    if (category === ErrorCategory.VALIDATION || category === ErrorCategory.NETWORK) {
      return ErrorSeverity.MEDIUM;
    }

    return ErrorSeverity.LOW;
  }

  private logError(error: SecureError): void {
    // In production, this would send to logging service
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') {
      // Send to external logging service (e.g., Sentry, LogRocket, etc.)
      this.sendToLoggingService(error);
    } else {
      // Development logging - safe for development only
      if (typeof console !== 'undefined') {
        console.error(`[${error.severity.toUpperCase()}] ${error.code}: ${error.message}`, {
          id: error.id,
          category: error.category,
          context: error.context
        });
      }
    }

    // Store in memory for debugging (limit size)
    this.errorLog.push(error);
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }
  }

  private notifyIfCritical(error: SecureError): void {
    if (error.severity === ErrorSeverity.CRITICAL) {
      // In production, send immediate alerts
      this.sendCriticalAlert(error);
    }
  }

  private sendToLoggingService(error: SecureError): void {
    // Implementation for external logging service
    // This would typically use services like Sentry, DataDog, etc.
    try {
      // Example: Sentry.captureException(error);
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error)
      }).catch(() => {
        // Fallback logging if external service fails
        localStorage.setItem(`error_${error.id}`, JSON.stringify(error));
      });
    } catch {
      // Silent fail for logging to prevent cascading errors
    }
  }

  private sendCriticalAlert(error: SecureError): void {
    // Implementation for critical alerts
    // This could be Slack, email, SMS, etc.
    try {
      fetch('/api/alerts/critical', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          errorId: error.id,
          message: error.message,
          timestamp: error.context.timestamp,
          feature: error.context.feature
        })
      }).catch(() => {
        // Fallback alert mechanism
      });
    } catch {
      // Silent fail for alerting
    }
  }

  private hashSensitiveData(data: string): string {
    // Simple hash for sensitive data
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Get recent errors for debugging (admin only)
   */
  public getRecentErrors(limit: number = 10): SecureError[] {
    return this.errorLog.slice(-limit);
  }

  /**
   * Clear error log
   */
  public clearErrorLog(): void {
    this.errorLog = [];
  }
}

// Export singleton instance
export const errorHandler = ProductionErrorHandler.getInstance();

// Export error boundary component
export class ErrorBoundary extends Error {
  constructor(
    message: string,
    public category: ErrorCategory,
    public feature: string,
    public action: string
  ) {
    super(message);
    this.name = 'ErrorBoundary';
  }
}

// Utility functions
export function createError(
  message: string,
  category: ErrorCategory,
  feature: string,
  action: string
): ErrorBoundary {
  return new ErrorBoundary(message, category, feature, action);
}

export function handleAsyncError<T>(
  promise: Promise<T>,
  category: ErrorCategory,
  feature: string,
  action: string
): Promise<T> {
  return promise.catch((error) => {
    const secureError = errorHandler.handleError(error, category, feature, action);
    throw secureError;
  });
}