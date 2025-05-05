import { useMemo } from 'react';

interface BionicOptions {
  boldRatio?: number; // Percentage of each word to bold (0.0 to 1.0)
  minChars?: number; // Minimum characters in a word to apply bionic reading
}

export const useBionicText = (text: string, options: BionicOptions = {}) => {
  const {
    boldRatio = 0.5, // Default to 50% of each word
    minChars = 3, // Default to words with 3 or more characters
  } = options;

  return useMemo(() => {
    if (!text) return '';

    return text.split(' ').map(word => {
      if (word.length < minChars) return word;

      const boldLength = Math.max(1, Math.ceil(word.length * boldRatio));
      const boldPart = word.slice(0, boldLength);
      const regularPart = word.slice(boldLength);

      return `**${boldPart}**${regularPart}`;
    }).join(' ');
  }, [text, boldRatio, minChars]);
};

export default useBionicText; 