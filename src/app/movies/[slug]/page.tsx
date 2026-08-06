import { notFound } from "next/navigation";
import {
  getMovieDetail,
  listMovies,
} from "@/application/use-cases/movies";
import MediumDetailTemplate from "@/components/templates/MediumDetailTemplate";
import { moviesCopy } from "@/content/copy";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listMovies().map((movie) => ({ slug: movie.slug }));
}

export default async function MovieDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = getMovieDetail(slug);
  if (!detail) notFound();

  return (
    <MediumDetailTemplate
      kind="movie"
      detail={detail}
      backLabel={moviesCopy.detail.backLabel}
    />
  );
}
