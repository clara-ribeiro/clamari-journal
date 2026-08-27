// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { BookDetail } from "@/application/dto";
import { booksCopy } from "@/content/copy/books";
import BookDetailTemplate from "./index";

vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={props.src} alt={props.alt} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

function bookDetail(overrides: Partial<BookDetail> = {}): BookDetail {
  return {
    slug: "the-titans-curse",
    title: "The Titan's Curse",
    subtitle: "Book 3",
    authorsLabel: "Rick Riordan",
    yearLabel: "2007",
    categories: ["Fantasy"],
    synopsis: "Artemis goes missing.",
    // Avoid HeroTextFill's ResizeObserver/layout loop under jsdom.
    heroExcerpt: null,
    coverUrl: "https://example.com/cover.jpg",
    publisherLabel: "Disney Hyperion",
    pageCountLabel: "320",
    languageLabel: "en",
    isbn10Label: null,
    isbn13Label: null,
    metadataNotice: null,
    statusLabel: "Finished",
    favorite: true,
    favoriteLabel: "Favorite",
    formatLabel: "Physical",
    tags: ["percy-jackson"],
    startedLabel: "January 1, 2020",
    finishedLabel: "February 1, 2020",
    currentPageLabel: null,
    progressLabel: "100%",
    progressPercent: 100,
    quotes: [
      {
        id: "quote-0",
        text: "The sea does not like to be restrained.",
        pageLabel: "p. 42",
        note: null,
      },
    ],
    quotesEmptyLabel: booksCopy.detail.quotes.empty,
    history: [
      {
        id: "history-0",
        dateLabel: "January 1, 2020",
        pageLabel: "p. 1",
        note: null,
      },
    ],
    historyEmptyLabel: booksCopy.detail.history.empty,
    notes: [
      {
        id: "note-0",
        dateLabel: "January 15, 2020",
        text: "Halfway and hooked.",
      },
    ],
    notesEmptyLabel: booksCopy.detail.notes.empty,
    reviewSlug: null,
    reviewHtml: null,
    reviewEmptyLabel: booksCopy.detail.review.empty,
    reviewLocale: "en",
    reviewHeading: "Review",
    alternateReviewHref: null,
    alternateReviewLabel: null,
    metaTitle: "The Titan's Curse",
    metaDescription: "Artemis goes missing.",
    ...overrides,
  };
}

describe("BookDetailTemplate", () => {
  it("renders title, journal facts, quotes, and notes", () => {
    render(<BookDetailTemplate detail={bookDetail()} />);

    expect(
      screen.getByRole("heading", { name: "The Titan's Curse" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Rick Riordan").length).toBeGreaterThan(0);
    expect(
      screen.getByText("The sea does not like to be restrained.", {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Halfway and hooked.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: booksCopy.detail.backLabel }),
    ).toHaveAttribute("href", booksCopy.detail.backHref);
  });

  it("shows a metadata notice when enrichment failed", () => {
    render(
      <BookDetailTemplate
        detail={bookDetail({
          metadataNotice: booksCopy.detail.metadata.unavailable,
        })}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      booksCopy.detail.metadata.unavailable,
    );
  });

  it("hides notes panel when empty and shows quote/history empties", () => {
    render(
      <BookDetailTemplate
        detail={bookDetail({
          quotes: [],
          notes: [],
          history: [],
        })}
      />,
    );

    expect(screen.getByText(booksCopy.detail.quotes.empty)).toBeInTheDocument();
    expect(
      screen.getByText(booksCopy.detail.history.empty),
    ).toBeInTheDocument();
    expect(screen.queryByText("Halfway and hooked.")).not.toBeInTheDocument();
  });
});
