import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export interface PDFPage {
  pageNumber: number;
  text: string;
}

export interface PDFMetadata {
  title?: string;
  author?: string;
  numberOfPages: number;
}

export const getLocalFilePath = (uri: string): string => {
  if (Platform.OS === 'ios') {
    // iOS file paths are already in the correct format
    return decodeURIComponent(uri.replace('file://', ''));
  }
  // Android file paths need to be processed differently
  return uri;
};

export const saveLastReadPosition = async (filePath: string, page: number): Promise<void> => {
  try {
    const key = `lastPage_${filePath}`;
    await RNFS.writeFile(
      `${RNFS.DocumentDirectoryPath}/${key}.json`,
      JSON.stringify({ page, timestamp: Date.now() }),
      'utf8'
    );
  } catch (error) {
    console.error('Error saving last read position:', error);
  }
};

export const getLastReadPosition = async (filePath: string): Promise<number | null> => {
  try {
    const key = `lastPage_${filePath}`;
    const path = `${RNFS.DocumentDirectoryPath}/${key}.json`;
    const exists = await RNFS.exists(path);

    if (!exists) {
      return null;
    }

    const data = await RNFS.readFile(path, 'utf8');
    const { page } = JSON.parse(data);
    return page;
  } catch (error) {
    console.error('Error getting last read position:', error);
    return null;
  }
};

export const cleanupTempFiles = async (): Promise<void> => {
  try {
    const tempDir = RNFS.TemporaryDirectoryPath;
    const files = await RNFS.readDir(tempDir);
    
    for (const file of files) {
      if (file.name.endsWith('.pdf')) {
        await RNFS.unlink(file.path);
      }
    }
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
  }
};

export const formatPageText = (text: string): string => {
  // Remove extra whitespace and normalize line breaks
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
};

export const extractParagraphs = (text: string): string[] => {
  // Split text into paragraphs based on double line breaks
  return text
    .split(/\n\s*\n/)
    .map(para => para.trim())
    .filter(para => para.length > 0);
};

export const calculateReadingTime = (text: string, wordsPerMinute = 200): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}; 