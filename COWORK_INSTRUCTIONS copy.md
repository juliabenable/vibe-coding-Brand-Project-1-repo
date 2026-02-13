# Benable Project — Folder Instructions for Cowork

## Context
You are building UI prototypes and pages for **Benable**, a social recommendation platform. This folder contains a `DesignSystem.md` file that is the single source of truth for all design decisions.

## Rules
1. **Always read `DesignSystem.md` before writing any UI code.** Do not guess colors, fonts, spacing, or component styles.
2. **Use semantic tokens (Section 2) in code**, not primitive hex values. For example, use the token name `action-bg-primary` mapped to `#AE94F9`, not a raw purple value.
3. **Follow these specifics exactly:**
   - Font family: **Helvetica Neue** for all text (titles and body)
   - Font weights: Regular (400), Medium (500), Bold (700)
   - Title sizes: xs (20px) through 3xl (48px)
   - Body sizes: xs (12px) through lg (18px)
   - Spacing: 4px base grid, use `sp-` tokens (sp-4 through sp-164)
   - Border radius: xsm (4px) through 3xl (40px)
   - Shadows: Use the CSS box-shadow values from Section 6
4. **Match component patterns from Section 7.** When building buttons, inputs, cards, navigation, tabs, toasts, modals, etc., follow the documented variants, states, and styling.
5. **Match page layout patterns from Section 8.** When building full pages (Discover, Invites, etc.), follow the documented structure, grid layouts, and component placement.
6. **Brand color is purple (`#AE94F9` / brand-700).** Primary buttons, active states, and CTAs use this color. Do not substitute with blue or other purples.
7. **Use the correct status colors:**
   - Success = Green (`#2BAF87`)
   - Error/Danger = Red (`#FF5567`)
   - Warning = Orange (`#FFA747`)
   - Info = Blue (`#47B3FF`)
8. **Default text color is near-black (`#1A1A1A` / neutral-800)**, not pure black, unless used for highest contrast.
9. **Page backgrounds are white (`#FFFFFF`).** Use `neutral-100` (`#F5F5F5`) for subtle section differentiation.
10. **When creating HTML/React prototypes**, include Helvetica Neue via system font stack: `"Helvetica Neue", Helvetica, Arial, sans-serif`.

## Output Preferences
- Build prototypes as single-file HTML or React (.jsx) unless told otherwise.
- Use inline styles or a `<style>` block with CSS custom properties mapped to the design tokens.
- Make prototypes responsive (desktop + mobile) by default.
- Include hover, active, and disabled states on interactive elements.
- Use realistic placeholder content relevant to Benable (recommendation lists, user profiles, product categories like Fashion, Beauty, Food, Travel, etc.).

## Page Index for Reference
The following pages exist in the Benable product. Check DesignSystem.md Section 9 for which are documented:
Discover, Invites, List page, Add list, Add Rec, Rec details, Profile page, Settings, Notifications, Search, Bookmarks, Dashboard, 404 page, Onboarding, Web Report/Block flows, Utilities.
