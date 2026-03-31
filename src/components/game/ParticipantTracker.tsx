"use client";

interface ParticipantTrackerProps {
  totalParticipants: number;
  activeParticipants: number;
  currentLevel: number;
  totalLevels: number;
}

export default function ParticipantTracker({
  totalParticipants,
  activeParticipants,
  currentLevel,
  totalLevels,
}: ParticipantTrackerProps) {
  const eliminatedCount = totalParticipants - activeParticipants;
  const survivalRate =
    totalParticipants > 0
      ? Math.round((activeParticipants / totalParticipants) * 100)
      : 0;

  return (
    <div className="bg-black/60 border border-white/10 rounded-xl p-4 backdrop-blur-sm w-64">
      <h4 className="text-xs tracking-widest text-amber-400 font-semibold mb-3">
        ESTADO DE LA BÚSQUEDA
      </h4>

      <div className="space-y-3">
        {/* Active explorers */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/60">Exploradores activos</span>
          <span className="text-lg font-mono font-bold text-green-400">
            {activeParticipants.toLocaleString()}
          </span>
        </div>

        {/* Eliminated */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/60">Eliminados</span>
          <span className="text-lg font-mono font-bold text-red-400">
            {eliminatedCount.toLocaleString()}
          </span>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-white/40 mb-1">
            <span>Supervivencia</span>
            <span>{survivalRate}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-green-500 rounded-full transition-all duration-500"
              style={{ width: `${survivalRate}%` }}
            />
          </div>
        </div>

        {/* Level indicator */}
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <span className="text-sm text-white/60">Nivel</span>
          <span className="text-sm font-bold text-amber-400">
            {currentLevel} / {totalLevels}
          </span>
        </div>
      </div>
    </div>
  );
}
