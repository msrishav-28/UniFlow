# VISUAL DNA: UniFlow (The "Cyber-Academia" Standard)

> **Role:** Design Specification for AI Visual Expert  
> **Objective:** Revamp the UniFlow functional prototype into a $10k "Cinematic" Social Product.  
> **Target Persona:** Indian Gen Z Student (18-24). Mobile-first, visual learner, status-conscious.

---

## 1. Core Aesthetic: "Cyber-Academia"
**Concept:** A fusion of high-fashion academic structure (Notion/Linear) and chaotic digital energy (Euphoria/Cyberpunk). It is **not** Sci-Fi Space (too cold). It is **Digital Campus** (electric, social, alive).

### **The "Vibe Check" Keywords**
*   **Tactile:** Interfaces should feel heavy, sticky, and physical (Rubber-banding, Haptic snaps).
*   **Electric:** Colors should "burn" against the dark background.
*   **Holographic:** Depth is achieved through glass refraction, not just shadows.
*   **Imperfect:** Use digital noise and glitches to break the sterile "SaaS" look.

---

## 2. Color System ("The Neon Dark")

We are abandoning the "Safe Blue" (#3b82f6). The new world is **Zinc & Neon**.

### **Base Layers**
*   `surface-void`: `#000000` (The absolute bottom layer).
*   `surface-base`: `#09090b` (Zinc 950 - The primary background).
*   `surface-glass`: `rgba(255, 255, 255, 0.03)` + `backdrop-blur-xl`.
*   `border-glass`: `rgba(255, 255, 255, 0.08)` (1px solid).

### **Brand Accents**
*   **Primary (The Magic):** `Hyper-Violet` -> `#7c3aed` (Violet-600) to `#8b5cf6` (Violet-500).
    *   *Usage:* Gradients, Active States, Main Brand Glows.
*   **Secondary (The Action):** `Electric-Lime` -> `#a3e635` (Lime-400).
    *   *Usage:* Primary Buttons (FAB), "Register" Actions, Success States. High contrast against black.
*   **Alert (The Glitch):** `Signal-Red` -> `#f43f5e` (Rose-500).
    *   *Usage:* Errors, "Live" indicators, FOMO tags.

---

## 3. Typography ("Hype" Architecture)

Abandon `Inter` for everything. We need character.

### **Headings: The "Structure"**
*   **Font Family:** **Clash Display** (Cabinet Grotesk as alternative).
*   **Characteristics:** High aperture, "cut" strokes. Looks technical but expensive.
*   **Usage:**
    *   `h1` (Onboarding): Uppercase, Tracking-Tight (-0.02em).
    *   `h2` (Feed Headers): Sentence Case, Heavy Weight (600).

### **Body: The "Flow"**
*   **Font Family:** **Satoshi** or **General Sans**.
*   **Characteristics:** Geometric sans-serif with "quirks" (e.g., unique 'g' or 'a') to avoid the generic SaaS look.
*   **Usage:** Event descriptions, user comments.

### **Data: The "Code"**
*   **Font Family:** **JetBrains Mono**.
*   **Characteristics:** Monospace, technical.
*   **Usage:**
    *   Timestamps (`10:00 AM`)
    *   Tags (`#TECH_FEST`)
    *   Stats (`1.2k Views`)

---

## 4. 3D Environment (React Three Fiber)

The background is not static. It is a "Living Data Stream".

### **The Scene**
*   **Canvas:** Full viewport, `z-index: -1`.
*   **Lighting:** Ambient light (Violet), Point light (Lime) following the cursor/scroll.
*   **Particles:** A vertical stream of "Digital Dust" (0.5% opacity) moving upwards, mimicking a data feed.

### **The "Hero" Artifacts**
Floating 3D glass icons that represent the "College State".
*   **Material:** `MeshTransmissionMaterial` (Drei).
    *   `transmission`: 1.0 (Glass-like).
    *   `thickness`: 2.0 (Thick optical glass).
    *   `roughness`: 0.0 to 0.1 (Polished).
    *   `chromaticAberration`: 0.05 (Subtle prism effect).
*   **Objects:**
    *   *Graduation Cap:* Rotates slowly.
    *   *Notification Bubble:* Bobs up and down.
    *   *Lightning Bolt:* Spins on interaction.

---

## 5. Motion Physics & Interaction (Framer Motion)

The app must feel "Sticky" and "Heavy".

### **The "Rubber Band" Feed**
*   **Trigger:** Pull-to-refresh or hitting the end of a list.
*   **Physics:**
    *   `damping`: 40 (Heavy feel).
    *   `stiffness`: 300 (Strong snap back).
*   **Visual:** The entire container `scaleY` stretches to 1.05x.

### **The "Magnetic" Touch**
*   **Target:** Floating Action Buttons (FAB) and Bottom Nav.
*   **Behavior:** Elements gently "pull" towards the user's thumb position before they even tap (prediction) or on press.

### **The "Tilt" Cards**
*   **Component:** `FeedItem`.
*   **Behavior:**
    *   `whileHover`/`whileTap`: `rotateX(5deg)`, `rotateY(5deg)`.
    *   Perspective: `1000px`.
    *   Result: Cards feel like physical plastic objects, not flat divs.

---

## 6. Component-Level Specifications

### **A. The "Holographic" ID Card**
*   **Container:** `aspect-ratio: 1.586` (Credit Card).
*   **Layers:**
    1.  Base: Black plastic texture.
    2.  Middle: User Data (White text).
    3.  Top: **Holographic Foil Shader**.
*   **Shader Logic:** Calculate `dot(viewDirection, normal)` to shift colors (Rainbow/Iridescent) based on gyroscope tilt.

### **B. The "Ticket Stub" (Share Artifact)**
*   **Layout:** "Boarding Pass" style (Left: Event Image, Right: Details + QR).
*   **Style:**
    *   Background: `#000000`.
    *   Accent: **Electric Lime** dashed lines.
    *   Texture: "Perforated" edge pattern using CSS `mask-image`.

### **C. The "Ghost Mode" Trigger**
*   **Gesture:** Long-press (3s) on the header.
*   **Transition:**
    *   *Glitch Effect:* RGB Shift on the entire DOM for 0.2s.
    *   *Invert:* Colors swap to High-Contrast Green/Black (Matrix/Terminal vibe).

---

## 7. Implementation Assets Checklist

*   **Textures:**
    *   `noise-gradient.svg` (Overlay).
    *   `foil-map.jpg` (For ID card reflection).
*   **Libraries:**
    *   `@react-three/fiber`
    *   `@react-three/drei`
    *   `framer-motion`
    *   `use-sound` (Audio feedback).
*   **Icons:**
    *   Custom SVG set (thick stroke, sharp corners) to replace Lucide.

> **Final Instruction to AI Designer:**
> Do not "clean up" the design to make it safe. The goal is **organized chaos**. It should look like a "hacked" version of a premium app. **Bold, Loud, Dark.**
