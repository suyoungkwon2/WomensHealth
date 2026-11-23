"use client";

import { useEffect, useState } from "react";
import { PARTS, SITE_TITLE, type PartId } from "@/lib/parts";
import styles from "./Header.module.css";

/**
 * Fixed top header. Nav links jump to the section with the matching id
 * (`<section id="physical" data-part>` …) and the current part is shown bold.
 */
export function Header() {
  const [active, setActive] = useState<PartId | null>(null);

  useEffect(() => {
    const sections = PARTS.map((p) => document.getElementById(p.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    // A part is "active" while it crosses the horizontal line 40% down the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id as PartId);
        }
      },
      { rootMargin: "-40% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#top" className={styles.brand}>
          {SITE_TITLE}
        </a>
        <nav aria-label="Parts" className={styles.nav}>
          {PARTS.map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className={styles.link}
              aria-current={active === p.id ? "true" : undefined}
            >
              {p.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
