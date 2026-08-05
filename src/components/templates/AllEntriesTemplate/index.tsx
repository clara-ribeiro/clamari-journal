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

export type CatalogCopy = {
  titleId: string;
  title: string;
  description: string;
  backLabel: string;
  listAriaLabel: string;
  empty: string;
};

export type AllEntriesTemplateProps = {
  entries: JournalEntry[];
  copy?: CatalogCopy;
};

export default function AllEntriesTemplate({
  entries,
  copy = allEntriesCopy,
}: AllEntriesTemplateProps) {
  return (
    <Page id="main-content">
      <Back href="/" prefetch={false}>
        {copy.backLabel}
      </Back>
      <Title id={copy.titleId}>{copy.title}</Title>
      <Description>{copy.description}</Description>
      {entries.length === 0 ? (
        <Empty>{copy.empty}</Empty>
      ) : (
        <List aria-label={copy.listAriaLabel}>
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
