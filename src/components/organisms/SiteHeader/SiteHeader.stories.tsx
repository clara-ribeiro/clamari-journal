import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusChromeProvider } from "@/components/providers/StatusChromeProvider";
import { siteCopy } from "@/content/copy";
import SiteHeader from "./index";

const meta = {
  title: "Organisms/SiteHeader",
  component: SiteHeader,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StatusChromeProvider>
        <div style={{ minHeight: "12rem", paddingTop: "4.5rem" }}>
          <Story />
          <p style={{ margin: "1rem", opacity: 0.7 }}>
            Page content below the fixed header.
          </p>
        </div>
      </StatusChromeProvider>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/all-entries",
      },
    },
    backgrounds: { value: "navy" },
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Path without reveal-on-scroll — bar is always visible. */
export const AlwaysVisible: Story = {};

export const Films: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/films",
      },
    },
    backgrounds: { value: "films" },
  },
};

export const Stats: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/stats",
      },
    },
    backgrounds: { value: "stats" },
  },
};

export const PortugueseReview: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/pt/films/cat-on-a-hot-tin-roof",
      },
    },
    backgrounds: { value: "films" },
  },
};

/**
 * Home reveal: header stays hidden while the brand sentinel is on screen.
 * Scroll the canvas until the sentinel leaves to reveal the bar.
 */
export const HomeReveal: Story = {
  decorators: [
    (Story) => (
      <StatusChromeProvider>
        <div style={{ minHeight: "160vh" }}>
          <div
            id={siteCopy.header.brandSentinelId}
            style={{ height: "80vh" }}
            aria-hidden
          />
          <Story />
          <p style={{ margin: "1rem", opacity: 0.7 }}>
            Scroll past the empty hero region to reveal the header.
          </p>
        </div>
      </StatusChromeProvider>
    ),
  ],
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
    backgrounds: { value: "navy" },
  },
};
