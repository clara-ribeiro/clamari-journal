import Image from "next/image";
import StarRating from "@/components/atoms/StarRating";
import type { JournalEntry } from "@/application/dto";
import { isTmdbImageUrl, tmdbImageLoader } from "@/lib/tmdb-image";
import { CardLink, Meta, PosterFrame, PosterPlaceholder, Root, Title } from "./styles";

export type EntryCardProps = {
  entry: JournalEntry;
  priority?: boolean;
  className?: string;
};

export default function EntryCard({
  entry,
  priority = false,
  className,
}: EntryCardProps) {
  return (
    <Root className={className}>
      <CardLink href={entry.href} prefetch={false}>
        <PosterFrame>
          {entry.posterUrl ? (
            <Image
              src={entry.posterUrl}
              alt=""
              width={400}
              height={600}
              sizes="(max-width: 767px) 140px, (max-width: 1279px) 160px, 224px"
              {...(isTmdbImageUrl(entry.posterUrl)
                ? { loader: tmdbImageLoader }
                : {})}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
          ) : (
            <PosterPlaceholder aria-hidden />
          )}
        </PosterFrame>
        <Meta>
          <Title>{entry.title}</Title>
          <StarRating value={entry.rating} />
        </Meta>
      </CardLink>
    </Root>
  );
}
