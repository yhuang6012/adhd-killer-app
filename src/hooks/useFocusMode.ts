import { useState, useCallback } from 'react';

interface FocusModeOptions {
  initialLine?: number;
  totalLines: number;
  onLineChange?: (line: number) => void;
}

export const useFocusMode = (options: FocusModeOptions) => {
  const { initialLine = 1, totalLines, onLineChange } = options;
  const [currentLine, setCurrentLine] = useState(initialLine);
  const [isEnabled, setIsEnabled] = useState(false);

  const moveToNextLine = useCallback(() => {
    if (currentLine < totalLines) {
      const nextLine = currentLine + 1;
      setCurrentLine(nextLine);
      onLineChange?.(nextLine);
    }
  }, [currentLine, totalLines, onLineChange]);

  const moveToPreviousLine = useCallback(() => {
    if (currentLine > 1) {
      const prevLine = currentLine - 1;
      setCurrentLine(prevLine);
      onLineChange?.(prevLine);
    }
  }, [currentLine, onLineChange]);

  const jumpToLine = useCallback((line: number) => {
    if (line >= 1 && line <= totalLines) {
      setCurrentLine(line);
      onLineChange?.(line);
    }
  }, [totalLines, onLineChange]);

  const toggleFocusMode = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return {
    currentLine,
    isEnabled,
    moveToNextLine,
    moveToPreviousLine,
    jumpToLine,
    toggleFocusMode,
  };
};

export default useFocusMode; 