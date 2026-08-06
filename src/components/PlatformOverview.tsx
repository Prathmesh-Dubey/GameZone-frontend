import React from 'react';
import { motion } from 'motion/react';
import { Cloud, Code2, LineChart, ShieldCheck } from 'lucide-react';

export default function PlatformOverview() {
  return (
    <section id="platform" className="py-24 relative z-10 bg-slate-50 dark:bg-[#070B16]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Illustration */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full"
          >
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-md p-8 shadow-xl dark:shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]" />
              
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-sm dark:shadow-none">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                    <Cloud className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold">Cloud Hosted</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">All games and simulators are securely stored in the cloud.</p>
                </div>
                <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex flex-col gap-4 mt-8 shadow-sm dark:shadow-none">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold">Native TSX</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Upload raw React components directly for instant execution.</p>
                </div>
                <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex flex-col gap-4 shadow-sm dark:shadow-none">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center">
                    <LineChart className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold">Analytics</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Track usage, sessions, and live leaderboard data.</p>
                </div>
                <div className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/5 rounded-2xl p-6 flex flex-col gap-4 mt-8 shadow-sm dark:shadow-none">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold">Secure Auth</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Role-based workspaces for admins and gamers.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex flex-col gap-6"
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Much more than a <br /> game launcher.
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              GameZone is a complete cloud platform designed for interactive React applications. 
              Whether you are hosting educational simulators, dynamic calculators, or full-fledged React games, 
              GameZone provides the infrastructure to upload, run, and monitor them.
            </p>
            <ul className="space-y-4 mt-4">
              {[
                "Upload Games & Simulators via Dashboard",
                "Execute TSX Projects directly in the browser",
                "Manage Libraries & Workspaces",
                "Monitor Performance & Leaderboards"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
