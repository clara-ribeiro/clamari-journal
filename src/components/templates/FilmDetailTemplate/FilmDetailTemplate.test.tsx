// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MovieDetail } from "@/application/dto";
import { filmsCopy } from "@/content/copy/films";
import FilmDetailTemplate from "./index";

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

function movieDetail(overrides: Partial<MovieDetail> = {}): MovieDetail {
  return {
    slug: "heat",
    title: "Heat",
    originalTitle: null,
    yearLabel: "1995",
    runtimeLabel: "2h 50m",
    genres: ["Crime"],
    synopsis: "A group of professional bank robbers.",
    posterUrl: null,
    backdropUrl: null,
    directorsLabel: "Michael Mann",
    writersLabel: null,
    cast: Array.from({ length: 8 }, (_, index) => ({
      id: index + 1,
      name: `Actor ${index + 1}`,
      role: `Role ${index + 1}`,
      profileUrl: null,
    })),
    countriesLabel: null,
    languagesLabel: null,
    trailer: null,
    metadataNotice: null,
    statusLabel: "Watched",
    favorite: false,
    favoriteLabel: "Favorite",
    tags: [],
    watchLocation: null,
    streamingService: null,
    viewingCount: 1,
    viewingCountLabel: "1 viewing",
    viewings: [],
    viewingsEmptyLabel: "No viewings",
    reviewSlug: null,
    reviewHtml: null,
    reviewEmptyLabel: "No review yet",
    metaTitle: "Heat",
    metaDescription: "A group of professional bank robbers.",
    ...overrides,
  };
}

describe("FilmDetailTemplate cast disclosure", () => {
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

  it("expands and collapses the cast list", async () => {
    const user = userEvent.setup();
    render(<FilmDetailTemplate detail={movieDetail()} />);

    expect(screen.getByText("Actor 1")).toBeInTheDocument();
    expect(screen.queryByText("Actor 8")).toBeNull();

    const toggle = screen.getByRole("button", {
      name: filmsCopy.detail.metadata.castShowMore,
    });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Actor 8")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: filmsCopy.detail.metadata.castShowLess,
      }),
    );
    expect(screen.queryByText("Actor 8")).toBeNull();
  });

  it("shows the empty cast fallback", () => {
    render(
      <FilmDetailTemplate
        detail={movieDetail({ cast: [] })}
      />,
    );
    expect(
      screen.getByText(filmsCopy.detail.metadata.noCast),
    ).toBeInTheDocument();
  });

  it("shows the pending review label when a slug is set without html", () => {
    render(
      <FilmDetailTemplate
        detail={movieDetail({
          reviewSlug: "heat",
          reviewHtml: null,
          reviewEmptyLabel: filmsCopy.detail.review.pending,
        })}
      />,
    );
    expect(
      screen.getByRole("heading", { name: filmsCopy.detail.review.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(filmsCopy.detail.review.pending),
    ).toBeInTheDocument();
  });

  it("renders compiled review html when present", () => {
    render(
      <FilmDetailTemplate
        detail={movieDetail({
          reviewSlug: "heat",
          reviewHtml: "<p>A quiet masterpiece.</p>",
          reviewEmptyLabel: filmsCopy.detail.review.pending,
        })}
      />,
    );
    expect(screen.getByText("A quiet masterpiece.")).toBeInTheDocument();
    expect(
      screen.queryByText(filmsCopy.detail.review.pending),
    ).toBeNull();
  });
});
