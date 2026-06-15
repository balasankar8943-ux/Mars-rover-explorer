import { ROVERS } from '../data/roverCameras';

const statusColors = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  complete: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export default function RoverSelector({ selectedRover, onRoverChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300 tracking-wide uppercase">
        Select Rover
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ROVERS.map((rover) => (
          <button
            key={rover.id}
            onClick={() => onRoverChange(rover.id)}
            className={`relative group p-4 rounded-xl border transition-all duration-300 cursor-pointer text-left ${
              selectedRover === rover.id
                ? 'bg-indigo-500/15 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="text-sm font-bold text-white mb-1">{rover.name}</div>
            <div className="text-xs text-slate-400 mb-2">Landed {rover.landingDate}</div>
            <span
              className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColors[rover.status]}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                rover.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`} />
              {rover.status}
            </span>
            {selectedRover === rover.id && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
