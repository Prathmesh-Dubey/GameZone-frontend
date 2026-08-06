import React, { useState } from "react";
import { Achievement } from "../../api/api";
import { Award, Sparkles, Lock, ChevronDown, ChevronUp } from "lucide-react";

interface AchievementListProps {
  achievements: Achievement[];
  unlockedIds: string[];
}

export default function AchievementList({ achievements, unlockedIds }: AchievementListProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md flex flex-col overflow-hidden">
      {/* Header / Toggle */}
      <div 
        className="p-5 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-500" /> Unlockable Achievements
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit high scores in the Arcade to earn glowing badges. ({unlockedIds.length}/{achievements.length} Unlocked)
          </p>
        </div>
        <div className="text-slate-400 dark:text-slate-500">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-5 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach) => {
              const isUnlocked = unlockedIds.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3 ${
                    isUnlocked
                      ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-slate-900 dark:text-amber-50 shadow-sm"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      isUnlocked
                        ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {isUnlocked ? (
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-tight">
                      {ach.title}
                    </h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1.5 leading-tight">
                      {ach.description}
                    </p>
                    <span className="text-[9px] text-blue-600 dark:text-blue-400 font-mono uppercase font-bold mt-2.5 block">
                      Target: {ach.requiredScore} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
