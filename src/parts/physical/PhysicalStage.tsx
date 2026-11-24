"use client";

import { useSyncExternalStore } from "react";
import { SourceNote } from "@/components";
import { Character, CHARACTER_CHEST, CHARACTER_FEET } from "./Character";
import { DISEASE_BURDEN_SHARE_WOMEN, IDENTIFIED, STEPS, THRESHOLD, TRIAL_SHARES, TROPONIN } from "./data";
import { Actor, Door, Heart, LabCard, MEN, Meter, Person, QuestionMark, TestTube, WOMEN, METER_K } from "./shapes";
import styles from "./physical.module.css";

const sans = { fontFamily: "var(--font-sans)" } as const;
const CHAR_SCALE = 0.3;
const FLOOR_Y = 800;

/** Step index → value. Every array has one entry per step (0–10). */
//                      0     1     2     3     4  5  6  7  8  9   10
const WOMAN_X = [930, 880, 1470, 880, 930, 930, 930, 930, 930, 930, 1100];
const MAN_X = [1250, 1330, 960, 1330, 1250, 1250, 1250, 1250, 1250, 1250, 1360];

const inSteps = (step: number, list: number[]) => list.includes(step);

function useNarrow() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(max-width: 900px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 900px)").matches,
    () => false,
  );
}

