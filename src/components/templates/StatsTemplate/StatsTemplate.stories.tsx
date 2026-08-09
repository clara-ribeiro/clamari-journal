import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { goalMetrics, statsMetrics } from "@/stories/fixtures";
import StatsTemplate from "./index";

const meta = {
  title: "Templates/StatsTemplate",
  component: StatsTemplate,
  tags: ["autodocs"],
  args: {
    metrics: statsMetrics,
    goals: goalMetrics,
  },
  parameters: {
    backgrounds: { value: "stats" },
  },
} satisfies Meta<typeof StatsTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const GoalsExceeded: Story = {
  args: {
    goals: goalMetrics.map((goal) => ({
      ...goal,
      current: goal.target + 5,
      percent: Math.round(((goal.target + 5) / goal.target) * 100),
      exceeded: true,
      value: `${goal.target + 5}/${goal.target}`,
    })),
  },
};
