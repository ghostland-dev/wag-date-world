import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Theme = 'dark' | 'light' | 'system' | 'auto';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  actualTheme: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  isAutoMode: boolean;
  batteryLevel?: number;
  timeBasedSuggestion: 'dark' | 'light';
};

const initialState: ThemeProviderState = {
  theme: 'system',
  actualTheme: 'light',
  setTheme: () => null,
  isAutoMode: false,
  timeBasedSuggestion: 'light',
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function SmartThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'petmatch-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>(storageKey, defaultTheme);
  const [batteryLevel, setBatteryLevel] = useState<number | undefined>();
  const [timeBasedSuggestion, setTimeBasedSuggestion] = useState<'dark' | 'light'>('light');

  // Get system theme preference
  const getSystemTheme = (): 'dark' | 'light' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Get time-based theme suggestion
  const getTimeBasedTheme = (): 'dark' | 'light' => {
    const hour = new Date().getHours();
    // Dark mode between 8 PM and 7 AM
    return hour >= 20 || hour < 7 ? 'dark' : 'light';
  };

  // Get battery-aware theme
  const getBatteryAwareTheme = (): 'dark' | 'light' => {
    // If battery is low (< 20%), suggest dark mode to save power
    if (batteryLevel !== undefined && batteryLevel < 0.2) {
      return 'dark';
    }
    return getTimeBasedTheme();
  };

  // Calculate actual theme based on mode
  const calculateActualTheme = (): 'dark' | 'light' => {
    switch (storedTheme) {
      case 'dark':
        return 'dark';
      case 'light':
        return 'light';
      case 'system':
        return getSystemTheme();
      case 'auto':
        return getBatteryAwareTheme();
      default:
        return 'light';
    }
  };

  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>(calculateActualTheme);

  // Monitor battery level
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setBatteryLevel(battery.level);
        };
        
        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        
        return () => {
          battery.removeEventListener('levelchange', updateBattery);
        };
      });
    }
  }, []);

  // Update time-based suggestion every minute
  useEffect(() => {
    const updateTimeBasedSuggestion = () => {
      setTimeBasedSuggestion(getTimeBasedTheme());
    };
    
    updateTimeBasedSuggestion();
    const interval = setInterval(updateTimeBasedSuggestion, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (storedTheme === 'system' || storedTheme === 'auto') {
        setActualTheme(calculateActualTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [storedTheme]);

  // Update actual theme when stored theme or battery changes
  useEffect(() => {
    setActualTheme(calculateActualTheme());
  }, [storedTheme, batteryLevel, timeBasedSuggestion]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
  }, [actualTheme]);

  const setTheme = (theme: Theme) => {
    setStoredTheme(theme);
  };

  const value = {
    theme: storedTheme,
    actualTheme,
    setTheme,
    isAutoMode: storedTheme === 'auto',
    batteryLevel,
    timeBasedSuggestion,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a SmartThemeProvider');
  }

  return context;
};

// Smart Theme Toggle Component
export const SmartThemeToggle = () => {
  const { theme, setTheme, actualTheme, isAutoMode, batteryLevel, timeBasedSuggestion } = useTheme();

  const getThemeIcon = () => {
    if (isAutoMode) return '🤖';
    if (actualTheme === 'dark') return '🌙';
    return '☀️';
  };

  const getThemeLabel = () => {
    if (isAutoMode) return 'Auto';
    if (actualTheme === 'dark') return 'Sombre';
    return 'Clair';
  };

  const getBatteryInfo = () => {
    if (batteryLevel === undefined) return '';
    const percentage = Math.round(batteryLevel * 100);
    if (percentage < 20) return ' (Batterie faible - Mode sombre recommandé)';
    return ` (Batterie: ${percentage}%)`;
  };

  const getTimeBasedInfo = () => {
    if (timeBasedSuggestion !== actualTheme) {
      return ` (Suggestion: ${timeBasedSuggestion === 'dark' ? 'Sombre' : 'Clair'} pour l'heure actuelle)`;
    }
    return '';
  };

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-background hover:bg-accent transition-colors"
      title={`Thème: ${getThemeLabel()}${getBatteryInfo()}${getTimeBasedInfo()}`}
    >
      <span className="text-lg">{getThemeIcon()}</span>
      <span className="text-sm font-medium hidden sm:block">{getThemeLabel()}</span>
    </button>
  );
};