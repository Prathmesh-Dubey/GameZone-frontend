import React from 'react';
import { Gamepad2, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
  {
    title: "Platform",
    links: [
      { name: "Features", href: "#features" },
      { name: "Architecture", href: "#platform" },
      { name: "Technology Stack", href: "#technology" },
      { name: "Login Workspace", href: "/login" },
    ]
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "GitHub Repository", href: "#" },
      { name: "Community Forum", href: "#" },
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Contact Support", href: "#" },
    ]
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-100 dark:bg-[#05080f] border-t border-slate-200 dark:border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-transform group-hover:scale-105">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                GameZone
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-sm">
              The premier cloud platform for executing interactive React TSX experiences and simulators.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-white/10 hover:text-blue-600 dark:hover:text-white transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {footerLinks.map((column, i) => (
            <div key={i} className="col-span-1 lg:col-span-1">
              <h4 className="font-bold text-slate-900 dark:text-white mb-6 tracking-wide">{column.title}</h4>
              <ul className="flex flex-col gap-4">
                {column.links.map((link, j) => (
                  <li key={j}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">{link.name}</Link>
                    ) : (
                      <a href={link.href} className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">{link.name}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-slate-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            &copy; {currentYear} GameZone Cloud Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-500">
            <a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-800 dark:hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
