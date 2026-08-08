import { styled } from "@/styles/stitches.config";

const grain = "url(/images/shared/noise-grain.webp)";

/** Matches full-circle.svg viewBox — reserves drip space so tops stay aligned. */
const GAUGE_ASPECT = "224.88 / 286.5";
const FILL_MS = 1400;
const SPILL_MS = 900;

export const Section = styled("section", {
  margin: 0,
  width: "100%",
  px: "$md",
  py: "$2xl",
  backgroundColor: "$statsHeroBg",
  backgroundImage: grain,
  backgroundSize: "128px 128px",
  backgroundRepeat: "repeat",
  color: "$hiContrast",

  "@md": {
    px: "$xl",
  },

  "@lg": {
    paddingLeft: "clamp(3rem, 8vw, 5rem)",
    paddingRight: "clamp(3rem, 8vw, 5rem)",
  },
});

export const Title = styled("h2", {
  margin: 0,
  marginBottom: "$xl",
  fontFamily: "$section",
  fontWeight: 400,
  fontSize: "clamp(1.5rem, 3vw, 2rem)",
  color: "$sectionHeading",
  textAlign: "center",

  "@media (max-width: 767px)": {
    marginBottom: "$2xl",
  },
});

export const Row = styled("ul", {
  display: "grid",
  listStyle: "none",
  margin: 0,
  padding: 0,
  gap: 0,
  gridTemplateColumns: "minmax(0, 1fr)",
  justifyItems: "center",
  maxWidth: "$containerContent",
  mx: "auto",

  "@md": {
    gap: "clamp(1rem, 3vw, 2rem)",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  },
});

export const Gauge = styled("li", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "11rem",
  textAlign: "center",
  paddingBottom: "$xl",
  borderBottom: "1px solid $border",

  "&:last-child": {
    borderBottom: "none",
  },

  "@media (max-width: 767px)": {
    maxWidth: "14rem",
    paddingTop: "$lg",
    paddingBottom: "$2xl",
  },

  "@md": {
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: "none",
  },
});

export const GaugeLink = styled("a", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  color: "inherit",
  textDecoration: "none",
  borderRadius: "$sm",
  outlineOffset: "0.35rem",
  transition: "opacity 160ms ease",

  "&:hover": {
    opacity: 0.88,
  },

  "&:focus-visible": {
    outline: "2px solid $goalInk",
  },
});

export const Stage = styled("div", {
  display: "grid",
  gridTemplateAreas: '"stack"',
  justifyItems: "center",
  alignItems: "start",
  width: "100%",
  paddingTop: "22%",

  /** Equal drip reserve + label baseline — tablet/desktop only. */
  "@md": {
    aspectRatio: GAUGE_ASPECT,
    boxSizing: "content-box",
    flexShrink: 0,
    paddingTop: "22%",
  },

  variants: {
    room: {
      rim: {
        "@media (max-width: 767px)": {
          paddingTop: "36%",
        },
      },
      rimTall: {
        "@media (max-width: 767px)": {
          paddingTop: "42%",
        },
      },
      inside: {
        "@media (max-width: 767px)": {
          paddingTop: "12%",
        },
      },
    },
    /** Exceeded goals reserve drip height on mobile too (spill animates in later). */
    reserve: {
      true: {
        aspectRatio: GAUGE_ASPECT,
        boxSizing: "content-box",
        flexShrink: 0,
      },
    },
  },

  defaultVariants: {
    room: "rim",
    reserve: false,
  },
});

export const Circle = styled("div", {
  gridArea: "stack",
  position: "relative",
  zIndex: 1,
  width: "100%",
  aspectRatio: "1",
  borderRadius: "50%",
  boxSizing: "border-box",
  border: "0.14rem solid $goalInk",
  overflow: "hidden",
  backgroundColor: "transparent",
});

export const Fill = styled("div", {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  height: "0%",
  backgroundColor: "$goalInk",
  transition: `height ${FILL_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,

  "@motionReduce": {
    transition: "none",
  },
});

export const Overflow = styled("img", {
  gridArea: "stack",
  zIndex: 2,
  width: "100%",
  height: "auto",
  display: "block",
  opacity: 0,
  transition: `opacity ${SPILL_MS}ms ease`,
  pointerEvents: "none",

  "@md": {
    maxHeight: "100%",
    objectFit: "contain",
    objectPosition: "top center",
  },

  "@motionReduce": {
    transition: "none",
  },
});

export const Figure = styled("img", {
  gridArea: "stack",
  zIndex: 3,
  width: "46%",
  height: "auto",
  pointerEvents: "none",
  userSelect: "none",

  variants: {
    placement: {
      /** Standing / walking figures perch on the rim. */
      above: {
        marginTop: "-43%",
      },
      /** person-4 — slightly higher on the rim than the default tall offset. */
      aboveTall: {
        marginTop: "-43%",
      },
      /** person-3 walks further left along the rim. */
      aboveLeft: {
        marginTop: "-37%",
        transform: "translateX(-42%)",
      },
      /** person-2 hangs from the inner top edge. */
      hanging: {
        marginTop: "-0.5%",
      },
    },
  },

  defaultVariants: {
    placement: "above",
  },
});

export const Value = styled("p", {
  margin: 0,
  marginTop: "$md",
  fontFamily: "$heading",
  fontSize: "$h4",
  color: "$hiContrast",
});

export const Label = styled("p", {
  margin: 0,
  marginTop: "$xs",
  fontSize: "$caption",
  color: "$loContrast",
  lineHeight: 1.35,
});
