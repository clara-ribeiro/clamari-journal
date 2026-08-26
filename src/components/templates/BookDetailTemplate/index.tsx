"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import type { BookDetail } from "@/application/dto";
import RefreshButton from "@/components/atoms/RefreshButton";
import StarRating from "@/components/atoms/StarRating";
import ReviewRenderer from "@/components/molecules/ReviewRenderer";
import { booksCopy } from "@/content/copy/books";
import {
  Authors,
  BackLink,
  BackdropScrim,
  Fact,
  FactLabel,
  FactList,
  FactValue,
  FavoriteMark,
  Genre,
  GenreRow,
  Hero,
  HeroBody,
  HeroContent,
  HeroGrain,
  HeroMedia,
  HeroMeta,
  HeroSentinel,
  HeroText,
  HistoryItem,
  HistoryNote,
  MetaNotice,
  NoteDate,
  NoteItem,
  NoteText,
  Page,
  Panel,
  PosterFrame,
  PosterPlaceholder,
  PosterSurface,
  QuoteItem,
  QuoteMeta,
  QuoteText,
  ScrollList,
  SectionHeading,
  Shell,
  SplitRow,
  Subtitle,
  Synopsis,
  TextBackdrop,
  Title,
  TitleRow,
  YearRuntime,
} from "./styles";

export type BookDetailTemplateProps = {
  detail: BookDetail;
  className?: string;
};

const MAX_HERO_REPS = 120;

