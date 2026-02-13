# Benable Design System

This document defines the design tokens and guidelines for all Benable products. Use this as the single source of truth when building UI prototypes, components, and pages.

---

## 1. Primitive Color Tokens

These are the raw color values. Semantic tokens (Section 2) reference these primitives.

### Black

| Token | Hex       |
|-------|-----------|
| Black | `#000000` |

### Neutral

| Token       | Hex       |
|-------------|-----------|
| Neutral-0   | `#FFFFFF` |
| Neutral-100 | `#F5F5F5` |
| Neutral-200 | `#ECECEC` |
| Neutral-300 | `#C2C5C4` |
| Neutral-400 | `#B3B3B3` |
| Neutral-500 | `#9C9C9C` |
| Neutral-600 | `#7F7F7F` |
| Neutral-700 | `#707070` |
| Neutral-800 | `#1A1A1A` |
| Neutral-900 | `#000000` |

### Brand

| Token      | Hex       |
|------------|-----------|
| Brand-0    | `#F9F7FF` |
| Brand-100  | `#F5F3FC` |
| Brand-200  | `#EFECF7` |
| Brand-300  | `#EBE4FF` |
| Brand-400  | `#D6CFEA` |
| Brand-500  | `#BFB9D2` |
| Brand-600  | `#A19BB8` |
| Brand-700  | `#AE94F9` |
| Brand-800  | `#896BD9` |
| Brand-900  | `#5E518E` |

### Blue

| Token     | Hex       |
|-----------|-----------|
| Blue-100  | `#EBF7FF` |
| Blue-300  | `#99D5FF` |
| Blue-500  | `#47B3FF` |
| Blue-700  | `#0C8EE9` |

### Green

| Token      | Hex       |
|------------|-----------|
| Green-100  | `#EFFBF7` |
| Green-300  | `#73DDBD` |
| Green-500  | `#2BAF87` |
| Green-700  | `#18906C` |

### Orange

| Token       | Hex       |
|-------------|-----------|
| Orange-100  | `#FFF0E0` |
| Orange-300  | `#FDD8B0` |
| Orange-500  | `#FFA747` |
| Orange-700  | `#E88E2C` |

### Red

| Token    | Hex       |
|----------|-----------|
| Red-100  | `#FFF1F1` |
| Red-300  | `#FF9EA8` |
| Red-500  | `#FF5567` |
| Red-700  | `#E82C3F` |

---

## 2. Semantic Tokens (Light Mode)

These are the tokens to use in UI. They map to primitive values and can be swapped for dark mode.

### Default

#### Texts

| Token                | References       | Hex       | Usage                        |
|----------------------|------------------|-----------|------------------------------|
| default-text-base    | neutral/800      | `#1A1A1A` | Primary body text            |
| default-text-medium  | neutral/600      | `#7F7F7F` | Secondary text               |
| default-text-subtle  | neutral/400      | `#B3B3B3` | Placeholder, hint text       |
| default-text-weak    | neutral/200      | `#ECECEC` | Disabled text                |
| default-text-inverse | neutral/0        | `#FFFFFF` | Text on dark backgrounds     |

#### Backgrounds

| Token              | References       | Hex       | Usage                          |
|--------------------|------------------|-----------|--------------------------------|
| default-bg-body    | neutral/0        | `#FFFFFF` | Main page background           |
| default-bg-weak    | neutral/100      | `#F5F5F5` | Subtle section backgrounds     |
| default-bg-subtle  | neutral/200      | `#ECECEC` | Card/container backgrounds     |
| default-bg-medium  | neutral/400      | `#B3B3B3` | Emphasis backgrounds           |
| default-bg-strong  | neutral/800      | `#1A1A1A` | Dark/inverse backgrounds       |

#### Borders

| Token                  | References       | Hex       | Usage                        |
|------------------------|------------------|-----------|------------------------------|
| default-border-base    | neutral/200      | `#ECECEC` | Default borders              |
| default-border-medium  | neutral/500      | `#9C9C9C` | Emphasized borders           |
| default-border-subtle  | neutral/300      | `#C2C5C4` | Subtle dividers              |
| default-border-inverse | neutral/0        | `#FFFFFF` | Borders on dark backgrounds  |

