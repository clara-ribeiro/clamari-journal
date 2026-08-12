"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import type {
  MovieCastMember,
  SeriesDetail,
  SeriesSeasonDetail,
} from "@/application/dto";
import RefreshButton from "@/components/atoms/RefreshButton";
import StarRating from "@/components/atoms/StarRating";
import ReviewRenderer from "@/components/molecules/ReviewRenderer";
import { seriesCopy } from "@/content/copy/series";
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
  EpisodeAir,
  EpisodeCode,
  EpisodeItem,
  EpisodeList,
  EpisodeMeta,
  EpisodeTitle,
  EpisodeWatched,
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
  MetaNotice,
  NextBadge,
  OriginalTitle,
  Page,
  Panel,
  PosterFrame,
  PosterPlaceholder,
  PosterSurface,
  SeasonPanel,
  SeasonSummary,
  SeasonTitle,
  SectionHeading,
  Shell,
  SplitRow,
  Synopsis,
  Title,
  TitleRow,
  TrailerLink,
  YearRuntime,
} from "./styles";

export type SeriesDetailTemplateProps = {
  detail: SeriesDetail;
  className?: string;
};

const CAST_LIMIT_COMPACT = 4;
const CAST_LIMIT_DESKTOP = 8;
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
  const listId = `${headingId}-list`;

  return (
    <Panel aria-labelledby={headingId}>
      <SectionHeading id={headingId}>{heading}</SectionHeading>
      <CastGrid id={listId}>
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
          aria-controls={listId}
        >
          {expanded ? showLessLabel : showMoreLabel}
        </CastToggle>
      ) : null}
    </Panel>
  );
}

function SeasonsPanel({
  seasons,
  emptyLabel,
}: {
  seasons: SeriesSeasonDetail[];
  emptyLabel: string;
}) {
  const copy = seriesCopy.detail.seasons;

  if (seasons.length === 0) {
    return (
      <Panel aria-labelledby={copy.headingId}>
        <SectionHeading id={copy.headingId}>{copy.heading}</SectionHeading>
        <MetaNotice>{emptyLabel}</MetaNotice>
      </Panel>
    );
  }

  return (
    <Panel aria-labelledby={copy.headingId}>
      <SectionHeading id={copy.headingId}>{copy.heading}</SectionHeading>
      {seasons.map((season) => (
        <SeasonPanel key={season.id}>
          <SeasonSummary>
            <SeasonTitle>{season.title}</SeasonTitle>
            <span>{season.progressLabel}</span>
          </SeasonSummary>
          <EpisodeList>
            {season.episodes.map((episode) => (
              <EpisodeItem
                key={episode.id}
                data-watched={episode.watched ? "true" : "false"}
              >
                <EpisodeCode>{episode.codeLabel}</EpisodeCode>
                <EpisodeMeta>
                  <EpisodeTitle>
                    {episode.title}
                    {episode.isNext ? (
                      <NextBadge>{copy.nextBadge}</NextBadge>
                    ) : null}
                  </EpisodeTitle>
                  <EpisodeAir>
                    {[
                      episode.airDateLabel
                        ? `${copy.airDate} ${episode.airDateLabel}`
                        : null,
                      episode.runtimeLabel,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </EpisodeAir>
                </EpisodeMeta>
                <EpisodeWatched>
                  {episode.watched
                    ? episode.watchedDateLabel || copy.watched
                    : copy.unwatched}
                  {episode.rating != null ? (
                    <StarRating value={episode.rating} />
                  ) : null}
                </EpisodeWatched>
              </EpisodeItem>
            ))}
          </EpisodeList>
        </SeasonPanel>
      ))}
    </Panel>
  );
}

export default function SeriesDetailTemplate({
  detail,
  className,
}: SeriesDetailTemplateProps) {
  const copy = seriesCopy.detail;
  const [showPosterPlaceholder, setShowPosterPlaceholder] = useState(
    !detail.posterUrl,
  );
  const titleId = copy.titleId;
  const yearLabel = detail.yearLabel;
  const hasReview = Boolean(detail.reviewSlug);

  return (
    <Page className={className} id="main-content" tabIndex={-1} aria-labelledby={titleId}>
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
                {yearLabel ? <YearRuntime>{yearLabel}</YearRuntime> : null}
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
              {detail.creatorsLabel ? (
                <Fact>
                  <FactLabel>{copy.metadata.creators}</FactLabel>
                  <FactValue>{detail.creatorsLabel}</FactValue>
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
              {detail.productionStatusLabel ? (
                <Fact>
                  <FactLabel>{copy.metadata.productionStatus}</FactLabel>
                  <FactValue>{detail.productionStatusLabel}</FactValue>
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
              {detail.startedLabel ? (
                <Fact>
                  <FactLabel>{copy.journal.started}</FactLabel>
                  <FactValue>{detail.startedLabel}</FactValue>
                </Fact>
              ) : null}
              <Fact>
                <FactLabel>{copy.journal.watchedEpisodes}</FactLabel>
                <FactValue>{detail.watchedEpisodesLabel}</FactValue>
              </Fact>
              {detail.watchedTimeLabel ? (
                <Fact>
                  <FactLabel>{copy.journal.watchedTime}</FactLabel>
                  <FactValue>{detail.watchedTimeLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.progressLabel ? (
                <Fact>
                  <FactLabel>{copy.journal.progress}</FactLabel>
                  <FactValue>{detail.progressLabel}</FactValue>
                </Fact>
              ) : null}
              {detail.nextEpisodeLabel ? (
                <Fact>
                  <FactLabel>{copy.journal.nextEpisode}</FactLabel>
                  <FactValue>{detail.nextEpisodeLabel}</FactValue>
                </Fact>
              ) : null}
            </FactList>
          </Panel>

          <SeasonsPanel
            seasons={detail.seasons}
            emptyLabel={detail.seasonsEmptyLabel}
          />
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
