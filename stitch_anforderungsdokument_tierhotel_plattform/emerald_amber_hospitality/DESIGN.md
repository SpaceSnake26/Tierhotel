# Design System Strategy: Tierhotel 5 Stern

## 1. Overview & Creative North Star: "The Modern Concierge"
This design system rejects the clinical, "boxed-in" feel of standard animal care platforms in favor of a **High-End Editorial** experience. Our Creative North Star is **"The Modern Concierge"**—a digital environment that feels as attentive, spacious, and premium as a luxury hotel lobby.

To achieve this, we move away from traditional grid-bound layouts. We utilize **intentional asymmetry**, where large editorial type pushes against generous whitespace, and **tonal layering**, where depth is felt through color shifts rather than seen through lines. The sidebar is not a container, but a "clean slate" that anchors the vibrant emerald and orange accents, ensuring the brand feels professional yet deeply warm.

---

## 2. Color Theory & Architectural Surface
The palette is rooted in the "Emerald" (`primary`) and "Orange" (`secondary`) tones, balanced by a sophisticated grayscale that mimics fine stationery.

### The "No-Line" Rule
**Standard 1px solid borders are strictly prohibited for sectioning.** 
Structural boundaries must be defined solely through background color transitions. To separate a sidebar from a main content area, use `surface-container-low` (#f3f4f5) against a `surface` (#f8f9fa) backdrop. This creates a "soft edge" that feels integrated and high-end.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use the surface-container tiers to create "nested" depth:
- **Base Layer:** `surface` (#f8f9fa) for the main application background.
- **Structural Layer:** `surface-container-low` (#f3f4f5) for the sidebar and navigation.
- **Content Layer:** `surface-container-lowest` (#ffffff) for primary cards or content "islands" to give them a natural, bright lift.

### Signature Textures: The "Glass & Gradient" Rule
To elevate the "Emerald" and "Orange" accents:
- **Emerald Depth:** Use a subtle linear gradient from `primary` (#00513f) to `primary_container` (#006b54) for Hero CTAs.
- **Glassmorphism:** For floating overlays (like mobile navigation or status toasts), use `surface_bright` at 80% opacity with a `backdrop-blur` of 12px. This prevents the UI from feeling "pasted on" and allows the warm background tones to bleed through.

---

## 3. Typography: The Editorial Voice
Our typography pairing balances the structural authority of **Manrope** with the approachable modernism of **Plus Jakarta Sans**.

- **Display & Headlines (Manrope):** Large scales (`display-lg` at 3.5rem) should be used with tight letter-spacing and generous bottom margins (`spacing-8`). This creates an "editorial" look that commands attention.
- **Titles & Body (Plus Jakarta Sans):** These are the workhorses. Use `title-md` for sub-headers to maintain a warm, conversational tone.
- **Hierarchy as Identity:** Always lead with a `headline-lg` in `on_surface`. Use `secondary` (#904d00) sparingly for `label-md` to highlight "New" or "Premium" status, adding a touch of warmth to the emerald-heavy interface.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to create "pop"; we use them to create "atmosphere."

- **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card placed on a `surface-container-low` section creates a sophisticated, tactile lift.
- **Ambient Shadows:** If a floating element requires a shadow (e.g., a "Book Now" floating button), use an extra-diffused shadow: `box-shadow: 0 12px 40px rgba(25, 28, 29, 0.06)`. The shadow color is a tinted version of `on-surface`, never pure black.
- **The "Ghost Border" Fallback:** If a border is required for accessibility in input fields, use `outline_variant` (#bec9c3) at **20% opacity**. 

---

## 5. Components & Interface Patterns

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `rounded-md` (0.375rem). Text in `on_primary`.
- **Secondary:** Surface-only. Use `secondary_fixed` background with `on_secondary_fixed` text. No border.
- **State Change:** On hover, shift the background to `primary_fixed` to "illuminate" the component.

### Cards & Lists
**Forbid the use of divider lines.** 
- **Lists:** Separate items using `spacing-3` of vertical white space. Use a `surface-variant` hover state to define the interactive area.
- **Cards:** Use `rounded-lg` (0.5rem) and the Layering Principle. A "Pet Profile" card should be `surface-container-lowest` on a `surface` background.

### Input Fields
- **Styling:** Use `surface-container-highest` for the input background to create a "recessed" feel. 
- **Focus:** Transition the "Ghost Border" to 100% opacity of `primary` (#00513f).

### Custom Component: The "Status Ribbon"
Instead of standard chips, use a vertical "ribbon" on the left edge of cards using the `secondary` (orange) accent to denote "Urgent" or "Special Care" status. This breaks the horizontal rhythm and adds a signature bespoke touch.

---

## 6. Do’s and Don’ts

### Do:
- **Embrace Asymmetry:** Align the sidebar to the left but allow hero text to offset slightly to the right to create visual tension.
- **Use White Space as a Tool:** Use `spacing-12` or `spacing-16` between major sections to let the "5-Star" hotel feeling breathe.
- **Check Contrast:** Ensure all `on_primary` and `on_secondary` text meets WCAG AA standards against their emerald and orange backgrounds.

### Don’t:
- **Don’t use 1px dividers:** Never use a line to separate content. Use a background color shift or `spacing-6`.
- **Don’t use "Default" Shadows:** Avoid the CSS `box-shadow: 0 2px 4px rgba(0,0,0,0.5)`. It feels cheap and dated.
- **Don’t over-round:** Keep the `rounded-md` (0.375rem) for most elements to maintain a professional, "tailored" architectural feel. Avoid the "bubble" look of `rounded-full` except for avatars.