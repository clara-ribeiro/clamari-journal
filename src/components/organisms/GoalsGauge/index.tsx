import type { CSSProperties } from "react";
import type { GoalMetric } from "@/application/dto";
import { statsCopy } from "@/content/copy";
import {
  Circle,
  Figure,
  Gauge,
  Label,
  Overflow,
  Row,
  Section,
  Stage,
  Title,
  Value,
} from "./styles";

export type GoalsGaugeProps = {
  goals: GoalMetric[];
  className?: string;
};

const people = statsCopy.goals.people;

/** person-2 hangs from the rim; everyone else stands above it. */
const hangingKeys = new Set(["series"]);
/** person-3 (books) sits further left on the rim. */
const leftShiftKeys = new Set(["books"]);
/** person-4 (pages) sits slightly lower for more space above. */
const tallRimKeys = new Set(["pages"]);

function personSrc(key: string) {
  if (key in people) {
    return people[key as keyof typeof people];
  }
  return people.movies;
}

function figurePlacement(key: string) {
  if (hangingKeys.has(key)) return "hanging" as const;
  if (leftShiftKeys.has(key)) return "aboveLeft" as const;
  if (tallRimKeys.has(key)) return "aboveTall" as const;
  return "above" as const;
}

function stageRoom(key: string) {
  if (hangingKeys.has(key)) return "inside" as const;
  if (tallRimKeys.has(key)) return "rimTall" as const;
  return "rim" as const;
}

export default function GoalsGauge({ goals, className }: GoalsGaugeProps) {
  return (
    <Section className={className} aria-labelledby={statsCopy.goalsHeadingId}>
      <Title id={statsCopy.goalsHeadingId}>{statsCopy.goalsHeading}</Title>
      <Row>
        {goals.map((goal) => {
          const placement = figurePlacement(goal.key);
          return (
          <Gauge key={goal.key}>
            <Stage room={stageRoom(goal.key)}>
              {goal.exceeded ? (
                <Overflow
                  src={statsCopy.goals.fullCircleSrc}
                  alt=""
                  width={300}
                  height={382}
                  decoding="async"
                />
              ) : (
                <Circle
                  style={
                    {
                      "--goal-fill": `${Math.min(100, goal.percent)}%`,
                    } as CSSProperties
                  }
                  aria-hidden
                />
              )}
              <Figure
                src={personSrc(goal.key)}
                alt=""
                width={300}
                height={300}
                decoding="async"
                placement={placement}
              />
            </Stage>
            <Value>{goal.value}</Value>
            <Label>{goal.label}</Label>
          </Gauge>
          );
        })}
      </Row>
    </Section>
  );
}
