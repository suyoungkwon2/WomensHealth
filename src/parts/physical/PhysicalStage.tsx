"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { SourceNote } from "@/components";
import { Character, CHARACTER_CHEST, CHARACTER_FEET } from "./Character";
import { DISEASE_BURDEN_SHARE_WOMEN, IDENTIFIED, STEPS, THRESHOLD, TRIAL_SHARES, TROPONIN } from "./data";
import { Actor, Door, Heart, LabCard, MEN, Meter, METER_K, Person, QuestionMark, StickerTube, WOMEN } from "./shapes";
import styles from "./physical.module.css";

/**
 * The graphic fills the whole stage as a background; the text card (TextOverlay)
 * scrolls up over its lower part. Everything is drawn in a 1600 × 900 box, centered on x = 800.
 * Keep the important parts above y ≈ 480 so the card does not hide them; parts below
 * (legs, floor, bar bases) may sit behind the translucent card.
 */
const sans = { fontFamily: "var(--font-sans)" } as const;
const CX = 800;
const CHAR_SCALE = 0.38;
const FLOOR_Y = 740;
const CARD_Y = 60;

/** Names for the scroll steps (same order as STEPS in data.ts). */
const S = {
  ARRIVE: 0, //  man and woman arrive, blood tubes
  TUBE: 1, //    tubes zoom in, sticker bar graphs draw the troponin level
  CUTOFF: 2, //  the 40 ng/L line: man above, woman below
  DOORS: 3, //   doors appear; man → treatment, woman → exit, both disappear
  OUTCOME: 4, // split screen: recovered / did not recover
  WHY: 5, //     freeze the tubes, big question mark
  METERS: 6, //  what is troponin + one threshold
  GRID_GRAY: 7, // 100 participants
  GRID_COLOR: 8, // 20 women : 80 men
  TREND: 9, //   eight periods
  RECAP: 10, //  does one number fit everyone?
  ADJUST: 11, // before / after sex-specific thresholds
  REWIND: 12, // rewind: she is caught and treated
} as const;

// Man always on the left, woman always on the right. Treatment room = left door, exit = right door.
//                 0    1    2    3    4    5    6    7    8    9   10   11   12
const MAN_X = [560, 560, 560, 560, 520, 560, 560, 560, 560, 560, 560, 560, 480];
const WOMAN_X = [1040, 1040, 1040, 1040, 1180, 1040, 1040, 1040, 1040, 1040, 1040, 1040, 800];
const DOOR_LEFT = 170;
const DOOR_RIGHT = 1430;

// Blood tubes: small beside the characters on step 0, enlarged on steps 1–2 and 5.
const TUBE_BIG = { scale: 3, y: 100, manX: 560, womanX: 1040 };
const CUTOFF_LINE_Y = TUBE_BIG.y + (110 - 40 * ((110 - 54) / 60)) * TUBE_BIG.scale; // where 40 ng/L sits on the sticker bars

const inSteps = (step: number, list: number[]) => list.includes(step);
const fade = (on: boolean, delay = 0): React.CSSProperties => ({
  opacity: on ? 1 : 0,
  transition: `opacity 0.6s ${on ? delay : 0}s`,
});

/** Phones: crop the box to its middle so the graphic stays readable. */
function useNarrow() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(max-width: 700px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 700px)").matches,
    () => false,
  );
}

