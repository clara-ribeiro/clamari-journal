import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StarRating from "./index";

const meta = {
  title: "Atoms/StarRating",
  component: StarRating,
  tags: ["autodocs"],
  args: {
    value: 4,
    max: 5,
  },
  parameters: {
    layout: "centered",
    backgrounds: { value: "paper" },
  },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: { value: 0 },
};

export const Four: Story = {
  args: { value: 4 },
};

export const Full: Story = {
  args: { value: 5 },
};
