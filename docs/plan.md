## Travel & Tours – Development Plan (Based on Current Trello Tickets)

This document breaks the product into phases with trackable checklists. Use the table below as a high-level roadmap and the per-phase sections to manage detailed work.

### Phase Overview

| Phase | Name | Primary Goal | Status | Target Sprint |
| -- | -- | -- | -- | -- |
| 0 | Foundation & Project Setup | Solid technical baseline and environments | In Progress |  |
| 1 | Auth & Core User Accounts | Secure login and basic profiles for all roles | In Progress |  |
| 2 | Business Onboarding & Verification | Bring businesses onto the platform safely | In Progress |  |
| 3 | Tour & Product Management | Let businesses create and manage tours | In Progress |  |
| 4 | Discovery & Customer Booking Flow | Let customers discover tours and start bookings | In Progress (UI + search; listings mock) |  |
| 5 | Payments, Bookings & Customer Dashboards | Complete booking lifecycle with payments & history | Not started |  |
| 6 | Feedback, Reviews & FAQs | Capture and surface guest feedback & FAQs | Not started |  |
| 7 | Business & Admin Dashboards, Moderation & Analytics | Operate and govern the platform | In Progress (admin businesses queue; suspend) |  |
| 8 | Business Plans & Subscriptions | Monetize business accounts via tiers & Paymongo | Not started |  |

> **How to use:** Update the **Status** column and checklists below (`[x]`) as work progresses. Add issue/task links next to items (e.g., `(#123)`).

### Codebase Analysis (2026-03-30)

