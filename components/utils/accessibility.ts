/**
 * Enhanced Accessibility utilities for WCAG 2.1 AA compliance
 * Provides comprehensive helpers for keyboard navigation, screen readers, focus management, and color contrast
 */

// Color contrast validation for WCAG 2.1 AA compliance
export const ColorContrast = {
  /**
   * Calculate relative luminance of a color
   */
  getRelativeLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio(l1: number, l2: number): number {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Check if color combination meets WCAG 2.1 AA standards
   * Normal text: 4.5:1, Large text: 3:1
   */
  meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
    const fg = this.hexToRgb(foreground);
    const bg = this.hexToRgb(background);
    
    if (!fg || !bg) return false;
    
    const fgLuminance = this.getRelativeLuminance(fg.r, fg.g, fg.b);
    const bgLuminance = this.getRelativeLuminance(bg.r, bg.g, bg.b);
    
    const contrastRatio = this.getContrastRatio(fgLuminance, bgLuminance);
    const requiredRatio = isLargeText ? 3 : 4.5;
    
    return contrastRatio >= requiredRatio;
  },

  /**
   * Convert hex color to RGB
   */
  hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
};

// Enhanced focus management
export const FocusManagement = {
  /**
   * Store the last focused element before opening a modal
   */
  lastFocusedElement: null as HTMLElement | null,

  /**
   * Save current focus and focus the first focusable element in container
   */
  trapFocus(container: HTMLElement): () => void {
    this.lastFocusedElement = document.activeElement as HTMLElement;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Focus the first element
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
      // Restore focus to last focused element
      this.lastFocusedElement?.focus();
    };
  },

  /**
   * Focus the first focusable element in a container
   */
  focusFirst(container: HTMLElement): void {
    const focusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    
    if (focusable) {
      focusable.focus();
    }
  },

  /**
   * Focus the last focusable element in a container
   */
  focusLast(container: HTMLElement): void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    if (lastElement) {
      lastElement.focus();
    }
  }
};

/**
 * Announce message to screen readers with enhanced options
 */
export function announceToScreenReader(
  message: string, 
  priority: 'polite' | 'assertive' = 'polite',
  timeout = 1000
): void {
  // Remove existing announcements
  const existing = document.querySelectorAll('[data-announcement]');
  existing.forEach(el => el.remove());

  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('data-announcement', 'true');
  announcement.classList.add('sr-only');
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, timeout);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Check if user prefers dark color scheme
 */
export function prefersDarkColorScheme(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Validate touch target size for mobile accessibility
 * WCAG 2.1 AA requires minimum 44x44px for touch targets
 */
export function validateTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= 44 && rect.height >= 44;
}

/**
 * Add skip link functionality with enhanced accessibility
 */
export function initializeSkipLinks(): void {
  const skipLinks = document.querySelectorAll('a[href^="#"]');
  
  skipLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href')!);
      
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        (target as HTMLElement).focus();
        
        // Announce to screen reader
        announceToScreenReader(`Navigated to ${link.textContent}`);
      }
    });
  });
}

/**
 * Manage focus for single page applications with enhanced accessibility
 */
export function manageFocus(heading: string, announce = true): void {
  // Create or update page heading for screen readers
  let pageHeading = document.querySelector('#page-heading') as HTMLElement;
  
  if (!pageHeading) {
    pageHeading = document.createElement('h1');
    pageHeading.id = 'page-heading';
    pageHeading.classList.add('sr-only');
    document.body.insertBefore(pageHeading, document.body.firstChild);
  }
  
  pageHeading.textContent = heading;
  
  if (announce) {
    announceToScreenReader(`Page loaded: ${heading}`, 'assertive');
  }
  
  pageHeading.focus();
}

/**
 * Add aria-label for dynamic content with validation
 */
export function addAriaLabel(element: HTMLElement, label: string): void {
  if (!label.trim()) {
    return;
  }
  
  element.setAttribute('aria-label', label.trim());
}

/**
 * Create accessible loading state with enhanced screen reader support
 */
export function createLoadingState(
  container: HTMLElement, 
  message = 'Loading...',
  showSpinner = true
): HTMLElement {
  const loader = document.createElement('div');
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-live', 'polite');
  loader.setAttribute('aria-label', message);
  
  if (showSpinner) {
    const visualLoader = document.createElement('div');
    visualLoader.className = 'animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full';
    visualLoader.setAttribute('aria-hidden', 'true');
    loader.appendChild(visualLoader);
  }
  
  const textLoader = document.createElement('span');
  textLoader.classList.add('sr-only');
  textLoader.textContent = message;
  
  loader.appendChild(textLoader);
  container.appendChild(loader);
  
  return loader;
}

/**
 * Enhanced keyboard navigation helpers
 */
