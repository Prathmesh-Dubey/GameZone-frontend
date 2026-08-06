import React, { useState, useEffect } from "react";
import { Game } from "../types";
import { scoreApi, userApi, gameApi } from "../api/api";
import { useGames, useGlobalLeaderboard, useLeaderboard, useUsers } from '../hooks';
import { useQueryClient } from "@tanstack/react-query";
import GlobalHallOfFame from "./LeaderboardView/GlobalHallOfFame";
import ArcadeLeaderboard from "./LeaderboardView/ArcadeLeaderboard";
import { Trophy } from "lucide-react";

interface LeaderboardViewProps {
  games?: Game[];
  refreshTrigger: number;
  onViewProfile?: (userId: string) => void;
  onPlayGame?: (game: Game) => void;
}

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  avatarSeed?: string;
  scoreValue: number;
  createdAt: string;
}

const LeaderboardView = React.memo(({ refreshTrigger, onViewProfile, onPlayGame }: LeaderboardViewProps) => {
  const [selectedGameId, setSelectedGameId] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: globalRanksData = [], isLoading: isLoadingGlobal } = useGlobalLeaderboard();
  const globalRanks = globalRanksData.slice(0, 3);

  const { data: localGames = [], isLoading: isLoadingGames } = useGames();

  useEffect(() => {
    if (localGames.length > 0 && !selectedGameId) {
      setSelectedGameId(localGames[0].id);
    }
  }, [localGames, selectedGameId]);

  const { data: scores = [], isLoading: isLoadingScores } = useLeaderboard(selectedGameId);

  // Extract unique user IDs from scores to batch fetch
  const userIds = Array.from(new Set(scores.map(s => s.userId)));
  const { data: users = [], isLoading: isLoadingUsers } = useUsers(userIds);

  // Combine scores with user data
  const leaderboard: LeaderboardEntry[] = scores.map(score => {
    const user = users.find(u => u.id === score.userId);
    return {
      id: score.id,
      userId: score.userId,
      username: user?.username || "Unknown",
      avatarUrl: user?.avatarUrl || "",
      avatarSeed: user?.avatarSeed || "",
      scoreValue: score.scoreValue,
      createdAt: score.playedAt,
    };
  });

  const loading = isLoadingGlobal || isLoadingGames || isLoadingScores || isLoadingUsers;

  return (
    <div className="max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6 animate-fade-in pb-12">

      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" /> Arcade Leaderboards
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Check out live ranking stats. High scores are calculated per player.</p>
      </div>

      <div className="shrink-0 w-full overflow-x-auto scrollbar-none pb-2">
        <GlobalHallOfFame
          globalRanks={globalRanks}
          loading={loading}
          onViewProfile={onViewProfile}
        />
      </div>

      <div className="w-full">
        <ArcadeLeaderboard
          localGames={localGames}
          selectedGameId={selectedGameId}
          setSelectedGameId={setSelectedGameId}
          leaderboard={leaderboard}
          loading={loading}
          onViewProfile={onViewProfile}
          onPlayGame={onPlayGame}
        />
      </div>

    </div>
  );
});

export default LeaderboardView;
