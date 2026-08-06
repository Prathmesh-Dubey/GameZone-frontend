import React from 'react';
import { motion } from 'motion/react';
import { Mail, Code, Layout } from 'lucide-react';

const creators = [
  {
    name: "Prathmesh Dubey",
    email: "prathmdubey217@gmail.com",
    role: "Backend",
    icon: Code,
    iconBg: "bg-blue-100 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  {
    name: "Akshata Gundure",
    email: "akshatagundure@gmail.com",
    role: "Frontend",
    icon: Layout,
    iconBg: "bg-purple-100 dark:bg-purple-500/10",
    iconColor: "text-purple-600 dark:text-purple-400"
  },
  {
    name: "Shail Menghani",
    email: "shailmenghani12@gmail.com",
    role: "Frontend",
    icon: Layout,
    iconBg: "bg-pink-100 dark:bg-pink-500/10",
    iconColor: "text-pink-600 dark:text-pink-400"
  }
];

export default function Creators() {
  return (
    <section id="creators" className="py-24 bg-slate-50 dark:bg-[#070B16] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-500/5 dark:bg-indigo-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Meet the Creators
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            The talented team behind GameZone, dedicated to building the best platform for developers and players alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creators.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${c.iconBg} ${c.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                <c.icon className="w-10 h-10" />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{c.name}</h3>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-4">{c.role} Developer</p>
              
              <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{c.email}</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
