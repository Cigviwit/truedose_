"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Bookmark, BookmarkPlus, ArrowRight, Lock } from "lucide-react"
import { useState } from "react"

const ExplanationModal = ({ isOpen, onClose, fact, onNext, onExplanationRequest, canViewExplanation, userAnswer }) => {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    const bookmarks = JSON.parse(localStorage.getItem("truedose_bookmarks") || "[]")
    if (!isBookmarked) {
      bookmarks.push(fact.id)
    } else {
      const index = bookmarks.indexOf(fact.id)
      if (index > -1) bookmarks.splice(index, 1)
    }
    localStorage.setItem("truedose_bookmarks", JSON.stringify(bookmarks))
  }

  const handleContinue = () => {
    onClose()
    onNext()
  }

  if (!fact) return null

  // Check if user's answer is correct
  const isUserCorrect = userAnswer === fact.correct

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-t-2xl w-full overflow-hidden shadow-2xl"
            style={{ maxHeight: "80vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-purple-100 p-3 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-purple-900 font-bold text-base">
                  {isUserCorrect ? "🎉 Correct!" : "❌ Incorrect"}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBookmark}
                    className="p-2 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-all"
                  >
                    {isBookmarked ? (
                      <BookmarkPlus className="text-white" size={14} />
                    ) : (
                      <Bookmark className="text-white" size={14} />
                    )}
                  </button>
                  <button onClick={onClose} className="p-2 rounded-full bg-gray-500 hover:bg-gray-400 transition-all">
                    <X className="text-white" size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-3 overflow-y-auto" style={{ maxHeight: "50vh" }}>
              <div className="mb-3">
                <div className="text-gray-700 text-xs font-semibold mb-2">Statement:</div>
                <div className="text-gray-900 font-medium text-sm mb-3 leading-relaxed">{fact.statement}</div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-700 text-xs font-semibold">Your Answer:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                      isUserCorrect ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {userAnswer ? "TRUE" : "FALSE"}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-700 text-xs font-semibold">Correct Answer:</span>
                  <span className="px-2 py-1 rounded-full text-xs font-bold text-white bg-blue-500">
                    {fact.correct ? "TRUE" : "FALSE"}
                  </span>
                </div>
              </div>

              {/* Explanation Section */}
              <div className="mb-3">
                <div className="text-gray-700 text-xs font-semibold mb-2">Explanation:</div>
                {canViewExplanation ? (
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="text-gray-800 text-xs leading-relaxed">{fact.explanation}</div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                    <div className="bg-red-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Lock className="text-white" size={14} />
                    </div>
                    <div className="text-gray-800 text-xs mb-2 font-semibold">5 free explanations used today</div>
                    <button
                      onClick={onExplanationRequest}
                      className="bg-purple-600 text-white px-3 py-2 rounded-full text-xs font-bold"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                )}
              </div>

              {/* Source */}
              {canViewExplanation && fact.source && (
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                  <div className="text-gray-700 text-xs">
                    <span className="font-semibold">Source:</span> {fact.source}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-purple-50 p-3 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={handleContinue}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ExplanationModal
