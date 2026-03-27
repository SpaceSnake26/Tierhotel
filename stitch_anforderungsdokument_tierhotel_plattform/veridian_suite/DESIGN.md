```markdown
# Design System Strategy: The Concierge Aesthetic

## 1. Overview & Creative North Star: "The Digital Atrium"
This design system is built upon the "Digital Atrium" philosophy. Much like a high-end conservatory or a luxury hotel lobby, the interface must feel flooded with natural light, structurally airy, and impeccably organized. We are moving away from the "app" look and toward a "curated editorial" experience.

To achieve this, we break the standard grid-and-line template. Instead of boxes and borders, we use **intentional asymmetry** and **tonal layering**. Elements should appear to float within a sun-drenched space, using the emerald green (`primary`) not as a heavy background, but as a sophisticated "signature" stroke—much like a wax seal on a premium invitation.

## 2. Colors: Tonal Depth & The "No-Line" Rule
The palette is dominated by "High-Key" neutrals to maintain a 5-star concierge feel.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. Traditional dividers create visual "noise" that cheapens the premium feel. 
- **Definition through Shift:** Separate the sidebar from the main content by placing a `surface` sidebar against a `surface-container-low` content area.
- **Definition through Space:** Use the Spacing Scale (`8` or `12`) to create mental boundaries rather than physical ones.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, fine papers.
- **Base Layer:** `background` (#f8faf9)
- **Secondary Sections:** `surface-container-low` (#f2f4f3)
- **Elevated Floating Cards:** `surface-container-lowest` (#ffffff)
- **Interaction/Active States:** `surface-container-high` (#e6e9e8)

### The "Glass & Gradient" Rule
To add "soul" to the emerald green:
- **Signature Gradient:** Use a subtle linear gradient from `primary` (#00513f) to `primary_container` (#006b54) for primary CTAs. This prevents the green from feeling "flat" or "corporate."
- **Glassmorphism:** For floating navigation or modal overlays, use `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur. This keeps the "Light and Bright" promise even when layering complex information.

## 3. Typography: The Editorial Voice
We use **Manrope** exclusively. Its geometric yet approachable curves provide a modern, high-end concierge aesthetic.

- **Display (The Statement):** Use `display-lg` for hero welcomes. Use tight letter-spacing (-0.02em) to make it feel authoritative.
- **Headlines (The Guide):** `headline-md` should be used for section headers. Always pair these with generous top-padding to let the typography "breathe."
- **Body (The Service):** `body-lg` is the workhorse. Ensure a line-height of at least 1.6 to maintain the airy feel.
- **Labels (The Detail):** Use `label-md` in `on_surface_variant` (#3e4944) for secondary metadata. It should be legible but never compete with the primary emerald actions.

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop"; we use them to create "atmosphere."

- **The Layering Principle:** Depth is achieved by nesting. A `surface-container-lowest` card sitting on a `surface-container` background creates a soft, natural lift.
- **Ambient Shadows:** If an element must float (e.g., a booking modal), use a shadow color tinted with the primary hue: `rgba(0, 81, 63, 0.04)` with a `48px` blur and `0px` offset. It should feel like a soft glow, not a drop shadow.
- **The Ghost Border:** If a boundary is required for accessibility, use `outline_variant` (#bec9c3) at **15% opacity**. It should be barely perceptible—a "whisper" of a line.

## 5. Components: The Concierge Toolkit

### Buttons: The Signature Touch
- **Primary:** Gradient from `primary` to `primary_container`. Corner radius: `lg` (0.5rem). Text: `on_primary` (White).
- **Secondary:** `surface-container-high` background with `primary` text. No border.
- **Tertiary:** Pure text in `primary` with a `primary_fixed` underline that only appears on hover.

### Cards: Editorial Containers
- **Forbid Dividers:** Never use lines to separate a card's title from its body. Use a `1.5` (0.5rem) spacing gap or a slight font-weight shift.
- **Styling:** Use `surface-container-lowest` with a `xl` (0.75rem) corner radius.

### Input Fields: Soft Precision
- **State:** Inactive inputs should be `surface-container-low` with no border. 
- **Focus State:** Transition to a `surface-container-lowest` background with a 1px `primary` "Ghost Border" (20% opacity).

### Specialized Components
- **The "Service Timeline":** For tracking a pet's stay, use a vertical line in `outline_variant` at 10% opacity, with "milestone" nodes in `primary`.
- **The "Status Pill":** Use `secondary_container` (#c8eadc) backgrounds with `on_secondary_container` (#4c6b5f) text for a calm, trustworthy "All clear" indicator.

## 6. Do’s and Don’ts

### Do:
- **Embrace White Space:** If a layout feels "busy," increase the spacing to the next tier in the scale (e.g., move from `6` to `8`).
- **Use Intentional Asymmetry:** Align text to the left but allow images or secondary cards to offset to the right to create an editorial, magazine-like flow.
- **Maintain High Contrast for Text:** Use `on_surface` (#191c1c) for all primary reading paths to ensure 5-star accessibility.

### Don’t:
- **Don't use Dark Sidebars:** The sidebar must remain `surface_container_lowest` (#ffffff) or `surface` (#f8faf9). 
- **Don't use Heavy Shadows:** Avoid anything that looks like a standard Material Design "Level 3" shadow. 
- **Don't use Hard Corners:** Avoid `none` or `sm` rounding. Everything should feel soft to the touch (use `md` to `xl`).
- **Don't use Pure Black:** Use `on_background` (#191c1c) for text to keep the palette organic and premium.```