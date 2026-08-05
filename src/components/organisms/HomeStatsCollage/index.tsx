import Image from "next/image";
import { homeCopy } from "@/content/copy";
import {
  Cell,
  CellLink,
  Grid,
  Media,
  Overlay,
  Section,
  StatLabel,
  StatText,
  StatValue,
  VisuallyHidden,
} from "./styles";

export type HomeStatsCollageProps = {
  pagesRead: number;
  watchedHours: number;
  className?: string;
};

const copy = homeCopy.statsCollage;

function formatCount(value: number) {
  return value.toLocaleString("pt-BR");
}

export default function HomeStatsCollage({
  pagesRead,
  watchedHours,
  className,
}: HomeStatsCollageProps) {
  return (
    <Section className={className} aria-labelledby={copy.titleId}>
      <VisuallyHidden id={copy.titleId}>{copy.ariaLabel}</VisuallyHidden>
      <Grid aria-label={copy.ariaLabel}>
        <Cell area="portrait">
          <Media>
            <Image
              src={copy.images.portrait.src}
              alt={copy.images.portrait.alt}
              fill
              sizes="(max-width: 767px) 100vw, 60vw"
              unoptimized
            />
          </Media>
        </Cell>

        <CellLink area="pages" href={copy.statsHref} prefetch={false}>
          <Media>
            <Image
              src={copy.images.pages.src}
              alt={copy.images.pages.alt}
              fill
              sizes="(max-width: 767px) 100vw, 40vw"
              unoptimized
            />
            <Overlay />
          </Media>
          <StatText>
            <StatValue>{formatCount(pagesRead)}</StatValue>{" "}
            <StatLabel>{copy.pagesLabel}</StatLabel>
          </StatText>
        </CellLink>

        <CellLink area="hours" href={copy.statsHref} prefetch={false}>
          <Media>
            <Image
              src={copy.images.hours.src}
              alt={copy.images.hours.alt}
              fill
              sizes="(max-width: 767px) 100vw, 40vw"
              unoptimized
            />
            <Overlay />
          </Media>
          <StatText>
            <StatValue>{formatCount(watchedHours)}</StatValue>{" "}
            <StatLabel>{copy.hoursLabel}</StatLabel>
          </StatText>
        </CellLink>

        <Cell area="landscape">
          <Media>
            <Image
              src={copy.images.landscape.src}
              alt={copy.images.landscape.alt}
              fill
              sizes="(max-width: 767px) 100vw, 60vw"
              unoptimized
            />
          </Media>
        </Cell>
      </Grid>
    </Section>
  );
}
