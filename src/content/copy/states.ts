/**
 * Melancholic stills for loading / 404 / error.
 * Drop new images in `public/images/states/` (prefer webp) and add them here.
 */
export const stateScenes = [
  { src: "/images/states/1.webp", alt: "" },
  { src: "/images/states/2.webp", alt: "" },
  { src: "/images/states/3.webp", alt: "" },
  { src: "/images/states/4.webp", alt: "" },
  { src: "/images/states/5.webp", alt: "" },
  { src: "/images/states/6.webp", alt: "" },
  { src: "/images/states/7.webp", alt: "" },
  { src: "/images/states/8.webp", alt: "" },
  { src: "/images/states/9.webp", alt: "" },
  { src: "/images/states/10.webp", alt: "" },
  { src: "/images/states/11.webp", alt: "" },
  { src: "/images/states/12.webp", alt: "" },
  { src: "/images/states/13.webp", alt: "" },
  { src: "/images/states/14.webp", alt: "" },
  { src: "/images/states/15.webp", alt: "" },
  { src: "/images/states/16.webp", alt: "" },
  { src: "/images/states/17.webp", alt: "" },
  { src: "/images/states/18.webp", alt: "" },
] as const;

export const statesCopy = {
  loading: {
    label: "Loading",
  },
  notFound: {
    titleId: "not-found-heading",
    title: "Page not found",
    message:
      "That page is not in the journal. Check the address or return home.",
  },
  error: {
    titleId: "error-heading",
    title: "Something went wrong",
    message:
      "The journal hit an unexpected error. You can try again or head home.",
  },
  actions: {
    home: "Back Home",
    homeHref: "/",
    retry: "Try again",
  },
} as const;

export type StatesCopy = typeof statesCopy;

export type StateScene = {
  src: string;
  alt: string;
};
