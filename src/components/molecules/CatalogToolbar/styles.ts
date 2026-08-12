import { styled } from "@/styles/stitches.config";

/**
 * Mobile / tablet (incl. iPad Pro 1024): search + icons on row 1; dropdowns on row 2.
 * Wide desktop (xl+): one unbroken row.
 */
export const Root = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  gap: "$sm",
  width: "100%",
  marginBottom: "$xl",

  "@xl": {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
  },

  variants: {
    tone: {
      light: {},
      dark: {},
    },
  },
});

export const SearchRow = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$sm",
  width: "100%",
  minWidth: 0,

  "@xl": {
    flex: "1 1 auto",
    width: "auto",
    minWidth: 0,
  },
});

export const IconActions = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$sm",
  flexShrink: 0,
});

export const DropdownRow = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "$sm",
  width: "100%",
  minWidth: 0,

  "@xl": {
    width: "auto",
    flex: "0 0 auto",
  },
});

export const SearchField = styled("label", {
  display: "flex",
  alignItems: "center",
  gap: "$sm",
  flex: "1 1 auto",
  minWidth: 0,
  height: "$inputHeight",
  px: "$md",
  border: "2px solid",
  boxSizing: "border-box",

  "@xl": {
    minWidth: "12rem",
  },

  "&:focus-within": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.1875rem",
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
  alignSelf: "stretch",
  minWidth: 0,
  minHeight: "100%",
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
  height: "$inputHeight",
  minWidth: 0,
  px: "$sm",
  border: "2px solid",
  cursor: "pointer",
  fontSize: "$body2",
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  "@xl": {
    flex: "0 0 auto",
    px: "$md",
  },

  "& > *": {
    gridArea: "1 / 1",
    minWidth: 0,
  },

  "&:focus-within": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.1875rem",
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

/** Category label — wide desktop only; narrower viewports keep icon + value. */
export const ControlLabel = styled("span", {
  display: "none",
  flexShrink: 0,

  "@xl": {
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
  width: "$inputHeight",
  height: "$inputHeight",
  padding: 0,
  border: "2px solid",
  cursor: "pointer",
  background: "transparent",
  color: "inherit",
  flexShrink: 0,
  boxSizing: "border-box",

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

/** Shown only when search / filters / sort differ from defaults. */
export const ClearAllButton = styled("button", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$sm",
  flexShrink: 0,
  width: "$inputHeight",
  height: "$inputHeight",
  padding: 0,
  border: "2px solid",
  cursor: "pointer",
  fontSize: "$body2",
  whiteSpace: "nowrap",
  background: "transparent",
  color: "inherit",
  boxSizing: "border-box",

  "@xl": {
    width: "auto",
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
  },
});

export const ClearAllLabel = styled("span", {
  display: "none",

  "@xl": {
    display: "inline",
  },
});

/** Review / favorites chip — square until xl; labeled on wide desktop when idle. */
export const FilterToggle = styled("button", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "$sm",
  flexShrink: 0,
  width: "$inputHeight",
  height: "$inputHeight",
  padding: 0,
  border: "2px solid",
  cursor: "pointer",
  fontSize: "$body2",
  whiteSpace: "nowrap",
  background: "transparent",
  color: "inherit",
  boxSizing: "border-box",

  "@xl": {
    width: "auto",
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

  "@xl": {
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
