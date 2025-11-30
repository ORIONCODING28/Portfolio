import { Injectable, signal, computed, inject, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeName = 'default' | 'minimal' | 'hacker' | 'light';

export interface Theme {
  name: ThemeName;
  label: string;
  icon: string;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    accent: string;
    accentLight: string;
    accentDark: string;
    secondary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    glass: string;
    glassLight: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly STORAGE_KEY = 'portfolio-theme';

  // Available themes
  readonly themes: Theme[] = [
    {
      name: 'default',
      label: 'Violet Dreams',
      icon: '💜',
      colors: {
        bgPrimary: '#1a1a3e',
        bgSecondary: '#252558',
        bgTertiary: '#0f0f24',
        accent: '#9D4EDD',
        accentLight: '#C77DFF',
        accentDark: '#7B2CBF',
        secondary: '#00D9FF',
        textPrimary: '#FFFFFF',
        textSecondary: '#A1A1A6',
        textMuted: '#6E6E73',
        border: 'rgba(255, 255, 255, 0.1)',
        glass: 'rgba(255, 255, 255, 0.1)',
        glassLight: 'rgba(255, 255, 255, 0.05)',
      }
    },
    {
      name: 'minimal',
      label: 'Minimal Dark',
      icon: '🖤',
      colors: {
        bgPrimary: '#000000',
        bgSecondary: '#0a0a0a',
        bgTertiary: '#111111',
        accent: '#ffffff',
        accentLight: '#f5f5f5',
        accentDark: '#e0e0e0',
        secondary: '#888888',
        textPrimary: '#FFFFFF',
        textSecondary: '#888888',
        textMuted: '#555555',
        border: 'rgba(255, 255, 255, 0.08)',
        glass: 'rgba(255, 255, 255, 0.05)',
        glassLight: 'rgba(255, 255, 255, 0.02)',
      }
    },
    {
      name: 'hacker',
      label: 'Matrix',
      icon: '💚',
      colors: {
        bgPrimary: '#0a0a0a',
        bgSecondary: '#0d1117',
        bgTertiary: '#000000',
        accent: '#00ff41',
        accentLight: '#39ff14',
        accentDark: '#00cc33',
        secondary: '#00ff41',
        textPrimary: '#00ff41',
        textSecondary: '#00cc33',
        textMuted: '#008f11',
        border: 'rgba(0, 255, 65, 0.2)',
        glass: 'rgba(0, 255, 65, 0.05)',
        glassLight: 'rgba(0, 255, 65, 0.02)',
      }
    },
    {
      name: 'light',
      label: 'Light Mode',
      icon: '☀️',
      colors: {
        bgPrimary: '#ffffff',
        bgSecondary: '#f5f5f7',
        bgTertiary: '#e5e5e7',
        accent: '#9D4EDD',
        accentLight: '#C77DFF',
        accentDark: '#7B2CBF',
        secondary: '#0891b2',
        textPrimary: '#1a1a1a',
        textSecondary: '#6b7280',
        textMuted: '#9ca3af',
        border: 'rgba(0, 0, 0, 0.1)',
        glass: 'rgba(0, 0, 0, 0.03)',
        glassLight: 'rgba(0, 0, 0, 0.02)',
      }
    }
  ];

  // Current theme signal
  readonly currentTheme = signal<ThemeName>(this.loadThemeFromStorage());

  // Computed signals
  readonly theme = computed(() => 
    this.themes.find(t => t.name === this.currentTheme()) || this.themes[0]
  );

  readonly isDarkTheme = computed(() => this.currentTheme() !== 'light');

  constructor() {
    // Apply theme changes automatically
    effect(() => {
      this.applyTheme(this.theme());
    });
  }

  private loadThemeFromStorage(): ThemeName {
    if (!this.isBrowser) return 'default';

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored && this.themes.some(t => t.name === stored)) {
        return stored as ThemeName;
      }
    } catch (e) {
      console.error('Error loading theme from storage:', e);
    }

    return 'default';
  }

  private saveThemeToStorage(theme: ThemeName): void {
    if (!this.isBrowser) return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (e) {
      console.error('Error saving theme to storage:', e);
    }
  }

  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) return;

    const root = document.documentElement;

    // Remove all theme classes first
    root.classList.remove('light', 'dark', 'theme-minimal', 'theme-hacker');

    // Apply theme-specific class
    switch (theme.name) {
      case 'light':
        root.classList.add('light');
        break;
      case 'minimal':
        root.classList.add('theme-minimal', 'dark');
        break;
      case 'hacker':
        root.classList.add('theme-hacker', 'dark');
        break;
      default:
        root.classList.add('dark');
        break;
    }

    // Save to storage
    this.saveThemeToStorage(theme.name);
  }

  // Public methods
  setTheme(themeName: ThemeName): void {
    this.currentTheme.set(themeName);
  }

  nextTheme(): void {
    const currentIndex = this.themes.findIndex(t => t.name === this.currentTheme());
    const nextIndex = (currentIndex + 1) % this.themes.length;
    this.currentTheme.set(this.themes[nextIndex].name);
  }

  toggleLightDark(): void {
    if (this.currentTheme() === 'light') {
      this.currentTheme.set('default');
    } else {
      this.currentTheme.set('light');
    }
  }
}
