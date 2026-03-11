# AGENTS.md — UniFlow Coding Laws
> **READ THIS FILE BEFORE TOUCHING ANY CODE.**
> This is the single source of architectural truth for UniFlow.
> Violating these rules will break the product.

---

## 🔴 ABSOLUTE RULES (Never Break)

1. **NEVER hardcode colors.** Use only Tailwind tokens defined in `tailwind.config.js` which pulls from `src/design-tokens.ts`.
2. **NEVER create a new component** if one already exists in `/src/components/ui/` or `/src/components/features/`. Check `COMPONENT_REGISTRY.md` first.
3. **NEVER install a new library** without checking `package.json` first. If similar functionality exists, use what's installed.
4. **ALWAYS use `useStore()`** from `/src/store/useStore.ts` for ALL global state. Never use local `useState` for data that is shared across pages.
5. **ALWAYS use the haptics utility** from `/src/utils/hapticFeedback.ts` for ALL touch interactions (`haptics.tap()`, `haptics.success()`, `haptics.error()`).
6. **NEVER touch `firebase.ts` or `firestore.rules`** without explicit user instruction. These are critical infrastructure.
7. **NEVER use CSS keyframes or inline `style` animations.** ALL animations must use `framer-motion`.
8. **NEVER use arbitrary Tailwind values** like `p-[13px]` or `w-[342px]`. Use the Tailwind scale (`p-3`, `p-4`) or the custom tokens.
9. **ALWAYS import icons from `lucide-react`.** Do not install heroicons, react-icons, or any other icon library.
10. **Dark mode is DEFAULT.** Never write styles that only work in light mode.

---

## 📁 FOLDER RULES

| What you're building | Where it goes |
| :--- | :--- |
| Reusable UI primitives (Button, Card, Modal) | `/src/components/ui/` |
| Feature-level smart components (Feed, Video) | `/src/components/features/` |
| Bug/feedback tools | `/src/components/feedback/` |
| Full page views (routed) | `/src/pages/` |
| Global Zustand state | `/src/store/useStore.ts` |
| Firebase API calls | `/src/services/firebaseService.ts` |
| Firebase config/init | `/src/services/firebase.ts` (read-only) |
| React custom hooks | `/src/hooks/` |
| One-off utility functions | `/src/utils/` |
| TypeScript interfaces/types | `/src/types/` |
| CSS design system | `/src/styles/` |

---

## 🎨 STYLE RULES

- **Primary Background:** Always `bg-surface-base` (`#09090b`). Never `bg-black` or `bg-gray-950`.
- **Text Primary:** `text-white`. **Text Secondary:** `text-zinc-400`. **Text Muted:** `text-zinc-600`.
- **Brand Color:** `bg-brand-hyper` (`#7c3aed`). Never `bg-purple-600` directly.
- **Action Color:** `bg-brand-acid` (`#a3e635`). This is for primary CTAs only.
- **Glass effect:** `bg-glass-surface backdrop-blur-xl border border-glass-border`.
- **Spacing:** Use Tailwind scale. Preferred values: `p-4`, `p-5`, `p-6`, `gap-3`, `gap-4`.
- **Border radius:** `rounded-2xl` for cards, `rounded-full` for pills/badges.

---

## ⚡ ANIMATION RULES

- **Spring physics (heavy feel):** `{ type: 'spring', stiffness: 300, damping: 40 }`
- **Spring physics (snappy):** `{ type: 'spring', stiffness: 500, damping: 30 }`
- **Page transitions:** `{ duration: 0.3, ease: 'easeOut' }`
- **Hover scale:** `whileHover={{ scale: 1.02 }}` — never more than 1.05.
- **Tap scale:** `whileTap={{ scale: 0.96 }}` — never less than 0.90.

---

## 🔥 FIREBASE RULES

- **READ** operations: Use `firebaseService.ts` functions. Never call Firestore directly from a component.
- **WRITE** operations: Only through `useStore.ts` actions (`addMediaItem`, `toggleBookmark`, `updateEngagement`).
- **AUTH:** Currently using anonymous `localStorage` mock in `firebase.ts → getAnonymousUserId()`. This is a known issue. Do NOT refactor Auth unless the active TASK.md says so.
- **Collections:** `events`, `analytics`, `feedback_reports`, `feature_usage`, `page_views`. Do not create new collections without instruction.

---

## ✅ DEFINITION OF DONE (Every task)

Before marking any task complete, verify:
- [ ] App compiles with `npm run build` — zero errors.
- [ ] No new `console.error` warnings in browser devtools.
- [ ] No hardcoded hex colors in any `.tsx` or `.css` file.
- [ ] `COMPONENT_REGISTRY.md` is updated if a new component was added.
- [ ] `CURRENT_STATE.md` is updated to reflect what changed.
