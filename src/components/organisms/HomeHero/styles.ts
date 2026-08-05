import { styled } from "@/styles/stitches.config";

export const Section = styled("section", {
  position: "relative",
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
  backgroundSize: "200px 200px",
  backgroundRepeat: "repeat",

  "@md": {
    px: "$xl",
  },
});

export const Content = styled("div", {
  position: "relative",
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(7rem, 8vw, 6.5rem)",
  width: "100%",
  maxWidth: "$containerWide",
});
