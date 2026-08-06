import { Star } from "lucide-react";
import { EmptyClip, FillClip, HalfRoot, Root } from "./styles";

export type StarRatingProps = {
  value?: number;
  max?: number;
  className?: string;
};

function starState(index: number, value: number): "full" | "half" | "empty" {
  const threshold = index + 1;
  if (value >= threshold) return "full";
  if (value >= threshold - 0.5) return "half";
  return "empty";
}

function HalfStar() {
  return (
    <HalfRoot aria-hidden>
      <FillClip data-half="fill">
        <Star aria-hidden />
      </FillClip>
      <EmptyClip data-half="empty">
        <Star aria-hidden />
      </EmptyClip>
    </HalfRoot>
  );
}

export default function StarRating({
  value = 0,
  max = 5,
  className,
}: StarRatingProps) {
  const clamped = Math.min(max, Math.max(0, value));
  const label =
    clamped > 0 ? `Rated ${clamped} out of ${max}` : "No rating";

  return (
    <Root className={className} role="img" aria-label={label}>
      {Array.from({ length: max }, (_, index) => {
        const state = starState(index, clamped);
        if (state === "full") {
          return <Star key={index} aria-hidden data-state="full" />;
        }
        if (state === "half") {
          return <HalfStar key={index} />;
        }
        return <Star key={index} aria-hidden data-state="empty" />;
      })}
    </Root>
  );
}
