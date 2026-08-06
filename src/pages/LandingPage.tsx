import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import PlatformOverview from '../components/PlatformOverview';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Modules from '../components/Modules';
import Technology from '../components/Technology';
import Preview from '../components/Preview';
import Statistics from '../components/Statistics';
import Testimonials from '../components/Testimonials';
import Creators from '../components/Creators';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

export default function LandingPage() {
  // Ensure the page always starts at the top when navigating back to it
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-[#070B16] min-h-screen text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-white transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <PlatformOverview />
        <Features />
        <HowItWorks />
        <Modules />
        <Technology />
        <Preview />
        <Statistics />
        <Testimonials />
        <Creators />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
