import { styled } from "@/styles/stitches.config";

const grain = "url(/images/shared/noise-grain.webp)";

export const Section = styled("section", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
  margin: 0,
  paddingTop: 0,
  width: "100%",
  overflow: "hidden",
  backgroundImage: grain,
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",
  px: "$md",

  "@md": {
    px: "$xl",
  },

  "@lg": {
    minHeight: "100dvh",
    paddingLeft: "clamp(3rem, 8vw, 5rem)",
    paddingRight: "clamp(3rem, 8vw, 5rem)",
  },

  variants: {
    medium: {
      films: {
        backgroundColor: "$catalogBgFilms",
      },
      books: {
        backgroundColor: "$catalogBgPaper",
      },
      series: {
        backgroundColor: "$catalogBgPaper",
      },
    },
  },
});

export const Band = styled("div", {
  width: "100%",
  maxWidth: "$containerWide",
  aspectRatio: "2.4 / 1",
  display: "flex",
  alignItems: "stretch",
  justifyContent: "center",

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
