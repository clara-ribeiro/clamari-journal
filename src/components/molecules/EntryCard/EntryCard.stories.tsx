import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { journalHeat, journalTitans, journalWire } from "@/stories/fixtures";
import EntryCard from "./index";

const meta = {
  title: "Molecules/EntryCard",
  component: EntryCard,
  tags: ["autodocs"],
  args: {
    entry: journalHeat,
  },
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 220 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EntryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Film: Story = {};

export const Series: Story = {
  args: { entry: journalWire },
};

export const Book: Story = {
  args: { entry: journalTitans },
};

export const Unrated: Story = {
  args: {
    entry: { ...journalHeat, rating: undefined },
  },
};
