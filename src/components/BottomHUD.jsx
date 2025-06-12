"use client"

import { motion } from "framer-motion"
import { Flame, Target, Zap, Eye, Crown } from "lucide-react"

const BottomHUD = ({ streak, score, speedBonus, dailyExplanations, isSubscribed }) => {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white mx-2 mb-2 rounded-xl p-2 shadow-xl flex-shrink-0"
    >
      <div className="flex items-center justify-between">
        {/* Streak */}
        <div className="flex items-center gap-1 flex-1">
          <div className="bg-orange-500 p-2 rounded-full shadow-lg">
            <Flame className="text-white" size={12} />
          </div>
          <div className="min-w-0">
            <div className="text-gray-900 font-bold text-sm">{streak}</div>
            <div className="text-gray-600 text-xs">Streak</div>
          </div>
        </div>

        {/* Score */}
        <div className="flex items-center gap-1 flex-1">
          <div className="bg-purple-600 p-2 rounded-full shadow-lg">
            <Target className="text-white" size={12} />
          </div>
          <div className="min-w-0">
            <div className="text-gray-900 font-bold text-sm">
              {score > 999 ? `${Math.floor(score / 1000)}k` : score}
            </div>
            <div className="text-gray-600 text-xs">Score</div>
          </div>
        </div>

        {/* Speed Bonus */}
        <div className="flex items-center gap-1 flex-1">
          <div className="bg-yellow-500 p-2 rounded-full shadow-lg">
            <Zap className="text-white" size={12} />
          </div>
          <div className="min-w-0">
            <div className="text-gray-900 font-bold text-sm">+{speedBonus}</div>
            <div className="text-gray-600 text-xs">Speed</div>
          </div>
        </div>

        {/* Explanations */}
        <div className="flex items-center gap-1 flex-1">
          <div className={`p-2 rounded-full shadow-lg ${isSubscribed ? "bg-green-500" : "bg-blue-500"}`}>
            {isSubscribed ? <Crown className="text-white" size={12} /> : <Eye className="text-white" size={12} />}
          </div>
          <div className="min-w-0">
            <div className="text-gray-900 font-bold text-sm">{isSubscribed ? "∞" : `${5 - dailyExplanations}`}</div>
            <div className="text-gray-600 text-xs">{isSubscribed ? "Pro" : "Left"}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BottomHUD
