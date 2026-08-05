import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setThemeMode = (mode) => {
    setTheme(mode);
  };

  const toggleTheme = () => {
    setThemeMode(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme: setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
