import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const ThemeToggle = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>('petmatch_theme', 'system');
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

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const getIcon = () => {
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

  const getTitle = () => {
    if (theme === 'dark') return 'Mode sombre';
    if (theme === 'light') return 'Mode clair';
    return 'Mode système';
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={getTitle()}
      className="relative"
    >
      {getIcon()}
      {theme === 'system' && (
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full" />
      )}
    </Button>
  );
};