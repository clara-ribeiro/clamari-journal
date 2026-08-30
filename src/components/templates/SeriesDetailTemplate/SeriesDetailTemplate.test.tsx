// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SeriesDetail } from "@/application/dto";
import { seriesCopy } from "@/content/copy/series";
import SeriesDetailTemplate from "./index";

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
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

function seriesDetail(overrides: Partial<SeriesDetail> = {}): SeriesDetail {
  return {
    slug: "the-wire",
    title: "The Wire",
    originalTitle: null,
    yearLabel: "2002",
    genres: ["Drama"],
    synopsis: "A look at Baltimore.",
    posterUrl: null,
    backdropUrl: null,
    creatorsLabel: null,
    writersLabel: null,
    cast: [],
    countriesLabel: null,
    languagesLabel: null,
    productionStatusLabel: null,
    trailer: null,
    metadataNotice: null,
    statusLabel: "Completed",
    favorite: false,
    favoriteLabel: "Favorite",
    startedLabel: null,
    finishedLabel: null,
    watchedEpisodesLabel: "1 / 2",
    watchedTimeLabel: null,
    progressLabel: "50%",
    progressPercent: 50,
    nextEpisodeLabel: null,
    seasons: [
      {
        id: "s1",
        seasonNumber: 1,
        title: "Season 1",
        isSpecials: false,
        progressLabel: "1/2",
        episodeCount: 2,
        watchedCount: 1,
        episodes: [
          {
            id: "e1",
            seasonNumber: 1,
            episodeNumber: 1,
            codeLabel: "S1 E1",
            title: "The Target",
            runtimeLabel: "60m",
            airDateLabel: "Jun 2, 2002",
            watched: true,
            watchedDateLabel: "Jan 1, 2024",
            isNext: false,
          },
          {
            id: "e2",
            seasonNumber: 1,
            episodeNumber: 2,
            codeLabel: "S1 E2",
            title: "The Detail",
            runtimeLabel: "60m",
            airDateLabel: "Jun 9, 2002",
            watched: false,
            watchedDateLabel: null,
            isNext: true,
          },
        ],
      },
    ],
    seasonsEmptyLabel: "No seasons",
    reviewSlug: null,
    reviewHtml: null,
    reviewEmptyLabel: "No review yet",
    reviewLocale: "en",
    reviewHeading: "Review",
    alternateReviewHref: null,
    alternateReviewLabel: null,
    metaTitle: "The Wire",
    metaDescription: "A look at Baltimore.",
    ...overrides,
  };
}

describe("SeriesDetailTemplate seasons accordion", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it("toggles season details open and closed", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SeriesDetailTemplate detail={seriesDetail()} />,
    );

    const panel = container.querySelector("details");
    expect(panel).not.toBeNull();
    expect(panel).not.toHaveAttribute("open");

    await user.click(screen.getByText("Season 1"));
    expect(panel).toHaveAttribute("open");
    expect(screen.getByText("The Target")).toBeInTheDocument();
    expect(screen.getByText(seriesCopy.detail.seasons.nextBadge)).toBeInTheDocument();
  });

  it("shows the empty seasons fallback", () => {
    render(
      <SeriesDetailTemplate
        detail={seriesDetail({
          seasons: [],
          seasonsEmptyLabel: "Nothing logged yet",
        })}
      />,
    );
    expect(screen.getByText("Nothing logged yet")).toBeInTheDocument();
  });
});
