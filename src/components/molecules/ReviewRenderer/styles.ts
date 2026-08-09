import { styled } from "@/styles/stitches.config";

export const Root = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "$md",
  minWidth: 0,
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
  fontSize: "$body1",
  lineHeight: 1.7,
  minWidth: 0,

  "& > * + *": {
    marginTop: "$md",
  },

  "& p": {
    margin: 0,
  },
});
