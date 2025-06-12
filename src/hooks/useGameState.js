"use client"

import { useState, useEffect, useCallback } from "react"
import { medicalFacts } from "../data/medicalFacts"

export const useGameState = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [streak, setStreak] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameState, setGameState] = useState("playing") // 'playing', 'gameOver'
  const [userAnswer, setUserAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [dailyExplanations, setDailyExplanations] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)

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
    if (gameState !== "playing" || userAnswer !== null) return

    if (timeLeft <= 0) {
      setGameState("gameOver")
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, gameState, userAnswer])

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
      }
    },
    [userAnswer, currentFactIndex, timeLeft, score],
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
