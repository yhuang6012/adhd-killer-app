import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
import Pdf from 'react-native-pdf';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { usePDF } from '../hooks/usePDF';
import { useTheme } from '../hooks/useTheme';
import { useFont } from '../hooks/useFont';
import { useAccessibility } from '../hooks/useAccessibility';
import { useSettings } from '../contexts/SettingsContext';
import { useTTS } from '../hooks/useTTS';

interface PDFViewerProps {
  filePath: string;
  onPageChange?: (page: number) => void;
  onError?: (error: string) => void;
}

// Extend the Pdf type to include getCurrentPageText method
declare module 'react-native-pdf' {
  interface PdfRef {
    getCurrentPageText(): Promise<string>;
  }
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  filePath,
  onPageChange,
  onError,
}) => {
  const pdfRef = useRef<Pdf>(null);
  const {
    currentPage,
    totalPages,
    isLoading,
    error,
    jumpToPage,
    handleLoadComplete,
    handleError,
  } = usePDF({ filePath, onPageChange, onError });

  const { theme } = useTheme();
  const { fontOptions, getFontStyle } = useFont();
  const { isBionicReadingEnabled, isFocusModeEnabled } = useAccessibility();
  const { settings } = useSettings();
  const {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
  } = useTTS({
    onFinish: () => {
      // Auto-advance to next page when TTS finishes current page
      if (currentPage < totalPages) {
        jumpToPage(currentPage + 1);
      }
    },
  });

  const handlePageChange = useCallback((page: number) => {
    jumpToPage(page);
  }, [jumpToPage]);

  const toggleTTS = useCallback(async () => {
    if (isSpeaking) {
      if (isPaused) {
        await resume();
      } else {
        await pause();
      }
    } else {
      // Start TTS for current page
      if (pdfRef.current) {
        try {
          // Since getCurrentPageText is not a standard method, we'll need to
          // implement text extraction differently or use a different PDF library
          // that supports text extraction
          const text = "PDF text extraction not supported yet";
          await speak(text);
        } catch (error) {
          console.error('Error extracting text:', error);
        }
      }
    }
  }, [isSpeaking, isPaused, speak, pause, resume]);

  useEffect(() => {
    // Stop TTS when component unmounts
    return () => {
      stop();
    };
  }, [stop]);

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      </View>
    );
  }

  const handlePdfError = useCallback((error: object) => {
    const errorMessage = error instanceof Error ? error.message : 'Failed to load PDF';
    handleError(new Error(errorMessage));
  }, [handleError]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
          <Pdf
            ref={pdfRef}
            source={{ uri: filePath }}
            style={styles.pdf}
            page={currentPage}
            scale={1.0}
            spacing={0}
            fitPolicy={0}
            enablePaging={true}
            onPageChanged={handlePageChange}
            onLoadComplete={(numberOfPages) => {
              handleLoadComplete(numberOfPages);
            }}
            onError={handlePdfError}
          />

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => jumpToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <Icon name="chevron-left" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
              onPress={toggleTTS}
            >
              <Icon
                name={isSpeaking ? (isPaused ? 'play-arrow' : 'pause') : 'volume-up'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>

            <Text style={[styles.pageInfo, { color: theme.colors.text }]}>
              {currentPage} / {totalPages}
            </Text>

            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => jumpToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              <Icon name="chevron-right" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'transparent',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  pageInfo: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
});

export default PDFViewer; 