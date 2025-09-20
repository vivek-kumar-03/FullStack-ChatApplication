import { useTheme } from "../context/ThemeContext";

const ThemeTestPage = () => {
  const { getAllThemes, updateTheme, currentTheme } = useTheme();
  const themes = getAllThemes();

  return (
    <div className="min-h-screen bg-theme-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-theme-primary mb-8">Theme Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Theme Selector */}
          <div className="bg-theme-surface p-6 rounded-xl border border-theme shadow-lg">
            <h2 className="text-xl font-semibold text-theme-primary mb-4">Select Theme</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(themes).map(([themeName, themeData]) => (
                <button
                  key={themeName}
                  onClick={() => updateTheme(themeName)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-200 ${
                    currentTheme === themeName
                      ? "ring-2 ring-primary bg-primary/10"
                      : "hover:bg-theme-surface-hover"
                  }`}
                >
                  <span className="text-2xl">{themeData.icon}</span>
                  <span className="text-sm font-medium text-theme-primary">
                    {themeData.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Preview */}
          <div className="bg-theme-surface p-6 rounded-xl border border-theme shadow-lg">
            <h2 className="text-xl font-semibold text-theme-primary mb-4">Current Theme</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-theme-surface-hover border border-theme">
                <h3 className="font-medium text-theme-primary">Surface Colors</h3>
                <p className="text-sm text-theme-secondary mt-1">
                  Background: <span className="font-mono">var(--background)</span>
                </p>
                <p className="text-sm text-theme-secondary mt-1">
                  Surface: <span className="font-mono">var(--surface)</span>
                </p>
                <p className="text-sm text-theme-secondary mt-1">
                  Hover: <span className="font-mono">var(--surfaceHover)</span>
                </p>
              </div>

              <div className="p-4 rounded-lg border border-theme" style={{ backgroundColor: 'var(--primary)' }}>
                <h3 className="font-medium text-white">Primary Color</h3>
                <p className="text-sm text-white/80 mt-1">
                  Value: <span className="font-mono">var(--primary)</span>
                </p>
              </div>

              <div className="p-4 rounded-lg border border-theme" style={{ backgroundColor: 'var(--secondary)' }}>
                <h3 className="font-medium text-white">Secondary Color</h3>
                <p className="text-sm text-white/80 mt-1">
                  Value: <span className="font-mono">var(--secondary)</span>
                </p>
              </div>

              <div className="p-4 rounded-lg bg-theme-surface border border-theme">
                <h3 className="font-medium text-theme-primary">Text Colors</h3>
                <p className="text-theme-primary mt-1">Primary Text</p>
                <p className="text-theme-secondary mt-1">Secondary Text</p>
              </div>
            </div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="mt-8 bg-theme-surface p-6 rounded-xl border border-theme shadow-lg">
          <h2 className="text-xl font-semibold text-theme-primary mb-4">Component Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-primary text-primary-content">
              <h3 className="font-medium">Primary Button</h3>
              <button className="mt-2 px-4 py-2 bg-primary text-primary-content rounded-lg hover:opacity-90 transition-opacity">
                Click Me
              </button>
            </div>
            
            <div className="p-4 rounded-lg bg-theme-surface border border-theme">
              <h3 className="font-medium text-theme-primary">Surface Card</h3>
              <p className="text-sm text-theme-secondary mt-1">
                This is a card with surface background
              </p>
            </div>
            
            <div className="p-4 rounded-lg border border-theme" style={{ backgroundColor: 'var(--chatBubbleMe)', color: 'white' }}>
              <h3 className="font-medium">Chat Bubble</h3>
              <p className="text-sm mt-1">
                This is a chat bubble
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTestPage;