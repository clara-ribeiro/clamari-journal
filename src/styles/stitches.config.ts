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
      // Placeholder palette — replace when visual identity is defined
      bg: "#0F1419",
      surface: "#1A222C",
      surfaceAlt: "#243040",
      text: "#E8EEF4",
      textMuted: "rgba(232, 238, 244, 0.68)",
      accent: "#C4A574",
      accentSoft: "rgba(196, 165, 116, 0.16)",
      border: "rgba(232, 238, 244, 0.12)",
      focus: "#C4A574",
      success: "#7D9B8A",
      danger: "#C47878",
    },
    fonts: {
      heading: "var(--font-instrument-serif), Georgia, serif",
      body: "var(--font-dm-sans), system-ui, sans-serif",
    },
    fontSizes: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.5rem",
      "2xl": "2rem",
      "3xl": "2.75rem",
    },
    space: {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "1rem",
      lg: "1.5rem",
      xl: "2rem",
      "2xl": "3rem",
      "3xl": "4rem",
    },
    radii: {
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      full: "9999px",
    },
    shadows: {
      sm: "0 1px 2px rgba(0,0,0,0.2)",
      md: "0 4px 16px rgba(0,0,0,0.28)",
    },
  },
  media: {
    sm: "(min-width: 480px)",
    md: "(min-width: 768px)",
    lg: "(min-width: 1024px)",
    xl: "(min-width: 1280px)",
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
  },
});

export const globalStyles = globalCss({
  "*, *::before, *::after": {
    boxSizing: "border-box",
  },
  "html, body": {
    margin: 0,
    padding: 0,
    minHeight: "100%",
  },
  body: {
    backgroundColor: "$bg",
    color: "$text",
    fontFamily: "$body",
    lineHeight: 1.5,
    WebkitFontSmoothing: "antialiased",
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
  },
  p: {
    margin: 0,
  },
  img: {
    maxWidth: "100%",
    display: "block",
  },
});
