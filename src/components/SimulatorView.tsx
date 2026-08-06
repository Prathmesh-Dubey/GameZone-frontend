import React, { useState, useCallback } from "react";
import {
  Search,
  Play,
  X,
  Calculator,
  ShieldAlert,
  Cpu,
  Plus,
  BarChart2,
  Trash2,
  Edit,
  Maximize,
  Minimize
} from "lucide-react";
import {
  Simulator,
  User,
  GameSession,
  simulatorApi,
  sessionApi,
  scoreApi,
} from "../api/api";
import { useSimulators } from '../hooks';
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import DynamicGameRunner from "./DynamicGameRunner";
import { useDebounce } from "../hooks/useDebounce";

interface SimulatorViewProps {
  user: User;
  onRefreshMetrics: () => void;
  onSimulatorDeleted?: (simulatorId: string) => void;
  onEditSimulator?: (simulatorId: string) => void;
  onNewSimulator?: () => void;
  searchGlobal?: string;
  setSearchGlobal?: (val: string) => void;
}

const SimulatorView = React.memo(({
  user,
  onRefreshMetrics,
  onSimulatorDeleted,
  onEditSimulator,
  onNewSimulator,
  searchGlobal,
  setSearchGlobal,
}: SimulatorViewProps) => {
  const [localSearch, setLocalSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSession, setActiveSession] = useState<GameSession | null>(null);
  const [runningSimulator, setRunningSimulator] = useState<Simulator | null>(null);
  const [simulatorCode, setSimulatorCode] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [loadingSimulator, setLoadingSimulator] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { data: simulators = [] } = useSimulators();

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

  const categories = ["All", "Simulator", "Math", "Analytics", "Physics", "Utility", "Chemistry"];

  const filteredSimulators = simulators.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = activeCategory === "All" || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartSimulator = async (sim: Simulator) => {
    try {
      setLoadingSimulator(true);

      let session: GameSession | null = null;
      try {
        session = await sessionApi.start(user.id, sim.id);
      } catch (sessErr) {
        console.warn("Could not create server session, using local fallback:", sessErr);
        session = {
          id: "sim-session-" + Date.now(),
          startTime: new Date().toISOString(),
          endTime: null,
          duration: null,
          userId: user.id,
          gameId: sim.id,
        };
      }
      setActiveSession(session);

      let code = sim.simulatorCode || sim.gameCode || null;
      if (!code) {
        try {
          code = await simulatorApi.getCode(sim.id);
        } catch (e) {
          console.error("Failed to fetch simulator code:", e);
        }
      }
      setSimulatorCode(code);
      setRunningSimulator(sim);
    } catch (err) {
      console.error("Failed to launch simulator:", err);
      alert("Could not start simulator. Please try again.");
    } finally {
      setLoadingSimulator(false);
    }
  };

  const handleExitSimulator = async () => {
    if (activeSession) {
      try {
        await sessionApi.end(activeSession.id);
      } catch (err) {
        console.error("Failed to end session:", err);
      }
    }
    setActiveSession(null);
    setRunningSimulator(null);
    setSimulatorCode(null);
    onRefreshMetrics();
  };

  const handleScoreSubmit = useCallback(async (score: number) => {
    if (!runningSimulator) return;
    try {
      await scoreApi.submit({
        userId: user.id,
        gameId: runningSimulator.id,
        scoreValue: score,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.scores.leaderboard.byGame(runningSimulator.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.scores.user(user.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.scores.leaderboard.global });

      alert(`Score of ${score} registered successfully for ${runningSimulator.title}!`);
      onRefreshMetrics();
    } catch (err) {
      console.error("Score submit error:", err);
      alert("Failed to submit score.");
    }
  }, [runningSimulator, user.id, queryClient, onRefreshMetrics]);

  const handleDeleteSimulator = async (simId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this simulator?")) return;
    try {
      await simulatorApi.delete(simId);
      queryClient.invalidateQueries({ queryKey: queryKeys.simulators.all });
      if (onSimulatorDeleted) onSimulatorDeleted(simId);
    } catch (err) {
      console.error(err);
      alert("Failed to delete simulator.");
    }
  };



  const accentColor = user?.accentColor || "";

  return (
    <div className="w-full h-full flex flex-col animate-fade-in relative">
      {!runningSimulator ? (
        // -------- NOT RUNNING – show list view --------
        <div className="w-full max-w-7xl mx-auto h-full overflow-y-auto p-2 md:p-4 space-y-6 scrollbar-none">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={activeCategory === cat && accentColor ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                  className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-300 whitespace-nowrap ${activeCategory === cat
                    ? "bg-purple-600 text-white shadow-md border border-purple-600"
                    : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search simulators..."
                  value={rawSearchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-purple-500 dark:focus:border-purple-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
              {onNewSimulator && (
                <button
                  onClick={onNewSimulator}
                  style={accentColor ? { backgroundColor: accentColor } : {}}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm shrink-0 transition"
                >
                  <Plus className="w-4 h-4" /> New Simulator
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSimulators.map((sim) => (
              <div
                key={sim.id}
                onClick={() => handleStartSimulator(sim)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                  <img
                    src={sim.thumbnail || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80"}
                    alt={sim.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-90" />
                  <div className="absolute top-3 left-3 flex gap-1.5 items-center">
                    <span
                      className="bg-purple-600/90 backdrop-blur-md text-white text-[9px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-sm"
                      style={accentColor ? { backgroundColor: accentColor } : {}}
                    >
                      <BarChart2 className="w-2.5 h-2.5" /> Simulator
                    </span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                    <div
                      className="p-3.5 rounded-full bg-purple-600 text-white shadow-xl transform scale-100 md:scale-90 group-hover:scale-100 transition-transform duration-300"
                      style={accentColor ? { backgroundColor: accentColor } : {}}
                    >
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1 gap-4">
                  <div>
                    <h3
                      className="text-md font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
                    >
                      {sim.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {sim.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-3 text-[10px] text-slate-500 dark:text-slate-500 font-mono">
                    <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1" style={accentColor ? { color: accentColor } : {}}>
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-ping" style={accentColor ? { backgroundColor: accentColor } : {}}></span> Active Model
                    </span>
                    {user.role === 'ADMIN' && (
                      <div className="flex items-center gap-3">
                        {onEditSimulator && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditSimulator(sim.id);
                            }}
                            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 font-bold uppercase transition text-[9px] flex items-center gap-0.5"
                            style={accentColor ? { color: accentColor } : {}}
                          >
                            <Edit className="w-2.5 h-2.5" /> Edit
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeleteSimulator(sim.id, e)}
                          className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 font-bold uppercase transition text-[9px] flex items-center gap-0.5"
                        >
                          <Trash2 className="w-2.5 h-2.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredSimulators.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 font-mono text-xs">
                <Calculator className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3 animate-pulse" />
                No simulators found. Create your first simulator model!
              </div>
            )}
          </div>
        </div>
      ) : (
        // -------- RUNNING – full screen simulator --------
        <div className="relative w-full h-full flex flex-col overflow-hidden">
          <button
            onClick={handleExitSimulator}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-xl text-white/80 hover:text-white transition-colors shadow-lg border border-white/10"
            title="Close Simulator"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex-1 w-full h-full bg-white dark:bg-slate-950 overflow-hidden">
            {loadingSimulator ? (
              <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-mono text-xs gap-2">
                <Cpu className="w-5 h-5 animate-spin text-purple-500" style={accentColor ? { color: accentColor } : {}} />
                Loading simulator engine...
              </div>
            ) : simulatorCode ? (
              <DynamicGameRunner
                jsCode={simulatorCode}
                onScoreSubmit={handleScoreSubmit}
                gameId={runningSimulator.id}
                userId={user.id}
                gameTitle={runningSimulator.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="text-center p-8 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-md">
                  <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
                  <h4 className="text-md font-bold text-red-600 dark:text-red-500">Simulator Error</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-mono">
                    No valid TSX code found for this simulator.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default SimulatorView;
