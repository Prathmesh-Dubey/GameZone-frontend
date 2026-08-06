import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "GameZone completely changed how I submit my final React projects. The live simulator runner makes sharing my engineering calculators with my professor incredibly easy.",
    name: "Alex M.",
    role: "Computer Science Student",
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex"
  },
  {
    quote: "As a frontend developer, I love having a unified workspace to upload and playtest my HTML5 React games. The built-in analytics dashboard is a huge bonus.",
    name: "Sarah K.",
    role: "Indie Game Developer",
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah"
  },
  {
    quote: "I use GameZone to host interactive React-based physics simulations for my class. The platform is fast, reliable, and looks incredibly professional.",
    name: "Dr. James L.",
    role: "University Instructor",
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=James"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-slate-50 dark:bg-[#070B16] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-blue-500/5 dark:bg-purple-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Loved by Developers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            See what developers, students, and educators are saying about GameZone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-8">
                  "{t.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10" />
                <div>
                  <h4 className="text-slate-900 dark:text-white font-bold">{t.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
