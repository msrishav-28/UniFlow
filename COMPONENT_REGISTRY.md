# Component Registry — UniFlow
> **CHECK THIS BEFORE CREATING ANY NEW COMPONENT.**
> If something similar exists here, EXTEND it. Never duplicate.
> After creating a new component, ADD it to this list immediately.

---

## 📦 UI Primitives (`/src/components/ui/`)

| Component | File | Purpose | Props |
| :--- | :--- | :--- | :--- |
| **PDF Viewer** | `PDFStackView.tsx` | Full-screen PDF reader with stack preview, zoom, and page navigation. Uses `react-pdf`. | `pdfUrl`, `title`, `pageCount`, `coverImage`, `isActive`, `onEngagement` |
| **Navigation Bar** | `PremiumNavigation.tsx` | Fixed bottom tab bar with glass effect. Routes: Home, Categories, Add, Saved, Profile. | None (reads from router) |
| **Progressive Image** | `ProgressiveImage.tsx` | Lazy-loads images with blur-up effect. Use this for ALL images in the feed. | `src`, `alt`, `className` |
| **Skeleton Loaders** | `Skeleton.tsx` | Loading placeholders. Exports: `FeedSkeleton`, `CardSkeleton`. | None |

---

## 🚀 Feature Components (`/src/components/features/`)

| Component | File | Purpose | Props |
| :--- | :--- | :--- | :--- |
| **Vertical Feed** | `PremiumVerticalFeed.tsx` | TikTok-style vertical scrolling feed. Handles virtualization, pull-to-refresh, online/offline detection, and per-item engagement tracking. **This is the core component.** | `items: MediaItem[]` |
| **Video Promo** | `VideoPromotion.tsx` | Autoplay video component for feed items of type `video`. | (check file for props) |

---

## 💬 Feedback (`/src/components/feedback/`)

| Component | File | Purpose |
| :--- | :--- | :--- |
| **Feedback Widget** | `FeedbackWidget.tsx` | Floating FAB that opens a modal for bug reports, feedback, and feature requests. Uses `html2canvas` for screenshot capture. Submits to `feedback_reports` Firestore collection. |

---

## 🌐 Root Components (`/src/components/`)

| Component | File | Purpose |
| :--- | :--- | :--- |
| **Error Boundary** | `ErrorBoundary.tsx` | Wraps the app. Catches React runtime errors and shows a fallback UI. |
| **Gesture Navigation** | `GestureNavigation.tsx` | Handles edge-swipe navigation (iOS-style back/forward gestures). |

---

## 📄 Pages (`/src/pages/`)

| Page | File | Route | Status |
| :--- | :--- | :--- | :--- |
| **Home** | `Home.tsx` | `/` | ✅ Working |
| **Categories** | `Categories.tsx` | `/categories` | ✅ Working |
| **Add Event** | `PremiumAddPage.tsx` | `/add` | ✅ Working (needs auth gate) |
| **Saved Events** | `Saved.tsx` | `/saved` | ✅ Working |
| **Profile** | `Profile.tsx` | `/profile` | ✅ Working (uses mock user) |
| **Onboarding** | _not created_ | `/onboarding` | ❌ Not Started |

---

## 🪝 Hooks (`/src/hooks/`)

| Hook | File | Purpose |
| :--- | :--- | :--- |
| `useFirebase` | `useFirebase.ts` | Wraps Firebase initialization and connection state. |
| `useGestures` | `useGestures.ts` | Provides swipe gesture detection (up/down/left/right). |
| `useViewportLoader` | `useViewportLoader.ts` | IntersectionObserver hook. Returns `hasBeenInViewport` boolean for lazy loading. |

---

## 🛠️ Utils (`/src/utils/`)

| Utility | File | Purpose |
| :--- | :--- | :--- |
| **Haptics** | `hapticFeedback.ts` | Vibration engine. Use `haptics.tap()`, `haptics.success()`, `haptics.error()`. |
| **Animations** | `animations.ts` | Shared `framer-motion` animation variants. |
| **Icons** | `icons.tsx` | Custom SVG icon wrappers (if Lucide doesn't have what's needed). |
| **Image Optimizer** | `imageOptimizer.ts` | Resizes/compresses images before upload. |
| **Lazy Components** | `lazyComponents.tsx` | React.lazy() wrappers for heavy components (PDF viewer, etc). |

---

## 🗄️ Services (`/src/services/`)

| Service | File | Purpose |
| :--- | :--- | :--- |
| **Firebase Init** | `firebase.ts` | App init, db, analytics, auth exports. **READ ONLY.** |
| **Firebase Service** | `firebaseService.ts` | All Firestore read/write operations as functions. |
| **Firestore Schema** | `firestore-schema.ts` | TypeScript interfaces for all Firestore documents + `COLLECTIONS` enum. |
| **Analytics Service** | `analyticsService.ts` | Dual-logs to Google Analytics + custom Firestore collection. |

---

## 🔮 PLANNED (Not Yet Built)

| Component | Planned Location | Description |
| :--- | :--- | :--- |
| Onboarding / College Selector | `/src/pages/Onboarding.tsx` | 3-step flow: Welcome → Select College → Select Interests |
| Holographic ID Card | `/src/components/features/HolographicID.tsx` | 3D gyroscope-reactive profile card (R3F) |
| Ticket Stub Generator | `/src/components/features/TicketStub.tsx` | Generates shareable boarding-pass image via `html-to-image` |
| Ghost Mode Feed | `/src/components/features/GhostFeed.tsx` | Hidden confessions feed, triggered by long-press gesture |
| Floating Island Nav | Replaces `PremiumNavigation.tsx` | Shrinks to dot on scroll-down, expands on scroll-up |
