import { styled } from "@/styles/stitches.config";

export const Root = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$md",
  minWidth: 0,
  width: "100%",
  maxWidth: "$containerReading",
});

export const Title = styled("h2", {
  fontFamily: "$section",
  fontSize: "$h3",
  color: "inherit",
  margin: 0,
});

export const Empty = styled("p", {
  margin: 0,
  fontSize: "$body1",
  lineHeight: 1.6,
  opacity: 0.72,
});

export const Prose = styled("div", {
  fontFamily: "$body",
  fontSize: "$body1",
  lineHeight: 1.7,
  minWidth: 0,
  color: "inherit",

  "& > * + *": {
    marginTop: "$md",
  },

  "& h3, & h4, & h5, & h6": {
    margin: 0,
    fontFamily: "$section",
    fontWeight: 400,
    lineHeight: 1.3,
    color: "inherit",
  },

  "& h3": { fontSize: "$h3" },
  "& h4": { fontSize: "$h4" },
  "& h5, & h6": { fontSize: "$body1" },

  "& p": {
    margin: 0,
  },

  "& em": {
    fontStyle: "italic",
  },

  "& strong": {
    fontWeight: 600,
  },

  "& blockquote": {
    margin: 0,
    paddingLeft: "$md",
    borderLeft: "0.1875rem solid currentColor",
    fontFamily: "$section",
    fontStyle: "italic",
    opacity: 0.92,
  },

  "& ul, & ol": {
    margin: 0,
    paddingLeft: "$lg",
  },

  "& li + li": {
    marginTop: "$xs",
  },

  "& a": {
    color: "inherit",
    textDecoration: "underline",
    textUnderlineOffset: "0.18em",
  },

  "& hr": {
    margin: "$lg 0",
    border: "none",
    borderTop: "1px solid currentColor",
    opacity: 0.28,
  },

  "& img": {
    maxWidth: "100%",
    height: "auto",
    objectFit: "contain",
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
