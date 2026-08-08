import Image from "next/image";
import type { StatsMetric } from "@/application/dto";
import {
  LandscapeCell,
  PortraitCell,
  Row,
  Section,
  Stack,
  StatCell,
  StatCellLink,
  StatFit,
  StatOverlay,
  VisuallyHidden,
} from "./styles";

export type StatsCollageImage = {
  src: string;
  alt: string;
};

/** One image pair per collage row (left cell + right cell). */
export type StatsCollageRowImages = {
  left: StatsCollageImage;
  right: StatsCollageImage;
};

export type StatsCollageImages = {
  /** Same order as `stats` — each row gets its own photos. */
  rows: readonly StatsCollageRowImages[];
  /** Trailing decorative row when there is an odd number of stats. */
  closing?: StatsCollageRowImages;
};

export type StatsCollageProps = {
  stats: StatsMetric[];
  images: StatsCollageImages;
  titleId: string;
  ariaLabel: string;
  /** When set, each stat cell links here (e.g. home → `/stats`). */
  statsHref?: string;
  /** `gold` on home; `split` is black/white on the stats page. */
  tone?: "gold" | "split";
  className?: string;
};

const STAT_VIEWBOX_WIDTH = 1000;
const STAT_VIEWBOX_HEIGHT = 280;
const BASE_FONT_SIZE = 110;
/** Below this, forcing full-width fit only adds empty tracking on one glyph. */
const MIN_STRETCH_CHARS = 5;
/** ~this many glyphs fill the viewBox at BASE_FONT_SIZE with the section face. */
const FULL_STRETCH_CHARS = 11;
/** Short values grow slightly for presence; stay clear of the label baseline. */
const SHORT_VALUE_FONT_SIZE = 140;

type FitLineProps = {
  x: number;
  fontSize: number;
  textAnchor?: "middle";
  textLength?: number;
  /** `spacing` keeps glyph shapes; only letter-spacing is adjusted. */
  lengthAdjust?: "spacing";
};

/**
 * Fit lines across the cell by tracking only — never `spacingAndGlyphs`,
 * which squashes short values like `5` into unreadable slabs.
 */
function fitLineProps(text: string, { grow = false } = {}): FitLineProps {
  if (text.length < MIN_STRETCH_CHARS) {
    return {
      x: STAT_VIEWBOX_WIDTH / 2,
      textAnchor: "middle",
      fontSize: grow ? SHORT_VALUE_FONT_SIZE : BASE_FONT_SIZE,
    };
  }

  if (text.length >= FULL_STRETCH_CHARS) {
    return {
      x: 0,
      fontSize: BASE_FONT_SIZE,
      textLength: STAT_VIEWBOX_WIDTH,
      lengthAdjust: "spacing",
    };
  }

  const width = (text.length / FULL_STRETCH_CHARS) * STAT_VIEWBOX_WIDTH;
  return {
    x: (STAT_VIEWBOX_WIDTH - width) / 2,
    fontSize: BASE_FONT_SIZE,
    textLength: width,
    lengthAdjust: "spacing",
  };
}

function StatFitText({ value, label }: { value: string; label: string }) {
  const valueText = value.toUpperCase();
  const labelText = label.toUpperCase();
  const ariaLabel = `${valueText} ${labelText}`;
  const valueFit = fitLineProps(valueText, { grow: true });
  const labelFit = fitLineProps(labelText);

  return (
    <StatFit
      viewBox={`0 0 ${STAT_VIEWBOX_WIDTH} ${STAT_VIEWBOX_HEIGHT}`}
      role="img"
      aria-label={ariaLabel}
      preserveAspectRatio="xMidYMid meet"
    >
      <text y={105} {...valueFit}>
        {valueText}
      </text>
      <text y={245} {...labelFit}>
        {labelText}
      </text>
    </StatFit>
  );
}

function StatBlock({
  href,
  image,
  value,
  label,
}: {
  href?: string;
  image: StatsCollageImage;
  value: string;
  label: string;
}) {
  const content = (
    <>
      <Image
        src={image.src}
        alt=""
        fill
        sizes="(max-width: 767px) 100vw, 35vw"
        quality={60}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
      <StatOverlay />
      <StatFitText value={value} label={label} />
    </>
  );

  if (href) {
    return (
      <StatCellLink href={href} prefetch={false}>
        {content}
      </StatCellLink>
    );
  }

  return <StatCell>{content}</StatCell>;
}

function MediaImage({
  image,
  sizes,
}: {
  image: StatsCollageImage;
  sizes: string;
}) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={900}
      height={600}
      sizes={sizes}
      quality={60}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
    />
  );
}

function rowImagesAt(
  rows: readonly StatsCollageRowImages[],
  index: number,
): StatsCollageRowImages | null {
  return rows[index] ?? null;
}

export default function StatsCollage({
  stats,
  images,
  titleId,
  ariaLabel,
  statsHref,
  tone = "gold",
  className,
}: StatsCollageProps) {
  const showClosingRow = stats.length % 2 === 1 && images.closing != null;

  return (
    <Section className={className} tone={tone} aria-labelledby={titleId}>
      <VisuallyHidden id={titleId}>{ariaLabel}</VisuallyHidden>
      <Stack aria-label={ariaLabel}>
        {stats.map((stat, index) => {
          const row = rowImagesAt(images.rows, index);
          if (!row) return null;

          const isOddRow = index % 2 === 0;

          if (isOddRow) {
            return (
              <Row key={stat.id}>
                <PortraitCell>
                  <MediaImage
                    image={row.left}
                    sizes="(max-width: 767px) 100vw, 60vw"
                  />
                </PortraitCell>
                <StatBlock
                  href={statsHref}
                  image={row.right}
                  value={stat.value}
                  label={stat.label}
                />
              </Row>
            );
          }

          return (
            <Row key={stat.id}>
              <StatBlock
                href={statsHref}
                image={row.left}
                value={stat.value}
                label={stat.label}
              />
              <LandscapeCell>
                <MediaImage
                  image={row.right}
                  sizes="(max-width: 767px) 100vw, 60vw"
                />
              </LandscapeCell>
            </Row>
          );
        })}

        {showClosingRow && images.closing ? (
          <Row>
            <PortraitCell>
              <MediaImage
                image={images.closing.left}
                sizes="(max-width: 767px) 100vw, 60vw"
              />
            </PortraitCell>
            <LandscapeCell>
              <MediaImage
                image={images.closing.right}
                sizes="(max-width: 767px) 100vw, 60vw"
              />
            </LandscapeCell>
          </Row>
        ) : null}
      </Stack>
    </Section>
  );
}
