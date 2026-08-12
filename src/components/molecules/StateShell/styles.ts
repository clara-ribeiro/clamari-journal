import { keyframes, styled } from "@/styles/stitches.config";

const drift = keyframes({
  from: { transform: "scale(1)" },
  to: { transform: "scale(1.06)" },
});

/** Full-viewport scene behind status / loading UI. */
export const Root = styled("main", {
  display: "grid",
  width: "100%",
  flex: 1,
  minHeight: 0,
  height: "100dvh",
  maxHeight: "100dvh",
  overflow: "hidden",
  color: "$catalogTextOnDark",

  "& > *": {
    gridArea: "1 / 1",
    minWidth: 0,
    minHeight: 0,
  },
});

export const Media = styled("div", {
  display: "grid",
  width: "100%",
  height: "100%",
  minHeight: 0,
  overflow: "hidden",
  backgroundColor: "$catalogBgFilms",

  "& > *": {
    gridArea: "1 / 1",
    minWidth: 0,
    minHeight: 0,
  },
});

export const Backdrop = styled("div", {
  width: "100%",
  height: "100%",
  minHeight: 0,
  overflow: "hidden",
  opacity: 1,
  transition: "opacity 420ms ease",

  '&[data-visible="false"]': {
    opacity: 0,
  },

  "& > *": {
    width: "100%",
    height: "100%",
    minHeight: 0,
  },

  "& img": {
    display: "block",
    width: "100%",
    height: "100%",
    maxHeight: "100%",
    minHeight: 0,
    objectFit: "cover",
    opacity: 0.32,
    animation: `${drift} 18s ease-in-out alternate infinite`,
  },

  "@motionReduce": {
    transition: "none",

    "& img": {
      animation: "none",
    },
  },
});

export const Scrim = styled("div", {
  width: "100%",
  height: "100%",
  backgroundImage:
    "linear-gradient(180deg, rgba(42, 34, 28, 0.45) 0%, rgba(42, 34, 28, 0.78) 18%, rgba(42, 34, 28, 0.86) 50%, rgba(42, 34, 28, 0.72) 82%, rgba(42, 34, 28, 0.5) 100%)",
});

export const Grain = styled("div", {
  width: "100%",
  height: "100%",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",
  pointerEvents: "none",
  opacity: 0.85,
});

export const Body = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "$md",
  width: "100%",
  height: "100%",
  minHeight: 0,
  px: "$md",
  pt: "calc($headerHeight + $lg)",
  pb: "clamp(6rem, 18vh, 10rem)",
  textAlign: "center",
  zIndex: 1,
});
