import { createCn } from "cn/config";

// Figma text styles are exposed as `text-<size>-<weight>` utilities (see
// globals.css). Without this, the merger reads them as text *colors* and drops
// `text-primary-foreground` (or the other way round) whenever both appear.
const textSizes = [
  "body-10",
  "body-13",
  "body-16",
  "heading-20",
  "heading-25",
  "heading-31",
  "heading-39",
  "heading-49",
  "heading-61",
];
const textWeights = ["regular", "medium", "bold"];
const textStyles = textSizes.flatMap((size) =>
  textWeights.map((weight) => `${size}-${weight}`),
);

/**
 * Project `cn`. tsconfig `paths` points the bare `"cn"` import (used by
 * generated shadcn components) at this module, so they merge with the same rules.
 */
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [{ text: textStyles }],
      // Custom shadow tokens must replace a component's default `shadow-md`.
      shadow: [
        { shadow: ["card", "brand", "menu", "panel", "float", "popover"] },
      ],
    },
  },
});
