import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { catalogItems } from "@/stories/fixtures";
import AllEntriesTemplate from "./index";

const meta = {
  title: "Templates/AllEntriesTemplate",
  component: AllEntriesTemplate,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/all-entries",
      },
    },
    backgrounds: { value: "navy" },
  },
  args: {
    items: catalogItems,
  },
} satisfies Meta<typeof AllEntriesTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const FavoritesPage: Story = {
  args: {
    showFavoriteFilter: false,
    items: catalogItems.filter((item) => item.favorite),
  },
  parameters: {
    nextjs: {
      navigation: { pathname: "/favorites" },
    },
  },
};

export const ReviewsPage: Story = {
  args: {
    showReviewFilter: false,
    items: catalogItems.filter((item) => item.hasReview),
  },
  parameters: {
    nextjs: {
      navigation: { pathname: "/reviews" },
    },
  },
};
