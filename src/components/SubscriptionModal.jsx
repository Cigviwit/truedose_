"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Crown, Zap, BookOpen, BarChart3 } from "lucide-react"

const SubscriptionModal = ({ isOpen, onClose, onSubscribe }) => {
  const features = [
    {
      icon: BookOpen,
      title: "Unlimited Explanations",
      description: "Get detailed explanations for every question",
      color: "bg-blue-500",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track your progress and identify weak areas",
      color: "bg-green-500",
    },
    {
      icon: Zap,
      title: "Speed Insights",
      description: "Analyze your response times and accuracy",
      color: "bg-yellow-500",
    },
    {
      icon: Crown,
      title: "Premium Badge",
      description: "Show off your premium status",
      color: "bg-purple-600",
    },
  ]

  const handleSubscribe = () => {
    onSubscribe()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-purple-100 p-4 text-center border-b border-gray-200 relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 rounded-full bg-gray-500 hover:bg-gray-400 transition-all"
              >
                <X className="text-white" size={16} />
              </button>

              <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="text-white" size={24} />
              </div>

              <h2 className="text-purple-900 text-xl font-black mb-2">Upgrade to Premium</h2>
              <p className="text-gray-700 text-sm">Unlock unlimited explanations and features</p>
            </div>

            {/* Features */}
            <div className="p-4 space-y-3 max-h-48 overflow-y-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`${feature.color} p-2 rounded-full flex-shrink-0`}>
                    <feature.icon className="text-white" size={16} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-gray-900 font-bold text-sm mb-1">{feature.title}</h3>
                    <p className="text-gray-600 text-xs leading-tight">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pricing */}
            <div className="bg-purple-50 p-4 border-t border-gray-200">
              <div className="text-center mb-4">
                <div className="text-gray-900 text-2xl font-black mb-1">
                  ₹299<span className="text-gray-500 text-base font-bold">/month</span>
                </div>
                <div className="text-gray-600 text-sm">Cancel anytime • 7-day free trial</div>
              </div>

              <button
                onClick={handleSubscribe}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-base hover:shadow-lg transition-all mb-3"
              >
                Start Free Trial
              </button>

              <div className="text-center">
                <button onClick={onClose} className="text-gray-500 text-sm hover:text-gray-700 transition-colors">
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SubscriptionModal
