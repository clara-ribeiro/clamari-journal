"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteCopy } from "@/content/copy";
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

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader({ className }: SiteHeaderProps) {
  const pathname = usePathname() ?? copy.homeHref;
  const isHome = pathname === copy.homeHref;
  // Always start hidden so server HTML matches the first client render (avoids hydration mismatch).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }

    const sentinel = document.getElementById(copy.brandSentinelId);
    if (!sentinel) return;

    const sync = (inView: boolean) => setVisible(!inView);

    const observer = new IntersectionObserver(
      ([entry]) => sync(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);

    const rect = sentinel.getBoundingClientRect();
    sync(rect.bottom > 0 && rect.top < window.innerHeight);

    return () => observer.disconnect();
  }, [isHome]);

  return (
    <>
      <Bar className={className} visible={visible}>
        <Nav aria-label={copy.navAriaLabel}>
          {copy.items.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              prefetch={false}
              active={isActivePath(pathname, item.href)}
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

      {!isHome ? <Spacer aria-hidden /> : null}
    </>
  );
}
