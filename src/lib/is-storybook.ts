/** True when rendered inside Storybook’s Vite preview. */
export function isStorybookRuntime(): boolean {
  return Boolean(
    (import.meta as ImportMeta & { env?: { STORYBOOK?: unknown } }).env
      ?.STORYBOOK,
  );
}
