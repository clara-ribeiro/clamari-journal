import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import BrandTitle from "./index";

const meta = {
  title: "Atoms/BrandTitle",
  component: BrandTitle,
  tags: ["autodocs"],
  args: {
    children: "CLAMARI",
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof BrandTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
