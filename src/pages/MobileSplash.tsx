import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function MobileSplash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically navigate to dashboard after 2.5 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden relative selection:bg-transparent">
      {/* Soft white glow behind logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute w-48 h-48 bg-white/20 blur-[60px] rounded-full pointer-events-none"
      />

      <div className="flex flex-col items-center justify-center z-10 relative">
        {/* Large italic GZ Logo */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-8xl font-black text-white italic tracking-tighter"
          style={{ textShadow: "0 4px 20px rgba(255,255,255,0.15)" }}
        >
          GZ
        </motion.h1>

        {/* Animated Loading Bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 80 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 h-0.5 bg-white/20 rounded-full overflow-hidden w-20 relative"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              repeat: Infinity, 
              duration: 1, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-white rounded-full w-1/2"
          />
        </motion.div>

        {/* GameZone Title */}
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          className="mt-6 text-sm font-semibold tracking-[0.2em] text-white/70 uppercase"
        >
          GameZone
        </motion.p>
      </div>
    </div>
  );
}
