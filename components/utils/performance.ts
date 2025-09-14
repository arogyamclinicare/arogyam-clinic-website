/**
 * Performance monitoring utilities for Core Web Vitals
 * Tracks LCP, FID, CLS, and other performance metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
};

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializeObserver();
    this.trackPageLoad();
  }

  /**
   * Initialize Performance Observer for Web Vitals
   */
  private initializeObserver(): void {
    if (!('PerformanceObserver' in window)) {
      return;
    }

    try {
      // Observe layout shifts (CLS)
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            this.recordMetric('CLS', (entry as any).value);
          }
        }
      });

      this.observer.observe({ type: 'layout-shift', buffered: true });

      // Observe paint metrics
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric('FCP', entry.startTime);
          }
        }
      });

      paintObserver.observe({ type: 'paint', buffered: true });

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime);
      });

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Observe first input delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('FID', (entry as any).processingStart - entry.startTime);
        }
      });

      fidObserver.observe({ type: 'first-input', buffered: true });

    } catch (error) {
    // Empty block
  }
  }

  /**
   * Track page load performance
   */
  private trackPageLoad(): void {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          // Time to First Byte
          const ttfb = navigation.responseStart - navigation.requestStart;
          this.recordMetric('TTFB', ttfb);

          // DOM Content Loaded
          const dcl = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          this.recordMetric('DCL', dcl);

          // Total Load Time
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          this.recordMetric('Load', loadTime);
        }

        // Resource timing
        this.analyzeResourceTiming();
      }, 100);
    });
  }

  /**
   * Analyze resource loading performance
   */
  private analyzeResourceTiming(): void {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const resourceStats = {
      totalResources: resources.length,
      slowResources: resources.filter(r => r.duration > 1000),
      imageResources: resources.filter(r => r.initiatorType === 'img'),
      cssResources: resources.filter(r => r.initiatorType === 'css'),
      jsResources: resources.filter(r => r.initiatorType === 'script'),
    };
  }

  /**
   * Record a performance metric
   */
  private recordMetric(name: string, value: number): void {
    const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
    let rating: 'good' | 'needs-improvement' | 'poor' = 'good';

    if (threshold) {
      if (value > threshold.poor) {
        rating = 'poor';
      } else if (value > threshold.good) {
        rating = 'needs-improvement';
      }
    }

    const metric: PerformanceMetric = {
      name,
      value,
      rating,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);
    this.logMetric(metric);
  }

  /**
   * Log metric to console with color coding
   */
  private logMetric(metric: PerformanceMetric): void {
    const color = {
      good: '🟢',
      'needs-improvement': '🟡',
      poor: '🔴',
    }[metric.rating];

    console.log(
      `${color} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`
    );
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get performance summary
   */
  getSummary(): Record<string, any> {
    const summary: Record<string, any> = {
    // Empty block
  };
    
    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = {
          latest: metric,
          count: 0,
          average: 0,
          total: 0,
        };
      }
      
      summary[metric.name].count++;
      summary[metric.name].total += metric.value;
      summary[metric.name].average = summary[metric.name].total / summary[metric.name].count;
      summary[metric.name].latest = metric;
    });

    return summary;
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: this.metrics,
      summary: this.getSummary(),
    }, null, 2);
  }

  /**
   * Check if performance is acceptable
   */
  isPerformanceGood(): boolean {
    const criticalMetrics = this.metrics.filter(m => 
      ['LCP', 'FID', 'CLS'].includes(m.name)
    );

    return criticalMetrics.every(m => m.rating === 'good');
  }
}

// Singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring(): PerformanceMonitor {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor!;
}

/**
 * Get performance monitor instance
 */
export function getPerformanceMonitor(): PerformanceMonitor | null {
  return performanceMonitor;
}

/**
 * Measure function execution time
 */
export function measurePerformance<T>(
  name: string, 
  fn: () => T
): T {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
  
  return result;
}

/**
 * Create a performance marker
 */
export function markPerformance(name: string): void {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(name);
  }
}

/**
 * Measure between two performance markers
 */
export function measureBetweenMarks(name: string, startMark: string, endMark: string): void {
  if ('performance' in window && 'measure' in performance) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name, 'measure')[0];
      console.log(`📏 ${name}: ${measure.duration.toFixed(2)}ms`);
    } catch (error) {
    // Empty block
  }
  }
}
