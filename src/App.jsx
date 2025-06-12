"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import FactCard from "./components/FactCard"
import TimerBar from "./components/TimerBar"
import ExplanationModal from "./components/ExplanationModal"
import GameOverScreen from "./components/GameOverScreen"
import BottomHUD from "./components/BottomHUD"
import SwipeContainer from "./components/SwipeContainer"
import SubscriptionModal from "./components/SubscriptionModal"
import { medicalFacts } from "./data/medicalFacts"
import { useGameState } from "./hooks/useGameState"

function App() {
  const {
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
    setShowExplanation,
  } = useGameState()

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  const currentFact = medicalFacts[currentFactIndex]
  const speedBonus = timeLeft > 10 ? 50 : timeLeft > 5 ? 25 : 0

  // PWA Install Prompt
  useEffect(() => {
    let deferredPrompt

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      deferredPrompt = e
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallApp = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt()
      const { outcome } = await window.deferredPrompt.userChoice
      if (outcome === "accepted") {
        setShowInstallPrompt(false)
      }
      window.deferredPrompt = null
    }
  }

  const handleExplanationRequest = () => {
    if (!isSubscribed && dailyExplanations >= 5) {
      setShowSubscriptionModal(true)
    } else {
      setShowExplanation(true)
    }
  }

  return (
    <div
      className="h-screen w-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #ef4444 100%)",
        height: "100vh",
        maxHeight: "100vh",
      }}
    >
      {/* Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-2 left-2 right-2 z-50 bg-white rounded-lg p-3 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-800 text-sm">Install TrueDose!</span>
              <div className="flex gap-2">
                <button
                  onClick={handleInstallApp}
                  className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold"
                >
                  Install
                </button>
                <button onClick={() => setShowInstallPrompt(false)} className="text-gray-600 text-sm font-bold">
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Bar */}
      {gameState === "playing" && <TimerBar timeLeft={timeLeft} />}

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col min-h-0" style={{ minHeight: 0 }}>
        <AnimatePresence mode="wait">
          {gameState === "playing" && (
            <SwipeContainer key="game">
              <FactCard
                fact={currentFact}
                onAnswer={handleAnswer}
                userAnswer={userAnswer}
                timeLeft={timeLeft}
                speedBonus={speedBonus}
                onContinue={() => setShowExplanation(true)}
              />
            </SwipeContainer>
          )}

          {gameState === "gameOver" && (
            <GameOverScreen key="gameOver" streak={streak} score={score} onRestart={resetGame} />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom HUD */}
      {gameState === "playing" && (
        <BottomHUD
          streak={streak}
          score={score}
          speedBonus={speedBonus}
          dailyExplanations={dailyExplanations}
          isSubscribed={isSubscribed}
        />
      )}

      {/* Explanation Modal */}
      <ExplanationModal
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        fact={currentFact}
        userAnswer={userAnswer}
        onNext={nextFact}
        onExplanationRequest={handleExplanationRequest}
        canViewExplanation={isSubscribed || dailyExplanations < 5}
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={toggleSubscription}
      />
    </div>
  )
}

export default App