export function PhysicalStage({ step }: { step: number }) {
  const narrow = useNarrow();
  const showChars = step <= 3 || step === 10;
  const womanOp = !showChars ? 0 : step === 2 ? 0.22 : 1;
  const showCards = inSteps(step, [1, 3, 10]);
  const showMeters = inSteps(step, [4, 8]);
  const showGrid = inSteps(step, [5, 6, 7]);
  const smallGrid = step === 7;
  const source = STEPS[step]?.source;

  return (
    <>
      <svg
        className={styles.svg}
        viewBox={narrow ? "600 0 1000 900" : "0 0 1600 900"}
        preserveAspectRatio={narrow ? "xMidYMin meet" : "xMidYMid meet"}
        role="img"
        aria-label="Illustration for the Physical part of the story"
      >
        {/* ---------- scene 0–3, 10: the emergency room ---------- */}
        <g style={{ opacity: step === 0 ? 1 : 0, transition: "opacity 0.6s" }}>
          <text x={1090} y={150} fontSize={26} letterSpacing={8} textAnchor="middle" fill="var(--text-soft)" style={sans}>
            EMERGENCY ROOM
          </text>
          <TestTube x={WOMAN_X[0] + 165} y={520} />
          <TestTube x={MAN_X[0] + 165} y={520} />
        </g>

        {/* floor */}
        <line x1={640} x2={1560} y1={FLOOR_Y} y2={FLOOR_Y} stroke="var(--ink)" strokeWidth={1.5} opacity={showChars ? 1 : 0} style={{ transition: "opacity 0.6s" }} />

        {/* doors (steps 2, 4, 11 in the story) */}
        <g style={{ opacity: inSteps(step, [1, 3, 10]) ? 1 : 0, transition: "opacity 0.6s" }}>
          <Door x={700} label="EXIT" active={step !== 10} />
          <Door x={1530} label="TREATMENT" />
        </g>

        {/* step 2: split screen */}
        <g style={{ opacity: step === 2 ? 1 : 0, transition: "opacity 0.6s" }}>
          <line x1={1190} x2={1190} y1={150} y2={FLOOR_Y} stroke="var(--gray-400)" strokeWidth={1.5} strokeDasharray="6 6" />
          <text x={960} y={190} fontSize={16} letterSpacing={2} textAnchor="middle" fill="var(--text-soft)" style={sans}>
            RECOVERED
          </text>
          <text x={1400} y={190} fontSize={16} letterSpacing={2} textAnchor="middle" fill="var(--text-soft)" style={sans}>
            DID NOT RECOVER
          </text>
          {/* the empty chair */}
          <g stroke="var(--ink)" strokeWidth={4} strokeLinecap="round" fill="none">
            <path d="M1250 610V715H1330" />
            <path d="M1255 715V800M1325 715V800" />
          </g>
        </g>

        {/* characters */}
        <Actor x={WOMAN_X[step]} y={FLOOR_Y} scale={CHAR_SCALE} opacity={womanOp} grayscale={step === 2}>
          <g transform={`translate(${-CHARACTER_FEET.x} ${-CHARACTER_FEET.y})`}>
            <Character who="female" tear={inSteps(step, [1, 2, 3])} />
            <ChestPain show={step === 0} />
          </g>
        </Actor>
        <Actor x={MAN_X[step]} y={FLOOR_Y} scale={CHAR_SCALE} opacity={showChars ? 1 : 0}>
          <g transform={`translate(${-CHARACTER_FEET.x} ${-CHARACTER_FEET.y})`}>
            <Character who="male" />
            <ChestPain show={step === 0} />
          </g>
        </Actor>

        {/* lab cards above the characters */}
        <Actor x={WOMAN_X[step]} y={190} opacity={showCards ? 1 : 0}>
          <LabCard
            value={TROPONIN.woman}
            badge={step === 10 ? { text: `FLAGGED · ABOVE ${THRESHOLD.women}`, solid: true } : undefined}
          />
        </Actor>
        <Actor x={MAN_X[step]} y={190} opacity={showCards ? 1 : 0}>
          <LabCard
            value={TROPONIN.man}
            badge={step === 10 ? { text: `FLAGGED · ABOVE ${THRESHOLD.men}`, solid: true } : undefined}
          />
        </Actor>
        <g style={{ opacity: step === 3 ? 1 : 0, transition: "opacity 0.6s 0.4s" }}>
          <QuestionMark x={1105} y={560} />
        </g>

        {/* ---------- step 4 / 8: troponin meters and the single threshold ---------- */}
        <g style={{ opacity: showMeters ? 1 : 0, transition: "opacity 0.6s" }}>
          {/* beat 1: cracked heart leaking into the blood */}
          <g className={step === 4 ? styles.beat1 : undefined} style={{ opacity: step === 4 ? undefined : 0 }}>
            <g transform="translate(770 330)">
              <Heart size={220} fill="#c4161c" />
              <path d="M-6 -75 L16 -35 L-10 -5 L14 30" fill="none" stroke="var(--ink)" strokeWidth={4} strokeLinejoin="round" />
            </g>
            <rect x={650} y={500} width={240} height={46} rx={23} fill="#f7d9d9" stroke="var(--ink)" strokeWidth={1.5} />
            {[722, 752, 782, 812].map((x, i) => (
              <circle
                key={x}
                cx={x}
                cy={430}
                r={6}
                fill="var(--ink)"
                className={step === 4 ? styles.leak : undefined}
                style={{ animationDelay: `${i * 0.5}s` }}
              />
            ))}
            <text x={770} y={585} fontSize={16} textAnchor="middle" fill="var(--text-soft)" style={sans}>
              troponin leaks into the blood
            </text>
          </g>

          {/* beat 2: level bar */}
          <g className={step === 4 ? styles.beat2 : undefined} style={{ opacity: step === 4 ? undefined : 0 }}>
            <path d="M953 222l12 18h-24z" fill="var(--ink)" />
            <rect x={930} y={250} width={46} height={310} rx={8} fill="#fff" stroke="var(--ink)" strokeWidth={1.5} />
            <rect x={930} y={350} width={46} height={210} rx={8} fill="var(--gray-600)" className={step === 4 ? styles.rise : undefined} />
            <text x={953} y={625} fontSize={16} textAnchor="middle" fill="var(--text-soft)" style={sans}>
              higher = more damage
            </text>
          </g>

          {/* beat 3: one line for everyone */}
          <g className={step === 4 ? styles.beat3 : undefined}>
            <g transform="translate(1190 620)">
              <Meter value={TROPONIN.woman} color={WOMEN} label="Woman" />
            </g>
            <g transform="translate(1410 620)">
              <Meter value={TROPONIN.man} color={MEN} label="Man" />
            </g>
            <line
              x1={1100}
              x2={1500}
              y1={620 - THRESHOLD.single * METER_K}
              y2={620 - THRESHOLD.single * METER_K}
              stroke="var(--ink)"
              strokeWidth={2.5}
              strokeDasharray="10 6"
            />
            <text x={1100} y={620 - THRESHOLD.single * METER_K - 10} fontSize={18} fontWeight={700} fill="var(--ink)" style={sans}>
              {THRESHOLD.single} ng/L
            </text>
            <Badge x={1410} y={185} text="FLAGGED" solid />
            <Badge x={1190} y={185} text={step === 8 ? "NORMAL?" : "NORMAL"} />
          </g>
          <g style={{ opacity: step === 8 ? 1 : 0, transition: "opacity 0.6s 0.4s" }}>
            <QuestionMark x={1190} y={150} size={100} />
          </g>
        </g>

        {/* ---------- steps 5–7: the 100 participants ---------- */}
        <Actor x={smallGrid ? 640 : 850} y={smallGrid ? 290 : 200} scale={smallGrid ? 0.42 : 1} opacity={showGrid ? 1 : 0}>
          {Array.from({ length: 100 }, (_, i) => {
            const isWoman = (i * 37) % 100 < 20; // scattered, deterministic: exactly 20 of 100
            const fill = step === 5 ? "var(--gray-400)" : isWoman ? WOMEN : MEN;
            return <Person key={i} x={(i % 10) * 50} y={Math.floor(i / 10) * 50} fill={fill} />;
          })}
        </Actor>
        <g style={{ opacity: step === 5 ? 1 : 0, transition: "opacity 0.6s" }}>
          <text x={1090} y={745} fontSize={20} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
            1986–1990 · 32 major cardiovascular trials
          </text>
          <text x={1090} y={775} fontSize={17} textAnchor="middle" fill="var(--text-soft)" style={sans}>
            Each icon = 1 of 100 participants in an average trial
          </text>
        </g>
        <g style={{ opacity: step === 6 ? 1 : 0, transition: "opacity 0.6s 0.3s" }}>
          <text x={1090} y={765} fontSize={34} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
            <tspan fill={WOMEN}>20 women</tspan> : <tspan fill={MEN}>80 men</tspan>
          </text>
        </g>
        <g style={{ opacity: step === 7 ? 1 : 0, transition: "opacity 0.6s 0.4s" }}>
          <text x={745} y={535} fontSize={15} textAnchor="middle" fill="var(--text-soft)" style={sans}>
            1986–90 average trial
          </text>
          <text x={745} y={557} fontSize={15} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
            20 women : 80 men
          </text>
        </g>

        {/* ---------- steps 7–8: women’s share over eight periods ---------- */}
        <Actor opacity={step === 7 ? 1 : step === 8 ? 0.12 : 0}>
          <TrialChart animate={step === 7} />
        </Actor>

        {/* ---------- step 9: before / after sex-specific thresholds ---------- */}
        <Actor opacity={step === 9 ? 1 : 0}>
          <BeforeAfterChart animate={step === 9} />
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

function Badge({ x, y, text, solid }: { x: number; y: number; text: string; solid?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-62} y={-20} width={124} height={30} rx={15} fill={solid ? "var(--ink)" : "#fff"} stroke="var(--ink)" strokeWidth={1.2} />
      <text x={0} y={0} fontSize={13} letterSpacing={1} textAnchor="middle" fill={solid ? "#fff" : "var(--ink)"} style={sans}>
        {text}
      </text>
    </g>
  );
}

const CH = { x0: 900, base: 640, barW: 55, step: 77, k: 8.4 }; // k = px per percentage point (0–50%)

function TrialChart({ animate }: { animate: boolean }) {
  const ticks = [0, 10, 20, 30, 40, 50];
  const refY = CH.base - DISEASE_BURDEN_SHARE_WOMEN * CH.k;
  return (
    <g>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={CH.x0 - 15} x2={1530} y1={CH.base - t * CH.k} y2={CH.base - t * CH.k} stroke={t === 0 ? "var(--ink)" : "var(--gray-200)"} strokeWidth={t === 0 ? 1.5 : 1} />
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
      <line x1={CH.x0 - 5} x2={1530} y1={refY} y2={refY} stroke={WOMEN} strokeWidth={2} strokeDasharray="8 6" />
      <text x={1530} y={refY - 10} fontSize={15} textAnchor="end" fill="var(--ink)" style={sans}>
        <tspan fontWeight={700} fill={WOMEN}>
          {DISEASE_BURDEN_SHARE_WOMEN}%
        </tspan>{" "}
        Women’s share of cardiovascular disease burden
      </text>
      <text x={CH.x0 - 24} y={190} fontSize={18} fontWeight={700} fill="var(--ink)" opacity={animate ? 1 : 0} style={sans}>
        Women’s share of participants, average trial
      </text>
    </g>
  );
}

const BA = { base: 660, k: 0.14, w: 95 };

function BeforeAfterChart({ animate }: { animate: boolean }) {
  const fmt = (n: number) => n.toLocaleString("en-US");
  const groups = [
    { name: "WOMEN", cx: 932, color: WOMEN, light: "var(--women-300)", d: IDENTIFIED.women, chip: "+401 (+25%)", range: `${THRESHOLD.single} → ${THRESHOLD.women} ng/L` },
    { name: "MEN", cx: 1327, color: MEN, light: "var(--men-300)", d: IDENTIFIED.men, chip: "+114 (+4%)", range: `${THRESHOLD.single} → ${THRESHOLD.men} ng/L` },
  ];
  return (
    <g>
      <text x={1130} y={150} fontSize={20} fontWeight={700} textAnchor="middle" fill="var(--ink)" style={sans}>
        Type 1 heart attacks identified
      </text>
      <line x1={790} x2={1470} y1={BA.base} y2={BA.base} stroke="var(--ink)" strokeWidth={1.5} />
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
            <text x={g.cx + 6 + BA.w / 2} y={BA.base - g.d.after * BA.k - 44} fontSize={20} fontWeight={700} textAnchor="middle" fill={g.color} style={sans}>
              {g.chip}
            </text>
            <text x={g.cx} y={BA.base + 54} fontSize={18} fontWeight={700} letterSpacing={2} textAnchor="middle" fill="var(--ink)" style={sans}>
              {g.name}
            </text>
            <text x={g.cx} y={BA.base + 78} fontSize={15} textAnchor="middle" fill="var(--text-soft)" style={sans}>
              threshold {g.range}
            </text>
          </g>
        );
      })}
    </g>
  );
}
