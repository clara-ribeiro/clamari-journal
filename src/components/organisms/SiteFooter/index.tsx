"use client";

import { usePathname } from "next/navigation";
import { siteCopy } from "@/content/copy";
import {
  Brand,
  BrandLink,
  Credit,
  Line,
  Meta,
  Root,
  SocialIcon,
  SocialLink,
  SocialNav,
} from "./styles";

export type SiteFooterProps = {
  className?: string;
};

const copy = siteCopy.footer;

function LinkedInIcon() {
  return (
    <SocialIcon viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.05c.53-1 1.84-2.05 3.8-2.05 4.06 0 4.8 2.67 4.8 6.15V23h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.5V23h-4V8.5z"
      />
    </SocialIcon>
  );
}

function GitHubIcon() {
  return (
    <SocialIcon viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .1-.79.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.23v3.3c0 .32.22.69.83.57A12 12 0 0 0 12 .3z"
      />
    </SocialIcon>
  );
}

function InstagramIcon() {
  return (
    <SocialIcon viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2.2c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4a4.9 4.9 0 0 1 1.77 1.15 4.9 4.9 0 0 1 1.15 1.77c.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.16-.46-.35-1.26-.4-2.43C2.21 15.58 2.2 15.2 2.2 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43a4.9 4.9 0 0 1 1.15-1.77A4.9 4.9 0 0 1 5.6 1.8c.46-.16 1.26-.35 2.43-.4C9.3 1.34 9.68 1.33 12 1.33zm0 1.8c-3.15 0-3.52.01-4.76.07-.98.04-1.51.21-1.86.35-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.35-.3.88-.35 1.86-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.04.98.21 1.51.35 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.35.14.88.3 1.86.35 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.98-.04 1.51-.21 1.86-.35.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.35.3-.88.35-1.86.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.98-.21-1.51-.35-1.86a3.1 3.1 0 0 0-.75-1.15 3.1 3.1 0 0 0-1.15-.75c-.35-.14-.88-.3-1.86-.35-1.24-.06-1.61-.07-4.76-.07zm0 3.2a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8zm0 1.8a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2zm5.6-2.1a1.26 1.26 0 1 1 0 2.52 1.26 1.26 0 0 1 0-2.52z"
      />
    </SocialIcon>
  );
}

const socialIcons = {
  linkedin: LinkedInIcon,
  github: GitHubIcon,
  instagram: InstagramIcon,
} as const;

export default function SiteFooter({ className }: SiteFooterProps) {
  const pathname = usePathname();
  const isHome = pathname === copy.homeHref;

  return (
    <Root className={className}>
      {isHome ? (
        <Brand>{copy.brand}</Brand>
      ) : (
        <BrandLink href={copy.homeHref} prefetch={false} aria-label={siteCopy.brand.fullName}>
          {copy.brand}
        </BrandLink>
      )}

      <Meta>
        <Credit>
          <span>{copy.creditPrimary}</span>
          <span>{copy.creditSecondary}</span>
        </Credit>
        <Line>{copy.tagline}</Line>
        <Line>{copy.copyright}</Line>
      </Meta>

      <SocialNav aria-label={copy.socialNavLabel}>
        {copy.social.map((item) => {
          const Icon = socialIcons[item.network];
          return (
            <SocialLink
              key={item.network}
              href={item.href}
              aria-label={item.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon />
            </SocialLink>
          );
        })}
      </SocialNav>
    </Root>
  );
}
