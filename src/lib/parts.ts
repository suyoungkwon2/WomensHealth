/** The three parts of the story. Header nav + section ids are generated from this. */
export const SITE_TITLE = "Women’s Health in the Blind Spot of Medical Care";

export const PARTS = [
  { id: "physical", label: "Physical" },
  { id: "mental", label: "Mental" },
  { id: "funding", label: "Funding" },
] as const;

export type PartId = (typeof PARTS)[number]["id"];
