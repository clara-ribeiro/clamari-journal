"use client";

import type { BookDetail } from "@/application/dto";
import { Fragment } from "react";
import { Meta, Page, Title } from "./styles";

type MediumDetailTemplateProps = {
  kind: "book";
  detail: BookDetail;
};

export default function MediumDetailTemplate({
  detail,
}: MediumDetailTemplateProps) {
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
    </Page>
  );
}
