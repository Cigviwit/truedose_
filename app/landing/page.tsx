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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      console.log('LandingPage - Initial user:', data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      console.log('LandingPage - Auth state changed, user:', session?.user);
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col md:flex-row">
      {/* Auth Modal */}
      <AuthModal open={!!authOpen} onClose={() => setAuthOpen(false)} mode={authOpen === 'sign-up' ? 'sign-up' : 'sign-in'} />
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Menu</h2>
          <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <nav className="space-y-4">
          {user && (
            <div className="flex items-center space-x-3 p-2 bg-gray-700 rounded-md mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                {user.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              <span className="text-lg font-semibold">{user.email}</span>
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              router.push('/profile/stats-and-settings');
              setIsSidebarOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-lg font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
          >
            Settings
          </motion.button>
          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-lg font-medium text-white bg-red-600 rounded-md hover:bg-red-500 transition-colors"
            >
              Sign Out
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 text-left text-lg font-medium text-white bg-green-600 rounded-md hover:bg-green-500 transition-colors"
                onClick={() => { setAuthOpen('sign-in'); setIsSidebarOpen(false); }}
              >
                Sign In
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 text-left text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 transition-colors"
                onClick={() => { setAuthOpen('sign-up'); setIsSidebarOpen(false); }}
              >
                Sign Up
              </motion.button>
            </>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navigation Bar - remains for menu toggle */}
        <nav className="w-full p-4 flex justify-between items-center bg-background md:hidden">
          <button className="text-black" onClick={() => setIsSidebarOpen(true)}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <div className="flex gap-4">
            {/* Optionally keep some top-level navigation here or remove entirely */}
          </div>
        </nav>

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
    </div>
  );
} 