export function PhysicalStage({ step }: { step: number }) {
  const narrow = useNarrow();
  // Intro: on first load the characters start below the screen and rise into place.
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setArrived(true), 80);
    return () => clearTimeout(t);
  }, []);
  const intro = step === S.ARRIVE && arrived; // parts of the first scene that fade in after the characters arrive
  const riseY = step === S.ARRIVE && !arrived ? 700 : 0;

  // Doors scene: characters first show up, then walk into their doors and disappear.
  const [walkReady, setWalkReady] = useState(false);
  useEffect(() => {
    if (step !== S.DOORS) return;
    const t = setTimeout(() => setWalkReady(true), 1100);
    return () => {
      clearTimeout(t);
      setWalkReady(false);
    };
  }, [step]);
  const walking = step === S.DOORS && walkReady;

  const manVisible = inSteps(step, [S.ARRIVE, S.OUTCOME, S.REWIND]) || (step === S.DOORS && !walking);
  const womanOp = inSteps(step, [S.ARRIVE, S.REWIND]) || (step === S.DOORS && !walking) ? 1 : step === S.OUTCOME ? 0.22 : 0;
  const manX = walking ? DOOR_LEFT : MAN_X[step];
  const womanX = walking ? DOOR_RIGHT : WOMAN_X[step];
  const showFloor = inSteps(step, [S.ARRIVE, S.DOORS, S.OUTCOME, S.REWIND]);
  const showCards = step === S.REWIND;
  const showMeters = inSteps(step, [S.METERS, S.RECAP]);
  const showGrid = inSteps(step, [S.GRID_GRAY, S.GRID_COLOR, S.TREND]);
  const smallGrid = step === S.TREND;
  const tubesBig = step !== S.ARRIVE;
  const tubesOn = step === S.ARRIVE ? intro : inSteps(step, [S.TUBE, S.CUTOFF, S.WHY]);
  const source = STEPS[step]?.source;

  return (
    <>
      <svg
        className={styles.svg}
        viewBox={narrow ? "230 0 1140 900" : "0 0 1600 900"}
        preserveAspectRatio={narrow ? "xMidYMin meet" : "xMidYMid meet"}
        role="img"
        aria-label="Illustration for the Physical part of the story"
      >
        {/* ---------- scene 1: the emergency room ---------- */}
        <g style={fade(intro, 1)}>
          <text x={CX} y={140} fontSize={28} letterSpacing={9} textAnchor="middle" fill="var(--text-soft)" style={sans}>
            EMERGENCY ROOM
          </text>
        </g>

        <line x1={100} x2={1500} y1={FLOOR_Y} y2={FLOOR_Y} stroke="var(--ink)" strokeWidth={1.5} style={fade(showFloor)} />

        {/* doors (steps 4 and 13): treatment room has a hospital cross */}
        <g style={fade(inSteps(step, [S.DOORS, S.REWIND]))}>
          <Door x={DOOR_LEFT} floorY={FLOOR_Y} label="TREATMENT" hospital />
          <Door x={DOOR_RIGHT} floorY={FLOOR_Y} label="EXIT" active={step !== S.REWIND} />
        </g>

        {/* split screen: recovered vs. did not recover */}
        <g style={fade(step === S.OUTCOME)}>
          <line x1={CX} x2={CX} y1={100} y2={FLOOR_Y} stroke="var(--gray-400)" strokeWidth={1.5} strokeDasharray="6 6" />
          <text x={520} y={130} fontSize={17} letterSpacing={2.5} textAnchor="middle" fill="var(--text-soft)" style={sans}>
            RECOVERED
          </text>
          <text x={1180} y={130} fontSize={17} letterSpacing={2.5} textAnchor="middle" fill="var(--text-soft)" style={sans}>
            DID NOT RECOVER
          </text>
          <g stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" fill="none">
            <path d="M960 560V650H1040" />
            <path d="M965 650V740M1035 650V740" />
          </g>
        </g>

        {/* characters */}
        <Actor
          x={womanX}
          y={FLOOR_Y + riseY}
          scale={CHAR_SCALE}
          opacity={womanOp}
          grayscale={step === S.OUTCOME}
          delay={step === S.ARRIVE ? 0.2 : 0}
          fadeDelay={walking ? 0.6 : 0}
        >
          <g transform={`translate(${-CHARACTER_FEET.x} ${-CHARACTER_FEET.y})`}>
            <Character who="female" tear={inSteps(step, [S.DOORS, S.OUTCOME])} />
            <ChestPain show={intro} />
          </g>
        </Actor>
        <Actor x={manX} y={FLOOR_Y + riseY} scale={CHAR_SCALE} opacity={manVisible ? 1 : 0} fadeDelay={walking ? 0.6 : 0}>
          <g transform={`translate(${-CHARACTER_FEET.x} ${-CHARACTER_FEET.y})`}>
            <Character who="male" />
            <ChestPain show={intro} />
          </g>
        </Actor>

        {/* ---------- steps 1–3, 6: blood tubes with troponin stickers ---------- */}
        <Actor
          x={tubesBig ? TUBE_BIG.manX : MAN_X[0] + 215}
          y={tubesBig ? TUBE_BIG.y : 420}
          scale={tubesBig ? TUBE_BIG.scale : 0.55}
          opacity={tubesOn ? 1 : 0}
          fadeDelay={step === S.ARRIVE ? 1 : 0}
        >
          <StickerTube value={TROPONIN.man} color={MEN} showContent={step !== S.ARRIVE} animate={step === S.TUBE} />
        </Actor>
        <Actor
          x={tubesBig ? TUBE_BIG.womanX : WOMAN_X[0] + 215}
          y={tubesBig ? TUBE_BIG.y : 420}
          scale={tubesBig ? TUBE_BIG.scale : 0.55}
          opacity={tubesOn ? 1 : 0}
          fadeDelay={step === S.ARRIVE ? 1 : 0}
        >
          <StickerTube value={TROPONIN.woman} color={WOMEN} showContent={step !== S.ARRIVE} animate={step === S.TUBE} />
        </Actor>
        {/* the 40 ng/L cutoff across both stickers */}
        <g style={fade(inSteps(step, [S.CUTOFF, S.WHY]), 0.3)}>
          <line x1={330} x2={1270} y1={CUTOFF_LINE_Y} y2={CUTOFF_LINE_Y} stroke="var(--ink)" strokeWidth={2.5} strokeDasharray="10 6" />
          <text x={CX} y={CUTOFF_LINE_Y - 12} fontSize={18} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
            {THRESHOLD.single} ng/L cutoff
          </text>
        </g>
        <g style={fade(step === S.CUTOFF, 0.6)}>
          <Badge x={TUBE_BIG.manX} y={70} text="ABOVE 40 · HIGH RISK" solid width={200} />
          <Badge x={TUBE_BIG.womanX} y={70} text="BELOW 40" width={200} />
        </g>
        <g style={fade(step === S.WHY, 0.4)}>
          <QuestionMark x={CX} y={530} size={190} />
        </g>

        {/* lab cards over the characters (rewind scene) */}
        <Actor x={womanX} y={CARD_Y} opacity={showCards ? 1 : 0}>
          <LabCard value={TROPONIN.woman} badge={{ text: `FLAGGED · ABOVE ${THRESHOLD.women}`, solid: true }} />
        </Actor>
        <Actor x={manX} y={CARD_Y} opacity={showCards ? 1 : 0}>
          <LabCard value={TROPONIN.man} badge={{ text: `FLAGGED · ABOVE ${THRESHOLD.men}`, solid: true }} />
        </Actor>

        {/* ---------- steps 7 / 11: troponin meters and the single threshold ---------- */}
        <g style={fade(showMeters)}>
          <g transform="translate(0 -40)">
            {/* beat 1: cracked heart leaking into the blood */}
            <g className={step === S.METERS ? styles.beat1 : undefined} style={{ opacity: step === S.METERS ? undefined : 0 }}>
              <g transform="translate(340 240)">
                <Heart size={190} fill="#c4161c" />
                <path d="M-5 -65 L14 -30 L-9 -4 L12 26" fill="none" stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
              </g>
              <rect x={220} y={385} width={240} height={40} rx={20} fill="#f7d9d9" stroke="var(--ink)" strokeWidth={1.5} />
              {[292, 322, 352, 382].map((x, i) => (
                <circle
                  key={x}
                  cx={x}
                  cy={345}
                  r={6}
                  fill="var(--ink)"
                  className={step === S.METERS ? styles.leak : undefined}
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
              ))}
              <text x={340} y={455} fontSize={16} textAnchor="middle" fill="var(--text-soft)" style={sans}>
                troponin leaks into the blood
              </text>
            </g>

            {/* beat 2: level bar */}
            <g className={step === S.METERS ? styles.beat2 : undefined} style={{ opacity: step === S.METERS ? undefined : 0 }}>
              <path d="M590 130l12 18h-24z" fill="var(--ink)" />
              <rect x={567} y={158} width={46} height={262} rx={8} fill="#fff" stroke="var(--ink)" strokeWidth={1.5} />
              <rect x={567} y={250} width={46} height={170} rx={8} fill="var(--gray-600)" className={step === S.METERS ? styles.rise : undefined} />
              <text x={590} y={455} fontSize={16} textAnchor="middle" fill="var(--text-soft)" style={sans}>
                higher = more damage
              </text>
            </g>

            {/* beat 3: one line for everyone */}
            <g className={step === S.METERS ? styles.beat3 : undefined}>
              <g transform="translate(900 440)">
                <Meter value={TROPONIN.man} color={MEN} label="Man" />
              </g>
              <g transform="translate(1150 440)">
                <Meter value={TROPONIN.woman} color={WOMEN} label="Woman" />
              </g>
              <line
                x1={800}
                x2={1250}
                y1={440 - THRESHOLD.single * METER_K}
                y2={440 - THRESHOLD.single * METER_K}
                stroke="var(--ink)"
                strokeWidth={2.5}
                strokeDasharray="10 6"
              />
              <text x={800} y={440 - THRESHOLD.single * METER_K - 10} fontSize={18} fontWeight={700} fill="var(--ink)" style={sans}>
                {THRESHOLD.single} ng/L
              </text>
              <Badge x={900} y={165} text="FLAGGED" solid />
              <Badge x={1150} y={165} text={step === S.RECAP ? "NORMAL?" : "NORMAL"} />
            </g>
            <g style={fade(step === S.RECAP, 0.4)}>
              <QuestionMark x={1150} y={135} size={90} />
            </g>
          </g>
        </g>

        {/* ---------- steps 8–10: the 100 participants ---------- */}
        <Actor x={smallGrid ? 290 : 587} y={smallGrid ? 230 : 80} scale={smallGrid ? 0.42 : 1} opacity={showGrid ? 1 : 0}>
          {Array.from({ length: 100 }, (_, i) => {
            const isWoman = (i * 37) % 100 < 20; // scattered, deterministic: exactly 20 of 100
            const fill = step === S.GRID_GRAY ? "var(--gray-400)" : isWoman ? WOMEN : MEN;
            return <Person key={i} x={(i % 10) * 44} y={Math.floor(i / 10) * 44} fill={fill} />;
          })}
        </Actor>
        <g style={fade(step === S.GRID_GRAY)}>
          <text x={CX} y={538} fontSize={20} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
            1986–1990 · 32 major cardiovascular trials
          </text>
          <text x={CX} y={566} fontSize={17} textAnchor="middle" fill="var(--text-soft)" style={sans}>
            Each icon = 1 of 100 participants in an average trial
          </text>
        </g>
        <g style={fade(step === S.GRID_COLOR, 0.3)}>
          <text x={CX} y={555} fontSize={34} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
            <tspan fill={WOMEN}>20 women</tspan> : <tspan fill={MEN}>80 men</tspan>
          </text>
        </g>
        <g style={fade(step === S.TREND, 0.4)}>
          <text x={380} y={445} fontSize={15} textAnchor="middle" fill="var(--text-soft)" style={sans}>
            1986–90 average trial
          </text>
          <text x={380} y={467} fontSize={15} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
            20 women : 80 men
          </text>
        </g>

        {/* ---------- steps 10–11: women’s share over eight periods ---------- */}
        <Actor opacity={step === S.TREND ? 1 : step === S.RECAP ? 0.12 : 0}>
          <TrialChart animate={step === S.TREND} />
        </Actor>

        {/* ---------- step 12: before / after sex-specific thresholds ---------- */}
        <Actor opacity={step === S.ADJUST ? 1 : 0}>
          <BeforeAfterChart animate={step === S.ADJUST} />
        </Actor>
      </svg>
      {source && <SourceNote>{source}</SourceNote>}
    </>
  );
}

