import { useState, useEffect } from "react";
import { Palette, Check } from "lucide-react";

export type ThemeMode = "light" | "dark";
export type ThemeColor = "pink" | "ocean" | "forest" | "sunset" | "lavender" | "midnight";

interface Theme {
  id: ThemeColor;
  name: string;
  preview: string;
  previewDark: string;
}

const themes: Theme[] = [
  { id: "pink", name: "Cotton Candy", preview: "bg-gradient-to-r from-pink-300 to-purple-300", previewDark: "bg-gradient-to-r from-pink-500 to-purple-500" },
  { id: "ocean", name: "Ocean Breeze", preview: "bg-gradient-to-r from-cyan-300 to-blue-300", previewDark: "bg-gradient-to-r from-cyan-500 to-blue-500" },
  { id: "forest", name: "Forest Mint", preview: "bg-gradient-to-r from-emerald-300 to-teal-300", previewDark: "bg-gradient-to-r from-emerald-500 to-teal-500" },
  { id: "sunset", name: "Sunset Glow", preview: "bg-gradient-to-r from-orange-300 to-rose-300", previewDark: "bg-gradient-to-r from-orange-500 to-rose-500" },
  { id: "lavender", name: "Lavender Dreams", preview: "bg-gradient-to-r from-violet-300 to-indigo-300", previewDark: "bg-gradient-to-r from-violet-500 to-indigo-500" },
  { id: "midnight", name: "Midnight Blue", preview: "bg-gradient-to-r from-slate-400 to-blue-400", previewDark: "bg-gradient-to-r from-slate-600 to-blue-600" },
];

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ThemeMode>("light");
  const [colorTheme, setColorTheme] = useState<ThemeColor>("pink");

  useEffect(() => {
    const storedMode = localStorage.getItem("theme-mode") as ThemeMode | null;
    const storedColor = localStorage.getItem("theme-color") as ThemeColor | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialMode = storedMode || (prefersDark ? "dark" : "light");
    const initialColor = storedColor || "pink";
    
    setMode(initialMode);
    setColorTheme(initialColor);
    applyTheme(initialMode, initialColor);
  }, []);

  const applyTheme = (newMode: ThemeMode, newColor: ThemeColor) => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newMode);
    
    // Remove all theme classes
    themes.forEach(t => document.documentElement.classList.remove(`theme-${t.id}`));
    document.documentElement.classList.add(`theme-${newColor}`);
    
    localStorage.setItem("theme-mode", newMode);
    localStorage.setItem("theme-color", newColor);
  };

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    applyTheme(newMode, colorTheme);
  };

  const selectColor = (color: ThemeColor) => {
    setColorTheme(color);
    applyTheme(mode, color);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full bg-muted hover:bg-accent transition-all duration-300 btn-bounce"
        aria-label="Theme settings"
      >
        <Palette className="w-5 h-5 text-foreground" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-2xl shadow-card p-4 min-w-[240px] z-50 animate-scale-in">
            {/* Mode Toggle */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Mode</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { setMode("light"); applyTheme("light", colorTheme); }}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    mode === "light" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  ☀️ Light
                </button>
                <button
                  onClick={() => { setMode("dark"); applyTheme("dark", colorTheme); }}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                    mode === "dark" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  🌙 Dark
                </button>
              </div>
            </div>

            {/* Color Themes */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Color Theme</p>
              <div className="grid grid-cols-2 gap-2">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => selectColor(theme.id)}
                    className={`relative flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                      colorTheme === theme.id 
                        ? "border-primary bg-primary/10" 
                        : "border-transparent bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${mode === "dark" ? theme.previewDark : theme.preview}`} />
                    <span className="text-xs font-medium text-foreground truncate">{theme.name}</span>
                    {colorTheme === theme.id && (
                      <Check className="w-3 h-3 text-primary absolute right-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
