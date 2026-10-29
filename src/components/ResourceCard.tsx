import React from 'react';
import {
  FileText,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  Clock,
  Circle,
  Eye,
} from 'lucide-react';
import { StudyResource, getSubjectById } from '../data/resources';
import { ProgressStatus } from '../hooks/useStudyStore';

interface ResourceCardProps {
  resource: StudyResource;
  isBookmarked: boolean;
  status: ProgressStatus;
  showSubjectName?: boolean;
  onToggleBookmark: (id: string) => void;
  onChangeStatus: (id: string, status: ProgressStatus) => void;
  onRecordOpened: (id: string) => void;
  onPreview: (resource: StudyResource) => void;
}

const SUBJECT_ACCENT_STYLES: Record<
  string,
  {
    iconBg: string;
    iconText: string;
    primaryBtn: string;
  }
> = {
  violet: {
    iconBg: 'bg-violet-50 dark:bg-violet-950/50',
    iconText: 'text-violet-600 dark:text-violet-400',
    primaryBtn:
      'bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-600 dark:hover:bg-violet-500',
  },
  blue: {
    iconBg: 'bg-blue-50 dark:bg-blue-950/50',
    iconText: 'text-blue-600 dark:text-blue-400',
    primaryBtn:
      'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500',
  },
  emerald: {
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    iconText: 'text-emerald-600 dark:text-emerald-400',
    primaryBtn:
      'bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-500',
  },
  cyan: {
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/50',
    iconText: 'text-cyan-600 dark:text-cyan-400',
    primaryBtn:
      'bg-cyan-600 hover:bg-cyan-700 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500',
  },
  amber: {
    iconBg: 'bg-amber-50 dark:bg-amber-950/50',
    iconText: 'text-amber-600 dark:text-amber-400',
    primaryBtn:
      'bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-500',
  },
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isBookmarked,
  status,
  showSubjectName = false,
  onToggleBookmark,
  onChangeStatus,
  onRecordOpened,
  onPreview,
}) => {
  const subject = getSubjectById(resource.subjectId);
  const accent = SUBJECT_ACCENT_STYLES[subject?.accentColor || 'emerald'];
  const isShared = Boolean(resource.sharedSubjects && resource.sharedSubjects.length > 1);

  const handleToggleCompletedQuick = () => {
    const nextStatus: ProgressStatus = status === 'completed' ? 'not_started' : 'completed';
    onChangeStatus(resource.id, nextStatus);
  };

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 transition-colors duration-150 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div>
        {/* Top row: Unboxed metadata line + Bookmark action */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
              #{String(resource.serialNumber).padStart(2, '0')}
            </span>
            {showSubjectName && subject && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 font-bn">
                  {subject.nameBn} ({subject.nameEn})
                </span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="font-bn">{resource.category}</span>
            {resource.questionRef && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{resource.questionRef}</span>
              </>
            )}
            {isShared && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-amber-700 dark:text-amber-400 font-bn">
                  বিজ্ঞান ও বাওবি অভিন্ন রিসোর্স
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => onToggleBookmark(resource.id)}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this resource'}
            title={isBookmarked ? 'বুকমার্ক সরান (Remove Bookmark)' : 'বুকমার্ক করুন (Bookmark)'}
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
              isBookmarked
                ? 'border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-700/70 dark:bg-amber-950/60 dark:text-amber-400'
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <Bookmark className="h-4 w-4" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Resource Title with PDF Icon */}
        <div className="mt-3.5 flex items-start gap-3.5">
          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accent.iconBg} ${accent.iconText}`}
            aria-hidden="true"
          >
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-100 font-bn break-words">
            {resource.title}
          </h3>
        </div>
      </div>

      {/* Bottom controls: Study Status + Open PDF / Preview actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between no-print">
        {/* Interactive Study Status Segmented Control */}
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800/90" role="group" aria-label="Study status">
          <button
            type="button"
            onClick={() => onChangeStatus(resource.id, 'not_started')}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              status === 'not_started'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title="Mark as Not Started"
          >
            <Circle className="h-3 w-3 text-slate-400" />
            <span>Not Started</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeStatus(resource.id, 'in_progress')}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              status === 'in_progress'
                ? 'bg-white text-amber-700 shadow-xs dark:bg-slate-900 dark:text-amber-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title="Mark as In Progress"
          >
            <Clock className="h-3 w-3 text-amber-500" />
            <span>In Progress</span>
          </button>
          <button
            type="button"
            onClick={handleToggleCompletedQuick}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              status === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs dark:bg-emerald-600 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            title="Mark as Completed"
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Completed</span>
          </button>
        </div>

        {/* Action Buttons: Preview & Open PDF in Google Drive */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onRecordOpened(resource.id);
              onPreview(resource);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 whitespace-nowrap shrink-0"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>

          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onRecordOpened(resource.id)}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 whitespace-nowrap shrink-0 ${accent.primaryBtn}`}
          >
            <span>Open PDF</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};
