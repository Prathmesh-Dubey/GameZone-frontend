import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Gamepad2, Activity, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-1/4 left-1/3 w-[800px] h-[400px] bg-cyan-600/10 rounded-full blur-[150px] mix-blend-screen" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTM5IDM5VjFIMUMzdjM4aDM4eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjAyIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')] opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Column: Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Introducing GameZone Cloud Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Run Interactive <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400">
              React Experiences
            </span> <br />
            in the Cloud
          </h1>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            GameZone is a modern platform that allows developers, students, and organizations to upload, manage, execute, and analyze React TSX games and simulators from one unified workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold transition-all flex items-center justify-center gap-2 group"
            >
              Login to Workspace
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              Explore Platform
            </a>
          </div>
        </motion.div>

        {/* Right Column: Floating Dashboard Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative h-[600px] hidden lg:block perspective-1000"
        >
          <motion.div 
            animate={{ y: [-10, 10, -10] }} 
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Main Center Card (Game Runner) */}
            <div className="relative z-20 w-80 h-96 bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden flex flex-col">
              <div className="h-10 bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="ml-auto text-xs text-slate-500 font-mono">React Engine</div>
              </div>
              <div className="flex-1 p-4 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                <Play className="w-16 h-16 text-slate-400 dark:text-white/50" />
                <div className="absolute inset-x-0 bottom-4 text-center text-sm font-bold text-slate-600 dark:text-white">Simulation Running...</div>
              </div>
            </div>

            {/* Floating Top Right Card (Analytics) */}
            <motion.div 
              animate={{ y: [-5, 5, -5], rotate: [2, -2, 2] }} 
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -right-8 top-12 z-30 w-48 bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Live Telemetry</span>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-cyan-500 dark:bg-cyan-400 rounded-full" />
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-purple-500 dark:bg-purple-400 rounded-full" />
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-5/6 bg-blue-500 dark:bg-blue-400 rounded-full" />
                </div>
              </div>
            </motion.div>

            {/* Floating Bottom Left Card (Game Card) */}
            <motion.div 
              animate={{ y: [5, -5, 5], rotate: [-2, 2, -2] }} 
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
              className="absolute -left-12 bottom-20 z-30 w-56 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl p-3 shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Cyber React 2077</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">v1.0.4 Uploaded</div>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