### Action (Brand)

#### Texts

| Token                          | References       | Hex       | Usage                              |
|--------------------------------|------------------|-----------|------------------------------------|
| action-text-primary            | brand/700        | `#AE94F9` | Primary action text                |
| action-text-primary-disabled   | brand/500        | `#BFB9D2` | Disabled action text               |
| action-text-primary-active     | brand/800        | `#896BD9` | Active/pressed action text         |
| action-text-primary-static     | brand/600        | `#A19BB8` | Static/non-interactive action text |
| action-text-secondary          | brand/900        | `#5E518E` | Secondary action text              |
| action-text-secondary-disabled | brand/400        | `#D6CFEA` | Disabled secondary action text     |

#### Backgrounds

| Token                        | References       | Hex       | Usage                            |
|------------------------------|------------------|-----------|----------------------------------|
| action-bg-primary            | brand/700        | `#AE94F9` | Primary action background        |
| action-bg-primary-active     | brand/800        | `#896BD9` | Pressed action background        |
| action-bg-primary-disabled   | brand/200        | `#EFECF7` | Disabled action background       |
| action-bg-subtle             | brand/300        | `#EBE4FF` | Subtle action background         |
| action-bg-light              | brand/100        | `#F5F3FC` | Light action background          |

#### Borders

| Token                         | References       | Hex       | Usage                          |
|-------------------------------|------------------|-----------|---------------------------------|
| action-border-primary         | brand/700        | `#AE94F9` | Primary action border          |
| action-border-primary-disabled| brand/400        | `#D6CFEA` | Disabled action border         |
| action-border-light           | brand/200        | `#EFECF7` | Light action border            |

### Success

#### Texts

| Token                | References       | Hex       | Usage                    |
|----------------------|------------------|-----------|--------------------------|
| success-text-regular | green/500        | `#2BAF87` | Default success text     |
| success-text-subtle  | green/300        | `#73DDBD` | Subtle success text      |
| success-text-strong  | green/700        | `#18906C` | Strong success text      |

#### Backgrounds

| Token               | References       | Hex       | Usage                       |
|---------------------|------------------|-----------|-----------------------------|
| success-bg-regular  | green/500        | `#2BAF87` | Default success background  |
| success-bg-subtle   | green/300        | `#73DDBD` | Subtle success background   |
| success-bg-weak     | green/100        | `#EFFBF7` | Weak success background     |
| success-bg-strong   | green/700        | `#18906C` | Strong success background   |

#### Borders

| Token                  | References       | Hex       | Usage                  |
|------------------------|------------------|-----------|------------------------|
| success-border-regular | green/500        | `#2BAF87` | Default success border |

### Danger

#### Texts

| Token              | References       | Hex       | Usage                   |
|--------------------|------------------|-----------|-------------------------|
| danger-text-base   | red/500          | `#FF5567` | Default danger text     |
| danger-text-subtle | red/300          | `#FF9EA8` | Subtle danger text      |
| danger-text-strong | red/700          | `#E82C3F` | Strong danger text      |

#### Backgrounds

| Token              | References       | Hex       | Usage                      |
|--------------------|------------------|-----------|----------------------------|
| danger-bg-regular  | red/500          | `#FF5567` | Default danger background  |
| danger-bg-base     | red/700          | `#E82C3F` | Strong danger background   |
| danger-bg-subtle   | red/300          | `#FF9EA8` | Subtle danger background   |
| danger-bg-weak     | red/100          | `#FFF1F1` | Weak danger background     |

#### Borders

| Token                | References       | Hex       | Usage                   |
|----------------------|------------------|-----------|-------------------------|
| danger-border-base   | red/500          | `#FF5567` | Default danger border   |
| danger-border-medium | red/300          | `#FF9EA8` | Medium danger border    |
| danger-border-weak   | red/100          | `#FFF1F1` | Weak danger border      |

