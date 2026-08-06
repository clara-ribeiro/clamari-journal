import { styled } from "@/styles/stitches.config";

export const Section = styled("section", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(2rem, 6vw, 4rem)",
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
    py: "$2xl",
  },

  "@md": {
    px: "$xl",
  },

  "@lg": {
    paddingLeft: "clamp(3rem, 8vw, 5rem)",
    paddingRight: "clamp(3rem, 8vw, 5rem)",
  },
});

export const Content = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "clamp(6.5rem, 8vw, 7rem)",

  "@media (max-width: 767px)": {
    justifyContent: "flex-start",
  },
});
