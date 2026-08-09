import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusChromeProvider } from "@/components/providers/StatusChromeProvider";
import StateShell from "./index";

const meta = {
  title: "Molecules/StateShell",
  component: StateShell,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StatusChromeProvider>
        <Story />
      </StatusChromeProvider>
    ),
  ],
} satisfies Meta<typeof StateShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <p style={{ fontSize: "1.5rem", letterSpacing: "0.08em" }}>
        Journal state
      </p>
    ),
  },
};

export const Rotating: Story = {
  args: {
    rotate: true,
    rotateMs: 2500,
    children: (
      <p style={{ fontSize: "1.5rem", letterSpacing: "0.08em" }}>
        Rotating backdrops
      </p>
    ),
  },
};
