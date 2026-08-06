import React, { useState } from "react";
import {
  Gamepad2,
  LogIn,
  UserPlus,
  Shield,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { User, authApi, userApi } from "../api/api";

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("USER");
  const [adminKey, setAdminKey] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Status/Error feedback
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isRegister) {
        // Enforce unique username check
        try {
          const existingUsers = await userApi.getAll();
          const isTaken = existingUsers.some(
            (u) => u.username.toLowerCase() === username.trim().toLowerCase()
          );
          if (isTaken) {
            setErrorMsg(`Username "${username.trim()}" is already taken. Username must be unique in the database.`);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.warn("User uniqueness check warning:", e);
        }

        // Register
        const data = await authApi.register({
          username: username.trim(),
          email: email.trim(),
          password,
          role,
          adminKey: role === "ADMIN" ? adminKey.trim() : undefined,
        });
        setSuccessMsg("Registration successful! Logging you in...");
        setTimeout(() => {
          onLoginSuccess(data);
        }, 1500);
      } else {
        // Login – use the input value as identifier (username or email)
        const identifier = username.trim() || email.trim();
        const data = await authApi.login({ identifier, password });
        setSuccessMsg("Welcome back, Gamer! Booting session...");
        setTimeout(() => {
          onLoginSuccess(data);
        }, 1200);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative cyber ambient glow background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg flex items-center justify-center text-white mb-3">
            <Gamepad2 className="w-6 h-6 fill-white text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-wider uppercase italic text-slate-900 dark:text-white">
            GAMEZONE PORTAL
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
            Secure client ledger entry authentication
          </p>
        </div>

        {/* Form Mode Toggle Buttons */}
        <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-950/50 p-1.5 rounded-2xl mb-6 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`py-2 px-4 rounded-xl text-xs font-extrabold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
              !isRegister
                ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Login Portal
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`py-2 px-4 rounded-xl text-xs font-extrabold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
              isRegister
                ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Sign Up
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identifier field (username or email) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono font-bold">
              {isRegister ? "Username" : "Username or Email"}
            </label>
            <input
              type="text"
              required
              value={isRegister ? username : (username || email)}
              onChange={(e) => {
                if (isRegister) {
                  setUsername(e.target.value);
                } else {
                  // In login mode, the single field works as identifier
                  setUsername(e.target.value);
                  setEmail(e.target.value);
                }
              }}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder={isRegister ? "e.g. cyber_ninja" : "Enter username or email"}
            />
          </div>

          {/* Email field (only shown on Registration) */}
          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono font-bold">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="e.g. gamer@gamezone.com"
              />
            </div>
          )}

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono font-bold">
              Access Code (Password)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl pl-4 pr-11 py-3 text-xs text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role Dropdown (only on Registration) */}
          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono font-bold">
                Player Class (Role)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none transition-all"
              >
                <option value="USER" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Standard Gamer (USER)</option>
                <option value="ADMIN" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Arcade Master (ADMIN)</option>
              </select>
            </div>
          )}

          {/* Admin Key (only on Registration when ADMIN role is selected) */}
          {isRegister && role === "ADMIN" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-red-500 dark:text-red-400 uppercase tracking-widest font-mono font-bold flex items-center gap-1">
                <Shield className="w-3 h-3" /> Admin Registration Key
              </label>
              <input
                type="password"
                required
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-red-200 dark:border-red-900/50 focus:border-red-500 dark:focus:border-red-500 rounded-xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Enter admin key..."
              />
            </div>
          )}

          {/* Feedback banners */}
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-3 text-[11px] text-red-600 dark:text-red-400 font-mono text-center leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-3 text-[11px] text-emerald-700 dark:text-emerald-400 font-mono flex items-center justify-center gap-1.5 leading-none">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 text-white font-black text-xs py-3.5 rounded-xl transition shadow-lg shadow-blue-500/20 uppercase tracking-wider font-mono flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Loading handshake...</span>
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4" /> Register New Account
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Authorize & Sign In
              </>
            )}
          </button>
        </form>


      </div>
    </div>
  );
}
