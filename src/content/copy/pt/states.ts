export const statesCopyPt = {
  loading: {
    label: "Carregando",
  },
  notFound: {
    titleId: "not-found-heading",
    title: "Página não encontrada",
    description: "Essa página não está no clamari journal.",
    message:
      "Essa página não está no diário. Confira o endereço ou volte para o início.",
  },
  error: {
    titleId: "error-heading",
    title: "Algo deu errado",
    message:
      "O diário encontrou um erro inesperado. Você pode tentar de novo ou voltar para o início.",
  },
  actions: {
    home: "Voltar ao início",
    homeHref: "/",
    retry: "Tentar de novo",
  },
} as const;
