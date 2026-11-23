"use client";

import type { FundingScene } from "./steps";
import styles from "./FundingGraphic.module.css";

const SCENES: FundingScene[] = ["intro", "chart", "detail", "outro"];

/**
 * Pinned graphic for the Funding part.
 * Every scene stays mounted and fades in/out with CSS, so transitions are smooth.
 * Build each scene's real graphic (SVG/CSS) in its own component and drop it in below.
 */
export function FundingGraphic({ scene }: { scene: FundingScene }) {
  return (
    <div className={styles.root}>
      {SCENES.map((s) => (
        <div
          key={s}
          className={styles.scene}
          data-active={s === scene || undefined}
          aria-hidden={s !== scene}
        >
          {/* TODO: replace with the real graphic for this scene */}
          <div className={styles.placeholder}>
            <span className="t-label">scene · {s}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
