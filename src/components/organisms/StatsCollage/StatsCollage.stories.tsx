import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { homeCopy } from "@/content/copy/home";
import { statsCopy } from "@/content/copy/stats";
import { statsMetrics } from "@/stories/fixtures";
import StatsCollage from "./index";

const meta = {
  title: "Organisms/StatsCollage",
  component: StatsCollage,
  tags: ["autodocs"],
  args: {
    stats: statsMetrics.slice(0, 2),
    images: homeCopy.statsCollage.images,
    titleId: homeCopy.statsCollage.titleId,
    ariaLabel: homeCopy.statsCollage.ariaLabel,
    statsHref: homeCopy.statsCollage.statsHref,
    tone: "gold",
  },
} satisfies Meta<typeof StatsCollage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HomeGold: Story = {};

export const StatsSplit: Story = {
  args: {
    stats: statsMetrics,
    images: statsCopy.collage.images,
    titleId: statsCopy.collage.titleId,
    ariaLabel: statsCopy.collage.ariaLabel,
    statsHref: undefined,
    tone: "split",
  },
  parameters: {
    backgrounds: { value: "white" },
  },
};
