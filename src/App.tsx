import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  BookOpen,
  Languages,
  Calculator,
  FlaskConical,
  Globe2,
  Search,
  X,
  Bookmark,
  CheckCircle2,
  Clock,
  ArrowUp,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Menu,
  FileText,
  Sparkles,
  GraduationCap,
  FolderOpen,
  Mail,
  Globe,
  Share2,
  Printer,
  AlertTriangle,
} from 'lucide-react';
import {
  SUBJECTS,
  STUDY_RESOURCES,
  CREATOR_BRANDING,
  SubjectId,
  StudyResource,
  ResourceCategory,
  getResourcesBySubject,
  getGlobalDatasetStats,
  getCategoriesForResources,
  getSubjectById,
} from './data/resources';
import { useStudyStore, ProgressStatus, AccentPalette } from './hooks/useStudyStore';
import { ResourceCard } from './components/ResourceCard';
import { PdfPreviewModal } from './components/PdfPreviewModal';
import { ProductivityPanel } from './components/ProductivityPanel';
import { SubjectDetailView } from './components/SubjectDetailView';

const SUBJECT_ICON_MAP = {
  BookOpen,
  Languages,
  Calculator,
  FlaskConical,
  Globe2,
};

const SUBJECT_CARD_THEME: Record<
  SubjectId,
  {
    iconBg: string;
    iconText: string;
    progressFill: string;
    exploreBtn: string;
    hoverBorder: string;
  }
> = {
  bangla: {
    iconBg: 'bg-violet-100 dark:bg-violet-950/70',
    iconText: 'text-violet-700 dark:text-violet-300',
    progressFill: 'bg-violet-600',
    exploreBtn:
      'bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500',
    hoverBorder: 'hover:border-violet-300 dark:hover:border-violet-700',
  },
  english: {
    iconBg: 'bg-blue-100 dark:bg-blue-950/70',
    iconText: 'text-blue-700 dark:text-blue-300',
    progressFill: 'bg-blue-600',
    exploreBtn:
      'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
  },
  math: {
    iconBg: 'bg-emerald-100 dark:bg-emerald-950/70',
    iconText: 'text-emerald-700 dark:text-emerald-300',
    progressFill: 'bg-emerald-600',
    exploreBtn:
      'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
  },
  science: {
    iconBg: 'bg-cyan-100 dark:bg-cyan-950/70',
    iconText: 'text-cyan-700 dark:text-cyan-300',
    progressFill: 'bg-cyan-600',
    exploreBtn:
      'bg-cyan-600 text-white hover:bg-cyan-700 dark:bg-cyan-600 dark:hover:bg-cyan-500',
    hoverBorder: 'hover:border-cyan-300 dark:hover:border-cyan-700',
  },
  bgs: {
    iconBg: 'bg-amber-100 dark:bg-amber-950/70',
    iconText: 'text-amber-700 dark:text-amber-300',
    progressFill: 'bg-amber-600',
    exploreBtn:
      'bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
  },
};

const ACCENT_PRIMARY_CLASSES: Record<
  AccentPalette,
  {
    btn: string;
    text: string;
    bar: string;
  }
> = {
  emerald: {
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    text: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-600',
  },
  violet: {
    btn: 'bg-violet-600 hover:bg-violet-700 text-white',
    text: 'text-violet-600 dark:text-violet-400',
    bar: 'bg-violet-600',
  },
  blue: {
    btn: 'bg-blue-600 hover:bg-blue-700 text-white',
    text: 'text-blue-600 dark:text-blue-400',
    bar: 'bg-blue-600',
  },
  amber: {
    btn: 'bg-amber-600 hover:bg-amber-700 text-white',
    text: 'text-amber-600 dark:text-amber-400',
    bar: 'bg-amber-600',
  },
};

function normalizeQuery(str: string): string {
  return str.toLowerCase().replace(/\s+/g, ' ').trim();
}

