import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import RefreshButton from "./index";

const meta = {
  title: "Atoms/RefreshButton",
  component: RefreshButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof RefreshButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: {
    label: "Try again",
  },
};
