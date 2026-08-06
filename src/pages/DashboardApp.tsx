import React, { useState, useEffect, useCallback } from "react";
import { User, Game } from "../types";
import DashboardOverview from "../components/DashboardOverview";
import ArcadeView from "../components/ArcadeView";
import SimulatorView from "../components/SimulatorView";
import LeaderboardView from "../components/LeaderboardView";
import ProfileView from "../components/ProfileView";
import CreatorView from "../components/CreatorView";
import PlayerProfile from "../components/PlayerProfile";
import NotificationBell from "../components/NotificationBell";
import AdminNotifications from "../components/AdminNotifications";
import { NotificationProvider } from "../context/NotificationContext";
import { useGames } from '../hooks';
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryKeys";
import { simulatorApi, scoreApi, gameApi } from "../api/api";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Gamepad2,
  Trophy,
  Cpu,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  Search,
  Bell,
  Moon,
  Sun,
  Calculator,
  Sparkles,
} from "lucide-react";

export default function DashboardApp() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem("activeTab") || "overview";
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  const queryClient = useQueryClient();
  const { data: games = [], isLoading: isLoadingGames } = useGames();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [bootLoading, setBootLoading] = useState<boolean>(true);
  const loading = bootLoading || isLoadingGames;
  const [searchGlobal, setSearchGlobal] = useState<string>("");
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [creatorMode, setCreatorMode] = useState<"game" | "simulator">("game");
  const [viewingPlayerId, setViewingPlayerId] = useState<string | null>(null);

  // Telemetry metric simulations
  const [cpuVal, setCpuVal] = useState(24);
  const [memVal, setMemVal] = useState(4.2);
  const [fpsVal, setFpsVal] = useState(144);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuVal(Math.floor(18 + Math.random() * 10));
      setMemVal(parseFloat((4.1 + Math.random() * 0.3).toFixed(1)));
      setFpsVal(Math.floor(141 + Math.random() * 5));
    }, 3000);

    // Initialize theme from local storage
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }

    return () => clearInterval(interval);
  }, []);

  // Apply accent color globally
  useEffect(() => {
    if (currentUser?.accentColor) {
      document.documentElement.style.setProperty('--color-blue-500', currentUser.accentColor);
      document.documentElement.style.setProperty('--color-blue-600', currentUser.accentColor);
      document.documentElement.style.setProperty('--color-purple-500', currentUser.accentColor);
      document.documentElement.style.setProperty('--color-purple-600', currentUser.accentColor);
      document.documentElement.style.setProperty('--color-indigo-500', currentUser.accentColor);
      document.documentElement.style.setProperty('--color-indigo-600', currentUser.accentColor);
    } else {
      document.documentElement.style.removeProperty('--color-blue-500');
      document.documentElement.style.removeProperty('--color-blue-600');
      document.documentElement.style.removeProperty('--color-purple-500');
      document.documentElement.style.removeProperty('--color-purple-600');
      document.documentElement.style.removeProperty('--color-indigo-500');
      document.documentElement.style.removeProperty('--color-indigo-600');
    }
  }, [currentUser?.accentColor]);

  // Authenticate default user on start
  useEffect(() => {
    async function bootApp() {
      try {
        setBootLoading(true);
        const saved = localStorage.getItem("gamezone_user");
        if (saved) {
          setCurrentUser(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Boot strap load failure:", err);
      } finally {
        setBootLoading(false);
      }
    }
    bootApp();
  }, []);

  // FORCE cache all essential data on mount
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.games.list(),
      queryFn: gameApi.getAll,
    });

    queryClient.prefetchQuery({
      queryKey: queryKeys.simulators.list(),
      queryFn: simulatorApi.getAll,
    });

    queryClient.prefetchQuery({
      queryKey: queryKeys.scores.leaderboard.global,
      queryFn: scoreApi.getGlobalLeaderboard,
    });

    // Log cache size as requested
    console.log('📊 Cache:', queryClient.getQueryCache().getAll().length);
  }, [queryClient]);

  const handleRefreshMetrics = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleUserChanged = (newUser: User) => {
    setCurrentUser(newUser);
    localStorage.setItem("gamezone_user", JSON.stringify(newUser));
    handleRefreshMetrics();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("gamezone_user");
    setActiveTab("overview");
    setEditingGameId(null);
    setViewingPlayerId(null);
    navigate("/");
  };

  const handleGameCreated = (newGame: Game) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.games.list() });
    handleRefreshMetrics();
    setEditingGameId(null);
  };

  const handleGameDeleted = (gameId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.games.list() });
    handleRefreshMetrics();
  };

  const handleSearchChange = (val: string) => {
    setSearchGlobal(val);
    if (activeTab !== "arcade" && activeTab !== "simulators") {
      setActiveTab("arcade");
    }
  };

  const handlePrefetchSimulators = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.simulators.list(),
      queryFn: simulatorApi.getAll,
      staleTime: 5 * 60 * 1000,
    });
  };

  const handlePrefetchLeaderboard = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.scores.leaderboard.global,
      queryFn: scoreApi.getGlobalLeaderboard,
      staleTime: 5 * 60 * 1000,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center text-slate-900 dark:text-slate-100 font-mono text-xs transition-colors">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md flex items-center justify-center mb-4 animate-bounce">
          <Gamepad2 className="w-5 h-5 fill-white text-white" />
        </div>
        <p className="tracking-widest uppercase font-bold text-slate-700">BOOTING GAMEZONE TELEMETRY SYSTEM v4.12.0...</p>
        <span className="text-slate-500 mt-1.5 animate-pulse">Establishing secure handshake with virtual sandbox</span>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <NotificationProvider>
      <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex overflow-hidden font-sans selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100 transition-colors">

        {/* LEFT SIDEBAR (Desktop) */}
        <aside className="w-64 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 flex flex-col md:flex hidden shrink-0 select-none transition-colors">
          {/* Brand Logo Header */}
          <div className="p-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("overview")}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm flex items-center justify-center text-white">
                <Gamepad2 className="w-4 h-4 fill-white text-white" />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase italic text-slate-900 dark:text-white">GameZone</span>
            </div>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="flex-1 px-4 space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full px-4 py-3 flex items-center gap-3 rounded-r-md transition-colors text-left ${activeTab === "overview"
                ? "bg-slate-100 dark:bg-slate-800/50 border-l-2 border-blue-600 text-blue-700 dark:text-blue-400 font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/30"
                }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("arcade")}
              className={`w-full px-4 py-3 flex items-center gap-3 rounded-r-md transition-colors text-left ${activeTab === "arcade"
                ? "bg-slate-100 dark:bg-slate-800/50 border-l-2 border-blue-600 text-blue-700 dark:text-blue-400 font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/30"
                }`}
            >
              <Gamepad2 className="w-5 h-5" />
              <span className="text-sm">Game Library</span>
            </button>

            <button
              onClick={() => setActiveTab("simulators")}
              onMouseEnter={handlePrefetchSimulators}
              className={`w-full px-4 py-3 flex items-center gap-3 rounded-r-md transition-colors text-left ${activeTab === "simulators"
                ? "bg-slate-100 dark:bg-slate-800/50 border-l-2 border-purple-600 text-purple-700 dark:text-purple-400 font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/30"
                }`}
            >
              <Calculator className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Simulators</span>
            </button>

            <button
              onClick={() => setActiveTab("leaderboard")}
              onMouseEnter={handlePrefetchLeaderboard}
              className={`w-full px-4 py-3 flex items-center gap-3 rounded-r-md transition-colors text-left ${activeTab === "leaderboard"
                ? "bg-slate-100 dark:bg-slate-800/50 border-l-2 border-blue-600 text-blue-700 dark:text-blue-400 font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/30"
                }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="text-sm">Rankings</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full px-4 py-3 flex items-center gap-3 rounded-r-md transition-colors text-left ${activeTab === "profile"
                ? "bg-slate-100 dark:bg-slate-800/50 border-l-2 border-blue-600 text-blue-700 dark:text-blue-400 font-semibold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/30"
                }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-sm">Profile</span>
            </button>

            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => setActiveTab("admin_notifications")}
                className={`w-full px-4 py-3 flex items-center gap-3 rounded-r-md transition-colors text-left ${activeTab === "admin_notifications"
                  ? "bg-slate-100 dark:bg-slate-800/50 border-l-2 border-red-500 text-red-600 dark:text-red-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  }`}
              >
                <Bell className="w-5 h-5 text-red-500" />
                <span className="text-sm">Notifications</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 flex items-center gap-3 rounded-r-md transition-colors text-left text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </nav>

          {/* Unified Add Entity CTA Button */}
          {currentUser.role === 'ADMIN' && (
            <div className="p-6">
              <button
                onClick={() => {
                  setEditingGameId(null);
                  setActiveTab("creator");
                }}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-md border border-transparent transition-all text-xs text-white"
              >
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                Create Game / Simulator
              </button>
            </div>
          )}
        </aside>

        {/* MAIN VIEWPORT FRAME */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">

          {/* DESKTOP TOP HEADER */}
          <header className="h-20 md:flex hidden items-center justify-between px-10 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md shrink-0 z-10 transition-colors">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search library..."
                value={searchGlobal}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full py-2 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
              />
              <Search className="absolute left-4 top-2.5 w-5 h-5 text-slate-400" />
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  const newDark = !document.documentElement.classList.contains("dark");
                  document.documentElement.classList.toggle("dark", newDark);
                  localStorage.setItem("theme", newDark ? "dark" : "light");
                }}
                className="p-2 rounded-full hover:bg-slate-100 transition text-slate-500"
                title="Toggle Dark Mode"
              >
                <Moon className="w-5 h-5 hidden dark:block" />
                <Sun className="w-5 h-5 block dark:hidden" />
              </button>
              <NotificationBell />

              <div
                onClick={() => setActiveTab("profile")}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{currentUser.username}</p>
                  <p className="text-[10px] text-green-600 dark:text-green-400 font-mono tracking-widest uppercase">Online</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-blue-100 dark:border-blue-900/50 overflow-hidden shadow-sm transition group-hover:scale-105">
                  <img
                    src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.avatarSeed || currentUser.username}`}
                    alt={currentUser.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* MOBILE TOP HEADER */}
          <header className="h-16 md:hidden flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-md shrink-0 z-10 transition-colors">
            <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => setActiveTab("overview")}>
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm flex items-center justify-center shrink-0">
                <Gamepad2 className="w-4 h-4 fill-white text-white" />
              </div>
              <span className="font-black text-md tracking-tighter uppercase italic text-slate-900 dark:text-white">GameZone</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  const newDark = !document.documentElement.classList.contains("dark");
                  document.documentElement.classList.toggle("dark", newDark);
                  localStorage.setItem("theme", newDark ? "dark" : "light");
                }}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400 shrink-0"
                title="Toggle Dark Mode"
              >
                <Moon className="w-5 h-5 hidden dark:block" />
                <Sun className="w-5 h-5 block dark:hidden" />
              </button>

              <div className="shrink-0 flex items-center">
                <NotificationBell />
              </div>

              <div
                onClick={() => setActiveTab("profile")}
                className="flex items-center cursor-pointer shrink-0"
              >
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 overflow-hidden shadow-sm">
                  <img
                    src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser.avatarSeed || currentUser.username}`}
                    alt={currentUser.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT VIEWPORT CONTAINER */}
          <section className={`flex-1 scrollbar-none bg-slate-50 dark:bg-slate-950 transition-colors ${activeTab === "creator" || activeTab === "arcade" || activeTab === "simulators" || activeTab === "playerProfile" ? "p-3 pb-24 md:p-5 md:pb-5 flex flex-col overflow-hidden min-h-0" : "p-4 pb-24 md:p-10 md:pb-10 overflow-y-auto space-y-8"}`}>
            {activeTab === "overview" && (
              <DashboardOverview
                user={currentUser}
                onNavigateTab={setActiveTab}
                refreshTrigger={refreshTrigger}
              />
            )}

            {activeTab === "admin_notifications" && (
              <AdminNotifications user={currentUser} />
            )}

            {activeTab === "arcade" && (
              <ArcadeView
                user={currentUser}
                onRefreshMetrics={handleRefreshMetrics}
                games={games}
                onGameDeleted={handleGameDeleted}
                onEditGame={(gameId) => {
                  setEditingGameId(gameId);
                  setCreatorMode("game");
                  setActiveTab("creator");
                }}
                searchGlobal={searchGlobal}
                setSearchGlobal={setSearchGlobal}
              />
            )}

            {activeTab === "simulators" && (
              <SimulatorView
                user={currentUser}
                onRefreshMetrics={handleRefreshMetrics}
                onSimulatorDeleted={handleGameDeleted}
                onEditSimulator={(simId) => {
                  setEditingGameId(simId);
                  setCreatorMode("simulator");
                  setActiveTab("creator");
                }}
                onNewSimulator={() => {
                  setEditingGameId(null);
                  setCreatorMode("simulator");
                  setActiveTab("creator");
                }}
                searchGlobal={searchGlobal}
                setSearchGlobal={setSearchGlobal}
              />
            )}

            {activeTab === "leaderboard" && (
              <LeaderboardView
                games={games}
                refreshTrigger={refreshTrigger}
                onViewProfile={(userId) => {
                  setViewingPlayerId(userId);
                  setActiveTab("playerProfile");
                }}
                onPlayGame={(game) => {
                  setSearchGlobal(game.title);
                  if (game.type === "simulator") setActiveTab("simulators");
                  else setActiveTab("arcade");
                }}
              />
            )}

            {activeTab === "creator" && (
              <CreatorView
                onGameCreated={handleGameCreated}
                editGameId={editingGameId}
                onEditComplete={() => setEditingGameId(null)}
                mode={creatorMode}
              />
            )}

            {activeTab === "profile" && (
              <ProfileView
                user={currentUser}
                onUserChanged={handleUserChanged}
                refreshTrigger={refreshTrigger}
                onLogout={handleLogout}
              />
            )}

            {activeTab === "playerProfile" && viewingPlayerId && (
              <PlayerProfile
                userId={viewingPlayerId}
                games={games}
                onBack={() => {
                  setViewingPlayerId(null);
                  setActiveTab("leaderboard");
                }}
              />
            )}
          </section>

          {/* BOTTOM TELEMETRY STATUS BAR */}
          <footer className="hidden md:flex h-12 bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 items-center justify-between px-6 md:px-10 shrink-0 text-xs font-mono select-none z-10 transition-colors">
            <div className="flex gap-6 sm:gap-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-telemetry"></div>
                <span className="text-[10px] text-slate-500 font-mono uppercase">CPU: {cpuVal}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-telemetry"></div>
                <span className="text-[10px] text-slate-500 font-mono uppercase">MEM: {memVal}GB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse-telemetry"></div>
                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">FPS: {fpsVal}</span>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
              GameZone Client v4.12.0
            </div>
          </footer>

        </div>

        {/* MOBILE FIXED NAVIGATION DOCK */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-4 py-2 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.3)] flex items-center justify-around w-full select-none transition-colors pb-safe">

          <button
            onClick={() => { setActiveTab("overview"); setSearchGlobal(""); setEditingGameId(null); }}
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-w-[50px] ${activeTab === "overview"
              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[9px]">Home</span>
          </button>

          <button
            onClick={() => { setActiveTab("arcade"); setSearchGlobal(""); setEditingGameId(null); }}
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-w-[50px] ${activeTab === "arcade"
              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            <Gamepad2 className="w-5 h-5" />
            <span className="text-[9px]">Games</span>
          </button>

          <button
            onClick={() => { setActiveTab("simulators"); setSearchGlobal(""); setEditingGameId(null); }}
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-w-[50px] ${activeTab === "simulators"
              ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            <Calculator className="w-5 h-5" />
            <span className="text-[9px]">Sims</span>
          </button>

          <button
            onClick={() => { setActiveTab("leaderboard"); setSearchGlobal(""); setEditingGameId(null); }}
            className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-w-[50px] ${activeTab === "leaderboard"
              ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[9px]">Rank</span>
          </button>

          {currentUser.role === 'ADMIN' && (
            <button
              onClick={() => { setActiveTab("creator"); setSearchGlobal(""); }}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-w-[50px] ${activeTab === "creator"
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <Cpu className="w-5 h-5" />
              <span className="text-[9px]">Build</span>
            </button>
          )}

          {currentUser.role === 'ADMIN' ? (
            <button
              onClick={() => { setActiveTab("admin_notifications"); setSearchGlobal(""); setEditingGameId(null); }}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-w-[50px] ${activeTab === "admin_notifications"
                ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <Bell className="w-5 h-5" />
              <span className="text-[9px]">Alerts</span>
            </button>
          ) : (
            <button
              onClick={() => { setActiveTab("profile"); setSearchGlobal(""); setEditingGameId(null); }}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl text-xs font-bold transition-all shrink-0 min-w-[50px] ${activeTab === "profile"
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-[9px]">Me</span>
            </button>
          )}

        </nav>

      </div>
    </NotificationProvider>
  );
}
