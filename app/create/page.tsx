"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createPoll, type PollData } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CreatePollPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<PollData>({
    title: "",
    description: "",
    options: [{ option_text: "" }, { option_text: "" }],
    isPublic: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index].option_text = value
    setFormData((prev) => ({ ...prev, options: newOptions }))
  }

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, { option_text: "" }],
    }))
  }

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) {
      toast({
        title: "Cannot remove option",
        description: "A poll must have at least two options.",
        variant: "destructive",
      })
      return
    }

    const newOptions = [...formData.options]
    newOptions.splice(index, 1)
    setFormData((prev) => ({ ...prev, options: newOptions }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your poll.",
        variant: "destructive",
      })
      return
    }

    // Check if at least two options are provided
    const validOptions = formData.options.filter((opt) => opt.option_text.trim())
    if (validOptions.length < 2) {
      toast({
        title: "Insufficient options",
        description: "Please provide at least two valid options.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createPoll({
        ...formData,
        options: validOptions,
      })

      if (result.success) {
        toast({
          title: "Poll created!",
          description: "Your poll has been created successfully.",
        })
        router.push(`/poll/${result.pollId}`)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Failed to create poll",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8 px-4">
      <div className="w-full max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create a New Poll</CardTitle>
              <CardDescription>Fill in the details below to create your poll</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Poll Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="What's your favorite programming language?"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Add some context to your poll..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Poll Options</Label>
                  {formData.options.map((option, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option.option_text}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        aria-label={`Remove option ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}

                  <Button type="button" variant="outline" size="sm" onClick={addOption} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublic: checked }))}
                  />
                  <Label htmlFor="public">Make this poll public</Label>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Poll
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
