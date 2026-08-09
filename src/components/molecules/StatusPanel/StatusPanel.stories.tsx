import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";
import { StatusChromeProvider } from "@/components/providers/StatusChromeProvider";
import { statesCopy } from "@/content/copy/states";
import StatusPanel from "./index";

const meta = {
  title: "Molecules/StatusPanel",
  component: StatusPanel,
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
} satisfies Meta<typeof StatusPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotFound: Story = {
  args: {
    title: statesCopy.notFound.title,
    message: statesCopy.notFound.message,
    titleId: statesCopy.notFound.titleId,
  },
};

export const ErrorWithRetry: Story = {
  args: {
    title: statesCopy.error.title,
    message: statesCopy.error.message,
    titleId: statesCopy.error.titleId,
    onRetry: fn(),
  },
};
