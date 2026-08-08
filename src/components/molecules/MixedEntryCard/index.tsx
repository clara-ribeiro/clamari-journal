"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, PencilLine } from "lucide-react";
import StarRating from "@/components/atoms/StarRating";
import type { CatalogCardItem } from "@/application/dto";
import { isTmdbImageUrl, tmdbImageLoader } from "@/lib/tmdb-image";
import {
  Activity,
  BadgeSlot,
  CardLink,
  FavoriteMark,
  Meta,
  Pill,
  PillRow,
  PosterFrame,
  PosterPlaceholder,
  Root,
  StatusBadge,
  Tag,
  TagRow,
  Title,
  TitleRow,
  Year,
} from "./styles";

export type MixedEntryCardProps = {
  item: CatalogCardItem;
  priority?: boolean;
  className?: string;
};

export default function MixedEntryCard({
  item,
  priority = false,
  className,
}: MixedEntryCardProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(!item.posterUrl);

  return (
    <Root className={className}>
      <CardLink href={item.href} prefetch={false}>
        <PosterFrame>
          {showPlaceholder || !item.posterUrl ? (
            <PosterPlaceholder aria-hidden />
          ) : (
            <Image
              src={item.posterUrl}
              alt=""
              width={400}
              height={600}
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

        <Meta>
          <TitleRow>
            <Title>{item.title}</Title>
            {item.yearLabel ? <Year>{item.yearLabel}</Year> : null}
          </TitleRow>
          <StarRating value={item.rating} />
          <Activity>{item.activityLabel}</Activity>
          {item.hasReview ? (
            <PillRow>
              <Pill>
                <PencilLine aria-hidden />
                {item.reviewLabel}
              </Pill>
            </PillRow>
          ) : null}
          {item.metaTags.length > 0 ? (
            <TagRow>
              {item.metaTags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </TagRow>
          ) : null}
          {item.favorite ? (
            <FavoriteMark aria-label={item.favoriteLabel}>
              <Heart aria-hidden fill="currentColor" />
              {item.favoriteLabel}
            </FavoriteMark>
          ) : null}
        </Meta>
      </CardLink>
    </Root>
  );
}
