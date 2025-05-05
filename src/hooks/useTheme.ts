import { useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { colors, typography, spacing, borderRadius, shadows } from '../constants/theme';

type ThemeMode = 'light' | 'dark';

export interface Theme {
  colors: typeof colors.light | typeof colors.dark;
  typography: typeof typography;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows.light | typeof shadows.dark;
}

export const useTheme = () => {
  const { settings, updateSettings } = useSettings();
  const systemColorScheme = useColorScheme();

  const getThemeMode = useCallback((): ThemeMode => {
    // If the user has explicitly set a theme, use that
    if (settings.theme) {
      return settings.theme;
    }
    // Otherwise, use the system color scheme, defaulting to light if not available
    return systemColorScheme as ThemeMode || 'light';
  }, [settings.theme, systemColorScheme]);

  const theme: Theme = {
    colors: getThemeMode() === 'dark' ? colors.dark : colors.light,
    typography,
    spacing,
    borderRadius,
    shadows: getThemeMode() === 'dark' ? shadows.dark : shadows.light,
  };

  const toggleTheme = useCallback(async () => {
    const newTheme: ThemeMode = getThemeMode() === 'dark' ? 'light' : 'dark';
    await updateSettings({ theme: newTheme });
  }, [getThemeMode, updateSettings]);

  const setTheme = useCallback(async (mode: ThemeMode) => {
    await updateSettings({ theme: mode });
  }, [updateSettings]);

  return {
    theme,
    isDark: getThemeMode() === 'dark',
    toggleTheme,
    setTheme,
    currentTheme: getThemeMode(),
  };
};

export default useTheme; 