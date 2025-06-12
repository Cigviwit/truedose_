"use client"

import { motion } from "framer-motion"
import { Clock, Zap } from "lucide-react"

const FactCard = ({ fact, onAnswer, userAnswer, timeLeft, speedBonus, onContinue }) => {
  const getAnswerColor = (answer) => {
    if (userAnswer === null) return "bg-blue-500 hover:bg-blue-600"
    if (userAnswer === answer) {
      return userAnswer === fact.correct ? "bg-green-500 shadow-lg" : "bg-red-500 shadow-lg"
    }
    return "bg-gray-500"
  }

  const getAnswerIcon = (answer) => {
    if (userAnswer === null) return null
    if (userAnswer === answer) {
      return userAnswer === fact.correct ? "✓" : "✗"
    }
    if (answer === fact.correct && userAnswer !== null) {
      return "✓"
    }
    return null
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-3 py-2 min-h-0">
      {/* Speed Bonus Indicator */}
      {speedBonus > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="flex items-center justify-center mb-2"
        >
          <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Zap size={12} />
            Speed +{speedBonus}
          </div>
        </motion.div>
      )}

      {/* Fact Card */}
      <motion.div
        className="bg-white rounded-2xl p-4 mb-4 shadow-xl flex-shrink-0"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-purple-600 rounded-full p-2 shadow-lg">
              <Clock className="text-white" size={16} />
            </div>
            <span className="text-gray-800 ml-2 text-sm font-bold">{timeLeft}s</span>
          </div>

          <h2 className="text-gray-900 text-base sm:text-lg font-bold mb-3 leading-tight px-2">{fact.statement}</h2>

          <div className="bg-purple-100 rounded-full px-3 py-1 inline-block">
            <span className="text-purple-800 font-semibold text-xs">{fact.category}</span>
          </div>
        </div>
      </motion.div>

      {/* Answer Buttons - Now Horizontal */}
      <div className="flex gap-3 flex-shrink-0">
        {[true, false].map((answer) => (
          <motion.button
            key={answer}
            onClick={() => onAnswer(answer)}
            disabled={userAnswer !== null}
            className={`flex-1 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300 shadow-lg ${getAnswerColor(answer)}`}
            whileHover={{ scale: userAnswer === null ? 1.02 : 1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ x: answer ? 100 : -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{answer ? "TRUE" : "FALSE"}</span>
              {getAnswerIcon(answer) && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xl">
                  {getAnswerIcon(answer)}
                </motion.span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Continue Button */}
      {userAnswer !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex-shrink-0">
          <button
            onClick={onContinue}
            className="w-full bg-white text-purple-600 py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all"
          >
            Continue
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default FactCard
