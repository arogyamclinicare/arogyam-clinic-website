import React, { useEffect, useState } from 'react';
import { createLogger } from '../lib/utils/logger';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  enableReporting?: boolean;
}

const logger = createLogger('PerformanceMonitor');

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetricsUpdate,
  enableReporting = false
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Measure Time to First Byte
    const measureTTFB = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        setMetrics(prev => ({ ...prev, ttfb }));
        logger.performance('TTFB', ttfb);
      }
    };

    // Measure First Contentful Paint
    const measureFCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          const fcp = fcpEntry.startTime;
          setMetrics(prev => ({ ...prev, fcp }));
          logger.performance('FCP', fcp);
          
          if (onMetricsUpdate) {
            onMetricsUpdate({ ...metrics, fcp });
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
    };

    // Measure Largest Contentful Paint
    const measureLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1] as LargestContentfulPaint;
        if (lcpEntry) {
          const lcp = lcpEntry.startTime;
          setMetrics(prev => ({ ...prev, lcp }));
          logger.performance('LCP', lcp);
          
          if (onMetricsUpdate) {
            onMetricsUpdate({ ...metrics, lcp });
          }
        }
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    };

    // Measure First Input Delay
    const measureFID = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'first-input') {
            const firstInputEntry = entry as any; // Type assertion for first-input
            const fid = firstInputEntry.processingStart - firstInputEntry.startTime;
            setMetrics(prev => ({ ...prev, fid }));
            logger.performance('FID', fid);
            
            if (onMetricsUpdate) {
              onMetricsUpdate({ ...metrics, fid });
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
    };

    // Measure Cumulative Layout Shift
    const measureCLS = () => {
      let clsValue = 0;
      let clsEntries: any[] = [];
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as any; // Type assertion for layout-shift
            if (!layoutShiftEntry.hadRecentInput) {
              clsValue += layoutShiftEntry.value;
              clsEntries.push(layoutShiftEntry);
            }
          }
        });
        
        setMetrics(prev => ({ ...prev, cls: clsValue }));
        logger.performance('CLS', clsValue);
        
        if (onMetricsUpdate) {
          onMetricsUpdate({ ...metrics, cls: clsValue });
        }
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
    };

    // Measure resource loading performance
    const measureResourcePerformance = () => {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            const duration = resourceEntry.responseEnd - resourceEntry.requestStart;
            
            // Log slow resources
            if (duration > 1000) {
              logger.warn('Slow resource detected', {
                name: resourceEntry.name,
                duration: `${duration.toFixed(2)}ms`,
                size: resourceEntry.transferSize || 'unknown'
              });
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    };

    // Initialize measurements
    try {
      measureTTFB();
      measureFCP();
      measureLCP();
      measureFID();
      measureCLS();
      measureResourcePerformance();
      
      logger.info('Performance monitoring initialized');
    } catch (error) {
      logger.error('Failed to initialize performance monitoring', error);
    }

    // Report metrics to analytics if enabled
    if (enableReporting) {
      const reportMetrics = () => {
        const reportData = {
          url: window.location.href,
          timestamp: Date.now(),
          metrics: metrics,
          userAgent: navigator.userAgent,
          connection: (navigator as any).connection?.effectiveType || 'unknown'
        };
        
        // In production, send to analytics service
        logger.info('Performance metrics report', reportData);
      };
      
      // Report after page load
      window.addEventListener('load', reportMetrics);
      
      // Report on visibility change
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          reportMetrics();
        }
      });
    }

    // Cleanup
    return () => {
      // PerformanceObserver cleanup is automatic
    };
  }, [onMetricsUpdate, enableReporting, metrics]);

  // Performance score calculation
  const calculatePerformanceScore = (): number => {
    let score = 100;
    
    // FCP scoring (0-100)
    if (metrics.fcp !== null) {
      if (metrics.fcp < 1800) score -= 0;
      else if (metrics.fcp < 3000) score -= 10;
      else score -= 30;
    }
    
    // LCP scoring (0-100)
    if (metrics.lcp !== null) {
      if (metrics.lcp < 2500) score -= 0;
      else if (metrics.lcp < 4000) score -= 10;
      else score -= 30;
    }
    
    // FID scoring (0-100)
    if (metrics.fid !== null) {
      if (metrics.fid < 100) score -= 0;
      else if (metrics.fid < 300) score -= 10;
      else score -= 30;
    }
    
    // CLS scoring (0-100)
    if (metrics.cls !== null) {
      if (metrics.cls < 0.1) score -= 0;
      else if (metrics.cls < 0.25) score -= 10;
      else score -= 30;
    }
    
    return Math.max(0, score);
  };

  const performanceScore = calculatePerformanceScore();

  // Don't render anything in production unless explicitly enabled
  if (!enableReporting) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 z-50">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Performance Monitor</h3>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Score:</span>
          <span className={`font-mono ${performanceScore >= 90 ? 'text-green-600' : performanceScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
            {performanceScore}/100
          </span>
        </div>
        {metrics.fcp && (
          <div className="flex justify-between">
            <span>FCP:</span>
            <span className="font-mono">{metrics.fcp.toFixed(0)}ms</span>
          </div>
        )}
        {metrics.lcp && (
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className="font-mono">{metrics.lcp.toFixed(0)}ms</span>
          </div>
        )}
        {metrics.fid && (
          <div className="flex justify-between">
            <span>FID:</span>
            <span className="font-mono">{metrics.fid.toFixed(0)}ms</span>
          </div>
        )}
        {metrics.cls && (
          <div className="flex justify-between">
            <span>CLS:</span>
            <span className="font-mono">{metrics.cls.toFixed(3)}</span>
          </div>
        )}
        {metrics.ttfb && (
          <div className="flex justify-between">
            <span>TTFB:</span>
            <span className="font-mono">{metrics.ttfb.toFixed(0)}ms</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceMonitor;
