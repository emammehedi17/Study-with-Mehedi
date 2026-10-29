import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  X,
  BookOpen,
  Languages,
  Calculator,
  FlaskConical,
  Globe2,
  Printer,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import {
  Subject,
  StudyResource,
  ResourceCategory,
  getResourcesBySubject,
  getCategoriesForResources,
} from '../data/resources';
import { ProgressStatus } from '../hooks/useStudyStore';
import { ResourceCard } from './ResourceCard';

interface SubjectDetailViewProps {
  subject: Subject;
  isBookmarked: (id: string) => boolean;
  getStatus: (id: string) => ProgressStatus;
  subjectStats: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    percentage: number;
  };
  onBackToSubjects: () => void;
  onToggleBookmark: (id: string) => void;
  onChangeStatus: (id: string, status: ProgressStatus) => void;
  onRecordOpened: (id: string) => void;
  onPreview: (resource: StudyResource) => void;
  onSwitchToGlobalSearch: (query: string) => void;
}

const SUBJECT_ICON_MAP = {
  BookOpen,
  Languages,
  Calculator,
  FlaskConical,
  Globe2,
};

const SUBJECT_BANNER_STYLES: Record<
  Subject['accentColor'],
  {
    iconBox: string;
    progressBar: string;
    activeFilter: string;
  }
> = {
  violet: {
    iconBox: 'bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300',
    progressBar: 'bg-violet-600',
    activeFilter: 'bg-violet-600 text-white',
  },
  blue: {
    iconBox: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300',
    progressBar: 'bg-blue-600',
    activeFilter: 'bg-blue-600 text-white',
  },
  emerald: {
    iconBox: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
    progressBar: 'bg-emerald-600',
    activeFilter: 'bg-emerald-600 text-white',
  },
  cyan: {
    iconBox: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300',
    progressBar: 'bg-cyan-600',
    activeFilter: 'bg-cyan-600 text-white',
  },
  amber: {
    iconBox: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300',
    progressBar: 'bg-amber-600',
    activeFilter: 'bg-amber-600 text-white',
  },
};

