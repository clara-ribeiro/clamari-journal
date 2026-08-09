import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HeroBrand from "./index";

const meta = {
  title: "Molecules/HeroBrand",
  component: HeroBrand,
  tags: ["autodocs"],
  args: {
    title: "CLAMARI",
    script: "Journal",
  },
  parameters: {
    layout: "centered",
    backgrounds: { value: "navy" },
  },
} satisfies Meta<typeof HeroBrand>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
