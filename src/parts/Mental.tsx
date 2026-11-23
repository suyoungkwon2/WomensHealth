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

/** Part: Mental. Owner edits ONLY this file (plus new files under src/parts/mental/). */
export function MentalPart() {
  return (
    <ScrollySection id="mental" part>
      <ScrollyStage>
        {(step) => (
          <>
            <StageTitle>Doris</StageTitle>
            <PlaceholderGraphic step={step} tone="men" />
            <SourceNote>Source: placeholder citation.</SourceNote>
          </>
        )}
      </ScrollyStage>
      <ScrollyStep>
        <TextOverlay variant="dark" title="Mental — step 1">
          <p>Placeholder copy. Replace with the real story text for this step.</p>
        </TextOverlay>
      </ScrollyStep>
      <ScrollyStep>
        <TextOverlay variant="light" title="Mental — step 2">
          <p>The graphic behind this box changes as you scroll.</p>
        </TextOverlay>
      </ScrollyStep>
      <ScrollyStep>
        <TextOverlay variant="veil" title="Mental — step 3">
          <p>Full-width veil variant.</p>
        </TextOverlay>
      </ScrollyStep>
    </ScrollySection>
  );
}
