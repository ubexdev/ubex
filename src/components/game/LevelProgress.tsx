"use client";

interface LevelProgressProps {
  currentLevel: number;
  totalLevels: number;
  completedLevels: number[];
}

export default function LevelProgress({
  currentLevel,
  totalLevels,
  completedLevels,
}: LevelProgressProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
          PROGRESO
        </span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
          {completedLevels.length}/{totalLevels}
        </span>
      </div>

      {/* Level dots */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {Array.from({ length: totalLevels }, (_, i) => {
          const levelNum = i + 1;
          const isCompleted = completedLevels.includes(levelNum);
          const isCurrent = levelNum === currentLevel;

          let bg = "rgba(255,255,255,0.06)";
          let border = "rgba(255,255,255,0.1)";
          let color = "rgba(255,255,255,0.2)";

          if (isCompleted) {
            bg = "rgba(34,197,94,0.2)";
            border = "rgba(34,197,94,0.4)";
            color = "#22c55e";
          } else if (isCurrent) {
            bg = "rgba(251,191,36,0.15)";
            border = "#fbbf24";
            color = "#fbbf24";
          }

          return (
            <div
              key={levelNum}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: bg,
                border: `1.5px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color,
                transition: "all 0.3s ease",
                position: "relative",
              }}
            >
              {isCompleted ? "✓" : levelNum}
              {isCurrent && (
                <div
                  style={{
                    position: "absolute",
                    inset: -3,
                    borderRadius: 10,
                    border: "1.5px solid rgba(251,191,36,0.3)",
                    animation: "pulse-ring 2s ease-in-out infinite",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 999, overflow: "hidden", marginTop: 4 }}>
        <div
          style={{
            height: "100%",
            width: `${(completedLevels.length / totalLevels) * 100}%`,
            background: "linear-gradient(90deg, #fbbf24, #22c55e)",
            borderRadius: 999,
            transition: "width 0.5s ease",
          }}
        />
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
