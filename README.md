# MedComply — Multi-Tenant Medical Platform (Frontend)

> **Enterprise-grade multi-tenant frontend** for medical compliance management — connecting patients, clinics, organizers, and administrators in a unified ecosystem with secure document handling, real-time communication, and intelligent scheduling.

---

## Objective

Build a scalable, secure, and role-driven frontend that streamlines medical compliance workflows across multiple tenants. The client application enables:

- **Patients** to book medical compliance services, manage records, and track appointments.
- **Clinics** to manage availability, time slots, services, and patient bookings.
- **Organizers** to coordinate bulk driver/patient compliance requests across clinics.
- **Admins** to oversee users, locations, services, payments, and system health.
- **Super Admins** to configure global settings, roles, and audit trails.

---

## Tech Stack

| Category          | Technologies |
|-------------------|-------------|
| **Framework**     | Next.js 15.5 (App Router + Turbopack) |
| **Language**      | TypeScript 5.x |
| **UI Library**    | React 18.x, Ant Design 5.x, HeroUI 2.x |
| **Styling**       | Tailwind CSS 3.x, clsx, tailwind-merge |
| **State Mgmt**    | Redux Toolkit 2.x, Redux Persist |
| **API Layer**     | RTK Query (Redux Toolkit) |
| **Forms**         | React Hook Form 7.x, Zod 3.x, @hookform/resolvers |
| **Auth**          | JWT Decode, js-cookie, CryptoJS |
| **Routing**       | Next.js App Router (file-based) |
| **Animation**     | Framer Motion 11.x, Lottie React 2.x |
| **Carousels**     | Swiper 12.x, react-fast-marquee |
| **Charts**        | Recharts 3.x |
| **Maps**          | Leaflet 1.x, react-leaflet 4.x, react-intersection-observer |
| **Icons**         | Lucide React, Ant Design Icons 6.x, React Icons 5.x |
| **Date Handling** | dayjs 1.x, moment 2.x |
| **Rich Text**     | Jodit React 5.x |
| **Notifications** | Sonner 1.x |
| **File Upload**   | react-dropzone 14.x |
| **Dev Tools**     | ESLint 9.x, TypeScript, PostCSS 8.x |

### Key Packages

