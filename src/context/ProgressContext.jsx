import React, { createContext, useContext, useState, useCallback } from 'react';
import { activityData } from '../data/activityData';

const ProgressContext = createContext(null);

// Build flat chapter list with module info
const allChapters = activityData.modules.flatMap(mod =>
  mod.chapters.map(ch => ({
    moduleId: mod.id,
    moduleSlug: mod.slug,
    moduleTitle: mod.title,
    ...ch,
  }))
);

export function ProgressProvider({ children }) {
  const [completedChapters, setCompletedChapters] = useState(new Set());
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  const markComplete = useCallback((chapterId) => {
    setCompletedChapters(prev => new Set([...prev, chapterId]));
  }, []);

  const isCompleted = useCallback((chapterId) => {
    return completedChapters.has(chapterId);
  }, [completedChapters]);

  const totalChapters = allChapters.length;
  const completedCount = completedChapters.size;
  const progressPercent = Math.round((completedCount / totalChapters) * 100);

  const getChapterByIndex = (idx) => allChapters[idx] || null;
  
  const getIndexByChapterId = (chapterId) =>
    allChapters.findIndex(ch => ch.id === chapterId);

  const getNextChapter = (chapterId) => {
    const idx = getIndexByChapterId(chapterId);
    return idx < allChapters.length - 1 ? allChapters[idx + 1] : null;
  };

  const getPrevChapter = (chapterId) => {
    const idx = getIndexByChapterId(chapterId);
    return idx > 0 ? allChapters[idx - 1] : null;
  };

  return (
    <ProgressContext.Provider value={{
      completedChapters,
      markComplete,
      isCompleted,
      totalChapters,
      completedCount,
      progressPercent,
      allChapters,
      currentChapterIndex,
      setCurrentChapterIndex,
      getNextChapter,
      getPrevChapter,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
