import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { filmsCopy } from "@/content/copy/films";
import { movieDetail } from "@/stories/fixtures";
import FilmDetailTemplate from "./index";

const meta = {
  title: "Templates/FilmDetailTemplate",
  component: FilmDetailTemplate,
  tags: ["autodocs"],
  args: {
    detail: movieDetail,
  },
  parameters: {
    backgrounds: { value: "films" },
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof FilmDetailTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MetadataUnavailable: Story = {
  args: {
    detail: {
      ...movieDetail,
      metadataNotice: filmsCopy.detail.metadata.unavailable,
      cast: [],
      trailer: null,
    },
  },
};

export const NoViewings: Story = {
  args: {
    detail: {
      ...movieDetail,
      viewingCount: 0,
      viewingCountLabel: filmsCopy.detail.viewings.countNone,
      viewings: [],
      favorite: false,
    },
  },
};
