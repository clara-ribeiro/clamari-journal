import { Star } from "lucide-react";
import { starRatingCopy } from "@/content/copy";
import { Root } from "./styles";

export type StarRatingProps = {
  value?: number;
  max?: number;
  className?: string;
};

export default function StarRating({
  value = 0,
  max = 5,
  className,
}: StarRatingProps) {
  const stars = Math.round(Math.min(max, Math.max(0, value)));
  const label =
    stars > 0
      ? starRatingCopy.rated
          .replace("{value}", String(stars))
          .replace("{max}", String(max))
      : starRatingCopy.noRating;

  return (
    <Root className={className} role="img" aria-label={label}>
      {Array.from({ length: max }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          data-state={index < stars ? "full" : "empty"}
        />
      ))}
    </Root>
  );
}
