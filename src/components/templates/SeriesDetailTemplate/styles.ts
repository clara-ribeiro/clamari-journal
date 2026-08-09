import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Page = styled("div", {
  minHeight: "100dvh",
  backgroundColor: "$catalogBgFilms",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",
  color: "$catalogTextOnDark",

  "& *, & *::before, & *::after": {
    borderRadius: "0 !important",
  },
});

/** Tiny top marker — leaves the viewport on the first scroll so the header can reveal. */
export const HeroSentinel = styled("div", {
  width: "1px",
  height: "1px",
  margin: 0,
  padding: 0,
  overflow: "hidden",
  clipPath: "inset(50%)",
});

/** First-fold hero — media fills the viewport; body overlaps it from below. */
export const Hero = styled("header", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  width: "100%",
  minWidth: 0,
  height: "100dvh",
  maxHeight: "100dvh",
  overflow: "hidden",
});

/** Full-bleed backdrop layer behind the poster/title. */
export const HeroMedia = styled("div", {
  display: "grid",
  width: "100%",
  height: "100dvh",
  marginBottom: "-100dvh",
  flexShrink: 0,

  "& > *": {
    gridArea: "1 / 1",
    minWidth: 0,
    minHeight: 0,
  },
});

export const Backdrop = styled("div", {
  width: "100%",
  height: "100%",
  backgroundColor: "$catalogBgFilms",

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.5,
  },
});

export const BackdropScrim = styled("div", {
  width: "100%",
  height: "100%",
  backgroundImage:
    "linear-gradient(180deg, rgba(42, 34, 28, 0.55) 0%, rgba(42, 34, 28, 0.4) 42%, rgba(42, 34, 28, 0.92) 78%, #2A221C 100%)",
});

/** Grain over the hero media so it matches the page field below. */
export const HeroGrain = styled("div", {
  width: "100%",
  height: "100%",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",
  pointerEvents: "none",
});

export const HeroBody = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  width: "100%",
  minHeight: "100dvh",
  minWidth: 0,
  flexShrink: 0,
  zIndex: 1,
  // Grain + fade to page color — keeps texture continuous into the shell.
  backgroundImage:
    "url(/images/shared/noise-grain.webp), linear-gradient(180deg, rgba(42, 34, 28, 0) 0%, rgba(42, 34, 28, 0) 48%, rgba(42, 34, 28, 0.88) 72%, #2A221C 100%)",
  backgroundSize: "128px 128px, auto",
  backgroundRepeat: "repeat, no-repeat",
});

/** Same horizontal track as Shell — keeps poster aligned with panels below. */
export const HeroContent = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$md",
  alignItems: "flex-start",
  justifyContent: "flex-end",
  width: "100%",
  maxWidth: "$containerWide",
  mx: "auto",
  minWidth: 0,
  px: "$md",
  pt: "$xl",
  pb: "$xl",

  "@sm": {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-start",
    gap: "$lg",
  },

  "@md": {
    px: "$xl",
    pb: "$2xl",
    gap: "$xl",
  },

  "@lg": {
    paddingLeft: "clamp(3rem, 8vw, 5rem)",
    paddingRight: "clamp(3rem, 8vw, 5rem)",
  },
});

export const PosterFrame = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "min(36vw, 10rem)",
  flexShrink: 0,
  aspectRatio: "2 / 3",
  maxHeight: "min(42vh, 15rem)",
  overflow: "hidden",
  padding: "6px",
  backgroundColor: "#F1DFC2",
  border: "2px solid #F1DFC2",
  boxShadow: "0 16px 48px rgba(0, 0, 0, 0.9)",

  "@sm": {
    width: "10rem",
  },

  "@md": {
    width: "11.5rem",
    maxHeight: "min(48vh, 17rem)",
  },
});

export const PosterSurface = styled("div", {
  display: "block",
  width: "100%",
  height: "100%",
  minWidth: 0,
  minHeight: 0,
  overflow: "hidden",
  backgroundColor: "#1A1612",
  flex: 1,

  "& img": {
    display: "block",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 1,
  },
});

export const PosterPlaceholder = styled("div", {
  width: "100%",
  height: "100%",
  backgroundColor: "#CDBFA8",
  backgroundImage: "url(/images/shared/cover-placeholder.svg)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

export const HeroText = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
  minWidth: 0,
  maxWidth: "28rem",
  paddingBottom: "$xs",
  textAlign: "left",
});

export const TitleRow = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$xs",
  minWidth: 0,
});

