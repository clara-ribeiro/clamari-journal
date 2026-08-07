import { styled } from "@/styles/stitches.config";

/**
 * Desktop: one unbroken row.
 * Mobile: search full-width on row 1, filters/sort/view share row 2.
 */
export const Root = styled("div", {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "$sm",
  marginBottom: "$xl",

  "@md": {
    flexWrap: "nowrap",
  },

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
  flex: "1 1 100%",
  minWidth: 0,
  minHeight: "$inputHeight",
  px: "$md",
  border: "2px solid",

  "@md": {
    flex: "1 1 12rem",
  },

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
  flex: "1 1 0",
  minHeight: "$buttonHeight",
  minWidth: 0,
  px: "$sm",
  border: "2px solid",
  cursor: "pointer",
  fontSize: "$body2",
  whiteSpace: "nowrap",

  "@md": {
    px: "$md",
  },

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
  overflow: "hidden",
});

/** Category label — desktop only; mobile keeps icon + value to fit one row. */
export const ControlLabel = styled("span", {
  display: "none",
  flexShrink: 0,

  "@lg": {
    display: "inline",
  },
});

export const ControlValue = styled("span", {
  opacity: 0.85,
  overflow: "hidden",
  textOverflow: "ellipsis",
  minWidth: 0,
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

/** Review / favorites chip — idle outline; active fills so only the chip “reads”. */
export const FilterToggle = styled("button", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$sm",
  flexShrink: 0,
  minHeight: "$buttonHeight",
  px: "$sm",
  border: "2px solid",
  cursor: "pointer",
  fontSize: "$body2",
  whiteSpace: "nowrap",
  background: "transparent",
  color: "inherit",

  "@md": {
    px: "$md",
  },

  "& svg": {
    width: "$iconSm",
    height: "$iconSm",
    flexShrink: 0,
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
    active: {
      true: {},
      false: {},
    },
  },

  compoundVariants: [
    {
      tone: "light",
      active: true,
      css: {
        backgroundColor: "$catalogText",
        borderColor: "$catalogText",
        color: "$catalogBgPaper",
      },
    },
    {
      tone: "dark",
      active: true,
      css: {
        backgroundColor: "$catalogTextOnDark",
        borderColor: "$catalogTextOnDark",
        color: "$catalogBgFilms",
      },
    },
  ],

  defaultVariants: {
    active: false,
  },
});

export const FilterToggleLabel = styled("span", {
  display: "none",

  "@lg": {
    display: "inline",
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
