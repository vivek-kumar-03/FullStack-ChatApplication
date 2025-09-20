import { create } from "zustand";
import { useTheme } from "../context/ThemeContext.jsx";

// Custom theme configuration
const customThemes = {
  light: {
    name: "Light",
    icon: "☀️",
  },
  dark: {
    name: "Dark",
    icon: "🌙",
  },
  blue: {
    name: "Ocean",
    icon: "🌊",
  },
  green: {
    name: "Forest",
    icon: "🌲",
  },
  purple: {
    name: "Royal",
    icon: "👑",
  },
};

export const useThemeStore = create((set, get) => {
  return {
    themes: customThemes,
    currentTheme: 'dark',
    
    setTheme: (themeName) => {
      if (!customThemes[themeName]) {
        console.warn(`Theme ${themeName} not found, falling back to dark theme`);
        themeName = 'dark';
      }
      
      set({ currentTheme: themeName });
      
      // Update the theme in our custom theme context
      try {
        const themeEvent = new CustomEvent('theme-change', { detail: themeName });
        window.dispatchEvent(themeEvent);
      } catch (error) {
        console.error('Error dispatching theme change event:', error);
      }
    },

    getCurrentThemeData: () => {
      const { currentTheme } = get();
      return customThemes[currentTheme] || customThemes.dark;
    }
  };
});