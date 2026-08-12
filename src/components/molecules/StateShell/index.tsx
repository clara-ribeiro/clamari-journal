"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { useStatusChrome } from "@/components/providers/StatusChromeProvider";
import { stateScenes, type StateScene } from "@/content/copy/states";
import { Backdrop, Body, Grain, Media, Root, Scrim } from "./styles";

export type StateShellProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  role?: string;
  "aria-labelledby"?: string;
  "aria-live"?: "polite" | "off" | "assertive";
  "aria-busy"?: boolean;
  rotate?: boolean;
  rotateMs?: number;
};

function pickSceneIndex(length: number, avoid?: number) {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  if (avoid != null && length > 1) {
    while (next === avoid) {
      next = Math.floor(Math.random() * length);
    }
  }
  return next;
}

export default function StateShell({
  children,
  className,
  id,
  role,
  "aria-labelledby": ariaLabelledBy,
  "aria-live": ariaLive,
  "aria-busy": ariaBusy,
  rotate = false,
  rotateMs = 7000,
}: StateShellProps) {
  const pool: readonly StateScene[] = stateScenes;
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const { setActive } = useStatusChrome();

  useEffect(() => {
    setActive(true);
    return () => setActive(false);
  }, [setActive]);

  useEffect(() => {
    // Defer so the first paint can hydrate on index 0, then reveal a random scene.
    const frame = requestAnimationFrame(() => {
      setIndex(pickSceneIndex(pool.length));
      setVisible(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [pool.length]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  useEffect(() => {
    if (!rotate || pool.length < 2) return;

    let fadeTimer: number | undefined;
    const id = window.setInterval(() => {
      setVisible(false);
      fadeTimer = window.setTimeout(() => {
        setIndex((current) => pickSceneIndex(pool.length, current));
        setVisible(true);
      }, 420);
    }, rotateMs);

    return () => {
      window.clearInterval(id);
      if (fadeTimer != null) window.clearTimeout(fadeTimer);
    };
  }, [rotate, rotateMs, pool.length]);

  const scene = pool[index] ?? pool[0];

  return (
    <Root
      className={className}
      id={id}
      role={role}
      aria-labelledby={ariaLabelledBy}
      aria-live={ariaLive}
      aria-busy={ariaBusy}
    >
      <Media aria-hidden>
        <Backdrop data-visible={visible ? "true" : "false"}>
          {scene ? (
            <Image
              key={scene.src}
              src={scene.src}
              alt={scene.alt}
              width={1920}
              height={1080}
              sizes="100vw"
              priority
              quality={65}
            />
          ) : null}
        </Backdrop>
        <Scrim />
        <Grain />
      </Media>
      <Body>{children}</Body>
    </Root>
  );
}
