# Women’s Health in the Blind Spot of Medical Care — Project Guide

One-page **scrollytelling** website (Next.js App Router, TypeScript, CSS Modules, deployed on Vercel).
As the user scrolls, a pinned graphic changes and text boxes scroll up over it to tell the story.
Three parts: **Physical**, **Mental**, **Funding**. Three people, one part each.

> Read `AGENTS.md` first: this Next.js version has breaking changes; check `node_modules/next/dist/docs/` before using unfamiliar APIs.

## Language
**Everything is in English** — site copy, code comments, commit messages, PR descriptions, issues, and docs. The team is international.

## Team workflow
- `main` = shared foundation (header, design system, scroll components). Don’t build part content on `main`.
- Each person works on their own branch named after them (e.g. `name/physical`). Pull shared updates with `git fetch origin && git merge origin/main`.
- **Edit only your own part file** `src/parts/<Part>.tsx` (and new files in `src/parts/<part>/`). That keeps merges conflict-free.
- Shared files (`src/components/**`, `src/styles/tokens.css`, `src/lib/parts.ts`, `globals.css`) change only through a small PR to `main` that the team agrees on.
- Commit small, open a PR into `main`, and check the Vercel preview URL before merging.

## Commands
```
npm install
npm run dev     # http://localhost:3000   (design reference: /design-system)
npm run lint
npm run build   # must pass before PR
```

## Structure
```
src/app/layout.tsx          fonts (Zen Old Mincho, DM Sans) + metadata
src/app/page.tsx            composes the three parts + Header
src/app/design-system/      visual reference of tokens & components
src/parts/                  Physical.tsx / Mental.tsx / Funding.tsx  ← one owner each
src/components/             shared components (see below)
src/styles/tokens.css       design tokens (colors, type scale, layout)
src/lib/parts.ts            part ids/labels → header nav + section ids
```

## Shared components (`@/components`)
| Component | Use |
|---|---|
| `Header` | Fixed top bar; nav jumps to `#physical`, `#mental`, `#funding`, current part is bold. Already mounted in `page.tsx`. |
| `ScrollySection` | Wraps one part (`id`, `part`). Tracks the active step. |
| `ScrollyStage` | Pinned graphic area. `children` may be `(step) => ReactNode`. |
| `ScrollyStep` | One scroll step (one viewport tall). Put a `TextOverlay` inside. |
| `useScrollyStep()` | Hook → `{ step, stepCount }` for deeper child components of a stage. |
| `TextOverlay` | Text card over the graphic. `variant`: `dark`, `light`, `veil`. Props: `title`, children. |
| `StageTitle` | Centered title at top of the stage. |
| `SourceNote` | Right-aligned citation at the bottom of the stage. |

Pattern for a part (see `src/parts/Physical.tsx`):
```tsx
<ScrollySection id="physical" part>
  <ScrollyStage>{(step) => <MyGraphic step={step} />}</ScrollyStage>
  <ScrollyStep><TextOverlay variant="dark" title="…"><p>…</p></TextOverlay></ScrollyStep>
  …one ScrollyStep per story page
</ScrollySection>
```
- Files that use `ScrollySection`/`ScrollyStage` with a function child must start with `"use client"`.
- Graphics are driven by `step` (index of the active step). Animate with CSS transitions keyed on `step`; avoid scroll listeners.
- Do not change the `id`s `physical` / `mental` / `funding`.
- If you need a new shared component, ask the team first — don’t duplicate one inside your part.

## Design system
- **Background white.** Text is monotone: `--ink` (black), `--text-soft` (#6a625b), grays.
- **Point colors** (only for data meaning): women `--women` #F54D02, men `--men` #45176A. Variations: `--women-50…900`, `--men-50…900`. Use the same color for the same group on every page. Avoid pink/blue gender stereotypes beyond these two.
- **Fonts**: titles → `var(--font-serif)` (Zen Old Mincho Bold); everything else → `var(--font-sans)` (DM Sans). Use the text classes from `src/styles/typography.css` (`t-display`, `t-h1`, `t-h2`, `t-h3`, `t-stage-title`, `t-body-lg`, `t-body`, `t-caption`, `t-label`, `t-stat`) instead of setting font size/weight yourself; live preview at `/design-system`.
- Always use CSS variables from `tokens.css`; never hard-code hex values or font names in components.
- Style with CSS Modules (`*.module.css`). No Tailwind, no inline colors.
- Text boxes (`TextOverlay`) have no drop shadow.
- Layout reference: Figma 1728×1117 frame; header 55px; overlay card max width 759px, radius 32px. Must work down to phone width.
- Figma: https://www.figma.com/design/pThTMaF5XfM11D2YKvtmoh/Women-Health-Data

## Content rules
- Story text/data lives in the team’s story document; copy it into your part, don’t invent numbers.
- Every chart needs a `SourceNote` and must keep denominators/baselines honest (bars start at zero).
- Charts: hand-built SVG/CSS or a small library agreed with the team; keep accessible labels (`aria-label`, text alternatives).

## Quality checklist before PR
- `npm run lint` and `npm run build` pass.
- Checked at ~1440px wide and ~390px (phone).
- Header link for your part scrolls to it and highlights while you’re inside it.
- No console errors; respects `prefers-reduced-motion`.
