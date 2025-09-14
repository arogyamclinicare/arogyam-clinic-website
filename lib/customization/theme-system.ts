/**
 * Dynamic Theming and Customization System
 * Advanced theme management with real-time updates
 */

import { EventSubject } from '../architecture/design-patterns';

export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      light: string;
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
}

export const DEFAULT_THEMES: Record<string, ThemeConfig> = {
  light: {
    id: 'light',
    name: 'Light Theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },
  dark: {
    id: 'dark',
    name: 'Dark Theme',
    colors: {
      primary: '#60a5fa',
      secondary: '#94a3b8',
      accent: '#fbbf24',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.6)'
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },
  medical: {
    id: 'medical',
    name: 'Medical Theme',
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#0284c7',
      background: '#f9fafb',
      surface: '#ffffff',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#d1d5db',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#0284c7'
    },
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem'
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  }
};

export interface UserPreferences {
  theme: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  notifications: {
    email: boolean;
    browser: boolean;
    sound: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    density: 'compact' | 'comfortable' | 'spacious';
    widgets: string[];
  };
}

export class ThemeManager {
  private static instance: ThemeManager;
  private currentTheme: ThemeConfig;
  private themes: Map<string, ThemeConfig> = new Map();
  private eventSubject = new EventSubject<{ theme: ThemeConfig; preferences: UserPreferences }>();
  private userPreferences: UserPreferences;

  private constructor() {
    this.loadDefaultThemes();
    this.currentTheme = DEFAULT_THEMES.light;
    this.userPreferences = this.getDefaultPreferences();
    this.loadUserPreferences();
    this.applyTheme();
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  public getCurrentTheme(): ThemeConfig {
    return this.currentTheme;
  }

  public getThemes(): ThemeConfig[] {
    return Array.from(this.themes.values());
  }

  public setTheme(themeId: string): void {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme '${themeId}' not found`);
    }

    this.currentTheme = theme;
    this.userPreferences.theme = themeId;
    this.saveUserPreferences();
    this.applyTheme();
    this.notifyChange();
  }

  public registerTheme(theme: ThemeConfig): void {
    this.themes.set(theme.id, theme);
  }

  public createCustomTheme(baseThemeId: string, customizations: Partial<ThemeConfig>): ThemeConfig {
    const baseTheme = this.themes.get(baseThemeId);
    if (!baseTheme) {
      throw new Error(`Base theme '${baseThemeId}' not found`);
    }

    const customTheme: ThemeConfig = {
      ...baseTheme,
      ...customizations,
      id: customizations.id || `custom_${Date.now()}`,
      name: customizations.name || `Custom ${baseTheme.name}`,
      colors: { ...baseTheme.colors, ...customizations.colors },
      typography: { ...baseTheme.typography, ...customizations.typography },
      spacing: { ...baseTheme.spacing, ...customizations.spacing },
      borderRadius: { ...baseTheme.borderRadius, ...customizations.borderRadius },
      shadows: { ...baseTheme.shadows, ...customizations.shadows },
      breakpoints: { ...baseTheme.breakpoints, ...customizations.breakpoints }
    };

    this.registerTheme(customTheme);
    return customTheme;
  }

  public getUserPreferences(): UserPreferences {
    return { ...this.userPreferences };
  }

  public updatePreferences(preferences: Partial<UserPreferences>): void {
    this.userPreferences = { ...this.userPreferences, ...preferences };
    this.saveUserPreferences();
    this.notifyChange();
  }

  public subscribe(callback: (data: { theme: ThemeConfig; preferences: UserPreferences }) => void): () => void {
    return this.eventSubject.subscribe({ update: callback });
  }

  public exportTheme(themeId: string): string {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme '${themeId}' not found`);
    }
    return JSON.stringify(theme, null, 2);
  }

  public importTheme(themeData: string): ThemeConfig {
    const theme: ThemeConfig = JSON.parse(themeData);
      this.registerTheme(theme);
      return theme;
  }

  private loadDefaultThemes(): void {
    Object.values(DEFAULT_THEMES).forEach(theme => {
      this.themes.set(theme.id, theme);
    });
  }

  private getDefaultPreferences(): UserPreferences {
    return {
      theme: 'light',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      dateFormat: 'MM/dd/yyyy',
      timeFormat: '12h',
      notifications: {
        email: true,
        browser: true,
        sound: false
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        reducedMotion: false,
        screenReader: false
      },
      dashboard: {
        layout: 'grid',
        density: 'comfortable',
        widgets: ['overview', 'recent-consultations', 'upcoming-appointments']
      }
    };
  }

  private loadUserPreferences(): void {
    try {
      const stored = localStorage.getItem('arogyam_user_preferences');
      if (stored) {
        const preferences = JSON.parse(stored);
        this.userPreferences = { ...this.userPreferences, ...preferences };
        
        // Set theme if it exists
        const theme = this.themes.get(this.userPreferences.theme);
        if (theme) {
          this.currentTheme = theme;
        }
      }
    } catch (error) {
    // Empty block
  }
  }

  private saveUserPreferences(): void {
    try {
      localStorage.setItem('arogyam_user_preferences', JSON.stringify(this.userPreferences));
    } catch (error) {
    // Empty block
  }
  }

  private applyTheme(): void {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    Object.entries(this.currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    Object.entries(this.currentTheme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });

    Object.entries(this.currentTheme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value);
    });

    Object.entries(this.currentTheme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    Object.entries(this.currentTheme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    Object.entries(this.currentTheme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    root.style.setProperty('--font-family', this.currentTheme.typography.fontFamily);

    // Apply accessibility preferences
    if (this.userPreferences.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (this.userPreferences.accessibility.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    if (this.userPreferences.accessibility.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }

  private notifyChange(): void {
    this.eventSubject.notify({
      theme: this.currentTheme,
      preferences: this.userPreferences
    });
  }
}

// Export singleton instance
export const ThemeSystem = ThemeManager.getInstance();