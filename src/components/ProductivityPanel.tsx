import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Target,
  Plus,
  Minus,
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Bookmark,
  Clock,
  CheckCircle2,
  ListChecks,
} from 'lucide-react';
import { AccentPalette, DailyGoalState, ThemeMode } from '../hooks/useStudyStore';

interface ProductivityPanelProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  accent: AccentPalette;
  onChangeAccent: (accent: AccentPalette) => void;
  dailyGoal: DailyGoalState;
  onUpdateDailyTarget: (target: number) => void;
  onLogManualSession: (delta: number) => void;
  onQuickNavigate: (
    destination: 'subjects' | 'bookmarks' | 'recent' | 'incomplete' | 'progress'
  ) => void;
  incompleteCount: number;
  bookmarkCount: number;
  recentCount: number;
}

type TimerMode = 'focus25' | 'break5' | 'focus45';

const TIMER_PRESETS: Record<TimerMode, { label: string; seconds: number }> = {
  focus25: { label: 'Focus (25m)', seconds: 25 * 60 },
  break5: { label: 'Break (5m)', seconds: 5 * 60 },
  focus45: { label: 'Deep Study (45m)', seconds: 45 * 60 },
};

function playCompletionTone() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.18); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.65);
  } catch {
    // ignore audio restrictions
  }
}

