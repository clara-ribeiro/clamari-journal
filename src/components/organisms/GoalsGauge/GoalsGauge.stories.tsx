import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { goalMetrics } from "@/stories/fixtures";
import GoalsGauge from "./index";

const meta = {
  title: "Organisms/GoalsGauge",
  component: GoalsGauge,
  tags: ["autodocs"],
  args: {
    goals: goalMetrics,
  },
  parameters: {
    backgrounds: { value: "white" },
  },
} satisfies Meta<typeof GoalsGauge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ExceededOnly: Story = {
  args: {
    goals: goalMetrics.filter((goal) => goal.exceeded),
  },
};
