import React, { forwardRef, useId, useEffect } from 'react';
import { useAccessibility } from '../hooks/useAccessibility';

interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  showRequiredIndicator?: boolean;
}

export const AccessibleInput = forwardRef<HTMLInputElement, AccessibleInputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    required = false, 
    showRequiredIndicator = true,
    id,
    className = '',
    ...props 
  }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const describedBy = [helperText && helperId, error && errorId].filter(Boolean).join(' ');

    const { associateError, removeError } = useAccessibility();

    // Handle error association
    useEffect(() => {
      const inputElement = document.getElementById(inputId) as HTMLInputElement;
      if (inputElement) {
        if (error) {
          associateError(inputElement, error);
        } else {
          removeError(inputElement);
        }
      }
    }, [error, inputId, associateError, removeError]);

    return (
      <div className="space-y-2">
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && showRequiredIndicator && (
            <span className="text-red-500 ml-1" aria-label="required">*</span>
          )}
        </label>
        
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-describedby={describedBy || undefined}
          aria-invalid={!!error}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        
        {helperText && (
          <p id={helperId} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
        
        {error && (
          <p 
            id={errorId} 
            className="text-sm text-red-600" 
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

interface AccessibleTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  showRequiredIndicator?: boolean;
}

export const AccessibleTextarea = forwardRef<HTMLTextAreaElement, AccessibleTextareaProps>(
  ({ 
    label, 
    error, 
    helperText, 
    required = false, 
    showRequiredIndicator = true,
    id,
    className = '',
    ...props 
  }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;
    const describedBy = [helperText && helperId, error && errorId].filter(Boolean).join(' ');

    const { associateError, removeError } = useAccessibility();

    // Handle error association
    useEffect(() => {
      const textareaElement = document.getElementById(textareaId) as HTMLTextAreaElement;
      if (textareaElement) {
        if (error) {
          associateError(textareaElement, error);
        } else {
          removeError(textareaElement);
        }
      }
    }, [error, textareaId, associateError, removeError]);

    return (
      <div className="space-y-2">
        <label 
          htmlFor={textareaId} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && showRequiredIndicator && (
            <span className="text-red-500 ml-1" aria-label="required">*</span>
          )}
        </label>
        
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          aria-describedby={describedBy || undefined}
          aria-invalid={!!error}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500
            resize-vertical min-h-[100px]
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        
        {helperText && (
          <p id={helperId} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
        
        {error && (
          <p 
            id={errorId} 
            className="text-sm text-red-600" 
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleTextarea.displayName = 'AccessibleTextarea';

interface AccessibleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  error?: string;
  helperText?: string;
  required?: boolean;
  showRequiredIndicator?: boolean;
  placeholder?: string;
}

export const AccessibleSelect = forwardRef<HTMLSelectElement, AccessibleSelectProps>(
  ({ 
    label, 
    options, 
    error, 
    helperText, 
    required = false, 
    showRequiredIndicator = true,
    placeholder,
    id,
    className = '',
    ...props 
  }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;
    const describedBy = [helperText && helperId, error && errorId].filter(Boolean).join(' ');

    const { associateError, removeError } = useAccessibility();

    // Handle error association
    useEffect(() => {
      const selectElement = document.getElementById(selectId) as HTMLSelectElement;
      if (selectElement) {
        if (error) {
          associateError(selectElement, error);
        } else {
          removeError(selectElement);
        }
      }
    }, [error, selectId, associateError, removeError]);

    return (
      <div className="space-y-2">
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && showRequiredIndicator && (
            <span className="text-red-500 ml-1" aria-label="required">*</span>
          )}
        </label>
        
        <select
          ref={ref}
          id={selectId}
          required={required}
          aria-describedby={describedBy || undefined}
          aria-invalid={!!error}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-300' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {helperText && (
          <p id={helperId} className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
        
        {error && (
          <p 
            id={errorId} 
            className="text-sm text-red-600" 
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleSelect.displayName = 'AccessibleSelect';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    loadingText = 'Loading...',
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;
    const buttonText = loading ? loadingText : children;

    const baseClasses = `
      inline-flex items-center justify-center font-medium rounded-md
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-colors duration-200
    `;

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {buttonText}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';
