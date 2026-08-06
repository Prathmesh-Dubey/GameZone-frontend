import React from "react";
import { Trophy } from "lucide-react";

interface GlobalHallOfFameProps {
  globalRanks: { userId: string; username: string; totalScore: number }[];
  loading: boolean;
  onViewProfile?: (userId: string) => void;
}

export default function GlobalHallOfFame({ globalRanks, loading, onViewProfile }: GlobalHallOfFameProps) {
  const top3Ranks = globalRanks.slice(0, 3);

  return (
    <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/25 to-amber-500/15 dark:from-amber-950/80 dark:via-yellow-950/60 dark:to-amber-950/80 border border-amber-300/80 dark:border-amber-500/40 rounded-xl p-3 md:p-4 shadow-md shadow-amber-500/5 dark:shadow-amber-950/40 flex flex-col gap-3 shrink-0 backdrop-blur-sm transition-all duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 font-mono flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500 dark:text-yellow-400 animate-pulse" /> Global Hall of Fame
        </h3>
        <span className="text-[10px] text-amber-800/80 dark:text-amber-400/80 font-mono font-medium">Top 3 players by total combined score</span>
      </div>

      {top3Ranks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {top3Ranks.map((rank, index) => (
            <div
              key={rank.userId}
              onClick={() => onViewProfile?.(rank.userId)}
              className={`border rounded-xl p-2.5 flex items-center justify-between group transition-all duration-300 cursor-pointer overflow-hidden shadow-sm ${
                index === 0
                  ? "bg-gradient-to-r from-yellow-100/90 via-amber-100/90 to-yellow-200/90 dark:from-yellow-900/80 dark:via-amber-800/70 dark:to-yellow-900/80 border-yellow-400 dark:border-yellow-500 hover:border-yellow-500 dark:hover:border-yellow-300 shadow-yellow-500/10"
                  : index === 1
                    ? "bg-gradient-to-r from-slate-100/90 via-slate-200/80 to-slate-100/90 dark:from-slate-800/90 dark:via-slate-800/80 dark:to-slate-800/90 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500"
                    : "bg-gradient-to-r from-amber-100/80 via-orange-100/80 to-amber-200/80 dark:from-amber-950 dark:via-orange-950 dark:to-amber-950 border-amber-300 dark:border-amber-600 hover:border-amber-400 dark:hover:border-amber-400"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-6 h-6 shrink-0 rounded-lg flex items-center justify-center font-black text-[10px] shadow-sm font-mono ${
                  index === 0 ? 'bg-yellow-500 text-white border border-yellow-400' :
                  index === 1 ? 'bg-slate-400 text-white border border-slate-300' :
                  'bg-amber-600 text-white border border-amber-500'
                }`}>
                  #{index + 1}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{rank.username}</h4>
              </div>
              <div className={`text-[10px] font-mono font-black shrink-0 ml-2 ${
                index === 0 ? 'text-amber-800 dark:text-yellow-300' :
                index === 1 ? 'text-slate-700 dark:text-slate-200' :
                'text-amber-800 dark:text-amber-300'
              }`}>
                {rank.totalScore.toLocaleString()} pts
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 border border-dashed border-amber-300/60 dark:border-amber-800/60 rounded-lg text-center text-xs font-mono text-amber-800/70 dark:text-amber-400/70">
          {loading ? "Loading..." : "No global ranks available."}
        </div>
      )}
    </div>
  );
}
