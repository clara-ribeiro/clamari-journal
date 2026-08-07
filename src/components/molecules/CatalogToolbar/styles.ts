import { styled } from "@/styles/stitches.config";

export const Root = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "$sm",
  marginBottom: "$xl",

  variants: {
    tone: {
      light: {},
      dark: {},
    },
  },
});

export const SearchField = styled("label", {
  display: "flex",
  alignItems: "center",
  gap: "$sm",
  flex: "1 1 16rem",
  minWidth: 0,
  minHeight: "$inputHeight",
  px: "$md",
  border: "2px solid",

  variants: {
    tone: {
      light: {
        borderColor: "$catalogBorder",
        color: "$catalogText",
        backgroundColor: "transparent",
      },
      dark: {
        borderColor: "$catalogBorderOnDark",
        color: "$catalogTextOnDark",
        backgroundColor: "transparent",
      },
    },
  },
});

export const SearchInput = styled("input", {
  flex: 1,
  minWidth: 0,
  border: "none",
  outline: "none",
  background: "transparent",
  color: "inherit",
  fontSize: "$body2",

  "&::placeholder": {
    opacity: 0.55,
    color: "inherit",
  },
});

/**
 * Grid-stacked control: invisible select covers the face so any click opens
 * the native dropdown (no absolute positioning).
 */
export const Control = styled("label", {
  display: "grid",
  alignItems: "center",
  minHeight: "$buttonHeight",
  minWidth: "10rem",
  px: "$md",
  border: "2px solid",
  cursor: "pointer",
  fontSize: "$body2",
  whiteSpace: "nowrap",

  "& > *": {
    gridArea: "1 / 1",
    minWidth: 0,
  },

  variants: {
    tone: {
      light: {
        borderColor: "$catalogBorder",
        color: "$catalogText",
      },
      dark: {
        borderColor: "$catalogBorderOnDark",
        color: "$catalogTextOnDark",
      },
    },
  },
});

export const ControlFace = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  gap: "$sm",
  pointerEvents: "none",
  minWidth: 0,
});

export const ControlValue = styled("span", {
  opacity: 0.85,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const NativeSelect = styled("select", {
  width: "100%",
  height: "100%",
  minHeight: "$buttonHeight",
  margin: 0,
  padding: 0,
  border: "none",
  outline: "none",
  opacity: 0,
  cursor: "pointer",
  font: "inherit",
  color: "inherit",
  background: "transparent",

  "& option": {
    color: "$catalogText",
    backgroundColor: "$catalogBgPaper",
  },
});

export const ViewToggle = styled("button", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "$buttonHeight",
  height: "$buttonHeight",
  padding: 0,
  border: "2px solid",
  cursor: "pointer",
  background: "transparent",
  color: "inherit",
  flexShrink: 0,

  "& svg": {
    width: "$iconMd",
    height: "$iconMd",
  },

  variants: {
    tone: {
      light: {
        borderColor: "$catalogBorder",
        color: "$catalogText",
      },
      dark: {
        borderColor: "$catalogBorderOnDark",
        color: "$catalogTextOnDark",
      },
    },
  },
});

export const IconWrap = styled("span", {
  display: "inline-flex",
  flexShrink: 0,

  "& svg": {
    width: "$iconSm",
    height: "$iconSm",
  },
});
