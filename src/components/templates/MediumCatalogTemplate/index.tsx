"use client";

import type { CatalogListItem } from "@/application/dto";
import type { MediumCatalogCopy } from "@/content/copy";
import {
  Back,
  Empty,
  Item,
  ItemLink,
  List,
  Meta,
  Page,
  Summary,
  Title,
} from "./styles";

export type MediumCatalogTemplateProps = {
  copy: MediumCatalogCopy;
  summary: string;
  items: CatalogListItem[];
};

export default function MediumCatalogTemplate({
  copy,
  summary,
  items,
}: MediumCatalogTemplateProps) {
  return (
    <Page id="main-content">
      <Back href={copy.backHref} prefetch={false}>
        {copy.backLabel}
      </Back>
      <Title id={copy.titleId}>{copy.title}</Title>
      <Summary>{summary}</Summary>
      {items.length === 0 ? (
        <Empty>{copy.empty}</Empty>
      ) : (
        <List aria-label={copy.listAriaLabel}>
          {items.map((item) => (
            <Item key={item.slug}>
              <ItemLink href={item.href} prefetch={false}>
                <span>{item.title}</span>
                <Meta>{item.meta}</Meta>
              </ItemLink>
            </Item>
          ))}
        </List>
      )}
    </Page>
  );
}
