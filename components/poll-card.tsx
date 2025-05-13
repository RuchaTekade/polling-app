"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { BarChart3, Calendar } from "lucide-react"

type PollCardProps = {
  poll: {
    id: string
    title: string
    description: string | null
    created_at: string
    expires_at: string | null
  }
}

export function PollCard({ poll }: PollCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
          {poll.description && <CardDescription className="line-clamp-2">{poll.description}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created {formatDate(poll.created_at)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Link href={`/poll/${poll.id}`} className="w-full">
            <Button className="w-full gap-2">
              <BarChart3 className="h-4 w-4" />
              View Poll
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
