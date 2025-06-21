"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { medicalFacts } from "../data/medicalFacts"
import { supabase } from "../../lib/supabaseClient"

// Helper function to shuffle an array
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

export const useGameState = (paused = false, isPracticeMode = false) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [streak, setStreak] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameState, setGameState] = useState("playing") // 'playing', 'gameOver'
  const [userAnswer, setUserAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [dailyExplanations, setDailyExplanations] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [user, setUser] = useState(null)
  const [highestStreak, setHighestStreak] = useState(null)
  const [shuffledFactIds, setShuffledFactIds] = useState([])
  const [playedFactIds, setPlayedFactIds] = useState([])
  const [gameOverTriggered, setGameOverTriggered] = useState(false)

  // Load user and highest streak
  useEffect(() => {
    const getSessionAndStreak = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        // Fetch highest streak for the user
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('highest_streak')
          .eq('id', session.user.id)
          .single();

        if (data) {
          setHighestStreak(data.highest_streak);
        } else if (fetchError && fetchError.code === 'PGRST116') {
          // No profile found, create one
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({ id: session.user.id, highest_streak: 0 });
          if (insertError) console.error('Error creating profile:', insertError.message);
          setHighestStreak(0);
        } else if (fetchError) {
          console.error('Error fetching highest streak:', fetchError.message);
        }
      } else if (error) {
        console.error('Error getting session:', error.message);
      }
    };

    getSessionAndStreak();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser(session.user);
        // Fetch highest streak for the user
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('highest_streak')
          .eq('id', session.user.id)
          .single();

        if (data) {
          setHighestStreak(data.highest_streak);
        } else if (fetchError && fetchError.code === 'PGRST116') {
          // No profile found, create one
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({ id: session.user.id, highest_streak: 0 });
          if (insertError) console.error('Error creating profile:', insertError.message);
          setHighestStreak(0);
        } else if (fetchError) {
          console.error('Error fetching highest streak:', fetchError.message);
        }
      } else {
        setUser(null);
        setHighestStreak(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Initialize facts and played facts from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const savedLastDate = localStorage.getItem("truedose_last_date");

    let initialPlayedFactIds = [];
    if (savedLastDate === today) {
      const savedPlayedFacts = localStorage.getItem("truedose_played_fact_ids");
      if (savedPlayedFacts) {
        initialPlayedFactIds = JSON.parse(savedPlayedFacts);
      }
    } else {
      // New day, reset played facts
      localStorage.setItem("truedose_last_date", today);
    }
    setPlayedFactIds(initialPlayedFactIds);

    const availableFactIds = medicalFacts
      .filter(fact => !initialPlayedFactIds.includes(fact.id))
      .map(fact => fact.id);

    if (availableFactIds.length === 0) {
      // All facts played today, reset played facts for a new full cycle
      localStorage.setItem("truedose_played_fact_ids", JSON.stringify([]));
      setPlayedFactIds([]);
      setShuffledFactIds(shuffleArray(medicalFacts.map(fact => fact.id)));
    } else {
      setShuffledFactIds(shuffleArray(availableFactIds));
    }

    const savedState = localStorage.getItem("truedose_game_state");
    if (savedState && savedLastDate === today) {
      const state = JSON.parse(savedState);
      setDailyExplanations(state.dailyExplanations || 0);
      setIsSubscribed(state.isSubscribed || false);
    } else {
      setDailyExplanations(0);
    }
  }, []);

  // Save state and played facts
  useEffect(() => {
    const state = {
      dailyExplanations,
      isSubscribed,
    };
    localStorage.setItem("truedose_game_state", JSON.stringify(state));
    localStorage.setItem("truedose_played_fact_ids", JSON.stringify(playedFactIds));
  }, [dailyExplanations, isSubscribed, playedFactIds]);

  // Timer
  useEffect(() => {
    if (gameState !== "playing" || userAnswer !== null || paused) return

    if (timeLeft <= 0) {
      setGameState("gameOver")
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, gameState, userAnswer, paused])

  const handleAnswer = useCallback(
    async (answer) => {
      if (userAnswer !== null) return

      setUserAnswer(answer)
      const currentFact = medicalFacts.find(fact => fact.id === shuffledFactIds[currentFactIndex])
      const isCorrect = answer === currentFact.correct

      if (isCorrect) {
        const speedBonus = timeLeft > 10 ? 50 : timeLeft > 5 ? 25 : 0
        const basePoints = 100
        const newScore = score + basePoints + speedBonus

        setScore(newScore)
        if (!isPracticeMode) {
          setStreak((prev) => prev + 1)
        }
      } else {
        setShowExplanation(true);
        if (!isPracticeMode) {
          setGameOverTriggered(true);
          // Update highest streak on game over if user is logged in and new streak is higher
          if (user && streak > highestStreak) {
            const updateHighestStreak = async () => {
              const { error } = await supabase
                .from('profiles')
                .update({ highest_streak: streak })
                .eq('id', user.id);
              if (error) console.error('Error updating highest streak:', error.message);
              else setHighestStreak(streak);
            };
            await updateHighestStreak();
          }
        }
      }
    },
    [userAnswer, currentFactIndex, timeLeft, score, user, streak, highestStreak, shuffledFactIds, isPracticeMode],
  )

  const nextFact = useCallback(() => {
    if (gameOverTriggered && !isPracticeMode) {
      setGameState("gameOver");
      setGameOverTriggered(false);
    } else {
      // Add current fact to played facts (only for correct answers, or if explanation was force-shown)
      setPlayedFactIds(prev => [...prev, shuffledFactIds[currentFactIndex]]);

      if (currentFactIndex >= shuffledFactIds.length - 1) {
        // If all facts in the current shuffled list are exhausted
        const remainingFactIds = medicalFacts
          .filter(fact => !playedFactIds.includes(fact.id))
          .map(fact => fact.id);

        if (remainingFactIds.length === 0) {
          // All facts ever played, reset played facts for a new cycle
          localStorage.setItem("truedose_played_fact_ids", JSON.stringify([]));
          setPlayedFactIds([]);
          setShuffledFactIds(shuffleArray(medicalFacts.map(fact => fact.id)));
        } else {
          // Shuffle remaining unplayed facts for the rest of the day
          setShuffledFactIds(shuffleArray(remainingFactIds));
        }
        setCurrentFactIndex(0); // Reset index to start of new shuffled list
      } else {
        setCurrentFactIndex((prev) => prev + 1);
      }
    }
    setUserAnswer(null);
    setTimeLeft(15);
    setShowExplanation(false);
  }, [currentFactIndex, shuffledFactIds, playedFactIds, gameOverTriggered, isPracticeMode]);

  const resetGame = useCallback(() => {
    const today = new Date().toDateString();
    const savedLastDate = localStorage.getItem("truedose_last_date");

    let initialPlayedFactIds = [];
    if (savedLastDate === today) {
      const savedPlayedFacts = localStorage.getItem("truedose_played_fact_ids");
      if (savedPlayedFacts) {
        initialPlayedFactIds = JSON.parse(savedPlayedFacts);
      }
    } else {
      // New day, reset played facts
      localStorage.setItem("truedose_last_date", today);
    }
    setPlayedFactIds(initialPlayedFactIds);

    const availableFactIds = medicalFacts
      .filter(fact => !initialPlayedFactIds.includes(fact.id))
      .map(fact => fact.id);

    // If all facts are played today, reset played facts for a new full cycle
    if (availableFactIds.length === 0) {
      localStorage.setItem("truedose_played_fact_ids", JSON.stringify([]));
      setPlayedFactIds([]);
      setShuffledFactIds(shuffleArray(medicalFacts.map(fact => fact.id)));
    } else {
      setShuffledFactIds(shuffleArray(availableFactIds));
    }

    setCurrentFactIndex(0)
    setStreak(0)
    setScore(0)
    setTimeLeft(15)
    setGameState("playing")
    setUserAnswer(null)
    setShowExplanation(false)
  }, [isSubscribed])

  const toggleSubscription = useCallback(() => {
    setIsSubscribed((prev) => !prev)
  }, [])

  const incrementDailyExplanations = useCallback(() => {
    if (!isSubscribed) {
      setDailyExplanations((prev) => prev + 1)
    }
  }, [isSubscribed])

  const quitGame = useCallback(() => {
    setGameState("gameOver");
    if (!isPracticeMode) {
      // For classic mode, save highest streak on quit if applicable
      if (user && streak > highestStreak) {
        const updateHighestStreak = async () => {
          const { error } = await supabase
            .from('profiles')
            .update({ highest_streak: streak })
            .eq('id', user.id);
          if (error) console.error('Error updating highest streak:', error.message);
          else setHighestStreak(streak);
        };
        updateHighestStreak();
      }
    }
  }, [user, streak, highestStreak, isPracticeMode]);

  return {
    currentFact: medicalFacts.find(fact => fact.id === shuffledFactIds[currentFactIndex]),
    streak: isPracticeMode ? 0 : streak,
    score,
    timeLeft,
    gameState,
    userAnswer,
    showExplanation,
    dailyExplanations,
    isSubscribed,
    user,
    highestStreak,
    handleAnswer,
    nextFact,
    resetGame,
    toggleSubscription,
    setShowExplanation,
    incrementDailyExplanations,
    gameOverTriggered,
    quitGame,
  }
}