function ChestPain({ show }: { show: boolean }) {
  return (
    <g transform={`translate(${CHARACTER_CHEST.x} ${CHARACTER_CHEST.y})`} style={{ opacity: show ? 1 : 0, transition: "opacity 0.5s" }}>
      <g className={show ? styles.pulse : undefined}>
        <Heart size={130} fill="#fff" />
      </g>
    </g>
  );
}

function Badge({ x, y, text, solid, width = 124 }: { x: number; y: number; text: string; solid?: boolean; width?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-width / 2} y={-20} width={width} height={30} rx={15} fill={solid ? "var(--ink)" : "#fff"} stroke="var(--ink)" strokeWidth={1.2} />
      <text x={0} y={0} fontSize={13} letterSpacing={1} textAnchor="middle" fill={solid ? "#fff" : "var(--ink)"} style={sans}>
        {text}
      </text>
    </g>
  );
}

const CH = { x0: 640, base: 520, barW: 58, step: 84, k: 7.2 }; // k = px per percentage point (0–50%)
const CH_RIGHT = CH.x0 + 7 * CH.step + CH.barW + 20;

function TrialChart({ animate }: { animate: boolean }) {
  const ticks = [0, 10, 20, 30, 40, 50];
  const refY = CH.base - DISEASE_BURDEN_SHARE_WOMEN * CH.k;
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={CH.x0 - 15} x2={CH_RIGHT} y1={CH.base - t * CH.k} y2={CH.base - t * CH.k} stroke={t === 0 ? "var(--ink)" : "var(--gray-200)"} strokeWidth={t === 0 ? 1.5 : 1} />
          <text x={CH.x0 - 24} y={CH.base - t * CH.k + 5} fontSize={15} textAnchor="end" fill="var(--text-soft)" style={sans}>
            {t}%
          </text>
        </g>
      ))}
      {TRIAL_SHARES.map((d, i) => {
        const x = CH.x0 + i * CH.step;
        const h = d.value * CH.k;
        return (
          <g key={d.period}>
            <rect
              x={x}
              y={CH.base - h}
              width={CH.barW}
              height={h}
              fill={WOMEN}
              stroke="var(--ink)"
              strokeWidth={1.4}
              className={animate ? styles.grow : undefined}
              style={{ animationDelay: `${0.5 + i * 0.25}s` }}
            />
            <text x={x + CH.barW / 2} y={CH.base - h - 8} fontSize={16} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
              {d.value.toFixed(1)}
            </text>
            <text x={x + CH.barW / 2} y={CH.base + 24} fontSize={14} textAnchor="middle" fill="var(--ink)" style={sans}>
              {d.period}
            </text>
          </g>
        );
      })}
      <line x1={CH.x0 - 5} x2={CH_RIGHT} y1={refY} y2={refY} stroke={WOMEN} strokeWidth={2} strokeDasharray="8 6" />
      <text x={CH_RIGHT} y={refY - 10} fontSize={15} textAnchor="end" fill="var(--ink)" style={sans}>
        <tspan fontWeight={700} fill={WOMEN}>
          {DISEASE_BURDEN_SHARE_WOMEN}%
        </tspan>{" "}
        Women’s share of cardiovascular disease burden
      </text>
      <text x={CX} y={110} fontSize={20} fontWeight={700} textAnchor="middle" fill="var(--ink)" opacity={animate ? 1 : 0} style={sans}>
        Women’s share of participants, average trial
      </text>
    </g>
  );
}

