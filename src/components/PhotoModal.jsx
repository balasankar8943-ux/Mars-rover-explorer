import { useEffect, useCallback } from 'react';

export default function PhotoModal({ photos, currentIndex, onClose, onNavigate }) {
  const photo = photos?.[currentIndex] ?? null;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handleKeyDown = useCallback(
    (e) => {
      if (!photo) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1);
    },
    [photo, onClose, onNavigate, currentIndex, hasPrev, hasNext]
  );

  useEffect(() => {
    if (!photo) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [photo, handleKeyDown]);

  if (!photo) return null;

  const formattedDate = photo.date_created
    ? new Date(photo.date_created).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown Date';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Content */}
      <div
        className="relative z-10 flex flex-col lg:flex-row max-w-6xl w-full max-h-[90vh] bg-slate-900/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="flex-1 relative bg-black flex items-center justify-center min-h-[300px]">
          <img
            src={photo.img_src}
            alt={photo.title}
            className="max-w-full max-h-[70vh] object-contain"
          />

          {/* Nav arrows */}
          {hasPrev && (
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {hasNext && (
            <button
              onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Metadata sidebar */}
        <div className="lg:w-80 p-6 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between overflow-y-auto max-h-[40vh] lg:max-h-full">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Photo Details</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <MetaItem label="Title" value={photo.title} />
              <MetaItem label="Date Created" value={formattedDate} />
              <MetaItem label="NASA ID" value={photo.id} />
              <MetaItem label="Source Center" value={photo.center} />
              <MetaItem label="Photographer / Credit" value={photo.photographer} />
              {photo.description && (
                <div>
                  <dt className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">Description</dt>
                  <dd className="text-xs text-slate-300 max-h-32 overflow-y-auto leading-relaxed pr-1">
                    {photo.description}
                  </dd>
                </div>
              )}
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-white/10 space-y-3">
            <a
              href={photo.img_src}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm text-white font-medium transition-all shadow-md shadow-indigo-600/20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open Full Resolution
            </a>
            <p className="text-xs text-slate-600 text-center">
              {currentIndex + 1} of {photos.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div>
      <dt className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">{label}</dt>
      <dd className="text-sm text-slate-200 leading-snug">{value}</dd>
    </div>
  );
}
