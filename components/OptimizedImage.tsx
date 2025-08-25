import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5sb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==',
  priority = false,
  sizes = '100vw',
  quality = 75,
  loading = 'lazy',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Intersection Observer for lazy loading
  const { ref: observerRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true,
  });

  // Generate responsive srcSet for different screen sizes
  const generateSrcSet = useCallback((imageSrc: string) => {
    if (!imageSrc || imageSrc === placeholder) return '';
    
    const baseUrl = new URL(imageSrc, window.location.origin);
    const widths = [320, 640, 768, 1024, 1280, 1920];
    
    return widths
      .map(w => `${baseUrl.origin}${baseUrl.pathname}?w=${w}&q=${quality} ${w}w`)
      .join(', ');
  }, [quality]);

  // Load image when in view or priority
  useEffect(() => {
    if ((inView || priority) && !isLoaded && !hasError) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      
      img.onerror = () => {
        setHasError(true);
        onError?.();
      };
      
      img.src = src;
    }
  }, [inView, priority, src, isLoaded, hasError, onLoad, onError]);

  // Preload critical images
  useEffect(() => {
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src]);

  // Handle image loading states
  const handleImageLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setHasError(true);
    onError?.();
  };

  // Combine refs for intersection observer and image
  const setRefs = useCallback((node: HTMLImageElement | null) => {
    observerRef(node);
    if (imgRef.current !== node) {
      (imgRef as React.MutableRefObject<HTMLImageElement | null>).current = node;
    }
  }, [observerRef]);

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <img
        ref={setRefs}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${hasError ? 'opacity-50' : ''}`}
        loading={loading}
        sizes={sizes}
        srcSet={generateSrcSet(imageSrc)}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">Image failed to load</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Higher-order component for code splitting
export function withImageOptimization<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return React.forwardRef<any, P>((props, ref) => {
    const [Component, setComponent] = useState<React.ComponentType<P> | null>(null);
    
    useEffect(() => {
      // Lazy load the component
      const loadComponent = async () => {
        try {
          const module = await import('./OptimizedImage');
          setComponent(() => module.OptimizedImage as React.ComponentType<P>);
        } catch (error) {
          console.error('Failed to load OptimizedImage:', error);
          setComponent(() => WrappedComponent);
        }
      };
      
      loadComponent();
    }, []);
    
    if (!Component) {
      return <div className="animate-pulse bg-gray-200 rounded" style={{ width: '100%', height: '200px' }} />;
    }
    
    // Type assertion to avoid complex type issues
    return React.createElement(Component as any, { ...props, ref });
  });
}
