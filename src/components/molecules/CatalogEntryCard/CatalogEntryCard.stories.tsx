import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  catalogAlien,
  catalogHeat,
  catalogTitans,
  catalogWire,
} from "@/stories/fixtures";
import CatalogEntryCard from "./index";

const meta = {
  title: "Molecules/CatalogEntryCard",
  component: CatalogEntryCard,
  tags: ["autodocs"],
  args: {
    item: catalogHeat,
    tone: "dark",
    layout: "cards",
  },
  parameters: {
    layout: "centered",
    backgrounds: { value: "films" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 260 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CatalogEntryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CardsDark: Story = {};

export const CardsLight: Story = {
  args: {
    item: catalogTitans,
    tone: "light",
  },
  parameters: {
    backgrounds: { value: "paper" },
  },
};

export const List: Story = {
  args: {
    layout: "list",
    item: catalogWire,
    tone: "light",
  },
  parameters: {
    backgrounds: { value: "paper" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 640 }}>
        <Story />
      </div>
    ),
  ],
};

export const Watchlist: Story = {
  args: {
    item: catalogAlien,
  },
};
