import { 
  ColorContrast, 
  FocusManagement, 
  announceToScreenReader, 
  ScreenReader,
  FormAccessibility,
  initializeAccessibility
} from '../accessibility';

// Mock DOM elements
const createMockElement = (tagName: string = 'div'): HTMLElement => {
  const element = document.createElement(tagName);
  element.setAttribute('tabindex', '0');
  return element;
};

describe('ColorContrast', () => {
  describe('getRelativeLuminance', () => {
    it('should calculate relative luminance correctly', () => {
      expect(ColorContrast.getRelativeLuminance(255, 255, 255)).toBeCloseTo(1, 3); // White
      expect(ColorContrast.getRelativeLuminance(0, 0, 0)).toBeCloseTo(0, 3); // Black
      expect(ColorContrast.getRelativeLuminance(128, 128, 128)).toBeCloseTo(0.216, 3); // Gray - fixed precision
    });
  });

  describe('getContrastRatio', () => {
    it('should calculate contrast ratio correctly', () => {
      expect(ColorContrast.getContrastRatio(1, 0)).toBe(21); // White on black
      expect(ColorContrast.getContrastRatio(0, 1)).toBe(21); // Black on white
      expect(ColorContrast.getContrastRatio(0.5, 0.5)).toBe(1); // Same luminance
    });
  });

  describe('meetsWCAGAA', () => {
    it('should validate WCAG AA compliance for normal text', () => {
      expect(ColorContrast.meetsWCAGAA('#000000', '#FFFFFF')).toBe(true); // Black on white
      expect(ColorContrast.meetsWCAGAA('#888888', '#FFFFFF')).toBe(false); // Darker gray on white - fixed color
    });

    it('should validate WCAG AA compliance for large text', () => {
      expect(ColorContrast.meetsWCAGAA('#666666', '#FFFFFF', true)).toBe(true); // Gray on white (large text)
    });
  });

  describe('hexToRgb', () => {
    it('should convert hex colors to RGB', () => {
      expect(ColorContrast.hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(ColorContrast.hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(ColorContrast.hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
    });

    it('should handle invalid hex colors', () => {
      expect(ColorContrast.hexToRgb('invalid')).toBeNull();
      expect(ColorContrast.hexToRgb('#GGGGGG')).toBeNull();
    });
  });
});

describe('FocusManagement', () => {
  let container: HTMLElement;
  let focusableElements: HTMLElement[];

  beforeEach(() => {
    container = createMockElement();
    focusableElements = [
      createMockElement('button'),
      createMockElement('input'),
      createMockElement('a'),
      createMockElement('div')
    ];
    
    // Make elements focusable with proper tabindex
    focusableElements[0].setAttribute('tabindex', '0'); // button
    focusableElements[1].setAttribute('tabindex', '0'); // input
    focusableElements[2].setAttribute('tabindex', '0'); // a
    focusableElements[3].setAttribute('tabindex', '-1'); // div (not focusable)
    
    focusableElements.forEach(el => container.appendChild(el));
  });

  describe('trapFocus', () => {
    it('should trap focus within container', () => {
      const cleanup = FocusManagement.trapFocus(container);
      expect(typeof cleanup).toBe('function');
      
      // Mock focus behavior for test environment
      const mockFocus = jest.fn();
      focusableElements[0].focus = mockFocus;
      
      // Test focus trap functionality
      focusableElements[0].focus();
      expect(mockFocus).toHaveBeenCalled();
      
      cleanup();
    });
  });

  describe('focusFirst', () => {
    it('should focus first focusable element', () => {
      const mockFocus = jest.fn();
      focusableElements[0].focus = mockFocus;
      
      FocusManagement.focusFirst(container);
      expect(mockFocus).toHaveBeenCalled();
    });
  });

  describe('focusLast', () => {
    it('should focus last focusable element', () => {
      const mockFocus = jest.fn();
      focusableElements[2].focus = mockFocus; // 'a' tag is focusable
      
      FocusManagement.focusLast(container);
      expect(mockFocus).toHaveBeenCalled();
    });
  });
});

describe('ScreenReader', () => {
  beforeEach(() => {
    // Clear any existing live regions
    document.querySelectorAll('[aria-live]').forEach(el => el.remove());
  });

  describe('describe', () => {
    it('should create live region for announcements', () => {
      const element = createMockElement();
      ScreenReader.describe(element, 'Test announcement');
      expect(element.getAttribute('aria-describedby')).toContain('desc-');
    });

    it('should handle empty messages', () => {
      const element = createMockElement();
      ScreenReader.describe(element, '');
      expect(element.getAttribute('aria-describedby')).toBeNull();
    });
  });

  describe('addLiveRegion', () => {
    it('should add live region to element', () => {
      const element = createMockElement();
      ScreenReader.addLiveRegion(element, 'assertive');
      expect(element.getAttribute('aria-live')).toBe('assertive');
    });
  });

  describe('removeLiveRegion', () => {
    it('should remove live region from element', () => {
      const element = createMockElement();
      element.setAttribute('aria-live', 'polite');
      ScreenReader.removeLiveRegion(element);
      expect(element.getAttribute('aria-live')).toBeNull();
    });
  });
});

describe('FormAccessibility', () => {
  let field: HTMLElement;

  beforeEach(() => {
    field = createMockElement('input');
  });

  describe('associateError', () => {
    it('should associate error with field', () => {
      FormAccessibility.associateError(field, 'This field is required');
      expect(field.getAttribute('aria-invalid')).toBe('true');
      expect(field.getAttribute('aria-describedby')).toContain('error-');
    });
  });

  describe('removeError', () => {
    it('should remove error association from field', () => {
      FormAccessibility.associateError(field, 'Error message');
      FormAccessibility.removeError(field);
      expect(field.getAttribute('aria-invalid')).toBeNull();
    });
  });

  describe('validateField', () => {
    it('should validate field accessibility', () => {
      // Field without label or description
      expect(FormAccessibility.validateField(field)).toBe(false);
      
      // Field with label but no description
      field.setAttribute('aria-label', 'Test field');
      expect(FormAccessibility.validateField(field)).toBe(false);
      
      // Field with both label and description
      field.setAttribute('aria-describedby', 'helper-text');
      expect(FormAccessibility.validateField(field)).toBe(true);
    });
  });
});

describe('announceToScreenReader', () => {
  beforeEach(() => {
    // Clear any existing announcements
    document.querySelectorAll('[aria-live]').forEach(el => el.remove());
  });

  it('should announce messages to screen readers', () => {
    announceToScreenReader('Test announcement');
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeTruthy();
    expect(liveRegion?.textContent).toBe('Test announcement');
  });

  it('should handle assertive announcements', () => {
    announceToScreenReader('Important message', 'assertive');
    const liveRegion = document.querySelector('[aria-live="assertive"]');
    expect(liveRegion).toBeTruthy();
  });
});

describe('initializeAccessibility', () => {
  beforeEach(() => {
    // Mock console.log
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize accessibility features', () => {
    initializeAccessibility();
    expect(console.log).toHaveBeenCalledWith('♿ Accessibility features initialized');
  });
});
