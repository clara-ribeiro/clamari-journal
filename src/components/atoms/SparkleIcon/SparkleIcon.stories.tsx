import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SparkleIcon from "./index";

const meta = {
  title: "Atoms/SparkleIcon",
  component: SparkleIcon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SparkleIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
