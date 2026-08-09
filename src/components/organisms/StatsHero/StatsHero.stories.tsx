import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StatsHero from "./index";

const meta = {
  title: "Organisms/StatsHero",
  component: StatsHero,
  tags: ["autodocs"],
  parameters: {
    // Match the hero field — avoid navy body bleed under the section.
    backgrounds: { value: "stats" },
  },
} satisfies Meta<typeof StatsHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
