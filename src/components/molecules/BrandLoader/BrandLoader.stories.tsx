import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusChromeProvider } from "@/components/providers/StatusChromeProvider";
import BrandLoader from "./index";

const meta = {
  title: "Molecules/BrandLoader",
  component: BrandLoader,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StatusChromeProvider>
        <div style={{ minHeight: "100vh" }}>
          <Story />
        </div>
      </StatusChromeProvider>
    ),
  ],
} satisfies Meta<typeof BrandLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: {
    label: "Fetching the shelf…",
  },
};
