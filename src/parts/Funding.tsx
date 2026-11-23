"use client";

import {
  ScrollySection,
  ScrollyStage,
  ScrollyStep,
  SourceNote,
  StageTitle,
  TextOverlay,
} from "@/components";
import { FundingGraphic } from "./funding/FundingGraphic";
import { FUNDING_SOURCE, FUNDING_STEPS } from "./funding/steps";

/**
 * Part: Funding. Owner edits ONLY this file (plus new files under src/parts/funding/).
 *   - Story text → funding/steps.ts
 *   - Graphics   → funding/FundingGraphic.tsx (one scene per step)
 */
export function FundingPart() {
  return (
    <ScrollySection id="funding" part>
      <ScrollyStage>
        {(step) => (
          <>
            <StageTitle>Funding</StageTitle>
            <FundingGraphic scene={(FUNDING_STEPS[step] ?? FUNDING_STEPS[0]).scene} />
            <SourceNote>{FUNDING_SOURCE}</SourceNote>
          </>
        )}
      </ScrollyStage>
      {FUNDING_STEPS.map((s, i) => (
        <ScrollyStep key={i}>
          <TextOverlay variant={s.variant} title={s.title}>
            {s.body.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </TextOverlay>
        </ScrollyStep>
      ))}
    </ScrollySection>
  );
}
