import type { ReactNode } from "react";
import styles from "./StageTitle.module.css";

/** Centered chart/stage title (Figma: DM Sans SemiBold 40px). */
export function StageTitle({ children }: { children: ReactNode }) {
  return <h2 className={styles.root}>{children}</h2>;
}
