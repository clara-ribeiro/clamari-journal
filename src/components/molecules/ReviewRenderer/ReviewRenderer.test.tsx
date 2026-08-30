// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ReviewRenderer from "./index";

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

describe("ReviewRenderer", () => {
  it("shows the empty fallback when there is no review body", () => {
    render(
      <ReviewRenderer
        heading="Review"
        headingId="review-heading"
        emptyLabel="No review yet"
      />,
    );
    expect(screen.getByRole("heading", { name: "Review" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Review" })).toBeInTheDocument();
    expect(screen.getByText("No review yet")).toBeInTheDocument();
  });

  it("renders children when a review body is provided", () => {
    render(
      <ReviewRenderer
        heading="Review"
        headingId="review-heading"
        emptyLabel="No review yet"
      >
        <p>A quiet masterpiece.</p>
      </ReviewRenderer>,
    );
    expect(screen.getByText("A quiet masterpiece.")).toBeInTheDocument();
    expect(screen.queryByText("No review yet")).toBeNull();
  });

  it("renders sanitized html ahead of children", () => {
    render(
      <ReviewRenderer
        heading="Review"
        headingId="review-heading"
        emptyLabel="Review on the way."
        html="<p>Compiled from markdown.</p>"
      >
        <p>Ignored children.</p>
      </ReviewRenderer>,
    );
    expect(screen.getByText("Compiled from markdown.")).toBeInTheDocument();
    expect(screen.queryByText("Ignored children.")).toBeNull();
    expect(screen.queryByText("Review on the way.")).toBeNull();
  });

  it("keeps the pending label when html is empty", () => {
    render(
      <ReviewRenderer
        heading="Review"
        headingId="review-heading"
        emptyLabel="Review on the way."
        html="   "
      />,
    );
    expect(screen.getByText("Review on the way.")).toBeInTheDocument();
  });

  it("links to the other locale when an alternate essay exists", () => {
    render(
      <ReviewRenderer
        heading="Resenha"
        headingId="review-heading"
        emptyLabel="Resenha a caminho."
        html="<p>Ensaio em português.</p>"
        alternateHref="/films/heat"
        alternateLabel="English Version"
        alternateLang="en"
      />,
    );
    const link = screen.getByRole("link", { name: "English Version" });
    expect(link).toHaveAttribute("href", "/films/heat");
    expect(link).toHaveAttribute("hrefLang", "en");
    expect(link).toHaveAttribute("lang", "en");
  });
});