export const KeyboardNavigation = {
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',

  /**
   * Handle arrow key navigation in a list with enhanced accessibility
   */
  handleListNavigation(e: KeyboardEvent, items: HTMLElement[], currentIndex: number): number {
    let newIndex = currentIndex;

    switch (e.key) {
      case this.ARROW_UP:
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        e.preventDefault();
        break;
      case this.ARROW_DOWN:
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        e.preventDefault();
        break;
      case this.HOME:
        newIndex = 0;
        e.preventDefault();
        break;
      case this.END:
        newIndex = items.length - 1;
        e.preventDefault();
        break;
      case this.PAGE_UP:
        newIndex = Math.max(0, currentIndex - 5);
        e.preventDefault();
        break;
      case this.PAGE_DOWN:
        newIndex = Math.min(items.length - 1, currentIndex + 5);
        e.preventDefault();
        break;
    }

    if (newIndex !== currentIndex) {
      items[newIndex].focus();
      // Announce to screen reader
      announceToScreenReader(`Item ${newIndex + 1} of ${items.length} selected`);
    }

    return newIndex;
  },

  /**
   * Handle grid navigation with arrow keys
   */
  handleGridNavigation(
    e: KeyboardEvent, 
    items: HTMLElement[], 
    currentIndex: number, 
    columns: number
  ): number {
    let newIndex = currentIndex;

    switch (e.key) {
      case this.ARROW_LEFT:
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case this.ARROW_RIGHT:
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case this.ARROW_UP:
        newIndex = Math.max(0, currentIndex - columns);
        break;
      case this.ARROW_DOWN:
        newIndex = Math.min(items.length - 1, currentIndex + columns);
        break;
    }

    if (newIndex !== currentIndex) {
      e.preventDefault();
      items[newIndex].focus();
    }

    return newIndex;
  }
};

/**
 * Enhanced screen reader utilities
 */
export const ScreenReader = {
  /**
   * Hide element from screen readers
   */
  hide(element: HTMLElement): void {
    element.setAttribute('aria-hidden', 'true');
  },

  /**
   * Show element to screen readers
   */
  show(element: HTMLElement): void {
    element.removeAttribute('aria-hidden');
  },

  /**
   * Mark element as decorative
   */
  decorative(element: HTMLElement): void {
    element.setAttribute('role', 'presentation');
    element.setAttribute('aria-hidden', 'true');
  },

  /**
   * Add description to element with enhanced accessibility
   */
  describe(element: HTMLElement, description: string): void {
    if (!description.trim()) {
      return;
    }

    const descId = `desc-${Math.random().toString(36).substr(2, 9)}`;
    const descElement = document.createElement('div');
    descElement.id = descId;
    descElement.classList.add('sr-only');
    descElement.textContent = description.trim();
    
    document.body.appendChild(descElement);
    element.setAttribute('aria-describedby', descId);
  },

  /**
   * Add live region for dynamic content updates
   */
  addLiveRegion(element: HTMLElement, type: 'polite' | 'assertive' = 'polite'): void {
    element.setAttribute('aria-live', type);
    element.setAttribute('aria-atomic', 'true');
  },

  /**
   * Remove live region
   */
  removeLiveRegion(element: HTMLElement): void {
    element.removeAttribute('aria-live');
    element.removeAttribute('aria-atomic');
  }
};

/**
 * Form accessibility utilities
 */
export const FormAccessibility = {
  /**
   * Add error message association to form fields
   */
  associateError(field: HTMLElement, errorMessage: string): void {
    const errorId = `error-${Math.random().toString(36).substr(2, 9)}`;
    const errorElement = document.createElement('div');
    errorElement.id = errorId;
    errorElement.className = 'text-red-600 text-sm mt-1';
    errorElement.textContent = errorMessage;
    errorElement.setAttribute('role', 'alert');
    
    field.parentNode?.insertBefore(errorElement, field.nextSibling);
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorId);
  },

  /**
   * Remove error association from form field
   */
  removeError(field: HTMLElement): void {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    
    const errorElement = field.parentNode?.querySelector('[role="alert"]');
    if (errorElement) {
      errorElement.remove();
    }
  },

  /**
   * Validate form field accessibility
   */
  validateField(field: HTMLElement): boolean {
    const hasLabel = !!(field.hasAttribute('aria-label') || 
                    field.hasAttribute('aria-labelledby') ||
                    field.querySelector('label'));
    
    const hasDescription = !!field.hasAttribute('aria-describedby');
    
    return hasLabel && hasDescription;
  }
};

/**
 * Initialize comprehensive accessibility features
 */
export function initializeAccessibility(): void {
  // Initialize skip links
  initializeSkipLinks();
  
  // Add focus indicators for keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
  
  // Announce page load
  announceToScreenReader('Page loaded successfully', 'polite');
}
