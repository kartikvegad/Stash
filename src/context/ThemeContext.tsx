import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme } from '../types';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const defaultTheme: AppTheme = {
  primary_color: '#E0E0E0',
  secondary_color: '#FF4400',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('stash_theme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  useEffect(() => {
    // Apply theme to CSS variables on mount and change
    document.documentElement.style.setProperty('--primary', theme.primary_color);
    document.documentElement.style.setProperty('--secondary', theme.secondary_color);
    localStorage.setItem('stash_theme', JSON.stringify(theme));
  }, [theme]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
