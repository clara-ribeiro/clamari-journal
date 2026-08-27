import StatusPanel from "@/components/molecules/StatusPanel";
import { statesCopy } from "@/content/copy/states";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: statesCopy.notFound.title,
  description: statesCopy.notFound.description,
  path: "/404",
  index: false,
});

export default function NotFound() {
  const copy = statesCopy.notFound;

  return (
    <StatusPanel
      titleId={copy.titleId}
      title={copy.title}
      message={copy.message}
    />
  );
}
