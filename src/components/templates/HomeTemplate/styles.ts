import { styled } from "@/styles/stitches.config";

export const Root = styled("div", {
  width: "100%",
  margin: 0,
  minHeight: "100dvh",
  backgroundColor: "$bg",
  backgroundImage: "url(/images/shared/noise-grain.webp)",
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",
});
