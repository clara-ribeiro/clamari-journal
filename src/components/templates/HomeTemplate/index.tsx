"use client";

import HomeHero from "@/components/organisms/HomeHero";
import { Root } from "./styles";

export type HomeTemplateProps = {
  className?: string;
};

export default function HomeTemplate({ className }: HomeTemplateProps) {
  return (
    <Root className={className}>
      <HomeHero />
    </Root>
  );
}
