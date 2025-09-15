import { useState, useEffect } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type Theme = 'light' | 'dark' | 'system';

export const ThemeToggle = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('petmatch_theme', 'system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const getCurrentIcon = () => {
    if (theme === 'dark') {
      return <Moon className="h-4 w-4" />;
    } else if (theme === 'light') {
      return <Sun className="h-4 w-4" />;
    } else {
      // System theme - show current system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled className="relative">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const themes: Array<{ value: Theme; label: string; icon: React.ReactNode }> = [
    {
      value: 'light',
      label: 'Mode clair',
      icon: <Sun className="h-4 w-4" />
    },
    {
      value: 'dark',
      label: 'Mode sombre',
      icon: <Moon className="h-4 w-4" />
    },
    {
      value: 'system',
      label: 'Mode système',
      icon: <Laptop className="h-4 w-4" />
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative transition-all duration-200 hover:bg-accent/80 hover:scale-105"
        >
          {getCurrentIcon()}
          <span className="sr-only">Changer le thème</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[160px] bg-popover/95 backdrop-blur-sm border-border/50"
      >
        {themes.map(({ value, label, icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="flex items-center gap-3 cursor-pointer transition-colors duration-200 hover:bg-accent/50"
          >
            <div className="flex items-center gap-2 flex-1">
              {icon}
              <span className="text-sm">{label}</span>
            </div>
            {theme === value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};