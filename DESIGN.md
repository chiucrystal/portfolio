# DESIGN.md — Stock Photo Theme

## Concept

The site becomes a **portfolio that's been quietly reskinned as a stock photo
library** — Getty/Shutterstock chrome (watermarks, license badges, ironic
auto-captions, filter chips) layered over Crystal's real content and real
photos. The joke is the *frame*, not the content: nothing about the actual
work, bio, or experience gets goofier — only the packaging around it does.

Reference point: the "Distracted Boyfriend" / Simu Liu stock-photo genre —
generic, slightly-too-enthusiastic corporate stock captions ("Diverse
coworkers high-fiving over spreadsheet") applied to a real, specific photo.
The humor comes from the mismatch between the deadpan corporate caption and
the actual (personal, specific) image underneath.

## Guardrail: where the joke stops

This is the one thing I want to flag before touching code. A recruiter or
hiring manager clicking into a case study needs to trust the work is
serious. So:

- **Homepage (`index.html`)**: full bit. Nav, hero, work grid, about,
  experience, footer all get the stock-site treatment.
- **Case study pages (`work/*.html`)**: light touch only — consistent nav
  chrome and maybe a small corner badge on the hero image — no joke
  captions inside the actual case study narrative. Once someone clicks in
  to read about the WiseTech project, it reads like a normal, credible case
  study.
- **Real bio copy, job titles, dates, links**: never altered or joked with.
  The comedy sits in added chrome around the content, never inside it.

## Visual system additions (`tokens.css`)

Keep the existing palette/type (cream bg, `--color-display` navy, DM Mono +
DM Sans) — it already reads "polished." Add a small stock-site accent
layer on top:

```css
--color-watermark:     rgba(35, 30, 26, 0.06);   /* diagonal tile overlay on photos */
--color-badge-bg:      #FEFAF6;
--color-badge-border:  rgba(35, 30, 26, 0.15);
--color-stock-accent:  #C2401C;                   /* Getty-red, used ONLY for badges/chips, never body text */
```

New type tokens:

- `.t-stock-badge` — DM Mono, 11px, uppercase, letter-spaced, for corner
  badges ("ROYALTY-FREE", "ID #048291").
- `.t-stock-caption` — DM Sans italic, 13px, muted, for the joke captions
  (visually a sibling of the existing `.caption` token, just triggered in a
  different context).

## New components (`styles.css`)

**`.stock-frame`** — wraps any image. On the images that already sit inside
a `<picture>` (hero collage, work thumbnails, xp illo), this is just an
added wrapper div, no asset changes needed.

- `.stock-watermark` — tiled diagonal text ("CRYSTALCHIU STOCK"), rendered
  as an inline SVG data-URI background, ~6% opacity, `pointer-events: none`.
  Always visible, subtle — reads as texture, not noise.
- `.stock-badge` — small pill, top-right corner, e.g. `ID #048291` or
  `ROYALTY-FREE`. Always visible.
- `.stock-caption-bar` — bottom strip, hidden by default, slides up on
  hover/focus (same easing as the existing `.cs-overlay` pattern already in
  the codebase) showing the joke caption line.

**`.stock-filter-chips`** — a row of pill chips styled like stock-site
sidebar filters, but the filter *values* are Crystal's actual traits. Sits
under the hero description. Decorative, not interactive.

**Nav tweak** — small monospace tag next to the logo, styled like a
stock-site wordmark suffix: `crystal chiu` + a muted `™ stock` chip. Subtle,
not a full nav redesign.

## Page-by-page plan

### Hero
- Wrap `.hero-collage` in `.stock-frame`: badge `ID #002024`, watermark
  tile, hover caption:
  > "Young professional confidently presenting a Figma file she has not
  > actually opened yet."
- Sandwich stack stays exactly as-is (it's the existing personal Easter
  egg) — just gets a tiny `♡ Add to board` decorative label near it, same
  joke register, no functional change.
- Add `.stock-filter-chips` under the hero description:
  `sandwich-adjacent ✓` · `sydney-based ✓` · `figma-fluent ✓` ·
  `isolated on beige background ✓` · `not actually royalty-free`

### Work grid (3 cards)
Each thumbnail gets `.stock-frame` with a caption specific to that project's
real screenshot:
- Programs (WiseTech): `ID #481203` — "Diverse team pretending to
  understand a Gantt chart."
- Content Creator (WiseTech): `ID #481204` — "Editor smiling at a course
  builder that finally works."
- Dedoco: `ID #481205` — "Professional signs document without reading
  it, digitally, securely, ironically."
- "Coming soon" ballet card keeps its own overlay as-is (it's already doing
  a similar joke — "Coming soon!" — so no change needed there).

### About panel
- Folder illustration gets a small caption chip near it, styled like a
  stock-site collection label: `Collection: "Crystal_Approved_FINAL_v3"` —
  riffing on corporate file-naming conventions. Bio text untouched.

### Experience / Education
- `xp-illo` image gets the same `.stock-frame` badge treatment (badge only,
  no caption — this section should stay closest to "normal resume", least
  jokey of the page).
- Entries themselves (company, dates, titles) untouched.

### Footer
- Keep the existing real quote as the emotional anchor.
- Add one small stock-site-style disclaimer line beneath it, same
  `.t-stock-caption` styling:
  > "Model has provided consent for likeness to be used in ironic contexts.
  > No ballet flats were harmed."

## What stays unchanged

- Layout/grid, spacing, section order.
- All real copy: bio, job history, dates, project descriptions.
- Case study page content and structure.
- Existing personal motifs (sandwich stack, folder illo) — augmented with
  small badges, not replaced.
- Fonts (DM Mono / DM Sans) and base palette.

## Open questions for you

1. Any of the joke captions above you want cut, replaced, or toned down?
2. OK with the `--color-stock-accent` red for badges, or prefer it stay
   fully monochrome (navy/cream only, no new accent color)?
3. Should the case-study back-link/nav on `work/*.html` pages get the same
   corner badge treatment, or stay completely as-is (zero stock-theme
   presence once you're inside a case study)?
