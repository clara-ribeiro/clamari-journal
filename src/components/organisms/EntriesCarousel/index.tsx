import EntryCard from "@/components/molecules/EntryCard";
import type { JournalEntry } from "@/domain/entities";
import {
  CarouselFrame,
  Heading,
  List,
  ListItem,
  Section,
  ShowAllLink,
} from "./styles";

export type EntriesCarouselProps = {
  entries: JournalEntry[];
  titleId: string;
  title: string;
  listAriaLabel: string;
  showAllLabel?: string;
  showAllHref?: string;
  priorityCount?: number;
  className?: string;
};

export default function EntriesCarousel({
  entries,
  titleId,
  title,
  listAriaLabel,
  showAllLabel,
  showAllHref,
  priorityCount = 2,
  className,
}: EntriesCarouselProps) {
  if (entries.length === 0) return null;

  const showAll = Boolean(showAllLabel && showAllHref);

  return (
    <Section className={className} aria-labelledby={titleId}>
      <Heading id={titleId}>{title}</Heading>
      <CarouselFrame>
        <List aria-label={listAriaLabel}>
          {entries.map((entry, index) => (
            <ListItem key={`${entry.medium}-${entry.slug}`}>
              <EntryCard entry={entry} priority={index < priorityCount} />
            </ListItem>
          ))}
        </List>
      </CarouselFrame>
      {showAll ? (
        <ShowAllLink href={showAllHref!} prefetch={false}>
          {showAllLabel}
        </ShowAllLink>
      ) : null}
    </Section>
  );
}
