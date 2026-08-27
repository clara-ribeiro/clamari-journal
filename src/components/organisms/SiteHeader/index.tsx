"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LocaleSwitch from "@/components/atoms/LocaleSwitch";
import { siteCopy } from "@/content/copy";
import { chromeForPath } from "@/lib/chrome-tone";
import { stripLocalePrefix } from "@/lib/review-locale";
import { useStatusChrome } from "@/components/providers/StatusChromeProvider";
import {
  Bar,
  Brand,
  BrandLink,
  End,
  Nav,
  NavLink,
  Spacer,
  Start,
} from "./styles";

export type SiteHeaderProps = {
  className?: string;
};

const copy = siteCopy.header;
const revealOnScroll = new Set<string>(copy.revealOnScrollHrefs);
const revealPrefixes = copy.revealOnScrollPrefixes;
const catalogSentinels = copy.catalogHeroSentinelIds;

function isActivePath(pathname: string, href: string) {
  const canonical = stripLocalePrefix(pathname);
  return canonical === href || canonical.startsWith(`${href}/`);
}

function usesRevealOnScroll(pathname: string) {
  const canonical = stripLocalePrefix(pathname);
  if (revealOnScroll.has(canonical)) return true;
  return revealPrefixes.some(
    (prefix) =>
      canonical.startsWith(prefix) || pathname.startsWith(prefix),
  );
}

function resolveSentinelId(pathname: string): string | null {
  const canonical = stripLocalePrefix(pathname);
  if (canonical === copy.homeHref) return copy.brandSentinelId;
  if (canonical in catalogSentinels) {
    return catalogSentinels[canonical as keyof typeof catalogSentinels];
  }
  if (canonical.startsWith("/films/")) {
    return copy.filmDetailHeroSentinelId;
  }
  if (canonical.startsWith("/series/")) {
    return copy.seriesDetailHeroSentinelId;
  }
  if (canonical.startsWith("/books/")) {
    return copy.bookDetailHeroSentinelId;
  }
  return null;
}

export default function SiteHeader({ className }: SiteHeaderProps) {
  const pathname = usePathname() ?? copy.homeHref;
  const isHome = stripLocalePrefix(pathname) === copy.homeHref;
  const usesReveal = usesRevealOnScroll(pathname);
  const { active: statusChrome } = useStatusChrome();
  const tone = statusChrome ? "clear" : chromeForPath(pathname).header;
  const [pastHero, setPastHero] = useState(false);
  const [observedPath, setObservedPath] = useState(pathname);

  if (observedPath !== pathname) {
    setObservedPath(pathname);
    setPastHero(false);
  }

  const sentinelId = resolveSentinelId(pathname);
  // Reveal-on-scroll pages stay hidden until the hero sentinel leaves; status chrome always shows.
  // No sentinel id means there is nothing to wait for — show immediately.
  const visible =
    statusChrome || !usesReveal || pastHero || (usesReveal && !sentinelId);

  useEffect(() => {
    if (statusChrome || !usesReveal || !sentinelId) return;

    const sentinel = document.getElementById(sentinelId);
    // No hero on the page (e.g. Storybook isolation) — show the bar.
    if (!sentinel) {
      const frame = requestAnimationFrame(() => setPastHero(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [pathname, usesReveal, statusChrome, sentinelId]);

  return (
    <>
      <Bar className={className} visible={visible} tone={tone}>
        <Start>
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
        </Start>

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

        <End>
          <LocaleSwitch tone={tone} />
        </End>
      </Bar>

      {!statusChrome && !usesReveal ? <Spacer aria-hidden /> : null}
    </>
  );
}
