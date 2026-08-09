import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HomeHero from "./index";

const meta = {
  title: "Organisms/HomeHero",
  component: HomeHero,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { value: "navy" },
  },
} satisfies Meta<typeof HomeHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
