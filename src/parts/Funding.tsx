"use client";

import {
  ScrollySection,
  ScrollyStage,
  ScrollyStep,
  SourceNote,
  StageTitle,
  TextOverlay,
} from "@/components";
import { PlaceholderGraphic } from "./PlaceholderGraphic";

/** Part: Funding. Owner edits ONLY this file (plus new files under src/parts/funding/). */
export function FundingPart() {
  return (
    <ScrollySection id="funding" part>
      <ScrollyStage>
        {(step) => (
          <>
            <StageTitle>Funding</StageTitle>
            <PlaceholderGraphic step={step} tone="women" />
            <SourceNote>Source: placeholder citation.</SourceNote>
          </>
        )}
      </ScrollyStage>
      <ScrollyStep>
        <TextOverlay variant="dark" title="Funding — step 1">
          <p>Placeholder copy. Replace with the real story text for this step.</p>
        </TextOverlay>
      </ScrollyStep>
      <ScrollyStep>
        <TextOverlay variant="light" title="Funding — step 2">
          <p>The graphic behind this box changes as you scroll.</p>
        </TextOverlay>
      </ScrollyStep>
      <ScrollyStep>
        <TextOverlay variant="veil" title="Funding — step 3">
          <p>Full-width veil variant.</p>
        </TextOverlay>
      </ScrollyStep>
    </ScrollySection>
  );
}
