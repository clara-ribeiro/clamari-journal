import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SpoilerDisclosure from "./index";

const meta = {
  title: "Atoms/SpoilerDisclosure",
  component: SpoilerDisclosure,
  tags: ["autodocs"],
  args: {
    children: (
      <p>They almost make it out of downtown Los Angeles.</p>
    ),
  },
  parameters: {
    layout: "centered",
    backgrounds: { value: "paper" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 420, color: "#1A1410" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SpoilerDisclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: {
    label: "The ending",
  },
};
