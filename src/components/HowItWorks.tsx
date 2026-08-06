import React from 'react';
import { motion } from 'motion/react';
import { LogIn, LayoutDashboard, Upload, Settings, Play, Activity } from 'lucide-react';

const steps = [
  { icon: LogIn, title: 'Login', desc: 'Secure authentication' },
  { icon: LayoutDashboard, title: 'Access Dashboard', desc: 'Your personal workspace' },
  { icon: Upload, title: 'Upload Project', desc: 'Game or Simulator' },
  { icon: Settings, title: 'Manage Projects', desc: 'Configure settings' },
  { icon: LogIn, title: 'Login', desc: 'Secure authentication', color: 'text-blue-500' },
  { icon: LayoutDashboard, title: 'Access Dashboard', desc: 'Your personal workspace', color: 'text-indigo-500' },
  { icon: Upload, title: 'Upload Project', desc: 'Game or Simulator', color: 'text-violet-500' },
  { icon: Settings, title: 'Manage Projects', desc: 'Configure settings', color: 'text-purple-500' },
  { icon: Play, title: 'Run Instantly', desc: 'Execute in browser', color: 'text-fuchsia-500' },
  { icon: Activity, title: 'Analyze', desc: 'Track performance', color: 'text-pink-500' }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-[#070B16] relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            How It Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            A seamless pipeline from authentication to live execution.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500/0 via-blue-500/50 dark:via-blue-500/20 to-blue-500/0" />
          
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/10 flex items-center justify-center mb-6 relative group-hover:border-blue-500/50 transition-colors shadow-lg">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  <step.icon className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 relative z-10 transition-colors" />
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-slate-50 dark:border-[#070B16]">
                    {i + 1}
                  </div>
                </div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-1">{step.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">{step.desc}</p>
                
                {/* Mobile Connecting Arrow */}
                {i < steps.length - 1 && (
                  <div className="md:hidden w-0.5 h-8 bg-white/10 mt-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
