import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HomeJournalAbout from "./index";

const meta = {
  title: "Organisms/HomeJournalAbout",
  component: HomeJournalAbout,
  tags: ["autodocs"],
} satisfies Meta<typeof HomeJournalAbout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
