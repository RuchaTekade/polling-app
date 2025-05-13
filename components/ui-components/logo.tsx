"use client"

import { motion } from "framer-motion"
import { BarChart3 } from "lucide-react"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <motion.div
        initial={{ rotate: -10, scale: 0.9 }}
        animate={{ rotate: 0, scale: 1 }}
        whileHover={{ rotate: -5, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
      >
        <BarChart3 className="h-6 w-6 text-primary" />
      </motion.div>
      <motion.span
        className="font-bold text-xl"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        PollWave
      </motion.span>
    </Link>
  )
}
