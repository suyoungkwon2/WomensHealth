"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollySection, ScrollyStage, ScrollyStep, TextOverlay } from "@/components";
import { STEPS } from "./physical/data";
import { COLOR_STEP, PhysicalStage } from "./physical/PhysicalStage";
import styles from "./physical/physical.module.css";

/**
 * Part 1 — Physical. One scroll step per story page (see STEPS in physical/data.ts).
 * Owner edits ONLY this file and files under src/parts/physical/.
 */
export function PhysicalPart() {
  // The tags turn colored only once the “Look closer” card has risen into view (not when its step starts).
  const colorCard = useRef<HTMLDivElement>(null);
  const [colorReady, setColorReady] = useState(false);
  useEffect(() => {
    const el = colorCard.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setColorReady(e.intersectionRatio >= 0.6), { threshold: [0, 0.6, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ScrollySection id="physical" part>
      <ScrollyStage>{(step) => <PhysicalStage step={step} colorReady={colorReady} />}</ScrollyStage>
      {STEPS.map((s, i) => (
        <ScrollyStep key={i} className={s.layout ? `${styles.step} ${styles.stepLeft}` : styles.step}>
          <div ref={i === COLOR_STEP ? colorCard : undefined} className={i === 0 ? `${styles.card} ${styles.introCard}` : s.layout === "left" ? styles.cardLeft : s.layout === "leftNarrow" ? styles.cardLeftNarrow : styles.card}>
            <TextOverlay variant={s.variant} title={s.title}>
              <p>{s.body}</p>
            </TextOverlay>
          </div>
        </ScrollyStep>
      ))}
    </ScrollySection>
  );
}
