import React, { useState, useEffect } from "react";
import { User, Game } from "../types";
import { UserCog, MapPin, Globe, Calendar, ArrowLeft, Trophy, ShieldAlert, Award } from "lucide-react";
import { useUser, useProfile, useUserScores } from '../hooks';

interface PlayerProfileProps {
  userId: string;
  games?: Game[];
  onBack: () => void;
}

export default function PlayerProfile({ userId, games = [], onBack }: PlayerProfileProps) {
  const { data: user, isLoading: loadingUser, error: userError } = useUser(userId);
  const { data: profile } = useProfile(userId);
  const { data: rawScores = [], isLoading: loadingScores } = useUserScores(userId);

  const scores = [...rawScores].sort((a, b) => b.scoreValue - a.scoreValue);
  const loading = loadingUser || loadingScores;
  const error = userError ? (userError as Error).message : null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400 font-mono text-xs">
        <UserCog className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-spin" />
        Loading player profile...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 flex flex-col gap-4">
        <button
          onClick={onBack}
          className="self-start flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="py-16 text-center text-slate-400 dark:text-slate-500 font-mono text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <ShieldAlert className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          {error || "Player not found."}
        </div>
      </div>
    );
  }

  // Use accent color from profile or user DTO if available
  const activeAccentColor = profile?.accentColor || user.accentColor || "";

  return (
    <div className="max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6 animate-fade-in h-full overflow-hidden">
      {/* Navigation */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leaderboard
        </button>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-12 gap-8 flex-1 min-h-0 overflow-hidden scrollbar-none">
        {/* Left Column - Player Profile Details */}
        <div className="md:col-span-4 flex flex-col gap-4 md:gap-6 shrink-0 md:h-full md:overflow-y-auto scrollbar-none md:pb-8 pr-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-md flex flex-col relative overflow-hidden h-fit">
            <div
              className="absolute top-0 inset-x-0 h-16 md:h-24 opacity-20"
              style={{
                background: activeAccentColor
                  ? `linear-gradient(to right, transparent, ${activeAccentColor}, transparent)`
                  : 'linear-gradient(to right, transparent, #3b82f6, transparent)'
              }}
            />
            
            <div className="relative z-10 mt-2 md:mt-6 flex flex-row md:flex-col items-center md:text-center text-left gap-4 md:gap-0 w-full">
              <div className="rounded-2xl p-1 shadow-lg shrink-0" style={{ backgroundColor: activeAccentColor || '#3b82f6' }}>
                <img
                  src={
                    user.avatarUrl ||
                    profile?.avatarUrl ||
                    `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.avatarSeed || profile?.avatarSeed || user.username}`
                  }
                  alt={user.username}
                  className="w-16 h-16 md:w-24 md:h-24 rounded-xl bg-white dark:bg-slate-900 object-cover"
                />
              </div>
              <div className="mt-0 md:mt-5 flex-1 min-w-0">
                <h3 className="text-md font-extrabold text-slate-900 dark:text-white flex flex-wrap items-center justify-start md:justify-center gap-1.5">
                  <span className="truncate">{user.username}</span>
                  <span className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-[8px] font-bold px-2 py-0.5 rounded uppercase shrink-0">
                    {user.role || "player"}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate">{user.email}</p>
              </div>
            </div>

            <div className="mt-5 w-full flex flex-col gap-2.5 text-xs text-left border-t border-slate-200 dark:border-slate-800 pt-4">
              {profile?.bio && (
                <div className="mb-2 italic text-slate-600 dark:text-slate-300 border-l-2 border-blue-300 dark:border-blue-600/50 pl-2">
                  "{profile.bio}"
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{profile?.location || "Cosmic Sandbox"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Globe className="w-4 h-4 text-blue-500 shrink-0" />

                {profile?.website ? (
                  <a
                    href={
                      profile.website.startsWith("http")
                        ? profile.website
                        : `https://${profile.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                  >
                    {profile.website}
                  </a>
                ) : (
                  <span>N/A</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Born: {profile?.dateOfBirth || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Scores & Stats */}
        <div className="md:col-span-8 flex flex-col gap-6 flex-1 min-h-0 md:h-full overflow-hidden pl-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-md flex flex-col gap-4 h-full min-h-0">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-2 shrink-0">
              <Trophy className="w-5 h-5 text-yellow-500 shrink-0" /> Player High Scores
            </h3>

            {scores.length > 0 ? (
              <div className="overflow-y-auto overflow-x-hidden border border-slate-200 dark:border-slate-800 rounded-xl scrollbar-none w-full flex-1 min-h-0">
                <table className="w-full text-left text-sm table-fixed">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 uppercase font-mono text-slate-500 dark:text-slate-400 sticky top-0 z-10 shadow-sm text-xs">
                    <tr>
                      <th className="px-2 md:px-4 py-3 font-bold w-[50%] md:w-auto">Game</th>
                      <th className="px-2 md:px-4 py-3 font-bold w-[25%] md:w-auto">Score</th>
                      <th className="px-2 md:px-4 py-3 font-bold text-right w-[25%] md:w-auto">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {scores.map((score) => {
                      const gameInfo = games.find(g => g.id === score.gameId);
                      return (
                        <tr key={score.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-2 md:px-4 py-3 font-medium text-slate-900 dark:text-slate-200 truncate">
                            <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                              {gameInfo ? (
                                <>
                                  <img
                                    src={gameInfo.thumbnail}
                                    alt={gameInfo.title}
                                    className="w-6 h-6 md:w-8 md:h-8 rounded bg-slate-100 dark:bg-slate-800 object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                  />
                                  <span className="truncate">{gameInfo.title}</span>
                                </>
                              ) : (
                                <span className="truncate text-slate-500 dark:text-slate-400 italic">{score.gameId}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-2 md:px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400 truncate">
                            {score.scoreValue}
                          </td>
                          <td className="px-2 md:px-4 py-3 text-right text-xs text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap truncate">
                            {new Date(score.playedAt).toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", year: "2-digit" })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 font-mono text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                <Award className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                This player hasn't submitted any scores yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
