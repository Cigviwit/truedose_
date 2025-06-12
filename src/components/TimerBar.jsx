"use client"

import { motion } from "framer-motion"

const TimerBar = ({ timeLeft }) => {
  const percentage = (timeLeft / 15) * 100

  const getColor = () => {
    if (timeLeft > 10) return "bg-green-500"
    if (timeLeft > 5) return "bg-yellow-400"
    return "bg-red-500"
  }

  return (
    <div className="w-full h-1 bg-gray-700 relative overflow-hidden">
      <motion.div
        className={`h-full ${getColor()}`}
        initial={{ width: "100%" }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.1, ease: "linear" }}
      />

      {/* Pulse effect when time is running out */}
      {timeLeft <= 5 && (
        <motion.div
          className="absolute inset-0 bg-red-500"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
        />
      )}
    </div>
  )
}

export default TimerBar
