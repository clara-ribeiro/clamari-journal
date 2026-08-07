import { styled } from "@/styles/stitches.config";

export const Root = styled("section", {
  position: "relative",
  isolation: "isolate",
  display: "grid",
  overflow: "hidden",
  backgroundColor: "$ink",
  color: "$cream",
  minHeight: "min(92svh, 56rem)",

  "@media (min-width: 768px)": {
    minHeight: "min(88svh, 52rem)",
  },
});

export const Background = styled("div", {
  position: "absolute",
  inset: 0,
  zIndex: 0,
  pointerEvents: "none",

  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    zIndex: 1,
    background:
      "linear-gradient(180deg, rgba(8, 6, 5, 0.55) 0%, rgba(8, 6, 5, 0.28) 42%, rgba(8, 6, 5, 0.72) 100%)",
  },

  "& img": {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
});

export const Frame = styled("div", {
  position: "relative",
  zIndex: 1,
  display: "grid",
  gridTemplateRows: "minmax(11rem, 34svh) minmax(0, 1fr)",
  minHeight: "inherit",
  padding:
    "calc(var(--site-chrome-offset) + $space$6) $space$4 $space$8",

  "@media (min-width: 768px)": {
    gridTemplateRows: "minmax(13rem, 36svh) minmax(0, 1fr)",
    padding:
      "calc(var(--site-chrome-offset) + $space$8) $space$7 $space$10",
  },

  "@media (min-width: 1280px)": {
    padding:
      "calc(var(--site-chrome-offset) + $space$10) $space$10 $space$12",
  },
});

export const Epigraph = styled("p", {
  margin: 0,
  alignSelf: "end",
  justifySelf: "start",
  maxWidth: "17rem",
  color: "$cream",
  fontFamily: "$serif",
  fontSize: "$lg",
  fontStyle: "italic",
  fontWeight: "$regular",
  lineHeight: "$snug",
  letterSpacing: "$tight",
  textWrap: "balance",
  textShadow: "0 1px 18px rgba(8, 6, 5, 0.55)",

  "@media (min-width: 768px)": {
    maxWidth: "22rem",
    fontSize: "$xl",
  },

  "@media (min-width: 1280px)": {
    maxWidth: "26rem",
    fontSize: "$2xl",
  },
});

export const Panel = styled("div", {
  display: "grid",
  alignContent: "center",
  gap: "$space$5",
  width: "min(100%, 38rem)",
  justifySelf: "center",
  marginTop: "auto",
  padding: "$space$6 $space$5",
  border: "1px solid rgba(245, 239, 230, 0.16)",
  backgroundColor: "rgba(8, 6, 5, 0.72)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 18px 48px rgba(8, 6, 5, 0.28)",

  "@media (min-width: 768px)": {
    width: "min(100%, 34rem)",
    justifySelf: "end",
    gap: "$space$6",
    padding: "$space$8 $space$7",
  },

  "@media (min-width: 1280px)": {
    width: "min(100%, 36rem)",
    padding: "$space$9 $space$8",
  },
});

export const Title = styled("h2", {
  margin: 0,
  color: "$gold",
  fontFamily: "$serif",
  fontSize: "clamp(2.4rem, 8vw, 4.2rem)",
  fontWeight: "$regular",
  lineHeight: "$none",
  letterSpacing: "$tight",
  textTransform: "uppercase",
  textWrap: "balance",
});

export const Body = styled("div", {
  display: "grid",
  gap: "$space$4",
});

export const Paragraph = styled("p", {
  margin: 0,
  color: "rgba(245, 239, 230, 0.9)",
  fontFamily: "$sans",
  fontSize: "$md",
  fontWeight: "$regular",
  lineHeight: "$relaxed",
  letterSpacing: "$wide",
  textWrap: "pretty",

  "@media (min-width: 768px)": {
    fontSize: "$lg",
  },
});

export const Email = styled("a", {
  justifySelf: "start",
  color: "$cream",
  fontFamily: "$sans",
  fontSize: "$sm",
  fontWeight: "$medium",
  letterSpacing: "$widest",
  lineHeight: "$snug",
  textDecoration: "underline",
  textDecorationThickness: "1px",
  textUnderlineOffset: "0.28em",
  transition: "color $fast $ease",

  "&:hover": {
    color: "$gold",
  },

  "&:focus-visible": {
    outline: "2px solid $gold",
    outlineOffset: "4px",
  },
});