const BA = { base: 470, k: 0.09, w: 100 };

function BeforeAfterChart({ animate }: { animate: boolean }) {
  const fmt = (n: number) => n.toLocaleString("en-US");
  const groups = [
    { name: "MEN", cx: 560, color: MEN, light: "var(--men-300)", d: IDENTIFIED.men, chip: "+114 (+4%)", range: `${THRESHOLD.single} → ${THRESHOLD.men} ng/L` },
    { name: "WOMEN", cx: 1040, color: WOMEN, light: "var(--women-300)", d: IDENTIFIED.women, chip: "+401 (+25%)", range: `${THRESHOLD.single} → ${THRESHOLD.women} ng/L` },
  ];
  return (
    <g>
      <text x={CX} y={100} fontSize={22} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
        Type 1 heart attacks identified
      </text>
      <line x1={380} x2={1220} y1={BA.base} y2={BA.base} stroke="var(--ink)" strokeWidth={1.5} />
      {groups.map((g) => {
        const bars = [
          { x: g.cx - BA.w - 6, v: g.d.before, fill: g.light, label: "Before" },
          { x: g.cx + 6, v: g.d.after, fill: g.color, label: "After" },
        ];
        return (
          <g key={g.name}>
            {bars.map((b, i) => (
              <g key={b.label}>
                <rect
                  x={b.x}
                  y={BA.base - b.v * BA.k}
                  width={BA.w}
                  height={b.v * BA.k}
                  fill={b.fill}
                  stroke="var(--ink)"
                  strokeWidth={1.4}
                  className={animate ? styles.grow : undefined}
                  style={{ animationDelay: `${i * 0.6}s` }}
                />
                <text x={b.x + BA.w / 2} y={BA.base - b.v * BA.k - 10} fontSize={17} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
                  {fmt(b.v)}
                </text>
                <text x={b.x + BA.w / 2} y={BA.base + 22} fontSize={14} textAnchor="middle" fill="var(--text-soft)" style={sans}>
                  {b.label}
                </text>
              </g>
            ))}
            <text x={g.cx + 6 + BA.w / 2} y={BA.base - g.d.after * BA.k - 42} fontSize={21} fontWeight={700} textAnchor="middle" fill={g.color} style={sans}>
              {g.chip}
            </text>
            <text x={g.cx} y={BA.base + 52} fontSize={18} fontWeight={700} letterSpacing={2} textAnchor="middle" fill="var(--ink)" style={sans}>
              {g.name}
            </text>
            <text x={g.cx} y={BA.base + 76} fontSize={15} textAnchor="middle" fill="var(--text-soft)" style={sans}>
              threshold {g.range}
            </text>
          </g>
        );
      })}
    </g>
  );
}