function normalizeSearchText(str: string): string {
  return str.toLowerCase().replace(/\s+/g, ' ').trim();
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subject,
  isBookmarked,
  getStatus,
  subjectStats,
  onBackToSubjects,
  onToggleBookmark,
  onChangeStatus,
  onRecordOpened,
  onPreview,
  onSwitchToGlobalSearch,
}) => {
  const [localQuery, setLocalQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ProgressStatus | 'ALL'>('ALL');

  const allSubjectResources = useMemo(
    () => getResourcesBySubject(subject.id),
    [subject.id]
  );

  const availableCategories = useMemo(
    () => getCategoriesForResources(allSubjectResources),
    [allSubjectResources]
  );

  const filteredResources = useMemo(() => {
    const q = normalizeSearchText(localQuery);
    return allSubjectResources.filter((res) => {
      if (selectedCategory !== 'ALL' && res.category !== selectedCategory) {
        return false;
      }
      if (statusFilter !== 'ALL' && getStatus(res.id) !== statusFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = normalizeSearchText(
        [
          res.title,
          res.category,
          res.questionRef || '',
          String(res.serialNumber),
          ...res.keywords,
        ].join(' ')
      );
      return haystack.includes(q);
    });
  }, [allSubjectResources, localQuery, selectedCategory, statusFilter, getStatus]);

  const IconComponent = SUBJECT_ICON_MAP[subject.icon];
  const styles = SUBJECT_BANNER_STYLES[subject.accentColor];

  const handleClearFilters = () => {
    setLocalQuery('');
    setSelectedCategory('ALL');
    setStatusFilter('ALL');
  };

  return (
    <section aria-labelledby="subject-view-heading" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb & Back Navigation */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 no-print">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            type="button"
            onClick={onBackToSubjects}
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Home
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            onClick={onBackToSubjects}
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            All Subjects
          </button>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100 font-bn">
            {subject.nameBn} ({subject.nameEn})
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Subject List</span>
          </button>

          <button
            type="button"
            onClick={onBackToSubjects}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Subjects</span>
          </button>
        </div>
      </div>

      {/* Subject Header Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${styles.iconBox}`}
              aria-hidden="true"
            >
              <IconComponent className="h-7 w-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>JSC Scholarship Subject Hub</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                  {allSubjectResources.length} Study Resources Available
                </span>
              </div>
              <h1
                id="subject-view-heading"
                className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 font-bn"
              >
                {subject.nameBn} — {subject.nameEn}
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm text-slate-600 dark:text-slate-400 font-bn">
                {subject.descriptionBn}
              </p>
            </div>
          </div>

          {/* Subject Progress Box */}
          <div className="w-full lg:w-72 shrink-0 pt-4 border-t border-slate-100 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-6 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Subject Completion
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {subjectStats.completed}/{subjectStats.total} ({subjectStats.percentage}%)
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-200 ${styles.progressBar}`}
                style={{ width: `${subjectStats.percentage}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              <span>Completed: {subjectStats.completed}</span>
              <span>·</span>
              <span>In Progress: {subjectStats.inProgress}</span>
              <span>·</span>
              <span>Remaining: {subjectStats.notStarted}</span>
            </div>
          </div>
        </div>

        {/* Search & Filters inside current subject */}
        <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 no-print">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder={`Search within ${subject.nameEn} (${subject.nameBn})...`}
                aria-label={`Search within ${subject.nameEn}`}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-500"
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={() => setLocalQuery('')}
                  aria-label="Clear subject search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Status filter segmented control */}
            <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800/80" role="group" aria-label="Filter by study status">
              {(
                [
                  { id: 'ALL', label: 'All Status' },
                  { id: 'not_started', label: 'Not Started' },
                  { id: 'in_progress', label: 'In Progress' },
                  { id: 'completed', label: 'Completed' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatusFilter(item.id)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    statusFilter === item.id
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by resource category">
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === 'ALL'
                    ? styles.activeFilter
                    : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-300'
                }`}
              >
                All Categories ({allSubjectResources.length})
              </button>

              {availableCategories.map((cat) => {
                const count = allSubjectResources.filter((r) => r.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors font-bn whitespace-nowrap shrink-0 ${
                      selectedCategory === cat
                        ? styles.activeFilter
                        : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-300'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {(localQuery || selectedCategory !== 'ALL' || statusFilter !== 'ALL') && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400 whitespace-nowrap shrink-0"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Summary Bar */}
      <div className="mt-6 mb-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
        <span className="tabular-nums">
          Showing <strong className="font-semibold text-slate-900 dark:text-slate-100">{filteredResources.length}</strong> of{' '}
          <strong className="font-semibold text-slate-900 dark:text-slate-100">{allSubjectResources.length}</strong> resources in {subject.nameEn}
        </span>

        {localQuery && (
          <button
            type="button"
            onClick={() => onSwitchToGlobalSearch(localQuery)}
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
          >
            Search “{localQuery}” across all 5 subjects →
          </button>
        )}
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isBookmarked={isBookmarked(resource.id)}
              status={getStatus(resource.id)}
              showSubjectName={false}
              onToggleBookmark={onToggleBookmark}
              onChangeStatus={onChangeStatus}
              onRecordOpened={onRecordOpened}
              onPreview={onPreview}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <FolderOpen className="mx-auto h-10 w-10 text-slate-400" />
          <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
            No matching resources in {subject.nameEn}
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-bn">
            আপনার সার্চ বা ফিল্টারের সাথে কোনো ফাইল মেলেনি। ফিল্টার রিসেট করুন অথবা সব বিষয়ে সার্চ করুন।
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
            >
              Reset Subject Filters
            </button>
            {localQuery && (
              <button
                type="button"
                onClick={() => onSwitchToGlobalSearch(localQuery)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Search All Subjects
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
