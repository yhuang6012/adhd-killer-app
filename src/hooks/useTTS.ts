import { useState, useEffect, useCallback } from 'react';
import Tts, { TTSProgressEvent } from 'react-native-tts';

interface TTSOptions {
  onStart?: () => void;
  onFinish?: () => void;
  onProgress?: (currentWord: string, currentPosition: number) => void;
  onError?: (error: any) => void;
}

export const useTTS = (options: TTSOptions = {}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(0.5); // 0.0 to 1.0
  const [pitch, setPitch] = useState(1.0); // 0.5 to 2.0

  useEffect(() => {
    const initTTS = async () => {
      try {
        await Tts.setDefaultLanguage('en-US');
        await Tts.setDefaultRate(rate);
        await Tts.setDefaultPitch(pitch);

        Tts.addEventListener('tts-start', () => {
          setIsSpeaking(true);
          setIsPaused(false);
          options.onStart?.();
        });

        Tts.addEventListener('tts-finish', () => {
          setIsSpeaking(false);
          setIsPaused(false);
          options.onFinish?.();
        });

        Tts.addEventListener('tts-progress', (event: TTSProgressEvent) => {
          options.onProgress?.(event.text, event.position);
        });

        Tts.addEventListener('tts-cancel', () => {
          setIsSpeaking(false);
          setIsPaused(false);
        });

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize TTS:', error);
        options.onError?.(error);
      }
    };

    initTTS();

    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-progress');
      Tts.removeAllListeners('tts-cancel');
    };
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!isInitialized) return;

    try {
      await Tts.speak(text);
    } catch (error) {
      console.error('TTS speak error:', error);
      options.onError?.(error);
    }
  }, [isInitialized]);

  const stop = useCallback(async () => {
    if (!isInitialized) return;

    try {
      await Tts.stop();
      setIsSpeaking(false);
      setIsPaused(false);
    } catch (error) {
      console.error('TTS stop error:', error);
      options.onError?.(error);
    }
  }, [isInitialized]);

  const pause = useCallback(async () => {
    if (!isInitialized || !isSpeaking) return;

    try {
      await Tts.pause();
      setIsPaused(true);
    } catch (error) {
      console.error('TTS pause error:', error);
      options.onError?.(error);
    }
  }, [isInitialized, isSpeaking]);

  const resume = useCallback(async () => {
    if (!isInitialized || !isPaused) return;

    try {
      await Tts.resume();
      setIsPaused(false);
    } catch (error) {
      console.error('TTS resume error:', error);
      options.onError?.(error);
    }
  }, [isInitialized, isPaused]);

  const updateRate = useCallback(async (newRate: number) => {
    if (!isInitialized) return;

    try {
      await Tts.setDefaultRate(newRate);
      setRate(newRate);
    } catch (error) {
      console.error('TTS rate update error:', error);
      options.onError?.(error);
    }
  }, [isInitialized]);

  const updatePitch = useCallback(async (newPitch: number) => {
    if (!isInitialized) return;

    try {
      await Tts.setDefaultPitch(newPitch);
      setPitch(newPitch);
    } catch (error) {
      console.error('TTS pitch update error:', error);
      options.onError?.(error);
    }
  }, [isInitialized]);

  return {
    speak,
    stop,
    pause,
    resume,
    updateRate,
    updatePitch,
    isSpeaking,
    isPaused,
    isInitialized,
    rate,
    pitch,
  };
};

export default useTTS; 