import { styled } from "@/styles/stitches.config";

export const Section = styled("section", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: 0,
  px: "$md",
  overflow: "hidden",
  backgroundColor: "$bg",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",

  "@media (max-width: 1023px)": {
    py: "$2xl",
  },

  "@md": {
    px: "$xl",
  },

  "@lg": {
    paddingLeft: "clamp(3rem, 8vw, 5rem)",
    paddingRight: "clamp(3rem, 8vw, 5rem)",
    paddingBottom: "clamp(3rem, 8vw, 5rem)",
  },
});

/** Full-viewport brand stage on desktop only — nav sits below and reveals on scroll. */
export const BrandStage = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  "@lg": {
    minHeight: "100dvh",
  },
});

export const NavStage = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: "clamp(2rem, 6vw, 4rem)",

  "@lg": {
    paddingTop: "clamp(2rem, 4vw, 3rem)",
  },
});
