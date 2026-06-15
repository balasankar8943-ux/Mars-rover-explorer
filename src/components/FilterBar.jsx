import { useState } from 'react';

export default function FilterBar({ selectedRover, onSearch }) {
  const [keywords, setKeywords] = useState('');
  const [yearStart, setYearStart] = useState('');
  const [yearEnd, setYearEnd] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedRover) return;

    onSearch({
      rover: selectedRover,
      keywords: keywords.trim() || null,
      yearStart: yearStart || null,
      yearEnd: yearEnd || null,
    });
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="text-sm font-medium text-slate-300">Filters</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Keywords */}
        <div className="flex-[2]">
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Keywords (e.g. selfie, panorama, sunset, Gale Crater...)"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Year range */}
        <div className="flex gap-2 flex-1">
          <input
            type="number"
            min="1997"
            max="2030"
            value={yearStart}
            onChange={(e) => setYearStart(e.target.value)}
            placeholder="From year"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          <input
            type="number"
            min="1997"
            max="2030"
            value={yearEnd}
            onChange={(e) => setYearEnd(e.target.value)}
            placeholder="To year"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Search button */}
        <button
          type="submit"
          disabled={!selectedRover}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </span>
        </button>
      </div>
    </form>
  );
}
