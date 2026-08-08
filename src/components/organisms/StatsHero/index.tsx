import Image from "next/image";
import { statsCopy } from "@/content/copy";
import { Figure, Section, Title } from "./styles";

export type StatsHeroProps = {
  titleId?: string;
  title?: string;
  sentinelId?: string;
  imageSrc?: string;
  className?: string;
};

const copy = statsCopy.hero;

export default function StatsHero({
  titleId = copy.titleId,
  title = copy.title,
  sentinelId = copy.sentinelId,
  imageSrc = copy.image.src,
  className,
}: StatsHeroProps) {
  return (
    <Section id={sentinelId} className={className} aria-labelledby={titleId}>
      <Title id={titleId}>{title}</Title>
      <Figure>
        <Image
          src={imageSrc}
          alt=""
          width={1600}
          height={1066}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 100vw, min(100vw, 80rem)"
          priority
          fetchPriority="high"
          // Next's optimizer strips alpha from WebP sources; serve the
          // transparent asset directly.
          unoptimized
        />
      </Figure>
    </Section>
  );
}