### Information

#### Texts

| Token           | References       | Hex       | Usage                 |
|-----------------|------------------|-----------|-----------------------|
| info-text-base  | blue/500         | `#47B3FF` | Default info text     |
| info-text-strong| blue/700         | `#0C8EE9` | Strong info text      |
| info-text-weak  | blue/300         | `#99D5FF` | Weak info text        |

#### Backgrounds

| Token            | References       | Hex       | Usage                    |
|------------------|------------------|-----------|--------------------------|
| info-bg-base     | blue/100         | `#EBF7FF` | Default info background  |
| info-bg-strong   | blue/700         | `#0C8EE9` | Strong info background   |
| info-bg-medium   | blue/300         | `#99D5FF` | Medium info background   |

#### Borders

| Token              | References       | Hex       | Usage                 |
|--------------------|------------------|-----------|-----------------------|
| info-border-base   | blue/100         | `#EBF7FF` | Default info border   |
| info-border-strong | blue/700         | `#0C8EE9` | Strong info border    |

### Text Links

| Token              | References                    | Hex       | Usage          |
|--------------------|-------------------------------|-----------|----------------|
| text-link-active   | Information/info-text-strong  | `#0C8EE9` | Active links   |
| text-link-visited  | Information/info-text-weak    | `#99D5FF` | Visited links  |

---

## 3. Typography

### Font Family

| Token | Family         |
|-------|----------------|
| Title | Helvetica Neue |
| Body  | Helvetica Neue |

### Font Weights

| Token   | Weight  |
|---------|---------|
| Regular | Regular (400) |
| Medium  | Medium (500)  |
| Bold    | Bold (700)    |

### Font Size — Title

| Token | Size   |
|-------|--------|
| xs    | `20px` |
| sm    | `22px` |
| md    | `24px` |
| lg    | `28px` |
| xl    | `32px` |
| 2xl   | `40px` |
| 3xl   | `48px` |

### Font Size — Body

| Token | Size   |
|-------|--------|
| xs    | `12px` |
| sm    | `14px` |
| md    | `16px` |
| lg    | `18px` |

---

## 4. Spacing

Based on a **4px base unit**. All values in pixels.

| Token  | Value   |
|--------|---------|
| sp-4   | `4px`   |
| sp-8   | `8px`   |
| sp-12  | `12px`  |
| sp-16  | `16px`  |
| sp-20  | `20px`  |
| sp-24  | `24px`  |
| sp-28  | `28px`  |
| sp-32  | `32px`  |
| sp-36  | `36px`  |
| sp-40  | `40px`  |
| sp-44  | `44px`  |
| sp-48  | `48px`  |
| sp-52  | `52px`  |
| sp-56  | `56px`  |
| sp-60  | `60px`  |
| sp-64  | `64px`  |
| sp-68  | `68px`  |
| sp-72  | `72px`  |
| sp-76  | `76px`  |
| sp-80  | `80px`  |
| sp-84  | `84px`  |
| sp-88  | `88px`  |
| sp-92  | `92px`  |
| sp-96  | `96px`  |
| sp-100 | `100px` |
| sp-104 | `104px` |
| sp-108 | `108px` |
| sp-112 | `112px` |
| sp-116 | `116px` |
| sp-124 | `124px` |
| sp-132 | `132px` |
| sp-140 | `140px` |
| sp-148 | `148px` |
| sp-156 | `156px` |
| sp-164 | `164px` |

---

## 5. Border Radius

| Token | Value  | Description                                                              |
|-------|--------|--------------------------------------------------------------------------|
| xsm   | `4px`  | Primarily used on small components like tags                             |
| sm    | `8px`  | Used for elements often nested inside others                             |
| md    | `12px` | Used for elements like buttons, alerts, etc.                             |
| lg    | `16px` | Corner radius for big container-like elements                            |
| xl    | `24px` | Large rounding for prominent containers                                  |
| 2xl   | `32px` | Large rounded sections                                                   |
| 3xl   | `40px` | Pill shapes, fully rounded panels                                        |

