# Appearance and navigation — 13 November 2026

## Theme behavior

The site follows `prefers-color-scheme` until the visitor selects light or dark. The selection is stored under `jreas-theme`, applied before the first paint and synchronized between tabs. Both modes cover content surfaces, inputs, buttons, status messages and navigation. Concept illustrations retain their own art palettes.

Desktop has a sun/moon button beside the language control. Mobile places both controls inside the menu. Accessible button names describe the action and are translated.

## Reference navigation

The floating capsule uses the original Jreas Lab identity, physical logo-left arrangement, central localized links and rounded contact action. The expanded shell is up to 1280px wide and 74px high. Above 110px scroll it contracts to 800px × 62px, hides the wordmark and keeps the symbol. It expands below 32px. Mobile uses the reference two-line menu with keyboard focus management and Escape dismissal.

## Editorial changes

Replaced ornamental code fragments, cursors, orbit lines and rotating stars with a restrained brand poster. Simplified the hero, section headings and calls to action in both languages. Kept the six actual services, including data analytics and AI; portfolio concepts remain explicitly attributed.

## Verification

- Lint, production build and all 18 automated tests passed.
- Arabic and English at 390px: both modes had zero violations in the executed axe WCAG 2 A/AA and 2.1 AA rules.
- Arabic at 360px: both modes passed; final dark result is saved separately.
- Reload persistence, mobile menu, Escape, language switch and scroll contraction checked in the deployed browser.
- No Lighthouse score or complete accessibility certification is claimed.

Screenshots: [light desktop](desktop.jpg), [dark desktop](dark.jpg), [dark mobile](mobile.jpg).
