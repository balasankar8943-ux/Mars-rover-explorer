export default function PhotoGrid({ photos, loading, error, onPhotoClick }) {
  // Skeleton loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-white/5 border border-white/10 animate-pulse"
          >
            <div className="h-full flex flex-col justify-end p-3">
              <div className="h-3 w-2/3 bg-white/10 rounded mb-2" />
              <div className="h-2 w-1/2 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-400 mb-2">Something went wrong</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">{error}</p>
      </div>
    );
  }

  // Empty state — only show after a search has been performed
  if (photos && photos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-500/10 border border-slate-500/20 mb-4">
          <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-300 mb-2">No photos found</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Try adjusting your filters — change the keywords or year range to explore more photos from this rover.
        </p>
      </div>
    );
  }

  // No search performed yet
  if (!photos) return null;

  // Photo grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          onClick={() => onPhotoClick(index)}
          className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer bg-white/5"
        >
          <img
            src={photo.thumb_src}
            alt={photo.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-xs font-semibold text-white truncate">{photo.title}</p>
              <p className="text-[11px] text-slate-300">
                {photo.date_created ? new Date(photo.date_created).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
