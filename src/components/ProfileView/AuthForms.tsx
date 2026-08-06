import React, { useState } from "react";
import { User, authApi, userApi } from "../../api/api";
import { UserCog, AtSign, Key, User as UserIcon, Mail } from "lucide-react";

interface AuthFormsProps {
  onUserChanged: (newUser: User) => void;
}

export default function AuthForms({ onUserChanged }: AuthFormsProps) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("player");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const loggedInUser = await authApi.login({
        identifier: loginIdentifier,
        password: loginPassword,
      });
      onUserChanged(loggedInUser);
      setLoginIdentifier("");
      setLoginPassword("");
    } catch (err: any) {
      setAuthError(err.message || "Login failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      // Check username uniqueness
      try {
        const existingUsers = await userApi.getAll();
        const isTaken = existingUsers.some(
          (u) => u.username.toLowerCase() === regUsername.trim().toLowerCase()
        );
        if (isTaken) {
          setAuthError(`Username "${regUsername.trim()}" is already taken. Please choose a unique username.`);
          setAuthLoading(false);
          return;
        }
      } catch (e) {
        console.warn("User uniqueness check warning:", e);
      }

      const newUser = await authApi.register({
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword,
        role: regRole,
      });
      onUserChanged(newUser);
      setRegUsername("");
      setRegEmail("");
      setRegPassword("");
      setRegRole("player");
    } catch (err: any) {
      setAuthError(err.message || "Registration failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <UserCog className="w-12 h-12 text-blue-500 mx-auto mb-2" />
          <h2 className="text-xl font-bold text-slate-900">
            {isLoginMode ? "Welcome Back" : "Join the Game"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isLoginMode
              ? "Log in to access your profile and stats"
              : "Create an account to start tracking your scores"}
          </p>
        </div>

        {authError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg mb-4">
            {authError}
          </div>
        )}

        {isLoginMode ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] text-slate-500 font-mono block mb-1">
                Username or Email
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-900 focus:outline-none transition-all placeholder:text-slate-400"
                  placeholder="john_doe or email@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-mono block mb-1">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-900 focus:outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              {authLoading ? "Signing in..." : "Log In"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(false);
                setAuthError("");
              }}
              className="text-[10px] text-blue-600 hover:text-blue-700 font-medium transition text-center mt-2"
            >
              Don't have an account? Register
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="text-[10px] text-slate-500 font-mono block mb-1">
                Username
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-900 focus:outline-none transition-all placeholder:text-slate-400"
                  placeholder="cool_gamer"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-mono block mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-900 focus:outline-none transition-all placeholder:text-slate-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-mono block mb-1">
                Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg pl-10 pr-3 py-2 text-xs text-slate-900 focus:outline-none transition-all placeholder:text-slate-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 font-mono block mb-1">
                Role (optional)
              </label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none transition-all"
              >
                <option value="player">Player</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              {authLoading ? "Creating account..." : "Create Account"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLoginMode(true);
                setAuthError("");
              }}
              className="text-[10px] text-blue-600 hover:text-blue-700 font-medium transition text-center mt-2"
            >
              Already have an account? Log in
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
