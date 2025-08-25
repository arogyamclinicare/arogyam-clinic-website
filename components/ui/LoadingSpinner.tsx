import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'success' | 'error';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'spinner', 
  text, 
  className = '' 
}: LoadingSpinnerProps) {
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`${sizeClasses[size]} bg-current rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${sizeClasses[size]} bg-current rounded-full animate-pulse`}></div>
        );
      
      case 'success':
        return (
          <CheckCircle className={`${sizeClasses[size]} text-green-600`} />
        );
      
      case 'error':
        return (
          <AlertCircle className={`${sizeClasses[size]} text-red-600`} />
        );
      
      default:
        return (
          <Loader2 className={`${sizeClasses[size]} animate-spin`} />
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="text-blue-600">
        {renderSpinner()}
      </div>
      {text && (
        <p className={`mt-2 text-gray-600 ${textSizes[size]} font-medium text-center`}>
          {text}
        </p>
      )}
    </div>
  );
}

// Specialized loading components
export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="xl" text={text} />
    </div>
  );
}

export function ButtonLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size={size} variant="spinner" />
      <span>Loading...</span>
    </div>
  );
}

export function InlineLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <LoadingSpinner size="sm" variant="dots" />
      <span>{text}</span>
    </div>
  );
}

export function SuccessIndicator({ text = 'Success!' }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2 text-green-600">
      <LoadingSpinner size="sm" variant="success" />
      <span className="font-medium">{text}</span>
    </div>
  );
}

export function ErrorIndicator({ text = 'Error occurred' }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2 text-red-600">
      <LoadingSpinner size="sm" variant="error" />
      <span className="font-medium">{text}</span>
    </div>
  );
}
