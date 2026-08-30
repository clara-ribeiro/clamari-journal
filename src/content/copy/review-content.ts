export type ReviewSeoCopy = {
  titleWithReview: string;
  descriptionFromReview: string;
};

export type ReviewLocaleCopy = {
  spoilerSummary: string;
  reviewHeading: string;
  switchToLabel: string;
  seo: ReviewSeoCopy;
};

const englishLocaleCopy = {
  spoilerSummary: "Spoilers",
  reviewHeading: "Review",
  switchToLabel: "Versão em Português",
  seo: {
    titleWithReview: "{title} review",
    descriptionFromReview: "A personal review of {title}. {excerpt}",
  },
} as const satisfies ReviewLocaleCopy;

const portugueseLocaleCopy = {
  spoilerSummary: "Alerta de spoilers",
  reviewHeading: "Resenha",
  switchToLabel: "English Version",
  seo: {
    titleWithReview: "Resenha de {title}",
    descriptionFromReview: "Uma resenha pessoal de {title}. {excerpt}",
  },
} as const satisfies ReviewLocaleCopy;

export const reviewLocaleCopy = {
  en: englishLocaleCopy,
  "pt-BR": portugueseLocaleCopy,
} as const;

export const reviewContentCopy = {
  spoilerSummary: englishLocaleCopy.spoilerSummary,
  seo: englishLocaleCopy.seo,
} as const;

export type ReviewContentCopy = typeof reviewContentCopy;