```
next@^15.5.18                          react@^18.3.1
react-dom@^18.3.1                      @reduxjs/toolkit@^2.4.0
antd@^5.27.4                           @heroui/react@^2.6.0
framer-motion@^11.18.2                 tailwindcss@^3.4.1
swiper@^12.1.0                         recharts@^3.6.0
react-hook-form@^7.53.2                zod@^3.23.8
lucide-react@^0.512.0                  dayjs@^1.11.13
leaflet@^1.9.4                         react-leaflet@^4.2.1
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Next.js 15 App Router                  │
│  ┌────────────┐  ┌────────────┐  ┌───────────────────┐  │
│  │  Layouts   │  │   Pages   │  │    API Routes     │  │
│  │ (Root/Auth/│  │(Showcase, │  │  (BFF proxies)    │  │
│  │  Dashboard)│  │  Booking, │  │                   │  │
│  │            │  │  Dashboard)│  │                   │  │
│  └────────────┘  └────────────┘  └───────────────────┘  │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│                   State & Data Layer                      │
│  ┌──────────────────┐  ┌──────────────────────────────┐  │
│  │   Redux Store    │  │       RTK Query (API)        │  │
│  │  ┌────────────┐  │  │  ┌────────────────────────┐ │  │
│  │  │   Auth     │  │  │  │  Base API + Endpoints  │ │  │
│  │  │   (persist)│  │  │  │  (Auth, Profile,       │ │  │
│  │  └────────────┘  │  │  │   Booking, Services,   │ │  │
│  │  ┌────────────┐  │  │  │   Medical Records,    │ │  │
│  │  │  Compare   │  │  │  │   Messages, etc.)     │ │  │
│  │  └────────────┘  │  │  └────────────────────────┘ │  │
│  └──────────────────┘  └──────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│                  Component Layer                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Shared: Navbar, Footer, HeroSection, SectionEyebrow│ │
│  │  Auth: AuthBackButton                              │ │
│  │  Booking: BookingMap, Step1-5, PaymentError/Success │ │
│  │  Dashboard: Admin, Clinic, Organizer, User, SuperAdmin │
│  │  Pages: Home, Showcase, TaxiMedical, FAQ, Locations │ │
│  │  UI: Logo, Spinner, Icons, ImageZoom, ScrollToTop  │ │
│  └────────────────────────────────────────────────────┘  │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│                    Backend API                            │
│           REST API @ https://api.homify.barkatullah.dev    │
│           WebSocket, Socket.io, Firebase FCM             │
└───────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
src/
├── app/                              # Next.js App Router pages
│   ├── (auth)/                       # Auth group (login, register, OTP, reset)
│   │   ├── login/                    # Login page
│   │   ├── register/                 # Registration page
│   │   ├── otp/                      # OTP verification
│   │   ├── forget-password/          # Forgot password
│   │   └── reset-password/           # Password reset
│   ├── (common)/                     # Public pages group
│   │   ├── showcase/                 # Tech stack & features showcase
│   │   ├── taxi-medicals/            # Taxi medicals landing
│   │   ├── hgv-bus-medicals/         # HGV/Bus medicals landing
│   │   ├── other-medicals/           # Other medicals landing
│   │   ├── occupational-health/      # Occupational health landing
│   │   ├── business/                 # Business landing
│   │   ├── locations/                # Clinic locations
│   │   ├── faq/                      # FAQ page
│   │   ├── privacy-policy/           # Privacy policy
│   │   └── terms/                    # Terms of service
│   ├── (dashboard)/                  # Dashboard group (role-based)
│   │   ├── dashboard/
│   │   │   ├── admin/                # Admin dashboard (users, services, bookings)
│   │   │   ├── clinic/               # Clinic dashboard (patients, schedule, documents)
│   │   │   ├── orginizer/            # Organizer dashboard (drivers, bookings, reports)
│   │   │   ├── super-admin/          # Super Admin dashboard (global settings, audit)
│   │   │   └── user/                 # User/Patient dashboard (bookings, reports)
│   ├── booking/                      # Booking flow (multi-step)
│   ├── payment/                      # Payment result pages
│   ├── data/                         # Static page data (LandingPageData, TaxiMedical, etc.)
│   ├── layout.tsx                    # Root layout with providers
│   └── globals.css                   # Global styles
│
├── components/                       # Reusable components
│   ├── ui/                           # Base UI (Logo, Spinner, Icons, ImageZoom, ScrollToTop, MyButton)
│   ├── shared/                       # Shared layout (Navbar, Footer, HeroSection, SectionEyebrow)
│   ├── auth/                         # Auth components (AuthBackButton)
│   ├── booking/                      # Booking flow components (Steps 1-5, Map, Payment)
│   ├── pages/                        # Page-specific components
│   │   ├── home/                     # Home page sections (Hero, Features, WhyChooseUs, etc.)
│   │   ├── landing/                  # Landing page sections (Taxi, HGV, Business, etc.)
│   │   ├── faq/                      # FAQ accordion
│   │   └── Profile/                  # User profile
│   ├── AdminDashboard/               # Admin dashboard components
│   ├── ClinicDashboard/              # Clinic dashboard components
│   ├── OrganizerDashboard/           # Organizer dashboard components
│   ├── UserDashboard/                # User dashboard components
│   ├── SuperAdminDashboard/          # Super admin dashboard components
│   ├── layout/                       # Layout utilities (TopBar)
│   └── table/                        # Data tables (Contacts, Payments, Subscriptions)
│
├── redux/                            # State management
│   ├── store.ts                      # Redux store configuration (persist)
│   ├── features/                     # Redux slices
│   │   ├── auth.ts                   # Authentication state
│   │   └── compareSlice.ts           # Comparison feature
│   ├── service/                      # RTK Query API services
│   │   ├── auth/                     # Auth API (login, register, OTP)
│   │   └── profile/                  # Profile API
│   └── api/                          # Base API configuration
│       └── baseApi.ts                # RTK Query base with fetchBaseQuery
│
├── lib/                              # Utility libraries
│   └── utils.ts                      # cn() helper (clsx + tailwind-merge)
│
├── assets/                           # Static assets (images, icons)
│   ├── home/                         # Home page images
│   ├── logo/                         # Brand logos
│   └── ...                           # Other asset folders
│
├── utils/                            # Utility functions
│   ├── roles.ts                      # Role normalization & dashboard routing
│   ├── bookingResume.ts              # Booking session resume
│   ├── onSiteRequestResume.ts        # On-site request session resume
│   └── previewMode.ts                # Preview mode detection
│
├── interface/                        # TypeScript interfaces
├── middleware.ts                     # Next.js middleware (auth redirects)
└── global.d.ts                       # Global type declarations
```

---

## Features by Role

### 👤 User (Patient / Driver)
- Register & manage profile (email/phone verification via OTP)
- OAuth login (Google, Facebook)
- Browse clinics & services by location with interactive map
- Multi-step booking flow (medical type → location → time slot → details → success)
- Upload & track medical compliance records
- Receive real-time notifications
- Raise support tickets
- View booking history & payment receipts
- Role-based dashboard with booking management

### 🏥 Clinic
- Manage clinic profile, services, and locations
- Configure availability & recurring time slots
- View & manage patient bookings (confirm, reschedule, cancel)
- Upload medical examination results
- Manage off-days & capacity
- View analytics dashboard with booking trends
- Manage medical forms and documents

### 📋 Organizer
- Request bulk compliance checks for drivers/patients
- Assign drivers to clinic appointments
- Track compliance status across all assigned personnel
- View organizer-level reports & analytics
- Manage organizer-specific dashboard
- Service request management

### 🔧 Admin
- Full user management (create, update, suspend, delete)
- Manage services, locations, and payment methods
- Configure system-wide settings (FAQ, Privacy, Terms)
- Monitor all bookings, payments, and medical records
- View global analytics & audit logs
- Manage support tickets & assignment
- Calendar view of all bookings
- Email client communication

