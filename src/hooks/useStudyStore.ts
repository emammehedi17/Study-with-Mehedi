import { useState, useEffect, useCallback } from 'react';
import { STUDY_RESOURCES, SubjectId, getResourcesBySubject } from '../data/resources';

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type ThemeMode = 'light' | 'dark';
export type AccentPalette = 'emerald' | 'violet' | 'blue' | 'amber';

export interface RecentItem {
  id: string;
  openedAt: string;
}

export interface DailyGoalState {
  target: number;
  completedSessions: number;
  dateKey: string;
}

const STORAGE_KEYS = {
  THEME: 'jsc_prep_theme_v1',
  ACCENT: 'jsc_prep_accent_v1',
  BOOKMARKS: 'jsc_prep_bookmarks_v1',
  PROGRESS: 'jsc_prep_progress_v1',
  RECENT: 'jsc_prep_recent_v1',
  DAILY_GOAL: 'jsc_prep_daily_goal_v1',
};

function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function useStudyStore() {
  // 1. Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark') return saved;
      if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // ignore storage errors
    }
    return 'light';
  });

  // 2. Accent palette
  const [accent, setAccentState] = useState<AccentPalette>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCENT) as AccentPalette | null;
      if (saved && ['emerald', 'violet', 'blue', 'amber'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'emerald';
  });

  // 3. Bookmarks
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // 4. Study Progress map
  const [progress, setProgress] = useState<Record<string, ProgressStatus>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // ignore
    }
    return {};
  });

  // 5. Recently opened resources
  const [recentItems, setRecentItems] = useState<RecentItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RECENT);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // 6. Daily Study Goal
  const [dailyGoal, setDailyGoal] = useState<DailyGoalState>(() => {
    const today = getTodayKey();
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DAILY_GOAL);
      if (raw) {
        const parsed = JSON.parse(raw) as DailyGoalState;
        if (parsed && typeof parsed.target === 'number') {
          if (parsed.dateKey === today) {
            return parsed;
          }
          return {
            target: parsed.target,
            completedSessions: 0,
            dateKey: today,
          };
        }
      }
    } catch {
      // ignore
    }
    return {
      target: 3,
      completedSessions: 0,
      dateKey: today,
    };
  });

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACCENT, accent);
    } catch {
      // ignore
    }
  }, [accent]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
    } catch {
      // ignore
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(recentItems));
    } catch {
      // ignore
    }
  }, [recentItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DAILY_GOAL, JSON.stringify(dailyGoal));
    } catch {
      // ignore
    }
  }, [dailyGoal]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setAccent = useCallback((next: AccentPalette) => {
    setAccentState(next);
  }, []);

  const toggleBookmark = useCallback((resourceId: string) => {
    setBookmarks((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [resourceId, ...prev]
    );
  }, []);

  const isBookmarked = useCallback(
    (resourceId: string) => bookmarks.includes(resourceId),
    [bookmarks]
  );

  const getStatus = useCallback(
    (resourceId: string): ProgressStatus => progress[resourceId] || 'not_started',
    [progress]
  );

  const setResourceStatus = useCallback(
    (resourceId: string, status: ProgressStatus) => {
      setProgress((prev) => {
        const previousStatus = prev[resourceId] || 'not_started';
        const next = { ...prev, [resourceId]: status };

        // If newly marked completed, also increment daily goal sessions by 1
        if (previousStatus !== 'completed' && status === 'completed') {
          const today = getTodayKey();
          setDailyGoal((g) => ({
            target: g.target,
            dateKey: today,
            completedSessions: (g.dateKey === today ? g.completedSessions : 0) + 1,
          }));
        }
        return next;
      });
    },
    []
  );

  const recordOpenedResource = useCallback((resourceId: string) => {
    const nowIso = new Date().toISOString();
    setRecentItems((prev) => {
      const filtered = prev.filter((item) => item.id !== resourceId);
      return [{ id: resourceId, openedAt: nowIso }, ...filtered].slice(0, 8);
    });
    // If resource was 'not_started', automatically set it to 'in_progress' so student can easily continue studying,
    // without claiming it is completed.
    setProgress((prev) => {
      if (!prev[resourceId] || prev[resourceId] === 'not_started') {
        return { ...prev, [resourceId]: 'in_progress' };
      }
      return prev;
    });
  }, []);

  const updateDailyTarget = useCallback((target: number) => {
    const clamped = Math.max(1, Math.min(30, target));
    setDailyGoal((prev) => ({
      ...prev,
      target: clamped,
      dateKey: getTodayKey(),
    }));
  }, []);

  const logStudySessionManual = useCallback((delta: number) => {
    const today = getTodayKey();
    setDailyGoal((prev) => {
      const base = prev.dateKey === today ? prev.completedSessions : 0;
      return {
        ...prev,
        dateKey: today,
        completedSessions: Math.max(0, base + delta),
      };
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    setProgress({});
    setDailyGoal((prev) => ({
      ...prev,
      completedSessions: 0,
      dateKey: getTodayKey(),
    }));
  }, []);

  const clearRecentHistory = useCallback(() => {
    setRecentItems([]);
  }, []);

  // Subject progress calculation
  const getSubjectProgressStats = useCallback(
    (subjectId: SubjectId) => {
      const resources = getResourcesBySubject(subjectId);
      const total = resources.length;
      let completed = 0;
      let inProgress = 0;
      resources.forEach((r) => {
        const st = progress[r.id] || 'not_started';
        if (st === 'completed') completed += 1;
        else if (st === 'in_progress') inProgress += 1;
      });
      const notStarted = Math.max(0, total - completed - inProgress);
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { total, completed, inProgress, notStarted, percentage };
    },
    [progress]
  );

  // Overall progress calculation across the 30 unique resources
  const getOverallProgressStats = useCallback(() => {
    const total = STUDY_RESOURCES.length;
    let completed = 0;
    let inProgress = 0;
    STUDY_RESOURCES.forEach((r) => {
      const st = progress[r.id] || 'not_started';
      if (st === 'completed') completed += 1;
      else if (st === 'in_progress') inProgress += 1;
    });
    const notStarted = Math.max(0, total - completed - inProgress);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, notStarted, percentage };
  }, [progress]);

  return {
    theme,
    toggleTheme,
    accent,
    setAccent,
    bookmarks,
    toggleBookmark,
    isBookmarked,
    progress,
    getStatus,
    setResourceStatus,
    recentItems,
    recordOpenedResource,
    clearRecentHistory,
    dailyGoal,
    updateDailyTarget,
    logStudySessionManual,
    resetAllProgress,
    getSubjectProgressStats,
    getOverallProgressStats,
  };
}
