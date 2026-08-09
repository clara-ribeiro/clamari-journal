import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ReviewRenderer from "./index";

const meta = {
  title: "Molecules/ReviewRenderer",
  component: ReviewRenderer,
  tags: ["autodocs"],
  args: {
    heading: "Review",
    headingId: "review-heading",
    emptyLabel: "No review yet.",
  },
  parameters: {
    layout: "centered",
    backgrounds: { value: "paper" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480, color: "#1A1410" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReviewRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithProse: Story = {
  args: {
    children: (
      <p>
        A cold, precise heist thriller that still feels human. The downtown
        shootout remains one of the great set pieces in American cinema.
      </p>
    ),
  },
};
