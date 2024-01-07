import { Options } from "$fresh/plugins/twind.ts";
import { plugins } from "$doc_components/twind.config.ts";
import * as twColors from "twind/colors";

export default {
  selfURL: import.meta.url,
  plugins,
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      ...twColors,
    },
    screens: {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      // "2xl": "1536px",
    },
  },
} as Options;
