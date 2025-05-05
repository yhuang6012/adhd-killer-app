import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateReadingTime } from '../utils/pdfUtils';

interface ReadingSession {
  startTime: number;
  endTime: number;
  pagesRead: number;
  totalTimeSpent: number; // in seconds
}

interface ReadingStats {
  totalPagesRead: number;
  totalTimeSpent: number; // in seconds
  averageReadingSpeed: number; // words per minute
  lastSessionDate: string;
  sessionsCount: number;
}

interface ReadingProgress {
  filePath: string;
  currentPage: number;
  totalPages: number;
  lastReadTimestamp: number;
  bookmarks: number[];
  notes: { [page: number]: string };
}

const STORAGE_KEYS = {
  STATS: 'reading_stats',
  PROGRESS: (filePath: string) => `reading_progress_${filePath}`,
};

export const useReadingProgress = (filePath: string, totalPages: number) => {
  const [currentSession, setCurrentSession] = useState<ReadingSession | null>(null);
  const [stats, setStats] = useState<ReadingStats>({
    totalPagesRead: 0,
    totalTimeSpent: 0,
    averageReadingSpeed: 0,
    lastSessionDate: '',
    sessionsCount: 0,
  });
  const [progress, setProgress] = useState<ReadingProgress>({
    filePath,
    currentPage: 1,
    totalPages,
    lastReadTimestamp: Date.now(),
    bookmarks: [],
    notes: {},
  });

  // Load saved progress and stats
  useEffect(() => {
    loadProgress();
    loadStats();
  }, [filePath]);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS(filePath));
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading reading progress:', error);
    }
  };

  const loadStats = async () => {
    try {
      const savedStats = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error loading reading stats:', error);
    }
  };

  const saveProgress = async (newProgress: Partial<ReadingProgress>) => {
    try {
      const updatedProgress = { ...progress, ...newProgress };
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROGRESS(filePath),
        JSON.stringify(updatedProgress)
      );
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error saving reading progress:', error);
    }
  };

  const saveStats = async (newStats: Partial<ReadingStats>) => {
    try {
      const updatedStats = { ...stats, ...newStats };
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
      setStats(updatedStats);
    } catch (error) {
      console.error('Error saving reading stats:', error);
    }
  };

  const startSession = useCallback(() => {
    const session: ReadingSession = {
      startTime: Date.now(),
      endTime: 0,
      pagesRead: 0,
      totalTimeSpent: 0,
    };
    setCurrentSession(session);
  }, []);

  const endSession = useCallback(async () => {
    if (!currentSession) return;

    const endTime = Date.now();
    const totalTimeSpent = Math.floor((endTime - currentSession.startTime) / 1000);
    const updatedSession = {
      ...currentSession,
      endTime,
      totalTimeSpent,
    };

    // Update stats
    const newStats: Partial<ReadingStats> = {
      totalPagesRead: stats.totalPagesRead + updatedSession.pagesRead,
      totalTimeSpent: stats.totalTimeSpent + updatedSession.totalTimeSpent,
      lastSessionDate: new Date().toISOString(),
      sessionsCount: stats.sessionsCount + 1,
    };

    await saveStats(newStats);
    setCurrentSession(null);
  }, [currentSession, stats]);

  const updatePageProgress = useCallback(async (page: number) => {
    if (page === progress.currentPage) return;

    // Update current session
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        pagesRead: prev.pagesRead + 1,
      } : null);
    }

    // Update progress
    await saveProgress({
      currentPage: page,
      lastReadTimestamp: Date.now(),
    });
  }, [progress.currentPage, currentSession]);

  const toggleBookmark = useCallback(async (page: number) => {
    const bookmarks = progress.bookmarks.includes(page)
      ? progress.bookmarks.filter(p => p !== page)
      : [...progress.bookmarks, page].sort((a, b) => a - b);

    await saveProgress({ bookmarks });
  }, [progress.bookmarks]);

  const addNote = useCallback(async (page: number, note: string) => {
    const notes = { ...progress.notes, [page]: note };
    await saveProgress({ notes });
  }, [progress.notes]);

  const removeNote = useCallback(async (page: number) => {
    const notes = { ...progress.notes };
    delete notes[page];
    await saveProgress({ notes });
  }, [progress.notes]);

  return {
    progress,
    stats,
    currentSession,
    startSession,
    endSession,
    updatePageProgress,
    toggleBookmark,
    addNote,
    removeNote,
  };
};

export default useReadingProgress; 