### ⚙️ Super Admin
- All Admin permissions
- Create & manage admin accounts
- System-wide configuration
- Access to audit trails & error tracking
- Payment gateway configuration
- Global settings management

---

## Page Routes

| Route                     | Access         | Description                         |
|---------------------------|---------------|--------------------------------------|
| `/`                       | Public        | Home page with hero, features, CTA  |
| `/showcase`               | Public        | Tech stack & platform showcase      |
| `/booking`                | Public        | Multi-step booking flow             |
| `/taxi-medicals`          | Public        | Taxi medicals landing page          |
| `/hgv-bus-medicals`       | Public        | HGV/Bus medicals landing            |
| `/other-medicals`         | Public        | Other medicals landing              |
| `/occupational-health`    | Public        | Occupational health landing         |
| `/business`               | Public        | Business services landing           |
| `/locations`              | Public        | Clinic locations with map           |
| `/faq`                    | Public        | Frequently asked questions          |
| `/privacy-policy`         | Public        | Privacy policy                      |
| `/terms`                  | Public        | Terms of service                    |
| `/login`                  | Guest         | Login with demo quick badges        |
| `/register`               | Guest         | User registration                   |
| `/otp`                    | Guest         | Email/phone OTP verification        |
| `/forget-password`        | Guest         | Password reset request              |
| `/reset-password`         | Guest         | Password reset with token           |
| `/dashboard/user`         | User          | Patient/driver dashboard            |
| `/dashboard/clinic`       | Clinic        | Clinic dashboard                    |
| `/dashboard/orginizer`    | Organizer     | Organizer dashboard                 |
| `/dashboard/admin`        | Admin         | Admin dashboard                     |
| `/dashboard/super-admin`  | Super Admin   | Super admin dashboard               |
| `/payment/success`        | User          | Payment success confirmation        |
| `/payment/cancel`         | User          | Payment cancellation                |
| `/payment/error`          | User          | Payment error                       |
| `/payment/failed`         | User          | Payment failed                      |

---

## Key Design Decisions

| Decision          | Approach |
|-------------------|----------|
| **Framework**     | Next.js 15 App Router with Turbopack for fast HMR and optimized builds |
| **State Mgmt**    | Redux Toolkit with Redux Persist for auth state across sessions |
| **API Layer**     | RTK Query for declarative caching, auto-refetch, and optimistic updates |
| **Auth**          | JWT tokens stored in cookies + Redux with role-based route protection via middleware |
| **Styling**       | Tailwind CSS with Ant Design components — utility-first + design system |
| **Forms**         | React Hook Form with Zod schemas for type-safe, performant form validation |
| **Animations**    | Framer Motion for page transitions, scroll-triggered reveals, and micro-interactions |
| **Carousels**     | Swiper with autoplay, pagination, and responsive breakpoints |
| **Maps**          | Leaflet + react-leaflet for interactive clinic location picker |
| **Charts**        | Recharts for role-based analytics dashboards |
| **Notifications** | Sonner for toast notifications, SSE for real-time updates |
| **Middleware**    | Next.js middleware for auth redirects and route protection |
| **Responsive**    | Mobile-first design with `xs:540px` breakpoint for small devices |

---

## Setup

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** or **pnpm** (pnpm workspace configured)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Barkat-Ullah/multi-tenat-platform-client.git
cd multi-tenat-platform-client

# 2. Install dependencies (using pnpm)
pnpm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your API endpoint and credentials

# 4. Start development server
pnpm dev
```

Server starts at **http://localhost:3000**.

### Environment Variables

```env
# ─── API ───
NEXT_PUBLIC_API_URL=https://api.homify.barkatullah.dev/api/v1

# ─── Authentication ───
NEXT_PUBLIC_JWT_ACCESS_KEY=your-jwt-access-key
NEXT_PUBLIC_JWT_REFRESH_KEY=your-jwt-refresh-key

# ─── Maps ───
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# ─── Features ───
NEXT_PUBLIC_PREVIEW_MODE=false
```

### Available Scripts

| Command            | Description                          |
|--------------------|--------------------------------------|
| `pnpm dev`         | Start dev server with Turbopack      |
| `pnpm build`       | Production build                     |
| `pnpm start`       | Start production server              |
| `pnpm lint`        | Run ESLint                           |

---

## Authentication Flow

```
Register → Verify email via OTP → Login → JWT stored in cookies + Redux
                                          ↓
                              Next.js Middleware checks auth
                                          ↓
                              Role-based redirect to dashboard
```

1. User registers at `/register`
2. Verifies email via OTP at `/otp`
3. Logs in at `/login` (supports demo quick-login badges)
4. JWT access & refresh tokens stored in cookies and Redux (persisted across sessions)
5. Next.js middleware checks authentication and redirects accordingly
6. Role-based dashboard routing via `getDashboardPathByRole()`

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

ISC © [MedComply](LICENSE)

---

<p align="center">Built with Next.js, TypeScript, Tailwind CSS & ❤️</p>
