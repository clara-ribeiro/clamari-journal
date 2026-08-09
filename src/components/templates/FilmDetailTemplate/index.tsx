"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import type { MovieCastMember, MovieDetail } from "@/application/dto";
import StarRating from "@/components/atoms/StarRating";
import ReviewRenderer from "@/components/molecules/ReviewRenderer";
import { filmsCopy } from "@/content/copy/films";
import { isTmdbImageUrl, tmdbImageLoader } from "@/lib/tmdb-image";
import {
  Backdrop,
  BackdropScrim,
  BackLink,
  CastGrid,
  CastItem,
  CastMeta,
  CastName,
  CastPhoto,
  CastPhotoPlaceholder,
  CastRole,
  CastToggle,
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
  JournalBlock,
  MetaNotice,
  OriginalTitle,
  Page,
  Panel,
  PosterFrame,
  PosterPlaceholder,
  PosterSurface,
  SectionHeading,
  Shell,
  SplitRow,
  Synopsis,
  Title,
  TitleRow,
  TrailerLink,
  ViewingItem,
  ViewingKind,
  ViewingList,
  ViewingMeta,
  YearRuntime,
} from "./styles";

export type FilmDetailTemplateProps = {
  detail: MovieDetail;
  className?: string;
};

const CAST_LIMIT_COMPACT = 4;
const CAST_LIMIT_DESKTOP = 8;
/** Desktop only (`lg`) — tablet stays on the compact cast count. */
const DESKTOP_MQ = "(min-width: 1024px)";

function useCastLimit() {
  const [limit, setLimit] = useState(CAST_LIMIT_COMPACT);

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MQ);
    const sync = () => {
      setLimit(media.matches ? CAST_LIMIT_DESKTOP : CAST_LIMIT_COMPACT);
    };
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return limit;
}

function CastSection({
  cast,
  heading,
  headingId,
  emptyLabel,
  showMoreLabel,
  showLessLabel,
}: {
  cast: MovieCastMember[];
  heading: string;
  headingId: string;
  emptyLabel: string;
  showMoreLabel: string;
  showLessLabel: string;
}) {
  const limit = useCastLimit();
  const [expanded, setExpanded] = useState(false);

  if (cast.length === 0) {
    return (
      <Panel aria-labelledby={headingId}>
        <SectionHeading id={headingId}>{heading}</SectionHeading>
        <MetaNotice>{emptyLabel}</MetaNotice>
      </Panel>
    );
  }

  const visible = expanded ? cast : cast.slice(0, limit);
  const canToggle = cast.length > limit;

  return (
    <Panel aria-labelledby={headingId}>
      <SectionHeading id={headingId}>{heading}</SectionHeading>
      <CastGrid>
        {visible.map((person) => (
          <CastItem key={person.id}>
            <CastPhoto>
              {person.profileUrl ? (
                <Image
                  src={person.profileUrl}
                  alt=""
                  width={185}
                  height={185}
                  sizes="(max-width: 767px) 40vw, 120px"
                  {...(isTmdbImageUrl(person.profileUrl)
                    ? { loader: tmdbImageLoader }
                    : { quality: 60 })}
                />
              ) : (
                <CastPhotoPlaceholder aria-hidden />
              )}
            </CastPhoto>
            <CastMeta>
              <CastName>{person.name}</CastName>
              {person.role ? <CastRole>{person.role}</CastRole> : null}
            </CastMeta>
          </CastItem>
        ))}
      </CastGrid>
      {canToggle ? (
        <CastToggle
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? showLessLabel : showMoreLabel}
        </CastToggle>
      ) : null}
    </Panel>
  );
}

