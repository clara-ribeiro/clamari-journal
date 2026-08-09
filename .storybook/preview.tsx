import type { Preview } from "@storybook/nextjs-vite";
import { globalStyles } from "../src/styles/stitches.config";
import "./preview.css";

globalStyles();

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
    backgrounds: {
      options: {
        transparent: { name: "Transparent", value: "transparent" },
        navy: { name: "Navy", value: "#021570" },
        paper: { name: "Paper", value: "#F8F0DE" },
        films: { name: "Films", value: "#2A221C" },
        stats: { name: "Stats", value: "#131313" },
        white: { name: "White", value: "#FFFFFF" },
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  initialGlobals: {
    // Transparent — each story/section supplies its own field color.
    backgrounds: { value: "transparent" },
  },
  decorators: [
    (Story) => (
      <div className="sb-root">
        <Story />
      </div>
    ),
  ],
};

export default preview;
