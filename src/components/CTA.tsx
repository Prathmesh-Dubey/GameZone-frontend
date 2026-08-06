import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, TerminalSquare } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-[#070B16] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-600/20 dark:to-purple-600/20 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-10 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-10 md:p-16 backdrop-blur-xl shadow-xl dark:shadow-2xl"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/20">
            <TerminalSquare className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
            Ready to deploy your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">first interactive app?</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Log in to GameZone and access your dashboard to upload, execute, and manage React games and simulators from anywhere.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(37,99,235,0.3)] dark:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="mt-8 text-sm text-slate-500 dark:text-slate-500 font-medium flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            No credit card required. Setup in 60 seconds.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
