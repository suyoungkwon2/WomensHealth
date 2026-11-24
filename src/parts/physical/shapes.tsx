import type { CSSProperties, ReactNode } from "react";
import styles from "./physical.module.css";

export const WOMEN = "var(--women)";
export const MEN = "var(--men)";
const sans: CSSProperties = { fontFamily: "var(--font-sans)" };
const serif: CSSProperties = { fontFamily: "var(--font-serif)" };

const HEART =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

/** Heart icon, 24×24 units scaled by `size`, centered on (0,0). */
export function Heart({ size = 24, fill = "currentColor" }: { size?: number; fill?: string }) {
  const s = size / 24;
  return <path d={HEART} fill={fill} transform={`scale(${s}) translate(-12 -12)`} />;
}

/** A group that animates between positions with CSS transitions. */
export function Actor({
  x = 0,
  y = 0,
  scale = 1,
  opacity = 1,
  grayscale = false,
  children,
}: {
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  grayscale?: boolean;
  children: ReactNode;
}) {
  return (
    <g
      className={styles.actor}
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        opacity,
        filter: grayscale ? "grayscale(1)" : undefined,
        pointerEvents: "none",
      }}
    >
      {children}
    </g>
  );
}

/** Lab result card, centered on x = 0, top at y = 0. 200 × 118. */
export function LabCard({ value, badge }: { value: number; badge?: { text: string; solid?: boolean } }) {
  return (
    <g>
      <rect x={-100} y={0} width={200} height={118} rx={14} fill="#fff" stroke="var(--ink)" strokeWidth={1.5} />
      <g transform="translate(-78 24)" style={{ color: "var(--ink)" }}>
        <Heart size={20} />
      </g>
      <text x={-60} y={29} fontSize={15} letterSpacing={1.5} fill="var(--text-soft)" style={sans}>
        TROPONIN
      </text>
      <text x={-82} y={88} fontSize={50} fontWeight={700} fill="var(--ink)" style={sans}>
        {value}
      </text>
      <text x={-82 + String(value).length * 29 + 8} y={88} fontSize={17} fill="var(--text-soft)" style={sans}>
        ng/L
      </text>
      {badge && (
        <g transform="translate(0 132)">
          <rect
            x={-100}
            y={0}
            width={200}
            height={30}
            rx={15}
            fill={badge.solid ? "var(--ink)" : "#fff"}
            stroke="var(--ink)"
            strokeWidth={1.2}
          />
          <text
            x={0}
            y={20}
            fontSize={13}
            letterSpacing={1}
            textAnchor="middle"
            fill={badge.solid ? "#fff" : "var(--ink)"}
            style={sans}
          >
            {badge.text}
          </text>
        </g>
      )}
    </g>
  );
}

/** Vertical level meter: 0–60 ng/L over 360px, base at y = 0 (grows upward), centered on x = 0. */
export const METER_K = 6;
export function Meter({ value, color, label }: { value: number; color: string; label: string }) {
  const h = value * METER_K;
  return (
    <g>
      <rect x={-70} y={-360} width={140} height={360} rx={10} fill="#fff" stroke="var(--ink)" strokeWidth={1.5} />
      <rect x={-70} y={-h} width={140} height={h} rx={10} fill={color} stroke="var(--ink)" strokeWidth={1.5} />
      <text x={0} y={-h - 12} fontSize={30} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
        {value}
      </text>
      <text x={0} y={34} fontSize={20} textAnchor="middle" fill="var(--ink)" style={sans}>
        {label}
      </text>
    </g>
  );
}

export function Door({ x, label, active = true }: { x: number; label: string; active?: boolean }) {
  return (
    <g transform={`translate(${x} 0)`} opacity={active ? 1 : 0.35}>
      <rect x={-45} y={590} width={90} height={210} rx={4} fill="var(--gray-100)" stroke="var(--ink)" strokeWidth={1.5} />
      <circle cx={25} cy={700} r={5} fill="var(--ink)" />
      <text x={0} y={570} fontSize={15} letterSpacing={1.5} textAnchor="middle" fill="var(--ink)" style={sans}>
        {label}
      </text>
    </g>
  );
}

export function TestTube({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-12} y={-6} width={24} height={10} rx={3} fill="var(--gray-600)" />
      <path d="M-11 4h22v58a11 11 0 0 1-22 0z" fill="#fff" stroke="var(--ink)" strokeWidth={1.5} />
      <path d="M-11 30h22v32a11 11 0 0 1-22 0z" fill="#c4161c" />
    </g>
  );
}

export function QuestionMark({ x, y, size = 220 }: { x: number; y: number; size?: number }) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={serif}>
      ?
    </text>
  );
}

/** One of 100 identical participant icons, 30×30. */
export function Person({ x, y, fill }: { x: number; y: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y})`} className={styles.person} style={{ fill }}>
      <circle cx={15} cy={8} r={6.5} />
      <path d="M4 29c0-8 4.5-12.5 11-12.5S26 21 26 29z" />
    </g>
  );
}
