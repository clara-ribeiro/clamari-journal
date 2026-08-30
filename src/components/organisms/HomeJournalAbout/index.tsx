"use client";

import { useLocaleCopy } from "@/content/copy/use-copy";
import {
  Body,
  EmailLink,
  Epigraph,
  Panel,
  PanelAnchor,
  Paragraph,
  Section,
  Title,
} from "./styles";

export type HomeJournalAboutProps = {
  className?: string;
};

export default function HomeJournalAbout({ className }: HomeJournalAboutProps) {
  const { copy: bundle } = useLocaleCopy();
  const copy = bundle.home.journalAbout;
  const [intro, closing] = copy.paragraphs;

  return (
    <Section className={className} aria-labelledby={copy.titleId}>
      <PanelAnchor>
        <Panel>
          <Title id={copy.titleId}>{copy.title}</Title>
          <Body>
            <Paragraph>{intro}</Paragraph>
            <Paragraph>
              {closing}{" "}
              <EmailLink href={`mailto:${copy.email}`}>{copy.email}</EmailLink>.
            </Paragraph>
          </Body>
        </Panel>
      </PanelAnchor>
      <Epigraph>{copy.epigraph}</Epigraph>
    </Section>
  );
}
