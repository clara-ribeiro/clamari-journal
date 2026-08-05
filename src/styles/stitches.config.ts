import { createStitches } from "@stitches/react";

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  config,
  theme,
  createTheme,
} = createStitches({
  theme: {
    colors: {
      bg: "#021570",
      surface: "#1A222C",
      surfaceAlt: "#243040",

      primary: "#C4A574",
      primarySoft: "rgba(196, 165, 116, 0.16)",
      brandAccent: "#F5D23A",
      sectionHeading: "#D8BDA5",
      buttonSurface: "#D2B48C",
      buttonText: "#0A1E3A",
      statsSurface: "#C9A05A",
      statsText: "#462304",

      textPrimary: "#E8EEF4",
      hiContrast: "#F4F7FA",
      loContrast: "rgba(232, 238, 244, 0.68)",

      border: "rgba(232, 238, 244, 0.12)",
      focus: "#C4A574",

      success: "#7D9B8A",
      danger: "#C47878",
      warning: "#C4A574",

      overlayScrim: "rgba(15, 20, 25, 0.72)",
      overlayPoster: "rgba(15, 20, 25, 0.55)",

      card: "#E4E4E4",
      cardText: "#1A1A1A",
      starOn: "#C9A227",
      starOff: "#B0B0B0",
      cardBorder: "#F3AF50",
    },
    fonts: {
      display: "var(--font-anton), Impact, Haettenschweiler, sans-serif",
      script: 'var(--font-monsieur), "Segoe Script", cursive',
      section: 'var(--font-instrument-serif), Georgia, "Times New Roman", serif',
      heading: 'Georgia, "Times New Roman", serif',
      body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    fontSizes: {
      caption: "0.75rem",
      body2: "0.875rem",
      body1: "1rem",
      h4: "1.125rem",
      h3: "1.5rem",
      h2: "2rem",
      h1: "2.75rem",
    },
    space: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "4rem",
      "4xl": "5rem",
      "5xl": "6rem",
      "6xl": "8rem",
    },
    sizes: {
      controlMin: "2.75rem",
      inputHeight: "3rem",
      buttonHeight: "2.75rem",
      buttonHeightLg: "3rem",
      iconSm: "1rem",
      iconMd: "1.25rem",
      iconLg: "1.5rem",
      containerReading: "45rem",
      containerContent: "80rem",
      containerWide: "90rem",
      headerHeight: "4rem",
    },
    radii: {
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      full: "9999px",
    },
    shadows: {
      sm: "0 1px 2px rgba(0, 0, 0, 0.2)",
      md: "0 4px 16px rgba(0, 0, 0, 0.28)",
      lg: "0 8px 32px rgba(0, 0, 0, 0.36)",
    },
    zIndices: {
      dropdown: "100",
      sticky: "200",
      overlay: "300",
      modal: "400",
      toast: "500",
      skipLink: "600",
    },
    transitions: {
      fast: "150ms",
      normal: "250ms",
      slow: "400ms",
    },
  },
  media: {
    sm: "(min-width: 480px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
    motionReduce: "(prefers-reduced-motion: reduce)",
  },
  utils: {
    mx: (value: string | number) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: string | number) => ({
      marginTop: value,
      marginBottom: value,
    }),
    px: (value: string | number) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: string | number) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    size: (value: string | number) => ({
      width: value,
      height: value,
    }),
    square: (value: string | number) => ({
      width: value,
      height: value,
    }),
  },
});

/** Prepared for a future light mode — not wired to UI yet. */
export const lightTheme = createTheme("light-theme", {
  colors: {
    bg: "#F5F2ED",
    surface: "#FFFFFF",
    surfaceAlt: "#EDE8E1",

    primary: "#C4A574",
    primarySoft: "rgba(196, 165, 116, 0.16)",
    brandAccent: "#8A4B08",
    sectionHeading: "#D8BDA5",
    buttonSurface: "#D2B48C",
    buttonText: "#0A1E3A",
    statsSurface: "#C9A05A",
    statsText: "#462304",

    textPrimary: "#161616",
    hiContrast: "#0F1419",
    loContrast: "rgba(22, 22, 22, 0.68)",

    border: "rgba(22, 22, 22, 0.14)",
    focus: "#005FCC",

    success: "#18794E",
    danger: "#B42318",
    warning: "#8A4B08",

    overlayScrim: "rgba(245, 242, 237, 0.8)",
    overlayPoster: "rgba(15, 20, 25, 0.45)",

    card: "#E4E4E4",
    cardText: "#1A1A1A",
    starOn: "#C9A227",
    starOff: "#B0B0B0",
  },
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.06)",
    md: "0 4px 16px rgba(0, 0, 0, 0.1)",
    lg: "0 8px 32px rgba(0, 0, 0, 0.14)",
  },
});

export const globalStyles = globalCss({
  "*, *::before, *::after": {
    boxSizing: "border-box",
  },
  html: {
    fontSize: "100%",
    textSizeAdjust: "100%",
    maxWidth: "100vw",
  },
  body: {
    margin: 0,
    minHeight: "100dvh",
    maxWidth: "100vw",
    backgroundColor: "$bg",
    color: "$textPrimary",
    fontFamily: "$body",
    fontSize: "$body1",
    lineHeight: 1.6,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  "img, picture, video, canvas, svg": {
    display: "block",
    maxWidth: "100%",
  },
  "button, input, textarea, select": {
    font: "inherit",
    color: "inherit",
  },
  textarea: {
    resize: "vertical",
  },
  a: {
    color: "inherit",
    textDecoration: "none",
  },
  "h1, h2, h3, h4": {
    fontFamily: "$heading",
    fontWeight: 400,
    lineHeight: 1.2,
    margin: 0,
    color: "$hiContrast",
  },
  "p, h1, h2, h3, h4, h5, h6": {
    overflowWrap: "break-word",
  },
  p: {
    margin: 0,
  },
  "button, a, input, select, textarea": {
    WebkitTapHighlightColor: "transparent",
  },
  ":focus-visible": {
    outline: "0.1875rem solid $focus",
    outlineOffset: "0.1875rem",
  },
  ":target": {
    scrollMarginBlockStart: "$headerHeight",
  },
  "@motionReduce": {
    "*, *::before, *::after": {
      animationDuration: "0.01ms !important",
      animationIterationCount: "1 !important",
      transitionDuration: "0.01ms !important",
      scrollBehavior: "auto !important",
    },
  },
});
