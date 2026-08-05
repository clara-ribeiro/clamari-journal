import { styled } from "@/styles/stitches.config";

export const Root = styled("div", {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  margin: 0,
  pointerEvents: "none",
});

export const Script = styled("p", {
  margin: 0,
  width: "100%",
  fontFamily: 'var(--font-monsieur), "Segoe Script", cursive',
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "clamp(2.75rem, 20vw, 15rem)",
  lineHeight: 0.85,
  color: "$brandAccent",
  textAlign: "center",
  filter:
    "drop-shadow(0 0.08em 0.14em rgba(0, 0, 0, 0.55)) drop-shadow(0 0.03em 0.05em rgba(0, 0, 0, 0.35))",
});
