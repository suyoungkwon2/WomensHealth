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

/** Part: Physical. Owner edits ONLY this file (plus new files under src/parts/physical/). */
export function PhysicalPart() {
  return (
    <ScrollySection id="physical" part>
      <ScrollyStage>
        {(step) => (
          <>
            <StageTitle>Physical</StageTitle>
            <PlaceholderGraphic step={step} tone="women" />
            <SourceNote>Source: placeholder citation.</SourceNote>
          </>
        )}
      </ScrollyStage>
      <ScrollyStep>
        <TextOverlay variant="dark" title="Physical — step 1">
          <p>Placeholder copy. Replace with the real story text for this step.</p>
        </TextOverlay>
      </ScrollyStep>
      <ScrollyStep>
        <TextOverlay variant="light" title="Physical — step 2">
          <p>The graphic behind this box changes as you scroll.</p>
        </TextOverlay>
      </ScrollyStep>
      <ScrollyStep>
        <TextOverlay variant="veil" title="Physical — step 3">
          <p>Full-width veil variant.</p>
        </TextOverlay>
      </ScrollyStep>
    </ScrollySection>
  );
}
