import type { ReactNode } from "react";
import styles from "./TextOverlay.module.css";

export type TextOverlayVariant = "dark" | "light" | "veil";

type Props = {
  title?: string;
  children: ReactNode;
  /**
   * dark  – translucent dark card, white text (Figma "Frame 37" #1)
   * light – translucent white card, black text (Figma "Frame 37" #3)
   * veil  – no box: white layer fills the whole screen/step, black text; graphic fades behind it (Figma #2).
   *         Use inside <ScrollyStep> (needs a positioned parent to fill).
   */
  variant?: TextOverlayVariant;
  className?: string;
};

/** Text box that scrolls up over the sticky graphic. */
export function TextOverlay({ title, children, variant = "light", className }: Props) {
  return (
    <div className={[styles.root, styles[variant], className].filter(Boolean).join(" ")}>
      <div className={styles.copy}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
