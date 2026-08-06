import React, { useState, useEffect } from "react";
import { Timer, Award, Activity, Gamepad2, Users, Flame, ChevronRight, TrendingUp } from "lucide-react";
import { User, GameSession } from "../types";
import { sessionApi, scoreApi, userAchievementApi, Score } from "../api/api";
import { useTotalPlayTime, useSessionCount, useUserAchievementsCount, useUserScores, useDailyActiveUsers, useUserData } from '../hooks';

interface DashboardOverviewProps {
  user: User;
  onNavigateTab: (tab: string) => void;
  refreshTrigger: number;
}

const DashboardOverview = React.memo(({ user, onNavigateTab, refreshTrigger }: DashboardOverviewProps) => {
  const todayStr = new Date().toISOString().split("T")[0] + "T00:00:00";
  const { data: dauData, isLoading: isLoadingDau } = useDailyActiveUsers(todayStr);
  const {
    totalTime,
    sessionCount,
    achievementCount: unlockedCount,
    scores: rawScores,
    isLoading: isLoadingUserData
  } = useUserData(user.id);

  const rawPlayTime = totalTime || 0;
  
  const dauCount = dauData || 1;
  const totalPlayTime = `${Math.ceil(rawPlayTime / 60)}m`;
  const scores = [...rawScores].sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime());
  const loading = isLoadingUserData || isLoadingDau;

  const maxScore = scores.length > 0 ? Math.max(...scores.map(s => s.scoreValue)) : 0;
  const recentScores = scores.slice(0, 4);

  // Generate coordinates for custom animated SVG line graph
  const points = scores.slice(0, 8).reverse();
  const graphWidth = 500;
  const graphHeight = 150;
  const padding = 25;

  const svgPoints = points.map((p, idx) => {
    if (points.length <= 1) return { x: graphWidth / 2, y: graphHeight / 2 };
    const x = padding + (idx / (points.length - 1)) * (graphWidth - padding * 2);
    const y = graphHeight - padding - (p.scoreValue / (maxScore || 100)) * (graphHeight - padding * 2);
    return { x, y };
  });

  const pathD = svgPoints.length > 0
    ? `M ${svgPoints[0].x} ${svgPoints[0].y} ` + svgPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ")
    : "";

  const areaD = svgPoints.length > 0
    ? `${pathD} L ${svgPoints[svgPoints.length - 1].x} ${graphHeight - padding} L ${svgPoints[0].x} ${graphHeight - padding} Z`
    : "";

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-8 animate-fade-in">

      {/* Featured Hero Banner */}
      <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden group border border-slate-200 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent z-10"></div>
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10 z-20 space-y-2 max-w-lg">
          <span className="inline-block px-2 py-0.5 bg-blue-500/20 text-blue-200 text-[10px] font-bold uppercase tracking-widest rounded border border-blue-500/40">
            Featured Today
          </span>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-white uppercase">
            CYBERPUNK RELOADED
          </h1>
          <p className="text-white/80 text-xs md:text-sm leading-relaxed">
            Experience the neon-soaked virtual arcade in high fidelity telemetry. Version 2.0.4 patch is now live with custom-built TSX sandbox integrations.
          </p>
          <div className="flex gap-4 pt-3">
            <button
              onClick={() => onNavigateTab("arcade")}
              className="px-6 py-2 bg-white text-black text-xs font-black rounded-xl hover:bg-gray-200 active:scale-95 transition-all shadow-lg"
            >
              Play Now
            </button>
            <button
              onClick={() => onNavigateTab("creator")}
              className="px-6 py-2 bg-white/20 text-white text-xs font-bold rounded-xl hover:bg-white/30 border border-white/20 backdrop-blur-md active:scale-95 transition-all"
            >
              Build Game
            </button>
          </div>
        </div>
        <div className="w-full h-full bg-blue-900 flex items-center justify-center text-white/20 italic">
          <div className="w-full h-full bg-gradient-to-br from-blue-800 to-indigo-900 opacity-90"></div>
        </div>
      </div>

      {/* Overview Metric Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

        {/* Play Time */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-md flex items-center gap-4 relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300">
          <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
            <Timer className="w-6 h-6 group-hover:scale-110 transition" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block tracking-wider">Play Time</span>
            <span className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{loading ? "..." : totalPlayTime}</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full filter blur-xl pointer-events-none" />
        </div>

        {/* Sessions Completed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-md flex items-center gap-4 relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300">
          <div className="p-3 rounded-xl bg-pink-100 text-pink-600">
            <Gamepad2 className="w-6 h-6 group-hover:scale-110 transition" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block tracking-wider">Sessions</span>
            <span className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{loading ? "..." : sessionCount}</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full filter blur-xl pointer-events-none" />
        </div>

        {/* Medals Unlocked */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-md flex items-center gap-4 relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
            <Award className="w-6 h-6 group-hover:scale-110 transition" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block tracking-wider">Achievements</span>
            <span className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{loading ? "..." : unlockedCount}</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full filter blur-xl pointer-events-none" />
        </div>

        {/* Daily Active Users (DAU) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-md flex items-center gap-4 relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300">
          <div className="p-3 rounded-xl bg-green-100 text-green-600">
            <Users className="w-6 h-6 group-hover:scale-110 transition" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono block tracking-wider">Zone Users (DAU)</span>
            <span className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{loading ? "..." : dauCount}</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-transparent rounded-full filter blur-xl pointer-events-none" />
        </div>

      </div>

      {/* Main Grid: Analytical Chart and Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Glow Analytics Chart Panel */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-md flex flex-col gap-6 relative">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-500" /> Score Latency & Progress
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Telemetry mapping your last {points.length} submitted match scores.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-blue-600 font-mono font-bold">Personal High: {maxScore} pts</span>
            </div>
          </div>

          {/* SVG Canvas Chart */}
          <div className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 relative overflow-hidden">
            {points.length > 0 ? (
              <div className="relative">
                <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1={padding} y1={padding} x2={graphWidth - padding} y2={padding} stroke="rgba(0, 0, 0, 0.05)" strokeDasharray="3" />
                  <line x1={padding} y1={graphHeight / 2} x2={graphWidth - padding} y2={graphHeight / 2} stroke="rgba(0, 0, 0, 0.05)" strokeDasharray="3" />
                  <line x1={padding} y1={graphHeight - padding} x2={graphWidth - padding} y2={graphHeight - padding} stroke="rgba(0, 0, 0, 0.1)" />

                  {/* Shaded Area */}
                  {areaD && <path d={areaD} fill="url(#chartGlow)" />}

                  {/* Plot Path Line */}
                  {pathD && <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" className="drop-shadow-[0_2px_8px_rgba(59,130,246,0.4)]" />}

                  {/* Node Dots */}
                  {svgPoints.map((pt, i) => (
                    <g key={i} className="group/dot cursor-pointer">
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#f8fafc" stroke="#60a5fa" strokeWidth="2" />
                      <circle cx={pt.x} cy={pt.y} r="10" fill="#60a5fa" opacity="0" className="group-hover/dot:opacity-25 transition" />
                    </g>
                  ))}
                </svg>
                {/* Custom tooltip indicators */}
                <div className="absolute bottom-1 right-2 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                  <span>Match progression</span>
                </div>
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 font-mono text-xs">
                <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2 animate-pulse" />
                No match sessions logged yet. Join the Arcade!
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => onNavigateTab("arcade")}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold transition group"
            >
              Play Games <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </div>

        {/* Recent Session Logs Feed */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 shadow-md flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" /> Recent Session Logs
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Chronology of score submissions.</p>
          </div>

          {recentScores.length > 0 ? (
            <div className="flex flex-col gap-3">
              {recentScores.map((sc, idx) => {
                // Formatting date
                const dateObj = new Date(sc.playedAt || Date.now());
                const timeStr = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                // Map game labels nicely
                const gameLabels: Record<string, string> = {
                  "game-snake": "Snake Arcade",
                  "game-clicker": "Hyper Clicker",
                  "game-pong": "Retro Pong"
                };
                const gameLabel = gameLabels[sc.gameId] || "Custom Arcade";

                return (
                  <div
                    key={sc.id || idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition flex justify-between items-center"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{gameLabel}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{timeStr} • Verified</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-blue-600 font-mono">+{sc.scoreValue}</span>
                      <span className="text-[9px] text-slate-400 block uppercase font-mono">pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center text-xs font-mono text-slate-400 dark:text-slate-500">
              No recent scores found. Get high scores!
            </div>
          )}

          <button
            onClick={() => onNavigateTab("leaderboard")}
            className="w-full text-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold py-2.5 rounded-xl transition"
          >
            Check Live Leaderboards
          </button>
        </div>

      </div>

    </div>
  );
});

export default DashboardOverview;
