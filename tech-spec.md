# Tech Spec: Delilah's World

## Development Environment

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| TypeScript | ~5.6 | Type safety |
| Vite | ~6.0 | Build tool & dev server |
| Tailwind CSS | v4 | Utility-first styling |
| shadcn/ui | latest | Pre-built accessible UI components |

---

## Dependencies

### Core

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.0.0 | UI library |
| `react-dom` | ^19.0.0 | React DOM renderer |
| `react-router-dom` | ^7.0.0 | Client-side routing (5 pages) |
| `typescript` | ~5.6.0 | TypeScript compiler |
| `vite` | ^6.0.0 | Build tooling |
| `@vitejs/plugin-react` | ^4.0.0 | Vite React plugin |

### Styling & UI

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | ^4.0.0 | CSS framework |
| `@tailwindcss/vite` | ^4.0.0 | Tailwind Vite integration |
| `lucide-react` | ^0.460.0 | Icon library (Camera, Play, BookOpen, Upload, Heart, Mail, ChevronDown, X, Menu, Star, etc.) |
| `clsx` | ^2.1.0 | Conditional class composition |
| `tailwind-merge` | ^2.6.0 | Tailwind class conflict resolution |

### Animation

| Package | Version | Purpose |
|---------|---------|---------|
| `gsap` | ^3.12.0 | Core animation engine — scroll reveals, hero sequence, staggered lists |
| `framer-motion` | ^11.0.0 | Page transitions, tab switches, modal animations, AnimatePresence |

### Forms & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | ^7.54.0 | Form state management (upload, contact, comments) |
| `zod` | ^3.24.0 | Schema validation |
| `@hookform/resolvers` | ^3.9.0 | Zod resolver for react-hook-form |

### File Upload

| Package | Version | Purpose |
|---------|---------|---------|
| `react-dropzone` | ^14.3.0 | Drag-and-drop file upload for Photo/Video tabs |

### shadcn/ui Components (installed via CLI)

