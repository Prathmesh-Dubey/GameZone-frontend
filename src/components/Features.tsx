import React from 'react';
import { motion } from 'motion/react';
import { Play, UploadCloud, Cpu, Layout, BarChart, HardDrive, Trophy, Key } from 'lucide-react';

const features = [
  {
    title: 'React TSX Execution',
    description: 'Run React-based games and simulators directly from the browser with no build steps.',
    icon: Play,
    color: 'blue'
  },
  {
    title: 'Game Hosting',
    description: 'Upload, organize, and manage complex HTML5 React games seamlessly.',
    icon: UploadCloud,
    color: 'purple'
  },
  {
    title: 'Simulator Platform',
    description: 'Host calculators, educational tools, engineering simulations, and interactive React apps.',
    icon: Cpu,
    color: 'cyan'
  },
  {
    title: 'Creator Workspace',
    description: 'Create and manage your own projects from a beautiful, dedicated dashboard.',
    icon: Layout,
    color: 'indigo'
  },
  {
    title: 'Analytics',
    description: 'Track active users, launches, engagement, sessions, downloads, and platform usage.',
    icon: BarChart,
    color: 'pink'
  },
  {
    title: 'Cloud Storage',
    description: 'Store projects securely using our scalable Supabase infrastructure.',
    icon: HardDrive,
    color: 'emerald'
  },
  {
    title: 'Leaderboards',
    description: 'Compare scores and track player achievements across all hosted games.',
    icon: Trophy,
    color: 'yellow'
  },
  {
    title: 'Authentication',
    description: 'Secure login, JWT sessions, and protected workspaces for all users.',
    icon: Key,
    color: 'red'
  }
];

const colorMap: Record<string, string> = {
  blue: 'from-blue-500/10 to-blue-500/0 border-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:border-blue-500/50',
  purple: 'from-purple-500/10 to-purple-500/0 border-purple-500/20 text-purple-600 dark:text-purple-400 group-hover:border-purple-500/50',
  cyan: 'from-cyan-500/10 to-cyan-500/0 border-cyan-500/20 text-cyan-600 dark:text-cyan-400 group-hover:border-cyan-500/50',
  indigo: 'from-indigo-500/10 to-indigo-500/0 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:border-indigo-500/50',
  pink: 'from-pink-500/10 to-pink-500/0 border-pink-500/20 text-pink-600 dark:text-pink-400 group-hover:border-pink-500/50',
  emerald: 'from-emerald-500/10 to-emerald-500/0 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:border-emerald-500/50',
  yellow: 'from-yellow-500/10 to-yellow-500/0 border-yellow-500/20 text-yellow-600 dark:text-yellow-400 group-hover:border-yellow-500/50',
  red: 'from-red-500/10 to-red-500/0 border-red-500/20 text-red-600 dark:text-red-400 group-hover:border-red-500/50',
};

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-[#0B1120] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Core Features
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to host, manage, and execute React projects at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`group relative bg-slate-50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 shadow-sm dark:shadow-none hover:shadow-md transition-all cursor-default overflow-hidden`}
            >
              {/* Animated Glow Gradient */}
              <div className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${colorMap[feature.color].split(' ')[0]} ${colorMap[feature.color].split(' ')[1]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-6 transition-colors duration-300 bg-white dark:bg-[#070B16] ${colorMap[feature.color].split(' ').slice(2).join(' ')}`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
