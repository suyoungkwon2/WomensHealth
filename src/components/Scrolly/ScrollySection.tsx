"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./Scrolly.module.css";

type ScrollyState = { step: number; stepCount: number };
const ScrollyContext = createContext<ScrollyState>({ step: 0, stepCount: 0 });

/** Index (0-based) of the step currently in the middle of the viewport. */
export function useScrollyStep() {
  return useContext(ScrollyContext);
}

type SectionProps = {
  /** Anchor id — must match an id in `PARTS` (lib/parts.ts) if it is a part root. */
  id?: string;
  /** Mark as a header-nav target. Set on the first section of each part. */
  part?: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * One scrollytelling block.
 *
 *   <ScrollySection id="physical" part>
 *     <ScrollyStage>{(step) => <MyGraphic step={step} />}</ScrollyStage>
 *     <ScrollyStep><TextOverlay .../></ScrollyStep>
 *     <ScrollyStep>…</ScrollyStep>
 *   </ScrollySection>
 *
 * The stage stays pinned under the header; each step is a full-height row that
 * scrolls over it. The active step changes the stage content.
 */
export function ScrollySection({ id, part, children, className }: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<ScrollyState>({ step: 0, stepCount: 0 });

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-scrolly-step]"));
    setState((s) => ({ ...s, stepCount: steps.length }));

    // A step is active while it crosses the middle line of the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setState((s) => ({ ...s, step: steps.indexOf(e.target as HTMLElement) }));
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    steps.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <ScrollyContext.Provider value={state}>
      <section
        ref={ref}
        id={id}
        data-part={part ? "" : undefined}
        className={[styles.section, className].filter(Boolean).join(" ")}
      >
        {children}
      </section>
    </ScrollyContext.Provider>
  );
}

/** Pinned graphic area. Pass a function to receive the active step index. */
export function ScrollyStage({
  children,
  className,
}: {
  children: ReactNode | ((step: number) => ReactNode);
  className?: string;
}) {
  const { step } = useScrollyStep();
  return (
    <div className={[styles.stage, className].filter(Boolean).join(" ")}>
      {typeof children === "function" ? children(step) : children}
    </div>
  );
}

/** One scroll step. Usually wraps a <TextOverlay>. */
export function ScrollyStep({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div data-scrolly-step className={[styles.step, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
