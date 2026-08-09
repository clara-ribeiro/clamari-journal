import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import BrandScript from "./index";

const meta = {
  title: "Atoms/BrandScript",
  component: BrandScript,
  tags: ["autodocs"],
  args: {
    children: "Journal",
  },
  parameters: {
    layout: "centered",
    backgrounds: { value: "navy" },
  },
} satisfies Meta<typeof BrandScript>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
