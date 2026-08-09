import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HeroNav from "./index";

const meta = {
  title: "Molecules/HeroNav",
  component: HeroNav,
  tags: ["autodocs"],
  args: {
    ariaLabel: "Browse by medium",
    items: [
      { href: "/films", label: "Films" },
      { href: "/series", label: "Series" },
      { href: "/books", label: "Books" },
    ],
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof HeroNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SingleItem: Story = {
  args: {
    items: [{ href: "/films", label: "Films" }],
  },
};
