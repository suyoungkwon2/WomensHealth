"use client";

/** Throw-away demo graphic showing how `step` drives the stage. Delete when real graphics land. */
export function PlaceholderGraphic({ step, tone }: { step: number; tone: "women" | "men" }) {
  const shades = [`var(--${tone}-100)`, `var(--${tone}-300)`, `var(--${tone})`];
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: "110px 15% 70px",
        background: shades[step] ?? shades[0],
        border: "1.2px solid var(--line)",
        transition: "background 0.5s ease",
        display: "grid",
        placeItems: "center",
        color: "var(--ink)",
        fontSize: 18,
      }}
    >
      graphic placeholder · step {step + 1}
    </div>
  );
}
