# ADMIN WORLD - License Page Design Guidelines

## Design Approach: Reference-Based (Terminal/Cyberpunk Gaming)

**Primary References:** Fallout terminal interfaces, Cyberpunk 2077 UI, DOS/Unix terminal aesthetics, The Matrix digital rain aesthetic, Hacknet game interface

**Core Principle:** Authentic retro-computing experience with cyberpunk enhancement - make users feel like they're accessing classified software documentation on a vintage terminal.

## Typography System

**Primary Font:** VT323 or Press Start 2P (Google Fonts) for all UI text
**Secondary Font:** Share Tech Mono for body content/license text (better readability for long-form)
**Accent Font:** Orbitron for headers and important callouts

**Hierarchy:**
- Page Title: 32px VT323, uppercase, letter-spacing: 0.1em
- Section Headers: 24px VT323, uppercase
- Body Text: 16px Share Tech Mono, line-height: 1.8
- Metadata/Timestamps: 14px VT323, opacity: 0.7

## Layout System

**Spacing Units:** Tailwind 2, 4, 6, 8, 12 (maintaining grid-like precision)

**Container Structure:**
- Full viewport black background (#000000)
- Main content container: max-w-4xl, centered
- Inner padding: p-8 on desktop, p-4 on mobile
- Terminal border: 2px solid neon green (#00ff00) with subtle glow effect

## Core Design Elements

### Terminal Window Frame
- Simulate classic CRT monitor with rounded corners (rounded-lg)
- Window titlebar: h-12, displays "ADMIN_WORLD//LICENSE.EXE" with close/minimize buttons
- Scanline overlay effect (repeating horizontal lines at 50% opacity)
- Subtle screen flicker animation (2-3 second intervals, very subtle)
- CRT curvature suggestion via subtle vignette darkening at edges

### License Page Structure

**Header Section:**
- ASCII art logo for ADMIN WORLD (5-7 lines tall)
- System information bar showing: "USER: [GUEST] | ACCESS LEVEL: PUBLIC | DATE: [CURRENT]"
- Blinking cursor animation after date
- Separation line: "═══════════════════════════════════════" in neon cyan

**Content Organization:**
1. **Preamble Section**
   - "SOFTWARE LICENSE AGREEMENT" title with typewriter reveal animation on load
   - Version number, build date, license type (e.g., "PROPRIETARY v1.0.0")
   - Warning text in red neon: "⚠ UNAUTHORIZED ACCESS PROHIBITED ⚠"

2. **Article Structure**
   - Each article prefixed with terminal-style markers: "[ARTICLE_01]", "[ARTICLE_02]"
   - Numbered subsections using ">>>" prefix
   - Indentation: ml-6 for subsections, ml-12 for sub-subsections
   - Spacing between articles: mt-8

3. **Interactive Elements**
   - Collapsible sections with ▶/▼ ASCII arrows
   - Each section header clickable with hover state (neon pulse)
   - Smooth expand/collapse animations (300ms)

4. **Footer Section**
   - Checksum display: "MD5: [RANDOM_HASH]"
   - Command prompt: "C:\ADMIN_WORLD> ACCEPT [Y/N]_" with blinking cursor
   - Accept/Decline buttons styled as terminal commands

### Component Specifications

**Buttons:**
- Border: 2px solid neon color (green for accept, red for decline)
- Background: black with 20% neon color overlay
- Padding: px-8 py-3
- Text: Uppercase, tracking-wider
- Glow effect on hover (box-shadow expansion)
- Typewriter sound effect on click (audio cue)

**Scrollbar Customization:**
- Width: 12px
- Track: Dark gray (#1a1a1a)
- Thumb: Neon green with digital pattern texture
- Rounded: none (sharp edges)

**Text Highlights:**
- Important terms in CYAN (#00ffff)
- Legal warnings in RED (#ff0066)
- Definitions in GREEN (#00ff00)
- Links/References in MAGENTA (#ff00ff)

### Visual Effects

**CRT Screen Effect:**
- Scanlines: Horizontal lines at 4px intervals, 30% opacity
- RGB chromatic aberration: 1px offset on text (subtle)
- Screen flicker: Random opacity shift between 0.95-1.0 every 3-5s
- Glow bloom: Text should have subtle outer glow (1-2px)

**Background Details:**
- Digital rain effect (Matrix-style) at 10% opacity behind content
- Random hex/binary code scrolling vertically in background
- Occasional "glitch" artifacts (1-2 second flashes of distortion)

### Modal Alternative (if preferred over full page)

**Modal Container:**
- w-full max-w-5xl, h-[85vh]
- Positioned center screen with backdrop: black at 90% opacity
- Border: Double-line terminal box drawing characters
- Header: Fixed position with drag handle simulation
- Content: Scrollable body (overflow-y-auto)
- Footer: Sticky command prompt area

**Entry/Exit Animations:**
- Modal opens with terminal boot sequence (0.5s)
- Closes with screen power-down effect (phosphor fade)

## Images

**No hero images required.** This is a text-heavy legal document interface. However, include:

1. **ASCII Art Logo:** Place at top of license document (generate in-engine or use placeholder comment for custom creation)
2. **Background Texture:** Subtle CRT grid texture overlay on black background (10% opacity)
3. **Glitch Artifacts:** 3-4 small cyberpunk glitch PNG overlays that randomly appear/fade (purely decorative)

**Image specifications:** All images should be optimized for dark backgrounds with transparency, maximum file size 50KB each.

## Accessibility Adaptations

- Maintain terminal aesthetic but ensure text contrast meets WCAG AA (adjust neon brightness as needed)
- Provide "HIGH CONTRAST MODE" toggle that increases text opacity to 100%
- All interactive elements keyboard navigable with visible focus states (double-border glow)
- Screen reader alternative that reads license in plain text format