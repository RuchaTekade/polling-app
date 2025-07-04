import { getPoll } from "@/app/actions";
import { PollResults } from "@/components/poll-results";
import { VotingForm } from "@/components/voting-form";
import { SharePoll } from "@/components/share-poll";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function PollPage({ params }: { params: { id: string } }) {
  const { success, poll, error } = await getPoll(params.id);

  if (!success || !poll) {
    notFound();
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          {poll.description && <CardDescription className="text-base">{poll.description}</CardDescription>}
          <div className="text-sm text-muted-foreground">
            Created {formatDate(poll.created_at)}
            {poll.expires_at && ` • Expires ${formatDate(poll.expires_at)}`}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Voting Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Cast Your Vote</h3>
            <VotingForm poll={poll} />
          </div>

          {/* Results Section */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium mb-4">Results</h3>
            <div className="w-full max-w-lg mx-auto">
              <PollResults poll={poll} />
            </div>
          </div>

          {/* Share Section */}
          <div className="pt-4 border-t">
            <SharePoll pollId={poll.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
