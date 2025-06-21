'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { User, Trophy, Sparkles } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [highestStreak, setHighestStreak] = useState(0);
  const [usernameStatus, setUsernameStatus] = useState<'available' | 'taken' | 'checking' | null>(null);
  const [initialUsername, setInitialUsername] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error fetching user:', userError?.message);
        router.replace('/landing'); // Redirect if no user
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, username, highest_streak')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') { // No profile found
        // Create a new profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: user.id, username: null, first_name: null, last_name: null, highest_streak: 0 });
        if (insertError) {
          console.error('Error creating profile:', insertError.message);
          setSaveMessage({ type: 'error', message: 'Error initializing profile.' });
        } else {
          setFirstName('');
          setLastName('');
          setUsername('');
          setInitialUsername('');
          setHighestStreak(0);
        }
      } else if (error) {
        console.error('Error fetching profile:', error.message);
        setSaveMessage({ type: 'error', message: 'Error loading profile.' });
      } else if (data) {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setUsername(data.username || '');
        setInitialUsername(data.username || ''); // Store initial username for comparison
        setHighestStreak(data.highest_streak || 0);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const checkUsernameAvailability = useCallback(async (currentUsername: string) => {
    if (currentUsername === initialUsername) {
      setUsernameStatus(null); // No change, no need to check
      return;
    }
    if (currentUsername.length < 3) {
      setUsernameStatus(null); // Too short, don't check yet
      return;
    }

    setUsernameStatus('checking');
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', currentUsername)
      .limit(1);

    if (error) {
      console.error('Error checking username:', error.message);
      setUsernameStatus(null);
    } else if (data && data.length > 0) {
      setUsernameStatus('taken');
    } else {
      setUsernameStatus('available');
    }
  }, [initialUsername]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (username) {
        checkUsernameAvailability(username);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [username, checkUsernameAvailability]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (usernameStatus === 'taken') {
      setSaveMessage({ type: 'error', message: 'Username is already taken.' });
      return;
    }

    setLoading(true);
    const updates = {
      first_name: firstName,
      last_name: lastName,
      username,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);

    if (error) {
      console.error('Error saving profile:', error.message);
      setSaveMessage({ type: 'error', message: `Error saving: ${error.message}` });
    } else {
      setInitialUsername(username); // Update initial username after successful save
      setSaveMessage({ type: 'success', message: 'Profile saved successfully!' });
    }
    setLoading(false);
    setTimeout(() => setSaveMessage(null), 3000); // Clear message after 3 seconds
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center text-foreground">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center p-4">
      <nav className="w-full flex justify-between items-center mb-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push('/landing')}
          className="text-primary-foreground text-sm font-semibold p-2 rounded-full bg-primary flex items-center justify-center"
        >
          Back
        </motion.button>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/30 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/40 backdrop-blur-2xl text-center space-y-6"
      >
        <h1 className="text-3xl font-bold text-foreground mb-4">My Profile</h1>

        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-900 focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-900 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-900 focus:ring-primary focus:border-primary"
          />
          {usernameStatus && username !== initialUsername && (
            <p className={`text-sm mt-1 ${usernameStatus === 'available' ? 'text-green-500' : 'text-red-500'}`}>
              {usernameStatus === 'checking' && 'Checking availability...'}
              {usernameStatus === 'available' && 'Username available!'}
              {usernameStatus === 'taken' && 'Username taken.'}
            </p>
          )}
        </div>

        {/* Lifetime Stats */}
        <div className="bg-primary/20 p-4 rounded-xl text-foreground text-left space-y-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles size={20} className="text-primary" /> Lifetime Stats
          </h2>
          <p className="text-sm flex items-center gap-2">
            <Trophy size={16} className="text-accent-foreground" /> Highest Streak: {highestStreak}
          </p>
        </div>

        {saveMessage && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm font-semibold ${saveMessage.type === 'success' ? 'text-green-500' : 'text-red-500'}`}
          >
            {saveMessage.message}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={loading || (usernameStatus === 'taken' && username !== initialUsername) || usernameStatus === 'checking'}
          className="mt-4 px-8 py-4 bg-primary text-primary-foreground rounded-lg overflow-hidden group font-semibold text-lg w-full"
        >
          Save Profile
        </motion.button>
      </motion.div>
    </div>
  );
} 