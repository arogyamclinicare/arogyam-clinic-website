import { SECURITY_CONFIG } from './config';

// Security event types
export enum SecurityEventType {
  LOGIN_ATTEMPT = 'LOGIN_ATTEMPT',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_REFRESH = 'SESSION_REFRESH',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CSRF_TOKEN_INVALID = 'CSRF_TOKEN_INVALID',
  CSRF_TOKEN_EXPIRED = 'CSRF_TOKEN_EXPIRED',
  INPUT_VALIDATION_FAILED = 'INPUT_VALIDATION_FAILED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  ADMIN_ACTION = 'ADMIN_ACTION',
  DATA_ACCESS = 'DATA_ACCESS',
  DATA_MODIFICATION = 'DATA_MODIFICATION',
  SECURITY_CONFIG_CHANGE = 'SECURITY_CONFIG_CHANGE'
}

// Security event severity levels
export enum SecuritySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Security event interface
export interface SecurityEvent {
  id: string;
  timestamp: number;
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  details: Record<string, any>;
  metadata: {
    source: string;
    version: string;
    environment: string;
  };
}

// Audit logger class
export class SecurityAuditLogger {
  private static readonly STORAGE_KEY = 'arogyam_security_audit_log';
  private static readonly MAX_LOG_ENTRIES = 1000; // Keep last 1000 entries
  private static readonly LOG_RETENTION_DAYS = SECURITY_CONFIG.MONITORING.LOG_RETENTION_DAYS;

  /**
   * Log a security event
   */
  static logEvent(
    eventType: SecurityEventType,
    severity: SecuritySeverity,
    details: Record<string, any> = {},
    userInfo?: {
      userId?: string;
      userEmail?: string;
      userRole?: string;
    }
  ): void {
    if (!SECURITY_CONFIG.MONITORING.ENABLE_SECURITY_LOGGING) {
      return;
    }

    try {
      const event: SecurityEvent = {
        id: this.generateEventId(),
        timestamp: Date.now(),
        eventType,
        severity,
        userId: userInfo?.userId,
        userEmail: userInfo?.userEmail,
        userRole: userInfo?.userRole,
        ipAddress: this.getClientIP(),
        userAgent: this.getUserAgent(),
        sessionId: this.getSessionId(),
        details,
        metadata: {
          source: 'arogyam-clinic-frontend',
          version: '1.0.0',
          environment: SECURITY_CONFIG.ENV.APP_ENV
        }
      };

      this.storeEvent(event);
      this.cleanupOldLogs();
      
      // Log to console in development
      if (SECURITY_CONFIG.ENV.IS_DEVELOPMENT) {
        console.log('🔒 Security Event Logged:', event);
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  /**
   * Log login attempt
   */
  static logLoginAttempt(email: string, success: boolean, details: Record<string, any> = {}): void {
    const eventType = success ? SecurityEventType.LOGIN_SUCCESS : SecurityEventType.LOGIN_FAILURE;
    const severity = success ? SecuritySeverity.LOW : SecuritySeverity.MEDIUM;
    
    this.logEvent(eventType, severity, {
      email,
      success,
      ...details
    }, { userEmail: email });
  }

  /**
   * Log account lockout
   */
  static logAccountLockout(email: string, reason: string, duration: number): void {
    this.logEvent(SecurityEventType.ACCOUNT_LOCKED, SecuritySeverity.HIGH, {
      email,
      reason,
      lockoutDuration: duration,
      lockoutUntil: Date.now() + duration
    }, { userEmail: email });
  }

  /**
   * Log CSRF token validation failure
   */
  static logCSRFFailure(userId?: string, details: Record<string, any> = {}): void {
    this.logEvent(SecurityEventType.CSRF_TOKEN_INVALID, SecuritySeverity.HIGH, {
      ...details,
      failureType: 'CSRF_TOKEN_INVALID'
    }, { userId });
  }

  /**
   * Log suspicious activity
   */
  static logSuspiciousActivity(
    activity: string,
    severity: SecuritySeverity,
    details: Record<string, any> = {},
    userInfo?: { userId?: string; userEmail?: string; userRole?: string }
  ): void {
    this.logEvent(SecurityEventType.SUSPICIOUS_ACTIVITY, severity, {
      activity,
      ...details
    }, userInfo);
  }

  /**
   * Log admin action
   */
  static logAdminAction(
    action: string,
    targetId?: string,
    details: Record<string, any> = {},
    userInfo?: { userId?: string; userEmail?: string; userRole?: string }
  ): void {
    this.logEvent(SecurityEventType.ADMIN_ACTION, SecuritySeverity.MEDIUM, {
      action,
      targetId,
      ...details
    }, userInfo);
  }

  /**
   * Log data access
   */
  static logDataAccess(
    dataType: string,
    dataId: string | undefined,
    accessMethod: string,
    userInfo?: { userId?: string; userEmail?: string; userRole?: string }
  ): void {
    this.logEvent(SecurityEventType.DATA_ACCESS, SecuritySeverity.LOW, {
      dataType,
      dataId,
      accessMethod
    }, userInfo);
  }

  /**
   * Log data modification
   */
  static logDataModification(
    dataType: string,
    dataId: string | undefined,
    modificationType: 'CREATE' | 'UPDATE' | 'DELETE',
    changes: Record<string, any> | undefined,
    userInfo?: { userId?: string; userEmail?: string; userRole?: string }
  ): void {
    this.logEvent(SecurityEventType.DATA_MODIFICATION, SecuritySeverity.MEDIUM, {
      dataType,
      dataId,
      modificationType,
      changes
    }, userInfo);
  }

  /**
   * Get all security events
   */
  static getSecurityEvents(): SecurityEvent[] {
    try {
      const eventsStr = localStorage.getItem(this.STORAGE_KEY);
      if (!eventsStr) return [];

      const events: SecurityEvent[] = JSON.parse(eventsStr);
      return events.sort((a, b) => b.timestamp - a.timestamp); // Most recent first
    } catch (error) {
      console.error('Error retrieving security events:', error);
      return [];
    }
  }

  /**
   * Get security events by type
   */
  static getSecurityEventsByType(eventType: SecurityEventType): SecurityEvent[] {
    return this.getSecurityEvents().filter(event => event.eventType === eventType);
  }

  /**
   * Get security events by severity
   */
  static getSecurityEventsBySeverity(severity: SecuritySeverity): SecurityEvent[] {
    return this.getSecurityEvents().filter(event => event.severity === severity);
  }

  /**
   * Get security events for a specific user
   */
  static getUserSecurityEvents(userId: string): SecurityEvent[] {
    return this.getSecurityEvents().filter(event => 
      event.userId === userId || event.userEmail === userId
    );
  }

  /**
   * Get security events within a time range
   */
  static getSecurityEventsInRange(startTime: number, endTime: number): SecurityEvent[] {
    return this.getSecurityEvents().filter(event => 
      event.timestamp >= startTime && event.timestamp <= endTime
    );
  }

  /**
   * Export security events (for admin review)
   */
  static exportSecurityEvents(format: 'json' | 'csv' = 'json'): string {
    const events = this.getSecurityEvents();
    
    if (format === 'csv') {
      return this.convertToCSV(events);
    }
    
    return JSON.stringify(events, null, 2);
  }

  /**
   * Clear all security events
   */
  static clearSecurityEvents(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Get security statistics
   */
  static getSecurityStatistics(): {
    totalEvents: number;
    eventsByType: Record<SecurityEventType, number>;
    eventsBySeverity: Record<SecuritySeverity, number>;
    recentActivity: {
      last24Hours: number;
      last7Days: number;
      last30Days: number;
    };
  } {
    const events = this.getSecurityEvents();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const eventsByType: Record<SecurityEventType, number> = {} as any;
    const eventsBySeverity: Record<SecuritySeverity, number> = {} as any;

    events.forEach(event => {
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
    });

    return {
      totalEvents: events.length,
      eventsByType,
      eventsBySeverity,
      recentActivity: {
        last24Hours: events.filter(e => now - e.timestamp <= oneDay).length,
        last7Days: events.filter(e => now - e.timestamp <= oneWeek).length,
        last30Days: events.filter(e => now - e.timestamp <= oneMonth).length
      }
    };
  }

  // Private helper methods
  private static generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static storeEvent(event: SecurityEvent): void {
    try {
      const existingEvents = this.getSecurityEvents();
      existingEvents.push(event);
      
      // Keep only the last MAX_LOG_ENTRIES
      if (existingEvents.length > this.MAX_LOG_ENTRIES) {
        existingEvents.splice(0, existingEvents.length - this.MAX_LOG_ENTRIES);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingEvents));
    } catch (error) {
      console.error('Error storing security event:', error);
    }
  }

  private static cleanupOldLogs(): void {
    try {
      const events = this.getSecurityEvents();
      const cutoffTime = Date.now() - (this.LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000);
      
      const filteredEvents = events.filter(event => event.timestamp >= cutoffTime);
      
      if (filteredEvents.length !== events.length) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEvents));
      }
    } catch (error) {
      console.error('Error cleaning up old logs:', error);
    }
  }

