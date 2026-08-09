"use client";

import type { ReactNode } from "react";
import SkipLink from "@/components/atoms/SkipLink";
import SiteFooter from "@/components/organisms/SiteFooter";
import SiteHeader from "@/components/organisms/SiteHeader";
import {
  StatusChromeProvider,
  useStatusChrome,
} from "@/components/providers/StatusChromeProvider";
import { AppFrame, AppMain } from "./styles";

function AppShellFrame({ children }: { children: ReactNode }) {
  const { active } = useStatusChrome();

  return (
    <AppFrame data-status={active ? "true" : "false"}>
      <SkipLink />
      <SiteHeader />
      <AppMain>{children}</AppMain>
      <SiteFooter />
    </AppFrame>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <StatusChromeProvider>
      <AppShellFrame>{children}</AppShellFrame>
    </StatusChromeProvider>
  );
}
