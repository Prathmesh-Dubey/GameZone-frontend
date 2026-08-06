import React, { useState, useCallback } from "react";
import {
  Search,
  Play,
  X,
  Gamepad,
  Award,
  ShieldAlert,
  Cpu,
  Sparkles,
  CheckCircle,
  Pencil,
  Maximize,
  Minimize
} from "lucide-react";
import {
  Game,
  User,
  GameSession,
  UserAchievement,
  gameApi,
  sessionApi,
  scoreApi,
  userAchievementApi,
} from "../api/api";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import DynamicGameRunner from "./DynamicGameRunner";
import { useDebounce } from "../hooks/useDebounce";

interface ArcadeViewProps {
  user: User;
  onRefreshMetrics: () => void;
  games: Game[];
  onGameDeleted?: (gameId: string) => void;
  onEditGame?: (gameId: string) => void;
  searchGlobal?: string;
  setSearchGlobal?: (val: string) => void;
}

export default function ArcadeView({
  user,
  onRefreshMetrics,
  games,
  onGameDeleted,
  onEditGame,
  searchGlobal,
  setSearchGlobal,
}: ArcadeViewProps) {
  const queryClient = useQueryClient();
  const [localSearch, setLocalSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSession, setActiveSession] = useState<GameSession | null>(null);
  const [playingGame, setPlayingGame] = useState<Game | null>(null);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [newlyUnlocked, setNewlyUnlocked] = useState<UserAchievement[]>([]);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [loadingGame, setLoadingGame] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  React.useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(console.error);
    }
  };

  const rawSearchTerm = searchGlobal !== undefined ? searchGlobal : localSearch;
  const searchTerm = useDebounce(rawSearchTerm, 300);
  const setSearchTerm = setSearchGlobal !== undefined ? setSearchGlobal : setLocalSearch;

  const categories = ["All", "Arcade", "Casual", "Strategy", "Action", "Puzzle"];

  const filteredGames = games.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = activeCategory === "All" || g.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartGame = async (game: Game) => {
    try {
      setLoadingGame(true);
      setNewlyUnlocked([]);

      const session = await sessionApi.start(user.id, game.id);
      setActiveSession(session);

      let code = game.gameCode || null;
      if (game.isDynamic && !code) {
        code = await gameApi.getCode(game.id);
      }
      setGameCode(code);
      setPlayingGame(game);
    } catch (err) {
      console.error("Failed to start game:", err);
      alert("Could not start game. Please try again.");
    } finally {
      setLoadingGame(false);
    }
  };

  const handleExitGame = async () => {
    if (activeSession) {
      try {
        await sessionApi.end(activeSession.id);
      } catch (err) {
        console.error("Failed to end session:", err);
      }
    }
    setActiveSession(null);
    setPlayingGame(null);
    setGameCode(null);
    onRefreshMetrics();
  };

  const handleScoreSubmit = useCallback(async (score: number) => {
    if (!playingGame) return;
    try {
      await scoreApi.submit({
        userId: user.id,
        gameId: playingGame.id,
        scoreValue: score,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.scores.leaderboard.byGame(playingGame.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.scores.user(user.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.scores.leaderboard.global });

      const unlocked = await userAchievementApi.checkAndUnlock(user.id, score);
      if (unlocked && unlocked.length > 0) {
        queryClient.invalidateQueries({ queryKey: queryKeys.achievements.user.detail(user.id) });
        setNewlyUnlocked(unlocked);
        setShowUnlockModal(true);
      } else {
        alert(`Score of ${score} registered successfully!`);
      }
      onRefreshMetrics();
    } catch (err) {
      console.error("Score submit error:", err);
      alert("Failed to submit score.");
    }
  }, [playingGame, user.id, queryClient, onRefreshMetrics]);

  const handleDeleteCustomGame = async (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this custom game? This action cannot be undone.")) return;
    try {
      await gameApi.delete(gameId);
      if (onGameDeleted) onGameDeleted(gameId);
    } catch (err) {
      console.error(err);
      alert("Failed to delete game.");
    }
  };



  return (
    <div className="w-full h-full flex flex-col animate-fade-in relative">
      {/* -------- NOT PLAYING – show game library -------- */}
      {!playingGame && (
        <div className="w-full max-w-7xl mx-auto h-full overflow-y-auto p-2 md:p-4 space-y-6 scrollbar-none">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-300 whitespace-nowrap ${activeCategory === cat
                    ? "bg-blue-600 text-white shadow-md border border-blue-600"
                    : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search game titles..."
                value={rawSearchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => {
              const isCustom = !["game-snake", "game-clicker", "game-pong"].includes(game.id);
              return (
                <div
                  key={game.id}
                  onClick={() => handleStartGame(game)}
                  className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <img
                      src={game.thumbnail || "/placeholder-game.png"}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-90" />
                    <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                      <span className="bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-sm">
                        <Gamepad className="w-2.5 h-2.5" /> Game
                      </span>
                      {isCustom && (
                        <span className="bg-amber-600/90 backdrop-blur-md text-white text-[9px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-sm">
                          <Cpu className="w-2.5 h-2.5" /> TSX
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                      <div className="p-3.5 rounded-full bg-blue-600 text-white shadow-xl transform scale-100 md:scale-90 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1 gap-4">
                    <div>
                      <h3 className="text-md font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-3 text-[10px] text-slate-500 dark:text-slate-500 font-mono">
                      <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Live
                      </span>
                      {isCustom && user.role === 'ADMIN' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditGame?.(game.id);
                            }}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold uppercase transition text-[9px] flex items-center gap-0.5"
                          >
                            <Pencil className="w-2.5 h-2.5" /> Edit
                          </button>
                          <button
                            onClick={(e) => handleDeleteCustomGame(game.id, e)}
                            className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 font-bold uppercase transition text-[9px] flex items-center gap-0.5"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredGames.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 font-mono text-xs">
                <Gamepad className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3 animate-pulse" />
                No games found. Add your first game in the Creator!
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------- PLAYING A GAME -------- */}
      {playingGame && activeSession && (
        <div className="w-full h-full flex flex-col bg-[#020205] absolute inset-0 z-50">
          <button
            onClick={handleExitGame}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl text-white/80 hover:text-white transition-colors shadow-lg border border-white/10"
            title="Exit Game"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 w-full h-full bg-white dark:bg-slate-950 overflow-hidden">
            {loadingGame ? (
              <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-mono text-xs gap-2">
                <Cpu className="w-5 h-5 animate-spin text-blue-500" />
                Loading game...
              </div>
            ) : gameCode ? (
              <DynamicGameRunner
                jsCode={gameCode}
                onScoreSubmit={handleScoreSubmit}
                gameId={playingGame.id}
                userId={user.id}
                gameTitle={playingGame.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="text-center p-8 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md">
                  <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <h4 className="text-md font-bold text-red-600 dark:text-red-500">Game Error</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-mono">
                    No valid code found for this game.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Achievement Unlock Modal */}
      {showUnlockModal && newlyUnlocked.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-center">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-900">
              <Award className="w-12 h-12 text-black animate-spin-slow" />
            </div>
            <div className="mt-14">
              <span className="text-[10px] text-amber-400 font-black tracking-widest uppercase font-mono flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Medal Unlocked!
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mt-1">ACHIEVEMENT COMPLETED</h3>
              <div className="my-5 flex flex-col gap-3">
                {newlyUnlocked.map((ach) => (
                  <div key={ach.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center gap-3 text-left">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">{ach.achievementTitle}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{ach.achievementDescription}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowUnlockModal(false)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold text-xs py-3 rounded-xl hover:brightness-110 active:scale-95 transition"
              >
                Claim Medal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
