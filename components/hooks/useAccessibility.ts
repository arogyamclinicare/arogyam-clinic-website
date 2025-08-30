import { useEffect, useRef, useCallback } from 'react';
import { 
  FocusManagement, 
  announceToScreenReader, 
  ScreenReader,
  FormAccessibility,
  ColorContrast
} from '../utils/accessibility';

interface UseAccessibilityOptions {
  pageTitle?: string;
  announcePageLoad?: boolean;
  enableFocusTrap?: boolean;
  enableKeyboardNavigation?: boolean;
  enableScreenReader?: boolean;
}

export const useAccessibility = (options: UseAccessibilityOptions = {}) => {
  const {
    pageTitle,
    announcePageLoad = true,
    enableFocusTrap = false,
    enableKeyboardNavigation = true,
    enableScreenReader = true
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const focusTrapCleanup = useRef<(() => void) | null>(null);

  // Announce page load to screen readers
  useEffect(() => {
    if (announcePageLoad && pageTitle && enableScreenReader) {
      announceToScreenReader(`Page loaded: ${pageTitle}`, 'assertive');
    }
  }, [announcePageLoad, pageTitle, enableScreenReader]);

  // Initialize focus trap if enabled
  useEffect(() => {
    if (enableFocusTrap && containerRef.current) {
      focusTrapCleanup.current = FocusManagement.trapFocus(containerRef.current);
    }

    return () => {
      if (focusTrapCleanup.current) {
        focusTrapCleanup.current();
      }
    };
  }, [enableFocusTrap]);

  // Keyboard navigation handler
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (!enableKeyboardNavigation) return;

    switch (event.key) {
      case 'Escape':
        // Handle escape key (close modals, etc.)
        break;
      case 'Enter':
      case ' ':
        // Handle enter/space key
        break;
    }
  }, [enableKeyboardNavigation]);

  // Add keyboard event listener
  useEffect(() => {
    if (enableKeyboardNavigation) {
      document.addEventListener('keydown', handleKeyboardNavigation);
      return () => document.removeEventListener('keydown', handleKeyboardNavigation);
    }
  }, [enableKeyboardNavigation, handleKeyboardNavigation]);

  // Focus management functions
  const focusFirst = useCallback(() => {
    if (containerRef.current) {
      FocusManagement.focusFirst(containerRef.current);
    }
  }, []);

  const focusLast = useCallback(() => {
    if (containerRef.current) {
      FocusManagement.focusLast(containerRef.current);
    }
  }, []);

  // Screen reader functions
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (enableScreenReader) {
      announceToScreenReader(message, priority);
    }
  }, [enableScreenReader]);

  const addLiveRegion = useCallback((element: HTMLElement, type: 'polite' | 'assertive' = 'polite') => {
    if (enableScreenReader) {
      ScreenReader.addLiveRegion(element, type);
    }
  }, [enableScreenReader]);

  const removeLiveRegion = useCallback((element: HTMLElement) => {
    if (enableScreenReader) {
      ScreenReader.removeLiveRegion(element);
    }
  }, [enableScreenReader]);

  // Form accessibility functions
  const associateError = useCallback((field: HTMLElement, errorMessage: string) => {
    FormAccessibility.associateError(field, errorMessage);
  }, []);

  const removeError = useCallback((field: HTMLElement) => {
    FormAccessibility.removeError(field);
  }, []);

  const validateField = useCallback((field: HTMLElement) => {
    return FormAccessibility.validateField(field);
  }, []);

  // Color contrast validation
  const validateContrast = useCallback((foreground: string, background: string, isLargeText = false) => {
    return ColorContrast.meetsWCAGAA(foreground, background, isLargeText);
  }, []);

  return {
    containerRef,
    focusFirst,
    focusLast,
    announce,
    addLiveRegion,
    removeLiveRegion,
    associateError,
    removeError,
    validateField,
    validateContrast
  };
};
