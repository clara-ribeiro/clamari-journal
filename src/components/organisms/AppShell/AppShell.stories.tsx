import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import BrandLoader from "@/components/molecules/BrandLoader";
import AppShell from "./index";

const meta = {
  title: "Organisms/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        // Non-reveal path so header/footer chrome stay visible in the shell story.
        pathname: "/all-entries",
      },
    },
    backgrounds: { value: "navy" },
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <main id="main-content" style={{ padding: "3rem 1.5rem" }}>
        <h1>Journal page</h1>
        <p style={{ opacity: 0.75, maxWidth: "40rem" }}>
          AppShell wraps skip link, header, content, and footer with status
          chrome context.
        </p>
      </main>
    ),
  },
};

export const WithStatusChild: Story = {
  args: {
    children: <BrandLoader />,
  },
};
