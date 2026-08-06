import { styled } from "@/styles/stitches.config";

/** Focusable skip link without position absolute/relative/fixed. */
export const SkipLink = styled("a", {
  display: "inline-block",
  zIndex: "$skipLink",
  padding: "$sm $md",
  margin: "$sm",
  backgroundColor: "$surface",
  color: "$hiContrast",
  border: "1px solid $border",
  borderRadius: "$md",
  textDecoration: "none",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",

  "&:focus": {
    width: "auto",
    height: "auto",
    overflow: "visible",
    clipPath: "none",
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.125rem",
  },
});
