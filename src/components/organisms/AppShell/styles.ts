import { styled } from "@/styles/stitches.config";

/** Flex column shell so short pages (404/error/loading) fit one viewport with the footer. */
export const AppFrame = styled("div", {
  display: "flex",
  flexDirection: "column",
  minHeight: "100dvh",
  width: "100%",

  '&[data-status="true"]': {
    display: "grid",
    height: "100dvh",
    maxHeight: "100dvh",
    overflow: "hidden",
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "minmax(0, 1fr)",

    "& > *": {
      gridArea: "1 / 1",
      minWidth: 0,
      minHeight: 0,
    },

    "& > header": {
      alignSelf: "start",
      zIndex: "$sticky",
    },

    "& > footer": {
      alignSelf: "end",
      zIndex: "$sticky",
    },
  },
});

export const AppMain = styled("div", {
  display: "flex",
  flexDirection: "column",
  flex: "1 1 auto",
  width: "100%",
  minWidth: 0,
  minHeight: 0,

  '[data-status="true"] &': {
    height: "100%",
    maxHeight: "100dvh",
    overflow: "hidden",
  },
});
