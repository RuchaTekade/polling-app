"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function Header() {
  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        <div className="flex items-center gap-4">
          <Link href="/create">
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              <span>Create Poll</span>
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  )
}
