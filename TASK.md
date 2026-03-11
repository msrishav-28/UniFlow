# TASK.md — Active Task
> **ONE TASK AT A TIME. ALWAYS.**
> Complete and check off all items before moving to the next task.
> Update this file at the start of every coding session.

---

## 🎯 ACTIVE TASK

**Task:** Migrate Design Tokens — Phase 1 (Colors & Fonts)
**Priority:** 🔴 Critical
**Status:** Not Started

### Context
The app currently uses hardcoded Tailwind blue (`blue-500`, `primary-600`) and the default `Inter` font. We need to migrate to the "Cyber-Academia" design system before building any new features.

### Steps
1. [ ] Install fonts: Add `Clash Display`, `Satoshi`, `JetBrains Mono` via Google Fonts / CDN in `index.html`.
2. [ ] Update `tailwind.config.js` — Add custom color tokens from `src/design-tokens.ts`.
3. [ ] Update `src/styles/premium-design-system.css` — Replace all `--primary-*` variables with new tokens.
4. [ ] Global find-and-replace: `text-blue-500` → `text-brand-hyper`, `bg-blue-500` → `bg-brand-hyper`.
5. [ ] Global find-and-replace: All CTA buttons using blue → `bg-brand-acid text-black`.
6. [ ] Update `index.css` — Set `font-family` to `Satoshi` for body, `Clash Display` for headings.
7. [ ] Verify app compiles (`npm run build`) with zero errors.

### Definition of Done
- [ ] Zero hardcoded hex colors in `.tsx` files.
- [ ] Zero `blue-*` Tailwind classes in `.tsx` files.
- [ ] App renders correctly in dark mode with new palette.
- [ ] `CURRENT_STATE.md` updated to mark Design Tokens as ✅ complete.

---

## 📋 TASK BACKLOG (Do these in order after active task)

1. **Firestore Security Rules** — Create `firestore.rules` with admin-only write access.
2. **Firebase Google Auth** — Replace `getAnonymousUserId()` with real `signInWithPopup(GoogleAuthProvider)`.
3. **Onboarding Screen** — Build `/src/pages/Onboarding.tsx` with College Selector.
4. **Floating Island Navigation** — Refactor `PremiumNavigation.tsx` to shrink on scroll.
5. **Ticket Stub Generator** — Build `/src/components/features/TicketStub.tsx`.
6. **Holographic ID Card** — Build `/src/components/features/HolographicID.tsx` with R3F.
7. **Ghost Mode** — Build `/src/components/features/GhostFeed.tsx`.
