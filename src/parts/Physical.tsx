"use client";

import { ScrollySection, ScrollyStage, ScrollyStep, TextOverlay } from "@/components";
import { STEPS } from "./physical/data";
import { PhysicalStage } from "./physical/PhysicalStage";
import styles from "./physical/physical.module.css";

/**
 * Part 1 — Physical. One scroll step per story page (see STEPS in physical/data.ts).
 * Owner edits ONLY this file and files under src/parts/physical/.
 */
export function PhysicalPart() {
  return (
    <ScrollySection id="physical" part>
      <ScrollyStage>{(step) => <PhysicalStage step={step} />}</ScrollyStage>
      {STEPS.map((s, i) => (
        <ScrollyStep key={i} className={styles.step}>
          <div className={i === 0 ? `${styles.card} ${styles.introCard}` : styles.card}>
            <TextOverlay variant={s.variant} title={s.title}>
              <p>{s.body}</p>
            </TextOverlay>
          </div>
        </ScrollyStep>
      ))}
    </ScrollySection>
  );
}
