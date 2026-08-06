// ============================================================
//  TYPES (explicit, matching api.ts)
// ============================================================

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  profileId?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  dateOfBirth?: string | null;
  website?: string | null;
  accentColor?: string | null;
  avatarSeed?: string | null;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface ProfileRequest {
  userId?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  dateOfBirth?: string | null;
  website?: string | null;
  accentColor?: string | null;
  avatarSeed?: string | null;
}

export interface ProfileResponse {
  id: string;
  userId: string;
  bio: string | null;
  avatarUrl: string | null;
  location: string | null;
  dateOfBirth: string | null;
  website: string | null;
  accentColor: string | null;
  avatarSeed: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  thumbnail: string | null;
  active: boolean;
  gameCode?: string | null;
  isDynamic?: boolean;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GameRequest {
  title: string;
  description?: string | null;
  category?: string | null;
  thumbnail?: string | null;
  active?: boolean;
  gameCode?: string | null;
  isDynamic?: boolean;
  type?: string;
}

export interface Simulator {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  thumbnail: string | null;
  active: boolean;
  simulatorCode?: string | null;
  gameCode?: string | null;
  isDynamic?: boolean;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SimulatorRequest {
  title: string;
  description?: string | null;
  category?: string | null;
  thumbnail?: string | null;
  active?: boolean;
  simulatorCode?: string | null;
  gameCode?: string | null;
  isDynamic?: boolean;
  type?: string;
}

export interface Score {
  id: string;
  scoreValue: number;
  playedAt: string;
  userId: string;
  gameId: string;
}

export interface ScoreRequest {
  userId: string;
  gameId: string;
  scoreValue: number;
}

export interface GameSession {
  id: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  userId: string;
  gameId: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  requiredScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface AchievementRequest {
  title: string;
  description?: string | null;
  requiredScore: number;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  achievementTitle: string;
  achievementDescription: string;
  unlockedAt: string;
}