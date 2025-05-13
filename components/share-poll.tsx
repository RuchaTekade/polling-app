"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Share2, Check, Twitter, Facebook, Linkedin } from "lucide-react"
import { getShareUrl } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

type SharePollProps = {
  pollId: string
}

export function SharePoll({ pollId }: SharePollProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const shareUrl = getShareUrl(pollId)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Poll link copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard",
        variant: "destructive",
      })
    }
  }

  const shareOnSocial = (platform: string) => {
    let url = ""
    const text = "Check out this poll I found!"

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
        break
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        break
    }

    window.open(url, "_blank")
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            <Share2 className="h-5 w-5 mr-2" />
            Share this Poll
          </h3>

          <div className="flex space-x-2 mb-4">
            <Input
              value={shareUrl}
              readOnly
              className="flex-grow"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button variant="outline" size="icon" onClick={copyToClipboard} aria-label="Copy link to clipboard">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex space-x-2 justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareOnSocial("twitter")}
              aria-label="Share on Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareOnSocial("facebook")}
              aria-label="Share on Facebook"
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareOnSocial("linkedin")}
              aria-label="Share on LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