---

## 6. Shadows / Elevation

| Token          | X | Y   | Blur  | Spread | Color              | CSS                                          | Usage                              |
|----------------|---|-----|-------|--------|--------------------|----------------------------------------------|------------------------------------|
| light-top      | 0 | 4   | 24    | 0      | `#000000` 8%       | `0 4px 24px rgba(0,0,0,0.08)`               | Subtle card lift                   |
| light-bottom   | 0 | -4  | 24    | 0      | `#000000` 8%       | `0 -4px 24px rgba(0,0,0,0.08)`              | Bottom-anchored elements           |
| medium-top     | 0 | 16  | 40    | 0      | `#000000` 8%       | `0 16px 40px rgba(0,0,0,0.08)`              | Dropdowns, popovers                |
| medium-bottom  | 0 | -16 | 40    | 0      | `#000000` 8%       | `0 -16px 40px rgba(0,0,0,0.08)`             | Bottom-anchored popovers           |
| dark-top       | 0 | 8   | 50    | 0      | `#000000` 16%      | `0 8px 50px rgba(0,0,0,0.16)`               | Modals, dialogs                    |
| dark-center    | 0 | 2   | 120   | 0      | `#000000` 24%      | `0 2px 120px rgba(0,0,0,0.24)`              | Heavy overlay, hero sections       |
| D1             | 0 | 0   | 5     | 0      | `#000000` 56%      | `0 0 5px rgba(0,0,0,0.56)`                  | Tight glow, focused input rings    |

---

## 7. Components

### Button Primary

Primary button component. Filled background with white label text.

**Colors:** primary (brand purple), black, red

**Icon positions:** Icon None, Icon Left, Icon Right, Icon Only

**Sizes:** Regular, Small

**States:** default, hover, active, disabled (reduced opacity)

| Variant       | Background          | Text          | Border           |
|---------------|---------------------|---------------|------------------|
| primary       | `action-bg-primary` | `#FFFFFF`     | none             |
| black         | `neutral/800`       | `#FFFFFF`     | none             |
| red           | `red/500`           | `#FFFFFF`     | none             |
| disabled      | `action-bg-primary-disabled` | `default-text-subtle` | none |

### Button Secondary

Outlined button component. Transparent background with colored border and label.

**Colors:** primary (neutral outlined), purple (brand outlined)

**Icon positions:** Icon None, Icon Left, Icon Right, Icon Only

**Sizes:** Regular, Small

| Variant       | Background    | Text                   | Border                   |
|---------------|---------------|------------------------|--------------------------|
| primary       | transparent   | `default-text-base`    | `default-border-base`    |
| purple        | transparent   | `action-text-primary`  | `action-border-primary`  |

### Link Button

Inline link-style button with no background or border.

**Colors:** primary (brand), black, red

**Variants:** text-only, with left icon, with right icon

Displays as underlined or plain text styled as a clickable action.

### Text Button

Compact inline text button used for contextual actions (e.g., "124 followers").

**Colors:** primary (brand), black

### Toolbar

Inline formatting toolbar with icon buttons: **Bold**, *Italic*, Underline, grid, list (ordered), list (unordered), link.

---

### Input

Text input field component.

**Font sizes:** Large (16px), Regular (14px)

**Variants:**
- Default — plain text input
- Default + Link — input with an inline link action
- Default + Button — input with an inline button (e.g., "Button" label)
- Left Icon — input with a leading icon (e.g., search)

**States:**

| State    | Border                    | Background         | Text                   |
|----------|---------------------------|--------------------|-----------------------|
| enabled  | `default-border-base`     | `default-bg-body`  | `default-text-subtle` (placeholder) |
| hover    | `action-border-primary`   | `default-bg-body`  | `default-text-subtle` |
| focused  | `action-border-primary`   | `default-bg-body`  | `default-text-base`   |
| filled   | `default-border-base`     | `default-bg-body`  | `default-text-base`   |
| error    | `danger-border-base`      | `default-bg-body`  | `danger-text-base`    |
| disabled | `default-border-subtle`   | `default-bg-weak`  | `default-text-weak`   |

