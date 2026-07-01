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
*   **`docs/api`**: Stores backend API reference files such as Postman collections used during integration.
*   **`prisma schema`**: Stores backend Prisma schema references used for role setup, entity fields, relationships, and TypeScript interface definitions.

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

---

## API Integration Preferences

1.  **Backend Reference Source**:
    *   Use `docs/api/complainced-backend.postman_collection.json` as the saved backend Postman collection reference for endpoint paths, request bodies, response shapes, and role-specific tokens/examples.
    *   Use the root `prisma schema` folder as the backend data-model reference for entity fields, enum values, relationships, role names, and interface definitions.
    *   Treat tokens and sample credentials in Postman files as sensitive local reference data. Do not paste them into components, docs, or chat summaries.
2.  **Before Adding Or Changing APIs**:
    *   Read `src/redux/api/baseApi.ts` to confirm `baseUrl`, headers, tokens, refresh behavior, and `prepareHeaders`.
    *   Read `src/redux/store.ts` to confirm API middleware and reducer wiring.
    *   Read a nearby existing service file such as `src/redux/service/auth/authApi.ts` or `src/redux/service/profile/profileApi.ts`.
    *   Read the page or feature component where the API hook will be used.
3.  **RTK Query First**:
    *   Add feature endpoints through `baseApi.injectEndpoints`.
    *   Keep shared configuration in `src/redux/api/baseApi.ts`.
    *   Put feature-specific service files under `src/redux/service/[feature]/[feature]Api.ts` or the closest existing feature folder.
    *   Export generated hooks from each service file and consume hooks in container/page-level components.
    *   Do not call `fetch` directly inside components unless there is a strong, explicit reason.
4.  **Endpoint Pattern**:
    *   Use `builder.query` for `GET` endpoints and `builder.mutation` for create/update/delete actions.
    *   Return query objects with `url`, `method`, optional `params`, and optional `body`.
    *   Use `providesTags` for read endpoints and `invalidatesTags` for mutations that should refresh cached data.
    *   Export hooks from the service file, for example `useGetUsersQuery`, `useCreateUserMutation`, and `useUpdateUserMutation`.
5.  **Mock-To-API Migration Style**:
    *   Replace `src/app/data` imports screen by screen.
    *   Preserve the component prop contracts where reasonable, and map backend responses into the existing UI shape before changing reusable/presentational components.
    *   Keep mock data available until the related API integration is complete and verified.
6.  **Component Boundaries**:
    *   Keep route `page.tsx` files thin.
    *   Put loading, error, filter, pagination, and mutation handler logic in container/view components.
    *   Keep tables, cards, modals, and form sections mostly presentational and driven by props.
    *   Page or feature components call API hooks, then pass clean data down as props.
7.  **Forms & Mutations**:
    *   Use mutation hooks for form submissions and CRUD actions.
    *   Use `react-hook-form` when building non-trivial forms, and add `zod` validation when validation rules are meaningful.
    *   Use `unwrap()` for mutations when component-level success/error handling is needed.
    *   Show loading state while submitting.
    *   Show user feedback with `sonner` toasts for create, update, delete, login, booking, and upload actions.
    *   Invalidate the smallest useful RTK Query tags after mutations.
8.  **Auth & Requests**:
    *   Continue using persisted auth state and cookies so `middleware.ts` can protect role routes.
    *   Keep login API logic in `src/redux/service/auth/authApi.ts`.
    *   After login, decode JWT when needed, save access/refresh tokens in Redux, save tokens in cookies, and redirect by normalized role.
    *   Do not scatter auth-only logic randomly inside components.
    *   Do not hardcode API base URLs. Use `NEXT_PUBLIC_API_URL`.
    *   Use `FormData` only when the backend expects multipart upload; otherwise send JSON bodies.
9.  **Loading, Empty & Error States**:
    *   Handle loading, empty, and error states in the UI for integrated screens.
    *   Show user-friendly error messages. Do not expose raw backend errors unless the details are useful to the user.
    *   If the backend response shape differs from the UI shape, adapt it cleanly in the API layer or feature component.
10. **Types, Roles & Enums**:
    *   Prefer TypeScript interfaces based on the Postman response examples and Prisma schema fields together.
    *   Use backend enum values exactly where they are persisted or returned, including `USER`, `ORGINIZER`, `CLINIC`, `ADMIN`, and `SUPERADMIN`.
    *   Normalize frontend route labels only at the app boundary when needed, such as mapping backend `SUPERADMIN` to the existing dashboard route convention.
    *   Reuse domain terms from Prisma for entities such as `Booking`, `Service`, `Location`, `MedicalRecord`, `OrganizerRequest`, `Payment`, and `Notification`.
11. **Naming & Cleanup**:
    *   Prefer current Compliance Medicals domain names for new integrations.
    *   Do not extend old real-estate-specific API names such as `properties`, `agency`, or `roofing` unless the backend endpoint truly uses that domain.
    *   After a screen is fully integrated, remove unused mock handlers/imports from that screen.
12. **Verification**:
    *   Run `npm run build` or `pnpm build` after API integration changes.
    *   If build fails because of types, fix the types instead of using `any` everywhere.
