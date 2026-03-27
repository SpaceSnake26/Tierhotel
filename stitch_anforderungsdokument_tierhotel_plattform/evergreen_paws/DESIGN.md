# Design System Document: The Editorial Sanctuary

This design system is a high-end framework crafted specifically for pet-care management. It moves away from the sterile, "SaaS-default" aesthetic toward a sophisticated, editorial experience. By balancing the authority of deep forest tones with the warmth of organic orange accents, we create a space that feels both professionally managed and deeply compassionate.

---

## 1. Overview & Creative North Star

**Creative North Star: "The Curated Haven"**
The design system rejects the rigid, boxy constraints of traditional admin dashboards. Instead, it treats pet management as a high-touch, editorial service. We achieve this through:
*   **Intentional Asymmetry:** Breaking the 12-column grid with staggered card placements to mimic a premium magazine layout.
*   **Breathable Depth:** Using expansive white space (Spacing `20` and `24`) to reduce cognitive load in a high-activity environment.
*   **Textural Sophistication:** Moving beyond flat colors to embrace glassmorphism and soft tonal layering.

---

## 2. Colors & Surface Logic

Our palette balances the "Professional Stability" of deep greens with the "Friendly Energy" of warm oranges.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be established solely through:
1.  **Background Color Shifts:** A `surface-container-low` section sitting on a `surface` background.
2.  **Tonal Transitions:** Using the `surface-container` tiers (Lowest to Highest) to denote nested importance.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine, heavy-stock paper.
*   **Base:** `surface` (#f9f9ff)
*   **Primary Containers:** `surface-container-low` (#f0f3ff) for broad background regions.
*   **Active Elements:** `surface-container-highest` (#d8e3fb) for interactive sidebars or high-focus widgets.
*   **Floating Details:** `surface-container-lowest` (#ffffff) for the "top-most" cards to create a natural, bright lift.

### Signature Textures
*   **The Glass Rule:** For floating modals or "quick-view" pet profiles, use `surface_variant` with a 60% opacity and a `24px` backdrop-blur.
*   **The Hero Gradient:** Use a subtle linear gradient from `primary` (#003527) to `primary_container` (#064e3b) for main action areas to provide a "soulful" depth that flat hex codes lack.

---

## 3. Typography: The Editorial Voice

We pair **Manrope** (Display/Headline) for a modern, architectural feel with **Inter** (Body/Label) for clinical legibility.

*   **Display-LG (Manrope, 3.5rem):** Reserved for high-impact data (e.g., total occupancy count). Letter spacing should be set to `-0.02em`.
*   **Headline-MD (Manrope, 1.75rem):** Used for section titles like "Daily Arrivals."
*   **Title-LG (Inter, 1.375rem):** The standard for pet names and client headers. Use a Semi-Bold weight (600).
*   **Body-MD (Inter, 0.875rem):** The workhorse for pet notes and medical instructions.
*   **Label-SM (Inter, 0.6875rem):** All-caps with `0.05em` letter spacing for status tags (e.g., "OVERDUE").

---

## 4. Elevation & Depth

We eschew "Material Design" style drop-shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` card placed on a `surface-container-low` background creates a soft, natural lift without a single shadow.
*   **Ambient Shadows:** For floating action buttons or menus, use a "Tinted Ambient Shadow": 
    *   `box-shadow: 0 20px 40px rgba(17, 28, 45, 0.06);` (Using a tint of `on-surface`).
*   **The "Ghost Border" Fallback:** If a container requires definition against a similar background (e.g., in high-contrast Info-Screens), use `outline_variant` at **15% opacity**. Never use 100% opaque lines.

---

## 5. Components

### Cards & Data Tables
*   **Card Styling:** Use `xl` (1.5rem) corner radius for main dashboard cards. No borders. Use `surface-container-lowest` as the fill.
*   **Data Tables:** Forbid divider lines. Use Spacing `4` (0.9rem) for vertical padding between rows. Every second row should use a `surface-container-low` background to guide the eye.

### Status Badges (The "Pet-Friendly" Indicators)
Badges must be pill-shaped (`full` roundedness).
*   **Open:** `tertiary_fixed` (#89f5e7) with `on_tertiary_fixed_variant` text.
*   **In Progress:** `secondary_fixed` (#ffdbca) with `on_secondary_fixed_variant` text.
*   **Overdue:** `error_container` (#ffdad6) with `on_error_container` text.

### Shift Blocks
Color-coded blocks for staff schedules.
*   **Morning Shift:** `primary_fixed` (#b0f0d6).
*   **Night Shift:** `inverse_surface` (#263143) with `inverse_on_surface` text.

### Buttons
*   **Primary:** Fill with the Hero Gradient (`primary` to `primary_container`). `md` (0.75rem) roundedness. 
*   **Secondary:** `surface_container_highest` fill with `primary` text. No border.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical padding. Give more room to the top and left of a container (Spacing `16`) than the bottom to create a "weighted" editorial look.
*   **Do** use `secondary` (#9d4300) sparingly as a "warm touchpoint"—ideal for "Walkies" icons or "Feeding Time" alerts.
*   **Do** use high-contrast text (`on_surface` #111c2d) against light backgrounds for the Info-Screen to ensure staff can read at a distance.

### Don't
*   **Don't** use 1px borders to separate content. It fragments the UI and makes it feel "cheap."
*   **Don't** use pure black (#000000) for shadows. Always use a low-opacity tint of `on_surface`.
*   **Don't** cram cards together. If the layout feels tight, increase the spacing token (e.g., move from `8` to `12`).