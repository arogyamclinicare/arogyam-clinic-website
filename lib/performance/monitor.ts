// Production Performance Monitoring System
export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fmp: number; // First Meaningful Paint
  tti: number; // Time to Interactive
}

export interface UserMetrics {
  sessionDuration: number;
  pageViews: number;
  interactions: number;
  errors: number;
  deviceInfo: {
    userAgent: string;
    screenResolution: string;
    viewportSize: string;
    connectionType: string;
  };
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private userMetrics: Partial<UserMetrics> = {};
  private sessionStartTime: number = Date.now();
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    // Initialize user metrics
    this.userMetrics = {
      sessionDuration: 0,
      pageViews: 1,
      interactions: 0,
      errors: 0,
      deviceInfo: this.getDeviceInfo(),
    };

    // Track page views
    this.trackPageView();

    // Track user interactions
    this.trackUserInteractions();

    // Track errors
    this.trackErrors();

    // Track session duration
    this.trackSessionDuration();

    // Initialize performance observer
    this.initializePerformanceObserver();
  }

  private getDeviceInfo() {
    const connection = (navigator as any).connection;
    
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      connectionType: connection ? connection.effectiveType || connection.type : 'unknown',
    };
  }

  private trackPageView() {
    // Track page view
    this.userMetrics.pageViews = (this.userMetrics.pageViews || 0) + 1;
    
    // Send to analytics (in production, this would go to your analytics service)
    this.sendMetrics('pageview', {
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
    });
  }

  private trackUserInteractions() {
    let interactionCount = 0;
    
    const interactionEvents = ['click', 'input', 'scroll', 'keydown'];
    
    interactionEvents.forEach(eventType => {
      document.addEventListener(eventType, () => {
        interactionCount++;
        this.userMetrics.interactions = interactionCount;
      }, { passive: true });
    });
  }

  private trackErrors() {
    window.addEventListener('error', (event) => {
      this.userMetrics.errors = (this.userMetrics.errors || 0) + 1;
      
      this.sendMetrics('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.userMetrics.errors = (this.userMetrics.errors || 0) + 1;
      
      this.sendMetrics('unhandledrejection', {
        reason: event.reason,
        promise: event.promise,
      });
    });
  }

  private trackSessionDuration() {
    // Update session duration every minute
    setInterval(() => {
      this.userMetrics.sessionDuration = Date.now() - this.sessionStartTime;
    }, 60000);

    // Send session data when page is about to unload
    window.addEventListener('beforeunload', () => {
      this.userMetrics.sessionDuration = Date.now() - this.sessionStartTime;
      this.sendMetrics('session_end', this.userMetrics);
    });
  }

  private initializePerformanceObserver() {
    if (!('PerformanceObserver' in window)) return;

    try {
      // Observe Largest Contentful Paint
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        
        if (lastEntry) {
          this.metrics.lcp = lastEntry.startTime;
          this.sendMetrics('lcp', { value: lastEntry.startTime });
        }
      });
      
      this.observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('PerformanceObserver not supported:', e);
    }
  }

  // Measure First Contentful Paint
  public measureFCP(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
          
          if (fcpEntry) {
            this.metrics.fcp = fcpEntry.startTime;
            resolve(fcpEntry.startTime);
            observer.disconnect();
          }
        });
        
        observer.observe({ entryTypes: ['paint'] });
      } else {
        resolve(0);
      }
    });
  }

  // Measure First Input Delay
  public measureFID(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fidEntry = entries.find(entry => entry.name === 'first-input');
          
          if (fidEntry) {
            this.metrics.fid = (fidEntry as any).processingStart - (fidEntry as any).startTime;
            resolve(this.metrics.fid);
            observer.disconnect();
          }
        });
        
        observer.observe({ entryTypes: ['first-input'] });
      } else {
        resolve(0);
      }
    });
  }

  // Measure Cumulative Layout Shift
  public measureCLS(): Promise<number> {
    return new Promise((resolve) => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          
          this.metrics.cls = clsValue;
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
        
        // Resolve after a delay to capture CLS
        setTimeout(() => {
          resolve(clsValue);
          observer.disconnect();
        }, 5000);
      } else {
        resolve(0);
      }
    });
  }

  // Measure Time to First Byte
  public measureTTFB(): number {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.metrics.ttfb = navigation.responseStart - navigation.requestStart;
      return this.metrics.ttfb;
    }
    return 0;
  }

  // Get all performance metrics
  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  // Get user metrics
  public getUserMetrics(): Partial<UserMetrics> {
    return { ...this.userMetrics };
  }

  // Send metrics to analytics service
  private sendMetrics(eventType: string, data: any) {
    // In production, this would send to your analytics service
    // For now, we'll store in localStorage and console log
    
    const metricData = {
      eventType,
      data,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
    };

    try {
      // Store in localStorage for debugging
      const existingMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
      existingMetrics.push(metricData);
      localStorage.setItem('performanceMetrics', JSON.stringify(existingMetrics.slice(-100))); // Keep last 100
    } catch (e) {
      console.warn('Could not save performance metrics:', e);
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Performance Metric:', metricData);
    }
  }

  private getSessionId(): string {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  // Generate performance report
  public generateReport(): string {
    const metrics = this.getMetrics();
    const userMetrics = this.getUserMetrics();
    
    let report = '🚀 Performance Report\n';
    report += '=====================\n\n';
    
    if (metrics.fcp) report += `First Contentful Paint: ${metrics.fcp.toFixed(2)}ms\n`;
    if (metrics.lcp) report += `Largest Contentful Paint: ${metrics.lcp.toFixed(2)}ms\n`;
    if (metrics.fid) report += `First Input Delay: ${metrics.fid.toFixed(2)}ms\n`;
    if (metrics.cls) report += `Cumulative Layout Shift: ${metrics.cls.toFixed(3)}\n`;
    if (metrics.ttfb) report += `Time to First Byte: ${metrics.ttfb.toFixed(2)}ms\n`;
    
    report += '\nUser Metrics:\n';
    report += `Session Duration: ${Math.round((userMetrics.sessionDuration || 0) / 1000)}s\n`;
    report += `Page Views: ${userMetrics.pageViews || 0}\n`;
    report += `Interactions: ${userMetrics.interactions || 0}\n`;
    report += `Errors: ${userMetrics.errors || 0}\n`;
    
    return report;
  }

  // Cleanup
  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export for use in components
export default performanceMonitor;
