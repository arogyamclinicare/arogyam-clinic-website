/**
 * Performance optimization hooks following React best practices
 * useMemo, useCallback, and other performance utilities
 */

import { useCallback, useMemo, useRef, useEffect } from 'react';

/**
 * Custom hook for stable callback references
 * Prevents unnecessary re-renders when passing callbacks to child components
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = useRef<T>(callback);
  
  // Update ref on each render but return stable reference
  useEffect(() => {
    callbackRef.current = callback;
  });
  
  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as T;
}

/**
 * Debounced value hook for performance optimization
 * Useful for search inputs, API calls, etc.
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Memoized computation hook with dependency tracking
 */
export function useComputedValue<T>(
  computeFn: () => T,
  dependencies: React.DependencyList
): T {
  return useMemo(computeFn, dependencies);
}

/**
 * Optimized event handler hook
 * Prevents re-creating event handlers on every render
 */
export function useEventHandler<T extends Event>(
  handler: (event: T) => void,
  dependencies: React.DependencyList = []
) {
  return useCallback(handler, dependencies);
}

/**
 * Intersection Observer hook for lazy loading
 * Useful for performance optimization of images and components
 */
export function useIntersectionObserver(
  _options: IntersectionObserverInit = {}): [React.RefObject<HTMLElement>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ..._options,
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [_options]);
  
  return [ref, isIntersecting];
}

/**
 * Optimized list rendering hook
 * Helps with performance when rendering large lists
 */
export function useVirtualizedList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return {
      startIndex,
      endIndex,
      visibleItems: items.slice(startIndex, endIndex),
      offsetY: startIndex * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop]);
  
  const handleScroll = useCallback((event: React.UIEvent<HTMLElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);
  
  return {
    ...visibleItems,
    totalHeight: items.length * itemHeight,
    handleScroll,
  };
}

// Import useState for debouncedValue hook
import { useState } from 'react';
