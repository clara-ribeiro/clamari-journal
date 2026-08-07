import Image from "next/image";
import { homeCopy } from "@/content/copy/home";
import {
  Background,
  Body,
  Email,
  Epigraph,
  Frame,
  Panel,
  Paragraph,
  Root,
  Title,
} from "./styles";

type HomeJournalAboutProps = {
  className?: string;
};

export default function HomeJournalAbout({
  className,
}: HomeJournalAboutProps) {
  const { titleId, title, paragraphs, email, epigraph, image } =
    homeCopy.journalAbout;
  const objectPosition = `${image.focalX} ${image.focalY}`;

  return (
    <Root className={className} aria-labelledby={titleId}>
      <Background aria-hidden="true">
        <Image
          src={image.src}
          alt=""
          fill
          sizes="100vw"
          quality={70}
          loading="lazy"
          style={{ objectPosition }}
        />
      </Background>
      <Frame>
        <Epigraph style={{ marginBlockEnd: `calc(100% - ${image.focalY})` }}>
          {epigraph}
        </Epigraph>
        <Panel>
          <Title id={titleId}>{title}</Title>
          <Body>
            {paragraphs.map((paragraph) => (
              <Paragraph key={paragraph}>{paragraph}</Paragraph>
            ))}
          </Body>
          <Email href={`mailto:${email}`}>{email}</Email>
        </Panel>
      </Frame>
    </Root>
  );
}
