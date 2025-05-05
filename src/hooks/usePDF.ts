import { useState, useEffect, useCallback } from 'react';
import { PDFPage, PDFMetadata, getLastReadPosition, saveLastReadPosition } from '../utils/pdfUtils';
import { useSettings } from '../contexts/SettingsContext';

interface PDFState {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  metadata: PDFMetadata | null;
}

interface UsePDFOptions {
  filePath: string;
  onPageChange?: (page: number) => void;
  onError?: (error: string) => void;
}

export const usePDF = ({ filePath, onPageChange, onError }: UsePDFOptions) => {
  const [state, setState] = useState<PDFState>({
    currentPage: 1,
    totalPages: 0,
    isLoading: true,
    error: null,
    metadata: null,
  });

  const { settings } = useSettings();

  useEffect(() => {
    loadLastPosition();
  }, [filePath]);

  const loadLastPosition = async () => {
    try {
      const lastPage = await getLastReadPosition(filePath);
      if (lastPage) {
        setState(prev => ({ ...prev, currentPage: lastPage }));
      }
    } catch (error) {
      console.error('Error loading last position:', error);
    }
  };

  const handlePageChange = useCallback(async (page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
    await saveLastReadPosition(filePath, page);
    onPageChange?.(page);
  }, [filePath, onPageChange]);

  const handleLoadComplete = useCallback((numberOfPages: number, metadata?: PDFMetadata) => {
    setState(prev => ({
      ...prev,
      totalPages: numberOfPages,
      isLoading: false,
      metadata: metadata || null,
    }));
  }, []);

  const handleError = useCallback((error: Error) => {
    const errorMessage = error.message || 'Failed to load PDF';
    setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    onError?.(errorMessage);
  }, [onError]);

  const jumpToPage = useCallback(async (page: number) => {
    if (page >= 1 && page <= state.totalPages) {
      await handlePageChange(page);
    }
  }, [state.totalPages, handlePageChange]);

  const nextPage = useCallback(async () => {
    if (state.currentPage < state.totalPages) {
      await handlePageChange(state.currentPage + 1);
    }
  }, [state.currentPage, state.totalPages, handlePageChange]);

  const previousPage = useCallback(async () => {
    if (state.currentPage > 1) {
      await handlePageChange(state.currentPage - 1);
    }
  }, [state.currentPage, handlePageChange]);

  return {
    ...state,
    jumpToPage,
    nextPage,
    previousPage,
    handleLoadComplete,
    handleError,
  };
};

export default usePDF; 