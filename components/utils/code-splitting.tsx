import React, { Suspense, lazy, ComponentType, ReactNode } from 'react';
import { useState } from 'react';

interface LazyComponentOptions {
  chunkName?: string;
  priority?: 'high' | 'medium' | 'low';
  retryCount?: number;
  retryDelay?: number;
}

// Default fallback component
const DefaultFallback: React.FC = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-sm text-gray-600">Loading...</span>
  </div>
);

// Default error boundary
const DefaultErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="p-4 text-center">
    <div className="text-red-600 mb-2">⚠️ Component failed to load</div>
    <button 
      onClick={() => window.location.reload()} 
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Retry
    </button>
    {children}
  </div>
);

// Enhanced lazy loading with retry logic
export function createLazyComponent(
  importFunc: () => Promise<any>,
  options: LazyComponentOptions = {}
): ComponentType<any> {
  const {
    chunkName,
    priority = 'medium',
    retryCount = 3,
    retryDelay = 1000,
  } = options;

  let retryAttempts = 0;
  let isPreloading = false;

  const loadWithRetry = async (): Promise<any> => {
    try {
      const module = await importFunc();
      
      // Add chunk name for better debugging
      if (chunkName && module.default) {
        (module.default as any).displayName = chunkName;
      }
      
      return module;
    } catch (error) {
      retryAttempts++;
      
      if (retryAttempts <= retryCount) {
        console.warn(`Failed to load component, retrying (${retryAttempts}/${retryCount})...`, error);
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, retryDelay * Math.pow(2, retryAttempts - 1))
        );
        
        return loadWithRetry();
      }
      
      console.error('Component failed to load after all retry attempts:', error);
      throw error;
    }
  };

  const LazyComponent = lazy(loadWithRetry);

  // Preload functionality
  if (priority === 'high') {
    // High priority components are preloaded immediately
    setTimeout(() => {
      if (!isPreloading) {
        isPreloading = true;
        loadWithRetry().catch(() => {
          isPreloading = false;
        });
      }
    }, 0);
  } else if (priority === 'medium') {
    // Medium priority components are preloaded after a short delay
    setTimeout(() => {
      if (!isPreloading) {
        isPreloading = true;
        loadWithRetry().catch(() => {
          isPreloading = false;
        });
      }
    }, 2000);
  }

  return LazyComponent;
}

// Wrapper component for lazy components with fallback and error handling
export function LazyComponentWrapper({
  component: LazyComponent,
  fallback = <DefaultFallback />,
  errorBoundary: ErrorBoundary = DefaultErrorBoundary,
  ...props
}: {
  component: ComponentType<any>;
  fallback?: ReactNode;
  errorBoundary?: ComponentType<{ children: ReactNode }>;
} & any): JSX.Element {
  return (
    <ErrorBoundary>
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

// Route-based code splitting
export function createRouteLazyComponent(
  importFunc: () => Promise<any>,
  routeName: string
): ComponentType<any> {
  return createLazyComponent(importFunc, {
    chunkName: `route-${routeName}`,
    priority: 'high',
  });
}

// Feature-based code splitting
export function createFeatureLazyComponent(
  importFunc: () => Promise<any>,
  featureName: string,
  priority: 'high' | 'medium' | 'low' = 'medium'
): ComponentType<any> {
  return createLazyComponent(importFunc, {
    chunkName: `feature-${featureName}`,
    priority,
  });
}

// Conditional loading based on device capabilities
export function createConditionalLazyComponent(
  importFunc: () => Promise<any>,
  condition: () => boolean,
  fallbackComponent?: ComponentType<any>
): ComponentType<any> {
  return React.forwardRef<any, any>((props, ref) => {
    const [shouldLoad, setShouldLoad] = React.useState(false);
    const [Component, setComponent] = React.useState<ComponentType<any> | null>(null);

    React.useEffect(() => {
      if (condition()) {
        setShouldLoad(true);
        importFunc()
          .then(module => setComponent(() => module.default || module))
          .catch(error => {
            console.error('Failed to load conditional component:', error);
            if (fallbackComponent) {
              setComponent(() => fallbackComponent);
            }
          });
      }
    }, [condition, importFunc, fallbackComponent]);

    if (!shouldLoad || !Component) {
      return fallbackComponent ? React.createElement(fallbackComponent, { ...props, ref }) : null;
    }

    return React.createElement(Component, { ...props, ref });
  });
}

// Intersection Observer-based lazy loading
export function createIntersectionLazyComponent(
  importFunc: () => Promise<any>,
  options: {
    threshold?: number;
    rootMargin?: string;
  } = {}
): ComponentType<any> {
  const {
    threshold = 0.1,
    rootMargin = '50px',
  } = options;

  return React.forwardRef<any, any>((props, ref) => {
    const [Component, setComponent] = React.useState<ComponentType<any> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !Component && !isLoading) {
              setIsLoading(true);
              importFunc()
                .then(module => {
                  setComponent(() => module.default || module);
                  setIsLoading(false);
                })
                .catch(error => {
                  console.error('Failed to load intersection component:', error);
                  setIsLoading(false);
                });
            }
          });
        },
        { threshold, rootMargin }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, [Component, isLoading, threshold, rootMargin, importFunc]);

    if (!Component) {
      return (
        <div ref={containerRef} className="min-h-[200px] flex items-center justify-center">
          {isLoading ? <DefaultFallback /> : <div className="text-gray-400">Scroll to load</div>}
        </div>
      );
    }

    return React.createElement(Component, { ...props, ref });
  });
}

// Export commonly used lazy components
export const LazyPatientPortal = createRouteLazyComponent(
  () => import('../PatientPortal').then(module => ({ default: module.PatientPortal })),
  'patient-portal'
);

export const LazyEnhancedPatientForm = createFeatureLazyComponent(
  () => import('../EnhancedPatientForm').then(module => ({ default: module.EnhancedPatientForm })),
  'enhanced-patient-form',
  'high'
);

export const LazyMobileNavigationTester = createFeatureLazyComponent(
  () => import('../MobileNavigationTester').then(module => ({ default: module.MobileNavigationTester })),
  'mobile-navigation-tester',
  'low'
);
