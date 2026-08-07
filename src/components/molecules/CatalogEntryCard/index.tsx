"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, PencilLine } from "lucide-react";
import StarRating from "@/components/atoms/StarRating";
import type { CatalogCardItem } from "@/application/dto";
import type {
  CatalogTone,
  CatalogViewMode,
} from "@/components/molecules/CatalogToolbar";
import { isTmdbImageUrl, tmdbImageLoader } from "@/lib/tmdb-image";
import {
  Activity,
  ActivityRow,
  BadgeSlot,
  CardLink,
  ListFlag,
  ListFlagSlot,
  ListFlags,
  ListLink,
  Pill,
  PillRow,
  PosterFrame,
  PosterPlaceholder,
  RatingSlot,
  Root,
  StatusBadge,
  Tag,
  TagRow,
  Title,
  TitleRow,
  Year,
} from "./styles";

export type CatalogEntryCardProps = {
  item: CatalogCardItem;
  tone: CatalogTone;
  layout?: CatalogViewMode;
  priority?: boolean;
  className?: string;
};

export default function CatalogEntryCard({
  item,
  tone,
  layout = "cards",
  priority = false,
  className,
}: CatalogEntryCardProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(!item.posterUrl);

  if (layout === "list") {
    return (
      <Root className={className} tone={tone} layout="list">
        <ListLink href={item.href} prefetch={false}>
          <Title tone={tone}>{item.title}</Title>
          <Year tone={tone}>{item.yearLabel ?? ""}</Year>
          <StatusBadge tone={item.statusTone} align="list">
            {item.statusLabel}
          </StatusBadge>
          <ListFlags>
            {item.favorite ? (
              <ListFlag
                emphasis
                aria-label={item.favoriteLabel}
                title={item.favoriteLabel}
              >
                <Heart aria-hidden fill="currentColor" />
              </ListFlag>
            ) : (
              <ListFlagSlot aria-hidden />
            )}
            {item.hasReview ? (
              <ListFlag
                aria-label={item.reviewLabel}
                title={item.reviewLabel}
              >
                <PencilLine aria-hidden />
              </ListFlag>
            ) : (
              <ListFlagSlot aria-hidden />
            )}
          </ListFlags>
        </ListLink>
      </Root>
    );
  }

  return (
    <Root className={className} tone={tone} layout="cards">
      <CardLink href={item.href} prefetch={false}>
        <PosterFrame tone={tone}>
          {showPlaceholder || !item.posterUrl ? (
            <PosterPlaceholder aria-hidden />
          ) : (
            <Image
              src={item.posterUrl}
              alt=""
              width={342}
              height={513}
              sizes="(max-width: 767px) 45vw, (max-width: 1023px) 30vw, 18vw"
              {...(isTmdbImageUrl(item.posterUrl)
                ? { loader: tmdbImageLoader }
                : { quality: 60 })}
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
              onError={() => setShowPlaceholder(true)}
            />
          )}
          <BadgeSlot>
            <StatusBadge tone={item.statusTone}>{item.statusLabel}</StatusBadge>
          </BadgeSlot>
        </PosterFrame>

        <TitleRow>
          <Title tone={tone}>{item.title}</Title>
          {item.yearLabel ? <Year tone={tone}>{item.yearLabel}</Year> : null}
        </TitleRow>

        <RatingSlot tone={tone}>
          <StarRating value={item.rating} />
        </RatingSlot>
      </CardLink>

      <ActivityRow>
        <Activity tone={tone}>{item.activityLabel}</Activity>
        <PillRow>
          <Pill tone={tone} active={item.favorite} emphasis={item.favorite}>
            <Heart
              aria-hidden
              fill={item.favorite ? "currentColor" : "none"}
            />
            {item.favoriteLabel}
          </Pill>
          <Pill tone={tone} active={item.hasReview}>
            <PencilLine aria-hidden />
            {item.reviewLabel}
          </Pill>
        </PillRow>
      </ActivityRow>

      {item.metaTags.length > 0 ? (
        <TagRow>
          {item.metaTags.map((tag) => (
            <Tag key={tag} tone={tone}>
              {tag}
            </Tag>
          ))}
        </TagRow>
      ) : null}
    </Root>
  );
}
