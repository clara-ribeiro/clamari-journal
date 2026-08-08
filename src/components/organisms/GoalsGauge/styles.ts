import { styled } from "@/styles/stitches.config";

const grain = "url(/images/shared/noise-grain.webp)";

/** Matches full-circle.svg viewBox — reserves drip space so tops stay aligned. */
const GAUGE_ASPECT = "224.88 / 286.5";

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
  },

  defaultVariants: {
    room: "rim",
  },
});

export const Circle = styled("div", {
  gridArea: "stack",
  zIndex: 1,
  width: "100%",
  aspectRatio: "1",
  borderRadius: "50%",
  boxSizing: "border-box",
  border: "0.14rem solid $goalInk",
  backgroundImage:
    "linear-gradient(to top, $goalInk 0%, $goalInk var(--goal-fill, 0%), transparent var(--goal-fill, 0%))",
});

export const Overflow = styled("img", {
  gridArea: "stack",
  zIndex: 1,
  width: "100%",
  height: "auto",
  display: "block",

  "@md": {
    maxHeight: "100%",
    objectFit: "contain",
    objectPosition: "top center",
  },
});

export const Figure = styled("img", {
  gridArea: "stack",
  zIndex: 2,
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
      /** person-4 — a bit more empty space above the figure. */
      aboveTall: {
        marginTop: "-38%",
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
