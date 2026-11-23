import type { ReactNode } from "react";
import styles from "./SourceNote.module.css";

/** Right-aligned citation line at the bottom of a stage (Figma "Source"). */
export function SourceNote({ children }: { children: ReactNode }) {
  return <p className={styles.root}>{children}</p>;
}
