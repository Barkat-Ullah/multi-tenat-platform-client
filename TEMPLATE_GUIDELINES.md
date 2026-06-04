# Project Template Guidelines & Preferences

This file documents the design and coding preferences for cleaning up and building the reusable Next.js template project.

## Directory Structure & Organization

*   **`src/app`**: Contains Next.js App Router routes.
    *   Route groups like `(auth)`, `(common)`, `(dashboard)` are for organization only and do not appear in the URL.
*   **`src/app/data`**: Contains centralized mock data and TypeScript interfaces for the mock state.
*   **`src/components`**: Contains modularized, reusable components.
    *   `src/components/ui`: Small reusable primitives (Button, Input, Modal, Spinner, Badge, Table wrappers).
    *   `src/components/layout`: Site-wide structures (Navbar, Footer, Layout wraps, Headers).
    *   `src/components/landing`: Landing page sections (HeroSection, FeatureSection, PricingSection, FAQSection, CTASection).
    *   `src/components/auth`: Forms (LoginForm, RegisterForm, ForgotPasswordForm, OTPForm).
    *   `src/components/dashboard`: Shared dashboard components (Sidebar, Header, StatCard, Layout wrappers).
    *   `src/components/dashboard/admin`: Admin-specific dashboard components.
    *   `src/components/dashboard/[role]`: Specific components for new user dashboard roles.
*   **`src/redux`**: Redux Toolkit slices, RTK Query API configurations, and central store setup.
*   **`src/lib` & `src/utils`**: General helper libraries, utilities (e.g., CSV export), and context providers.
*   **`src/middleware.ts`**: Handles route guards and role protection via JWT cookie parsing.
*   **`.env.local`**: Hosts system variables (such as API Base URLs).

---

## Coding Rules & Component Guidelines

1.  **Simple Pages (`page.tsx`)**:
    *   `page.tsx` files must remain minimal, acting as wrappers that import and render layout sections or containers. Avoid putting complex UI logic directly in route files.
2.  **No Giant Components**:
    *   Separate logic and UI elements by responsibility: Layout components, Sections, Forms, Tables/Lists, Cards/Items.
3.  **No Business-Specific Logic**:
    *   Real estate entities (properties, agents, favorites, comparisons, subscriptions, property payments, AI chats) should not be directly imported or used unless refactored into generic template layouts/types.
4.  **Adding a Dashboard Role**:
    *   Create `src/app/(dashboard)/dashboard/[role]/page.tsx`
    *   Add role validation in `src/middleware.ts`
    *   Configure route redirection in login submit (`src/app/(auth)/login/page.tsx`)
    *   Add sidebar configuration options
    *   Place components under `src/components/dashboard/[role]`
5.  **Auth & API Guidelines**:
    *   Maintain consistent JWT processing. Store tokens in cookie storage so middleware can read them.
    *   Redirect users after logging in based on their decoded token role (`decodedUser.role`).
    *   Shared endpoint setups go to `src/redux/api/baseApi.ts`.
    *   Specific feature endpoints go to `src/redux/service/[feature]/[feature]Api.ts`.
    *   Do not hardcode backend base URLs in components. Always use `.env.local` variables.
6.  **Safer Cleanup Process**:
    *   Check imports via global search before deleting any file.
    *   Delete old route pages first, followed by unused components.
    *   Always run `npm run build` (or `pnpm build` / `npm run lint`) to confirm compile-time safety after cleanup.

---

## Mock Data & State Management Rules

1.  **Centralized Mock Data**:
    *   Keep mock data centralized under files like `src/app/data/UserDashboardData.ts` or `src/app/data/AdminDashboardData.ts`. Never scatter mock data in components.
    *   Define and export clear TypeScript interfaces for all mock shapes.
2.  **Container vs. Presentational Separation**:
    *   Pages/Containers manage state, layout, and API-like CRUD function handlers.
    *   Presentational components (tables, filter bars, modals, stats cards) receive data and event triggers solely via props.
3.  **Simulated State CRUD**:
    *   Use local React state to simulate backend updates: add items on create, filter items on delete, map items on update.
    *   Use API-like handler names (e.g. `handleCreate`, `handleUpdate`, `handleDelete`, `handleExport`) to keep future API integration clean.
    *   Provide loading, empty, and basic error states in mock flows.
4.  **File Processing Flows**:
    *   Show selected file states, progress animations, and insert a new mock record into the tables/lists upon completion.
    *   Reset file inputs so users can repeat operations.
5.  **Central Export Helpers**:
    *   Implement and reuse CSV export utilities under `src/utils/exportCsv.ts`.
