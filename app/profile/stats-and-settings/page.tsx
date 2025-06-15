'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '../../../lib/supabaseClient';

export default function StatsAndSettingsPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('StatsAndSettingsPage: TOP - Component Rendered. isLoading:', isLoading, 'user:', user ? 'Authenticated' : 'Not Authenticated');

  useEffect(() => {
    console.log('StatsAndSettingsPage: useEffect mounted.');

    const initializePage = async () => {
      console.log('StatsAndSettingsPage: initializePage started. isLoading (before set to true): ', isLoading);
      setIsLoading(true); // Ensure loading state is true at the start
      console.log('StatsAndSettingsPage: isLoading set to true.');

      try {
        console.log('StatsAndSettingsPage: Calling supabase.auth.getSession().');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('StatsAndSettingsPage: Session found.', session.user.id);
          setUser(session.user);
          await fetchProfile(session.user.id);
          console.log('StatsAndSettingsPage: Profile fetched successfully.');
        } else {
          console.log('StatsAndSettingsPage: No session found, redirecting to /.');
          router.replace('/'); // Redirect if no session found initially
          return; // Stop execution if redirected
        }
      } catch (error) {
        console.error('StatsAndSettingsPage: Error initializing page:', error);
        router.replace('/'); // Redirect on error
        return; // Stop execution if redirected
      } finally {
        setIsLoading(false);
        console.log('StatsAndSettingsPage: setIsLoading(false) in finally block.');
      }
    };

    initializePage();
    console.log('StatsAndSettingsPage: initializePage called.');

    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('StatsAndSettingsPage: Auth state changed. Event:', _event, 'Session:', session ? 'Exists' : 'Null');
      if (_event === 'SIGNED_OUT') {
        router.replace('/');
      } else if (session) {
        setUser(session.user);
        fetchProfile(session.user.id).catch(error => console.error('StatsAndSettingsPage: Error refetching profile on auth change:', error)); // Re-fetch profile if auth state changes to signed in
      }
    });

    return () => {
      console.log('StatsAndSettingsPage: useEffect cleanup.');
      subscription.unsubscribe();
    };
  }, [router]);

  const fetchProfile = async (userId: string) => {
    if (!userId) {
      console.log('StatsAndSettingsPage: fetchProfile called with no userId.');
      return;
    }
    console.log('StatsAndSettingsPage: fetchProfile started for userId:', userId);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name, username')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('StatsAndSettingsPage: Error fetching profile:', profileError);
      } else if (profileData) {
        setFirstName(profileData.first_name || '');
        setLastName(profileData.last_name || '');
        setUsername(profileData.username || '');
        console.log('StatsAndSettingsPage: Profile data set.');
      }
    } catch (error) {
      console.error('StatsAndSettingsPage: Error in fetchProfile catch:', error);
    }
  };

  // Username availability check
  const [usernameChecking, setUsernameChecking] = useState(false);
  useEffect(() => {
    console.log('StatsAndSettingsPage: Username useEffect mounted. Username:', username);
    const checkUsername = async () => {
      if (username.length > 3) {
        setUsernameChecking(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('username', { count: 'exact' })
            .eq('username', username)
            .limit(1);

          if (error) {
            console.error('StatsAndSettingsPage: Error checking username:', error);
            setUsernameAvailable(null);
          } else {
            setUsernameAvailable(data?.length === 0);
            console.log('StatsAndSettingsPage: Username availability checked:', data?.length === 0);
          }
        } catch (error) {
          console.error('StatsAndSettingsPage: Error in checkUsername catch:', error);
          setUsernameAvailable(null);
        } finally {
          setUsernameChecking(false);
        }
      } else {
        setUsernameAvailable(null);
      }
    };

    const handler = setTimeout(() => {
      checkUsername();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [username]);

  const [savingProfile, setSavingProfile] = useState(false);
  const handleSave = async () => {
    console.log('StatsAndSettingsPage: handleSave clicked.');
    if (!user) {
      console.error("StatsAndSettingsPage: User not authenticated for saving profile.");
      return;
    }

    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          username: username,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (error) {
        console.error('StatsAndSettingsPage: Error saving profile:', error);
        alert('Error saving profile!');
      } else {
        alert('Profile saved successfully!');
        console.log('StatsAndSettingsPage: Profile saved.');
      }
    } catch (error) {
      console.error('StatsAndSettingsPage: Error in handleSave catch:', error);
      alert('Error saving profile!');
    } finally {
      setSavingProfile(false);
    }
  };

  if (isLoading) {
    console.log('StatsAndSettingsPage: RENDERING LOADING STATE. isLoading:', isLoading);
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <p className="text-primary-foreground text-xl">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    console.log('StatsAndSettingsPage: RENDERING NULL - User is null after loading. User:', user);
    return null; // This should ideally not be reached if redirects work as intended
  }

  console.log('StatsAndSettingsPage: RENDERING MAIN CONTENT.');
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex flex-col items-center p-4">
      <nav className="w-full max-w-4xl flex justify-start p-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
        >
          Back
        </motion.button>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-card p-8 rounded-lg shadow-lg w-full space-y-6"
        >
          <h1 className="text-4xl font-bold text-center text-primary-foreground">Your Stats & Settings</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-primary-foreground">
            <div className="bg-muted p-4 rounded-md">
              <h2 className="text-xl font-semibold mb-2">Lifetime Stats</h2>
              <p>Total Games Played: <span>150</span></p>
              <p>Highest Score: <span>2500</span></p>
              <p>Average Score: <span>1800</span></p>
            </div>

            <div className="bg-muted p-4 rounded-md space-y-4">
              <h2 className="text-xl font-semibold mb-2">Profile Settings</h2>
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-primary-foreground">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-md text-primary-foreground shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-primary-foreground">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-md text-primary-foreground shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-primary-foreground">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-background border border-border rounded-md text-primary-foreground shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
                {username.length > 3 && (
                  <p className="mt-1 text-sm">
                    {usernameChecking ? (
                      'Checking availability...'
                    ) : usernameAvailable ? (
                      <span className="text-green-500">Username available!</span>
                    ) : (
                      <span className="text-red-500">Username taken.</span>
                    )}
                  </p>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={savingProfile || (username.length > 3 && !usernameAvailable)}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingProfile ? 'Saving...' : 'Save'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 