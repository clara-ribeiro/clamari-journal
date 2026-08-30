import Link from "next/link";
import { styled } from "@/styles/stitches.config";

export const Root = styled("section", {
  display: "flex",
  flexDirection: "column",
  gap: "$xl",
  minWidth: 0,
  width: "100%",
  paddingTop: "$xl",
  borderTop: "1px solid $catalogBorderOnDark",
});

/** Kept for landmarks / SEO; the review markdown supplies the visible title. */
export const Title = styled("h2", {
  display: "block",
  width: 0,
  height: 0,
  margin: 0,
  padding: 0,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0,
  fontSize: 0,
  lineHeight: 0,
});

export const Alternate = styled(Link, {
  display: "inline-flex",
  alignSelf: "flex-end",
  margin: 0,
  fontFamily: "$body",
  fontSize: "$body1",
  lineHeight: 1.7,
  color: "inherit",
  opacity: 0.8,
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",
});

export const Empty = styled("p", {
  margin: 0,
  fontSize: "$body1",
  lineHeight: 1.7,
  opacity: 0.72,
});

export const Prose = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$xl",
  width: "100%",
  minWidth: 0,
  fontFamily: "$body",
  fontSize: "1.125rem",
  lineHeight: 1.8,
  color: "inherit",
  textAlign: "left",

  "& h3, & h4, & h5, & h6": {
    margin: 0,
    width: "100%",
    fontFamily: "$section",
    fontWeight: 400,
    lineHeight: 1.2,
    textAlign: "center",
    color: "inherit",
  },

  "& h3": {
    fontSize: "clamp(1.5rem, 2.4vw, 2.15rem)",
    paddingBottom: "$sm",

    "@md": {
      whiteSpace: "nowrap",
    },
  },

  "& h4": {
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
  },

  "& h5": {
    fontSize: "clamp(1.35rem, 2.4vw, 1.85rem)",
    paddingTop: "$md",
  },

  "& h6": {
    fontSize: "$h3",
  },

  "& p": {
    margin: 0,
  },

  "& em": {
    fontStyle: "italic",
  },

  "& strong": {
    fontWeight: 700,
  },

  "& blockquote": {
    margin: 0,
    padding: "$lg $xl",
    borderLeft: "0.35rem solid currentColor",
    backgroundColor: "rgba(241, 223, 194, 0.1)",
    fontFamily: "$section",
    fontSize: "clamp(1.2rem, 2vw, 1.5rem)",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: 1.45,
    letterSpacing: "0.01em",

    "& p": {
      margin: 0,
      fontWeight: 700,
    },

    "& p + p": {
      marginTop: "$md",
    },

    "& p:empty": {
      display: "none",
    },
  },

  "& ul, & ol": {
    margin: 0,
    paddingLeft: "$lg",
  },

  "& li + li": {
    marginTop: "$sm",
  },

  "& a": {
    color: "inherit",
    textDecoration: "underline",
    textUnderlineOffset: "0.18em",
  },

  "& hr": {
    margin: 0,
    width: "100%",
    border: "none",
    borderTop: "1px solid currentColor",
    opacity: 0.28,
  },

  "& figure": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "$sm",
    margin: 0,
    width: "min(100%, 32rem)",
    mx: "auto",
  },

  "& img": {
    display: "block",
    width: "100%",
    height: "auto",
    objectFit: "contain",
    backgroundColor: "rgba(241, 223, 194, 0.08)",
    border: "1px solid $catalogBorderOnDark",
  },

  "& figcaption": {
    margin: 0,
    width: "100%",
    fontSize: "$body2",
    lineHeight: 1.45,
    fontStyle: "italic",
    textAlign: "center",
    textWrap: "balance",
    opacity: 0.78,
  },

  "& details": {
    margin: 0,
    padding: "$sm $md",
    border: "1px solid currentColor",
  },

  "& summary": {
    display: "flex",
    alignItems: "center",
    minHeight: "$controlMin",
    cursor: "pointer",
    listStyle: "none",
    fontSize: "$body2",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",

    "&::-webkit-details-marker": {
      display: "none",
    },
  },

  "& details > *:not(summary)": {
    marginTop: "$sm",
  },
});
