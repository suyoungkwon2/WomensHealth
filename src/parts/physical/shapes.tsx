import type { CSSProperties, ReactNode } from "react";
import styles from "./physical.module.css";

/** Outline width for every shape, in drawing units (the 1600 × 900 stage). Always black (`--ink`). */
export const SW = 2;
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
  rotate = 0,
  slow = false,
  opacity = 1,
  grayscale = false,
  delay = 0,
  fadeDelay = 0,
  children,
}: {
  x?: number;
  y?: number;
  scale?: number;
  /** Degrees, around the group origin (the feet for characters). */
  rotate?: number;
  /** Slow, gentle entrance (used by the “recovered / did not recover” scene). */
  slow?: boolean;
  opacity?: number;
  grayscale?: boolean;
  /** Seconds to wait before moving (used to stagger the intro). */
  delay?: number;
  /** Seconds to wait before fading (opacity changes). */
  fadeDelay?: number;
  children: ReactNode;
}) {
  return (
    <g
      className={styles.actor}
      style={{
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`,
        transitionDuration: slow ? "2.4s, 1.8s, 0.6s" : undefined,
        opacity,
        filter: grayscale ? "grayscale(1)" : undefined,
        transitionDelay: delay || fadeDelay ? `${delay}s, ${fadeDelay}s, 0s` : undefined,
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
      <rect x={-100} y={0} width={200} height={118} rx={14} fill="#fff" stroke="var(--ink)" strokeWidth={SW} />
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
            strokeWidth={SW}
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

/** Vertical level meter: 0–60 ng/L, base at y = 0 (grows upward), centered on x = 0. */
export const METER_K = 4.2; // px per ng/L
export function Meter({ value, color, label }: { value: number; color: string; label: string }) {
  const h = value * METER_K;
  return (
    <g>
      <rect x={-70} y={-60 * METER_K} width={140} height={60 * METER_K} rx={10} fill="#fff" stroke="var(--ink)" strokeWidth={SW} />
      <rect x={-70} y={-h} width={140} height={h} rx={10} fill={color} stroke="var(--ink)" strokeWidth={SW} />
      <text x={0} y={-h - 12} fontSize={30} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
        {value}
      </text>
      <text x={0} y={34} fontSize={20} textAnchor="middle" fill="var(--ink)" style={sans}>
        {label}
      </text>
    </g>
  );
}

/** Door standing on the floor line `floorY`. `hospital` adds a red cross sign (the treatment room). */
export function Door({
  x,
  floorY,
  label,
  active = true,
  hospital = false,
}: {
  x: number;
  floorY: number;
  label: string;
  active?: boolean;
  hospital?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${floorY - 210})`} opacity={active ? 1 : 0.35}>
      <rect x={-45} y={0} width={90} height={210} rx={4} fill="var(--gray-100)" stroke="var(--ink)" strokeWidth={SW} />
      <circle cx={25} cy={120} r={5} fill="var(--ink)" />
      {hospital && (
        <g transform="translate(0 52)">
          <rect x={-24} y={-24} width={48} height={48} rx={8} fill="#c4161c" />
          <rect x={-5} y={-16} width={10} height={32} fill="#fff" />
          <rect x={-16} y={-5} width={32} height={10} fill="#fff" />
        </g>
      )}
      <text x={0} y={-20} fontSize={15} letterSpacing={1.5} textAnchor="middle" fill="var(--ink)" style={sans}>
        {label}
      </text>
    </g>
  );
}

const TUBE_BODY = "M-20 14H20V128A20 20 0 0 1 -20 128Z";
const TUBE_BLOOD = "M-20 24H20V128A20 20 0 0 1 -20 128Z";
const BAR = { top: 54, bottom: 110 }; // sticker bar track (local units), 0–60 ng/L
const BAR_K = (BAR.bottom - BAR.top) / 60;

/**
 * Blood test tube with a sticker. Local units: tube is 44 wide, 148 tall, centered on x = 0, top at y = 0.
 * The sticker shows the troponin value as a bar graph plus number and unit.
 * `showContent` fades the sticker text in; `animate` makes the bar grow (use right after the tube enlarges).
 */
export function StickerTube({
  value,
  color,
  showContent,
  animate,
  strokePx,
}: {
  value: number;
  color: string;
  showContent: boolean;
  animate: boolean;
  /** Outline width in screen pixels. The tube is scaled, so it uses non-scaling strokes to keep the stage-wide outline width. */
  strokePx: number;
}) {
  const ns = { vectorEffect: "non-scaling-stroke", strokeWidth: strokePx } as const;
  const h = value * BAR_K;
  return (
    <g>
      <rect x={-22} y={0} width={44} height={14} rx={3} fill="var(--gray-600)" />
      <path d={TUBE_BODY} fill="#fff" />
      <path d={TUBE_BLOOD} fill="#c4161c" />
      <path d={TUBE_BODY} fill="none" stroke="var(--ink)" {...ns} />
      <rect x={-21} y={34} width={42} height={84} rx={2.5} fill="#fff" stroke="var(--ink)" {...ns} />
      <g style={{ opacity: showContent ? 1 : 0, transition: "opacity 0.4s" }}>
        <g className={animate ? styles.late : undefined}>
          <g transform="translate(-14 46)" style={{ color: "var(--ink)" }}>
            <Heart size={7} />
          </g>
          <text x={-9} y={48.2} fontSize={5} letterSpacing={0.5} fill="var(--text-soft)" style={sans}>
            TROPONIN
          </text>
          {[0, 20, 40, 60].map((t) => (
            <line key={t} x1={-3} x2={-0.5} y1={BAR.bottom - t * BAR_K} y2={BAR.bottom - t * BAR_K} stroke="var(--text-soft)" strokeWidth={0.5} />
          ))}
          <text x={1.5} y={89} fontSize={13} fontWeight={700} fill="var(--ink)" style={sans}>
            {value}
          </text>
          <text x={2} y={98} fontSize={5.5} fill="var(--text-soft)" style={sans}>
            ng/L
          </text>
        </g>
        <rect x={-15} y={BAR.top} width={12} height={BAR.bottom - BAR.top} fill="var(--gray-100)" stroke="var(--ink)" {...ns} />
        <rect
          x={-15}
          y={BAR.bottom - h}
          width={12}
          height={h}
          fill={color}
          stroke="var(--ink)"
          {...ns}
          className={animate ? styles.grow : undefined}
          style={{ animationDelay: "1s" }}
        />
      </g>
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