### Select

Dropdown select component. Same structure as Input with a trailing chevron icon.

**Font sizes:** Large (16px), Regular (14px)

**Variants:** Default, Left Icon

**States:** enabled, hover, focused, filled, error, disabled (same styling as Input)

### Input + Label

Compound input component with optional label and description above, and optional error message below.

**Configurations:**
- Label only
- Description only
- Label + Description

**Error state:** Displays a red error message below the input field.

### Select + Label

Same compound structure as Input + Label, applied to the Select component.

**Configurations:**
- Label only
- Description only
- Label + Description

**Error state:** Displays a red error message below the select field.

### Label

Standalone label element.

**Variants:**
- Label only
- Label + Description
- Label + required indicator (asterisk icon)
- Label + Description + required indicator

**Error variant:** Label and description shown with red error message and error icon.

### Modal / Dialog

Centered card overlay used for confirmations, terms acceptance, and destructive actions.

**Structure:**
- Emoji/icon at top (centered)
- Title (bold, centered)
- Body text (subtle, centered)
- Primary action button (Button Primary)
- Secondary text action below (e.g., "Reject", "Back")

**Variants:**
- **Confirmation** — brand purple primary button (e.g., "Accept")
- **Destructive** — red primary button (e.g., "Delete account")

**Styling:**
- Background: `default-bg-body` (`#FFFFFF`)
- Border radius: `xl` (24px)
- Shadow: `medium-top` or `dark-top`
- Overlay: semi-transparent dark backdrop
- Body text color: `default-text-medium`
- Link text: `text-link-active`

---

### Navigation

#### Logo

- Wordmark: "Benable" in bold Helvetica Neue, black
- Alternate: "Benable" in brand purple (`action-text-primary`)

#### Nav Links

Desktop links with icon + label. States: Enabled, Hover, Active.

| State    | Icon/Text Color         | Weight  |
|----------|-------------------------|---------|
| Enabled  | `default-text-medium`   | Regular |
| Hover    | `default-text-base`     | Regular |
| Active   | `action-text-primary`   | Bold    |

**Link items:** Discover, Invites, Dashboard, Control (desktop); Discover, Invites, Profile, Menu, Notifications, Search (mobile)

#### Notifications

- Desktop: bell icon with optional red badge (count)
- Mobile: bell icon with optional red badge (count)

#### Header — Desktop

Full-width top bar containing: Logo (left), nav links (center), avatar (right).

**Variants:**
- Logo + avatar only
- Logo + links (Discover, Invites) + avatar
- Logo + links with active state + avatar
- Logo + links (Discover, Dashboard, Invites) + avatar
- With notification bar: Logo + links + search input + BETA badge + notification icon + avatar

#### Header — Mobile

Compact top bar.

**Variants:**
- Logo + search icon
- Logo + search icon + hamburger menu
- Logo + avatar
- Logo + search + bookmark + more (three dots)
- Back arrow + Page Title + grid icon

#### Footer — Mobile

Bottom tab bar with 5 icon + label items.

**Layout variants:**
- Discover, Invites, Notifications, Profile
- Discover, Search, Notifications, Profile

**States:** default (grey), active (brand purple with bold label), notification badge (red dot/count)

#### Menu Link

Vertical list item with label + right chevron. Used in settings and sub-navigation.

#### Menu — Settings

Three-column settings menu layout with sections: Settings, Dashboard, Cashback.

| Settings         | Dashboard        | Cashback                  |
|------------------|------------------|---------------------------|
| Edit profile     | Statistics       | Activity                  |
| Advanced settings| Recent Viewers   | Commission optimizations  |
| Cashback         | Who recommends you| Brands                   |
| Change password  | Cashback         |                           |

---

### Stepper

Horizontal step indicator for multi-step flows.

**Step states:**

