import React from 'react';
import { motion } from 'motion/react';
import { Gamepad2, LayoutDashboard, Calculator, BarChart3, Trophy, Bell, User, Cpu } from 'lucide-react';

const modules = [
  { name: 'Dashboard', desc: 'Overview of platform activity.', icon: LayoutDashboard, size: 'large' },
  { name: 'Game Library', desc: 'Browse uploaded games.', icon: Gamepad2, size: 'small' },
  { name: 'Simulator Library', desc: 'Explore React simulators.', icon: Calculator, size: 'small' },
  { name: 'Creator Panel', desc: 'Manage projects.', icon: Cpu, size: 'large' },
  { name: 'Analytics', desc: 'View charts and reports.', icon: BarChart3, size: 'small' },
  { name: 'Leaderboard', desc: 'Compare scores.', icon: Trophy, size: 'small' },
  { name: 'Notifications', desc: 'Stay updated.', icon: Bell, size: 'small' },
  { name: 'Profile', desc: 'Manage account.', icon: User, size: 'small' }
];

export default function Modules() {
  return (
    <section className="py-24 bg-white dark:bg-[#0B1120] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Platform Modules
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
            Everything is built into one unified interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {modules.map((mod, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 rounded-2xl p-6 transition-all hover:bg-slate-100 dark:hover:bg-white/10 group cursor-default ${
                mod.size === 'large' ? 'md:col-span-2 lg:col-span-2 row-span-2 flex flex-col justify-between min-h-[200px]' : 'col-span-1 min-h-[160px]'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-slate-200 dark:bg-[#070B16] border border-slate-300 dark:border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <mod.icon className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{mod.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{mod.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
