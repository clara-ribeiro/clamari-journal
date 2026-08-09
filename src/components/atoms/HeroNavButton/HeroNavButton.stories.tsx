import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HeroNavButton from "./index";

const meta = {
  title: "Atoms/HeroNavButton",
  component: HeroNavButton,
  tags: ["autodocs"],
  args: {
    href: "/films",
    label: "Films",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof HeroNavButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Series: Story = {
  args: {
    href: "/series",
    label: "Series",
  },
};
