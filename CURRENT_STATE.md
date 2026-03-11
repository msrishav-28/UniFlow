# Current State — UniFlow
> **UPDATE THIS FILE AFTER EVERY CODING SESSION.**
> This prevents AI agents from re-building things that already work
> or breaking things that are currently stable.

---

## ✅ WORKING — DO NOT TOUCH

These features are confirmed working. Do not refactor, restructure, or "improve" these unless explicitly instructed.

### Core Feed
- `PremiumVerticalFeed.tsx` — Virtualized vertical scroll, active item tracking, visible range optimization.
- `PremiumFeedItem` (inside feed file) — Engagement timer, bookmark toggle, share handler, auto-hide info overlay.
- Pull-to-refresh gesture with `framer-motion` physics.
- Online/offline detection with animated banner.
- Progress indicator (current index / total).

### Media Rendering
- `PDFStackView.tsx` — Stack preview, full-screen reader, zoom controls, page navigation, engagement tracking.
- `ProgressiveImage.tsx` — Blur-up lazy image loading.
- `VideoPromotion.tsx` — Autoplay/pause based on viewport.
- `lazyComponents.tsx` — React.lazy wrappers preventing heavy bundle on initial load.

### State Management
- `useStore.ts` (Zustand + Persist) — `mediaItems`, `user`, `currentCategory`, `isLoading`, `error`, `lastRefresh`.
- `initializeFirebaseData()` — Sets up real-time `onSnapshot` listener on Firestore `events` collection.
- `toggleBookmark()` — Optimistic UI update with Firebase sync.
- `updateEngagement()` — Updates `viewCount` and `engagementTime` on Firestore.
- Zustand persistence of `user` and `lastRefresh` to `localStorage`.
- Firestore unsubscribe cleanup on `window.beforeunload`.

### Services
- `analyticsService.ts` — Dual-logging to Google Analytics + Firestore `analytics` collection. Tracks page views, events, feature usage.
- `FeedbackWidget.tsx` — Bug reports with `html2canvas` screenshot. Submits to Firestore `feedback_reports`.
- `firebaseService.ts` — Paginated event fetching (50 items), engagement updates.

### Navigation & Gestures
- `GestureNavigation.tsx` — Edge-swipe back/forward.
- `PremiumNavigation.tsx` — Bottom tab bar (Home, Categories, Add, Saved, Profile).
- `ErrorBoundary.tsx` — Global React error catching.

### Hooks
- `useViewportLoader.ts` — IntersectionObserver for lazy rendering.
- `useGestures.ts` — Touch swipe detection.
- `useFirebase.ts` — Firebase connection state.

---

## 🔨 IN PROGRESS — HANDLE WITH CARE

| Item | Status | Notes |
| :--- | :--- | :--- |
| **Auth** | 🔨 Mocked | `getAnonymousUserId()` in `firebase.ts` uses `localStorage`. Mid-migration plan to Firebase Google Auth. Do NOT change until TASK.md says so. |
| **Design Tokens** | 🔨 Planned | Currently uses hardcoded Tailwind blue classes (`blue-500`, `primary-500`). Migration to `brand-hyper` (violet) and `brand-acid` (lime) pending. |
| **Firestore Security Rules** | 🔨 Missing | No `firestore.rules` file exists. Database is currently open. High priority fix. |
| **Bookmark Firebase Sync** | 🔨 Partial | Bookmark code in `useStore.ts` has the Firebase update commented out. Only saves locally. |

---

## ❌ NOT STARTED — SAFE TO BUILD

These features have been designed and planned but have zero code yet.

| Feature | Planned File | Priority |
| :--- | :--- | :--- |
| **Onboarding Screen** | `/src/pages/Onboarding.tsx` | 🔴 High — Empty state is a UX blocker |
| **College Selector Modal** | `/src/components/ui/CollegeSelector.tsx` | 🔴 High |
| **Firebase Google Auth** | Modify `/src/services/firebase.ts` | 🔴 High |
| **Floating Island Navigation** | Replace `PremiumNavigation.tsx` | 🟡 Medium |
| **Holographic ID Card** | `/src/components/features/HolographicID.tsx` | 🟡 Medium |
| **Ticket Stub Share** | `/src/components/features/TicketStub.tsx` | 🟡 Medium |
| **Ghost Mode Feed** | `/src/components/features/GhostFeed.tsx` | 🟢 Low (fun feature) |
| **"Cyber-Academia" Design Revamp** | `tailwind.config.js` + `premium-design-system.css` | 🔴 High |
| **Clash Display / Satoshi Fonts** | `index.html` + CSS | 🔴 High |
| **React Three Fiber Background** | `/src/components/ui/Scene3D.tsx` | 🟢 Low |

---

## 🐛 KNOWN BUGS

| Bug | File | Severity | Notes |
| :--- | :--- | :--- | :--- |
| Feedback FAB overlaps feed content | `FeedbackWidget.tsx` | Low | Should be moved to Profile page |
| Close button on PDF modal is hard to reach on tall phones | `PDFStackView.tsx` | Low | Needs swipe-down-to-close gesture |
| `isActive` prop in `PDFStackView` is unused | `PDFStackView.tsx` | Low | Prefixed with `_isActive` to suppress warning |
| Mock user hardcoded as "Alex Chen" | `useStore.ts` | High | `initialUser` object has fake name/avatar/email |
