import React, { createContext, useContext, useState, useEffect } from "react";
import { DARK, LIGHT, AppTheme } from "@/constants/Colors";

interface ThemeContextValue {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
}

function getAutoMode(): boolean {
  const hour = new Date().getHours();
  // Dark after 6pm (18:00) or before 6am (6:00)
  return hour >= 18 || hour < 6;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DARK,
  isDark: true,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(getAutoMode());
  const [manualOverride, setManualOverride] = useState(false);

  // Re-check every minute only if user hasn't manually overridden
  useEffect(() => {
    if (manualOverride) return;
    const id = setInterval(() => {
      setIsDark(getAutoMode());
    }, 60 * 1000);
    return () => clearInterval(id);
  }, [manualOverride]);

  // Manual override — stops auto-switching for the rest of the session
  const toggleTheme = () => {
    setManualOverride(true);
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme: (isDark ? DARK : LIGHT) as AppTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
