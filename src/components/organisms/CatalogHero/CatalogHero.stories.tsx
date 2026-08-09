import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { booksCopy } from "@/content/copy/books";
import { filmsCopy } from "@/content/copy/films";
import { seriesCopy } from "@/content/copy/series";
import CatalogHero from "./index";

const meta = {
  title: "Organisms/CatalogHero",
  component: CatalogHero,
  tags: ["autodocs"],
  args: {
    medium: "films",
    copy: filmsCopy.list.hero,
  },
} satisfies Meta<typeof CatalogHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Films: Story = {
  parameters: {
    backgrounds: { value: "films" },
  },
};

export const Series: Story = {
  args: {
    medium: "series",
    copy: seriesCopy.list.hero,
  },
  parameters: {
    backgrounds: { value: "paper" },
  },
};

export const Books: Story = {
  args: {
    medium: "books",
    copy: booksCopy.list.hero,
  },
  parameters: {
    backgrounds: { value: "paper" },
  },
};