/** Fills the hero fold by repeating a short excerpt until height is covered. */
function HeroTextFill({ excerpt }: { excerpt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [reps, setReps] = useState(1);
  const [source, setSource] = useState(excerpt);

  if (source !== excerpt) {
    setSource(excerpt);
    setReps(1);
  }

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (el.scrollHeight <= el.clientHeight + 1 && reps < MAX_HERO_REPS) {
      setReps((count) => count + 1);
      return;
    }

    const observer = new ResizeObserver(() => {
      if (el.scrollHeight <= el.clientHeight + 1) {
        setReps((count) => (count < MAX_HERO_REPS ? count + 1 : count));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [excerpt, reps]);

  const text = Array.from({ length: reps }, () => excerpt).join(" ");

  return (
    <TextBackdrop ref={ref} aria-hidden>
      {text}
    </TextBackdrop>
  );
}

export default function BookDetailTemplate({
  detail,
  className,
}: BookDetailTemplateProps) {
  const copy = booksCopy.detail;
  const [showCoverPlaceholder, setShowCoverPlaceholder] = useState(
    !detail.coverUrl,
  );
  const titleId = copy.titleId;
  const hasReview = Boolean(detail.reviewSlug);
  const hasNotes = detail.notes.length > 0;
  const yearPages = [detail.yearLabel, detail.pageCountLabel ? `${detail.pageCountLabel} pages` : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Page className={className} id="main-content" tabIndex={-1} aria-labelledby={titleId}>
      <HeroSentinel id={copy.heroSentinelId} aria-hidden />
      <Hero>
        <HeroMedia aria-hidden>
          {detail.heroExcerpt ? (
            <HeroTextFill excerpt={detail.heroExcerpt} />
          ) : (
            <TextBackdrop aria-hidden />
          )}
          <BackdropScrim />
          <HeroGrain />
        </HeroMedia>

        <HeroBody>
          <HeroContent>
            <PosterFrame>
              <PosterSurface>
                {showCoverPlaceholder || !detail.coverUrl ? (
                  <PosterPlaceholder aria-hidden />
                ) : (
                  <Image
                    src={detail.coverUrl}
                    alt=""
                    width={500}
                    height={750}
                    sizes="(max-width: 767px) 36vw, 184px"
                    quality={70}
                    priority
                    onError={() => setShowCoverPlaceholder(true)}
                  />
                )}
              </PosterSurface>
            </PosterFrame>

            <HeroText>
              <TitleRow>
                <Title id={titleId}>{detail.title}</Title>
                {yearPages ? <YearRuntime>{yearPages}</YearRuntime> : null}
              </TitleRow>

              {detail.subtitle ? <Subtitle>{detail.subtitle}</Subtitle> : null}
              {detail.authorsLabel ? (
                <Authors>{detail.authorsLabel}</Authors>
              ) : null}

              {detail.categories.length > 0 ? (
                <GenreRow aria-label={copy.metadata.categories}>
                  {detail.categories.map((category) => (
                    <Genre key={category}>{category}</Genre>
                  ))}
                </GenreRow>
              ) : null}

              <HeroMeta>
                <StarRating value={detail.rating} />
                {detail.favorite ? (
                  <FavoriteMark aria-label={detail.favoriteLabel}>
                    <Heart aria-hidden fill="currentColor" />
                    {detail.favoriteLabel}
                  </FavoriteMark>
                ) : null}
              </HeroMeta>
            </HeroText>
          </HeroContent>
        </HeroBody>
      </Hero>

      <Shell>
        {detail.metadataNotice ? (
          <MetaNotice role="status">
            <span>{detail.metadataNotice}</span>
            {detail.metadataNotice === copy.metadata.unavailable ? (
              <RefreshButton />
            ) : null}
          </MetaNotice>
        ) : null}

        <SplitRow>
          <Panel aria-labelledby={copy.metadata.headingId}>
            <SectionHeading id={copy.metadata.headingId}>
              {copy.metadata.heading}
            </SectionHeading>

            <Synopsis>{detail.synopsis ?? copy.metadata.noSynopsis}</Synopsis>

            <FactList>
              {detail.authorsLabel ? (
                <Fact>
                  <FactLabel>{copy.metadata.authors}</FactLabel>
                  <FactValue>{detail.authorsLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.publisherLabel ? (
                <Fact>
                  <FactLabel>{copy.metadata.publisher}</FactLabel>
                  <FactValue>{detail.publisherLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.yearLabel ? (
                <Fact>
                  <FactLabel>{copy.metadata.year}</FactLabel>
                  <FactValue>{detail.yearLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.pageCountLabel ? (
                <Fact>
                  <FactLabel>{copy.metadata.pages}</FactLabel>
                  <FactValue>{detail.pageCountLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.languageLabel ? (
                <Fact>
                  <FactLabel>{copy.metadata.language}</FactLabel>
                  <FactValue>{detail.languageLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.isbn10Label ? (
                <Fact>
                  <FactLabel>{copy.metadata.isbn10}</FactLabel>
                  <FactValue>{detail.isbn10Label}</FactValue>
                </Fact>
              ) : null}
              {detail.isbn13Label ? (
                <Fact>
                  <FactLabel>{copy.metadata.isbn13}</FactLabel>
                  <FactValue>{detail.isbn13Label}</FactValue>
                </Fact>
              ) : null}
            </FactList>
          </Panel>

          <Panel aria-labelledby={copy.quotes.headingId}>
            <SectionHeading id={copy.quotes.headingId}>
              {copy.quotes.heading}
            </SectionHeading>
            {detail.quotes.length === 0 ? (
              <MetaNotice>{detail.quotesEmptyLabel}</MetaNotice>
            ) : (
              <ScrollList>
                {detail.quotes.map((quote) => (
                  <QuoteItem key={quote.id}>
                    <QuoteText>“{quote.text}”</QuoteText>
                    <QuoteMeta>
                      {[quote.pageLabel, quote.note].filter(Boolean).join(" · ")}
                    </QuoteMeta>
                  </QuoteItem>
                ))}
              </ScrollList>
            )}
          </Panel>
        </SplitRow>

        <SplitRow>
          <Panel aria-labelledby={copy.journal.headingId}>
            <SectionHeading id={copy.journal.headingId}>
              {copy.journal.heading}
            </SectionHeading>

            <FactList>
              <Fact>
                <FactLabel>{copy.journal.status}</FactLabel>
                <FactValue>{detail.statusLabel}</FactValue>
              </Fact>
              <Fact>
                <FactLabel>{copy.journal.rating}</FactLabel>
                <FactValue>
                  {detail.rating != null ? (
                    <StarRating value={detail.rating} />
                  ) : (
                    copy.journal.noRating
                  )}
                </FactValue>
              </Fact>
              <Fact>
                <FactLabel>{copy.journal.favorite}</FactLabel>
                <FactValue>{detail.favoriteLabel}</FactValue>
              </Fact>
              {detail.formatLabel ? (
                <Fact>
                  <FactLabel>{copy.journal.format}</FactLabel>
                  <FactValue>{detail.formatLabel}</FactValue>
                </Fact>
              ) : null}
              <Fact>
                <FactLabel>{copy.journal.tags}</FactLabel>
                <FactValue>
                  {detail.tags.length > 0
                    ? detail.tags.join(", ")
                    : copy.journal.noTags}
                </FactValue>
              </Fact>
              {detail.startedLabel ? (
                <Fact>
                  <FactLabel>{copy.journal.started}</FactLabel>
                  <FactValue>{detail.startedLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.finishedLabel ? (
                <Fact>
                  <FactLabel>{copy.journal.finished}</FactLabel>
                  <FactValue>{detail.finishedLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.currentPageLabel ? (
                <Fact>
                  <FactLabel>{copy.journal.currentPage}</FactLabel>
                  <FactValue>{detail.currentPageLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.progressLabel ? (
                <Fact>
                  <FactLabel>{copy.journal.progress}</FactLabel>
                  <FactValue>{detail.progressLabel}</FactValue>
                </Fact>
              ) : null}
            </FactList>
          </Panel>

          <Panel aria-labelledby={copy.history.headingId}>
            <SectionHeading id={copy.history.headingId}>
              {copy.history.heading}
            </SectionHeading>
            {detail.history.length === 0 ? (
              <MetaNotice>{detail.historyEmptyLabel}</MetaNotice>
            ) : (
              <ScrollList>
                {detail.history.map((row) => (
                  <HistoryItem key={row.id}>
                    <span>{row.dateLabel}</span>
                    {row.pageLabel ? <span>{row.pageLabel}</span> : <span />}
                    {row.note ? <HistoryNote>{row.note}</HistoryNote> : null}
                  </HistoryItem>
                ))}
              </ScrollList>
            )}
          </Panel>
        </SplitRow>

        {hasNotes ? (
          <Panel aria-labelledby={copy.notes.headingId}>
            <SectionHeading id={copy.notes.headingId}>
              {copy.notes.heading}
            </SectionHeading>
            <ScrollList>
              {detail.notes.map((note) => (
                <NoteItem key={note.id}>
                  <NoteDate>{note.dateLabel}</NoteDate>
                  <NoteText>{note.text}</NoteText>
                </NoteItem>
              ))}
            </ScrollList>
          </Panel>
        ) : null}

        {hasReview ? (
          <ReviewRenderer
            heading={copy.review.heading}
            headingId={copy.review.headingId}
            emptyLabel={detail.reviewEmptyLabel}
            html={detail.reviewHtml}
          />
        ) : null}

        <BackLink href={copy.backHref} prefetch={false}>
          {copy.backLabel}
        </BackLink>
      </Shell>
    </Page>
  );
}
