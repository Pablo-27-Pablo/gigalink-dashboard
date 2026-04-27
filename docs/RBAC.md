# RBAC + JWT (Bearer) Recommendations

This project is a Next.js App Router dashboard with multiple portals (vendor/agent, distributor, superadmin). The UI currently routes users based on portal selection and placeholder role logic. This document describes a best-practice RBAC approach when your backend issues a **JWT intended for `Authorization: Bearer <token>`**.

The goals:
- **Enforce authorization server-side** (not just hiding UI).
- Use a **single source of truth** for the current user and their role/permissions.
- Keep authorization logic centralized and auditable.
- Keep routing structure aligned with role boundaries.

---

## Key constraint: Bearer JWT is not attached to page navigations

Browsers do not automatically include the `Authorization` header on normal navigations like visiting `/dashboard/profile`.

So if your backend only accepts Bearer tokens:
- **Client-side fetches** can attach `Authorization: Bearer ...`.
- **Server-side rendering / middleware / layouts** cannot rely on the browser to provide the header.

**Recommendation:** after login, store authentication in a **secure cookie-based session** that the Next app can read server-side.

Two common patterns:
- **Cookie contains the JWT** (access token) as `HttpOnly; Secure; SameSite=Lax` and the app verifies it server-side.
- **Cookie contains an app session id**, and your server (or an internal auth service) maps that to the backend token.

Either way, authorization checks in Next should use **cookies**, not URL params.

---

## Recommended enforcement layers (defense-in-depth)

### 1) `middleware.ts` (route-level gate)

Use middleware for coarse controls:
- Must be authenticated to access protected route groups (e.g. anything under `/dashboard/**`).
- Must have the right role to enter role-scoped paths (e.g. `/dashboard/vendor/**`).

Middleware is best for:
- Fast redirects to `/login`.
- Preventing unauthorized pages from even starting to render.

Keep middleware logic simple:
- Parse/verify session token from cookies.
- Determine role.
- Apply path-based allow/deny rules.

### 2) Role group `layout.tsx` (page-level gate)

Within `src/app/(dashboard)/dashboard/...`, put a gate in the role-specific layout. This ensures **every child page** inherits the rule.

Example conceptual grouping:
- `src/app/(dashboard)/dashboard/(vendor)/...`
- `src/app/(dashboard)/dashboard/(distributor)/...`
- `src/app/(dashboard)/dashboard/(admin)/...`

The role group `layout.tsx` should:
- Read/verify session server-side.
- Redirect or render “Unauthorized”.

### 3) API routes / route handlers (API-level gate)

If you add `src/app/api/**/route.ts` as a proxy to your backend:
- Re-check role/permissions **on every API handler**.
- Forward the backend token server-to-server.

Never trust the client to only call “allowed” endpoints.

---

## Roles vs permissions (recommended model)

### Roles (coarse)
Start with roles you already have:
- `vendor` (aka agent portal)
- `distributor`
- `superadmin`

### Permissions (fine-grained)
Define permissions as strings or constants, such as:
- `voucher:read`
- `voucher:request`
- `voucher:assign`
- `vendor:read`
- `vendor:manage`
- `profile:read`
- `profile:edit`
- `reports:view`

### Policy map (roles → permissions)
Keep one mapping in one place. For example:
- `vendor`: `voucher:read`, `voucher:request`, `profile:read`, `profile:edit`
- `distributor`: includes vendor management + voucher assignment
- `superadmin`: `*` or explicit full set

This avoids scattering `if (role === "...")` throughout UI and API code.

---

## Single source of truth for user/session

Create (conceptually) a single server-side function:

- `getCurrentUser()` returns:
  - `sub` / user id
  - `role`
  - optional `tenantId` (if multi-tenant)
  - derived `permissions` (from the policy map)

Then authorization uses:
- `can(user, permission)` → boolean
- `assertCan(user, permission)` → throws/redirects

This makes it easy to:
- Gate pages, layouts, API routes consistently.
- Generate nav menus from permissions.

---

## JWT verification best practices

Whether you store the JWT in a cookie or exchange it for a session, verification rules should include:
- **Verify signature** (never just decode).
- Validate **`exp`** and reject expired tokens.
- Validate **`iss`** and **`aud`** (prevents token confusion across environments/apps).
- Consider `nbf` (not-before) if present.

### Key management
- If backend uses asymmetric keys (recommended), expose **JWKS**.
- Cache keys and support rotation.

### Claims to include (minimal)
- `sub` (user id)
- `role` (or `roles`)
- `iss`, `aud`, `exp`
- optionally `tenantId`

Avoid putting huge permission lists in the token unless you truly need self-contained authorization.

---

## UI: hide links, but don’t rely on it

Hiding navigation items based on role/permissions improves UX, but:
- **It is not security.**
- Always enforce on middleware/layout/API.

Recommended approach:
- Build `navItems` from `permissions`.
- Keep a single nav config with required permission per item.

---

## Routing structure recommendations (fit to this repo)

You already have:
- `src/app/(auth)/login/page.tsx`
- `src/app/(dashboard)/dashboard/layout.tsx`
- `src/app/(dashboard)/dashboard/(pages)/*`

To align with RBAC, consider converging on:
- `/dashboard` as a **role router** (server decides destination)
- `/dashboard/vendor/*`
- `/dashboard/distributor/*`
- `/dashboard/admin/*`

This reduces confusion like `/distributor/dashboard` vs `/dashboard/distributor`.

---

## Migration checklist (practical steps)

1) **Decide token storage**
   - Store backend JWT in an `HttpOnly` cookie, or exchange for an app session cookie.

2) **Implement server-side session read**
   - A single `getCurrentUser()` that verifies token from cookies.

3) **Add middleware gating**
   - Block unauthenticated access to protected routes.
   - Block role-mismatched access to role-scoped routes.

4) **Add role layout gates**
   - One layout per role area that re-checks role.

5) **Centralize policy**
   - Define roles, permissions, and role→permission map once.

6) **Update UI visibility**
   - Derive nav items from permissions (optional UX layer).

7) **API enforcement**
   - Guard every route handler / backend proxy call.

8) **Logout**
   - Clear cookies and (if using refresh tokens) invalidate server-side.

---

## Notes about current code (context)

At the moment:
- Portal selection uses `?portal=...` and redirects.
- Dashboard role routing uses placeholder logic.

Treat URL params as **UI state only**, not an authorization signal.

