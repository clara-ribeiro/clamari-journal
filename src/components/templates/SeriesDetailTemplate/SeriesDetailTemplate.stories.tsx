import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { seriesCopy } from "@/content/copy/series";
import { seriesDetail } from "@/stories/fixtures";
import SeriesDetailTemplate from "./index";

const meta = {
  title: "Templates/SeriesDetailTemplate",
  component: SeriesDetailTemplate,
  tags: ["autodocs"],
  args: {
    detail: seriesDetail,
  },
  parameters: {
    backgrounds: { value: "paper" },
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof SeriesDetailTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Watching: Story = {
  args: {
    detail: {
      ...seriesDetail,
      statusLabel: "Watching",
      finishedLabel: null,
      progressLabel: "50%",
      progressPercent: 50,
      watchedEpisodesLabel: "1 / 2",
      nextEpisodeLabel: "S1 E2 · The Detail",
    },
  },
};

export const EmptySeasons: Story = {
  args: {
    detail: {
      ...seriesDetail,
      seasons: [],
      metadataNotice: seriesCopy.detail.metadata.unresolved,
    },
  },
};

export const MetadataUnavailable: Story = {
  args: {
    detail: {
      ...seriesDetail,
      metadataNotice: seriesCopy.detail.metadata.unavailable,
    },
  },
};
