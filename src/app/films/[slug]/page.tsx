import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getMovieDetail,
  listMovies,
} from "@/application/use-cases/movies";
import FilmDetailTemplate from "@/components/templates/FilmDetailTemplate";
import { detailPageMetadata, pageMetadata } from "@/lib/page-metadata";
import { statesCopy } from "@/content/copy/states";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listMovies().map((movie) => ({ slug: movie.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getMovieDetail(slug);
  if (!detail) {
    return pageMetadata({
      title: statesCopy.notFound.title,
      description: statesCopy.notFound.description,
      path: `/films/${slug}`,
      index: false,
    });
  }

  return detailPageMetadata({
    title: detail.metaTitle,
    description: detail.metaDescription,
    path: `/films/${detail.slug}`,
    imageUrl: detail.posterUrl ?? detail.backdropUrl,
  });
}

export default async function FilmDetailPage({ params }: Props) {
  const { slug } = await params;
  const detail = await getMovieDetail(slug);
  if (!detail) notFound();

  return <FilmDetailTemplate detail={detail} />;
}
