import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SkipLink from "./index";

const meta = {
  title: "Atoms/SkipLink",
  component: SkipLink,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Visually hidden until focused. Tab into the canvas to reveal it.",
      },
    },
  },
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: "2rem" }}>
      <SkipLink />
      <p style={{ color: "rgba(232,238,244,0.7)" }}>
        Press Tab to focus the skip link.
      </p>
      <main id="main-content" tabIndex={-1}>
        Main content target
      </main>
    </div>
  ),
};
