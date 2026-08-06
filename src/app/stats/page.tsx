import { getStatsPageData } from "@/application/use-cases/stats";
import StatsTemplate from "@/components/templates/StatsTemplate";

export default function StatsPage() {
  const { metrics, goals } = getStatsPageData();
  return <StatsTemplate metrics={metrics} goals={goals} />;
}
