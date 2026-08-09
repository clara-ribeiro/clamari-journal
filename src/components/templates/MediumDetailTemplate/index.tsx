"use client";

import type { BookDetail, SeriesDetail } from "@/application/dto";
import { Fragment } from "react";
import {
  Episode,
  EpisodeList,
  EpisodesHeading,
  Meta,
  Page,
  Title,
} from "./styles";

type MediumDetailTemplateProps =
  | {
      kind: "series";
      detail: SeriesDetail;
    }
  | {
      kind: "book";
      detail: BookDetail;
    };

export default function MediumDetailTemplate(props: MediumDetailTemplateProps) {
  const { detail } = props;
  const titleId = "detail-heading";

  return (
    <Page id="main-content" aria-labelledby={titleId}>
      <Title id={titleId}>{detail.title}</Title>
      <Meta>
        {detail.fields.map((field) => (
          <Fragment key={field.label}>
            <dt>{field.label}</dt>
            <dd>{field.value}</dd>
          </Fragment>
        ))}
      </Meta>
      {props.kind === "series" && props.detail.episodes.length > 0 ? (
        <>
          <EpisodesHeading>{props.detail.episodesHeading}</EpisodesHeading>
          <EpisodeList>
            {props.detail.episodes.map((ep) => (
              <Episode key={ep.id}>
                <span>{ep.label}</span>
                <span>{ep.date}</span>
              </Episode>
            ))}
          </EpisodeList>
        </>
      ) : null}
    </Page>
  );
}
