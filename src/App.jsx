import { useState, useCallback } from 'react';
import RoverSelector from './components/RoverSelector';
import FilterBar from './components/FilterBar';
import PhotoGrid from './components/PhotoGrid';
import PhotoModal from './components/PhotoModal';
import LoadMoreButton from './components/LoadMoreButton';
import RoverSimulator from './components/RoverSimulator';
import { useRoverPhotos } from './hooks/useRoverPhotos';

export default function App() {
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' or 'simulator'
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [modalIndex, setModalIndex] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const { photos, loading, loadingMore, error, hasMore, fetchPhotos, loadMore } =
    useRoverPhotos();

  const handleSearch = useCallback(
    (params) => {
      setHasSearched(true);
      fetchPhotos(params);
    },
    [fetchPhotos]
  );

  const handleRoverChange = useCallback((rover) => {
    setSelectedRover(rover);
    setHasSearched(false);
  }, []);

  return (
    <>
      {/* Starfield background */}
      <div className="starfield" />

      {/* Nebula accents */}
      <div
        className="nebula-glow"
        style={{ top: '-200px', left: '-100px', background: 'radial-gradient(circle, #6366f1, transparent)' }}
      />
      <div
        className="nebula-glow"
        style={{ bottom: '-200px', right: '-100px', background: 'radial-gradient(circle, #a855f7, transparent)' }}
      />

      {/* Main app */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mars icon */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Mars Rover Explorer
                </h1>
                <p className="text-[11px] text-slate-500 tracking-wide font-medium">
                  NASA JPL Mission Control Hub
                </p>
              </div>
            </div>

            {/* Tab Navigation Switcher */}
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab('explorer')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                  activeTab === 'explorer'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/35'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Photo Explorer
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer ${
                  activeTab === 'simulator'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/35'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <svg className="w-3.5 h-3.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                3D Drive Simulator
              </button>
            </div>

            <a
              href="https://api.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors hidden lg:block"
            >
              Powered by NASA Open APIs
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {activeTab === 'simulator' ? (
            <section className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    Mars Rover Drive Simulator
                    <span className="text-[10px] uppercase font-bold tracking-widest bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                      Interactive 3D
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    First-person view from the rover's mast-camera feed. Navigate rugged craters and dunes.
                  </p>
                </div>
              </div>
              <RoverSimulator />
            </section>
          ) : (
            <div className="space-y-8">
              {/* Rover selection */}
              <section>
                <RoverSelector
                  selectedRover={selectedRover}
                  onRoverChange={handleRoverChange}
                />
              </section>

              {/* Filters */}
              <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                <FilterBar selectedRover={selectedRover} onSearch={handleSearch} />
              </section>

              {/* Results */}
              <section>
                {/* Results header */}
                {hasSearched && !loading && photos.length > 0 && (
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-slate-400">
                      Showing <span className="text-white font-medium">{photos.length}</span> photos
                    </p>
                  </div>
                )}

                {/* Initial state — before any search */}
                {!hasSearched && !loading && (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-6">
                      <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      Explore Mars Through Rover Eyes
                    </h2>
                    <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                      Select a rover, set your filters, and hit Search to browse real photos captured on the surface of Mars.
                    </p>
                    <div className="flex items-center justify-center gap-1 text-xs text-slate-600">
                      <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-slate-400">←</kbd>
                      <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-slate-400">→</kbd>
                      <span className="ml-1">Navigate photos in lightbox</span>
                    </div>
                  </div>
                )}

                {/* Photo grid */}
                {(hasSearched || loading) && (
                  <PhotoGrid
                    photos={hasSearched ? photos : null}
                    loading={loading}
                    error={error}
                    onPhotoClick={setModalIndex}
                  />
                )}

                {/* Load more */}
                {hasSearched && photos.length > 0 && (
                  <LoadMoreButton
                    onClick={loadMore}
                    loading={loadingMore}
                    hasMore={hasMore}
                  />
                )}
              </section>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-6 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-xs text-slate-600">
              Data provided by{' '}
              <a
                href="https://api.nasa.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-indigo-400 transition-colors"
              >
                NASA Open APIs
              </a>{' '}
              · Images courtesy of NASA/JPL-Caltech
            </p>
          </div>
        </footer>
      </div>

      {/* Photo modal */}
      {modalIndex !== null && (
        <PhotoModal
          photos={photos}
          currentIndex={modalIndex}
          onClose={() => setModalIndex(null)}
          onNavigate={setModalIndex}
        />
      )}
    </>
  );
}

