import { useCallback } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { useSettings } from '../contexts/SettingsContext';
import { useFont } from './useFont';

interface AccessibilityOptions {
  isBoldTextEnabled: boolean;
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isInvertColorsEnabled: boolean;
}

export const useAccessibility = () => {
  const { settings, updateSettings } = useSettings();
  const { setFontSize, FONT_SIZES } = useFont();

  const getAccessibilityOptions = useCallback(async (): Promise<AccessibilityOptions> => {
    const [
      isBoldTextEnabled,
      isScreenReaderEnabled,
      isReduceMotionEnabled,
      isInvertColorsEnabled,
    ] = await Promise.all([
      Platform.OS === 'ios' ? AccessibilityInfo.isBoldTextEnabled() : false,
      AccessibilityInfo.isScreenReaderEnabled(),
      AccessibilityInfo.isReduceMotionEnabled(),
      Platform.OS === 'ios' ? AccessibilityInfo.isInvertColorsEnabled() : false,
    ]);

    return {
      isBoldTextEnabled,
      isScreenReaderEnabled,
      isReduceMotionEnabled,
      isInvertColorsEnabled,
    };
  }, []);

  const adjustFontSizeForAccessibility = useCallback(async () => {
    const { isScreenReaderEnabled } = await getAccessibilityOptions();
    
    // If screen reader is enabled, use larger font size
    if (isScreenReaderEnabled) {
      await setFontSize(FONT_SIZES.EXTRA_LARGE);
    } else {
      await setFontSize(FONT_SIZES.MEDIUM);
    }
  }, [setFontSize, FONT_SIZES]);

  const enableBionicReading = useCallback(async () => {
    await updateSettings({ bionicReading: true });
  }, [updateSettings]);

  const disableBionicReading = useCallback(async () => {
    await updateSettings({ bionicReading: false });
  }, [updateSettings]);

  const enableFocusMode = useCallback(async () => {
    await updateSettings({ focusMode: true });
  }, [updateSettings]);

  const disableFocusMode = useCallback(async () => {
    await updateSettings({ focusMode: false });
  }, [updateSettings]);

  const setupAccessibilityListeners = useCallback(() => {
    const boldTextSubscription = AccessibilityInfo.addEventListener(
      'boldTextChanged',
      async (isEnabled) => {
        if (isEnabled) {
          await enableBionicReading();
        }
      }
    );

    const screenReaderSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      async (isEnabled) => {
        // Adjust settings for screen reader users
        if (isEnabled) {
          await updateSettings({
            fontSize: FONT_SIZES.LARGE,
            lineSpacing: 2.0,
          });
        }
      }
    );

    const reduceMotionSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      async (isEnabled) => {
        // Disable animations when reduce motion is enabled
        await updateSettings({
          // Add animation-related settings here
        });
      }
    );

    return () => {
      boldTextSubscription.remove();
      screenReaderSubscription.remove();
      reduceMotionSubscription.remove();
    };
  }, [updateSettings, enableBionicReading, FONT_SIZES]);

  return {
    getAccessibilityOptions,
    adjustFontSizeForAccessibility,
    enableBionicReading,
    disableBionicReading,
    enableFocusMode,
    disableFocusMode,
    setupAccessibilityListeners,
    isBionicReadingEnabled: settings.bionicReading,
    isFocusModeEnabled: settings.focusMode,
  };
};

export default useAccessibility; 