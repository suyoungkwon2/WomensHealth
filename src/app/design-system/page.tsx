import { TextOverlay } from "@/components";

const scales = {
  Women: ["50", "100", "300", "", "700", "900"].map((s) => (s ? `--women-${s}` : "--women")),
  Men: ["50", "100", "300", "", "700", "900"].map((s) => (s ? `--men-${s}` : "--men")),
  Mono: ["--paper", "--gray-100", "--gray-200", "--gray-400", "--gray-600", "--gray-800", "--text-soft", "--ink"],
};

/** Visual reference of the design system. Not linked from the main page. */
export default function DesignSystem() {
  return (
    <main style={{ padding: "48px var(--gutter)", display: "grid", gap: 48 }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: 44 }}>Design system</h1>

      <section>
        <h2>Color</h2>
        {Object.entries(scales).map(([name, vars]) => (
          <div key={name} style={{ margin: "16px 0" }}>
            <p style={{ fontSize: 13, marginBottom: 6 }}>{name}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {vars.map((v) => (
                <div key={v} style={{ width: 96 }}>
                  <div style={{ height: 56, background: `var(${v})`, border: "1px solid var(--gray-400)" }} />
                  <code style={{ fontSize: 11 }}>{v}</code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="t-h3">Typography</h2>
        <p className="t-caption" style={{ margin: "4px 0 20px" }}>
          Use the global classes below. Serif = Zen Old Mincho Bold, sans = DM Sans.
        </p>
        <div style={{ display: "grid", gap: 20 }}>
          {[
            ["t-display", "Display", "Serif 700 · 40–72px", "Women’s health"],
            ["t-h1", "Heading 1", "Serif 700 · 30–44px", "Read the ratio"],
            ["t-h2", "Heading 2", "Serif 700 · 24–32px", "Who was studied?"],
            ["t-h3", "Heading 3", "Sans 600 · 19–24px", "Funding by condition"],
            ["t-stage-title", "Stage title", "Sans 600 · 26–40px · centered", "Chart title"],
            ["t-body-lg", "Body large", "Sans 400 · 17–24px · overlay text", "Divide actual funding by the estimate. A ratio of 1 means they match."],
            ["t-body", "Body", "Sans 400 · 15–18px", "Regular paragraph text for notes and longer explanations."],
            ["t-caption", "Caption", "Sans 400 · 13px · --text-soft", "Source, axis label, chart note"],
            ["t-label", "Label", "Sans 400 · 13px · uppercase", "Physical"],
            ["t-stat", "Stat", "Sans 700 · 22–29px", "44.7%"],
          ].map(([cls, name, spec, sample]) => (
            <div key={cls} style={{ borderTop: "1px solid var(--gray-200)", paddingTop: 12 }}>
              <p className="t-caption">
                {name} — <code>.{cls}</code> — {spec}
              </p>
              <p className={cls}>{sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: "linear-gradient(90deg, var(--women-100), var(--men-100))", padding: 40, display: "grid", gap: 24 }}>
        <h2>TextOverlay</h2>
        {(["dark", "light"] as const).map((v) => (
          <TextOverlay key={v} variant={v} title={`variant="${v}"`}>
            <p>Body copy sits here. It scrolls up over the pinned graphic.</p>
          </TextOverlay>
        ))}
        {/* veil fills its positioned parent; in the real page that parent is <ScrollyStep> */}
        <div style={{ position: "relative", isolation: "isolate", minHeight: 320, display: "flex", alignItems: "center", padding: "0 24px" }}>
          <TextOverlay variant="veil" title='variant="veil"'>
            <p>No box: a white layer fills the whole screen behind the text.</p>
          </TextOverlay>
        </div>
      </section>
    </main>
  );
}
