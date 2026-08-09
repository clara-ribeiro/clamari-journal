import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { journalEntries } from "@/stories/fixtures";
import EntriesCarousel from "./index";

const meta = {
  title: "Organisms/EntriesCarousel",
  component: EntriesCarousel,
  tags: ["autodocs"],
  args: {
    entries: journalEntries,
    titleId: "recent-entries-heading",
    title: "Recent Entries",
    listAriaLabel: "Recent journal entries",
    showAllLabel: "Show All",
    showAllHref: "/all-entries",
  },
} satisfies Meta<typeof EntriesCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutShowAll: Story = {
  args: {
    showAllLabel: undefined,
    showAllHref: undefined,
  },
};

export const Empty: Story = {
  args: {
    entries: [],
  },
  render: (args) => (
    <div>
      <p style={{ padding: "1rem", opacity: 0.7 }}>
        Empty carousel returns null.
      </p>
      <EntriesCarousel {...args} />
    </div>
  ),
};
