import React, { useState } from "react";
import { ShieldAlert, Flame, Play, Search } from "lucide-react";
import { Game } from "../../types";

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  avatarSeed?: string;
  scoreValue: number;
  createdAt: string;
}

interface ArcadeLeaderboardProps {
  localGames: Game[];
  selectedGameId: string;
  setSelectedGameId: (id: string) => void;
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  onViewProfile?: (userId: string) => void;
  onPlayGame?: (game: Game) => void;
}

export default function ArcadeLeaderboard({
  localGames,
  selectedGameId,
  setSelectedGameId,
  leaderboard,
  loading,
  onViewProfile,
  onPlayGame
}: ArcadeLeaderboardProps) {
  const [playerSearchQuery, setPlayerSearchQuery] = useState("");
  const selectedGame = localGames.find((g) => g.id === selectedGameId);

  const filteredLeaderboard = leaderboard.filter((entry) => {
    if (!playerSearchQuery.trim()) return true;
    const q = playerSearchQuery.toLowerCase().trim();
    return (
      entry.username.toLowerCase().includes(q) ||
      entry.userId.toLowerCase().includes(q) ||
      entry.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Main Grid: Selected Game Card & Player Rankings Container */}
      {selectedGame && (
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4">
          {/* Selected Game Card */}
          <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 md:p-3.5 flex flex-row md:flex-col items-center md:items-stretch justify-between gap-3 shadow-sm shrink-0 md:h-[340px]">
            <div className="flex flex-row md:flex-col items-center md:items-stretch gap-3 flex-1 min-w-0">
              <div
                onClick={() => onPlayGame?.(selectedGame)}
                className="h-12 w-20 md:h-24 md:w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative group shrink-0 cursor-pointer"
              >
                <img
                  src={selectedGame.thumbnail}
                  alt={selectedGame.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-1 left-1 md:top-2 md:left-2 bg-slate-900/80 backdrop-blur-md text-white text-[7px] md:text-[9px] uppercase font-bold font-mono tracking-wider px-1.5 md:px-2 py-0.5 rounded shadow-sm">
                  {selectedGame.category}
                </span>
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-3 h-3 md:w-3.5 md:h-3.5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white truncate">{selectedGame.title}</h3>
                <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">{selectedGame.description}</p>
                <div className="md:hidden text-[9px] font-mono text-slate-500 mt-0.5">
                  {leaderboard.length} ranked
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0 md:border-t border-slate-100 dark:border-slate-800 md:pt-2">
              <div className="hidden md:flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <span>Total Ranked Players</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 px-2 py-0.5 rounded-full text-[10px]">
                  {leaderboard.length} players
                </span>
              </div>
              <button
                onClick={() => onPlayGame?.(selectedGame)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] md:text-xs flex items-center justify-center gap-1 shadow-sm transition-all duration-200 active:scale-[0.98]"
              >
                <Play className="w-3 h-3 md:w-3.5 md:h-3.5 fill-white" /> <span className="hidden md:inline">Play Now</span><span className="md:hidden">Play</span>
              </button>
            </div>
          </div>

          {/* Leaderboard Ranking Table (Players Container) */}
          <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 md:p-4 shadow-sm flex flex-col gap-2.5 h-[370px] md:h-[340px]">
            {/* Header inside Players Container */}
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Player Rankings
                </h3>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">Live high scores for {selectedGame.title}</p>
              </div>

              {/* Search Player Input & Game Dropdown */}
              <div className="flex items-center gap-2 flex-1 max-w-full sm:max-w-md justify-end">
                <div className="relative flex-1 max-w-[180px] sm:max-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Search player or UID..."
                    value={playerSearchQuery}
                    onChange={(e) => setPlayerSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 rounded-lg pl-8 pr-6 py-1 text-xs text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  {playerSearchQuery && (
                    <button
                      onClick={() => setPlayerSearchQuery("")}
                      className="absolute right-2 top-1 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      title="Clear search"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="relative shrink-0">
                  <select
                    value={selectedGameId}
                    onChange={(e) => setSelectedGameId(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none cursor-pointer w-32 sm:w-40 shadow-sm transition-all"
                  >
                    {localGames.map((game) => (
                      <option key={game.id} value={game.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">
                        {game.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Scrollable Ranking Content Area */}
            {loading ? (
              <div className="text-center py-8 text-slate-500 font-mono text-xs flex-1 flex flex-col items-center justify-center">
                <Flame className="w-5 h-5 text-blue-500 mx-auto mb-1.5 animate-spin" />
                Retrieving scores from blockchain ledger...
              </div>
            ) : filteredLeaderboard.length > 0 ? (
              <div className="flex flex-col gap-1.5 overflow-y-auto custom-scrollbar flex-1 pr-1">
                {filteredLeaderboard.map((entry, idx) => {
                  const rank = idx + 1;
                  const isTop3 = rank <= 3;

                  const rankStyles = [
                    "bg-yellow-500 text-white border-yellow-400 dark:border-yellow-600 shadow-yellow-200/50 dark:shadow-yellow-900/20",
                    "bg-slate-400 dark:bg-slate-600 text-white border-slate-300 dark:border-slate-500 shadow-slate-200/50 dark:shadow-slate-900/20",
                    "bg-amber-600 text-white border-amber-500 dark:border-amber-700 shadow-amber-200/50 dark:shadow-amber-900/20",
                  ];
                  const cardBg = isTop3
                    ? idx === 0
                      ? "bg-gradient-to-r from-yellow-50/80 to-amber-50/30 dark:from-yellow-900/20 dark:to-amber-900/10 border-yellow-200 dark:border-yellow-900 hover:border-yellow-300 dark:hover:border-yellow-700"
                      : idx === 1
                        ? "bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/30 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                        : "bg-gradient-to-r from-amber-50/60 to-orange-50/30 dark:from-amber-900/20 dark:to-orange-900/10 border-amber-200 dark:border-amber-900 hover:border-amber-300 dark:hover:border-amber-700"
                    : "bg-slate-50/60 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:border-slate-200 dark:hover:border-slate-700";

                  const scoreColors = ["text-yellow-600", "text-slate-700", "text-amber-700"];

                  return (
                    <div
                      key={entry.id}
                      onClick={() => onViewProfile?.(entry.userId)}
                      className={`py-1.5 px-2.5 rounded-lg border flex items-center justify-between transition-all duration-200 cursor-pointer shadow-sm shrink-0 ${cardBg}`}
                    >
                      {/* Rank & Username details */}
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-md flex items-center justify-center border text-[10px] font-mono font-black shadow-sm shrink-0 ${isTop3 ? rankStyles[idx] : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                            }`}
                        >
                          #{rank}
                        </div>
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              entry.avatarUrl ||
                              `https://api.dicebear.com/7.x/adventurer/svg?seed=${entry.avatarSeed || entry.username
                              }`
                            }
                            alt={entry.username}
                            className="w-6 h-6 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 object-cover shadow-sm shrink-0"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-tight">
                              {entry.username}
                            </p>
                            <p className="text-[9px] text-slate-400 font-mono">
                              {new Date(entry.createdAt).toLocaleDateString([], {
                                month: "short",
                                day: "numeric"
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* High Score Telemetry */}
                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-black font-mono tracking-tight ${isTop3 ? scoreColors[idx] : "text-blue-600 dark:text-blue-400"
                            }`}
                        >
                          {entry.scoreValue.toLocaleString()}
                        </span>
                        <span className="text-[8px] block uppercase font-mono font-semibold text-slate-400 leading-none">
                          PTS
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 font-mono text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex-1 flex flex-col items-center justify-center">
                <ShieldAlert className="w-7 h-7 text-slate-300 dark:text-slate-600 mx-auto mb-1.5" />
                {playerSearchQuery ? `No players found matching "${playerSearchQuery}"` : "No scores recorded for this game. Be the pioneer!"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
