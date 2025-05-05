import { useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export interface FontOptions {
  family: string;
  size: number;
  lineHeight: number;
  letterSpacing: number;
}

export const FONT_FAMILIES = {
  SYSTEM: 'System',
  OPEN_DYSLEXIC: 'OpenDyslexic',
  LEXEND: 'Lexend',
} as const;

export const FONT_SIZES = {
  SMALL: 14,
  MEDIUM: 16,
  LARGE: 18,
  EXTRA_LARGE: 20,
  HUGE: 24,
} as const;

export const LINE_HEIGHTS = {
  TIGHT: 1.2,
  NORMAL: 1.5,
  RELAXED: 1.75,
  LOOSE: 2,
} as const;

export const LETTER_SPACING = {
  TIGHT: -0.5,
  NORMAL: 0,
  WIDE: 0.5,
  EXTRA_WIDE: 1,
} as const;

const DEFAULT_FONT_OPTIONS: FontOptions = {
  family: FONT_FAMILIES.SYSTEM,
  size: FONT_SIZES.MEDIUM,
  lineHeight: LINE_HEIGHTS.NORMAL,
  letterSpacing: LETTER_SPACING.NORMAL,
};

export const useFont = () => {
  const { settings, updateSettings } = useSettings();

  const getFontOptions = useCallback((): FontOptions => {
    return {
      family: settings.fontFamily || DEFAULT_FONT_OPTIONS.family,
      size: settings.fontSize || DEFAULT_FONT_OPTIONS.size,
      lineHeight: settings.lineSpacing || DEFAULT_FONT_OPTIONS.lineHeight,
      letterSpacing: LETTER_SPACING.NORMAL, // Not stored in settings yet
    };
  }, [settings]);

  const setFontFamily = useCallback(async (family: string) => {
    await updateSettings({ fontFamily: family });
  }, [updateSettings]);

  const setFontSize = useCallback(async (size: number) => {
    await updateSettings({ fontSize: size });
  }, [updateSettings]);

  const setLineHeight = useCallback(async (lineHeight: number) => {
    await updateSettings({ lineSpacing: lineHeight });
  }, [updateSettings]);

  const increaseFontSize = useCallback(async () => {
    const currentSize = settings.fontSize || DEFAULT_FONT_OPTIONS.size;
    const newSize = Math.min(currentSize + 2, FONT_SIZES.HUGE);
    await setFontSize(newSize);
  }, [settings.fontSize, setFontSize]);

  const decreaseFontSize = useCallback(async () => {
    const currentSize = settings.fontSize || DEFAULT_FONT_OPTIONS.size;
    const newSize = Math.max(currentSize - 2, FONT_SIZES.SMALL);
    await setFontSize(newSize);
  }, [settings.fontSize, setFontSize]);

  const getFontStyle = useCallback(() => {
    const options = getFontOptions();
    return {
      fontFamily: options.family,
      fontSize: options.size,
      lineHeight: Math.round(options.size * options.lineHeight),
      letterSpacing: options.letterSpacing,
    };
  }, [getFontOptions]);

  const isSystemFont = useCallback(() => {
    return getFontOptions().family === FONT_FAMILIES.SYSTEM;
  }, [getFontOptions]);

  const isDyslexicFont = useCallback(() => {
    return getFontOptions().family === FONT_FAMILIES.OPEN_DYSLEXIC;
  }, [getFontOptions]);

  const isLexendFont = useCallback(() => {
    return getFontOptions().family === FONT_FAMILIES.LEXEND;
  }, [getFontOptions]);

  return {
    fontOptions: getFontOptions(),
    setFontFamily,
    setFontSize,
    setLineHeight,
    increaseFontSize,
    decreaseFontSize,
    getFontStyle,
    isSystemFont,
    isDyslexicFont,
    isLexendFont,
    FONT_FAMILIES,
    FONT_SIZES,
    LINE_HEIGHTS,
    LETTER_SPACING,
  };
};

export default useFont; 