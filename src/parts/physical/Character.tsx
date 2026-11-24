/**
 * The two main characters, assembled from the layered Figma SVGs in
 * /public/characters/{female,male}/. Coordinates are Figma "Frame 39" coordinates
 * (node 293:6921) shifted so each character's frame starts at x = 0.
 *
 * Drawn in a local box: x 0–832, y 67–1381. The feet baseline is y = 1381 and the
 * horizontal center is x = 416 — use `feetTransform` to place a character by its feet.
 */
export type Who = "female" | "male";

export const CHARACTER_FEET = { x: 416, y: 1381 };
/** Chest position in character coordinates (for pain / heart marks). */
export const CHARACTER_CHEST = { x: 416, y: 650 };

// [file, node x, y, w, h, svg viewBox w, h]  — the SVG viewBox includes the 3.5px stroke bleed.
type Part = readonly [string, number, number, number, number, number, number];

const FEMALE_X0 = 91;
const MALE_X0 = 1037;

const FEMALE_BEFORE_GRID: Part[] = [
  ["hands", 91, 839, 832, 158, 839, 165],
  ["hair", 312, 67, 397, 354, 404, 361],
  ["shoes", 198.57, 1251, 617.69, 129.62, 624.69, 136.62],
  ["pants", 243, 833, 530, 418, 537, 425],
];
const FEMALE_AFTER_GRID: Part[] = [
  ["shirt", 126, 426, 764, 447, 771, 454],
  ["ears", 299, 282, 420, 64, 426, 70],
  ["face", 352, 141, 314, 316, 321, 323],
  ["bangs", 350, 127, 320, 160, 320, 160],
  ["features", 406, 258, 201, 133, 207, 139],
];
const MALE_BEFORE_GRID: Part[] = [
  ["hands", 1037, 839, 832, 158, 839, 165],
  ["shoes", 1144.57, 1251, 617.69, 129.62, 624.69, 136.62],
  ["pants", 1189, 833, 530, 418, 537, 425],
];
const MALE_AFTER_GRID: Part[] = [
  ["shirt", 1072, 426, 764, 447, 771, 454],
  ["ears", 1244, 282, 422, 64, 428, 70],
  ["face", 1293, 139, 324, 320, 331, 327],
  ["hair", 1294, 92, 324, 191, 331, 198],
  ["features", 1360, 257, 189, 134, 195, 140],
];

const PANTS_SHAPE = "M67 0H470L530 418H310L265 93L185 418H0L67 0Z";
const GRID_D = (() => {
  let d = "";
  for (let i = 0; i <= 44; i++) d += `M${2 + 12 * i} 0V422`;
  for (let j = 0; j <= 35; j++) d += `M0 ${2 + 12 * j}H534`;
  return d;
})();

function img(who: Who, [file, x, y, w, h, vw, vh]: Part, x0: number) {
  return (
    <image
      key={file}
      href={`/characters/${who}/${file}.svg`}
      x={x + w / 2 - vw / 2 - x0}
      y={y + h / 2 - vh / 2}
      width={vw}
      height={vh}
    />
  );
}

/** `smile` (male only) crossfades the features layer to the smiling face: eyebrows and mouth flipped upside down. */
export function Character({ who, tear = false, smile = false }: { who: Who; tear?: boolean; smile?: boolean }) {
  const female = who === "female";
  const x0 = female ? FEMALE_X0 : MALE_X0;
  const before = female ? FEMALE_BEFORE_GRID : MALE_BEFORE_GRID;
  const after = female ? FEMALE_AFTER_GRID : MALE_AFTER_GRID;
  // Pants checkered pattern: grid lines clipped to the pants shape (drawn as vectors so it stays crisp when small).
  const gx = (female ? 241 : 1187) - x0;
  const px = (female ? 243 : 1189) - x0;
  const clipId = `pants-clip-${who}`;

  return (
    <g>
      {before.map((p) => img(who, p, x0))}
      <clipPath id={clipId}>
        <path d={PANTS_SHAPE} transform={`translate(${px} 833)`} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <path
          d={GRID_D}
          transform={`translate(${gx} 831)`}
          fill="none"
          stroke={female ? "#BF5C46" : "#6A4C98"}
          strokeWidth={2.6}
        />
      </g>
      {after.map((p) =>
        !female && p[0] === "features" ? (
          <g key="features">
            <g style={{ opacity: smile ? 0 : 1, transition: "opacity 0.9s ease" }}>{img(who, p, x0)}</g>
            <g style={{ opacity: smile ? 1 : 0, transition: "opacity 0.9s ease" }}>
              {img(who, ["features-smile", ...p.slice(1)] as unknown as Part, x0)}
            </g>
          </g>
        ) : (
          img(who, p, x0)
        ),
      )}
      <g style={{ opacity: tear ? 1 : 0, transition: "opacity 0.5s ease" }}>
        {female ? (
          img("female", ["tear", 416, 337, 30, 51, 34, 55], x0)
        ) : (
          // The male tear is rotated −22.45° around the center of its box.
          <g transform={`rotate(-22.45 ${1534.6 - x0} 377.75)`}>
            {img("male", ["tear", 1519.6, 352.25, 30, 51, 34, 55], x0)}
          </g>
        )}
      </g>
    </g>
  );
}
