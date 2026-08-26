import { describe, expect, it } from "vitest";
import {
  extractReviewImages,
  isLocalSiteImage,
  reviewStillMetadata,
} from "./review-images";

const reviewHtml = `
<figure><img src="/images/reviews/films/heat/pacino-de-niro.png" alt="Vincent Hanna and Neil McCauley face to face."><figcaption>Pacino and De Niro</figcaption></figure>
<p>Later.</p>
<figure><img src="https://image.tmdb.org/t/p/w500/poster.jpg" alt="Poster"></figure>
`;

describe("extractReviewImages", () => {
  it("reads src, alt, and figcaption from compiled figures", () => {
    expect(extractReviewImages(reviewHtml)).toEqual([
      {
        src: "/images/reviews/films/heat/pacino-de-niro.png",
        alt: "Vincent Hanna and Neil McCauley face to face.",
        caption: "Pacino and De Niro",
      },
      {
        src: "https://image.tmdb.org/t/p/w500/poster.jpg",
        alt: "Poster",
        caption: "",
      },
    ]);
  });

  it("picks up a bare img and skips empty html", () => {
    expect(
      extractReviewImages('<p><img src="/images/reviews/still.webp" alt="Still"></p>'),
    ).toEqual([
      { src: "/images/reviews/still.webp", alt: "Still", caption: "" },
    ]);
    expect(extractReviewImages("   ")).toEqual([]);
    expect(extractReviewImages(null)).toEqual([]);
  });
});

describe("reviewStillMetadata", () => {
  it("keeps origin-local stills for sharing and sitemaps", () => {
    expect(isLocalSiteImage("/images/reviews/still.webp")).toBe(true);
    expect(isLocalSiteImage("https://image.tmdb.org/t/p/w500/x.jpg")).toBe(
      false,
    );
    expect(reviewStillMetadata(reviewHtml)).toEqual([
      {
        url: "/images/reviews/films/heat/pacino-de-niro.png",
        alt: "Vincent Hanna and Neil McCauley face to face.",
      },
    ]);
  });
});
