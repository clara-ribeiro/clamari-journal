"use client";

import type { CatalogListItem } from "@/application/dto";
import type { MediumCatalogCopy } from "@/content/copy";
import CatalogHero, {
  type CatalogMedium,
} from "@/components/organisms/CatalogHero";
import {
  Back,
  Content,
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
  medium: CatalogMedium;
  copy: MediumCatalogCopy;
  summary: string;
  items: CatalogListItem[];
};

export default function MediumCatalogTemplate({
  medium,
  copy,
  summary,
  items,
}: MediumCatalogTemplateProps) {
  return (
    <Page medium={medium}>
      <CatalogHero medium={medium} copy={copy.hero} />
      <Title id={copy.titleId}>{copy.title}</Title>
      <Content id="main-content" aria-labelledby={copy.titleId}>
        <Back href={copy.backHref} prefetch={false} medium={medium}>
          {copy.backLabel}
        </Back>
        <Summary>{summary}</Summary>
        {items.length === 0 ? (
          <Empty medium={medium}>{copy.empty}</Empty>
        ) : (
          <List aria-label={copy.listAriaLabel}>
            {items.map((item) => (
              <Item key={item.slug} medium={medium}>
                <ItemLink href={item.href} prefetch={false}>
                  <span>{item.title}</span>
                  <Meta>{item.meta}</Meta>
                </ItemLink>
              </Item>
            ))}
          </List>
        )}
      </Content>
    </Page>
  );
}
