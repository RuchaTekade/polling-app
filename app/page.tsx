import { getPolls } from "./actions"
import { PollCard } from "@/components/poll-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart3, Plus } from "lucide-react"

export default async function Home() {
  const { success, polls, error } = await getPolls()

  return (
    <div className="container py-8 md:py-12">
      <section className="mx-auto max-w-5xl text-center mb-12 md:mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-4">
          Create and Share Polls with Ease
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create custom polls, share them with friends, and view real-time results
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/create">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create a Poll
            </Button>
          </Link>
          <Link href="#recent-polls">
            <Button size="lg" variant="outline" className="gap-2">
              <BarChart3 className="h-5 w-5" />
              View Recent Polls
            </Button>
          </Link>
        </div>
      </section>

      <section id="recent-polls" className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Recent Polls</h2>

        {!success ? (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-muted-foreground">Failed to load polls. {error}</p>
          </div>
        ) : polls && polls.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 border rounded-lg">
            <p className="text-muted-foreground mb-4">No polls have been created yet.</p>
            <Link href="/create">
              <Button>Create the First Poll</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
