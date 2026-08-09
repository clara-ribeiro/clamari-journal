import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { journalEntries } from "@/stories/fixtures";
import HomeTemplate from "./index";

const meta = {
  title: "Templates/HomeTemplate",
  component: HomeTemplate,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { value: "navy" },
  },
  args: {
    recentEntries: journalEntries,
    reviewEntries: journalEntries.slice(0, 2),
    favoriteEntries: journalEntries,
    pagesRead: 12480,
    watchedHours: 312,
  },
} satisfies Meta<typeof HomeTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const EmptyFeeds: Story = {
  args: {
    recentEntries: [],
    reviewEntries: [],
    favoriteEntries: [],
  },
};
