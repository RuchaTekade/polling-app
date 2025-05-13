"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { votePoll } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { generateUniqueId } from "@/lib/utils"
import type { PollWithOptions } from "@/app/actions"

type VotingFormProps = {
  poll: PollWithOptions
}

export function VotingForm({ poll }: VotingFormProps) {
  const { toast } = useToast()
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voterId, setVoterId] = useState<string>("")

  useEffect(() => {
    // Generate or retrieve voter ID
    const storedVoterId = localStorage.getItem("voter_id")
    if (storedVoterId) {
      setVoterId(storedVoterId)
    } else {
      const newVoterId = generateUniqueId()
      localStorage.setItem("voter_id", newVoterId)
      setVoterId(newVoterId)
    }

    // Check if user already voted
    const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "{}")
    if (votedPolls[poll.id]) {
      setSelectedOption(votedPolls[poll.id])
    }
  }, [poll.id])

  const handleVote = async () => {
    if (!selectedOption) {
      toast({
        title: "No option selected",
        description: "Please select an option to vote.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await votePoll(poll.id, selectedOption, voterId)

      if (result.success) {
        // Save vote to local storage
        const votedPolls = JSON.parse(localStorage.getItem("voted_polls") || "{}")
        votedPolls[poll.id] = selectedOption
        localStorage.setItem("voted_polls", JSON.stringify(votedPolls))

        toast({
          title: "Vote recorded!",
          description: "Your vote has been successfully recorded.",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Failed to vote",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
        {poll.options.map((option, index) => (
          <motion.div
            key={option.id}
            className="flex items-center space-x-2 rounded-md border p-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id} className="flex-grow cursor-pointer">
              {option.option_text}
            </Label>
          </motion.div>
        ))}
      </RadioGroup>

      <Button onClick={handleVote} disabled={isSubmitting || !selectedOption} className="w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {selectedOption ? "Submit Vote" : "Select an Option"}
      </Button>
    </div>
  )
}
