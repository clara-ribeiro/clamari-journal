"use client";

import EntryCard from "@/components/molecules/EntryCard";
import { allEntriesCopy } from "@/content/copy";
import type { JournalEntry } from "@/domain/entities";
import {
  Back,
  Description,
  Empty,
  List,
  ListItem,
  Page,
  Title,
} from "./styles";

export type AllEntriesTemplateProps = {
  entries: JournalEntry[];
};

export default function AllEntriesTemplate({ entries }: AllEntriesTemplateProps) {
  return (
    <Page id="main-content">
      <Back href="/" prefetch={false}>
        {allEntriesCopy.backLabel}
      </Back>
      <Title id={allEntriesCopy.titleId}>{allEntriesCopy.title}</Title>
      <Description>{allEntriesCopy.description}</Description>
      {entries.length === 0 ? (
        <Empty>{allEntriesCopy.empty}</Empty>
      ) : (
        <List aria-label={allEntriesCopy.listAriaLabel}>
          {entries.map((entry) => (
            <ListItem key={`${entry.medium}-${entry.slug}`}>
              <EntryCard entry={entry} />
            </ListItem>
          ))}
        </List>
      )}
    </Page>
  );
}
