# Phase 2 Dashboard And Onboarding

## App Router Layouts

The dashboard uses `apps/web/src/app/dashboard/layout.tsx` as the persistent shell. In the App Router, a layout wraps every nested page below it, so the sidebar and top navbar stay mounted while `/dashboard`, `/dashboard/onboarding`, and `/dashboard/settings` swap their page content.

```text
/dashboard/layout.tsx
  -> /dashboard/page.tsx
  -> /dashboard/onboarding/page.tsx
  -> /dashboard/settings/page.tsx
```

## Server And Client Components

Next.js App Router components are server components by default. Interactive pieces use `"use client"` because they need browser state, event handlers, Zustand, or local storage.

- Dashboard layout file: server wrapper.
- Dashboard shell/sidebar/topbar: client components because they use stores and click handlers.
- Dashboard pages: client components because they fetch authenticated browser API data with Axios and Zustand.

Later, authenticated server rendering can be added after moving tokens into secure HTTP-only cookies.

## Zustand Pattern

Each store owns one concern:

- `auth-store.ts`: current user and auth lifecycle.
- `dashboard-store.ts`: dashboard metrics and activity.
- `onboarding-store.ts`: onboarding form persistence.
- `dashboard-ui-store.ts`: sidebar collapsed/open state.

This keeps stores small and avoids one giant global state file.

## Backend Flow

```text
request
  -> requireAuth
  -> validator
  -> controller
  -> service
  -> MongoDB model
  -> response
```

Onboarding is stored on the user document because it is core account setup. It now acts as the workspace's brand context: business name, niche, audience, offer, brand voice, website, social handles, and content goals. Activity is stored in a separate collection because it can grow over time.

## Scalable SaaS UI Architecture

Feature code is grouped around dashboard concerns:

```text
components/dashboard/  reusable dashboard chrome
lib/*-api.ts          endpoint-specific API modules
store/*-store.ts      state per feature
app/dashboard/*       route-level pages
```

This structure supports future pages like billing, AI tools, generation history, and team settings without crowding one folder or one file. The current SaaS flow is:

```text
Register/login
  -> Complete brand onboarding
  -> Open generator sandbox
  -> Choose content format and tone
  -> Ask what to generate
  -> Backend injects saved onboarding context
```
