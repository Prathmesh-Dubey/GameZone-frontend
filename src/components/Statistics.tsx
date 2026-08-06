import React from 'react';
import { motion } from 'motion/react';

const stats = [
  { value: '1000+', label: 'Projects Uploaded' },
  { value: '500+', label: 'React Games' },
  { value: '300+', label: 'Simulators' },
  { value: '50K+', label: 'Total Executions' },
  { value: '99.9%', label: 'Uptime' }
];

export default function Statistics() {
  return (
    <section className="py-20 bg-slate-100 dark:bg-[#05080f] relative border-y border-slate-200 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-slate-200 dark:divide-white/10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
