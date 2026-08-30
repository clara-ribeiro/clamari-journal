import StatusPanel from "@/components/molecules/StatusPanel";
import { copyFor } from "@/content/copy/for-locale";
import { localePageMetadata } from "@/lib/page-metadata";

const copy = copyFor("pt-BR").states;

export const metadata = localePageMetadata({
  title: copy.notFound.title,
  description: copy.notFound.description,
  path: "/404",
  locale: "pt-BR",
  index: false,
  languages: {},
});

export default function NotFound() {
  const panel = copy.notFound;

  return (
    <StatusPanel
      titleId={panel.titleId}
      title={panel.title}
      message={panel.message}
      homeHref="/pt"
      homeLabel={copy.actions.home}
    />
  );
}
