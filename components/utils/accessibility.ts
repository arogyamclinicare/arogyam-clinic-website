/**
 * Accessibility utilities for WCAG compliance
 * Provides helpers for keyboard navigation, screen readers, and focus management
 */

/**
 * Trap focus within a container for modal dialogs
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
  };
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.classList.add('sr-only');
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get accessible color contrast ratio
 */
export function getContrastRatio(color1: string, color2: string): number {
  // Simplified contrast ratio calculation
  // In production, use a proper color library
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Calculate relative luminance (simplified)
 */
function getLuminance(_color: string): number {
  // This is a simplified version - use a proper color library in production
  return 0.5; // Placeholder
}

/**
 * Ensure minimum touch target size (44x44px)
 */
export function validateTouchTarget(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width >= 44 && rect.height >= 44;
}

/**
 * Add skip link functionality
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
      }
    });
  });
}

/**
 * Manage focus for single page applications
 */
export function manageFocus(heading: string): void {
  // Create or update page heading for screen readers
  let pageHeading = document.querySelector('#page-heading') as HTMLElement;
  
  if (!pageHeading) {
    pageHeading = document.createElement('h1');
    pageHeading.id = 'page-heading';
    pageHeading.classList.add('sr-only');
    document.body.insertBefore(pageHeading, document.body.firstChild);
  }
  
  pageHeading.textContent = heading;
  pageHeading.focus();
}

/**
 * Add aria-label for dynamic content
 */
export function addAriaLabel(element: HTMLElement, label: string): void {
  element.setAttribute('aria-label', label);
}

/**
 * Create accessible loading state
 */
export function createLoadingState(container: HTMLElement, message = 'Loading...'): HTMLElement {
  const loader = document.createElement('div');
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-live', 'polite');
  loader.setAttribute('aria-label', message);
  loader.classList.add('loading-indicator');
  
  const visualLoader = document.createElement('div');
  visualLoader.classList.add('spinner');
  visualLoader.setAttribute('aria-hidden', 'true');
  
  const textLoader = document.createElement('span');
  textLoader.classList.add('sr-only');
  textLoader.textContent = message;
  
  loader.appendChild(visualLoader);
  loader.appendChild(textLoader);
  container.appendChild(loader);
  
  return loader;
}

/**
 * Keyboard navigation helpers
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

  /**
   * Handle arrow key navigation in a list
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
    }

    if (newIndex !== currentIndex) {
      items[newIndex].focus();
    }

    return newIndex;
  }
};

/**
 * Screen reader utilities
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
   * Add description to element
   */
  describe(element: HTMLElement, description: string): void {
    const descId = `desc-${Math.random().toString(36).substr(2, 9)}`;
    const descElement = document.createElement('div');
    descElement.id = descId;
    descElement.classList.add('sr-only');
    descElement.textContent = description;
    
    document.body.appendChild(descElement);
    element.setAttribute('aria-describedby', descId);
  }
};
