"use client";

import type { GoalMetric, StatsMetric } from "@/application/dto";
import { statsCopy } from "@/content/copy";
import {
  Back,
  Card,
  Grid,
  Label,
  Page,
  SectionTitle,
  Title,
  Value,
} from "./styles";

export type StatsTemplateProps = {
  metrics: StatsMetric[];
  goals: GoalMetric[];
};

export default function StatsTemplate({ metrics, goals }: StatsTemplateProps) {
  return (
    <Page id="main-content">
      <Back href={statsCopy.backHref} prefetch={false}>
        {statsCopy.backLabel}
      </Back>
      <Title id={statsCopy.titleId}>{statsCopy.title}</Title>

      <Grid>
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <Value>{metric.value}</Value>
            <Label>{metric.label}</Label>
          </Card>
        ))}
      </Grid>

      <SectionTitle>{statsCopy.goalsHeading}</SectionTitle>
      <Grid>
        {goals.map((goal) => (
          <Card key={goal.key}>
            <Value>{goal.value}</Value>
            <Label>{goal.label}</Label>
          </Card>
        ))}
      </Grid>
    </Page>
  );
}