export default function FilmDetailTemplate({
  detail,
  className,
}: FilmDetailTemplateProps) {
  const copy = filmsCopy.detail;
  const [showPosterPlaceholder, setShowPosterPlaceholder] = useState(
    !detail.posterUrl,
  );
  const titleId = copy.titleId;
  const yearRuntime = [detail.yearLabel, detail.runtimeLabel]
    .filter(Boolean)
    .join(" · ");
  const hasReview = Boolean(detail.reviewSlug);

  return (
    <Page className={className} id="main-content" aria-labelledby={titleId}>
      <HeroSentinel id={copy.heroSentinelId} aria-hidden />
      <Hero>
        <HeroMedia aria-hidden>
          <Backdrop>
            {detail.backdropUrl ? (
              <Image
                src={detail.backdropUrl}
                alt=""
                width={1280}
                height={720}
                sizes="100vw"
                {...(isTmdbImageUrl(detail.backdropUrl)
                  ? { loader: tmdbImageLoader }
                  : { quality: 65 })}
                priority
              />
            ) : null}
          </Backdrop>
          <BackdropScrim />
          <HeroGrain />
        </HeroMedia>

        <HeroBody>
          <HeroContent>
            <PosterFrame>
              <PosterSurface>
                {showPosterPlaceholder || !detail.posterUrl ? (
                  <PosterPlaceholder aria-hidden />
                ) : (
                  <Image
                    src={detail.posterUrl}
                    alt=""
                    width={500}
                    height={750}
                    sizes="(max-width: 767px) 36vw, 184px"
                    {...(isTmdbImageUrl(detail.posterUrl)
                      ? { loader: tmdbImageLoader }
                      : { quality: 70 })}
                    priority
                    onError={() => setShowPosterPlaceholder(true)}
                  />
                )}
              </PosterSurface>
            </PosterFrame>

            <HeroText>
              <TitleRow>
                <Title id={titleId}>{detail.title}</Title>
                {yearRuntime ? <YearRuntime>{yearRuntime}</YearRuntime> : null}
              </TitleRow>

              {detail.originalTitle ? (
                <OriginalTitle>
                  <span>{copy.metadata.originalTitle}</span>
                  {detail.originalTitle}
                </OriginalTitle>
              ) : null}

              {detail.genres.length > 0 ? (
                <GenreRow aria-label={copy.metadata.genres}>
                  {detail.genres.map((genre) => (
                    <Genre key={genre}>{genre}</Genre>
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
          <MetaNotice role="status">{detail.metadataNotice}</MetaNotice>
        ) : null}

        <SplitRow>
          <Panel aria-labelledby={copy.metadata.headingId}>
            <SectionHeading id={copy.metadata.headingId}>
              {copy.metadata.heading}
            </SectionHeading>

            <Synopsis>{detail.synopsis ?? copy.metadata.noSynopsis}</Synopsis>

            <FactList>
              {detail.directorsLabel ? (
                <Fact>
                  <FactLabel>{copy.metadata.directors}</FactLabel>
                  <FactValue>{detail.directorsLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.writersLabel ? (
                <Fact>
                  <FactLabel>{copy.metadata.writers}</FactLabel>
                  <FactValue>{detail.writersLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.countriesLabel ? (
                <Fact>
                  <FactLabel>{copy.metadata.countries}</FactLabel>
                  <FactValue>{detail.countriesLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.languagesLabel ? (
                <Fact>
                  <FactLabel>{copy.metadata.languages}</FactLabel>
                  <FactValue>{detail.languagesLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.runtimeLabel ? (
                <Fact>
                  <FactLabel>{copy.metadata.runtime}</FactLabel>
                  <FactValue>{detail.runtimeLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.trailer ? (
                <Fact>
                  <FactLabel>{copy.metadata.trailer}</FactLabel>
                  <FactValue>
                    <TrailerLink
                      href={detail.trailer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {copy.metadata.trailerCta}
                    </TrailerLink>
                  </FactValue>
                </Fact>
              ) : null}
            </FactList>
          </Panel>

          <CastSection
            cast={detail.cast}
            heading={copy.metadata.cast}
            headingId={copy.metadata.castHeadingId}
            emptyLabel={copy.metadata.noCast}
            showMoreLabel={copy.metadata.castShowMore}
            showLessLabel={copy.metadata.castShowLess}
          />
        </SplitRow>

        <SplitRow>
          <Panel aria-labelledby={copy.journal.headingId}>
            <SectionHeading id={copy.journal.headingId}>
              {copy.journal.heading}
            </SectionHeading>

            <JournalBlock>
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
                {detail.tags.length > 0 ? (
                  <Fact>
                    <FactLabel>{copy.journal.tags}</FactLabel>
                    <FactValue>{detail.tags.join(", ")}</FactValue>
                  </Fact>
                ) : null}
                {detail.watchLocation ? (
                  <Fact>
                    <FactLabel>{copy.journal.watchLocation}</FactLabel>
                    <FactValue>{detail.watchLocation}</FactValue>
                  </Fact>
                ) : null}
                {detail.streamingService ? (
                  <Fact>
                    <FactLabel>{copy.journal.streamingService}</FactLabel>
                    <FactValue>{detail.streamingService}</FactValue>
                  </Fact>
                ) : null}
              </FactList>
            </JournalBlock>
          </Panel>

          <Panel aria-labelledby={copy.viewings.headingId}>
            <SectionHeading id={copy.viewings.headingId}>
              {copy.viewings.heading}
            </SectionHeading>
            <ViewingMeta>{detail.viewingCountLabel}</ViewingMeta>
            {detail.viewings.length > 0 ? (
              <ViewingList>
                {detail.viewings.map((viewing) => (
                  <ViewingItem
                    key={`${viewing.kindLabel}-${viewing.dateLabel}`}
                  >
                    <ViewingKind>{viewing.kindLabel}</ViewingKind>
                    <span>{viewing.dateLabel}</span>
                  </ViewingItem>
                ))}
              </ViewingList>
            ) : (
              <MetaNotice>{detail.viewingsEmptyLabel}</MetaNotice>
            )}
          </Panel>
        </SplitRow>

        {hasReview ? (
          <Panel aria-labelledby={copy.review.headingId}>
            <ReviewRenderer
              heading={copy.review.heading}
              headingId={copy.review.headingId}
              emptyLabel={detail.reviewEmptyLabel}
            />
          </Panel>
        ) : null}

        <BackLink href={copy.backHref} prefetch={false}>
          {copy.backLabel}
        </BackLink>
      </Shell>
    </Page>
  );
}
