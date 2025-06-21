"use client"

import { motion } from "framer-motion"

const SwipeContainer = ({ children }) => {
  return (
    <motion.div
      className="flex-1 flex flex-col"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

export default SwipeContainer
