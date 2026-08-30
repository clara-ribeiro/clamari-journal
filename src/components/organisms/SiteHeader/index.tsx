"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LocaleSwitch from "@/components/atoms/LocaleSwitch";
import { useLocaleCopy } from "@/content/copy/use-copy";
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

function isActivePath(pathname: string, href: string) {
  const canonical = stripLocalePrefix(pathname);
  return canonical === href || canonical.startsWith(`${href}/`);
}

export default function SiteHeader({ className }: SiteHeaderProps) {
  const { copy: bundle, href } = useLocaleCopy();
  const copy = bundle.site.header;
  const revealOnScroll = new Set<string>(copy.revealOnScrollHrefs);
  const revealPrefixes = copy.revealOnScrollPrefixes;
  const catalogSentinels = copy.catalogHeroSentinelIds;
  const pathname = usePathname() ?? copy.homeHref;
  const isHome = stripLocalePrefix(pathname) === copy.homeHref;

  function usesRevealOnScroll(path: string) {
    const canonical = stripLocalePrefix(path);
    if (revealOnScroll.has(canonical)) return true;
    return revealPrefixes.some(
      (prefix) =>
        canonical.startsWith(prefix) || path.startsWith(prefix),
    );
  }

  function resolveSentinelId(path: string): string | null {
    const canonical = stripLocalePrefix(path);
    if (canonical === copy.homeHref) return copy.brandSentinelId;
    if (canonical in catalogSentinels) {
      return catalogSentinels[canonical as keyof typeof catalogSentinels];
    }
    if (canonical.startsWith("/films/")) return copy.filmDetailHeroSentinelId;
    if (canonical.startsWith("/series/")) {
      return copy.seriesDetailHeroSentinelId;
    }
    if (canonical.startsWith("/books/")) return copy.bookDetailHeroSentinelId;
    return null;
  }

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
  const visible =
    statusChrome || !usesReveal || pastHero || (usesReveal && !sentinelId);

  useEffect(() => {
    if (statusChrome || !usesReveal || !sentinelId) return;

    const sentinel = document.getElementById(sentinelId);
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
                href={href(item.href)}
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
            href={href(copy.homeHref)}
            prefetch={false}
            aria-label={bundle.site.brand.fullName}
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
