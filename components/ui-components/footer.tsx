"use client"

import { motion } from "framer-motion"

export function Footer() {
  return (
    <motion.footer
      className="border-t py-6 md:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} PollWave. All rights reserved.
        </p>
        <p className="text-center text-sm text-muted-foreground md:text-right">Create and share polls with ease</p>
      </div>
    </motion.footer>
  )
}
