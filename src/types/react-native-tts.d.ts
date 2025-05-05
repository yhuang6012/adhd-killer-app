declare module 'react-native-tts' {
  export interface TTSProgressEvent {
    text: string;
    position: number;
  }

  export interface TTSError {
    message: string;
  }

  export type TTSEventType = 'tts-start' | 'tts-finish' | 'tts-progress' | 'tts-cancel';

  export type TTSEventHandler = {
    'tts-start': () => void;
    'tts-finish': () => void;
    'tts-progress': (event: TTSProgressEvent) => void;
    'tts-cancel': () => void;
  };

  export interface TTS {
    speak(text: string): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    setDefaultLanguage(language: string): Promise<void>;
    setDefaultRate(rate: number): Promise<void>;
    setDefaultPitch(pitch: number): Promise<void>;
    addEventListener<T extends TTSEventType>(
      type: T,
      handler: TTSEventHandler[T]
    ): void;
    removeEventListener<T extends TTSEventType>(
      type: T,
      handler: TTSEventHandler[T]
    ): void;
    removeAllListeners(type: TTSEventType): void;
  }

  const Tts: TTS;
  export default Tts;
} 