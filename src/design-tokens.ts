/**
 * DESIGN TOKENS — UniFlow "Cyber-Academia" System
 * Single Source of Truth for all design values.
 * tailwind.config.js reads from this file.
 * Components should use Tailwind classes that map to these tokens.
 * NEVER hardcode these values in components directly.
 */

export const tokens = {
  colors: {
    surface: {
      void: '#000000',       // Absolute black. Only for Ticket Stub bg and 3D canvas backdrop.
      base: '#09090b',       // Zinc 950. THE main app background. Use bg-surface-base.
      elevated: '#18181b',   // Zinc 900. Elevated cards/modals (glassmorphism fallback).
    },
    brand: {
      hyper: '#7c3aed',      // Violet-600. Primary brand. Glows, gradients, active states.
      hyperLight: '#8b5cf6', // Violet-500. Hover state for hyper elements.
      acid: '#a3e635',       // Lime-400. ACTION color. CTAs, Register buttons, success glows.
      acidDark: '#84cc16',   // Lime-500. Hover state for acid elements.
    },
    status: {
      signal: '#f43f5e',     // Rose-500. Errors, "Live" badges, FOMO indicators.
      hacked: '#22c55e',     // Green-500. Ghost Mode UI, success states.
      warning: '#f59e0b',    // Amber-500. Warnings, upcoming deadlines.
    },
    glass: {
      surface: 'rgba(255, 255, 255, 0.03)',  // Card/nav backgrounds.
      border: 'rgba(255, 255, 255, 0.08)',   // 1px borders — catches light.
      hover: 'rgba(255, 255, 255, 0.12)',    // Hover state on glass elements.
      strong: 'rgba(255, 255, 255, 0.15)',   // Active/pressed glass state.
    },
    text: {
      primary: '#ffffff',    // Headings, important content.
      secondary: '#a1a1aa',  // Zinc-400. Body text, descriptions.
      muted: '#52525b',      // Zinc-600. Timestamps, disabled, placeholders.
      inverse: '#09090b',    // Used on acid (lime) buttons — black text on light bg.
    },
  },

  fonts: {
    display: "'Clash Display', 'Cabinet Grotesk', sans-serif",  // h1, h2, large headers.
    body: "'Satoshi', 'General Sans', sans-serif",               // Paragraphs, UI text.
    mono: "'JetBrains Mono', 'Fira Code', monospace",           // Tags, timestamps, stats.
    fallback: "'Inter', system-ui, sans-serif",                  // Fallback only.
  },

  physics: {
    // Use these in framer-motion transition objects
    spring: {
      heavy: { type: 'spring', stiffness: 300, damping: 40 },   // Pull-to-refresh, rubber band.
      snappy: { type: 'spring', stiffness: 500, damping: 30 },  // Toasts, quick actions.
      soft: { type: 'spring', stiffness: 150, damping: 25 },    // Page transitions.
      magnetic: { type: 'spring', stiffness: 150, damping: 15 }, // Magnetic button pull.
    },
    duration: {
      instant: 0.1,
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
      cinematic: 0.8,
    },
  },

  blur: {
    glass: '20px',    // Standard glassmorphism blur.
    heavy: '40px',    // Background blur behind modals.
    subtle: '8px',    // Subtle frosted effect.
  },

  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },
};

export type DesignTokens = typeof tokens;
