# DESIGN.md — STEM Begins Here

Visual system for the site. Source of truth for color and components is
`Media/Theme Guide (SBH).html` ("Midnight Institutional"); source of truth for the
mark and wordmark is `Media/Logo (SBH Rocket Hex).html`. This file records how those
two documents were reconciled in code.

## Theme

Dark-dominant, institutional, drafting-room. Navy carries the site; a warm paper tone
provides relief; copper is the single accent. Surfaces alternate dark and paper down
the page, both carrying a 72px vertical rule grid at low opacity so backgrounds read as
drafting paper rather than flat fills.

## Color

All values are fixed by the theme guide. Do not introduce a color outside this set.

| Token | Value | Role |
|---|---|---|
| `--navy` | `#0B1F3A` | Primary dark surface |
| `--navy-deep` | `#06101F` | Header, hero floor, footer |
| `--paper` | `#F5F1E8` | Light surface |
| `--copper` | `#C6702A` | Accent. One job per view. |
| `--copper-lift` | `#E0965A` | Accent hover on dark |
| `--copper-ink` | `#9A5320` | Accent **as text on paper** |
| `--ink-dark` | `#EAF1FB` | Text on navy |
| `--muted-dark` | `#9DB4D4` | Secondary text on navy |
| `--ink-paper` | `#0B1F3A` | Text on paper |
| `--muted-paper` | `#5B6B82` | Secondary text on paper |

### Two contrast rules that are easy to get wrong

- **Copper on paper fails AA for body text** (3.21:1). Any copper text on a light
  surface must use `--copper-ink` (5.16:1). This is why the token exists.
- **The primary button is navy text on copper** (4.52:1), not white on copper
  (3.62:1, fails). Do not "fix" the button by making the label white.

## Typography

**One grotesque carries the whole page.** Archivo does display and body, separated by
weight (700 vs 400) and size (about 2.5x) rather than by a second family. An earlier
pass paired a display serif with Archivo; that was replaced because the serif was a
reflex pick and the pairing pushed the site into the editorial-typographic lane.

| Token | Family | Used for |
|---|---|---|
| `--font-sans` | Archivo 400/500/600/700 | Everything: display, body, UI, buttons |
| `--font-mono` | IBM Plex Mono 400/500 | Measurement only: hours, grades, spec keys, timeline dates |
| `--font-wordmark` | Space Grotesk 600 | The wordmark, and nothing else |

- `h1` is `clamp(2.3rem, 1.3rem + 3.5vw, 3.85rem)` at weight 700, tracking `-0.035em`.
- Body measure is capped at 62–68ch. The timeline needs an explicit `max-width`
  because it sits in the full-width container.
- Wordmark tracking is `-0.035em` per the logo spec.
- **Mono is for measurement, not decoration.** If a mono label is not a number, a
  unit, or a data key, it is in the wrong face.

## No eyebrows

The theme guide defines a SECTION EYEBROW component (`01 / SECTION NAME`). **It is
deliberately not implemented.** A tracked mono kicker above every heading is the most
saturated generated-UI tell there is, and these headings carry themselves without one.
This is the single largest departure from the theme guide, and it is intentional.

The numbered variant is doubly out: section numbers only earn their place when the
sequence carries information the reader needs. On this site that is true in exactly one
place, the three-day timeline, where the days are numbered because they are days.

## Logo

"Rocket Hex": a hexagon (a bolt head) containing a rocket lifting off an open book.
Inlined as SVG in the header and footer of every page so it inherits no network cost;
standalone files in `images/` for reuse.

- `images/logo-mark-light.svg` — master, for light backgrounds
- `images/logo-mark-dark.svg` — navy/paper swapped, for dark backgrounds
- `images/favicon.svg` — app-icon lockup, simplified per the spec's small-size rule

**Rules:** copper appears exactly once per lockup, on the flame. Never rotate the hex.
Never recolor beyond navy/paper structure plus the copper flame.

## Components

Defined in `css/styles.css`, section-numbered to match.

- **Card** — 18px radius, 5px top rule. Neutral by default; `--accent` variant takes a
  copper border, copper rule, and tinted fill. One accent card per group, maximum.
- **Callout** — copper border plus tinted fill, and no accent bar. Border + fill +
  stripe was triple-encoding one signal.
- **Timeline** — copper ring markers; `.is-done` fills them.
- **Spec list** — mono key, sans value, hairline rows. The workhorse for logistics.
- **Tag pill** — 999px radius, copper `▸` prefix.
- **Hero panel** — a schematic of the input → process → output model the curriculum is
  built on, with an animated signal pulse. Placeholder for real photography.

## Layout

- Container 1140px, narrow variant 820px, 24px gutter.
- Spacing scale is an 8px base (`--s-1` … `--s-10`).
- Radius: cards 18px, surfaces 16px, inputs 10px, pills 999px.
- Breakpoints at 1000 / 880 / 760 / 460px.

## Motion

Restrained on purpose. Scroll reveals (16px rise, 550ms, ease-out) and an infinite
signal pulse in the hero schematic.

Reduced motion **removes travel and looping, not feedback**. The pulse stops, movement
becomes a 200ms crossfade, and the accordion opens instantly, but color and border
transitions on hover and focus survive so state changes stay legible. A blanket
`*{transition-duration:0.01ms}` kill would have stripped that, which is why there
isn't one.

Reveals are applied by JS only, carry a 4s failsafe, and force visible on
`beforeprint`, so content can never ship blank.

## Known tensions

1. **Space Grotesk is on the reflex-reject font list.** It is committed brand identity
   via the logo spec and appears on exactly two elements (nav and footer wordmark), so
   identity-preservation applies. Recorded as a narrow detector exception in
   `.impeccable/config.json` rather than suppressed globally.
2. **IBM Plex Mono is on the same list.** Same argument, and its use is now confined to
   measurement.
3. **The blueprint grid trips `codex-grid-background`.** This is a verified false
   positive: the rule's own carve-out is "canvas, map, blueprint, or measurement
   surfaces," and the flagged element is the graph-paper field inside a panel
   containing an engineering schematic. Left unsuppressed on purpose.
4. **No photography.** The single biggest gap. See below.

## The imagery gap

The site currently ships zero photographs. For a brand-register surface this is the
most significant remaining weakness: an administrator deciding whether to trust an
organization with their students is far more moved by a photo of a student holding a
working circuit than by any typography.

It is currently unfixable honestly, because the organization has not yet run a session,
and stock photos of students would imply history that does not exist.

**What is safe to add now:** real photographs of the actual hardware. A Pi Pico, a
breadboard mid-build, a kit laid out. These are honest (it is the real equipment),
they are the brand's physical object, and they would carry the hero far better than the
schematic panel does.

**What to add the moment it exists:** photographs from the first session. Replace the
`.hero-panel` block entirely.
