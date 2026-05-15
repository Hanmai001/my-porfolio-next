import type {
  TagTone,
  WorkCategory,
  WorkItem,
  ProjectFeature,
  FeatureHotspot,
  ProjectPreviewSlide,
  ProjectChallenge,
  ProjectDetail,
} from "@/shared/types/work-project";

export type {
  WorkCategory,
  WorkItem,
  ProjectFeature,
  FeatureHotspot,
  ProjectPreviewSlide,
  ProjectChallenge,
  ProjectDetail,
};

export const worksContent = {
  annotation: "What I've built:",
  heading: "Main Works",

  projects: [
    {
      slug: "qlay-research-platform",
      title: "Qlay Research Platform",
      subtitle: "Qlay Technology Inc.",
      description:
        "Contributed to the MVP of an AI-driven market research platform — leading the frontend of the research reporting suite, architecting the authentication system, and collaborating on the study creation workflow. The platform unifies study design, participant interviewing, and structured analysis in a single workspace.",
      role: "Frontend Engineer",
      period: "March 2026 – Present",
      tags: [
        "Next.js 16",
        "TypeScript",
        "React 19",
        "Tailwind CSS v4",
        "shadcn/ui",
        "SWR",
        "Zustand",
        "AI / LLM",
        "NDJSON Streaming",
        "Framer Motion",
      ],
      categories: ["AI/LLM"],
      accent: "primary" as TagTone,
      featured: true,
      detail: {
        tagline:
          "An AI-assisted research workspace that takes studies from prompt to structured participant analysis — without the context switching.",
        problem: [
          "Research teams were navigating between disconnected tools to design studies, collect responses, and compile findings. That fragmentation introduced manual overhead, inconsistent data views, and slow turnaround on insights.",
          "The product needed an MVP that could ship quickly while establishing frontend patterns stable enough to build on — because every workflow would become the foundation for future study operations.",
        ],
        solution: [
          "I owned the frontend of the research reporting suite — a four-tab analysis interface covering AI-generated summaries, quantitative and qualitative analysis, raw response management, and recruitment progress tracking.",
          "I also designed and implemented the full authentication architecture: a four-cookie security model, proactive token refresh in the route proxy, a mutex-based client-side refresh strategy, and five complete auth flows including Google OAuth and email verification.",
          "I was closely involved in architectural discussions for the study creation workflow: how NDJSON streaming integrates with Zustand stores, the question builder auto-save strategy, and how the AI-generated study structure maps to the frontend domain model.",
          "Across all areas, the architecture prioritised composable data hooks, predictable state ownership (SWR for server data, Zustand for client state), and UI patterns resilient to async and streaming conditions.",
        ],
        challenges: [
          {
            title: "Rendering heterogeneous AI-generated report content",
            description:
              "The report summary and analysis tabs receive server-driven content with mixed section types — prose with markdown formatting, multiple chart variants (bar, stacked, donut), and attributed quote blocks — all streamed progressively as the AI generates them. Each section type requires distinct rendering logic while the overall layout must stay cohesive and exportable.",
            outcome:
              "A discriminated-union section model (TextSection | ChartSection | QuoteSection) kept each renderer isolated and type-safe. Charts used a shared color assignment layer for visual consistency across section types. The same section model powered both in-app rendering and PDF export — a markdown-to-AST converter and SVG serialisation layer ensured the PDF matched the screen layout faithfully.",
            solution: "Discriminated union sections → isolated renderers → shared AST layer for PDF fidelity",
            tags: ["Discriminated Unions", "Recharts", "Markdown AST", "pdfmake", "NDJSON"],
          },
          {
            title: "Streaming AI content with recoverable state",
            description:
              "Both the study creation wizard and the report summary tab consume backend-streamed AI output via NDJSON. The UI needed to handle incremental chunks, status transitions, and stream cancellation without blocking the researcher or losing partial progress.",
            outcome:
              "A generic NDJSON processing layer with discriminated packet types kept streaming logic reusable across features. AbortController-based cancellation and version-gated polling prevented stale revalidation after generation completed.",
            solution: "Discriminated NDJSON packets → Zustand store → optimistic UI update",
            tags: ["NDJSON", "AbortController", "Zustand", "SWR"],
          },
          {
            title: "Zero-refresh filter state",
            description:
              "The responses tab needed filters, sort order, and search to survive page reloads and be shareable — while avoiding unnecessary re-mounts that would reset scroll position and local state.",
            outcome:
              "Filter state synced to URL params via the History API (replaceState) using useSyncExternalStore — URL as source of truth without triggering full re-renders.",
            solution: "useSyncExternalStore + History API replaceState + custom event bus",
            tags: ["useSyncExternalStore", "History API", "React 19"],
          },
          {
            title: "Secure, low-latency authentication architecture",
            description:
              "The platform needed an auth system that kept tokens secure from XSS, enabled zero-latency user reads, handled proactive refresh before route entry, and prevented concurrent 401s from triggering duplicate refresh calls.",
            outcome:
              "A four-cookie model separated access token (HttpOnly), expiry timestamp (readable by middleware), refresh token (path-scoped), and user object (non-HttpOnly for instant client reads). Proactive refresh in the route proxy eliminated client-side 401s on expired-but-refreshable sessions. A mutex pattern ensured only one refresh executes under concurrent requests.",
            solution: "4-cookie model + middleware proactive refresh + mutex token refresh",
            tags: ["HttpOnly Cookies", "Next.js Proxy", "Mutex Pattern", "Server Actions"],
          },
          {
            title: "Auto-save correctness in the question builder",
            description:
              "The study creation question builder needed to sync each question to the backend as the researcher typed — without flooding the API or breaking the live preview when a temp ID was replaced by a real one.",
            outcome:
              "Per-question debounced flushes (3s) with accumulated partials. A temp-ID replacement strategy propagated the backend-assigned ID across both stores atomically on first successful create.",
            solution: "Debounced flush + temp-ID swap propagated atomically across Zustand stores",
            tags: ["Zustand", "Debounce", "Optimistic UI"],
          },
        ],
        features: [
          {
            title: "AI summary report with streaming",
            description:
              "Progressive rendering of AI-generated summaries with text, chart, and quote section types. Polling-based status tracking surfaces generation progress in real time, and completed reports export to structured PDF with embedded SVG charts and markdown formatting.",
            metric: "Streaming + PDF export",
            tone: "secondary",
            image: "/project-01/2.png",
            hotspots: [
              { x: 88, y: 10, label: "Export PDF" },
              { x: 14, y: 48, label: "Stream" },
            ],
          },
          {
            title: "Quantitative and qualitative analysis",
            description:
              "Quantitative charts with count/percentage toggle and cross-tab comparison. Qualitative thematic analysis with AI-generated summaries, quote extraction, and sticky section navigation for long reports.",
            metric: "Multi-mode analysis",
            tone: "warning",
            image: "/project-01/3.png",
            hotspots: [
              { x: 50, y: 38, label: "Chart" },
            ],
          },
          {
            title: "Response management with URL-driven state",
            description:
              "Infinite-scroll response table with persistent filter, sort, and search state synced to the URL. Bulk hide/unhide with optimistic mutations. Respondent detail panel with full interview transcript on demand.",
            metric: "Shareable filters",
            tone: "energy",
            image: "/project-01/5.png",
            hotspots: [
              { x: 20, y: 18, label: "Filters" },
              { x: 78, y: 55, label: "Table" },
            ],
          },
        ],
        previewSlides: [
          { src: "/project-01/1.png", alt: "Research report overview" },
          { src: "/project-01/2.png", alt: "AI summary with streaming" },
          { src: "/project-01/3.png", alt: "Quantitative analysis" },
          { src: "/project-01/4.png", alt: "Qualitative analysis" },
          { src: "/project-01/5.png", alt: "Response management table" },
          { src: "/project-01/6.png", alt: "Respondent detail panel" },
          { src: "/project-01/7.png", alt: "Study creation wizard" },
          { src: "/project-01/8.png", alt: "Recruitment progress" },
          { src: "/project-01/9.png", alt: "Recruitment progress" },
        ],
      },
    },

    {
      slug: "qlay-ai-proctoring",
      title: "Qlay AI Proctoring Platform",
      subtitle: "Qlay Technology Inc.",
      description:
        "Built the end-to-end live monitoring, AI proctoring, and reporting workflows for a browser-based exam proctoring platform. Contributions span real-time binary alert stream processing, proctor dashboard state management, session lifecycle orchestration, and a video-synced reporting interface — across a Turborepo monorepo with two production Next.js applications.",
      role: "Frontend Engineer",
      period: "Feb 2025 – Feb 2026",
      tags: [
        "ReactJS",
        "NextJS",
        "TypeScript",
        "TailwindCSS",
        "Socket.IO",
        "Zustand",
        "React Query",
        "Agora RTC",
        "Daily.co",
        "Turborepo",
        "WebSocket",
        "Binary Encoding",
        "AWS",
        "CI/CD",
      ],
      categories: ["AI/LLM"],
      accent: "secondary" as TagTone,
      featured: true,
      detail: {
        tagline: "Real-time AI-assisted exam proctoring — from live detection stream to post-session risk report.",
        problem: [
          "Online assessments are vulnerable to academic dishonesty without continuous, multi-signal monitoring of the candidate environment.",
          "Proctors need a low-latency, at-a-glance view of multiple concurrent detection signals — head position, gaze, device presence, audio — without being overwhelmed by noise.",
          "Post-session review requires correlating raw detection events with the recorded video to produce actionable risk assessments.",
        ],
        solution: [
          "Designed a binary-encoded alert stream pipeline: the candidate app emits compact 2-bit-per-detection Uint8Array payloads over Socket.IO, which the proctor dashboard decodes, diffs against prior state, and converts into timestamped ActivityLog entries in real time.",
          "Built the LiveMonitorProvider context layer handling the full session lifecycle — room join, alert stream normalization, eye-gaze desktop events, and graceful session termination — keeping the dashboard reactive with a bounded 200-entry activity log.",
          "Developed the post-session report view with a video player, color-coded detection timeline, tabbed alert logs, suspicious activity breakdown, and a cheating risk score with confidence percentage sourced from server-computed analysis.",
        ],
        challenges: [
          {
            title: "Efficient Real-Time Alert Streaming",
            description:
              "Transmitting 10 concurrent detection signals continuously over WebSocket at low latency while keeping payload size minimal and UI updates performant.",
            solution:
              "Adopted a binary-packed encoding scheme (2 bits per detection state, 7–10 channels per frame) so each alert payload is just 2 bytes of detection data plus a 4-byte offset. On the proctor side, decodeAlertContentPayload() unpacks the bits and a state-diff pass (previousDetectionsRef) ensures only changed detections generate new log entries — eliminating redundant re-renders.",
            outcome:
              "Sub-second alert propagation from candidate device to proctor dashboard with minimal bandwidth overhead and no UI jitter from redundant state updates.",
            tags: ["WebSocket", "Binary Encoding", "Performance", "Socket.IO"],
          },
          {
            title: "Multi-Source Socket Event Coordination",
            description:
              "The monitoring dashboard must simultaneously handle events from the mobile camera stream (binary alerts), the desktop eye-gaze tracker (structured JSON), the candidate web app (join/support/screen-share events), and recording control acknowledgements — all through a single Socket.IO connection.",
            solution:
              "Centralized all event subscriptions in a typed useMonitoringSocket() hook layer backed by shared @repo/socket-config utilities (useSocketEmit, useSocketEvent). Each event type has its own typed handler registered once in LiveMonitorProvider, with auto-reconnect logic (5 attempts, 1 s delay) and explicit disconnect/reconnect tracking via SocketStatus enum.",
            outcome:
              "Stable real-time coordination across heterogeneous event sources with clear separation of concerns and type-safe event contracts.",
            tags: ["Socket.IO", "TypeScript", "State Management", "React Context"],
          },
          {
            title: "Session Lifecycle State Across Navigation",
            description:
              "Room join state (Agora tokens, room URLs, candidate joined status) must survive route transitions between session setup, live monitoring, and post-session report pages without requiring re-fetches.",
            solution:
              "Used a Zustand store (useInterviewSessionStore) with localStorage persistence for cross-route room info and joined-interview tracking. Ephemeral monitoring state (activity logs, modal visibility, video height) lives in LiveMonitorProvider React context, scoped to the active session route.",
            outcome:
              "Seamless navigation through the session lifecycle with no stale state or redundant API calls on re-entry.",
            tags: ["Zustand", "React Context", "Next.js", "State Management"],
          },
          {
            title: "Video-Synced Detection Timeline in Reports",
            description:
              "Report viewers need to scrub a recorded session video and immediately see which detection events were active at any given moment, rather than cross-referencing a flat log.",
            solution:
              "Built a TimelineSegment overlay and ActivityTimeline component that map ActivityLogPayload offset values (seconds from joinedAt) onto the video scrubber track. The useSuspiciousTimelineRows hook filters and groups intervals by detection label and severity, producing color-coded bands that update as the playhead moves.",
            outcome:
              "Reviewers can jump directly from a suspicious segment on the timeline to the corresponding video moment, dramatically reducing manual report review time.",
            tags: ["React", "Video Player", "Data Visualization", "UX"],
          },
        ],
        features: [
          {
            title: "Real-Time Monitoring Dashboard",
            description:
              "Live proctor view with Socket.IO-driven activity log panel displaying 10 detection categories (head, gaze, hands, phone, secondary person, audio, etc.) with color-coded severity, timestamps as HH:mm:ss offsets, and a bounded 200-entry log updated only on state transitions.",
            tone: "primary" as TagTone,
          },
          {
            title: "Binary Alert Stream Pipeline",
            description:
              "Candidate app emits 2-bit-per-channel binary payloads for 7 mobile detections per frame. Proctor client decodes, diffs against previous state, and generates typed ActivityLogPayload entries — processing only changed channels to keep UI updates minimal.",
            tone: "secondary" as TagTone,
          },
          {
            title: "Configurable Monitoring Per Session",
            description:
              "Each session carries an IProctoringConfig specifying which signals are active: mobile camera angles, desktop monitoring, eye-gaze tracking, tab-switch prevention, ID verification, speech cadence analysis, and background app monitoring.",
            tone: "accent" as TagTone,
          },
          {
            title: "Post-Session Risk Report",
            description:
              "Structured report with server-computed cheating risk score (UNLIKELY → HIGHLY_LIKELY) and confidence percentage, suspicious activity duration and breakdown by detection type, and a tabbed interface for alert logs, transcript, and notes.",
            tone: "primary" as TagTone,
          },
          {
            title: "Video Player with Detection Timeline",
            description:
              "Embedded session recording with a color-coded timeline overlay correlating detection intervals to video timestamps. Proctors can jump to any flagged segment directly from the scrubber.",
            tone: "secondary" as TagTone,
          },
          {
            title: "Session Lifecycle Orchestration",
            description:
              "Full flow from session creation (draft → scheduled → ongoing → completed) and participant onboarding (code verification, camera setup) through live monitoring to session termination and report generation — coordinated across Socket.IO events and REST API calls.",
            tone: "accent" as TagTone,
          },
        ],
        previewSlides: [
          { alt: "Live monitoring dashboard with real-time activity log" },
          { alt: "Binary alert stream detection panel" },
          { alt: "Post-session report with risk score and suspicious activity breakdown" },
          { alt: "Video player with color-coded detection timeline overlay" },
          { alt: "Session configuration and monitoring options" },
        ],
      },
    },

    {
      slug: "verbale",
      title: "Verbale",
      subtitle: "AI-powered English Speaking Platform",
      description:
        "Built a responsive and SEO-optimized language learning platform with real-time speech analysis and AI-powered feedback systems. Implemented smooth interactive learning experiences using modern frontend architecture and realtime processing workflows.",
      role: "Frontend Engineer (Freelancer)",
      period: "May 2025 – Aug 2025",
      tags: [
        "NextJS",
        "TypeScript",
        "Shadcn/UI",
        "Turbo",
        "AI Speech",
        "Realtime",
      ],
      categories: ["AI/LLM"],
      accent: "accent" as TagTone,
    },

    {
      slug: "sukima-shopping",
      title: "Sukima Shopping",
      subtitle: "Canaan Advisors",
      description:
        "A bilingual (EN/JA) e-commerce platform that lets users browse, search, and purchase authentic Japanese goods. Built the full frontend from product discovery through Stripe checkout, with real-time JPY/USD conversion, backend-persisted cart, and a multi-step checkout flow.",
      role: "Frontend Engineer",
      period: "Aug 2025 – Aug 2025",
      tags: [
        "Next.js",
        "TypeScript",
        "Redux Toolkit",
        "React Query",
        "Stripe",
        "Tailwind CSS",
        "NextAuth.js",
        "next-intl",
      ],
      categories: ["E-commerce"],
      accent: "warning" as TagTone,
      featured: true,
      detail: {
        tagline:
          "Full-stack frontend for a Japanese goods sourcing platform — from product discovery to Stripe checkout.",

        problem: [
          "Shoppers outside Japan struggle to discover and purchase authentic Japanese products due to language barriers, currency complexity, and fragmented store experiences.",
          "The platform needed a reliable end-to-end purchase flow — search, multi-store cart, multi-currency pricing, and international checkout — within a single cohesive UI.",
        ],

        solution: [
          "Built the complete frontend on Next.js 12 (Pages Router) with TypeScript, covering every user-facing surface from the homepage through post-order confirmation.",
          "Implemented a Redux Toolkit store (12 slices) to coordinate cart state, auth tokens, live exchange rates, and language preference across the session.",
          "Integrated NextAuth.js (Credentials provider) for JWT-based authentication with server-side route protection on the checkout page.",
          "Wired a four-step checkout flow — personal info, shipping address, shipping method, Stripe payment — using React Hook Form and Zod validation at each step.",
          "Added real-time JPY/USD currency conversion throughout the cart and checkout by syncing exchange rate data into a dedicated Redux slice.",
          "Delivered bilingual support (English/Japanese) via next-intl, including locale-aware product description parsing that handles both EN and JP text delimiters.",
        ],

        challenges: [
          {
            title: "Multi-store Cart with Layered Fee Breakdown",
            description:
              "Cart items span multiple Japanese stores, each with independent domestic shipping costs. International shipping, a 20% agent fee, a ¥750 consolidation box fee, and 10% consumption tax all compound on top.",
            solution:
              "Modeled each fee component as a separate backend-persisted field and computed totals client-side using a dedicated Redux cart slice. The CartSummary component renders collapsible per-store shipping rows so users see exactly what they are paying for.",
            outcome:
              "Cart pricing is transparent and consistent between the cart page and checkout confirmation without requiring a second API round-trip.",
            tags: ["Redux Toolkit", "React Query", "Cart Architecture"],
          },
          {
            title: "Real-time Currency Conversion Across the UI",
            description:
              "Product prices are stored in JPY, but the target audience is international. Exchange rates needed to be available globally without prop-drilling through deeply nested product and cart components.",
            solution:
              "Fetched the exchange rate once on app load and stored it in a dedicated Redux `exchangeRate` slice. A `useFormatCurrency` hook reads from the slice to format prices wherever needed — product cards, detail pages, cart, checkout summary.",
            outcome:
              "Currency display is consistent and reactive: switching the currency selector in the navbar immediately updates prices site-wide.",
            tags: ["Redux Toolkit", "Custom Hooks", "UX"],
          },
          {
            title: "Stripe Integration within a Multi-step Checkout",
            description:
              "Payment needed to slot into the final step of a four-step tabbed checkout without disrupting the form state built across the previous three steps.",
            solution:
              "Wrapped Stripe Elements inside a dedicated `StripeForm` component embedded in the PaymentForm step. On submit, the flow calls `confirmPayment`, then creates the order record, resets the cart via `/cartItems/resetCart`, and redirects to the order summary page.",
            outcome:
              "End-to-end checkout — from entering a shipping address to a confirmed order — works reliably with no cross-step state loss.",
            tags: ["Stripe", "React Hook Form", "Zod"],
          },
          {
            title: "Performant Route Transitions with Skeleton Loading",
            description:
              "Product pages fetch data server-side and can be slow on navigation, leaving users with a blank screen during transitions.",
            solution:
              "Hooked into Next.js `router.events` (`routeChangeStart` / `routeChangeComplete`) in `_app.tsx` to toggle a global loading flag. While loading, skeleton components replace the page content, matching the shape of the incoming layout.",
            outcome:
              "Navigation feels responsive across all product and category pages, with no layout shift once the real content arrives.",
            tags: ["Next.js", "UX", "Performance"],
          },
          {
            title: "Bilingual Product Descriptions",
            description:
              "Product descriptions from Japanese stores contain mixed EN/JP text with different bullet-point delimiter conventions, requiring locale-aware parsing rather than raw string display.",
            solution:
              "Built a parser in `ProductDescription.tsx` that detects the active locale and splits description text on the appropriate delimiter (・ for JP, standard punctuation for EN), rendering each segment as a structured list item.",
            outcome:
              "Descriptions render cleanly in both languages without manual data transformation on the backend.",
            tags: ["next-intl", "Localization", "TypeScript"],
          },
        ],

        features: [
          {
            title: "Product Discovery & Search",
            description:
              "Debounced search (700ms) synced to URL query params via a custom `useUpdateQuery` hook. Filter panel supports store, tag, and price-range filters. Results paginate with prev/next controls.",
            tone: "primary" as TagTone,
          },
          {
            title: "Store & Category Browsing",
            description:
              "Dedicated store pages (SSR via `getServerSideProps`) show a banner, logo, and tabbed Home/Products layout. Category pages render collapsible subcategory hierarchies for scoped browsing.",
            tone: "secondary" as TagTone,
          },
          {
            title: "Product Detail Page",
            description:
              "Touch-enabled image carousel (Embla), locale-aware description parsing, real-time JPY/USD price display, delivery location selector (Radix Drawer), and a related-products carousel at the bottom.",
            tone: "primary" as TagTone,
          },
          {
            title: "Backend-Persisted Cart",
            description:
              "Cart items are synced to the backend (REST CRUD) and grouped by store in the UI. Quantity changes trigger immediate API calls; reaching zero auto-removes the item. Pricing rows break out domestic shipping, international shipping, agent fee, box fee, and tax.",
            tone: "secondary" as TagTone,
          },
          {
            title: "Four-Step Checkout with Stripe",
            description:
              "Tabbed checkout collects personal info, shipping address, shipping method, and payment (Stripe Elements) in sequence. React Hook Form + Zod validates each step. On success: order record created, cart cleared, user redirected to order summary.",
            tone: "primary" as TagTone,
          },
          {
            title: "JWT Authentication & Route Guards",
            description:
              "NextAuth.js Credentials provider issues JWTs stored in the session and mirrored to localStorage. The checkout page uses `getServerSideProps` + `getSession()` to redirect unauthenticated users. A `withAuthorize` HOC handles client-side route protection.",
            tone: "secondary" as TagTone,
          },
          {
            title: "Bilingual UI (EN / JA)",
            description:
              "Full English/Japanese support via next-intl. Translation namespaces cover all major surfaces (Home, Products, Cart, Signin, Navbar). Language preference persisted in Redux and reflected in locale-aware URL routing.",
            tone: "primary" as TagTone,
          },
          {
            title: "Performance & Loading UX",
            description:
              "Homepage uses ISR (10s revalidation). Dynamic imports split Layout, Footer, and Toaster from the initial bundle. Million.js compiler reduces React reconciliation overhead. Skeleton loaders (matched to page shape) show during route transitions.",
            tone: "secondary" as TagTone,
          },
        ],

        previewSlides: [
          { alt: "Homepage with featured store carousels" },
          { alt: "Product listing with search and filters" },
          { alt: "Product detail page with image carousel" },
          { alt: "Shopping cart with multi-store fee breakdown" },
          { alt: "Four-step checkout flow" },
          { alt: "Order summary page" },
        ],
      }
    },

    {
      slug: "qlay-landing-page",
      title: "Qlay Landing Page",
      subtitle: "Qlay AI",
      description:
        "Full landing page for an AI interview proctoring platform — ten narrative sections built with Next.js 14, Tailwind CSS, and Radix UI. Covers everything from section composition and scroll navigation to a CSS-first animation system, responsive layout, and a multi-step demo booking flow.",
      role: "Frontend Engineer",
      period: "2024 – 2025",
      tags: [
        "Next.js 14",
        "TypeScript",
        "Tailwind CSS",
        "Radix UI",
        "Embla Carousel",
        "Zustand",
        "Responsive Design",
        "CSS Animation",
        "next-intl",
        "UI/UX",
      ],
      categories: ["Landing Page"],
      accent: "primary" as TagTone,
      featured: true,
      detail: {
        tagline: "Conversion-focused landing page for an AI interview proctoring SaaS.",
        problem: [
          "Qlay needed a marketing site that clearly communicated a nuanced technical product — AI-powered cheating detection — to non-technical buyers across multiple hiring contexts.",
          "The page had to work across a wide device range (320 px feature phones to 1440 px desktops), load fast as a static site, and feed a multi-step demo booking funnel without a heavy client-side bundle.",
        ],
        solution: [
          "Implemented the full landing page using Next.js 14 App Router with static generation. Ten sections are composed in a deliberate narrative order — pain-point framing first, product demonstration in the middle, social proof and pricing to close — each with its own responsive layout handled through a mobile-first Tailwind system and a useDevices hook for conditional rendering.",
          "Chose a CSS-first animation strategy (keyframe orbits, Tailwind transition utilities, backdrop blur) over a motion library to keep the bundle lean and maintain smooth 60 fps on mid-range mobile devices. Interactive elements — a monthly/annual pricing toggle, an Embla autoplay carousel, a Radix accordion FAQ — are layered in only where they directly support comprehension or conversion.",
          "Multi-step demo booking state is managed via a sessionStorage-persisted Zustand store, allowing users to navigate across pages without losing form progress. Scroll-to-section navigation compensates for sticky header height dynamically and handles cross-page anchor routing through sessionStorage.",
        ],
        challenges: [
          {
            title: "Responsive layout across an unusually wide device range",
            description:
              "The Tailwind config defines seven custom breakpoints from xxs (320 px) to 2xl (1440 px). Some sections, like the Features grid, required layout logic beyond pure CSS — the desktop 2-column pairing is built with a .reduce() pass over the content array rather than CSS grid alone.",
            solution:
              "Combined mobile-first Tailwind breakpoints for styling with a useDevices hook (@react-hook/media-query) for cases where the DOM structure itself needed to change between viewport sizes.",
            outcome:
              "Single component tree handles all breakpoints without duplicate markup; layout shifts are minimal because structure and style changes are co-located.",
            tags: ["Responsive", "Tailwind CSS", "React"],
          },
          {
            title: "Animation performance without a motion library",
            description:
              "Early explorations with a JS animation library added noticeable bundle weight. The visual design called for continuous orbital motion, hover lifts, accordion transitions, and a carousel — but most were decorative rather than semantic.",
            solution:
              "Implemented orbital background animations as pure CSS @keyframes (orbit1/orbit2, 20-second linear loops) in globals.css. All hover and transition states use Tailwind utilities. Embla Carousel handles the testimonial autoplay. Lottie is scoped only to the image lazy-load spinner.",
            outcome:
              "Zero Framer Motion dependency. Animations run on the GPU compositor thread and do not block the main thread during scroll.",
            tags: ["CSS Animation", "Performance", "Lottie"],
          },
          {
            title: "Multi-step booking flow with cross-page state",
            description:
              "The demo request flow spans multiple routes (/request-demo → /booking-meeting → /information). Users who navigated back or refreshed mid-flow previously lost their form state.",
            solution:
              "Designed a Zustand store with sessionStorage persistence for the entire booking payload (company info, contact details, geolocation-derived defaults). A useGetLocation hook prefills country and timezone fields on load.",
            outcome:
              "Form state survives page navigation and soft refreshes within the session without requiring a backend session or query-param serialization.",
            tags: ["Zustand", "React Hook Form", "UX"],
          },
          {
            title: "Scroll navigation with dynamic header offset",
            description:
              "Anchor scrolling to sections needed to account for the sticky header (top: 25 px + header height), and some nav links originate from other pages entirely.",
            solution:
              "useScrollToSection hook calculates the target element's top offset minus the header's clientHeight at scroll time. Cross-page anchoring stores the target section ID in sessionStorage, redirects to home, and triggers the scroll after mount.",
            outcome: "Accurate scroll positioning regardless of viewport size or content reflow.",
            tags: ["Navigation", "UX", "Custom Hooks"],
          },
        ],
        features: [
          {
            title: "Section Narrative & Composition",
            description:
              "Ten sections composed in a deliberate conversion funnel order: Hero → pain-point framing (Success Stories) → product demonstrations → social proof (Testimonials) → pricing and FAQ. Each section follows a shared structural pattern — radial-gradient background, max-w-[1200px] content container, consistent card styling — for visual cohesion.",
            tone: "primary",
          },
          {
            title: "CSS-First Animation System",
            description:
              "Background orbital elements use @keyframes orbit1/orbit2 (20 s linear infinite) defined in globals.css. Hover micro-interactions (translate-y lift on social icons, color transitions on CTAs, chevron rotation on accordion open) are all pure Tailwind utilities — no JavaScript animation runtime.",
            tone: "secondary",
          },
          {
            title: "Responsive Layout System",
            description:
              "Mobile-first approach with seven custom Tailwind breakpoints (xxs 320 px → 2xl 1440 px). Layout-structural changes (column count, element visibility) use the useDevices hook; purely visual changes (font size, spacing, padding) stay in Tailwind responsive prefixes. Features section uses a .reduce() to pair items into desktop columns.",
            tone: "primary",
          },
          {
            title: "Frosted-Glass Card System",
            description:
              "A shared card pattern — linear-gradient(180deg, rgba(242,246,252,0.50), rgba(255,255,255,0.50)) background with a four-layer box-shadow — is reused across Products, Features, and Testimonials for visual consistency without a separate component abstraction.",
            tone: "secondary",
          },
          {
            title: "Interactive Pricing Toggle",
            description:
              "Monthly/annual pricing switch with transition-all duration-300 ease-in-out background animation and a savings badge on the annual tier. Pricing tiers (Starter, Basic, Pro, Enterprise) are defined as typed constants and rendered with an auto-fit CSS grid (minmax(290px, 1fr)).",
            tone: "primary",
          },
          {
            title: "Autoplay Testimonials Carousel",
            description:
              "Embla Carousel with 3-second autoplay and infinite loop. Desktop view shows three slides simultaneously (lg:basis-1/3) with left/right fade-gradient overlays to hint at adjacent content. Carousel degrades gracefully to full-width slides on mobile.",
            tone: "secondary",
          },
          {
            title: "Sticky Scroll Navigation",
            description:
              "Header is sticky at top: 25 px with backdrop-blur-[3.5px] frosted glass effect. useScrollToSection dynamically offsets scroll position by the header's clientHeight. Cross-page anchor routing uses sessionStorage to persist the target section ID across a redirect.",
            tone: "primary",
          },
          {
            title: "Multi-Step Demo Booking Flow",
            description:
              "Three-page booking funnel (/request-demo → /booking-meeting → /information) backed by a sessionStorage-persisted Zustand store. React Hook Form + Zod validation on each step. Geolocation API prefills country and timezone. Honeypot field guards against spam submissions.",
            tone: "secondary",
          },
        ],
        previewSlides: [
          { alt: "Hero section — headline and primary CTA" },
          { alt: "Products section — three core detection features" },
          { alt: "Features section — responsive two-column grid" },
          { alt: "Pricing section — monthly/annual toggle with tier cards" },
          { alt: "Testimonials carousel with fade-gradient overlays" },
          { alt: "FAQ accordion — Radix UI multi-expand" },
        ],
      },
      links: { demo: "https://qlay.ai/"}
    },

    {
      slug: "good-viet-goods",
      title: "Good Viet Goods",
      subtitle: "Logistic Platform",
      description:
        "A Vietnamese-language B2C e-commerce platform for port-related goods, featuring multi-currency product browsing, a Redux-synchronized shopping cart, Google OAuth authentication, and a responsive storefront built with Next.js and Mantine UI.",
      role: "Frontend Engineer",
      period: "Feb 2024 – Apr 2024",
      tags: [
        "Next.js",
        "TypeScript",
        "Mantine UI",
        "Redux Toolkit",
        "SCSS Modules",
        "REST API",
        "Google OAuth",
        "Responsive Design",
        "E-commerce",
        "Logistics",
      ],
      categories: ["E-commerce"],
      accent: "warning" as TagTone,
      featured: true,
      detail: {
        tagline: "A full-featured port-commerce storefront — built for dual-currency markets and logistics-aware buyers.",
        problem: [
          "Buyers sourcing port-related goods lacked a structured digital channel to browse inventory by category, compare prices across currencies, and manage orders — relying instead on manual communication.",
          "The platform needed to serve both Vietnamese domestic buyers (VND pricing) and international buyers (USD pricing) with a single, cohesive storefront.",
          "Authentication had to support both traditional email/password sign-up and social login via Google, with cart state persisting across both flows.",
        ],
        solution: [
          "Built a Next.js Pages Router storefront with dynamic routes for products (`/product/[slug]`) and categories (`/category/[slug]`), all powered by a REST API via a centralized Axios-based request module.",
          "Implemented dual-currency pricing (VND and USD) across every product surface — cards, detail pages, and the cart summary — with consistent formatting using a shared `NumberUtils.toCurrency` utility.",
          "Architected a hybrid state model: Redux Toolkit for globally-shared UI state (cart, categories, producers) and React Context for the authentication lifecycle, keeping concerns cleanly separated.",
          "Integrated Google OAuth with a server-side callback page (`/auth/google/callback`) that exchanges an auth code for a JWT, then hydrates user state — enabling seamless social sign-in without a full page reload.",
        ],
        challenges: [
          {
            title: "Cart State Synchronization Across Auth Flows",
            description:
              "Cart contents needed to be accurate regardless of whether the user signed in via email/password or Google OAuth, and had to reflect server state on every app load.",
            solution:
              "On successful authentication (both flows), the `AccountProvider` context immediately dispatches a cart fetch, populating the Redux `cartProducts` slice. The cart badge in the header reactively computes the total item count by reducing over `cartProducts.docs[].amount` from Redux state.",
            outcome:
              "Cart badge and totals stay in sync with server state after every login, token hydration, and quantity update — without requiring a page reload.",
            tags: ["Redux", "React Context", "API Sync"],
          },
          {
            title: "Unified Product Slug Routing with Vietnamese Characters",
            description:
              "Product names are in Vietnamese (with diacritical marks), making direct URL usage impractical. Slugs needed to be human-readable, URL-safe, and reversible for API lookups.",
            solution:
              "Implemented `StringUtils.toSlug()` which strips Vietnamese diacritics via a character mapping table and appends the product `_id` (e.g. `ten-san-pham-abc123`). `StringUtils.toOriginalURI()` reverses the slug back to the ID on the detail page, enabling the API call without a separate slug field on the backend.",
            outcome:
              "Clean, shareable product URLs that work with the existing backend — no backend slug field required.",
            tags: ["Routing", "Internationalization", "Slug Strategy"],
          },
          {
            title: "Header Search with Live Autocomplete",
            description:
              "The search input needed to show live product suggestions without hammering the API on every keystroke, while also supporting a separate full-screen mobile experience.",
            solution:
              "Used Mantine's `useDebouncedValue` (200ms) to gate API calls. Desktop shows an inline dropdown card with scale-y CSS transition; mobile uses a full-screen Modal with the same result list. Both share the same `ProductModule.getList({ name })` call and navigate to `/search?keyword=` on submit.",
            outcome:
              "Responsive, performant autocomplete with no duplicated logic between desktop and mobile implementations.",
            tags: ["Debounce", "Responsive Design", "Search UX"],
          },
          {
            title: "Cascading Filter System for Category and Search Pages",
            description:
              "Product listings needed multi-dimensional filtering (sort order, category, brand/producer) where the available brand options depend on the selected category.",
            solution:
              "Category page and search page both implement cascading Select dropdowns: selecting a category triggers a filtered `ProducerModule` fetch to populate the brand dropdown. All active filters are assembled into a single API query (`categoryId`, `producerId`, `sort`, `estimatePrice`, `limit`, `offset`) on every filter change.",
            outcome:
              "Intuitive cascading filter UX with offset-based pagination (20 items/page), consistent across both the category browsing and keyword search flows.",
            tags: ["Filter UX", "Pagination", "API Query Composition"],
          },
        ],
        features: [
          {
            title: "Product Storefront with Dual-Currency Pricing",
            description:
              "Product catalog organized by category, with each product card showing name, truncated description, VND price, and USD price. Detail pages include an image gallery with thumbnail carousel, quantity selector, product metadata (origin country, weight, brand), and a related products section.",
            metric: "20 products/page, paginated with offset",
            tone: "primary",
          },
          {
            title: "Redux-Synchronized Shopping Cart",
            description:
              "Cart screen displays items with quantity editing, per-item VND/USD totals, and a live order summary (item count, total VND, total USD). All mutations (add, update quantity, delete) sync back to the server and update Redux state, keeping the header cart badge accurate in real time.",
            tone: "secondary",
          },
          {
            title: "Google OAuth + Email/Password Authentication",
            description:
              "Authentication modal supports toggle between login and register, with real-time password validation checklist (length, uppercase, lowercase, digit). Google OAuth flow redirects to the backend, returns an auth code to `/auth/google/callback` via SSR `getServerSideProps`, and exchanges it for a JWT stored in localStorage.",
            tone: "primary",
          },
          {
            title: "Debounced Live Search with Autocomplete",
            description:
              "Header search debounces input at 200ms to fetch live product suggestions. Desktop renders an inline animated dropdown; mobile renders a full-screen modal. Submitting navigates to `/search?keyword=` with full filter support (category, brand, sort).",
            tone: "secondary",
          },
          {
            title: "User Account Management",
            description:
              "Profile editing with avatar file upload (FileReader preview), display name, and contact info. Change-password form with real-time inline validation checklist. Collapsible sidebar navigation (`UserNavbarProfile`) used across all user account pages.",
            tone: "primary",
          },
          {
            title: "Responsive Layout System",
            description:
              "Three-tier responsive breakpoints (mobile/tablet/desktop) using Mantine's `useMediaQuery` and `visibleFrom`/`hiddenFrom` props. Product grids reflow from 1 → 4 → 5 columns; header collapses search into a full-screen modal on mobile; cart and profile pages switch between stacked and side-by-side layouts.",
            tone: "secondary",
          },
        ],
        previewSlides: [
          { alt: "Home page with category carousel and featured product grid" },
          { alt: "Product detail page with image gallery and dual-currency pricing" },
          { alt: "Shopping cart with order summary and sticky checkout bar" },
          { alt: "Authentication modal with real-time password validation" },
          { alt: "Category page with cascading filter dropdowns and pagination" },
          { alt: "User profile with avatar upload and account navigation sidebar" },
        ],
      },
    },

    {
      slug: "mesea",
      title: "MESEA",
      subtitle: "Multichain NFT Exchange",
      description:
        "Developed frontend features for a multichain NFT marketplace with DeFi integrations including wallet connectivity, cross-chain interactions, and trading experiences optimized for Web3 users.",
      role: "Frontend Engineer",
      period: "2023",
      tags: ["React", "TypeScript", "Web3.js", "NFT", "DeFi", "Solidity", "Smart Contract"],
      categories: ["Web3"],
      accent: "energy" as TagTone,
    },
  ] satisfies WorkItem[],
};