| Component | Installation | Usage |
|-----------|-------------|-------|
| `button` | `npx shadcn add button` | Primary, secondary buttons throughout |
| `input` | `npx shadcn add input` | Form input fields |
| `textarea` | `npx shadcn add textarea` | Contact message, blog content, descriptions |
| `card` | `npx shadcn add card` | Media cards, blog cards, info cards |
| `dialog` | `npx shadcn add dialog` | Upload modal, lightbox modal, video player modal |
| `tabs` | `npx shadcn add tabs` | Upload type tabs (Photo/Video/Story) |
| `select` | `npx shadcn add select` | Blog category selector |
| `label` | `npx shadcn add label` | Form labels |
| `avatar` | `npx shadcn add avatar` | Comment avatars, author avatars |
| `badge` | `npx shadcn add badge` | Category tags on blog posts |
| `skeleton` | `npx shadcn add skeleton` | Loading states for cards |
| `toast` | `npx shadcn add toast` | Toast notifications (success/error) |
| `sonner` | `npx shadner add sonner` | Alternative toast — used for upload progress notifications |
| `dropdown-menu` | `npx shadcn add dropdown-menu` | Mobile navigation menu |
| `scroll-area` | `npx shadcn add scroll-area` | Scrollable comment sections |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@types/react` | ^19.0.0 | React type definitions |
| `@types/react-dom` | ^19.0.0 | ReactDOM type definitions |
| `autoprefixer` | ^10.4.0 | CSS vendor prefixing |
| `postcss` | ^8.4.0 | CSS processing |

---

## Component Inventory

### shadcn/ui Components (pre-built)

All listed in Dependencies above. These provide accessible, styled base components that are customized with Tailwind classes and design tokens.

### Custom Components

| Component | File | Description | Props |
|-----------|------|-------------|-------|
| **Navigation** | `components/Navigation.tsx` | Fixed top nav bar, desktop + mobile hamburger menu, scroll shadow behavior | — |
| **Footer** | `components/Footer.tsx` | Three-column footer with brand, links, family note | — |
| **PasswordGate** | `components/PasswordGate.tsx` | Full-screen password overlay, first-visit only, animated gradient bg | — |
| **MediaCard** | `components/MediaCard.tsx` | Gallery media card — image/video thumbnail, title, meta, hover lift | `id`, `title`, `type`, `thumbnail`, `date`, `uploader`, `description` |
| **BlogCard** | `components/BlogCard.tsx` | Blog list card — horizontal layout, thumbnail, title, excerpt, meta | `id`, `title`, `excerpt`, `thumbnail`, `category`, `author`, `date`, `readTime` |
| **CommentBox** | `components/CommentBox.tsx` | Individual comment with avatar, name, date, text, nested reply support | `name`, `date`, `text`, `isDelilah`, `replies?` |
| **UploadDropzone** | `components/UploadDropzone.tsx` | Drag-and-drop zone with file preview, type validation | `accept`, `maxSize`, `onFileSelect`, `fileType` |
| **VideoPlayer** | `components/VideoPlayer.tsx` | Modal video player with controls, poster image | `src`, `poster`, `title` |
| **Lightbox** | `components/Lightbox.tsx` | Image lightbox modal with backdrop, click-to-close | `src`, `alt`, `onClose` |
| **ScrollReveal** | `components/ScrollReveal.tsx` | Wrapper component using GSAP ScrollTrigger for entrance animations | `children`, `delay?`, `direction?` |
| **StaggerReveal** | `components/StaggerReveal.tsx` | Container that staggers child reveals | `children`, `staggerDelay?` |
| **StarDivider** | `components/StarDivider.tsx` | Three animated purple stars as decorative divider | — |
| **PageTransition** | `components/PageTransition.tsx` | Framer Motion wrapper for route-level page transitions | `children` |
| **VideoPlayIcon** | `components/VideoPlayIcon.tsx` | White circle play button overlay for video thumbnails | — |
| **NoImagePlaceholder** | `components/NoImagePlaceholder.tsx` | Violet-tinted placeholder with star icon | — |

### Section Components (per page)

| Page | Section Components |
|------|-------------------|
| **Home** | `HeroSection`, `LatestMemoriesSection`, `LatestStoriesSection`, `AboutSection`, `UploadCTASection` |
| **Gallery** | `GalleryHeader`, `MediaGrid`, `LoadMore` |
| **Blog** | `BlogHeader`, `BlogPostList`, `BlogPostFullView`, `CommentsSection`, `AddCommentForm` |
| **Contact** | `ContactHeader`, `ContactForm`, `ContactInfoCard` |
| **Upload** | `UploadHeader`, `UploadForm` (with tabs), `UploadProgress`, `UploadSuccess` |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Hero greeting sequence | GSAP | Timeline: label fade → title slide-up → subtitle fade → buttons fade, with delays | Medium |
| Scroll indicator bounce | CSS @keyframes | `translateY(0→8px→0)` infinite, 2s ease-in-out | Low |
| Scroll-triggered reveals | GSAP + ScrollTrigger | `ScrollReveal` wrapper: opacity 0→1, translateY 30→0, 15% threshold trigger | Low |
| Staggered card reveals | GSAP + ScrollTrigger | `StaggerReveal` container: 0.1s delay per child, max delay cap | Low |
| Star twinkle | CSS @keyframes | Opacity pulse 0.5→1→0.5, 3s infinite, staggered `animation-delay` per star | Low |
| Page transitions | Framer Motion | `AnimatePresence` + `motion.div`: exit opacity 0 (200ms), enter opacity+translateY (400ms) | Medium |
| Mobile menu overlay | Framer Motion | `AnimatePresence`: fade-in backdrop, slide-in menu items with 0.08s stagger | Medium |
| Mobile menu item stagger | Framer Motion | `variants` with staggerChildren: 0.08s, each item fades+slides in | Low |
| Card hover lift | CSS transition | `translateY(-4px)` + `shadow-lg`, `transition-fast` (0.2s) | Low |
| Play icon hover | CSS transition | `scale(1.1)` + `shadow-glow` | Low |
| Nav scroll shadow | CSS + React state | Toggle `shadow-md` class after 80px scroll via scroll listener | Low |
| Upload tab switch | Framer Motion | `AnimatePresence` mode="wait": cross-fade between tab panels (200ms) | Low |
| Upload progress ring | SVG + CSS | SVG `circle` with animated `stroke-dashoffset` based on progress % | Medium |
| Upload success star pulse | CSS @keyframes | `scale(1→1.1→1)` + opacity pulse, 2s | Low |
| Toast slide-in | Framer Motion | `initial={{ y: 50, opacity: 0 }}` → `animate={{ y: 0, opacity: 1 }}` | Low |
| Password gate gradient | CSS @keyframes | Animated `background-position` on diagonal gradient | Low |
| Password gate shake | CSS @keyframes | Horizontal `translateX` oscillation on error | Low |
| Loading skeleton pulse | CSS @keyframes | Opacity 0.4→0.8→0.4, 1.5s infinite | Low |
| Lightbox open/close | Framer Motion | Backdrop fade, content scale(0.95→1) + opacity | Low |
| Filter tab content switch | Framer Motion | `AnimatePresence`: fade-out (200ms) → fade-in (300ms) with stagger | Low |
| Comment add | Framer Motion | `AnimatePresence`: new comment slides up from bottom + fades in | Low |
| Empty state star float | CSS @keyframes | Gentle `translateY(0→-8px→0)`, 3s infinite | Low |
| Button loading spinner | CSS @keyframes | SVG/span rotation, 1s linear infinite | Low |

---

## State & Logic Plan

### Routing

React Router v7 with 5 routes:

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page |
| `/gallery` | Gallery | Photo/video grid |
| `/blog` | Blog | Blog post list + individual post view |
| `/contact` | Contact | Contact form |
| `/upload` | Upload | Content upload interface |

Blog individual posts use route `/blog/:postId` with conditional rendering — list view on `/blog`, full post view on `/blog/:id`.

### Global State (React Context)

**ToastContext** — Manages toast notification queue:
- `toasts: Toast[]` — active notifications
- `addToast(message, type)` — add notification
- `removeToast(id)` — dismiss notification
- Auto-dismiss after 4 seconds via `setTimeout`

**AuthContext** — Manages password gate authentication:
- `isAuthenticated: boolean` — whether user has passed password gate
- `password: string` — the family password (hardcoded for v1: "delilah2025")
- `authenticate(password)` — validate and set authenticated
- Persist auth state in `localStorage` so returning visitors skip the gate

### Local State (useState)

**Navigation**:
- `isScrolled: boolean` — toggles nav shadow after 80px scroll
- `isMobileMenuOpen: boolean` — mobile overlay visibility

**Gallery**:
- `activeFilter: 'all' | 'photos' | 'videos'` — current filter tab
- `mediaItems: MediaItem[]` — loaded media (mock data initially)
- `displayedCount: number` — pagination/load-more counter
- `selectedMedia: MediaItem | null` — lightbox/video player target

**Blog**:
- `posts: BlogPost[]` — blog posts (mock data)
- `selectedPostId: string | null` — active post for full view
- `comments: Comment[]` — comments for selected post

**Upload**:
- `activeTab: 'photo' | 'video' | 'story'` — current upload type
- `uploadProgress: number` — 0-100 upload percentage
- `uploadStatus: 'idle' | 'uploading' | 'success' | 'error'` — upload state
- `selectedFile: File | null` — dropped/selected file

**Contact**:
- `formStatus: 'idle' | 'submitting' | 'success' | 'error'` — form submission state

### Data Flow

- All content data (media, blog posts, comments) stored as **static mock data** in `src/data/` (TypeScript files exporting typed arrays)
- No backend API calls in v1 — data is imported directly
- Upload functionality simulates success after a timed delay (2-3 seconds) with progress animation
- Comment submission appends to local state immediately
- Contact form simulates submission with loading state, then shows success

### Custom Hooks

| Hook | Purpose | Implementation |
|------|---------|---------------|
| `useScrollPosition` | Track scroll position for nav shadow, reveal triggers | `useEffect` with scroll event listener, returns scrollY |
| `useLocalStorage` | Persist auth state, user preferences | `useState` synced with `localStorage` get/set |
| `useMediaQuery` | Responsive behavior (mobile/desktop detection) | `window.matchMedia` listener, returns boolean |
| `useToast` | Access toast context for notifications | Consumes `ToastContext`, returns `addToast` |
| `useAuth` | Access auth context | Consumes `AuthContext`, returns `isAuthenticated`, `authenticate` |

### Form Handling

All forms use **react-hook-form** with **Zod** validation:

**Upload Photo Form**:
- `title`: string, min 1 char, max 100
- `description`: string, optional, max 500
- `uploaderName`: string, min 1 char, max 50
- `file`: File, required, max 10MB, types: image/*

**Upload Video Form**:
- Same as photo + `file`: max 100MB, types: video/*

**Upload Story Form**:
- `title`: string, min 1, max 100
- `category`: enum ['story', 'message', 'update', 'recipe', 'activity']
- `content`: string, min 10, max 5000
- `authorName`: string, min 1, max 50

**Contact Form**:
- `name`: string, min 1, max 50
- `email`: string, optional, email format
- `subject`: string, min 1, max 100
- `message`: string, min 10, max 2000

**Comment Form**:
- `name`: string, min 1, max 50
- `comment`: string, min 1, max 1000

---

## Other Key Decisions

### File Upload Strategy (v1 — Mock)

No backend exists yet. File uploads are simulated:
1. User selects file via dropzone
2. On submit, progress animation runs (0→100% over 2.5 seconds)
3. On "completion", toast notification confirms success
4. File data is NOT persisted — page refresh resets to mock data
5. File preview is shown using `URL.createObjectURL(selectedFile)` for immediate visual feedback

### Password Gate

- Hardcoded password: `"delilah2025"` (configurable in `src/config.ts`)
- First visit: full-screen overlay blocks all content
- Success: overlay fades out, `isAuthenticated` stored in `localStorage`
- Returning visitors: read `localStorage` on app mount, skip overlay if authenticated
- Password input: toggle visibility (show/hide) with eye icon

### Image/Video Handling

- All gallery/blog images use **mock placeholder images** from a placeholder service (e.g., `https://picsum.photos/` or generated colored rectangles)
- Video thumbnails show play icon overlay; clicking opens modal with HTML5 `<video>` player
- Images in lightbox: click backdrop or X to close, ESC key support
- Lazy loading: images below fold use `loading="lazy"` attribute

### Accessibility

- All interactive elements: minimum 44px tap targets
- Focus states: 2px outline `Violet 300`, 2px offset
- `prefers-reduced-motion`: all GSAP/CSS animations disabled, instant transitions
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- ARIA labels on icon-only buttons
- Color contrast: all text/background combos meet WCAG AA (verified in design tokens)

### Responsive Strategy

| Breakpoint | Tailwind Prefix | Layout Changes |
|------------|----------------|----------------|
| ≥1280px | `xl:` | 3-col gallery, full nav, side-by-side layouts |
| 1024–1279px | `lg:` | Slight spacing reduction |
| 768–1023px | `md:` | 2-col gallery, stacked sections |
| <768px | default | Single column, hamburger nav, full-width buttons |

### Asset Strategy

- No custom image assets — all visuals are CSS/Tailwind generated or SVG icons (Lucide)
- Favicon: inline SVG or small generated PNG
- No external fonts loaded — using system fonts (or Google Fonts if specified in design: Cormorant Garamond, Inter, Caveat)
- Font loading: Google Fonts CDN link in `index.html` with `display=swap`