  private static getClientIP(): string {
    // In a real application, this would come from the server
    // For now, we'll return a placeholder
    return 'client-ip-not-available';
  }

  private static getUserAgent(): string {
    return navigator.userAgent || 'unknown';
  }

  private static getSessionId(): string {
    // Generate a simple session ID for tracking
    const sessionKey = sessionStorage.getItem('arogyam_secure_session');
    if (sessionKey) {
      try {
        const session = JSON.parse(sessionKey);
        return session.data?.id || 'unknown';
      } catch {
        return 'unknown';
      }
    }
    return 'unknown';
  }

  private static convertToCSV(events: SecurityEvent[]): string {
    if (events.length === 0) return '';
    
    const headers = Object.keys(events[0]);
    const csvRows = [headers.join(',')];
    
    events.forEach(event => {
      const values = headers.map(header => {
        const value = event[header as keyof SecurityEvent];
        if (typeof value === 'object') {
          return JSON.stringify(value).replace(/"/g, '""');
        }
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
  }
}

// Hook for using audit logger in React components
export function useSecurityAudit() {
  const logEvent = (
    eventType: SecurityEventType,
    severity: SecuritySeverity,
    details: Record<string, any> = {},
    userInfo?: { userId?: string; userEmail?: string; userRole?: string }
  ) => {
    SecurityAuditLogger.logEvent(eventType, severity, details, userInfo);
  };

  const logLoginAttempt = (email: string, success: boolean, details: Record<string, any> = {}) => {
    SecurityAuditLogger.logLoginAttempt(email, success, details);
  };

  const logSuspiciousActivity = (
    activity: string,
    severity: SecuritySeverity,
    details: Record<string, any> = {},
    userInfo?: { userId?: string; userEmail?: string; userRole?: string }
  ) => {
    SecurityAuditLogger.logSuspiciousActivity(activity, severity, details, userInfo);
  };

  const getSecurityStatistics = () => {
    return SecurityAuditLogger.getSecurityStatistics();
  };

  const exportSecurityEvents = (format: 'json' | 'csv' = 'json') => {
    return SecurityAuditLogger.exportSecurityEvents(format);
  };

  return {
    logEvent,
    logLoginAttempt,
    logSuspiciousActivity,
    getSecurityStatistics,
    exportSecurityEvents
  };
}
