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
import { usePathname, useRouter } from "next/navigation"

function App() {
  const [paused, setPaused] = useState(false)
  const router = useRouter();
  const pathname = usePathname();
  const isPracticeMode = pathname === '/practice';

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
    user,
    highestStreak,
    handleAnswer,
    nextFact,
    resetGame,
    toggleSubscription,
    setShowExplanation,
    currentFact,
    quitGame,
  } = useGameState(paused, isPracticeMode)

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  const speedBonus = timeLeft > 10 ? 50 : timeLeft > 5 ? 25 : 0

  const handleQuit = () => {
    router.replace('/landing');
  };

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

  // Freeze timer when paused
  useEffect(() => {
    if (!paused) return
    // No-op: timer is managed in useGameState, but we can block input and overlay
  }, [paused])

  return (
    <div
      className="h-screen w-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex flex-col relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #ef4444 100%)",
        height: "100vh",
        maxHeight: "100vh",
      }}
    >
      {/* Pause Overlay */}
      <AnimatePresence>
        {paused && (
          <motion.div
            key="pause-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              backdropFilter: "blur(3px) grayscale(0.7)",
            }}
          >
            <div className="flex flex-col space-y-4 items-center">
              <button
                onClick={() => setPaused(false)}
                className="bg-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-gray-100 transition-colors duration-200"
              >
                Resume
              </button>
              <button
                onClick={() => {
                  setPaused(false); // Close pause overlay
                  quitGame(); // Trigger game quit logic
                }}
                className="bg-red-500 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-red-600 transition-colors duration-200"
              >
                Quit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
      {gameState === "playing" && !paused && <TimerBar timeLeft={timeLeft} />}

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col min-h-0" style={{ minHeight: 0 }}>
        <AnimatePresence mode="wait">
          {gameState === "playing" && !paused && (
            <SwipeContainer key="game">
              <FactCard
                fact={currentFact}
                onAnswer={paused ? () => {} : handleAnswer}
                userAnswer={userAnswer}
                timeLeft={timeLeft}
                speedBonus={speedBonus}
                onContinue={() => setShowExplanation(true)}
              />
            </SwipeContainer>
          )}

          {gameState === "gameOver" && (
            <GameOverScreen
              key="gameOver"
              streak={streak}
              score={score}
              onRestart={resetGame}
              isSubscribed={isSubscribed}
              user={user}
              highestStreak={highestStreak}
              isPracticeMode={isPracticeMode}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom HUD */}
      {gameState === "playing" && (
        <BottomHUD
          streak={streak}
          score={score}
          speedBonus={speedBonus}
          onPause={() => setPaused(true)}
          onQuit={handleQuit}
          isPracticeMode={isPracticeMode}
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
