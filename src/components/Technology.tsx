import React from 'react';
import { motion } from 'motion/react';
import { Code2, Braces, Zap, Palette, Database, Route, Image as ImageIcon } from 'lucide-react';

const techStack = [
  { name: 'React', desc: 'UI Library', icon: Code2, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
  { name: 'TypeScript', desc: 'Type Safety', icon: Braces, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Vite', desc: 'Build Tool', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { name: 'Tailwind CSS', desc: 'Styling', icon: Palette, color: 'text-sky-400', bg: 'bg-sky-400/10' },
  { name: 'Supabase', desc: 'Backend', icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'React Router', desc: 'Navigation', icon: Route, color: 'text-red-500', bg: 'bg-red-500/10' },
  { name: 'Framer Motion', desc: 'Animations', icon: Code2, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { name: 'Lucide React', desc: 'Icons', icon: ImageIcon, color: 'text-slate-300', bg: 'bg-slate-300/10' }
];

export default function Technology() {
  return (
    <section id="technology" className="py-24 bg-white dark:bg-[#070B16] relative border-y border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 dark:text-blue-500 tracking-widest uppercase mb-3">Powered By</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">Modern Web Stack</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {techStack.map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center overflow-hidden group hover:border-${tech.color.split('-')[1]}-500/50 transition-colors shadow-sm hover:shadow-md dark:shadow-none`}
            >
              <div className={`absolute inset-0 bg-gradient-to-b from-${tech.color.split('-')[1]}-500/0 dark:from-${tech.color.split('-')[1]}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className={`w-16 h-16 rounded-2xl bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/5 flex items-center justify-center mb-4 relative z-10 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform`}>
                <tech.icon className={`w-8 h-8 text-${tech.color.split('-')[1]}-600 dark:text-${tech.color.split('-')[1]}-400`} />
              </div>
              
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10">{tech.name}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 relative z-10">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
