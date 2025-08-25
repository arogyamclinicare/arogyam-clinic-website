import React from 'react';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: Map<string, PerformanceObserver> = new Map();

  private constructor() {
    this.initializeObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    // Monitor navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.recordMetric('navigation_load_time', navEntry.loadEventEnd - navEntry.loadEventStart);
              this.recordMetric('navigation_dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart);
              this.recordMetric('navigation_first_paint', navEntry.responseStart - navEntry.requestStart);
            }
          });
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
        this.observers.set('navigation', navigationObserver);
      } catch (error) {
        console.warn('Navigation performance observer not supported:', error);
      }

      // Monitor paint timing
      try {
        const paintObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'paint') {
              const paintEntry = entry as PerformancePaintTiming;
              this.recordMetric(`paint_${paintEntry.name}`, paintEntry.startTime);
            }
          });
        });
        paintObserver.observe({ entryTypes: ['paint'] });
        this.observers.set('paint', paintObserver);
      } catch (error) {
        console.warn('Paint performance observer not supported:', error);
      }

      // Monitor resource loading
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              this.recordMetric(`resource_${resourceEntry.name}`, resourceEntry.duration);
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
      } catch (error) {
        console.warn('Resource performance observer not supported:', error);
      }
    }
  }

  // Record a performance metric
  recordMetric(name: string, value: number) {
    this.metrics.set(name, value);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance Metric - ${name}:`, value.toFixed(2), 'ms');
    }
  }

  // Get a specific metric
  getMetric(name: string): number | undefined {
    return this.metrics.get(name);
  }

  // Get all metrics
  getAllMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  // Measure function execution time
  async measureFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.recordMetric(`function_${name}`, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`function_${name}_error`, duration);
      throw error;
    }
  }

  // Measure synchronous function execution time
  measureSyncFunction<T>(name: string, fn: () => T): T {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      this.recordMetric(`function_${name}`, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`function_${name}_error`, duration);
      throw error;
    }
  }

  // Generate performance report
  generateReport(): string {
    const metrics = this.getAllMetrics();
    const report = Object.entries(metrics)
      .map(([key, value]) => `${key}: ${value.toFixed(2)}ms`)
      .join('\n');
    
    return `Performance Report:\n${report}`;
  }

  // Cleanup observers
  cleanup() {
    this.observers.forEach((observer) => {
      observer.disconnect();
    });
    this.observers.clear();
    this.metrics.clear();
  }
}

// Hook for measuring component render time
export function usePerformanceMeasurement(componentName: string) {
  const startTime = React.useRef(performance.now());

  React.useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    PerformanceMonitor.getInstance().recordMetric(`render_${componentName}`, renderTime);
  });

  return {
    measureOperation: (operationName: string, operation: () => void) => {
      const start = performance.now();
      operation();
      const duration = performance.now() - start;
      PerformanceMonitor.getInstance().recordMetric(`operation_${componentName}_${operationName}`, duration);
    }
  };
}

// Utility to measure API call performance
export async function measureApiCall<T>(
  apiName: string, 
  apiCall: () => Promise<T>
): Promise<T> {
  return PerformanceMonitor.getInstance().measureFunction(apiName, apiCall);
}

// Utility to measure DOM operation performance
export function measureDomOperation(
  operationName: string, 
  operation: () => void
): void {
  PerformanceMonitor.getInstance().measureSyncFunction(operationName, operation);
}

// Performance budget checker
export class PerformanceBudget {
  private budgets: Map<string, number> = new Map();

  setBudget(metricName: string, maxValue: number) {
    this.budgets.set(metricName, maxValue);
  }

  checkBudget(metricName: string, actualValue: number): boolean {
    const budget = this.budgets.get(metricName);
    if (budget === undefined) return true;
    
    const isWithinBudget = actualValue <= budget;
    
    if (!isWithinBudget) {
      console.warn(`🚨 Performance budget exceeded for ${metricName}:`, {
        actual: actualValue.toFixed(2),
        budget: budget.toFixed(2),
        exceeded: (actualValue - budget).toFixed(2)
      });
    }
    
    return isWithinBudget;
  }

  getAllBudgets(): Record<string, number> {
    const result: Record<string, number> = {};
    this.budgets.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}

// Initialize performance monitoring
export const performanceMonitor = PerformanceMonitor.getInstance();
export const performanceBudget = new PerformanceBudget();

// Set default performance budgets
performanceBudget.setBudget('navigation_load_time', 3000); // 3 seconds
performanceBudget.setBudget('navigation_dom_content_loaded', 1500); // 1.5 seconds
performanceBudget.setBudget('paint_first-contentful-paint', 1800); // 1.8 seconds
performanceBudget.setBudget('paint_largest-contentful-paint', 2500); // 2.5 seconds
