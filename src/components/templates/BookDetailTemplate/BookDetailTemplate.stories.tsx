import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { booksCopy } from "@/content/copy/books";
import { bookDetail } from "@/stories/fixtures";
import BookDetailTemplate from "./index";

const meta = {
  title: "Templates/BookDetailTemplate",
  component: BookDetailTemplate,
  tags: ["autodocs"],
  args: {
    detail: bookDetail,
  },
  parameters: {
    backgrounds: { value: "paper" },
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof BookDetailTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ReadingInProgress: Story = {
  args: {
    detail: {
      ...bookDetail,
      statusLabel: "Reading",
      finishedLabel: null,
      progressPercent: 25,
      progressLabel: "25%",
      currentPageLabel: "80 / 320",
      heroExcerpt: null,
    },
  },
};

export const EmptyQuotesAndHistory: Story = {
  args: {
    detail: {
      ...bookDetail,
      quotes: [],
      history: [],
      notes: [],
      heroExcerpt: null,
    },
  },
};

export const MetadataUnavailable: Story = {
  args: {
    detail: {
      ...bookDetail,
      metadataNotice: booksCopy.detail.metadata.unavailable,
      heroExcerpt: null,
      coverUrl: null,
    },
  },
};
