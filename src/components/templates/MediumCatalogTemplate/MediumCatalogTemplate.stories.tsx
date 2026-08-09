import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { booksCopy } from "@/content/copy/books";
import { filmsCopy } from "@/content/copy/films";
import { seriesCopy } from "@/content/copy/series";
import {
  catalogAlien,
  catalogHeat,
  catalogItems,
  catalogTitans,
  catalogWire,
} from "@/stories/fixtures";
import MediumCatalogTemplate from "./index";

const meta = {
  title: "Templates/MediumCatalogTemplate",
  component: MediumCatalogTemplate,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/films",
      },
    },
  },
  args: {
    medium: "films",
    copy: filmsCopy.list,
    items: [catalogHeat, catalogAlien],
  },
} satisfies Meta<typeof MediumCatalogTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Films: Story = {
  parameters: {
    backgrounds: { value: "films" },
    nextjs: {
      navigation: {
        pathname: "/films",
        query: {},
      },
    },
  },
};

export const Series: Story = {
  args: {
    medium: "series",
    copy: seriesCopy.list,
    items: [catalogWire],
  },
  parameters: {
    nextjs: {
      navigation: { pathname: "/series" },
    },
    backgrounds: { value: "paper" },
  },
};

export const Books: Story = {
  args: {
    medium: "books",
    copy: booksCopy.list,
    items: [catalogTitans],
  },
  parameters: {
    nextjs: {
      navigation: { pathname: "/books" },
    },
    backgrounds: { value: "paper" },
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
  parameters: {
    backgrounds: { value: "films" },
  },
};

export const FilteredInitial: Story = {
  args: {
    items: catalogItems.filter((item) => item.medium === "movie"),
    initialStatus: "watched",
    initialYear: 2024,
  },
  parameters: {
    backgrounds: { value: "films" },
    nextjs: {
      navigation: {
        pathname: "/films",
        query: {
          status: "watched",
          year: "2024",
        },
      },
    },
  },
};
