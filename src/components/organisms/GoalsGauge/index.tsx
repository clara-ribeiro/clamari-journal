"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { GoalMetric } from "@/application/dto";
import { statsCopy } from "@/content/copy";
import {
  Circle,
  Figure,
  Fill,
  Gauge,
  GaugeLink,
  Label,
  Overflow,
  Row,
  Section,
  Stage,
  Title,
  Value,
} from "./styles";


const FILL_MS = 1400;

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

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function useCountUp(target: number, active: boolean, durationMs: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (prefersReducedMotion() || target <= 0) {
      const frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      setValue(Math.round(target * easeOutCubic(progress)));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, durationMs]);

  return active ? value : 0;
}

function goalLinkLabel(goal: GoalMetric) {
  const label =
    statsCopy.goalLabels[goal.key as keyof typeof statsCopy.goalLabels] ??
    goal.key;
  return statsCopy.goalLinkAriaLabel
    .replace("{label}", label)
    .replace("{year}", String(goal.year));
}

function GoalItem({ goal }: { goal: GoalMetric }) {
  const itemRef = useRef<HTMLLIElement | null>(null);
  const startedRef = useRef(false);
  const [filling, setFilling] = useState(false);
  const [spilling, setSpilling] = useState(false);
  const displayCurrent = useCountUp(goal.current, filling, FILL_MS);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const frame = requestAnimationFrame(() => {
        setFilling(true);
        setSpilling(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    const node = itemRef.current;
    if (!node) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      setFilling(true);
      window.setTimeout(() => setSpilling(true), FILL_MS);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      // Mobile stacks one-per-row: require the circle itself to be on screen.
      // Desktop shows all four at once, so they still start together.
      { threshold: 0.45, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const placement = figurePlacement(goal.key);
  const fillPercent = filling ? Math.min(100, goal.percent) : 0;
  const showSpill = goal.exceeded && spilling;

  return (
    <Gauge ref={itemRef}>
      <GaugeLink
        as={Link}
        href={goal.href}
        prefetch={false}
        scroll={false}
        aria-label={goalLinkLabel(goal)}
      >
        <Stage
          aria-hidden
          room={stageRoom(goal.key)}
          reserve={goal.exceeded}
        >
          <Circle>
            <Fill style={{ height: `${fillPercent}%` }} />
          </Circle>
          {goal.exceeded ? (
            <Overflow
              src={statsCopy.goals.fullCircleSrc}
              alt=""
              width={400}
              height={509}
              decoding="async"
              loading="lazy"
              style={{ opacity: showSpill ? 1 : 0 }}
            />
          ) : null}
          <Figure
            src={personSrc(goal.key)}
            alt=""
            width={360}
            height={360}
            decoding="async"
            loading="lazy"
            placement={placement}
          />
        </Stage>
        <Value aria-hidden>
          {displayCurrent}/{goal.target}
        </Value>
        <Label aria-hidden>{goal.label}</Label>
      </GaugeLink>
    </Gauge>
  );
}

export default function GoalsGauge({ goals, className }: GoalsGaugeProps) {
  return (
    <Section
      id="goals-section"
      className={className}
      aria-labelledby={statsCopy.goalsHeadingId}
    >
      <Title id={statsCopy.goalsHeadingId}>{statsCopy.goalsAriaLabel}</Title>
      <Row>
        {goals.map((goal) => (
          <GoalItem key={goal.key} goal={goal} />
        ))}
      </Row>
    </Section>
  );
}
