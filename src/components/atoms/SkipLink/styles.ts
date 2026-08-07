import { styled } from "@/styles/stitches.config";

/** Focusable skip link without position absolute/relative/fixed. */
export const SkipLink = styled("a", {
  display: "block",
  zIndex: "$skipLink",
  padding: 0,
  margin: 0,
  border: "0 solid transparent",
  backgroundColor: "$surface",
  color: "$hiContrast",
  borderRadius: "$md",
  textDecoration: "none",
  width: 0,
  height: 0,
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  fontSize: 0,
  lineHeight: 0,

  "&:focus": {
    width: "auto",
    height: "auto",
    padding: "$sm $md",
    margin: "$sm",
    borderWidth: "1px",
    borderColor: "$border",
    overflow: "visible",
    clipPath: "none",
    fontSize: "$body1",
    lineHeight: 1.5,
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.125rem",
  },
});
