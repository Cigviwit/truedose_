"use client"

import { motion } from "framer-motion"
import { Clock, Zap } from "lucide-react"

const FactCard = ({ fact, onAnswer, userAnswer, timeLeft, speedBonus, onContinue }) => {
  if (!fact) {
    return null; // Render nothing if fact is undefined
  }

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
          <div className="bg-yellow-400/80 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg backdrop-blur-md border border-yellow-200/40">
            <Zap size={12} />
            Speed +{speedBonus}
          </div>
        </motion.div>
      )}

      {/* Fact Card */}
      <motion.div
        className="bg-white/30 rounded-3xl p-8 mb-6 shadow-2xl flex-shrink-0 border border-white/40 backdrop-blur-2xl"
        whileHover={{ scale: 1.03, boxShadow: '0 16px 48px 0 rgba(31, 38, 135, 0.25)' }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', backdropFilter: 'blur(18px)' }}
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-gray-900/90 text-xl sm:text-2xl font-bold leading-tight px-2 drop-shadow-lg text-center">
            {fact.statement}
          </h2>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-2 bg-purple-100/60 rounded-full px-4 py-2 shadow-md backdrop-blur-md border border-purple-200/40">
              <span className="text-purple-800 font-semibold text-xs">{fact.category}</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-600/80 rounded-full px-3 py-2 shadow-lg backdrop-blur-md border border-purple-200/40">
              <Clock className="text-white" size={18} />
              <span className="text-white font-bold text-base drop-shadow-lg">{timeLeft}s</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Answer Buttons - Now Fill Vertical Space */}
      <div className="flex gap-4 flex-1 items-stretch mb-2">
        {[true, false].map((answer) => (
          <motion.button
            key={answer}
            onClick={() => onAnswer(answer)}
            disabled={userAnswer !== null}
            className={`flex-1 flex items-center justify-center rounded-3xl text-white font-bold text-3xl transition-all duration-300 shadow-2xl border border-white/40 bg-opacity-60 backdrop-blur-2xl h-full min-h-[120px] select-none ${getAnswerColor(answer)}`}
            style={{
              background:
                userAnswer === null
                  ? 'rgba(59, 130, 246, 0.25)'
                  : userAnswer === answer
                  ? userAnswer === fact.correct
                    ? 'rgba(34,197,94,0.35)'
                    : 'rgba(239,68,68,0.35)'
                  : 'rgba(107,114,128,0.18)',
              boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.22)',
              border: '2px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(18px) saturate(180%)',
            }}
            whileHover={{ scale: userAnswer === null ? 1.03 : 1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ x: answer ? 100 : -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="drop-shadow-lg">{answer ? "TRUE" : "FALSE"}</span>
            {getAnswerIcon(answer) && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-4xl ml-2 drop-shadow-lg">
                {getAnswerIcon(answer)}
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Continue Button */}
      {userAnswer !== null && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex-shrink-0">
          <button
            onClick={onContinue}
            className="w-full bg-white/40 text-purple-600 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all border border-white/40 backdrop-blur-md drop-shadow-lg"
            style={{backdropFilter: 'blur(10px)'}}
          >
            Continue
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default FactCard
