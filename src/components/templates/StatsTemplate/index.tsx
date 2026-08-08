"use client";

import type { GoalMetric, StatsMetric } from "@/application/dto";
import { statsCopy } from "@/content/copy";
import GoalsGauge from "@/components/organisms/GoalsGauge";
import StatsHero from "@/components/organisms/StatsHero";
import { Card, Grid, Label, Page, Value } from "./styles";

export type StatsTemplateProps = {
  metrics: StatsMetric[];
  goals: GoalMetric[];
};

export default function StatsTemplate({ metrics, goals }: StatsTemplateProps) {
  return (
    <>
      <StatsHero />
      <Page id="main-content" aria-labelledby={statsCopy.titleId}>
        <Grid>
          {metrics.map((metric) => (
            <Card key={metric.id}>
              <Value>{metric.value}</Value>
              <Label>{metric.label}</Label>
            </Card>
          ))}
        </Grid>
      </Page>
      <GoalsGauge goals={goals} />
    </>
  );
}