| State     | Circle Background       | Circle Text      | Label Weight |
|-----------|-------------------------|------------------|--------------|
| Upcoming  | `action-bg-light`       | `action-text-primary` | Regular |
| Current   | `action-bg-primary`     | `#FFFFFF`        | Bold         |
| Completed | `success-bg-regular`    | `#FFFFFF` (checkmark icon) | Bold |

**Connector line:** horizontal line between steps, color changes from `default-border-base` (upcoming) to `success-border-regular` (completed).

**Layout:** Steps are evenly spaced horizontally. Each step has a numbered/checked circle above a text label.

**Pagination dots:** Small dot indicator variant also available (filled = current, outlined = other).

---

### Spinner

Loading indicator component.

**Variants (Dark theme):**

| Variant  | Style                                          |
|----------|-------------------------------------------------|
| Fill     | Circular ring, partial fill animation            |
| Circles  | Dotted circle pattern, rotating animation        |
| Border   | Arc/crescent shape, rotating animation           |
| Right    | Radial lines (asterisk-style), rotating animation|

**Large variant:** Oversized circular spinner with brand blue gradient fill on a light blue track.

---

### Tabs

Horizontal tab navigation component.

**Variant 1 — Text tabs (no underline):**
- Active: `default-text-base`, bold
- Inactive: `default-text-medium`, regular
- Disabled: `default-text-subtle`

**Variant 2 — Text tabs with badge count:**
- Same as Variant 1 but with a small count badge (e.g., "5") next to label
- Active tab has brand underline indicator

**Variant 3 — Underlined tabs:**
- Active: `default-text-base`, bold, brand-colored bottom border
- Inactive: `default-text-medium`, regular
- Supports 5+ tabs in a row

**Variant 4 — Segmented toggle (pill):**
- Two options (e.g., "List" / "Map") in a pill-shaped container
- Active segment: filled background (brand or dark), white text
- Inactive segment: transparent, dark text
- Two color schemes: dark pill and brand purple pill

---

### Search

#### Global Search

Search input with leading search icon and optional "BETA" badge.

**States:**

| State          | Appearance                                             |
|----------------|--------------------------------------------------------|
| Default        | Collapsed bar with placeholder "Search" + BETA badge   |
| Focused        | Expanded with dropdown showing "Recently viewed" section|
| Focused typing | Expanded with filtered results as user types           |
| Filled         | Collapsed bar showing search term + close (X) icon     |

**Dropdown content:**
- "Recently viewed" header
- Recent search terms (with search icon)
- User results (avatar + name + verified badge + username)

#### In Profile Search

Full-width search bar for searching within a specific user's profile.

**States:**
- Default: placeholder "Search [Name] profile" with search icon
- Focused: brand purple border highlight
- Filled: showing search term (e.g., "Travel")

---

### Recently List Suggestion (Items)

Dropdown list used in search results showing recently viewed items.

**Content types:**
- **Search terms** — search icon + text label (e.g., "sofas", "sofas for living room")
- **User results** — circular avatar + display name (bold) + verified badge (blue checkmark) + username (subtle text below)

**Styling:**
- Section header: "Recently viewed" in `default-text-medium`
- Search term text: `default-text-base`
- Username: `default-text-subtle`, smaller font size
- Verified badge: blue circle checkmark icon
- Avatar: circular, ~36px

---

### Radio Button

Single-select circular control.

**Sizes:** 2 sizes (small and regular)

**States:**

| State    | Appearance                                                |
|----------|-----------------------------------------------------------|
| Active   | Brand purple filled circle with white inner dot           |
| Inactive | Grey outlined circle, empty                               |

**Active color:** `action-bg-primary` (brand purple)
**Inactive color:** `default-border-base` (grey outline)

---

### Toggle Switch

On/off switch control.

**Sizes:** 2 sizes (small and regular)

**States:**

| State    | Track Color              | Thumb Color |
|----------|--------------------------|-------------|
| Active   | `action-bg-primary`      | `#FFFFFF`   |
| Inactive | `default-bg-subtle`      | `#FFFFFF`   |

