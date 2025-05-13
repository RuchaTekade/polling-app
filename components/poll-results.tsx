"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { PollWithOptions } from "@/app/actions";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

type PollResultsProps = {
  poll: PollWithOptions;
};

export function PollResults({ poll }: PollResultsProps) {
  const chartData = poll.options.map((option) => ({
    name: option.option_text,
    value: option.votes_count,
  }));

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-6))",
    "hsl(var(--chart-7))",
    "hsl(var(--chart-8))",
  ];

  const hasVotes = poll.total_votes > 0;

  return (
    <div className="space-y-4 w-full">
      <div className="h-64 w-full">
        {hasVotes ? (
          <ChartContainer
            config={poll.options.reduce(
              (acc, option, index) => {
                acc[`option-${index}`] = {
                  label: option.option_text,
                  color: COLORS[index % COLORS.length],
                };
                return acc;
              },
              {} as Record<string, { label: string; color: string }>,
            )}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground text-center">No votes yet. Be the first to vote!</p>
          </div>
        )}
      </div>

      <div className="space-y-2 w-full">
        {poll.options.map((option, index) => {
          const percentage = hasVotes ? Math.round((option.votes_count / poll.total_votes) * 100) : 0;

          return (
            <div key={option.id} className="space-y-1 w-full">
              <div className="flex justify-between text-sm">
                <span>{option.option_text}</span>
                <span>
                  {option.votes_count} votes ({percentage}%)
                </span>
              </div>
              <motion.div
                className="h-2 rounded-full bg-muted overflow-hidden w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                />
              </motion.div>
            </div>
          );
        })}

        <div className="text-sm text-muted-foreground text-right pt-2">Total votes: {poll.total_votes}</div>
      </div>
    </div>
  );
}
