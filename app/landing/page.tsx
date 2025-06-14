'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AuthModal from './AuthModal';
import { supabase } from '../../lib/supabaseClient';

export default function LandingPage() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [authOpen, setAuthOpen] = useState<false | 'sign-in' | 'sign-up'>(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleStart = () => {
    sessionStorage.setItem('gameInitiated', 'true');
    router.replace('/game');
  };

  const handlePractice = () => {
    sessionStorage.setItem('gameInitiated', 'true');
    router.replace('/practice');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col">
      {/* Auth Modal */}
      <AuthModal open={!!authOpen} onClose={() => setAuthOpen(false)} mode={authOpen === 'sign-up' ? 'sign-up' : 'sign-in'} />
      {/* Navigation Bar */}
      <nav className="w-full p-4 flex justify-between items-center">
        <div className="flex gap-4">
          {!user ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => setAuthOpen('sign-in')}
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm font-medium text-primary bg-primary-foreground border border-primary rounded-md hover:bg-primary/10 transition-colors"
                onClick={() => setAuthOpen('sign-up')}
              >
                Sign Up
              </motion.button>
            </>
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent-foreground">
            TrueDose
          </h1>
          
          <div className="flex flex-col items-center space-y-4">
            {/* Classic Mode Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              onClick={handleStart}
              className="relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-lg overflow-hidden group shadow-lg w-full max-w-xs"
            >
              <motion.span
                initial={false}
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  opacity: isHovered ? 0.8 : 0.4,
                }}
                className="absolute inset-0 bg-yellow-300 transform rotate-45 group-hover:scale-150 transition-transform duration-500 opacity-0 group-hover:opacity-100"
                style={{ animation: 'shine 1.5s infinite' }}
              />
              <span className="relative z-10 text-lg font-semibold">
                Classic Mode
              </span>
            </motion.button>

            {/* Practice Mode Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePractice}
              className="relative px-8 py-4 bg-primary text-primary-foreground rounded-lg overflow-hidden group w-full max-w-xs"
            >
              <motion.span
                initial={false}
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  opacity: isHovered ? 0.8 : 0.4,
                }}
                className="absolute inset-0 bg-gradient-to-r from-accent to-accent-foreground"
              />
              <span className="relative z-10 text-lg font-semibold">
                Practice Mode
              </span>
            </motion.button>

            {/* How to Play Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/how-to-play')}
              className="px-8 py-4 bg-secondary text-secondary-foreground rounded-lg overflow-hidden group w-full max-w-xs"
            >
              <span className="relative z-10 text-lg font-semibold">
                How to Play
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 