export const ProductivityPanel: React.FC<ProductivityPanelProps> = ({
  theme,
  onToggleTheme,
  accent,
  onChangeAccent,
  dailyGoal,
  onUpdateDailyTarget,
  onLogManualSession,
  onQuickNavigate,
  incompleteCount,
  bookmarkCount,
  recentCount,
}) => {
  const [timerMode, setTimerMode] = useState<TimerMode>('focus25');
  const [secondsLeft, setSecondsLeft] = useState<number>(TIMER_PRESETS.focus25.seconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [timerFinishedNotice, setTimerFinishedNotice] = useState<string | null>(null);
  const hasInteractedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          if (soundEnabled && hasInteractedRef.current) {
            playCompletionTone();
          }
          setTimerFinishedNotice(
            timerMode === 'break5'
              ? 'Break complete! Ready for your next study session.'
              : 'Focus session complete! Great work on your JSC Scholarship prep.'
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isRunning, soundEnabled, timerMode]);

  const handleSelectMode = (mode: TimerMode) => {
    hasInteractedRef.current = true;
    setIsRunning(false);
    setTimerFinishedNotice(null);
    setTimerMode(mode);
    setSecondsLeft(TIMER_PRESETS[mode].seconds);
  };

  const handleStartPause = () => {
    hasInteractedRef.current = true;
    setTimerFinishedNotice(null);
    if (secondsLeft === 0) {
      setSecondsLeft(TIMER_PRESETS[timerMode].seconds);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleResetTimer = () => {
    hasInteractedRef.current = true;
    setIsRunning(false);
    setTimerFinishedNotice(null);
    setSecondsLeft(TIMER_PRESETS[timerMode].seconds);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const goalPercentage = Math.min(
    100,
    Math.round((dailyGoal.completedSessions / Math.max(1, dailyGoal.target)) * 100)
  );

  return (
    <section
      aria-label="Student Productivity & Quick Tools"
      className="no-print border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/70"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Top Row: Quick Access Shortcuts + Appearance Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          {/* Quick-Access Panel */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Quick Access:
            </span>
            <button
              type="button"
              onClick={() => onQuickNavigate('subjects')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <BookOpen className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>All Subjects (5)</span>
            </button>
            <button
              type="button"
              onClick={() => onQuickNavigate('bookmarks')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <Bookmark className="h-3.5 w-3.5 text-amber-500" />
              <span className="tabular-nums">Bookmarks ({bookmarkCount})</span>
            </button>
            <button
              type="button"
              onClick={() => onQuickNavigate('recent')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <Clock className="h-3.5 w-3.5 text-blue-500" />
              <span className="tabular-nums">Recently Opened ({recentCount})</span>
            </button>
            <button
              type="button"
              onClick={() => onQuickNavigate('incomplete')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <ListChecks className="h-3.5 w-3.5 text-violet-500" />
              <span className="tabular-nums">Incomplete ({incompleteCount})</span>
            </button>
            <button
              type="button"
              onClick={() => onQuickNavigate('progress')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Study Progress</span>
            </button>
          </div>

          {/* Appearance & Theme Controls */}
          <div className="flex items-center gap-3">
            {/* Accent Color Selector */}
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 dark:border-slate-800 dark:bg-slate-800/70">
              <Sparkles className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Accent:</span>
              {(['emerald', 'violet', 'blue', 'amber'] as AccentPalette[]).map((color) => {
                const bgMap: Record<AccentPalette, string> = {
                  emerald: 'bg-emerald-600',
                  violet: 'bg-violet-600',
                  blue: 'bg-blue-600',
                  amber: 'bg-amber-500',
                };
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onChangeAccent(color)}
                    aria-label={`Select ${color} accent theme`}
                    title={`Accent: ${color}`}
                    className={`h-4 w-4 rounded-full transition-transform ${bgMap[color]} ${
                      accent === color
                        ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white dark:ring-offset-slate-900 scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                );
              })}
            </div>

            {/* Light / Dark Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-slate-700" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Row: Pomodoro Study Timer & Daily Study Goal */}
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Pomodoro Study Timer */}
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Pomodoro Study Timer
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                  ·
                </span>
                <div className="flex items-center gap-1" role="group" aria-label="Timer preset">
                  {(Object.keys(TIMER_PRESETS) as TimerMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => handleSelectMode(mode)}
                      className={`rounded-md px-2 py-0.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        timerMode === mode
                          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {TIMER_PRESETS[mode].label}
                    </button>
                  ))}
                </div>
              </div>
              {timerFinishedNotice ? (
                <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {timerFinishedNotice}
                </p>
              ) : (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-bn">
                  মনোযোগ দিয়ে পড়ার জন্য ২৫ মিনিট ফোকাস ও ৫ মিনিট বিরতি ব্যবহার করুন।
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-lg font-bold tracking-tight text-slate-900 tabular-nums dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                aria-live="polite"
              >
                {formattedTime}
              </div>

              <button
                type="button"
                onClick={handleStartPause}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 whitespace-nowrap shrink-0"
              >
                {isRunning ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>{secondsLeft < TIMER_PRESETS[timerMode].seconds && secondsLeft > 0 ? 'Resume' : 'Start'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleResetTimer}
                aria-label="Reset timer"
                title="Reset Timer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  hasInteractedRef.current = true;
                  setSoundEnabled((prev) => !prev);
                }}
                aria-label={soundEnabled ? 'Mute timer sound' : 'Enable timer sound'}
                title={soundEnabled ? 'Sound notification ON' : 'Sound notification OFF'}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {soundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Daily Study Goal */}
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Daily Study Goal (দৈনিক লক্ষ্য)
                  </span>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                  {dailyGoal.completedSessions} / {dailyGoal.target} Completed ({goalPercentage}%)
                </span>
              </div>

              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-600 transition-all duration-200"
                  style={{ width: `${goalPercentage}%` }}
                />
              </div>

              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-bn">
                শুধুমাত্র PDF ওপেন করলেই সম্পন্ন ধরা হয় না—পড়া শেষ করে রিসোর্স “Completed” মার্ক করুন।
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-800 dark:bg-slate-950">
                <span className="text-xs text-slate-500 dark:text-slate-400">Target:</span>
                <button
                  type="button"
                  onClick={() => onUpdateDailyTarget(dailyGoal.target - 1)}
                  aria-label="Decrease daily target"
                  className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-5 text-center font-mono text-xs font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {dailyGoal.target}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateDailyTarget(dailyGoal.target + 1)}
                  aria-label="Increase daily target"
                  className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onLogManualSession(1)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
                title="Log +1 completed study session today"
              >
                <Plus className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Log Session</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