export default function App() {
  const {
    theme,
    toggleTheme,
    accent,
    setAccent,
    bookmarks,
    toggleBookmark,
    isBookmarked,
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
  } = useStudyStore();

  // Active Subject Detail View (null means main dashboard hub)
  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId | null>(null);

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Global Search & Filter State
  const [globalQuery, setGlobalQuery] = useState<string>('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<SubjectId | 'ALL'>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ResourceCategory | 'ALL'>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ProgressStatus | 'ALL' | 'INCOMPLETE'>('ALL');

  // Inline PDF Preview Modal State
  const [previewResource, setPreviewResource] = useState<StudyResource | null>(null);

  // Reset Progress Confirmation Modal State
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Back-to-top visibility
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const datasetStats = useMemo(() => getGlobalDatasetStats(), []);
  const overallProgress = getOverallProgressStats();
  const allCategories = useMemo(() => getCategoriesForResources(STUDY_RESOURCES), []);
  const accentStyles = ACCENT_PRIMARY_CLASSES[accent];

  // Scroll listener for floating Back-to-Top button
  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 420);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard shortcut: `/` or `Ctrl+K` / `Cmd+K` focuses global search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveSubjectId(null);
        setTimeout(() => {
          searchInputRef.current?.focus();
          searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        setActiveSubjectId(null);
        setTimeout(() => {
          searchInputRef.current?.focus();
          searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 50);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Scroll to section helper
  const navigateToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    setActiveSubjectId(null);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 40);
  };

  const handleOpenSubject = (subjectId: SubjectId) => {
    setMobileMenuOpen(false);
    setActiveSubjectId(subjectId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickNavigate = (
    destination: 'subjects' | 'bookmarks' | 'recent' | 'incomplete' | 'progress'
  ) => {
    setActiveSubjectId(null);
    if (destination === 'subjects') {
      navigateToSection('subjects-section');
    } else if (destination === 'bookmarks') {
      navigateToSection('bookmarks-section');
    } else if (destination === 'recent') {
      navigateToSection('continue-studying-section');
    } else if (destination === 'incomplete') {
      setSelectedStatusFilter('INCOMPLETE');
      navigateToSection('resources-section');
    } else if (destination === 'progress') {
      navigateToSection('progress-section');
    }
  };

  // Filtered Global Resources (across the 30 unique resources)
  const filteredGlobalResources = useMemo(() => {
    const q = normalizeQuery(globalQuery);
    return STUDY_RESOURCES.filter((res) => {
      // Subject filter (check both primary subjectId and sharedSubjects)
      if (selectedSubjectFilter !== 'ALL') {
        const belongsToSubject =
          res.subjectId === selectedSubjectFilter ||
          Boolean(res.sharedSubjects && res.sharedSubjects.includes(selectedSubjectFilter));
        if (!belongsToSubject) return false;
      }

      // Category filter
      if (selectedCategoryFilter !== 'ALL' && res.category !== selectedCategoryFilter) {
        return false;
      }

      // Status filter
      const st = getStatus(res.id);
      if (selectedStatusFilter === 'INCOMPLETE') {
        if (st === 'completed') return false;
      } else if (selectedStatusFilter !== 'ALL') {
        if (st !== selectedStatusFilter) return false;
      }

      // Text query
      if (!q) return true;
      const subject = getSubjectById(res.subjectId);
      const sharedNames = (res.sharedSubjects || [])
        .map((sid) => {
          const s = getSubjectById(sid);
          return s ? `${s.nameBn} ${s.nameEn}` : '';
        })
        .join(' ');

      const haystack = normalizeQuery(
        [
          res.title,
          res.category,
          res.questionRef || '',
          `question ${res.serialNumber}`,
          `#${res.serialNumber}`,
          subject ? `${subject.nameBn} ${subject.nameEn}` : '',
          sharedNames,
          ...res.keywords,
        ].join(' ')
      );
      return haystack.includes(q);
    });
  }, [
    globalQuery,
    selectedSubjectFilter,
    selectedCategoryFilter,
    selectedStatusFilter,
    getStatus,
  ]);

  // Bookmarked Resource Objects
  const bookmarkedResources = useMemo(
    () =>
      bookmarks
        .map((id) => STUDY_RESOURCES.find((r) => r.id === id))
        .filter((r): r is StudyResource => Boolean(r)),
    [bookmarks]
  );

  // Top 5 Recently Opened Resource Objects
  const recentResources = useMemo(
    () =>
      recentItems
        .slice(0, 5)
        .map((item) => {
          const res = STUDY_RESOURCES.find((r) => r.id === item.id);
          return res ? { resource: res, openedAt: item.openedAt } : null;
        })
        .filter((x): x is { resource: StudyResource; openedAt: string } => Boolean(x)),
    [recentItems]
  );

  // In-Progress Resources for "Continue Studying"
  const inProgressResources = useMemo(
    () => STUDY_RESOURCES.filter((r) => getStatus(r.id) === 'in_progress'),
    [getStatus]
  );

  const handleClearGlobalFilters = () => {
    setGlobalQuery('');
    setSelectedSubjectFilter('ALL');
    setSelectedCategoryFilter('ALL');
    setSelectedStatusFilter('ALL');
  };

  const activeSubject = activeSubjectId ? getSubjectById(activeSubjectId) : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* =========================================================
          A. HEADER & NAVIGATION (Strict 3-Zone Top Bar Contract)
         ========================================================= */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 no-print">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveSubjectId(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0"
          >
            JSC Scholarship Exam Prep
          </a>

          {/* Zone 2: 5 concise single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <button
              type="button"
              onClick={() => navigateToSection('hero-section')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('subjects-section')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Subjects
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('resources-section')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Resources
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('bookmarks-section')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Bookmarks
            </button>
            <button
              type="button"
              onClick={() => navigateToSection('progress-section')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Progress
            </button>
          </nav>

          {/* Zone 3: 1 primary action on desktop + mobile menu toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveSubjectId(null);
                setTimeout(() => {
                  searchInputRef.current?.focus();
                  searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 50);
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${accentStyles.btn}`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search Resources</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => navigateToSection('hero-section')}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>Home</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('subjects-section')}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>All Subjects (৫টি বিষয়)</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('resources-section')}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>Study Resources (৩০টি ফাইল)</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('bookmarks-section')}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>Bookmarks ({bookmarks.length})</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('progress-section')}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>Study Progress ({overallProgress.percentage}%)</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('about-section')}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span>About Emam Mehedi</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          STUDENT PRODUCTIVITY & APPEARANCE TOOLBAR
         ========================================================= */}
      <ProductivityPanel
        theme={theme}
        onToggleTheme={toggleTheme}
        accent={accent}
        onChangeAccent={setAccent}
        dailyGoal={dailyGoal}
        onUpdateDailyTarget={updateDailyTarget}
        onLogManualSession={logStudySessionManual}
        onQuickNavigate={handleQuickNavigate}
        incompleteCount={overallProgress.notStarted + overallProgress.inProgress}
        bookmarkCount={bookmarks.length}
        recentCount={recentResources.length}
      />

      {/* =========================================================
          MAIN CONTENT: EITHER DEDICATED SUBJECT VIEW OR MAIN HUB
         ========================================================= */}
      <main id="top" className="flex-1">
        {activeSubject ? (
          <SubjectDetailView
            subject={activeSubject}
            isBookmarked={isBookmarked}
            getStatus={getStatus}
            subjectStats={getSubjectProgressStats(activeSubject.id)}
            onBackToSubjects={() => {
              setActiveSubjectId(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onToggleBookmark={toggleBookmark}
            onChangeStatus={setResourceStatus}
            onRecordOpened={recordOpenedResource}
            onPreview={(res) => setPreviewResource(res)}
            onSwitchToGlobalSearch={(query) => {
              setActiveSubjectId(null);
              setGlobalQuery(query);
              setSelectedSubjectFilter('ALL');
              setTimeout(() => {
                const el = document.getElementById('resources-section');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }}
          />
        ) : (
          <>
            {/* =========================================================
                B. HERO SECTION & C. OVERVIEW STATISTICS
               ========================================================= */}
            <section
              id="hero-section"
              className="border-b border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900"
            >
              <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14 lg:px-8">
                <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
                  {/* Left Column: Main Heading, Bengali Intro, Creator Credit & Action Buttons */}
                  <div className="flex flex-col justify-between lg:col-span-7">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <GraduationCap className={`h-4 w-4 ${accentStyles.text}`} />
                        <span>Junior Scholarship Examination Bangladesh</span>
                        <span aria-hidden="true">·</span>
                        <span>Prepared and organized by {CREATOR_BRANDING.creatorName}</span>
                      </div>

                      <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                        JSC Scholarship Exam Prep
                      </h1>

                      <p className={`mt-2 text-base sm:text-lg font-semibold ${accentStyles.text}`}>
                        Your Complete Study Hub for Scholarship Success
                      </p>

                      <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 font-bn">
                        জেএসসি বৃত্তি পরীক্ষার প্রস্তুতির জন্য প্রয়োজনীয় সকল গুরুত্বপূর্ণ নোট, বহুনির্বাচনি প্রশ্ন, সৃজনশীল প্রশ্ন, সমাধান, বিগত সালের প্রশ্নপত্র এবং মডেল টেস্ট—সবকিছু এক জায়গায়।
                      </p>
                    </div>

                    {/* Prominent Action Buttons */}
                    <div className="mt-8 flex flex-wrap items-center gap-3 no-print">
                      <button
                        type="button"
                        onClick={() => navigateToSection('subjects-section')}
                        className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-xs transition-colors whitespace-nowrap shrink-0 ${accentStyles.btn}`}
                      >
                        <span>Explore All Subjects</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateToSection('continue-studying-section')}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
                      >
                        <Clock className="h-4 w-4 text-amber-500" />
                        <span>Continue Studying</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateToSection('resources-section')}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200/70 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Browse Study Materials</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Interactive Visual Study Hub Graphic & Quick Subject Jump */}
                  <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/80 p-6 dark:border-slate-800 dark:bg-slate-950/70">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-3.5 dark:border-slate-800">
                        <div>
                          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Interactive Subject Syllabus Matrix
                          </h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-bn">
                            যেকোনো বিষয়ে ক্লিক করে সরাসরি অধ্যায়ভিত্তিক ও প্রশ্নভিত্তিক PDF খুলুন
                          </p>
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 tabular-nums">
                          {overallProgress.percentage}% Done
                        </span>
                      </div>

                      {/* Subject Quick Matrix */}
                      <div className="mt-4 space-y-2.5">
                        {SUBJECTS.map((subj) => {
                          const st = getSubjectProgressStats(subj.id);
                          const IconComp = SUBJECT_ICON_MAP[subj.icon];
                          const themeColors = SUBJECT_CARD_THEME[subj.id];
                          return (
                            <button
                              key={subj.id}
                              type="button"
                              onClick={() => handleOpenSubject(subj.id)}
                              className="group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-left transition-colors hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${themeColors.iconBg} ${themeColors.iconText}`}
                                >
                                  <IconComp className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100 font-bn">
                                    {subj.nameBn}{' '}
                                    <span className="font-normal text-xs text-slate-500 dark:text-slate-400">
                                      ({subj.nameEn})
                                    </span>
                                  </p>
                                  <div className="mt-1 h-1.5 w-32 sm:w-40 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                    <div
                                      className={`h-full rounded-full ${themeColors.progressFill}`}
                                      style={{ width: `${st.percentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-mono text-xs font-medium text-slate-600 dark:text-slate-400 tabular-nums">
                                  {st.completed}/{st.total} PDFs
                                </span>
                                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Prepared by Emam Mehedi</span>
                      <span className="font-mono tabular-nums">2025–2026 Exam Syllabus</span>
                    </div>
                  </div>
                </div>

                {/* C. Overview Statistics Strip (Full-Width Row Below Hero Split) */}
                <div
                  aria-label="Study Resource Overview Statistics"
                  className="mt-10 grid grid-cols-2 gap-4 pt-8 border-t border-slate-200/80 sm:grid-cols-4 dark:border-slate-800"
                >
                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Total Subjects (মোট বিষয়)
                    </p>
                    <p className="mt-1 font-mono text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {datasetStats.totalSubjects}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-bn">
                      বাংলা · ইংরেজি · গণিত · বিজ্ঞান · বাওবি
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Total Study Resources (মোট রিসোর্স)
                    </p>
                    <p className="mt-1 font-mono text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {datasetStats.totalUniqueResources}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {datasetStats.totalSubjectAssignments} subject-assigned items (1 shared)
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Total PDF Resources (মোট PDF ফাইল)
                    </p>
                    <p className="mt-1 font-mono text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {datasetStats.totalPdfResources}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Direct Google Drive study files
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/50">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Bookmarked Resources (বুকমার্ক)
                    </p>
                    <p className="mt-1 font-mono text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {bookmarks.length}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {overallProgress.completed} of {datasetStats.totalUniqueResources} marked completed
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================================
                D. SUBJECT SELECTION DASHBOARD
               ========================================================= */}
            <section
              id="subjects-section"
              aria-labelledby="subjects-heading"
              className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className={`text-xs font-semibold ${accentStyles.text}`}>
                    Subject-Wise Preparation Hub
                  </p>
                  <h2
                    id="subjects-heading"
                    className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-bn"
                  >
                    বিষয়ভিত্তিক ড্যাশবোর্ড (Select a Subject)
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 font-bn">
                    প্রতিটি বিষয়ের নিজস্ব পেজে মানবণ্টন, প্রশ্নকাঠামো, বহুনির্বাচনি, সৃজনশীল ও মডেল টেস্ট আলাদাভাবে সাজানো আছে।
                  </p>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  <span>5 Subjects</span>
                  <span aria-hidden="true"> · </span>
                  <span>30 Unique PDFs</span>
                </div>
              </div>

              {/* Responsive Subject Grid: 4 columns on wide screens, 2 on tablets, 1 on mobile */}
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {SUBJECTS.map((subject) => {
                  const IconComp = SUBJECT_ICON_MAP[subject.icon];
                  const cardTheme = SUBJECT_CARD_THEME[subject.id];
                  const stats = getSubjectProgressStats(subject.id);

                  return (
                    <article
                      key={subject.id}
                      className={`flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-150 dark:border-slate-800 dark:bg-slate-900 ${cardTheme.hoverBorder}`}
                    >
                      <div>
                        {/* Icon & Resource count */}
                        <div className="flex items-center justify-between gap-3">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${cardTheme.iconBg} ${cardTheme.iconText}`}
                            aria-hidden="true"
                          >
                            <IconComp className="h-6 w-6" />
                          </div>
                          <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums">
                            {stats.total} Resources
                          </span>
                        </div>

                        {/* Bengali & English Subject Name */}
                        <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100 font-bn">
                          {subject.nameBn}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {subject.nameEn}
                        </p>

                        {/* Short Description */}
                        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-bn">
                          {subject.descriptionBn}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                        {/* Subject Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Progress</span>
                            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                              {stats.completed}/{stats.total} ({stats.percentage}%)
                            </span>
                          </div>
                          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className={`h-full rounded-full transition-all duration-200 ${cardTheme.progressFill}`}
                              style={{ width: `${stats.percentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Prominent Explore Subject Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenSubject(subject.id)}
                          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${cardTheme.exploreBtn}`}
                        >
                          <span className="font-bn">বিষয়টি দেখুন · Explore Subject</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* =========================================================
                CONTINUE STUDYING & RECENTLY OPENED RESOURCES
               ========================================================= */}
            <section
              id="continue-studying-section"
              aria-labelledby="continue-studying-heading"
              className="border-y border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 no-print"
            >
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className={`text-xs font-semibold ${accentStyles.text}`}>
                      Resume Preparation
                    </p>
                    <h2
                      id="continue-studying-heading"
                      className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-bn"
                    >
                      পড়া চালিয়ে যান ও সাম্প্রতিক খোলা ফাইল (Continue Studying)
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 font-bn">
                      আপনার সর্বশেষ ওপেন করা ৫টি PDF এবং চলমান (In Progress) রিসোর্সসমূহ।
                    </p>
                  </div>

                  {recentResources.length > 0 && (
                    <button
                      type="button"
                      onClick={clearRecentHistory}
                      className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap shrink-0"
                    >
                      Clear Recent History
                    </button>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                  {/* Left 6 cols: 5 Most Recently Opened Resources */}
                  <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Recently Opened Resources (সর্বশেষ ৫টি ফাইল)
                      </h3>
                      <span className="font-mono text-xs text-slate-500 tabular-nums">
                        {recentResources.length} / 5
                      </span>
                    </div>

                    {recentResources.length > 0 ? (
                      <ul className="mt-3 divide-y divide-slate-200/70 dark:divide-slate-800">
                        {recentResources.map(({ resource }) => {
                          const subj = getSubjectById(resource.subjectId);
                          return (
                            <li
                              key={resource.id}
                              className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="font-mono tabular-nums">
                                    #{String(resource.serialNumber).padStart(2, '0')}
                                  </span>
                                  {subj && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="font-bn">{subj.nameBn}</span>
                                    </>
                                  )}
                                  <span aria-hidden="true">·</span>
                                  <span className="font-bn">{resource.category}</span>
                                </div>
                                <p className="mt-0.5 truncate text-sm font-semibold text-slate-900 dark:text-slate-100 font-bn">
                                  {resource.title}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    recordOpenedResource(resource.id);
                                    setPreviewResource(resource);
                                  }}
                                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 whitespace-nowrap shrink-0"
                                >
                                  Preview
                                </button>
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => recordOpenedResource(resource.id)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 whitespace-nowrap shrink-0"
                                >
                                  <span>Reopen</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="py-8 text-center">
                        <Clock className="mx-auto h-8 w-8 text-slate-400" />
                        <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300 font-bn">
                          এখনো কোনো PDF ওপেন করা হয়নি
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-bn">
                          যেকোনো রিসোর্সের “Open PDF” বা “Preview” বাটনে ক্লিক করলে সেটি এখানে সংরক্ষিত থাকবে।
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right 6 cols: In-Progress / Unfinished Resources */}
                  <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50/60 p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        In-Progress Study Materials (চলমান পাঠ)
                      </h3>
                      <span className="font-mono text-xs text-slate-500 tabular-nums">
                        {inProgressResources.length} Active
                      </span>
                    </div>

                    {inProgressResources.length > 0 ? (
                      <ul className="mt-3 divide-y divide-slate-200/70 dark:divide-slate-800">
                        {inProgressResources.slice(0, 5).map((resource) => {
                          const subj = getSubjectById(resource.subjectId);
                          return (
                            <li
                              key={resource.id}
                              className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="font-mono tabular-nums">
                                    #{String(resource.serialNumber).padStart(2, '0')}
                                  </span>
                                  {subj && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="font-bn">{subj.nameBn}</span>
                                    </>
                                  )}
                                  <span aria-hidden="true">·</span>
                                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                                    In Progress
                                  </span>
                                </div>
                                <p className="mt-0.5 truncate text-sm font-semibold text-slate-900 dark:text-slate-100 font-bn">
                                  {resource.title}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setResourceStatus(resource.id, 'completed')}
                                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 whitespace-nowrap shrink-0"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>Mark Done</span>
                                </button>
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => recordOpenedResource(resource.id)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 whitespace-nowrap shrink-0"
                                >
                                  <span>Open PDF</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="py-8 text-center">
                        <Sparkles className="mx-auto h-8 w-8 text-slate-400" />
                        <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300 font-bn">
                          কোনো ফাইল “In Progress” তালিকায় নেই
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-bn">
                          পড়ার সময় যেকোনো রিসোর্স “In Progress” সিলেক্ট করলে অথবা নতুন PDF ওপেন করলে এখানে দেখা যাবে।
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================================
                8. GLOBAL SEARCH & ALL STUDY RESOURCES EXPLORER
               ========================================================= */}
            <section
              id="resources-section"
              aria-labelledby="resources-heading"
              className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className={`text-xs font-semibold ${accentStyles.text}`}>
                    Complete Digital Library (30 Unique PDFs)
                  </p>
                  <h2
                    id="resources-heading"
                    className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-bn"
                  >
                    সকল স্টাডি রিসোর্স ও গ্লোবাল সার্চ (All Study Resources)
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 font-bn">
                    বাংলা বা ইংরেজি শিরোনাম, বিষয়, ক্যাটাগরি বা প্রশ্ন নম্বর (যেমন: Q8, Question 12, নির্মিতি, MCQ) লিখে সার্চ করুন।
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 whitespace-nowrap shrink-0 self-start sm:self-auto"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Resource Directory</span>
                </button>
              </div>

              {/* Search & Filter Controls Box */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 no-print">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Search Input with keyboard shortcut hint */}
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      ref={searchInputRef}
                      type="search"
                      value={globalQuery}
                      onChange={(e) => setGlobalQuery(e.target.value)}
                      placeholder="Search by Bengali/English title, subject, category, or Question No. (Press '/' or Ctrl+K)..."
                      aria-label="Search study resources across all subjects"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-20 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-500"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {globalQuery ? (
                        <button
                          type="button"
                          onClick={() => setGlobalQuery('')}
                          aria-label="Clear search query"
                          className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        >
                          Clear
                        </button>
                      ) : (
                        <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[11px] text-slate-400 dark:border-slate-700 dark:bg-slate-900">
                          /
                        </kbd>
                      )}
                    </div>
                  </div>

                  {/* Study Status Filter */}
                  <div
                    className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800/80"
                    role="group"
                    aria-label="Filter resources by completion status"
                  >
                    {(
                      [
                        { id: 'ALL', label: 'All' },
                        { id: 'INCOMPLETE', label: 'Incomplete' },
                        { id: 'in_progress', label: 'In Progress' },
                        { id: 'completed', label: 'Completed' },
                      ] as const
                    ).map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSelectedStatusFilter(st.id)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          selectedStatusFilter === st.id
                            ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Filters */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
                  <span className="mr-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    Subject:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSubjectFilter('ALL')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      selectedSubjectFilter === 'ALL'
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300'
                    }`}
                  >
                    All Subjects (30)
                  </button>
                  {SUBJECTS.map((subj) => {
                    const count = getResourcesBySubject(subj.id).length;
                    return (
                      <button
                        key={subj.id}
                        type="button"
                        onClick={() => setSelectedSubjectFilter(subj.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors font-bn whitespace-nowrap shrink-0 ${
                          selectedSubjectFilter === subj.id
                            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                            : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300'
                        }`}
                      >
                        {subj.nameBn} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Category Filters */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      Category:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategoryFilter('ALL')}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        selectedCategoryFilter === 'ALL'
                          ? accentStyles.btn
                          : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300'
                      }`}
                    >
                      All Categories
                    </button>
                    {allCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors font-bn whitespace-nowrap shrink-0 ${
                          selectedCategoryFilter === cat
                            ? accentStyles.btn
                            : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {(globalQuery ||
                    selectedSubjectFilter !== 'ALL' ||
                    selectedCategoryFilter !== 'ALL' ||
                    selectedStatusFilter !== 'ALL') && (
                    <button
                      type="button"
                      onClick={handleClearGlobalFilters}
                      className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400 whitespace-nowrap shrink-0"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Search Result Count Bar */}
              <div className="mt-5 mb-4 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span className="tabular-nums">
                  Showing{' '}
                  <strong className="font-semibold text-slate-900 dark:text-slate-100">
                    {filteredGlobalResources.length}
                  </strong>{' '}
                  of{' '}
                  <strong className="font-semibold text-slate-900 dark:text-slate-100">
                    {STUDY_RESOURCES.length}
                  </strong>{' '}
                  unique study resources
                </span>
                {selectedSubjectFilter !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => handleOpenSubject(selectedSubjectFilter)}
                    className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                  >
                    Open Dedicated Subject Page →
                  </button>
                )}
              </div>

              {/* Resource Cards Grid */}
              {filteredGlobalResources.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredGlobalResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      isBookmarked={isBookmarked(resource.id)}
                      status={getStatus(resource.id)}
                      showSubjectName={true}
                      onToggleBookmark={toggleBookmark}
                      onChangeStatus={setResourceStatus}
                      onRecordOpened={recordOpenedResource}
                      onPreview={(res) => setPreviewResource(res)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                  <FolderOpen className="mx-auto h-10 w-10 text-slate-400" />
                  <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
                    No matching study resources found
                  </h3>
                  <p className="mt-1 max-w-md mx-auto text-xs text-slate-500 dark:text-slate-400 font-bn">
                    আপনার সার্চ কিওয়ার্ড বা নির্বাচিত ফিল্টারের সাথে কোনো রিসোর্স মেলেনি। অনুগ্রহ করে ফিল্টার ক্লিয়ার করে আবার চেষ্টা করুন।
                  </p>
                  <button
                    type="button"
                    onClick={handleClearGlobalFilters}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Clear All Filters</span>
                  </button>
                </div>
              )}
            </section>

            {/* =========================================================
                10. MY BOOKMARKS SECTION
               ========================================================= */}
            <section
              id="bookmarks-section"
              aria-labelledby="bookmarks-heading"
              className="border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 no-print"
            >
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <p className={`text-xs font-semibold ${accentStyles.text}`}>
                      Saved For Quick Revision
                    </p>
                    <h2
                      id="bookmarks-heading"
                      className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-bn"
                    >
                      আমার বুকমার্কসমূহ (My Bookmarks — {bookmarkedResources.length})
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 font-bn">
                      পরীক্ষার আগে দ্রুত রিভিশন দেওয়ার জন্য আপনার গুরুত্বপূর্ণ PDF রিসোর্সগুলো এখানে সংরক্ষিত থাকে।
                    </p>
                  </div>
                </div>

                {bookmarkedResources.length > 0 ? (
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {bookmarkedResources.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        isBookmarked={true}
                        status={getStatus(resource.id)}
                        showSubjectName={true}
                        onToggleBookmark={toggleBookmark}
                        onChangeStatus={setResourceStatus}
                        onRecordOpened={recordOpenedResource}
                        onPreview={(res) => setPreviewResource(res)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-10 text-center dark:border-slate-800 dark:bg-slate-900">
                    <Bookmark className="mx-auto h-9 w-9 text-slate-400" />
                    <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100 font-bn">
                      এখনো কোনো রিসোর্স বুকমার্ক করা হয়নি
                    </h3>
                    <p className="mt-1 max-w-md mx-auto text-xs text-slate-500 dark:text-slate-400 font-bn">
                      যেকোনো রিসোর্স কার্ডের ডানপাশের বুকমার্ক আইকনে ক্লিক করলে সেটি এই তালিকায় যুক্ত হবে এবং ব্রাউজারে সেভ থাকবে।
                    </p>
                    <button
                      type="button"
                      onClick={() => navigateToSection('resources-section')}
                      className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                    >
                      <span>Browse Resources to Bookmark</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* =========================================================
                11. STUDY PROGRESS TRACKER
               ========================================================= */}
            <section
              id="progress-section"
              aria-labelledby="progress-heading"
              className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center dark:border-slate-800">
                  <div>
                    <p className={`text-xs font-semibold ${accentStyles.text}`}>
                      Preparation Analytics
                    </p>
                    <h2
                      id="progress-heading"
                      className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-bn"
                    >
                      স্টাডি প্রোগ্রেস ট্র্যাকার (Study Progress Tracker)
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-bn">
                      নোট: আপনার স্টাডি প্রোগ্রেস ও বুকমার্ক বর্তমান ব্রাউজারের LocalStorage-এ সংরক্ষিত থাকে (অন্য ডিভাইসে স্বয়ংক্রিয়ভাবে সিঙ্ক হয় না)।
                    </p>
                  </div>

                  {/* Reset Progress Control with Inline Confirmation */}
                  <div className="no-print shrink-0">
                    {!showResetConfirm ? (
                      <button
                        type="button"
                        onClick={() => setShowResetConfirm(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-950/50 dark:hover:text-red-300 whitespace-nowrap shrink-0"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset Progress</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 p-2 dark:border-red-900/70 dark:bg-red-950/50">
                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                        <span className="text-xs font-medium text-red-800 dark:text-red-200">
                          Reset all study progress?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            resetAllProgress();
                            setShowResetConfirm(false);
                          }}
                          className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 whitespace-nowrap shrink-0"
                        >
                          Confirm Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowResetConfirm(false)}
                          className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 whitespace-nowrap shrink-0"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="mt-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Overall Scholarship Exam Readiness
                      </span>
                      <span className="ml-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                        ({overallProgress.completed} of {overallProgress.total} unique resources completed)
                      </span>
                    </div>
                    <span className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      {overallProgress.percentage}%
                    </span>
                  </div>

                  <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${accentStyles.bar}`}
                      style={{ width: `${overallProgress.percentage}%` }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 tabular-nums">
                    <span>Completed: {overallProgress.completed}</span>
                    <span aria-hidden="true">·</span>
                    <span>In Progress: {overallProgress.inProgress}</span>
                    <span aria-hidden="true">·</span>
                    <span>Not Started: {overallProgress.notStarted}</span>
                  </div>
                </div>

                {/* Subject-by-Subject Progress Table / Cards */}
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {SUBJECTS.map((subj) => {
                    const st = getSubjectProgressStats(subj.id);
                    const themeColors = SUBJECT_CARD_THEME[subj.id];
                    return (
                      <div
                        key={subj.id}
                        className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-bn">
                              {subj.nameBn}
                            </h3>
                            <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                              {st.percentage}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {subj.nameEn}
                          </p>
                        </div>

                        <div className="mt-4">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                            <div
                              className={`h-full rounded-full ${themeColors.progressFill}`}
                              style={{ width: `${st.percentage}%` }}
                            />
                          </div>
                          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                            <span>{st.completed}/{st.total} Done</span>
                            <button
                              type="button"
                              onClick={() => handleOpenSubject(subj.id)}
                              className="font-medium text-slate-800 hover:underline dark:text-slate-200 no-print"
                            >
                              Open →
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* =========================================================
                16. ABOUT THE CREATOR SECTION
               ========================================================= */}
            <section
              id="about-section"
              aria-labelledby="about-heading"
              className="border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 no-print"
            >
              <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-8">
                    <p className={`text-xs font-semibold ${accentStyles.text}`}>
                      About the Creator
                    </p>
                    <h2
                      id="about-heading"
                      className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
                    >
                      Created & Organized by {CREATOR_BRANDING.creatorName}
                    </h2>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                      JSC Scholarship Exam Prep by Emam Mehedi is an educational initiative designed to make scholarship-exam preparation more organized, accessible, and convenient. The platform brings together subject-wise learning resources, practice materials, and model tests in one place.
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-bn">
                      জেএসসি বৃত্তি পরীক্ষার্থীদের প্রস্তুতি আরও সহজ, গোছানো এবং কার্যকর করতে ৫টি বিষয়ের সকল প্রয়োজনীয় পিডিএফ নোট, প্রশ্নকাঠামো ও মডেল টেস্ট এক প্ল্যাটফর্মে উপস্থাপন করা হয়েছে।
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <a
                        href={CREATOR_BRANDING.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Facebook Profile</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <a
                        href={`mailto:${CREATOR_BRANDING.email}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
                      >
                        <Mail className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{CREATOR_BRANDING.email}</span>
                      </a>

                      <a
                        href={CREATOR_BRANDING.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
                      >
                        <Globe className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                        <span>Visit Class Caddy Website</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-950/60">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      More from {CREATOR_BRANDING.creatorName} (Class Caddy)
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Verified educational portals and resources by Emam Mehedi:
                    </p>
                    <ul className="mt-4 space-y-2.5 text-xs">
                      <li>
                        <a
                          href={CREATOR_BRANDING.classCaddyLinks.home}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white px-3 py-2 font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                        >
                          <span>Class Caddy — Home</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </a>
                      </li>
                      <li>
                        <a
                          href={CREATOR_BRANDING.classCaddyLinks.studyPlan}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white px-3 py-2 font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                        >
                          <span>Class Caddy — Study Plan</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </a>
                      </li>
                      <li>
                        <a
                          href={CREATOR_BRANDING.classCaddyLinks.archives}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white px-3 py-2 font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                        >
                          <span>Class Caddy — Archives</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </a>
                      </li>
                      <li>
                        <a
                          href={CREATOR_BRANDING.classCaddyLinks.about}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white px-3 py-2 font-medium text-slate-700 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
                        >
                          <span>Class Caddy — About & Contact</span>
                          <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* =========================================================
          15. PROFESSIONAL FOOTER
         ========================================================= */}
      <footer className="border-t border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 no-print">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
            {/* Brand & Bengali Description */}
            <div className="lg:col-span-4">
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                JSC Scholarship Exam Prep by Emam Mehedi
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-bn">
                জেএসসি বৃত্তি পরীক্ষার প্রস্তুতির জন্য প্রয়োজনীয় সকল গুরুত্বপূর্ণ নোট, বহুনির্বাচনি প্রশ্ন, সৃজনশীল প্রশ্ন, সমাধান, বিগত সালের প্রশ্নপত্র এবং মডেল টেস্ট—সবকিছু এক জায়গায়।
              </p>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                An independent educational study hub created by Emam Mehedi to help students organize their preparation for the JSC Scholarship Examination.
              </p>
            </div>

            {/* Quick Navigation Links */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Quick Navigation
              </h3>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToSection('hero-section')}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToSection('subjects-section')}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    All Subjects
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToSection('resources-section')}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Study Resources
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToSection('bookmarks-section')}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    My Bookmarks
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToSection('progress-section')}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Study Progress
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToSection('about-section')}
                    className="hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    About the Creator
                  </button>
                </li>
              </ul>
            </div>

            {/* Subject Shortcuts */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Subject Shortcuts
              </h3>
              <ul className="mt-3 space-y-2 text-xs">
                {SUBJECTS.map((subj) => (
                  <li key={subj.id}>
                    <button
                      type="button"
                      onClick={() => handleOpenSubject(subj.id)}
                      className="hover:text-slate-900 dark:hover:text-white transition-colors font-bn"
                    >
                      {subj.nameBn} ({subj.nameEn})
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Confirmed Social & Class Caddy Links */}
            <div className="lg:col-span-3">
              <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Connect with {CREATOR_BRANDING.creatorName}
              </h3>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <a
                    href={CREATOR_BRANDING.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span>Facebook: fb.com/emammehedi17</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${CREATOR_BRANDING.email}`}
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span>Email: {CREATOR_BRANDING.email}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={CREATOR_BRANDING.classCaddyLinks.home}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span>Class Caddy Website</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={CREATOR_BRANDING.classCaddyLinks.about}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span>Class Caddy About</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={CREATOR_BRANDING.classCaddyLinks.contact}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <span>Class Caddy Contact</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Disclaimer & Copyright Row */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="space-y-1">
              <p>
                © {new Date().getFullYear()} JSC Scholarship Exam Prep by{' '}
                <strong className="font-semibold text-slate-800 dark:text-slate-200">
                  {CREATOR_BRANDING.creatorName}
                </strong>
                . All rights reserved.
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Educational Disclaimer: This independent study portal organizes links to educational PDF materials hosted on Google Drive for student convenience. It is not affiliated with any government ministry or examination board.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Back-to-Top Control */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll back to top"
          className={`no-print fixed bottom-5 right-5 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${accentStyles.btn}`}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Inline Google Drive PDF Preview Modal */}
      <PdfPreviewModal
        resource={previewResource}
        status={previewResource ? getStatus(previewResource.id) : 'not_started'}
        onClose={() => setPreviewResource(null)}
        onChangeStatus={setResourceStatus}
      />
    </div>
  );
}
