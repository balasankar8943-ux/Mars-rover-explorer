export default function LoadMoreButton({ onClick, loading, hasMore }) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center pt-8">
      <button
        onClick={onClick}
        disabled={loading}
        className="group relative px-8 py-3 bg-white/5 border border-white/10 hover:border-indigo-500/40 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading more...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            Load More Photos
            <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}
