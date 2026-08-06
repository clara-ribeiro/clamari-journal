import Image from "next/image";
import StarRating from "@/components/atoms/StarRating";
import type { JournalEntry } from "@/domain/entities";
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
              sizes="(max-width: 767px) 42vw, (max-width: 1279px) 18vw, 14rem"
              priority={priority}
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
