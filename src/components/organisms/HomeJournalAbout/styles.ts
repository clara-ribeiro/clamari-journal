import { homeCopy } from "@/content/copy";
import { styled } from "@/styles/stitches.config";

const { src: photo, focalX, focalY } = homeCopy.journalAbout.image;

export const Section = styled("section", {
  position: "relative",
  margin: 0,
  px: "$md",
  minHeight: "100dvh",
  overflow: "hidden",
  backgroundColor: "#0a0606",
  backgroundImage: `url(${photo})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  /** Percentage position locks that point of the image to the same point of the section. */
  backgroundPosition: `${focalX} ${focalY}`,

  "@md": {
    px: "$xl",
  },

  "@lg": {
    paddingLeft: "clamp(3rem, 8vw, 5rem)",
    paddingRight: "clamp(3rem, 8vw, 5rem)",
  },
});

/** Centers the panel in the viewport; independent of the photo focal point. */
export const PanelAnchor = styled("div", {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "905px",
  maxWidth: "calc(100% - 2rem)",
});

export const Panel = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "clamp(1.25rem, 3vw, 1.75rem)",
  width: "100%",
  height: "auto",
  px: "clamp(1.25rem, 4vw, 2.75rem)",
  py: "clamp(1.75rem, 4vw, 2.75rem)",
  backgroundColor: "$journalPanel",
  color: "$journalPanelText",
  textAlign: "center",
});

export const Title = styled("h2", {
  margin: 0,
  fontFamily: "$section",
  fontWeight: 400,
  fontSize: "clamp(2rem, 5vw, 3rem)",
  lineHeight: 1.15,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "inherit",
});

export const Body = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "clamp(1rem, 2.5vw, 1.5rem)",
  fontFamily: "$section",
  fontWeight: 400,
  fontSize: "0.875rem",
  lineHeight: 1.55,
  letterSpacing: "0.03em",
  textTransform: "uppercase",
  color: "inherit",

  "@md": {
    fontSize: "1.5rem",
  },

  "@lg": {
    fontSize: "1rem",
  },
});

export const Paragraph = styled("p", {
  margin: 0,
});

export const EmailLink = styled("a", {
  color: "inherit",
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",
  textDecorationThickness: "1px",

  "&:hover": {
    opacity: 0.85,
  },

  "&:focus-visible": {
    outline: "0.1875rem solid $journalPanelText",
    outlineOffset: "0.1875rem",
  },
});

/** Same % as backgroundPosition — stays on the mouth across cover crops. */
export const Epigraph = styled("p", {
  position: "absolute",
  top: focalY,
  left: focalX,
  transform: "translate(-50%, -50%)",
  margin: 0,
  width: "max-content",
  maxWidth: "calc(100% - 2rem)",
  fontFamily: "$section",
  fontWeight: 400,
  fontSize: "clamp(1rem, 2.4vw, 1.375rem)",
  lineHeight: 1.3,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  textAlign: "center",
  color: "#FFFFFF",
});
