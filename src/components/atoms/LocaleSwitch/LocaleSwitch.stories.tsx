import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import LocaleSwitch from "./index";

const meta = {
  title: "Atoms/LocaleSwitch",
  component: LocaleSwitch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/films/heat",
      },
    },
    backgrounds: { value: "navy" },
  },
} satisfies Meta<typeof LocaleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const Portuguese: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/pt/films/cat-on-a-hot-tin-roof",
      },
    },
  },
};

export const Paper: Story = {
  args: { tone: "paper" },
  parameters: {
    backgrounds: { value: "paper" },
  },
};