export const Title = styled("h1", {
  fontFamily: "$section",
  fontSize: "clamp(1.75rem, 5vw, 2.75rem)",
  lineHeight: 1.1,
  color: "$catalogTextOnDark",
  margin: 0,
});

export const YearRuntime = styled("p", {
  margin: 0,
  fontSize: "$body1",
  color: "$catalogMutedOnDark",
});

export const OriginalTitle = styled("p", {
  margin: 0,
  fontSize: "$body2",
  color: "$catalogMutedOnDark",
  display: "flex",
  flexWrap: "wrap",
  gap: "$xs",
  justifyContent: "flex-start",

  "& span": {
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    opacity: 0.8,
  },
});

export const GenreRow = styled("ul", {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexWrap: "wrap",
  gap: "$xs",
  justifyContent: "flex-start",
});

export const Genre = styled("li", {
  fontSize: "$caption",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  padding: "$xs $sm",
  border: "1px solid $catalogBorderOnDark",
  color: "$catalogTextOnDark",
});

export const HeroMeta = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "$md",
  marginTop: "$xs",
});

export const FavoriteMark = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  gap: "$xs",
  fontSize: "$body2",
  color: "$catalogTextOnDark",

  "& svg": {
    width: "$iconSm",
    height: "$iconSm",
    color: "$danger",
  },
});

export const Shell = styled("article", {
  width: "100%",
  maxWidth: "$containerWide",
  mx: "auto",
  px: "$md",
  py: "$xl",
  display: "flex",
  flexDirection: "column",
  gap: "$2xl",
  scrollMarginBlockStart: "$headerHeight",

  "@md": {
    px: "$xl",
  },

  "@lg": {
    paddingLeft: "clamp(3rem, 8vw, 5rem)",
    paddingRight: "clamp(3rem, 8vw, 5rem)",
    py: "$2xl",
  },
});

export const SplitRow = styled("div", {
  display: "grid",
  gap: "$2xl",
  minWidth: 0,
  gridTemplateColumns: "minmax(0, 1fr)",

  "@md": {
    gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
    gap: "$xl",
    alignItems: "stretch",
  },

  "@lg": {
    gap: "$2xl",
  },
});

/** Shared info panel — same treatment as the former journal block. */
export const Panel = styled("section", {
  display: "flex",
  flexDirection: "column",
  gap: "$md",
  minWidth: 0,
  width: "100%",
  height: "100%",
  padding: "$md",
  border: "1px solid $catalogBorderOnDark",
  backgroundColor: "rgba(241, 223, 194, 0.04)",

  "@md": {
    padding: "$lg",
  },
});

export const SectionHeading = styled("h2", {
  fontFamily: "$section",
  fontSize: "$h3",
  color: "$catalogTextOnDark",
  margin: 0,
});

export const Synopsis = styled("p", {
  margin: 0,
  fontSize: "$body1",
  lineHeight: 1.7,
  color: "$catalogTextOnDark",
});

export const FactList = styled("dl", {
  margin: 0,
  display: "grid",
  gap: "$sm",
});

export const Fact = styled("div", {
  display: "grid",
  gridTemplateColumns: "minmax(6.5rem, 8rem) minmax(0, 1fr)",
  gap: "$sm $md",
  alignItems: "baseline",
  paddingTop: "$sm",
  borderTop: "1px solid $catalogBorderOnDark",
});

export const FactLabel = styled("dt", {
  margin: 0,
  fontSize: "$caption",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "$catalogMutedOnDark",
});

export const FactValue = styled("dd", {
  margin: 0,
  fontSize: "$body1",
  color: "$catalogTextOnDark",
  minWidth: 0,
});

export const TrailerLink = styled("a", {
  color: "$catalogTextOnDark",
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",

  "&:hover": {
    color: "$hiContrast",
  },
});

export const CastGrid = styled("ul", {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gap: "$md",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",

  "@md": {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },

  "@lg": {
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  },
});

export const CastItem = styled("li", {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
  minWidth: 0,
});

export const CastPhoto = styled("div", {
  display: "grid",
  width: "100%",
  aspectRatio: "1",
  overflow: "hidden",
  backgroundColor: "rgba(241, 223, 194, 0.08)",
  border: "1px solid $catalogBorderOnDark",

  "& > *": {
    gridArea: "1 / 1",
    minWidth: 0,
    minHeight: 0,
  },

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

export const CastPhotoPlaceholder = styled("div", {
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(241, 223, 194, 0.12)",
});

export const CastMeta = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$xs",
  minWidth: 0,
});

