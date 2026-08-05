import EntryCard from "@/components/molecules/EntryCard";
import { homeCopy } from "@/content/copy";
import type { JournalEntry } from "@/domain/entities";
import {
  Heading,
  List,
  ListItem,
  Section,
  ShowAllLink,
} from "./styles";

export type RecentEntriesProps = {
  entries: JournalEntry[];
  titleId?: string;
  title?: string;
  showAllLabel?: string;
  showAllHref?: string;
  listAriaLabel?: string;
  className?: string;
};

export default function RecentEntries({
  entries,
  titleId = homeCopy.recentEntries.titleId,
  title = homeCopy.recentEntries.title,
  showAllLabel = homeCopy.recentEntries.showAllLabel,
  showAllHref = homeCopy.recentEntries.showAllHref,
  listAriaLabel = homeCopy.recentEntries.listAriaLabel,
  className,
}: RecentEntriesProps) {
  if (entries.length === 0) return null;

  return (
    <Section className={className} aria-labelledby={titleId}>
      <Heading id={titleId}>{title}</Heading>
      <List aria-label={listAriaLabel}>
        {entries.map((entry, index) => (
          <ListItem key={`${entry.medium}-${entry.slug}`}>
            <EntryCard entry={entry} priority={index < 2} />
          </ListItem>
        ))}
      </List>
      <ShowAllLink href={showAllHref} prefetch={false}>
        {showAllLabel}
      </ShowAllLink>
    </Section>
  );
}
