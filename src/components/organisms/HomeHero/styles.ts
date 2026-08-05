import { styled } from "@/styles/stitches.config";

export const Section = styled("section", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(2rem, 6vw, 4rem)",
  width: "100%",
  minHeight: "100dvh",
  margin: 0,
  px: "$md",
  py: "$3xl",
  overflow: "hidden",
  backgroundColor: "$bg",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",

  "@media (max-width: 767px)": {
    justifyContent: "flex-start",
  },

  "@md": {
    px: "$xl",
  },
});

export const Content = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(6.5rem, 8vw, 7rem)",
  width: "100%",
  maxWidth: "$containerWide",

  "@media (max-width: 767px)": {
    justifyContent: "flex-start",
  },
});
