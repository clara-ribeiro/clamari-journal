import Image from "next/image";
import { homeCopy } from "@/content/copy";
import {
  LandscapeCell,
  PortraitCell,
  Row,
  Section,
  Stack,
  StatCell,
  StatFit,
  StatOverlay,
  VisuallyHidden,
} from "./styles";

export type HomeStatsCollageProps = {
  pagesRead: number;
  watchedHours: number;
  className?: string;
};

const copy = homeCopy.statsCollage;
const STAT_VIEWBOX_WIDTH = 1000;
const STAT_VIEWBOX_HEIGHT = 280;

function formatCount(value: number) {
  return value.toLocaleString("en-US");
}

function StatFitText({ value, label }: { value: number; label: string }) {
  const number = formatCount(value);
  const labelText = label.toUpperCase();
  const ariaLabel = `${number} ${labelText}`;

  return (
    <StatFit
      viewBox={`0 0 ${STAT_VIEWBOX_WIDTH} ${STAT_VIEWBOX_HEIGHT}`}
      role="img"
      aria-label={ariaLabel}
      preserveAspectRatio="xMidYMid meet"
    >
      <text
        x="0"
        y={110}
        textLength={STAT_VIEWBOX_WIDTH}
        lengthAdjust="spacingAndGlyphs"
      >
        {number}
      </text>
      <text
        x="0"
        y={245}
        textLength={STAT_VIEWBOX_WIDTH}
        lengthAdjust="spacingAndGlyphs"
      >
        {labelText}
      </text>
    </StatFit>
  );
}

export default function HomeStatsCollage({
  pagesRead,
  watchedHours,
  className,
}: HomeStatsCollageProps) {
  return (
    <Section className={className} aria-labelledby={copy.titleId}>
      <VisuallyHidden id={copy.titleId}>{copy.ariaLabel}</VisuallyHidden>
      <Stack aria-label={copy.ariaLabel}>
        <Row>
          <PortraitCell>
            <Image
              src={copy.images.portrait.src}
              alt={copy.images.portrait.alt}
              width={900}
              height={600}
              sizes="(max-width: 767px) 100vw, 60vw"
              quality={70}
              loading="lazy"
            />
          </PortraitCell>

          <StatCell href={copy.statsHref} prefetch={false}>
            <Image
              src={copy.images.pages.src}
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, 40vw"
              quality={70}
              loading="lazy"
            />
            <StatOverlay />
            <StatFitText value={pagesRead} label={copy.pagesLabel} />
          </StatCell>
        </Row>

        <Row>
          <StatCell href={copy.statsHref} prefetch={false}>
            <Image
              src={copy.images.hours.src}
              alt=""
              fill
              sizes="(max-width: 767px) 100vw, 40vw"
              quality={70}
              loading="lazy"
            />
            <StatOverlay />
            <StatFitText value={watchedHours} label={copy.hoursLabel} />
          </StatCell>

          <LandscapeCell>
            <Image
              src={copy.images.landscape.src}
              alt={copy.images.landscape.alt}
              width={900}
              height={600}
              sizes="(max-width: 767px) 100vw, 60vw"
              quality={70}
              loading="lazy"
            />
          </LandscapeCell>
        </Row>
      </Stack>
    </Section>
  );
}
