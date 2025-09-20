import { useTheme } from "../context/ThemeContext";
import { useThemeStore } from "../store/useThemeStore";

const ThemeSelector = () => {
  const { getAllThemes, updateTheme, currentTheme } = useTheme();
  const themes = getAllThemes();

  const handleThemeChange = (themeName) => {
    updateTheme(themeName);
    // Also update the theme store
    useThemeStore.getState().setTheme(themeName);
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-theme-surface rounded-lg border border-theme">
      <h3 className="text-theme-primary font-medium w-full mb-2">Select Theme</h3>
      {Object.entries(themes).map(([themeName, themeData]) => (
        <button
          key={themeName}
          onClick={() => handleThemeChange(themeName)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            currentTheme === themeName
              ? "ring-2 ring-primary bg-primary/10"
              : "hover:bg-theme-surface-hover"
          }`}
          title={themeData.name}
        >
          <span className="text-lg">{themeData.icon}</span>
          <span className="text-sm font-medium text-theme-primary hidden sm:inline">
            {themeData.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;