import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  catalogHeat,
  catalogTitans,
  catalogWire,
} from "@/stories/fixtures";
import MixedEntryCard from "./index";

const meta = {
  title: "Molecules/MixedEntryCard",
  component: MixedEntryCard,
  tags: ["autodocs"],
  args: {
    item: catalogHeat,
  },
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 260 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MixedEntryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Film: Story = {};

export const Series: Story = {
  args: { item: catalogWire },
};

export const Book: Story = {
  args: { item: catalogTitans },
};
