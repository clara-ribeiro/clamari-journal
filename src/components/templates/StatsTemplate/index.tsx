"use client";

import type { GoalMetric, StatsMetric } from "@/application/dto";
import { useLocaleCopy } from "@/content/copy/use-copy";
import GoalsGauge from "@/components/organisms/GoalsGauge";
import StatsCollage from "@/components/organisms/StatsCollage";
import StatsHero from "@/components/organisms/StatsHero";

export type StatsTemplateProps = {
  metrics: StatsMetric[];
  goals: GoalMetric[];
};

export default function StatsTemplate({ metrics, goals }: StatsTemplateProps) {
  const { copy } = useLocaleCopy();
  const collage = copy.stats.collage;

  return (
    <>
      <StatsHero />
      <GoalsGauge goals={goals} />
      <StatsCollage
        stats={metrics}
        images={collage.images}
        titleId={collage.titleId}
        ariaLabel={collage.ariaLabel}
        tone="split"
      />
    </>
  );
}
