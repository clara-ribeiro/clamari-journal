import StatusPanel from "@/components/molecules/StatusPanel";
import { statesCopy } from "@/content/copy/states";

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
