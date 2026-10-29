import React, { useEffect } from 'react';
import { X, ExternalLink, FileText, Info, CheckCircle2 } from 'lucide-react';
import { StudyResource, getDrivePreviewUrl, getSubjectById } from '../data/resources';
import { ProgressStatus } from '../hooks/useStudyStore';

interface PdfPreviewModalProps {
  resource: StudyResource | null;
  status: ProgressStatus;
  onClose: () => void;
  onChangeStatus: (id: string, status: ProgressStatus) => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  resource,
  status,
  onClose,
  onChangeStatus,
}) => {
  useEffect(() => {
    if (!resource) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resource, onClose]);

  if (!resource) return null;

  const previewUrl = getDrivePreviewUrl(resource.url);
  const subject = getSubjectById(resource.subjectId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-6 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-preview-title"
    >
      <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3.5 sm:px-6 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-mono tabular-nums">
                  #{String(resource.serialNumber).padStart(2, '0')}
                </span>
                {subject && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-bn">{subject.nameBn}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="font-bn">{resource.category}</span>
              </div>
              <h2
                id="pdf-preview-title"
                className="truncate text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 font-bn"
              >
                {resource.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() =>
                onChangeStatus(
                  resource.id,
                  status === 'completed' ? 'in_progress' : 'completed'
                )
              }
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                status === 'completed'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{status === 'completed' ? 'Completed' : 'Mark Completed'}</span>
            </button>

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 whitespace-nowrap shrink-0"
            >
              <span>Open in Google Drive</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview modal"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Helpful Permission / Embedding Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bn">
              যদি ব্রাউজার বা Google Drive পারমিশনের কারণে নিচে প্রিভিউ লোড না হয়, তবে সরাসরি{' '}
              <strong className="font-semibold text-slate-900 dark:text-slate-200">
                “Open in Google Drive”
              </strong>{' '}
              বাটনে ক্লিক করে নতুন ট্যাবে ফাইলটি খুলুন। (ফাইল দেখার অনুমতি প্রয়োজন হলে ওনার পারমিশন প্রদান করবেন।)
            </span>
          </div>
        </div>

        {/* Embedded Iframe or Fallback */}
        <div className="relative flex-1 bg-slate-100 dark:bg-slate-950">
          {previewUrl ? (
            <iframe
              src={previewUrl}
              title={`PDF Preview: ${resource.title}`}
              className="h-full w-full border-0"
              allow="autoplay"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <FileText className="h-12 w-12 text-slate-400 mb-3" />
              <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                Inline preview is unavailable for this link format
              </p>
              <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400 font-bn">
                অনুগ্রহ করে নিচের বাটনে ক্লিক করে সরাসরি Google Drive-এ PDF ফাইলটি ওপেন করুন।
              </p>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                <span>Open in Google Drive</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
