"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteCopy } from "@/content/copy";
import { chromeForPath } from "@/lib/chrome-tone";
import {
  Bar,
  Brand,
  BrandLink,
  Nav,
  NavLink,
  Spacer,
} from "./styles";

export type SiteHeaderProps = {
  className?: string;
};

const copy = siteCopy.header;
const revealOnScroll = new Set<string>(copy.revealOnScrollHrefs);
const catalogSentinels = copy.catalogHeroSentinelIds;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function resolveSentinelId(pathname: string): string | null {
  if (pathname === copy.homeHref) return copy.brandSentinelId;
  if (pathname in catalogSentinels) {
    return catalogSentinels[pathname as keyof typeof catalogSentinels];
  }
  return null;
}

export default function SiteHeader({ className }: SiteHeaderProps) {
  const pathname = usePathname() ?? copy.homeHref;
  const isHome = pathname === copy.homeHref;
  const usesReveal = revealOnScroll.has(pathname);
  const tone = chromeForPath(pathname).header;
  const [pastHero, setPastHero] = useState(false);
  const [observedPath, setObservedPath] = useState(pathname);

  if (observedPath !== pathname) {
    setObservedPath(pathname);
    setPastHero(false);
  }

  // Reveal pages stay hidden until the hero sentinel leaves the viewport.
  // Other pages show the header immediately (SSR + client agree).
  const visible = !usesReveal || pastHero;

  useEffect(() => {
    if (!usesReveal) return;

    const sentinelId = resolveSentinelId(pathname);
    if (!sentinelId) return;

    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [pathname, usesReveal]);

  return (
    <>
      <Bar className={className} visible={visible} tone={tone}>
        <Nav aria-label={copy.navAriaLabel}>
          {copy.items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              prefetch={false}
              active={isActivePath(pathname, item.href)}
              tone={tone}
            >
              {item.label}
            </NavLink>
          ))}
        </Nav>

        {isHome ? (
          <Brand>{copy.brand}</Brand>
        ) : (
          <BrandLink
            href={copy.homeHref}
            prefetch={false}
            aria-label={siteCopy.brand.fullName}
          >
            {copy.brand}
          </BrandLink>
        )}
      </Bar>

      {!usesReveal ? <Spacer aria-hidden /> : null}
    </>
  );
}
