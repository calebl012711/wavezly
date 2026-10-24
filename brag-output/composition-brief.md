# Hyperframes Composition Brief: Wavezly 3D Printing Launch Series

## Objective
Create 5 high-converting, polished X (Twitter) and TikTok launch animations for Wavezly using Hyperframes and GSAP timelines.

## Output Compositions
1. `brag-output/anim1-amazon-launch/index.html` — 1920x1080 (18s) — Tone: `polished`
2. `brag-output/anim2-viral-gadgets/index.html` — 1080x1920 (15s) — Tone: `chaotic`
3. `brag-output/anim3-measure-customizer/index.html` — 1920x1080 (16s) — Tone: `app-store`
4. `brag-output/anim4-kitchen-asmr/index.html` — 1920x1080 (18s) — Tone: `default`
5. `brag-output/anim5-wavezly-prime/index.html` — 1920x1080 (20s) — Tone: `cinematic`

## Source Material & Grounding
- Project Root: `/Users/caleblickteig/Documents/antigravity/sharp-pasteur`
- Brand Logo: `/assets/logo/wavezly-logo.png`
- Core Palette:
  - Deep Navy/Black: `#131921`
  - Secondary Slate: `#232f3e`
  - Smile Amber: `#ff9900`
  - Prime Gold: `#ffd814`
  - Crisp White/Light: `#fafafc` / `#ffffff`
  - Accent Cyan/Teal: `#007185`
- Real Product Assets:
  - Articulated Crystal Gem Dragon: `/assets/products/crystal-dragon-hero.svg`
  - Gyro Cube: `/assets/products/gyro-cube-hero.svg`
  - Geometric Low-Poly Planters: `/assets/products/low-poly-planter-hero.svg`
  - Cutlery Matrix: `/assets/products/kitchen-cutlery-matrix-hero.svg`
  - Barista Espresso Valet: `/assets/products/pourover-coffee-tray-real.jpg`
  - Basalt Coasters: `/assets/products/desk-coasters-real.jpg`
  - Drawer Matrix: `/assets/products/drawer-matrix-real.jpg`

## Verbatim Project Claims
- "The Amazon of 3D Printing"
- "Over 200,000 custom organizer variations"
- "Manufactured in Boise, Idaho USA within 48 hours"
- "100% Fit Guarantee — if it wiggles by 1mm, we reprint free"
- "Print-in-Place multi-segment articulation — zero assembly required"
- "4.9 out of 5 stars • 4,180 verified reviews"

## Hyperframes Technical Contract
- Every composition has root element `<div id="root" data-composition-id="main" data-start="0" data-duration="..." data-width="..." data-height="...">`
- Registered root timeline: `window.__timelines = window.__timelines || {}; window.__timelines["main"] = gsap.timeline({ paused: true });`
- All visual scenes have `class="clip"` and precise `data-start` and `data-duration`
- Keyframe motion on transform properties: `x, y, scale, opacity, rotation`
- No empty frame 0: key elements settled or styled from frame 0
- No dead stretch: continuous engaging motion and rhythmic holds
- Full WCAG AA contrast compliance
- Sound effects and music tracks linked locally via relative paths
