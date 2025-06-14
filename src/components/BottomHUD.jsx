"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Target, Zap, Pause, Home } from "lucide-react"

const AnimatedValue = ({ value, className }) => {
  const [prev, setPrev] = useState(value)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (value !== prev) {
      setAnimate(true)
      setPrev(value)
      const timeout = setTimeout(() => setAnimate(false), 400)
      return () => clearTimeout(timeout)
    }
  }, [value, prev])

  return (
    <motion.span
      animate={animate ? { scale: 1.3, color: '#a855f7' } : { scale: 1, color: '#111827' }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={className}
      style={{ display: 'inline-block' }}
    >
      {value}
    </motion.span>
  )
}

const BottomHUD = ({ streak, score, speedBonus, onPause, onQuit }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mx-2 mb-4 rounded-3xl py-5 px-6 shadow-2xl flex-shrink-0 border border-white/40 backdrop-blur-2xl bg-white/30"
      style={{
        minHeight: '80px',
        boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.22)',
        border: '2px solid rgba(255,255,255,0.25)',
        backdropFilter: 'blur(18px) saturate(180%)',
      }}
    >
      <div className="flex items-center justify-between h-full text-center w-full">
        {/* Pause */}
        <div className="flex flex-col items-center justify-center gap-1 flex-1">
          <button
            onClick={onPause}
            className="bg-gray-700 p-3 rounded-full shadow-lg mb-1 hover:bg-gray-900 transition-colors"
            aria-label="Pause"
          >
            <Pause className="text-white" size={20} />
          </button>
          <div className="min-w-0">
            <div className="text-gray-600 text-xs">Pause</div>
          </div>
        </div>
        {/* Quit Button */}
        <div className="flex flex-col items-center justify-center gap-1 flex-1">
          <button
            onClick={onQuit}
            className="bg-gray-700 p-3 rounded-full shadow-lg mb-1 hover:bg-gray-900 transition-colors"
            aria-label="Home"
          >
            <Home className="text-white" size={20} />
          </button>
          <div className="min-w-0">
            <div className="text-gray-600 text-xs">Home</div>
          </div>
        </div>
        {/* Streak */}
        <div className="flex flex-col items-center justify-center gap-1 flex-1">
          <div className="bg-orange-500 p-3 rounded-full shadow-lg mb-1">
            <Flame className="text-white" size={16} />
          </div>
          <div className="min-w-0">
            <AnimatedValue value={streak} className="font-bold text-lg text-black" />
            <div className="text-gray-600 text-xs">Streak</div>
          </div>
        </div>
        {/* Score */}
        <div className="flex flex-col items-center justify-center gap-1 flex-1">
          <div className="bg-purple-600 p-3 rounded-full shadow-lg mb-1">
            <Target className="text-white" size={16} />
          </div>
          <div className="min-w-0">
            <AnimatedValue value={score > 999 ? `${Math.floor(score / 1000)}k` : score} className="font-bold text-lg text-black" />
            <div className="text-gray-600 text-xs">Score</div>
          </div>
        </div>
        {/* Speed Bonus */}
        <div className="flex flex-col items-center justify-center gap-1 flex-1">
          <div className="bg-yellow-500 p-3 rounded-full shadow-lg mb-1">
            <Zap className="text-white" size={16} />
          </div>
          <div className="min-w-0">
            <AnimatedValue value={`+${speedBonus}`} className="font-bold text-lg" />
            <div className="text-gray-600 text-xs">Speed</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BottomHUD