*Last updated from repository inspection. Key findings:*
- **Phase 0:** Core schema (profiles, companies, tours, bookings, reviews, tour\_\*, categories, blackout\_dates, etc.) exists via migrations. Generated types path: `supabase/types/database.ts` (see `npm run types` in `package.json`). ESLint & Prettier exist; **no** `.github/workflows` CI yet (only `.github/pull_request_template.md`). Seed pipeline exists but `supabase/seeders/index.ts` has no seeders registered—local “seeded demo data” is still a gap.
- **Phase 1:** Forgot/reset password (`/forgot-password`, `/reset-password`, `requestPasswordResetAction`). Customer profile editing. `requireRole` guards; dashboard areas for Customer, Business Owner, Agent, Admin.
- **Phase 2:** Business onboarding (`BusinessOnboardingModal`), permit upload, admin list/detail with approve/decline/**suspend** (`updateCompanyStatusAction`). **Company status gating:** `src/app/(dashboard)/agency/layout.tsx` blocks non-approved **business owners** with `AgencyStatusWall` (pending / declined / suspended). **Residual:** `AGENT` role enters agency routes without the same company-status check in that layout—confirm policy if agents should inherit employer status.
- **Phase 3:** Tour **create** and **edit** (`/agency/tours/new`, `/agency/tours/[id]/edit`) share wizard/payload patterns. Photos: upload, **drag reorder**, and remove (`basics-step.tsx`); service persists `sort_order` on update. **Blackout dates:** UI in publish/finalize steps + `blackout_dates` table via `tour.service`. Tours list with filters; **activate/deactivate** via `is_active` toggle (not a hard delete / archive flow). **Still open:** booking-time enforcement of capacity/blackouts; true soft-delete or archival if required by product.
- **Phase 4:** Public **`/explore`** page: full layout—search bar (keyword + optional dates/guests on home variant), filters (duration, provider, rating), sort, pagination—but **grid data is mock** (`MOCK_PACKAGES` in `explore/page-client.tsx`). **Database-backed** public tour **name suggestions** exist: `searchPublicTourSuggestionsAction` → `tourService.searchPublicTourSuggestions`, wired via `UnifiedTourExploreSearch` / combobox. Marketing home still uses static/placeholder packages (`src/app/page.tsx` TODO). No public tour detail route or booking flow wired to live tours yet.
- **Phase 5–8, 6–7:** No Paymongo (or other payment) usage in `src/` yet. Reviews/FAQs/booking flows remain largely plan-only; admin suspend-**business** is implemented; per-user suspension and content moderation queues not seen in code.

---

### Phase 0 – Foundation & Project Setup

**Goal:** Establish the technical foundations so future features can be shipped quickly and safely.

**Scope:**

* Supabase project (auth, database, local environment).
* Web app scaffold (framework, routing, layout).
* Shared UI library and design system hooks.
* Basic CI, linting, formatting.

**Checklist**

- [X] Supabase project configured (local & remote).
- [X] Base schema created for core entities (users, roles, companies, tours, bookings, reviews).
- [X] Supabase migrations workflow set up and documented (`supabase/schemas`, `supabase/migrations`).
- [X] Types generated from Supabase (`supabase/types/database.ts`) and wired into the app.
- [X] Web app scaffolded (routing, layouts, global styling, env handling).
- [X] Base design system / component library integrated (buttons, inputs, forms, toasts).
- [X] Authentication guard pattern decided (e.g., route-level protection, RLS strategy).
- [X] ESLint and Prettier scripts configured (`npm run lint`, `npm run format`).
- [ ] CI workflow (lint/format on push/PR) in `.github/workflows`.

**Definition of Done**

- [ ] Team can run the app locally with seeded data.
- [ ] New DB changes follow the documented Supabase migration workflow.
- [ ] CI passes for linting/formatting on all new branches.

---

### Phase 1 – Authentication & Core User Accounts

**Goal:** Let all user types sign up, sign in, and manage basic profiles.

**Covers product doc section:** *Authentication & Account Management* and role-based access for Customers, Business Owners, Agents, and Admins.

**Checklist**

- [X] Email-based registration for Customers implemented.
- [X] Login, logout, and session handling wired to Supabase Auth.
- [X] Forgot password / reset flow (email-based) working end-to-end.
- [X] Customer profile page with editable name, contact number, and emergency contact.
- [X] Role model defined in DB (Customer, BusinessOwner, Agent, Admin).
- [X] Role-based access control enforced in the app (per-dashboard routing/guards).
- [X] Basic skeleton dashboards/routes created for each role:
  - [X] Customer area shell (`/dashboard`).
  - [X] Business owner area shell (`/agency`).
  - [X] Agent area shell (`/agency`).
  - [X] Admin area shell (`/admin`).

**Definition of Done**

- [X] A new customer can register, log in, edit profile, log out, and log back in successfully.
- [X] Admin user can access an admin-only route; non-admins are blocked.
- [X] Unauthorized access attempts are gracefully redirected or receive appropriate errors.

---

### Phase 2 – Business Onboarding & Verification

**Goal:** Allow businesses to register, submit documents, and be approved by Admins.

**Covers product doc section:** *Business Onboarding & Verification* and corresponding admin review flows.

**Checklist**

- [X] DB tables for companies/businesses created (name, description, location, contacts, status).
- [X] Business registration form for Business Owners (company profile creation).
- [X] Document/permit upload mechanism implemented (permit upload via `BusinessOnboardingModal`; single document type; `company_documents` table not used).
- [ ] Business profile edit screen (branding, description, links) for approved businesses.
- [X] Admin view of all business applications with key fields and filters.
- [X] Admin actions to approve/decline applications with optional notes.
- [X] Company status gating (business owners):
  - [X] Only approved owners reach agency/tour routes (`agency/layout.tsx` + `AgencyStatusWall`).
  - [X] Pending, declined, and suspended owners see blocking messaging instead of the dashboard.

**Definition of Done**

- [X] A Business Owner can register a company, upload documents, and see “Pending review” state.
- [X] Admin can approve/decline and the company’s status updates in the Business Owner UI.
- [X] Only approved companies can proceed to create tours (for **business owner** accounts; confirm policy for **agents**).

---

### Phase 3 – Tour & Product Management

**Goal:** Let approved businesses create, edit, and manage tour offerings.

**Covers product doc section:** *Tour & Product Management*.

**Checklist**

- [X] DB tables for tours created (title, description, itinerary, inclusions, exclusions, duration, location, base price, pricing options).
- [X] Tour creation form for Business Owners/Agents.
- [X] Tour editing flow (`/agency/tours/[id]/edit`, same wizard patterns as create).
- [ ] Destructive removal / archival beyond **deactivate** (`is_active`: tours can be turned off from the list; rows are not deleted).
- [X] Media management for tours:
  - [X] Upload photos.
  - [X] Reorder (drag-and-drop) and remove photos; `sort_order` persisted on save.
- [X] Availability & capacity model (business UI + schema):
  - [X] Max slot limits per tour (`default_capacity`, `max_simultaneous_bookings`; schedules + `blackout_dates`).
  - [X] Blocked periods via **blackout dates** (wizard publish/finalize steps + `blackout_dates` table).
- [X] Business-facing tour list view with status (active/inactive) and quick actions (including activate/deactivate toggle).

**Definition of Done**

- [X] An approved business can create a tour with images, pricing, and capacity.
- [X] Tours can be **updated** and **deactivated** (`is_active`) without deleting tour rows.
- [X] Availability, blackouts, and slot limits are **enforced when bookings are created** (depends on Phase 4–5 booking flow).

---

### Phase 4 – Discovery & Customer Booking Flow (Pre-Payment)

**Goal:** Enable customers to discover tours, explore details, and initiate bookings up to payment.

**Covers product doc section:** *Discovery, Search & Browsing* and initial steps of the *Customer Journey*.

**Checklist**

- [ ] Public catalog listing **live** active tours from the database (today: home + `/explore` use **mock** package arrays; marketing home notes TODO).
- [X] Explore **UI shell** at `/explore` showing title, price, rating, location, and badges on **placeholder** data.
- [X] Keyword **suggestions** wired to Postgres (`searchPublicTourSuggestionsAction` / `tourService.searchPublicTourSuggestions` in combobox); full-text discovery results still mock-only on the explore grid.
- [ ] Client filters **driving server queries** for real tours:
  - [ ] Price range (sidebar shows non-functional placeholder inputs today).
  - [ ] Rating (filtering works on mock list only).
- [ ] Bookmark / shortlist functionality for logged-in customers.
- [ ] Tour detail page with:
  - [ ] Full description, itinerary, inclusions/exclusions.
  - [ ] Photos gallery.
  - [ ] Location, duration, and key logistics.
  - [ ] Tour-specific FAQ section (read-only for customers).
  - [ ] Reviews & average star rating surface (read-only).
- [ ] Availability calendar showing available dates and remaining slots per date.
- [ ] Booking selection UI:
  - [ ] Select date and participant count.
  - [ ] Pre-validation against capacity and blocked dates.

**Definition of Done**

- [ ] A customer can browse, search, and filter tours, open a tour page, and see availability.
- [ ] A customer can select a date and participants and move to a “Review & Pay” step without overbooking.

---

### Phase 5 – Payments, Bookings & Customer Dashboards

**Goal:** Complete the booking lifecycle with secure payments, confirmations, cancellations, and customer booking history.

**Covers product doc sections:** *Booking, Checkout & Payments* and *Customer Dashboards & History*.

**Checklist**

- [ ] Integration with local payment gateway(s) (cards, wallets, etc.) using Paymongo.
- [ ] Secure checkout flow:
  - [ ] Review booking details (tour, date, participants, total price).
  - [ ] Payment initiation and success/failure handling.
- [ ] Booking records created upon successful payment (status: confirmed).
- [ ] Upcoming bookings dashboard for customers with:
  - [ ] Dates, destinations, tour names.
  - [ ] Digital ticket view and essential info.
- [ ] Past bookings dashboard for customers with:
  - [ ] Previous trips and receipts.
- [ ] Cancellation request flow:
  - [ ] Customer can initiate cancellation.
  - [ ] Internal status pipeline (e.g., pending review, approved, rejected).
  - [ ] Hooks for Agent/Admin handling and policy logic.
- [ ] Notifications (email/in-app) for booking confirmation and cancellation outcomes (where applicable).

**Definition of Done**

- [ ] A customer can pay for a tour, see confirmation, and view it in upcoming bookings.
- [ ] Completed bookings move correctly to past bookings.
- [ ] Customer can request cancellation and see updated status.

---

### Phase 8 – Business Plans & Subscriptions

**Goal:** Introduce subscription plans for business accounts (including a free tier), gate key features by plan, and charge recurring fees via Paymongo.

**Covers product doc sections:** *Business Dashboards & Insights*, *Admin Tools, Moderation & Platform Content*, and *Business Plans, Subscriptions & Billing*.

**Plan levers / what changes with tiers**

* **Usage caps**
  * Maximum number of **active tours** per company.
  * Maximum number of **active agents** per company.
  * Maximum number of **photos per tour** or storage limits.
* **Insight depth**
  * Access to **advanced analytics** (conversion funnels, repeat customers, destination breakdowns).
  * Access to **exportable reports** (CSV downloads).
* **Growth & visibility**
  * **Priority / featured placement** in discovery pages.
  * Access to **promotional tools** (e.g., discount codes in a later phase).
* **Operational tooling & support**
  * Priority support level (e.g., standard vs. email + chat).
  * Early access to upcoming features (optional flag).

**Checklist**

- [ ] DB tables for plans created (name, price, billing interval, feature caps such as max_active_tours, max_agents, advanced_analytics_enabled, featured_listing_enabled, support_level).
- [ ] DB tables for company subscriptions created (links company → plan, with status, current period start/end, Paymongo identifiers).
- [ ] Extend payments model to support subscription payments (reusing the same payments table with optional booking/subscription linkage).
- [ ] Business onboarding updated so new companies are assigned to a default **free** plan.
- [ ] Business owner UI to:
  - [ ] View current plan, limits, and remaining usage.
  - [ ] Browse available plans with a clear comparison of features.
  - [ ] Upgrade/downgrade plans (respecting billing rules).
- [ ] Paymongo integration for subscription charges:
  - [ ] Create and attach payment method for the company.
  - [ ] Handle initial subscription payment and recurring renewals (via webhooks or scheduled jobs).
  - [ ] Reflect payment status in company subscription records.
- [ ] Enforcement of plan limits in core flows:
  - [ ] Blocking additional active tours once the plan’s limit is reached (with clear upgrade messaging).
  - [ ] Blocking additional active agents beyond the plan’s limit.
  - [ ] Feature flags in UI for advanced analytics, exports, and featured listing options.
- [ ] Admin tools:
  - [ ] View a company’s current plan and subscription status.
  - [ ] Manually adjust plan or subscription status when necessary (e.g., grace periods).

**Definition of Done**

- [ ] New companies start on a free plan with clearly communicated limits.
- [ ] Business Owners can upgrade to paid plans via Paymongo and see their plan & billing status in the dashboard.
- [ ] Plan limits are enforced in tour/agent creation and advanced analytics/visibility features.
- [ ] Admins can inspect and, when needed, correct subscription state.

---

### Phase 6 – Feedback, Reviews & FAQs

**Goal:** Capture guest feedback and empower businesses/agents to manage tour-specific FAQs.

**Covers product doc section:** *Feedback, Reviews & Community Content*.

**Checklist**

- [ ] Review model in DB (star rating, text review, links to booking and tour).
- [ ] Post-trip review flow:
  - [ ] Eligible customers prompted to leave rating and optional text.
  - [ ] Validation to ensure only completed bookings can review.
- [ ] Display of reviews and average rating on tour pages.
- [ ] Agent/Business ability to read and reply to feedback (publicly visible replies).
- [ ] Tour-level FAQ management UI for Agents/Businesses:
  - [ ] Add, edit, and remove FAQs for a tour.
- [ ] Tour page FAQ section wired to managed FAQs.

**Definition of Done**

- [ ] After a completed trip, a customer can submit a rating and review once per booking.
- [ ] Reviews and average ratings show on tour pages.
- [ ] Agents can manage FAQs and respond to reviews from their dashboard.

---

### Phase 7 – Business & Admin Dashboards, Moderation & Analytics

**Goal:** Give Business Owners and Admins the tooling to operate, moderate, and understand the platform.

**Covers product doc sections:** *Business Dashboards & Insights* and *Admin Tools, Moderation & Platform Content*.

**Checklist**

- [ ] Business Owner dashboard:
  - [ ] Overview of upcoming bookings.
  - [ ] Revenue/sales metrics (per period).
  - [ ] Top-performing tours.
  - [ ] Verification/document status indicators.
- [ ] Admin landing/dashboard page with quick links to:
  - [ ] Business applications queue.
  - [ ] Moderation queues (tours, reviews).
  - [ ] Global content management.
  - [ ] Analytics and reports.
- [ ] Admin governance tools:
  - [X] View all business applications and statuses.
  - [X] Approve/decline applications.
  - [X] Suspend **businesses** (company status on admin business detail).
  - [ ] Suspend individual **user** accounts (distinct from company suspension).
  - [ ] Delete inappropriate tours and reviews.
- [ ] Global content management:
  - [ ] Edit “About Us” page.
  - [ ] Edit global FAQ.
- [ ] Analytics & reporting:
  - [ ] Platform-wide statistics (users, bookings, revenue, top destinations, etc.).
  - [ ] Basic reporting views or export capabilities.

**Definition of Done**

- [ ] Business Owners can see a useful summary of performance and bookings.
- [ ] Admins can govern businesses, users, and content and update global pages.
- [ ] At least a minimal analytics view exists to understand platform health.

---

### Tracking & Maintenance

- [X] Keep the **Phase Overview** table updated with current status for each phase.
- [ ] For each checklist item above, link to implementation tickets or PRs as they are created.
- [ ] When scope changes, update this plan to reflect new features or de-scoped items.
- [ ] Review this document at the start and end of each sprint to adjust priorities.

## Metadata
- URL: [https://linear.app/travel-and-tours/issue/TRA-56/create-erd-and-project-plan-overview](https://linear.app/travel-and-tours/issue/TRA-56/create-erd-and-project-plan-overview)
- Identifier: TRA-56
- Status: Done
- Priority: No priority
- Assignee: ealanray@gmail.com
- Created: 2026-03-04T16:22:43.285Z
- Updated: 2026-03-09T06:42:22.772Z