import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect } from "react";
import {
  StatusChromeProvider,
  useStatusChrome,
} from "./StatusChromeProvider";

function ActiveFlag({ active }: { active: boolean }) {
  const { setActive } = useStatusChrome();
  useEffect(() => {
    setActive(active);
    return () => setActive(false);
  }, [active, setActive]);
  return (
    <p style={{ padding: "2rem" }}>
      Status chrome active: <strong>{String(active)}</strong>
    </p>
  );
}

const meta = {
  title: "Providers/StatusChromeProvider",
  component: StatusChromeProvider,
  tags: ["autodocs"],
  args: {
    children: <ActiveFlag active={false} />,
  },
} satisfies Meta<typeof StatusChromeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inactive: Story = {};

export const Active: Story = {
  args: {
    children: <ActiveFlag active />,
  },
};