**Shape:** Pill-shaped track with circular thumb. Thumb slides left (inactive) to right (active).

---

### Checkbox

Multi-select square control.

**Sizes:** 2 sizes (small and regular)

**States:**

| State         | Appearance                                                     |
|---------------|----------------------------------------------------------------|
| Unchecked     | Grey outlined square, empty                                    |
| Indeterminate | Brand purple filled square with white minus/dash icon          |
| Checked       | Brand purple filled square with white checkmark icon           |
| Disabled unchecked  | Light grey outlined square, empty                        |
| Disabled checked    | Light grey filled square with faded checkmark            |

**Active color:** `action-bg-primary` (brand purple)
**Disabled color:** `default-bg-subtle`

**Circle checkbox variant:** Also available as a circular checkbox (Active = brand purple circle with checkmark, Inactive = grey outlined circle).

---

### Chips

Selectable pill-shaped elements for filtering or categorization.

**States:**
- **Selected:** Brand purple/green filled background with white text + checkmark icon
- **Unselected:** Outlined with `default-border-base`, dark text

**Border radius:** `3xl` (fully rounded pill shape)

---

### Tag

Small label component for categorization and metadata.

**Color variants:** Green (brand/cashback), Black (default), Red (alert/error), Grey (disabled/neutral)

**Styles per color:**
- Filled background with white text
- Outlined with colored text
- Light/muted (reduced opacity)

**Optional elements:**
- Currency icon ("$") next to tag
- Dismiss button ("×") for removable tags

**Additional tag types:**
- **Hashtag:** `#label` style, outlined or filled
- **Removable tag:** `label ×` with close action, outlined or filled

---

### Pill (Badge Count)

Small circular count indicator.

**Variants:**
- Red pill — notification/alert count (e.g., "3") with `danger-bg-regular` background
- Green pill — success count (e.g., "3") with `success-bg-regular` background

**Text:** White, bold, centered
**Shape:** Fully circular, small (fits 1–2 digit numbers)

---

### Toast Message

Temporary notification bar appearing at the top or bottom of the screen.

**Themes:**

| Theme | Background            | Text Color              | Close Icon |
|-------|-----------------------|-------------------------|------------|
| Dark  | `default-bg-strong`   | `default-text-inverse`  | `×` white  |
| Light | `default-bg-body`     | `default-text-base`     | `×` dark   |
| Error | `danger-bg-regular`   | `default-text-inverse`  | `×` white  |

**Optional elements:**
- Leading icon (brand spinner, success checkmark, or info/error icon)
- Trailing action button ("Button" as text link)
- Close button ("×")

**Variants matrix:**
- Text only (with/without close)
- Text + icon (with/without close)
- Text + action button (with/without close)
- Text + icon + action button (with/without close)

**Border radius:** `md` (12px) — rounded corners

---

### Inline Alert

Minimal single-line alert for contextual warnings within a form or section.

**Structure:** Info icon (blue) + "Warning message" text

**Styling:**
- Icon: `info-text-base` (blue)
- Text: `default-text-medium`
- No background or border — inline with content

---

### Tooltip

Small dark popover providing contextual information on hover or focus.

**Styling:**
- Background: `default-bg-strong` (dark/near-black)
- Text: `default-text-inverse` (white), small font size
- Border radius: `sm` (8px)
- Pointer/arrow: small triangular indicator pointing to the trigger element

**Example:** "Welcome note is active"

---

## 8. Page Layouts

### Discover Page (Desktop)

The main browsing/explore page of Benable.

**Structure (top to bottom):**
1. **Header** — Logo + nav links (Discover active, Invites) + Search bar with BETA badge + notification icon + avatar
2. **Category bar** — horizontally scrolling chips/tags with emoji icons (Trending, Fashion, Beauty, Food, Travel & Local, Home, Books, Health, Pets, Active life, Wedding, Baby & Kids, Hobbies, tech). Active category has `action-bg-light` background with brand text; inactive are outlined.
3. **List cards grid** — 3-column grid of list cards
4. **User suggestion row** — horizontal row of user recommendation cards
5. **More list cards** — additional rows of 3-column list card grids
6. **Footer** — "Terms of Service | Privacy Policy" centered links

