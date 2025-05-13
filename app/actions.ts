"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export type PollOption = {
  id?: string
  option_text: string
}

export type PollData = {
  title: string
  description?: string
  options: PollOption[]
  expiresAt?: string
  isPublic?: boolean
}

export type PollWithOptions = {
  id: string
  title: string
  description: string | null
  created_at: string
  expires_at: string | null
  is_public: boolean
  options: {
    id: string
    option_text: string
    votes_count: number
  }[]
  total_votes: number
}

// Create a new poll
export async function createPoll(data: PollData) {
  try {
    const supabase = createServerClient()

    // Insert poll
    const { data: pollData, error: pollError } = await supabase
      .from("polls")
      .insert({
        title: data.title,
        description: data.description || null,
        expires_at: data.expiresAt || null,
        is_public: data.isPublic !== undefined ? data.isPublic : true,
      })
      .select("id")
      .single()

    if (pollError) throw pollError

    // Insert options
    const optionsToInsert = data.options.map((option) => ({
      poll_id: pollData.id,
      option_text: option.option_text,
    }))

    const { error: optionsError } = await supabase.from("poll_options").insert(optionsToInsert)

    if (optionsError) throw optionsError

    revalidatePath("/")
    return { success: true, pollId: pollData.id }
  } catch (error) {
    console.error("Error creating poll:", error)
    return { success: false, error: "Failed to create poll" }
  }
}

// Get all polls
export async function getPolls() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase.from("polls").select("*").order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, polls: data }
  } catch (error) {
    console.error("Error fetching polls:", error)
    return { success: false, error: "Failed to fetch polls" }
  }
}

// Get a poll with its options and vote counts
export async function getPoll(pollId: string): Promise<{ success: boolean; poll?: PollWithOptions; error?: string }> {
  try {
    const supabase = createServerClient()

    // Get poll details
    const { data: pollData, error: pollError } = await supabase.from("polls").select("*").eq("id", pollId).single()

    if (pollError) throw pollError

    // Get poll options
    const { data: optionsData, error: optionsError } = await supabase
      .from("poll_options")
      .select("id, option_text")
      .eq("poll_id", pollId)

    if (optionsError) throw optionsError

    // Get all votes for this poll
    const { data: votesData, error: votesError } = await supabase
      .from("votes")
      .select("option_id")
      .eq("poll_id", pollId)

    if (votesError) throw votesError

    // Count votes for each option
    const voteCounts: Record<string, number> = {}
    votesData.forEach((vote) => {
      voteCounts[vote.option_id] = (voteCounts[vote.option_id] || 0) + 1
    })

    const optionsWithVotes = optionsData.map((option) => ({
      id: option.id,
      option_text: option.option_text,
      votes_count: voteCounts[option.id] || 0,
    }))

    const poll: PollWithOptions = {
      ...pollData,
      options: optionsWithVotes,
      total_votes: votesData.length,
    }

    return { success: true, poll }
  } catch (error) {
    console.error("Error fetching poll:", error)
    return { success: false, error: "Failed to fetch poll" }
  }
}

// Vote on a poll
export async function votePoll(pollId: string, optionId: string, voterId: string) {
  try {
    const supabase = createServerClient()

    // Check if user already voted
    const { data: existingVote, error: checkError } = await supabase
      .from("votes")
      .select("id")
      .eq("poll_id", pollId)
      .eq("voter_id", voterId)
      .maybeSingle()

    if (checkError) throw checkError

    if (existingVote) {
      // Update existing vote
      const { error: updateError } = await supabase
        .from("votes")
        .update({ option_id: optionId })
        .eq("id", existingVote.id)

      if (updateError) throw updateError
    } else {
      // Insert new vote
      const { error: insertError } = await supabase.from("votes").insert({
        poll_id: pollId,
        option_id: optionId,
        voter_id: voterId,
      })

      if (insertError) throw insertError
    }

    revalidatePath(`/poll/${pollId}`)
    return { success: true }
  } catch (error) {
    console.error("Error voting on poll:", error)
    return { success: false, error: "Failed to vote on poll" }
  }
}
