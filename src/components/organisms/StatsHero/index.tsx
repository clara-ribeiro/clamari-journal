"use client";

import { copyFor } from "@/content/copy/for-locale";
import { useLocaleCopy } from "@/content/copy/use-copy";
import { Figure, Section, Title } from "./styles";

export type StatsHeroProps = {
  titleId?: string;
  title?: string;
  sentinelId?: string;
  imageSrc?: string;
  className?: string;
};

const copy = copyFor("en").stats.hero;

/** Intrinsic aspect from source art (3558×1848). */
const BALLERINA_W = 720;
const BALLERINA_H = 374;

const BALLERINA_SRCSET = [
  "/images/stats/ballerina-480.webp 480w",
  "/images/stats/ballerina-720.webp 720w",
  "/images/stats/ballerina-1080.webp 1080w",
  "/images/stats/ballerina-1600.webp 1600w",
].join(", ");

/** Figure is `width: 60%` of the viewport / container. */
const BALLERINA_SIZES = "(max-width: 1023px) 60vw, min(60vw, 48rem)";

export default function StatsHero({
  titleId,
  title,
  sentinelId,
  imageSrc = copy.image.src,
  className,
}: StatsHeroProps) {
  const { copy: bundle } = useLocaleCopy();
  const hero = bundle.stats.hero;
  const resolvedTitleId = titleId ?? hero.titleId;
  const resolvedTitle = title ?? hero.title;
  const resolvedSentinel = sentinelId ?? hero.sentinelId;

  return (
    <Section
      id={resolvedSentinel}
      className={className}
      aria-labelledby={resolvedTitleId}
    >
      <Title id={resolvedTitleId}>{resolvedTitle}</Title>
      <Figure>
        {/*
          Native img + srcSet: Next Image `unoptimized` cannot emit a
          responsive set, and the optimizer strips WebP alpha. Sizes match
          the 60%-wide figure so mobile does not download the full asset.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          srcSet={BALLERINA_SRCSET}
          sizes={BALLERINA_SIZES}
          alt=""
          width={BALLERINA_W}
          height={BALLERINA_H}
          fetchPriority="high"
          decoding="async"
        />
      </Figure>
    </Section>
  );
}
