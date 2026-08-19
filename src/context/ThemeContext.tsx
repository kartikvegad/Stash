import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme } from '../types';

interface ThemeContextType {
  theme: AppTheme;
  globalTheme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  setOverrideTheme: (theme: AppTheme | null) => void;
}

const defaultTheme: AppTheme = {
  primary_color: '#F5F5F7',
  secondary_color: '#1A1C1E',
};

const legacyDefault: AppTheme = {
  primary_color: '#E0E0E0',
  secondary_color: '#FF4400',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const readSavedTheme = (): AppTheme => {
  const saved = localStorage.getItem('stash_theme');
  if (!saved) return defaultTheme;

  try {
    const parsed = JSON.parse(saved) as AppTheme;
    const isLegacyDefault =
      parsed.primary_color === legacyDefault.primary_color &&
      parsed.secondary_color === legacyDefault.secondary_color;
    return isLegacyDefault ? defaultTheme : parsed;
  } catch {
    return defaultTheme;
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalTheme, setGlobalTheme] = useState<AppTheme>(readSavedTheme);
  const [overrideTheme, setOverrideTheme] = useState<AppTheme | null>(null);
  const theme = overrideTheme ?? globalTheme;

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', theme.primary_color);
    document.documentElement.style.setProperty('--secondary', theme.secondary_color);
    document.documentElement.style.setProperty('--ink', theme.secondary_color);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('stash_theme', JSON.stringify(globalTheme));
  }, [globalTheme]);

  return (
    <ThemeContext.Provider value={{ theme, globalTheme, setTheme: setGlobalTheme, setOverrideTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

const parseHex = (hex: string): { r: number; g: number; b: number } | null => {
  const value = hex.trim().replace('#', '');
  const normalized = value.length === 3
    ? value.split('').map((char) => `${char}${char}`).join('')
    : value;
  if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) return null;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
};

const channelLuminance = (channel: number) => {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

export const isDarkHex = (hex: string): boolean => {
  const rgb = parseHex(hex);
  if (!rgb) return true;
  const luminance =
    0.2126 * channelLuminance(rgb.r) +
    0.7152 * channelLuminance(rgb.g) +
    0.0722 * channelLuminance(rgb.b);
  return luminance < 0.45;
};

export const navContrastVars = (inkHex: string): React.CSSProperties => {
  const dark = isDarkHex(inkHex);
  return {
    '--nav-fill': inkHex,
    '--nav-fg': dark ? '#f7f7f8' : '#161618',
    '--nav-muted': dark ? 'rgba(247, 247, 248, 0.58)' : 'rgba(22, 22, 24, 0.55)',
    '--nav-line': dark ? 'rgba(247, 247, 248, 0.2)' : 'rgba(22, 22, 24, 0.18)',
  } as React.CSSProperties;
};
