import React, { useState, useEffect } from "react";
import { User } from "../api/api";
import { UserCog, Moon, Sun, Monitor, Twitter } from "lucide-react";
import { useProfileData } from "../hooks/useProfileData";
import AuthForms from "./ProfileView/AuthForms";
import UnifiedProfile from "./ProfileView/UnifiedProfile";
import AchievementList from "./ProfileView/AchievementList";

interface ProfileViewProps {
  user: User | null;
  onUserChanged: (newUser: User) => void;
  refreshTrigger: number;
  onLogout?: () => void;
}

export default function ProfileView({
  user,
  onUserChanged,
  refreshTrigger,
  onLogout,
}: ProfileViewProps) {
  const { profile, achievements, unlockedIds, loading, updateProfile } = useProfileData(user, refreshTrigger);
  const [theme, setTheme] = useState<'social' | 'gaming'>('social');

  useEffect(() => {
    const savedTheme = localStorage.getItem('profileTheme') as 'social' | 'gaming';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeToggle = (newTheme: 'social' | 'gaming') => {
    setTheme(newTheme);
    localStorage.setItem('profileTheme', newTheme);
  };

  if (!user) {
    return <AuthForms onUserChanged={onUserChanged} />;
  }

  if (loading) {
    return (
      <div className="text-center p-12 text-slate-500 dark:text-slate-400 font-mono text-xs">
        <UserCog className="w-8 h-8 text-blue-500 dark:text-blue-400 mx-auto mb-2 animate-spin" />
        Synchronizing profile records...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 flex flex-col gap-6 animate-fade-in">
      {/* Theme Toggle Header */}
      <div className="flex justify-end items-center mb-2">
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1 flex items-center gap-1 shadow-inner">
          <button
            onClick={() => handleThemeToggle('social')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              theme === 'social' 
              ? 'bg-white dark:bg-slate-800 text-blue-500 shadow-sm' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Twitter className="w-3.5 h-3.5" /> Social
          </button>
          <button
            onClick={() => handleThemeToggle('gaming')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              theme === 'gaming' 
              ? 'bg-[#0f111a] text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] border border-purple-500/20' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Gaming
          </button>
        </div>
      </div>

      <UnifiedProfile 
        user={user}
        profile={profile}
        theme={theme}
        onLogout={onLogout}
        onUserChanged={onUserChanged}
        updateProfile={updateProfile}
      />

      <div className="mt-8">
        <AchievementList
          achievements={achievements}
          unlockedIds={unlockedIds}
        />
      </div>
    </div>
  );
}
