import type { TextOverlayVariant } from "@/components/TextOverlay/TextOverlay";

/**
 * Story steps for the Funding part — one entry per scroll step.
 * The index of each entry is the `step` number the stage graphic receives.
 * Replace the placeholder copy with the text from the team's story document.
 */
export type FundingStep = {
  /** Scene the stage graphic shows while this step is active. */
  scene: FundingScene;
  variant: TextOverlayVariant;
  title?: string;
  body: string[];
};

export type FundingScene = "intro" | "chart" | "detail" | "outro";

export const FUNDING_STEPS: FundingStep[] = [
  {
    scene: "intro",
    variant: "dark",
    title: "Funding",
    body: ["Placeholder — opening text for the Funding part."],
  },
  {
    scene: "chart",
    variant: "light",
    title: "Step 2",
    body: ["Placeholder — introduce the main chart."],
  },
  {
    scene: "detail",
    variant: "light",
    title: "Step 3",
    body: ["Placeholder — zoom into one detail of the chart."],
  },
  {
    scene: "outro",
    variant: "veil",
    title: "Step 4",
    body: ["Placeholder — closing text for the Funding part."],
  },
];

/** Citation shown at the bottom of the stage. Update per scene if sources differ. */
export const FUNDING_SOURCE = "Source: placeholder citation.";
