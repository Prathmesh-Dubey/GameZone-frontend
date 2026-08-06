import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Gamepad2, PlaySquare, BarChart, Settings, Play } from 'lucide-react';

export default function Preview() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-[#070B16] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-blue-500/5 dark:bg-blue-600/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            See it in Action
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            A meticulously crafted environment for maximum productivity.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Main Dashboard Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="relative rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B1120] shadow-xl dark:shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
          >
            {/* Mock Browser Header */}
            <div className="h-12 bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex items-center px-4 md:px-6 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/80" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white dark:bg-black/20 rounded-md h-7 w-64 max-w-full flex items-center justify-center px-3 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none text-xs text-slate-500 dark:text-slate-400 font-mono">
                  platform.app
                </div>
              </div>
            </div>

            {/* Mockup Body */}
            <div className="aspect-[16/10] md:aspect-video bg-slate-50 dark:bg-[#070B16] relative flex flex-col">
              {/* Sidebar Mock */}
              <div className="absolute top-0 bottom-0 left-0 w-16 md:w-64 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-white/5 hidden sm:flex flex-col gap-4 p-4">
                <div className="h-8 bg-slate-100 dark:bg-white/5 rounded-lg mb-4" />
                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-1/2" />
                <div className="h-4 bg-slate-100 dark:bg-white/5 rounded w-2/3" />
              </div>

              {/* Main Area Mock */}
              <div className="flex-1 sm:ml-16 md:ml-64 p-6 md:p-10 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="h-8 w-48 bg-slate-200 dark:bg-white/10 rounded-lg mb-2" />
                    <div className="h-4 w-64 bg-slate-100 dark:bg-white/5 rounded" />
                  </div>
                  <div className="h-10 w-32 bg-blue-500/20 rounded-xl hidden md:block" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-video bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 p-4 shadow-sm dark:shadow-none">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-lg mb-3" />
                      <div className="h-3 w-1/2 bg-slate-200 dark:bg-white/10 rounded mb-2" />
                      <div className="h-2 w-3/4 bg-slate-100 dark:bg-white/5 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Play Overlay */}
              <div className="absolute inset-0 bg-white/40 dark:bg-[#070B16]/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer group">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(37,99,235,0.5)] group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 ml-1" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating UI Elements */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }} 
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute -right-12 top-1/4 z-20 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-2xl hidden lg:block"
          >
            <div className="flex items-center gap-3 mb-4">
              <BarChart className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <div className="text-sm font-bold text-slate-900 dark:text-white">Live Analytics</div>
            </div>
            <div className="flex items-end gap-2 h-24">
              {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
              ))}
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [10, -10, 10] }} 
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -left-12 bottom-1/4 z-20 w-64 bg-slate-900 border border-white/10 rounded-xl p-4 shadow-2xl hidden lg:block"
          >
             <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5 text-purple-400" />
              <div className="text-sm font-bold text-white">Creator Panel</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                <div className="h-2 w-16 bg-slate-500 rounded-full" />
                <div className="w-8 h-4 bg-purple-500 rounded-full" />
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
                <div className="h-2 w-20 bg-slate-500 rounded-full" />
                <div className="w-8 h-4 bg-slate-700 rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
