import { keyframes, styled } from "@/styles/stitches.config";

const pulse = keyframes({
  "0%, 100%": { opacity: 0.45 },
  "50%": { opacity: 1 },
});

export const Label = styled("p", {
  margin: 0,
  fontSize: "$body2",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "$catalogTextOnDark",
  animation: `${pulse} 1.8s ease-in-out infinite`,

  "@motionReduce": {
    animation: "none",
    opacity: 0.85,
  },
});
