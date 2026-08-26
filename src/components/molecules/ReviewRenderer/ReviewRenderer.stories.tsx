import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SpoilerDisclosure from "@/components/atoms/SpoilerDisclosure";
import { compileReviewMarkdown } from "@/infrastructure/persistence/compile-review-markdown";
import ReviewRenderer from "./index";

const sampleHtml = compileReviewMarkdown(`
# A quiet masterpiece

A cold, precise heist thriller that still feels human. The downtown shootout remains one of the great set pieces in American cinema.

## Set piece

The downtown shootout remains one of the great set pieces in American cinema.

> The sun is a star. The stars are suns.

- Heat
- Precision

---

:::spoiler[The ending]
They almost make it.
:::
`);

const meta = {
  title: "Molecules/ReviewRenderer",
  component: ReviewRenderer,
  tags: ["autodocs"],
  args: {
    heading: "Review",
    headingId: "review-heading",
    emptyLabel: "No review yet.",
  },
  parameters: {
    layout: "centered",
    backgrounds: { value: "paper" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(100%, 52rem)", color: "#1A1410" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReviewRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithProse: Story = {
  args: {
    children: (
      <p>
        A cold, precise heist thriller that still feels human. The downtown
        shootout remains one of the great set pieces in American cinema.
      </p>
    ),
  },
};

export const WithMarkdown: Story = {
  args: {
    html: sampleHtml,
  },
};

export const WithSpoilerComponent: Story = {
  args: {
    children: (
      <>
        <p>A cold, precise heist thriller that still feels human.</p>
        <SpoilerDisclosure label="The ending">
          <p>They almost make it.</p>
        </SpoilerDisclosure>
      </>
    ),
  },
};
