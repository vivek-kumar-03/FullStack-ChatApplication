import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme configurations
const themes = {
  light: {
    name: 'Light',
    icon: '☀️',
    colors: {
      primary: '#3b82f6',
      primaryLight: '#60a5fa',
      primaryDark: '#2563eb',
      secondary: '#8b5cf6',
      background: '#ffffff',
      surface: '#f8fafc',
      surfaceHover: '#f1f5f9',
      textPrimary: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#3b82f6',
      chatBubbleOther: '#f1f5f9',
    }
  },
  dark: {
    name: 'Dark',
    icon: '🌙',
    colors: {
      primary: '#60a5fa',
      primaryLight: '#93c5fd',
      primaryDark: '#3b82f6',
      secondary: '#a78bfa',
      background: '#0f172a',
      surface: '#1e293b',
      surfaceHover: '#334155',
      textPrimary: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      success: '#34d399',
      error: '#f87171',
      warning: '#fbbf24',
      chatBubbleMe: '#3b82f6',
      chatBubbleOther: '#334155',
    }
  },
  blue: {
    name: 'Ocean',
    icon: '🌊',
    colors: {
      primary: '#0ea5e9',
      primaryLight: '#38bdf8',
      primaryDark: '#0284c7',
      secondary: '#06b6d4',
      background: '#f0f9ff',
      surface: '#e0f2fe',
      surfaceHover: '#bae6fd',
      textPrimary: '#0c4a6e',
      textSecondary: '#0369a1',
      border: '#7dd3fc',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#0ea5e9',
      chatBubbleOther: '#e0f2fe',
    }
  },
  green: {
    name: 'Forest',
    icon: '🌲',
    colors: {
      primary: '#16a34a',
      primaryLight: '#22c55e',
      primaryDark: '#15803d',
      secondary: '#10b981',
      background: '#f0fdf4',
      surface: '#dcfce7',
      surfaceHover: '#bbf7d0',
      textPrimary: '#14532d',
      textSecondary: '#166534',
      border: '#86efac',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#16a34a',
      chatBubbleOther: '#dcfce7',
    }
  },
  purple: {
    name: 'Royal',
    icon: '👑',
    colors: {
      primary: '#9333ea',
      primaryLight: '#a855f7',
      primaryDark: '#7e22ce',
      secondary: '#c084fc',
      background: '#faf5ff',
      surface: '#f3e8ff',
      surfaceHover: '#e9d5ff',
      textPrimary: '#4c1d95',
      textSecondary: '#5b21b6',
      border: '#d8b4fe',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#9333ea',
      chatBubbleOther: '#f3e8ff',
    }
  },
  red: {
    name: 'Crimson',
    icon: '❤️',
    colors: {
      primary: '#dc2626',
      primaryLight: '#ef4444',
      primaryDark: '#b91c1c',
      secondary: '#f87171',
      background: '#fef2f2',
      surface: '#fee2e2',
      surfaceHover: '#fecaca',
      textPrimary: '#7f1d1d',
      textSecondary: '#991b1b',
      border: '#fca5a5',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#dc2626',
      chatBubbleOther: '#fee2e2',
    }
  },
  orange: {
    name: 'Sunset',
    icon: '🌅',
    colors: {
      primary: '#ea580c',
      primaryLight: '#f97316',
      primaryDark: '#c2410c',
      secondary: '#fb923c',
      background: '#fff7ed',
      surface: '#ffedd5',
      surfaceHover: '#fed7aa',
      textPrimary: '#9a3412',
      textSecondary: '#c2410c',
      border: '#fdba74',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#ea580c',
      chatBubbleOther: '#ffedd5',
    }
  },
  pink: {
    name: 'Rose',
    icon: '🌸',
    colors: {
      primary: '#db2777',
      primaryLight: '#ec4899',
      primaryDark: '#be185d',
      secondary: '#f472b6',
      background: '#fdf2f8',
      surface: '#fce7f3',
      surfaceHover: '#fbcfe8',
      textPrimary: '#831843',
      textSecondary: '#9d174d',
      border: '#f9a8d4',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#db2777',
      chatBubbleOther: '#fce7f3',
    }
  },
  teal: {
    name: 'Turquoise',
    icon: '💎',
    colors: {
      primary: '#0d9488',
      primaryLight: '#14b8a6',
      primaryDark: '#0f766e',
      secondary: '#2dd4bf',
      background: '#f0fdfa',
      surface: '#ccfbf1',
      surfaceHover: '#99f6e4',
      textPrimary: '#134e4a',
      textSecondary: '#0f766e',
      border: '#5eead4',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#0d9488',
      chatBubbleOther: '#ccfbf1',
    }
  },
  indigo: {
    name: 'Midnight',
    icon: '🌌',
    colors: {
      primary: '#4f46e5',
      primaryLight: '#6366f1',
      primaryDark: '#4338ca',
      secondary: '#818cf8',
      background: '#eef2ff',
      surface: '#c7d2fe',
      surfaceHover: '#a5b4fc',
      textPrimary: '#312e81',
      textSecondary: '#3730a3',
      border: '#a5b4fc',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#4f46e5',
      chatBubbleOther: '#c7d2fe',
    }
  },
  lime: {
    name: 'Lemon',
    icon: '🍋',
    colors: {
      primary: '#65a30d',
      primaryLight: '#84cc16',
      primaryDark: '#4d7c0f',
      secondary: '#a3e635',
      background: '#f7fee7',
      surface: '#d9f99d',
      surfaceHover: '#bef264',
      textPrimary: '#365314',
      textSecondary: '#4d7c0f',
      border: '#a3e635',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#65a30d',
      chatBubbleOther: '#d9f99d',
    }
  },
  amber: {
    name: 'Honey',
    icon: '🍯',
    colors: {
      primary: '#d97706',
      primaryLight: '#f59e0b',
      primaryDark: '#b45309',
      secondary: '#fbbf24',
      background: '#fffbeb',
      surface: '#fef3c7',
      surfaceHover: '#fde68a',
      textPrimary: '#92400e',
      textSecondary: '#b45309',
      border: '#fcd34d',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#d97706',
      chatBubbleOther: '#fef3c7',
    }
  },
  cyan: {
    name: 'Arctic',
    icon: '❄️',
    colors: {
      primary: '#0891b2',
      primaryLight: '#06b6d4',
      primaryDark: '#0e7490',
      secondary: '#22d3ee',
      background: '#ecfeff',
      surface: '#cffafe',
      surfaceHover: '#a5f3fc',
      textPrimary: '#164e63',
      textSecondary: '#0891b2',
      border: '#67e8f9',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#0891b2',
      chatBubbleOther: '#cffafe',
    }
  },
  emerald: {
    name: 'Jade',
    icon: '🍃',
    colors: {
      primary: '#059669',
      primaryLight: '#10b981',
      primaryDark: '#047857',
      secondary: '#34d399',
      background: '#ecfdf5',
      surface: '#d1fae5',
      surfaceHover: '#a7f3d0',
      textPrimary: '#065f46',
      textSecondary: '#059669',
      border: '#6ee7b7',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#059669',
      chatBubbleOther: '#d1fae5',
    }
  },
  violet: {
    name: 'Lavender',
    icon: '薰',
    colors: {
      primary: '#7c3aed',
      primaryLight: '#8b5cf6',
      primaryDark: '#6d28d9',
      secondary: '#a78bfa',
      background: '#f5f3ff',
      surface: '#e0e7ff',
      surfaceHover: '#c7d2fe',
      textPrimary: '#312e81',
      textSecondary: '#4c1d95',
      border: '#c4b5fd',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#7c3aed',
      chatBubbleOther: '#e0e7ff',
    }
  },
  fuchsia: {
    name: 'Magenta',
    icon: '🌺',
    colors: {
      primary: '#c026d3',
      primaryLight: '#d946ef',
      primaryDark: '#a21caf',
      secondary: '#e879f9',
      background: '#fdf4ff',
      surface: '#fae8ff',
      surfaceHover: '#f0abfc',
      textPrimary: '#701a75',
      textSecondary: '#86198f',
      border: '#f0abfc',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#c026d3',
      chatBubbleOther: '#fae8ff',
    }
  },
  rose: {
    name: 'Blush',
    icon: '💄',
    colors: {
      primary: '#e11d48',
      primaryLight: '#f43f5e',
      primaryDark: '#be123c',
      secondary: '#fb7185',
      background: '#fff1f2',
      surface: '#ffe4e6',
      surfaceHover: '#fecdd3',
      textPrimary: '#881337',
      textSecondary: '#9f1239',
      border: '#fda4af',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#e11d48',
      chatBubbleOther: '#ffe4e6',
    }
  },
  sky: {
    name: 'Sky',
    icon: '🌤️',
    colors: {
      primary: '#0284c7',
      primaryLight: '#0ea5e9',
      primaryDark: '#0369a1',
      secondary: '#38bdf8',
      background: '#f0f9ff',
      surface: '#e0f2fe',
      surfaceHover: '#bae6fd',
      textPrimary: '#0c4a6e',
      textSecondary: '#0284c7',
      border: '#7dd3fc',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#0284c7',
      chatBubbleOther: '#e0f2fe',
    }
  },
  slate: {
    name: 'Stone',
    icon: '🪨',
    colors: {
      primary: '#475569',
      primaryLight: '#64748b',
      primaryDark: '#334155',
      secondary: '#94a3b8',
      background: '#f8fafc',
      surface: '#f1f5f9',
      surfaceHover: '#e2e8f0',
      textPrimary: '#1e293b',
      textSecondary: '#475569',
      border: '#cbd5e1',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#475569',
      chatBubbleOther: '#f1f5f9',
    }
  },
  zinc: {
    name: 'Metal',
    icon: '⚙️',
    colors: {
      primary: '#52525b',
      primaryLight: '#71717a',
      primaryDark: '#3f3f46',
      secondary: '#a1a1aa',
      background: '#fafafa',
      surface: '#f4f4f5',
      surfaceHover: '#e4e4e7',
      textPrimary: '#27272a',
      textSecondary: '#52525b',
      border: '#d4d4d8',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#52525b',
      chatBubbleOther: '#f4f4f5',
    }
  },
  neutral: {
    name: 'Concrete',
    icon: '🏗️',
    colors: {
      primary: '#525252',
      primaryLight: '#737373',
      primaryDark: '#404040',
      secondary: '#a3a3a3',
      background: '#fafafa',
      surface: '#f5f5f5',
      surfaceHover: '#e5e5e5',
      textPrimary: '#262626',
      textSecondary: '#525252',
      border: '#d4d4d4',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#525252',
      chatBubbleOther: '#f5f5f5',
    }
  },
  stone: {
    name: 'Pebble',
    icon: '🪵',
    colors: {
      primary: '#57534e',
      primaryLight: '#78716c',
      primaryDark: '#44403c',
      secondary: '#a8a29e',
      background: '#fafaf9',
      surface: '#f5f5f4',
      surfaceHover: '#e7e5e4',
      textPrimary: '#292524',
      textSecondary: '#57534e',
      border: '#d6d3d1',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      chatBubbleMe: '#57534e',
      chatBubbleOther: '#f5f5f4',
    }
  }
};

// Create context
const ThemeContext = createContext();

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [themeData, setThemeData] = useState(themes.dark);

  // Apply theme to document
  const applyTheme = (themeName) => {
    const theme = themes[themeName] || themes.dark;
    setThemeData(theme);
    setCurrentTheme(themeName);
    
    // Apply CSS variables to root
    const root = document.documentElement;
    Object.keys(theme.colors).forEach(key => {
      root.style.setProperty(`--${key}`, theme.colors[key]);
    });
    
    // Store in localStorage
    localStorage.setItem('custom-theme', themeName);
  };

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('custom-theme') || 'dark';
    applyTheme(savedTheme);
  }, []);

  // Update theme function
  const updateTheme = (themeName) => {
    applyTheme(themeName);
  };

  // Get theme info
  const getThemeInfo = (themeName) => {
    return themes[themeName] || themes.dark;
  };

  // Get all themes
  const getAllThemes = () => {
    return themes;
  };

  const value = {
    currentTheme,
    themeData,
    updateTheme,
    getThemeInfo,
    getAllThemes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};