#### List Card

The primary content card on Discover.

**Structure:**
- More menu icon ("...") top-right
- Image grid (2×2 thumbnail collage, rounded corners)
- **Title** — bold, `default-text-base` (e.g., "Athletics")
- **Item count** — subtle text (e.g., "22 items")
- **Author row** — small circular avatar + "User Name" + verified badge (blue checkmark)
- **Description** — 2-line truncated text in `default-text-medium`

**Styling:**
- Background: `default-bg-body`
- Border: `default-border-base`
- Border radius: `md` (12px)
- Shadow: `light-top`
- Padding: `sp-16`

**Variants:**
- Standard (image grid + title + count + author + description)
- With more button ("...")
- Different image grid layouts (2 images, 4 images)

#### User Recommendation Card

Horizontal card for suggesting users to follow.

**Structure:**
- Circular avatar (large, centered)
- Optional dismiss "×" icon
- **Name** — bold, centered
- **Badge/label** — e.g., "New and trending", "Followed by [name]", "Top curator for [category]"
- **Follow button** — Brand purple Button Primary, full width

---

### Discover Page (Mobile)

Same content as desktop, adapted for single-column mobile layout.

**Two layout variants shown:**

**Variant A (large cards):**
- Header: Logo "Benable" + search icon
- Category chips: horizontally scrolling (Trending active, Fashion, Beauty...)
- Full-width list cards stacked vertically
- Footer nav: Discover (active), Invites, Notifications, Profile

**Variant B (compact cards):**
- Same header and category bar
- Cards show image grid + title + item count + author + description
- More compact spacing between cards
- Same footer nav

**Category chips (mobile):** Larger touch targets with emoji icon above label text, rounded card style with `action-bg-light` background for active state.

---

### Invites Page (Desktop)

Page for inviting friends to join Benable.

**Structure (top to bottom):**
1. **Header** — same as Discover, with "Invites" nav link active
2. **Hero section** — decorative sparkle/star illustrations (yellow), centered content:
   - Sparkle emoji icon
   - **Title:** "Invite friends to add their recommendations to Benable!"
   - **Subtitle:** "Benable is invite-only and we think you should decide who gets to join next."
3. **Tab switcher** — "Invite Link" | "Code" (underlined tab style)
4. **Invite link row** — Input showing `benable.com/XKATRJ` + "Copy link" Button Primary
5. **Referrals section:**
   - "Referrals" header with count
   - Referral list (avatar + name + date + "View profile" link)
   - Empty state: illustration + "Invited users who join will appear here"
6. **Footer** — "Terms of Service | Privacy Policy"

### Invites Page (Mobile)

Compact single-column version.

**Structure:**
- Header: "Benable" logo
- Same hero content (sparkle emoji, title, subtitle) — stacked vertically
- Tab switcher: "Invite Link" | "Code"
- Invite link row: input + "Share link" brand button
- Referrals section with count
- Footer nav: Discover, Invites (active), Notifications, Profile

---

## 9. Page Index

All pages/flows in the Benable product. Documented pages are marked with ✅, pending pages with ⬜.

| Status | Page                     |
|--------|--------------------------|
| ✅     | Discover (Desktop & Mobile) |
| ✅     | Invites / Referral       |
| ⬜     | List page                |
| ⬜     | Add list                 |
| ⬜     | Add Rec                  |
| ⬜     | Rec details              |
| ⬜     | Profile page             |
| ⬜     | Settings                 |
| ⬜     | Notifications            |
| ⬜     | Search                   |
| ⬜     | Bookmarks                |
| ⬜     | Dashboard                |
| ⬜     | 404 page                 |
| ⬜     | Onboarding               |
| ⬜     | Web Report / Block flows |
| ⬜     | Utilities                |

---

*Last updated: February 2025*
