import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusChromeProvider } from "@/components/providers/StatusChromeProvider";
import SiteFooter from "./index";

const meta = {
  title: "Organisms/SiteFooter",
  component: SiteFooter,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StatusChromeProvider>
        <div style={{ minHeight: "40vh", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <Story />
        </div>
      </StatusChromeProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Home: Story = {};

export const Films: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/films/heat",
      },
    },
    backgrounds: { value: "films" },
  },
};
