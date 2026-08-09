import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getMovieDetail,
  listMovies,
} from "@/application/use-cases/movies";
import FilmDetailTemplate from "@/components/templates/FilmDetailTemplate";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listMovies().map((movie) => ({ slug: movie.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getMovieDetail(slug);
  if (!detail) {
    return { title: "Film not found" };
  }

  return {
    title: detail.metaTitle,
    description: detail.metaDescription,
  };
}

export default async function FilmDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getMovieDetail(slug);
  if (!detail) notFound();

  return <FilmDetailTemplate detail={detail} />;
}
