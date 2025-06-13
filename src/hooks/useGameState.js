"use client"

import { useState, useEffect, useCallback } from "react"
import { medicalFacts } from "../data/medicalFacts"
import { supabase } from "../../lib/supabaseClient"

export const useGameState = (paused = false) => {
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

  // Load saved state
  useEffect(() => {
    const savedState = localStorage.getItem("truedose_game_state")
    const savedDate = localStorage.getItem("truedose_last_date")
    const today = new Date().toDateString()

    if (savedState && savedDate === today) {
      const state = JSON.parse(savedState)
      setDailyExplanations(state.dailyExplanations || 0)
      setIsSubscribed(state.isSubscribed || false)
    } else {
      // Reset daily counters
      setDailyExplanations(0)
      localStorage.setItem("truedose_last_date", today)
    }
  }, [])

  // Save state
  useEffect(() => {
    const state = {
      dailyExplanations,
      isSubscribed,
    }
    localStorage.setItem("truedose_game_state", JSON.stringify(state))
  }, [dailyExplanations, isSubscribed])

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
    (answer) => {
      if (userAnswer !== null) return

      setUserAnswer(answer)
      const currentFact = medicalFacts[currentFactIndex]
      const isCorrect = answer === currentFact.correct

      if (isCorrect) {
        const speedBonus = timeLeft > 10 ? 50 : timeLeft > 5 ? 25 : 0
        const basePoints = 100
        const newScore = score + basePoints + speedBonus

        setScore(newScore)
        setStreak((prev) => prev + 1)
      } else {
        setGameState("gameOver")
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
          updateHighestStreak();
        }
      }
    },
    [userAnswer, currentFactIndex, timeLeft, score, user, streak, highestStreak],
  )

  const nextFact = useCallback(() => {
    if (currentFactIndex >= medicalFacts.length - 1) {
      setGameState("gameOver")
      return
    }

    setCurrentFactIndex((prev) => prev + 1)
    setUserAnswer(null)
    setTimeLeft(15)
    setShowExplanation(false)
  }, [currentFactIndex])

  const resetGame = useCallback(() => {
    setCurrentFactIndex(0)
    setStreak(0)
    setScore(0)
    setTimeLeft(15)
    setGameState("playing")
    setUserAnswer(null)
    setShowExplanation(false)
  }, [])

  const toggleSubscription = useCallback(() => {
    setIsSubscribed((prev) => !prev)
  }, [])

  const incrementDailyExplanations = useCallback(() => {
    if (!isSubscribed) {
      setDailyExplanations((prev) => prev + 1)
    }
  }, [isSubscribed])

  return {
    currentFactIndex,
    streak,
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
    setShowExplanation: (show) => {
      setShowExplanation(show)
      if (show) incrementDailyExplanations()
    },
  }
}