export const CastName = styled("p", {
  margin: 0,
  fontSize: "$body2",
  color: "$catalogTextOnDark",
});

export const CastRole = styled("p", {
  margin: 0,
  fontSize: "$caption",
  color: "$catalogMutedOnDark",
});

export const CastToggle = styled("button", {
  alignSelf: "flex-start",
  margin: 0,
  marginTop: "auto",
  padding: "$sm $md",
  fontSize: "$body2",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "$catalogBgFilms",
  backgroundImage: "linear-gradient(145deg, #F8F0DE 0%, #F1DFC2 45%, #D2B48C 100%)",
  border: "1px solid #F1DFC2",
  cursor: "pointer",

  "&:hover": {
    backgroundImage: "linear-gradient(145deg, #FFF8EC 0%, #F1DFC2 40%, #C4A574 100%)",
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.125rem",
  },
});

export const SeasonPanel = styled("details", {
  borderTop: "1px solid $catalogBorderOnDark",
  minWidth: 0,

  "&:first-of-type": {
    borderTop: "none",
  },
});

export const SeasonSummary = styled("summary", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: "$md",
  padding: "$sm 0",
  cursor: "pointer",
  listStyle: "none",
  fontSize: "$body2",
  color: "$catalogMutedOnDark",

  "&::-webkit-details-marker": {
    display: "none",
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.125rem",
  },
});

export const SeasonTitle = styled("span", {
  fontSize: "$body1",
  color: "$catalogTextOnDark",
});

export const EpisodeList = styled("ul", {
  listStyle: "none",
  margin: 0,
  padding: "0 $sm $md 0",
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
  maxHeight: "22rem",
  overflow: "auto",
  scrollbarWidth: "thin",
  scrollbarColor: "rgba(241, 223, 194, 0.35) transparent",

  "&::-webkit-scrollbar": {
    width: "0.375rem",
  },

  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(241, 223, 194, 0.35)",
    border: "none",
  },

  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(241, 223, 194, 0.55)",
  },

  "&::-webkit-scrollbar-button": {
    display: "none",
    width: 0,
    height: 0,
  },
});

export const EpisodeItem = styled("li", {
  display: "grid",
  gridTemplateColumns: "minmax(3.5rem, 4.5rem) minmax(0, 1fr)",
  gap: "$sm $md",
  padding: "$sm 0",
  borderTop: "1px solid $catalogBorderOnDark",
  fontSize: "$body2",

  "@sm": {
    gridTemplateColumns: "minmax(3.5rem, 4.5rem) minmax(0, 1fr) minmax(5rem, 7rem)",
    alignItems: "start",
  },

  '&[data-watched="false"]': {
    opacity: 0.72,
  },
});

export const EpisodeCode = styled("span", {
  fontSize: "$caption",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "$catalogMutedOnDark",
});

export const EpisodeMeta = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$xs",
  minWidth: 0,
});

export const EpisodeTitle = styled("p", {
  margin: 0,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "$xs",
  color: "$catalogTextOnDark",
  fontSize: "$body2",
});

export const NextBadge = styled("span", {
  fontSize: "$caption",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  padding: "0 $xs",
  border: "1px solid $catalogTextOnDark",
  color: "$catalogBgFilms",
  backgroundColor: "$catalogTextOnDark",
});

export const EpisodeAir = styled("p", {
  margin: 0,
  fontSize: "$caption",
  color: "$catalogMutedOnDark",
});

export const EpisodeWatched = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "$xs",
  fontSize: "$caption",
  color: "$catalogMutedOnDark",
  gridColumn: "2 / -1",

  "@sm": {
    gridColumn: "auto",
    alignItems: "flex-end",
    textAlign: "right",
  },
});

export const MetaNotice = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$sm",
  margin: 0,
  fontSize: "$body2",
  lineHeight: 1.5,
  color: "$catalogMutedOnDark",
  padding: "$md",
  border: "1px solid $catalogBorderOnDark",
  backgroundColor: "rgba(241, 223, 194, 0.04)",
});

export const BackLink = styled(Link, {
  alignSelf: "center",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "$buttonHeight",
  px: "$xl",
  py: "$sm",
  marginTop: "$md",
  fontSize: "$body2",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  textDecoration: "none",
  color: "$catalogBgFilms",
  backgroundColor: "$catalogTextOnDark",
  border: "1px solid $catalogTextOnDark",

  "&:hover": {
    backgroundColor: "$hiContrast",
    borderColor: "$hiContrast",
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.125rem",
  },
});
