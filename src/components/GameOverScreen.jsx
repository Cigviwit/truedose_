"use client"

import { motion } from "framer-motion"
import { RotateCcw, Trophy, Target, Zap, Crown, UserPlus, Home } from "lucide-react"
import { useRouter } from 'next/navigation';

const GameOverScreen = ({ streak, score, onRestart, isSubscribed, user, highestStreak }) => {
  const router = useRouter();
  const getGameOverMessage = () => {
    if (score > 500) return "Fantastic Performance!";
    if (score > 200) return "Great Effort!";
    return "You can do better!";
  };

  const getStreakMotivation = () => {
    if (streak >= 50) return "You're a TrueDose legend!";
    if (streak >= 25) return "Incredible streak!";
    if (streak >= 10) return "Solid knowledge!";
    if (streak >= 5) return "Good progress!";
    return "Keep pushing!";
  };

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
        <h1 className="text-white text-2xl sm:text-3xl font-black mb-1">Game Over!</h1>
        <p className="text-white text-base font-semibold">{getGameOverMessage()}</p>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/30 rounded-3xl p-6 mb-4 w-full max-w-xs shadow-2xl flex-shrink-0 border border-white/40 backdrop-blur-2xl"
        style={{
          boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.22)',
          border: '2px solid rgba(255,255,255,0.25)',
          backdropFilter: 'blur(18px) saturate(180%)',
        }}
      >
        <div className="space-y-4">
          {/* Streak */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className={`${getStreakColor()} p-3 rounded-full shadow-lg`}>
                <Trophy className="text-white" size={20} />
              </div>
            </div>
            <div className="text-gray-600 text-sm font-semibold mb-1">Final Streak</div>
            <div className="text-3xl font-black text-gray-900 mb-1">{streak}</div>
            <div className="text-sm font-bold text-gray-800">{getStreakMotivation()}</div>
          </div>

          {/* Score & Performance */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="bg-purple-600 p-3 rounded-full shadow-lg">
                  <Target className="text-white" size={16} />
                </div>
              </div>
              <div className="text-gray-600 text-sm font-semibold mb-1">Score</div>
              <div className="text-xl font-black text-gray-900">{score.toLocaleString()}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <div className="bg-green-500 p-3 rounded-full shadow-lg">
                  <Zap className="text-white" size={16} />
                </div>
              </div>
              <div className="text-gray-600 text-sm font-semibold mb-1">Highest Streak</div>
              <div className="text-xl font-bold text-gray-800">
                {user ? (
                  highestStreak !== null ? (
                    highestStreak
                  ) : (
                    "N/A"
                  )
                ) : (
                  <UserPlus size={16} className="inline-block text-blue-500 mr-1" />
                )}
              </div>
              {!user && (
                <p className="text-xs text-blue-500 mt-1 font-semibold">
                  Sign up to save!
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Motivational Message */}
      {!isSubscribed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-3 text-center flex-shrink-0 bg-white/20 rounded-xl p-3 border border-white/30 backdrop-blur-md shadow-md"
        >
          <p className="text-white text-sm mb-1 font-semibold">
            <Crown className="inline-block text-yellow-300 mr-1" size={16} />
            Unlock detailed analytics and more with Premium!
          </p>
          <button className="text-white text-xs underline font-bold hover:text-yellow-200 transition-colors">
            Learn More
          </button>
        </motion.div>
      )}

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

      <motion.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
        onClick={() => router.replace('/landing')}
        className="bg-gray-600 text-white px-8 py-3 rounded-xl font-bold text-base flex items-center gap-3 hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg mt-4 flex-shrink-0"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Home size={18} />
        <span>Home</span>
      </motion.button>
    </div>
  )
}

export default GameOverScreen
