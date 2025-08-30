// Security Configuration for Arogyam Clinic
// This file contains all security-related configuration

export const SECURITY_CONFIG = {
  // JWT Configuration
  JWT: {
    ACCESS_TOKEN_EXPIRY: '30m', // 30 minutes
    REFRESH_TOKEN_EXPIRY: '7d', // 7 days
    SECRET: import.meta.env.VITE_JWT_SECRET || 'fallback-secret-change-in-production',
    REFRESH_SECRET: import.meta.env.VITE_JWT_REFRESH_SECRET || 'fallback-refresh-secret-change-in-production',
    ISSUER: 'arogyam-clinic',
    AUDIENCE: 'arogyam-users'
  },

  // Password Security
  PASSWORD: {
    SALT_ROUNDS: 12,
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true
  },

  // Session Management
  SESSION: {
    TIMEOUT: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '1800000'), // 30 minutes
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
    STORAGE_KEY: 'arogyam_secure_session',
    REFRESH_KEY: 'arogyam_refresh_token'
  },

  // CSRF Protection
  CSRF: {
    TOKEN_EXPIRY: parseInt(import.meta.env.VITE_CSRF_TOKEN_EXPIRY || '3600000'), // 1 hour
    TOKEN_LENGTH: 32,
    HEADER_NAME: 'X-CSRF-Token'
  },

  // Rate Limiting
  RATE_LIMITING: {
    MAX_LOGIN_ATTEMPTS: parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS || '5'),
    ACCOUNT_LOCKOUT_DURATION: parseInt(import.meta.env.VITE_ACCOUNT_LOCKOUT_DURATION || '900000'), // 15 minutes
    LOGIN_ATTEMPT_RESET_DURATION: parseInt(import.meta.env.VITE_LOGIN_ATTEMPT_RESET_DURATION || '3600000'), // 1 hour
    MAX_REQUESTS_PER_WINDOW: parseInt(import.meta.env.VITE_RATE_LIMIT_MAX_REQUESTS || '100'),
    WINDOW_MS: parseInt(import.meta.env.VITE_RATE_LIMIT_WINDOW || '900000') // 15 minutes
  },

  // Input Validation
  VALIDATION: {
    MAX_NAME_LENGTH: 100,
    MAX_EMAIL_LENGTH: 254,
    MAX_PHONE_LENGTH: 15,
    MAX_DESCRIPTION_LENGTH: 1000,
    ALLOWED_NAME_CHARS: /^[a-zA-Z\s]+$/,
    PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },

  // Security Headers
  HEADERS: {
    X_CONTENT_TYPE_OPTIONS: 'nosniff',
    X_FRAME_OPTIONS: 'DENY',
    X_XSS_PROTECTION: '1; mode=block',
    REFERRER_POLICY: 'strict-origin-when-cross-origin',
    PERMISSIONS_POLICY: 'camera=(), microphone=(), geolocation=()',
    HSTS_MAX_AGE: parseInt(import.meta.env.VITE_HSTS_MAX_AGE || '31536000') // 1 year
  },

  // Content Security Policy
  CSP: {
    DEFAULT_SRC: ["'self'"],
    SCRIPT_SRC: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    STYLE_SRC: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    FONT_SRC: ["'self'", "https://fonts.gstatic.com"],
    IMG_SRC: ["'self'", "data:", "https:", "blob:"],
    CONNECT_SRC: ["'self'", "https:", "wss:", "ws:"],
    FRAME_SRC: ["'none"],
    OBJECT_SRC: ["'none"],
    BASE_URI: ["'self"],
    FORM_ACTION: ["'self"]
  },

  // Database Security
  DATABASE: {
    CONNECTION_LIMIT: parseInt(import.meta.env.VITE_DB_CONNECTION_LIMIT || '10'),
    TIMEOUT: parseInt(import.meta.env.VITE_DB_TIMEOUT || '10000'),
    MAX_QUERY_TIME: 30000, // 30 seconds
    BATCH_SIZE_LIMIT: 50
  },

  // API Security
  API: {
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
    MAX_PAYLOAD_SIZE: '10mb',
    ENABLE_CORS: true,
    CORS_ORIGIN: import.meta.env.VITE_CORS_ORIGIN || '*'
  },

  // Monitoring and Logging
  MONITORING: {
    ENABLE_SECURITY_LOGGING: import.meta.env.VITE_ENABLE_SECURITY_LOGGING === 'true',
    LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL || 'info',
    LOG_RETENTION_DAYS: 90,
    ENABLE_AUDIT_LOG: true
  },

  // Environment
  ENV: {
    NODE_ENV: import.meta.env.NODE_ENV || 'development',
    APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
    IS_PRODUCTION: import.meta.env.NODE_ENV === 'production',
    IS_DEVELOPMENT: import.meta.env.NODE_ENV === 'development'
  }
};

// Helper function to get configuration value
export function getSecurityConfig<T>(key: string, defaultValue: T): T {
  const keys = key.split('.');
  let value: any = SECURITY_CONFIG;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return defaultValue;
    }
  }
  
  return value;
}

// Helper function to check if we're in production
export function isProduction(): boolean {
  return SECURITY_CONFIG.ENV.IS_PRODUCTION;
}

// Helper function to check if we're in development
export function isDevelopment(): boolean {
  return SECURITY_CONFIG.ENV.IS_DEVELOPMENT;
}

// Helper function to get JWT secret
export function getJWTSecret(): string {
  return SECURITY_CONFIG.JWT.SECRET;
}

// Helper function to get JWT refresh secret
export function getJWTRefreshSecret(): string {
  return SECURITY_CONFIG.JWT.REFRESH_SECRET;
}
