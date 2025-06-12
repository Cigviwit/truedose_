"use client"

import { motion } from "framer-motion"
import { RotateCcw, Trophy, Target, Zap } from "lucide-react"

const GameOverScreen = ({ streak, score, onRestart }) => {
  const getStreakMessage = () => {
    if (streak >= 50) return "Legendary! 🏆"
    if (streak >= 25) return "Amazing! 🔥"
    if (streak >= 10) return "Great! ⭐"
    if (streak >= 5) return "Good! 👍"
    return "Keep trying! 💪"
  }

  const getStreakColor = () => {
    if (streak >= 50) return "bg-yellow-500"
    if (streak >= 25) return "bg-orange-500"
    if (streak >= 10) return "bg-green-500"
    if (streak >= 5) return "bg-blue-500"
    return "bg-gray-500"
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-2 text-center min-h-0">
      {/* Game Over Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-3 flex-shrink-0"
      >
        <h1 className="text-white text-2xl sm:text-3xl font-black mb-1">Game Over</h1>
        <p className="text-white text-base font-semibold">Better luck next time!</p>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-4 mb-3 w-full max-w-xs shadow-2xl flex-shrink-0"
      >
        <div className="space-y-3">
          {/* Streak */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className={`${getStreakColor()} p-2 rounded-full shadow-lg`}>
                <Trophy className="text-white" size={18} />
              </div>
            </div>
            <div className="text-gray-600 text-xs font-semibold mb-1">Final Streak</div>
            <div className="text-2xl font-black text-gray-900 mb-1">{streak}</div>
            <div className="text-sm font-bold text-gray-800">{getStreakMessage()}</div>
          </div>

          {/* Score & Performance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="bg-purple-600 p-2 rounded-full shadow-lg">
                  <Target className="text-white" size={14} />
                </div>
              </div>
              <div className="text-gray-600 text-xs font-semibold mb-1">Score</div>
              <div className="text-lg font-black text-gray-900">{score.toLocaleString()}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="bg-yellow-500 p-2 rounded-full shadow-lg">
                  <Zap className="text-white" size={14} />
                </div>
              </div>
              <div className="text-gray-600 text-xs font-semibold mb-1">Avg</div>
              <div className="text-lg font-bold text-gray-800">
                {streak > 0 ? `${(score / streak).toFixed(0)}` : "0"}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-3 text-center flex-shrink-0"
      >
        <p className="text-white text-sm mb-1 font-semibold">
          {streak >= 10 ? "Excellent knowledge!" : "Practice makes perfect!"}
        </p>
        <p className="text-white text-xs">Challenge yourself to beat your score!</p>
      </motion.div>

      {/* Restart Button */}
      <motion.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onRestart}
        className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold text-base flex items-center gap-3 hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg flex-shrink-0"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <RotateCcw size={18} />
        <span>Play Again</span>
      </motion.button>
    </div>
  )
}

export default GameOverScreen
