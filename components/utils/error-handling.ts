/**
 * Error handling utilities following best practices
 * Early returns, proper error logging, type-safe error handling
 */

export interface ApiError {
  readonly message: string;
  readonly code?: string;
  readonly status?: number;
  readonly timestamp: string;
}

export interface ValidationError {
  readonly field: string;
  readonly message: string;
}

// Error result type for consistent error handling
export type Result<T, E = ApiError> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

/**
 * Creates a standardized API error
 */
export function createApiError(
  message: string,
  code?: string,
  status?: number
): ApiError {
  return {
    message,
    code,
    status,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Handles async operations with proper error catching
 * Returns Result type for consistent error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>
): Promise<Result<T>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const apiError = createApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'ASYNC_ERROR'
    );
    
    return { success: false, error: apiError };
  }
}

/**
 * Handles synchronous operations with error catching
 */
export function safeSyncOperation<T>(
  operation: () => T
): Result<T> {
  try {
    const data = operation();
    return { success: true, data };
  } catch (error) {
    const apiError = createApiError(
      error instanceof Error ? error.message : 'Unknown error occurred',
      'SYNC_ERROR'
    );
    
    return { success: false, error: apiError };
  }
}

/**
 * Validates input and returns early if invalid
 */
export function validateInput<T>(
  input: unknown,
  validator: (input: unknown) => input is T,
  errorMessage: string
): Result<T> {
  if (!validator(input)) {
    return {
      success: false,
      error: createApiError(errorMessage, 'VALIDATION_ERROR', 400)
    };
  }
  
  return { success: true, data: input };
}

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Retry mechanism for failed operations
 */
export async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<Result<T>> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await operation();
      return { success: true, data: result };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt < maxAttempts) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }
  
  const apiError = createApiError(
    `Operation failed after ${maxAttempts} attempts: ${lastError?.message}`,
    'RETRY_EXHAUSTED'
  );
  
  return { success: false, error: apiError };
}
