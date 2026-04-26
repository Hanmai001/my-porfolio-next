## Overview

This document defines the comprehensive authentication architecture for the Qlay Research Notebook frontend. It provides opinionated, production-ready solutions for authentication flows including email verification, password reset, and automatic token refresh.

**Key Features:**

- Dual-token strategy with automatic refresh (15-min access, 7-day refresh)
- Complete auth flows (register→verify→auto-login, forgot→reset→auto-login)
- Security-first design (XSS, CSRF, token rotation protection)
- Next.js 16 App Router patterns with Server Actions
- Excellent UX (seamless navigation, clear error messages)

---

## Backend API Contracts

### Base URL

All auth endpoints are under: `{BACKEND_URL}/api/v1/auth`

### 1. Register

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**

```json
{
  "fullName": "Jane Smith",
  "email": "jane@company.com",
  "workspaceName": "Acme Corp",
  "industry": "Technology",
  "password": "MyPassword123!"
}
```

**Response (200):**

```json
{
  "message": "Check your email to verify your account"
}
```

**Notes:**

- Re-registration with same email is allowed if account is PENDING (overwrites previous data)
- Always returns generic message to prevent user enumeration
- Sends verification email automatically

### 2. Verify Email

**Endpoint:** `POST /api/v1/auth/verify`

**Request Body:**

```json
{
  "token": "a3f9b2c1d4e5..."
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**

- Token is single-use and expires after 24 hours
- On success, tenant is activated and JWT tokens returned (no separate login needed)
- Auto-login functionality built-in

### 3. Login

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**

```json
{
  "email": "jane@company.com",
  "password": "MyPassword123!"
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**

- Returns same error for wrong email and wrong password (prevents user enumeration)

### 4. Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**

- If password reset was performed, all previous refresh tokens are invalidated
- Returns new token pair (token rotation)

### 5. Forgot Password

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Request Body:**

```json
{
  "email": "jane@company.com"
}
```

**Response (200):**

```json
{
  "message": "If an account exists, you will receive a password reset email"
}
```

**Notes:**

- Reset token expires after 1 hour
- Only one active reset token per user (requesting again invalidates previous)
- Always returns generic message (prevents user enumeration)

### 6. Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password`

**Request Body:**

```json
{
  "token": "a3f9b2c1d4e5...",
  "password": "NewPassword456!"
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Notes:**

- Token is single-use and expires after 1 hour
- Logs user in immediately (returns new token pair)
- All previous refresh tokens are invalidated
- Auto-login functionality built-in

---

## Architecture Decisions

### 1. Token Storage Strategy: Dual HttpOnly Cookies

**Decision:** Store both access and refresh tokens in separate HttpOnly cookies.

**Implementation:**

- **Access Token Cookie** (`qlay-session`): 15-minute expiry, used for all API requests
- **Refresh Token Cookie** (`qlay-refresh`): 7-day expiry, restricted to `/api/auth/refresh` path
- Both: HttpOnly, Secure (production), SameSite=Lax

**Rationale:**

- **XSS Protection**: Tokens inaccessible to JavaScript, preventing theft via XSS attacks
- **Automatic Transmission**: Browser sends cookies automatically (no manual header management)
- **CSRF Protection**: SameSite=Lax prevents cross-site token theft
- **Path Restriction**: Refresh token only sent to refresh endpoint (minimizes exposure)
- **Next.js Native**: Works seamlessly with Server Components and Server Actions

**Cookie Configuration:**

```typescript
{
  accessToken: {
    name: "qlay-session",
    maxAge: 15 * 60, // 15 minutes
    httpOnly: true,
    secure: production,
    sameSite: "lax",
    path: "/"
  },
  refreshToken: {
    name: "qlay-refresh",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    httpOnly: true,
    secure: production,
    sameSite: "lax",
    path: "/api/auth/refresh" // Restricted path for security
  }
}
```

### 2. Session Management: Stateless JWT + Backend Validation

**Architecture:**

- Frontend stores JWTs in HttpOnly cookies (stateless from frontend perspective)
- Backend validates JWT signature and expiry on every request
- Backend maintains refresh token whitelist for revocation capability
- Frontend never decodes or validates tokens (security by delegation)

**Token Lifecycle:**

1. Access token: 15-minute expiry, used for all API calls
2. Refresh token: 7-day expiry, used only to obtain new access tokens
3. Token rotation: Each refresh generates new access + refresh tokens (old refresh invalidated)

### 3. Token Refresh Strategy: Hybrid (Proactive + Reactive)

**Multi-Layer Approach:**

**Layer 1: Enhanced Fetcher (Reactive Refresh)**

- Primary refresh logic in [src/shared/lib/fetcher.ts](../src/shared/lib/fetcher.ts)
- Catches 401 responses, attempts refresh, retries original request
- Handles concurrent requests with mutex lock pattern

**Layer 2: Proxy/Middleware (Proactive Refresh)**

- [src/proxy.ts](../src/proxy.ts) checks access token expiry from cookie
- If token expires within 2 minutes, triggers background refresh
- Prevents 401 errors during navigation

**Layer 3: SWR Global Handler (Fallback)**

- Global 401 handler redirects to login if refresh fails
- Clears auth state and cookies

**Mutex Lock Pattern for Concurrent Requests:**

```typescript
// Single refresh promise shared across concurrent 401s
let refreshPromise: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  if (refreshPromise) return refreshPromise; // Wait for ongoing refresh

  refreshPromise = performRefresh();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}
```

**Benefits:**

- **Proactive**: Reduces user-facing 401 errors, seamless navigation
- **Reactive**: Handles missed proactive refreshes, works for background SWR calls
- **No duplicate refreshes**: Mutex ensures single refresh for concurrent requests
- **Automatic cookie updates**: Backend Set-Cookie headers update cookies automatically

---

## Authentication Flows

### Flow 1: Register → Verify Email → Auto Login

**Step-by-Step:**

**Phase 1: Registration (Server Action)**

```
User submits form
  ↓
RegisterForm → registerAction (Server Action)
  ↓
Zod validation (fullName, email, password, workspaceName, industry)
  ↓
POST to backend /api/v1/auth/register
  ↓
Backend: Creates user (PENDING status), sends verification email
  ↓
Response: { message: "Check your email to verify your account" }
  ↓
Redirect to /verify-email?email={email}
```

**Phase 2: Verification Prompt (Server Component)**

```
/verify-email page
  ↓
Shows "Check your email" message with email address
  ↓
Displays ResendButton (Client Component island)
  ↓
User clicks link in email: /verify-email/confirm?token={token}
```

**Phase 3: Token Verification (Server Component with SSR Validation)**

```
/verify-email/confirm page (Server Component)
  ↓
Extracts token from searchParams
  ↓
Server-side: POST to backend /api/v1/auth/verify with { token }
  ↓
Backend validates token, activates tenant
  ↓
Backend returns { accessToken, refreshToken }
  ↓
Set both cookies: setSessionCookie(), setRefreshCookie()
  ↓
redirect(APP_ROUTES.app.dashboard)
  ↓
User is now logged in (auto-login complete)
```

**Error Handling:**

- **Expired Token**: Show error with resend button
- **Already Verified**: Redirect to login with success message
- **Invalid Token**: Show error with support link
- **Network Error**: Retry mechanism with backoff

**Edge Cases:**

- User already logged in → Redirect to dashboard
- Token used twice → Backend returns error, show "already verified"
- Email change during verification → Old token becomes invalid
- Multiple verification requests → Only latest token valid (re-registration overwrites if PENDING)

**Security:**

- Token is single-use (invalidated after verification)
- Token expires after 24 hours
- Rate limiting on resend (1 per minute per email)
- No user enumeration (generic success message)

### Flow 2: Login

**Step-by-Step:**

```
User submits login form
  ↓
LoginForm (Client Component) → loginAction (Server Action)
  ↓
Zod validation (email, password)
  ↓
POST to backend /api/v1/auth/login
  ↓
Backend validates credentials
  ↓
Backend returns { accessToken, refreshToken }
  ↓
Set both cookies: setSessionCookie(), setRefreshCookie()
  ↓
redirect(APP_ROUTES.app.dashboard)
```

**Error Handling:**

- **401 Unauthorized**: "Invalid email or password" (no enumeration)
- **403 Forbidden (unverified)**: "Please verify your email. [Resend]"
- **429 Rate Limited**: "Too many attempts. Try again in X minutes."
- **500+ Server Error**: "Service temporarily unavailable."

**Edge Cases:**

- Already logged in → Redirect to dashboard
- Account disabled → "Account suspended. Contact support."

### Flow 3: Token Refresh

**Trigger: 401 Response from API**

```
API call returns 401
  ↓
fetcher.ts catches 401 (not auth endpoint)
  ↓
Calls refreshTokens() with mutex lock
  ↓
POST to /api/auth/refresh with { refreshToken } in body
  ↓
Backend validates refresh token
  ↓
Backend returns { accessToken, refreshToken }
  ↓
Backend Set-Cookie headers update cookies automatically
  ↓
Original request retried with new access token
  ↓
Success - user experiences seamless refresh
```

**Implementation Detail:**

```typescript
// src/app/api/auth/refresh/route.ts
export async function POST(request: NextRequest) {
  // Read refresh token from cookie
  const refreshToken = request.cookies.get("qlay-refresh")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  try {
    // Call backend with refresh token in body
    const response = await serverFetch<{
      accessToken: string;
      refreshToken: string;
    }>(buildBackendUrl(BACKEND_ROUTES.auth.refresh), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    // Backend returns tokens directly (no wrapper)
    // Set new cookies
    await setSessionCookie(response.accessToken);
    await setRefreshCookie(response.refreshToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    // Clear invalid cookies
    await clearSessionCookie();
    await clearRefreshCookie();
    return NextResponse.json(
      { message: "Invalid refresh token" },
      { status: 401 }
    );
  }
}
```

**Error Handling:**

- **Refresh token expired**: Clear cookies, redirect to login
- **Refresh token revoked**: Clear cookies, show "Session invalidated"
- **Network error**: Retry once, then fail to login
- **Concurrent refreshes**: Mutex ensures single refresh

**Edge Cases:**

- Refresh token stolen → Token rotation detects breach, invalidates all tokens
- User logged out elsewhere → Backend returns 401, frontend clears state
- Refresh happens during form submission → Submission retried automatically
- Password reset performed → All previous refresh tokens invalidated

### Flow 4: Forgot Password → Reset Password → Auto Login

**Step-by-Step:**

**Phase 1: Forgot Password Request (Server Action)**

```
User submits email
  ↓
ForgotPasswordForm → forgotPasswordAction (Server Action)
  ↓
Zod validation (email)
  ↓
POST to backend /api/v1/auth/forgot-password
  ↓
Backend: Generates reset token, sends email (or does nothing if email doesn't exist)
  ↓
Response: { message: "If an account exists, you will receive a password reset email" }
  ↓
Show success message (no enumeration)
```

**Phase 2: Reset Password Page (Server Component + Client Form)**

```
User clicks link: /reset-password?token={token}
  ↓
Server Component extracts token from searchParams
  ↓
Passes token to ResetPasswordForm (Client Component)
  ↓
User enters new password
  ↓
Form submits → resetPasswordAction (Server Action)
```

**Phase 3: Password Reset Submission (Server Action with Auto-Login)**

```
resetPasswordAction receives { token, password }
  ↓
Zod validation (password rules)
  ↓
POST to backend /api/v1/auth/reset-password with { token, password }
  ↓
Backend validates token, updates password
  ↓
Backend invalidates all previous refresh tokens
  ↓
Backend returns { accessToken, refreshToken }
  ↓
Set both cookies: setSessionCookie(), setRefreshCookie()
  ↓
redirect(APP_ROUTES.app.dashboard + "?reset=success")
  ↓
User is now logged in (auto-login complete)
```

**Error Handling:**

- **Invalid/Expired Token**: "Reset link expired. Request a new one."
- **Token Already Used**: "Link already used. Request a new reset."
- **Password Validation Failed**: Show specific field errors
- **Network Error**: "Unable to reset password. Try again."

**Edge Cases:**

- User already logged in → Show "Already logged in. Go to settings to change password."
- Multiple reset requests → Only latest token valid (requesting again invalidates previous)
- Account doesn't exist → Generic success message (no enumeration)
- Password same as old → Backend enforces different password
- Reset during active session → Invalidates all previous refresh tokens

**Security:**

- Reset token is single-use
- Token expires after 1 hour
- Rate limiting on forgot password (3 per hour per email)
- No user enumeration (always show success message)
- Password reset invalidates all refresh tokens (force re-login everywhere)

---

## Rendering Strategy

### Page-by-Page Decisions

**1. /signup - Server Component Page + Client Form**

- **Page**: Server Component (SEO-friendly, fast initial load)
- **Form**: Client Component (React Hook Form, interactive validation)
- **Submission**: Server Action (signupAction → backend → set cookies → redirect)

**2. /login - Server Component Page + Client Form**

- **Same pattern as signup** (already implemented correctly)

**3. /verify-email - Server Component**

- **Static content**: "Check your email" message with email from query param
- **Interactive island**: ResendButton (Client Component)
- **No sensitive operations**: Just displays instructions

**4. /verify-email/confirm - Server Component with SSR Validation**

- **Token validation**: Server-side before rendering (security-first)
- **Happy path**: Immediate redirect after setting cookies (no client JS needed)
- **Error path**: Renders error UI with resend option (Client Component)
- **Security**: Token never exposed to client JavaScript

**5. /forgot-password - Server Component Page + Client Form**

- **Page**: Server Component
- **Form**: Client Component (email input with validation)
- **Submission**: Server Action (forgotPasswordAction → backend → return state)

**6. /reset-password - Server Component + Client Form**

- **Page**: Server Component extracts token from query params
- **Token validation**: Happens on form submission (not page load) for better UX
- **Form**: Client Component (password input with show/hide toggle)
- **Submission**: Server Action (resetPasswordAction → backend → auto-login → redirect)

**Pattern:**

```
Server Component (page.tsx)
  ↓
Client Component (Form)
  ↓
Server Action (backend call)
  ↓
Redirect or return state
```

**Benefits:**

- Minimal JavaScript sent to client
- SEO-friendly pages
- Fast initial page loads
- Server Actions handle sensitive operations
- Security by default (tokens processed server-side)

---

## Middleware & Route Protection

### Enhanced Route Protection Strategy

**Existing [src/proxy.ts](../src/proxy.ts) Enhancements:**

1. **Silent Refresh on Expired Access Token**
   - Checks refresh token before redirecting to login
   - Attempts refresh if refresh token valid
   - Sets new cookies and continues to requested page

2. **Proactive Background Refresh**
   - Checks access token expiry (if < 2 minutes remaining)
   - Triggers non-blocking background refresh
   - User navigation not delayed

3. **Fallback to Login**
   - Only redirects if both tokens invalid
   - Preserves intended destination with `?next=` param

**Flow Example:**

```
User navigates to /reports
  ↓
Proxy checks access token → expired
  ↓
Proxy checks refresh token → valid
  ↓
Proxy calls refresh endpoint (server-side)
  ↓
New cookies set
  ↓
Request continues to /reports
  ↓
User sees page (seamless, no visible delay)
```

**Handling Token Expiry During Page Load:**

- Access token expires while page loading (rare)
- SWR revalidation or API call triggers 401
- Fetcher catches 401, attempts reactive refresh
- If refresh succeeds, request retried automatically
- If refresh fails, SWR onError redirects to login

---

## Data Flow & State Management

### Auth State Storage

**Client-Side State (Zustand):**

- Stores only safe user data (id, email, name, role, workspace)
- Never stores tokens (security by design)
- Persisted to localStorage for UI state
- Used for role-based navigation and UI rendering

**Server-Side State (Cookies):**

- Access token: `qlay-session` (HttpOnly, 15 minutes)
- Refresh token: `qlay-refresh` (HttpOnly, 7 days)
- JavaScript cannot access (XSS protection)
- Automatically sent with requests

### State Synchronization

**Server Components:**

- Call `getSession()` to read cookies and validate with backend
- Returns fresh user data (cached 1 minute)
- Used in layouts, protected pages

**Client Components:**

- Use `useAuth()` hook to access Zustand store
- Gets user data populated from initial server load
- Updates when Server Actions return new user data

**Initial Load (Hydration):**

```
Server renders page
  ↓
Calls getSession() → reads cookie → validates with backend
  ↓
Passes user data to Client Components via props or context
  ↓
Client hydrates with user data
  ↓
Zustand store populated from server data
```

**Subsequent Updates:**

```
User logs in (Server Action)
  ↓
Server Action sets cookies
  ↓
Server Action updates Zustand via revalidation
  ↓
Client sees updated user state
```

---

## Fetcher Usage Patterns

### Backend Response Format

**Important:** Backend returns data directly without `ApiResponse` wrapper.

```typescript
// ✅ Backend returns direct response
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { "id": "123", "email": "user@example.com" }
}

// ❌ NOT wrapped in ApiResponse
{
  "statusCode": 200,
  "data": { "accessToken": "...", "refreshToken": "..." } // Backend doesn't do this
}
```

### Server Actions (Server-Side)

**Use `serverFetch<T>()` for all backend API calls:**

```typescript
// src/features/auth/actions/login.ts
"use server";

import { serverFetch } from "@/shared/lib/fetcher";
import type { AuthResponse } from "@/shared/types/auth";

export async function loginAction(formData: FormData) {
  try {
    // Backend returns { accessToken, refreshToken, user } directly
    const response = await serverFetch<AuthResponse>(
      buildBackendUrl(BACKEND_ROUTES.auth.login),
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    // ✅ Access fields directly (no .data wrapper)
    await setSessionCookie(response.accessToken);
    await setRefreshCookie(response.refreshToken);

    redirect(APP_ROUTES.app.dashboard);
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}
```

**Key Points:**

- Use `serverFetch<T>()` for Server Actions ("use server")
- Backend returns data directly - access via `response.accessToken` not `response.data.accessToken`
- Type parameter `T` should match backend response shape exactly
- Throws `FetchError` on errors - catch and return error state

### Client Components (Client-Side)

**Use `fetcher<T>()` with SWR for GET requests:**

```typescript
"use client";

import useSWR from "swr";
import { fetcher } from "@/shared/lib/fetcher";
import type { User } from "@/shared/types/auth";

function ProfileComponent() {
  // Backend returns User object directly
  const { data, error, isLoading } = useSWR<User>(
    "/api/auth/me",
    fetcher
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;

  // ✅ Access user data directly (no .data wrapper)
  return <div>Welcome, {data?.email}</div>;
}
```

**Use `fetchList<T>()` for paginated lists:**

```typescript
import useSWR from "swr";
import { fetchList } from "@/shared/lib/fetcher";
import type { ApiListResponse } from "@/shared/types/api";

function QueriesList() {
  const { data, error } = useSWR<ApiListResponse<Query>>(
    "/api/queries?page=1&limit=10",
    fetchList
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      {data.data.map(query => <div key={query.id}>{query.name}</div>)}
      <div>Page {data.page} of {data.totalPages} ({data.total} total)</div>
    </div>
  );
}
```

**Key Points:**

- Use `fetcher<T>()` with SWR for reactive data fetching
- Use `fetchList<T>()` for lists with pagination (returns `ApiListResponse<T>`)
- Backend returns data directly - no unwrapping needed
- SWR handles caching, revalidation, and error handling automatically

### Summary Table

| Context        | Function               | When to Use                        | Returns                                         |
| -------------- | ---------------------- | ---------------------------------- | ----------------------------------------------- |
| Server Actions | `serverFetch<T>()`     | POST/PUT/DELETE mutations          | Direct backend response                         |
| Client GET     | `fetcher<T>()` + SWR   | Single resource, real-time updates | Direct backend response                         |
| Client Lists   | `fetchList<T>()` + SWR | Paginated lists                    | `{ data: T[], total, page, limit, totalPages }` |

**Migration Notes:**

- Old `apiFetch<T>()` and `fetchData<T>()` helpers removed (expected ApiResponse wrapper)
- All auth endpoints now access response fields directly
- No more `response.data.accessToken` - use `response.accessToken`

---

## Component Architecture

### Folder Structure

```
src/features/auth/
  actions/
    login.ts                    # Existing
    signup.ts                   # Existing
    logout.ts                   # Existing
    register.ts                 # NEW: Registration (calls /api/v1/auth/register)
    verify-email.ts             # NEW: Verify email (calls /api/v1/auth/verify)
    resend-verification.ts      # NEW: Resend verification email
    forgot-password.ts          # NEW: Request password reset (calls /api/v1/auth/forgot-password)
    reset-password.ts           # NEW: Reset password (calls /api/v1/auth/reset-password)

  components/
    LoginForm.tsx               # Existing
    SignupForm.tsx              # Existing (or rename to RegisterForm)
    RouteGuard.tsx              # Existing
    VerifyEmailPrompt.tsx       # NEW: "Check your email" UI
    ResendButton.tsx            # NEW: Resend verification button
    ResetPasswordForm.tsx       # NEW: Password reset form
    ForgotPasswordForm.tsx      # NEW: Request reset form
    VerificationSuccess.tsx     # NEW: Email verified success state
    VerificationError.tsx       # NEW: Token expired/invalid error
    AuthFormCard.tsx            # NEW: Reusable form card wrapper
    AuthError.tsx               # NEW: Reusable error display
    AuthSubmitButton.tsx        # NEW: Reusable submit button with loading

  schemas/
    auth.ts                     # EXTEND: Add verifyEmailSchema, resetPasswordSchema, forgotPasswordSchema

  hooks/
    useAuth.ts                  # Existing
    useTokenRefresh.ts          # NEW: Hook for manual refresh trigger

src/shared/lib/
  session.ts                    # EXTEND: Add setRefreshCookie(), clearRefreshCookie(), decodeJWT()
  token-refresh.ts              # NEW: Refresh token logic (refreshTokens, mutex lock, background refresh)
  fetcher.ts                    # MODIFY: Add reactive refresh logic on 401

src/shared/config/
  api.ts                        # MODIFY: Update BACKEND_ROUTES with /api/v1/auth/* paths

src/app/(auth)/
  login/page.tsx                # Existing
  signup/page.tsx               # Existing
  verify-email/
    page.tsx                    # NEW: "Check email" prompt
    confirm/page.tsx            # NEW: Token verification (calls /api/v1/auth/verify)
  forgot-password/page.tsx      # NEW: Request reset
  reset-password/page.tsx       # NEW: Reset password form

src/app/api/auth/
  login/route.ts                # Existing
  signup/route.ts               # Existing
  register/route.ts             # NEW: Proxy to /api/v1/auth/register
  verify-email/route.ts         # NEW: Proxy to /api/v1/auth/verify
  resend-verification/route.ts  # NEW: Resend verification (calls register again)
  forgot-password/route.ts      # NEW: Proxy to /api/v1/auth/forgot-password
  reset-password/route.ts       # NEW: Proxy to /api/v1/auth/reset-password
  refresh/route.ts              # NEW: Token refresh endpoint (calls /api/v1/auth/refresh) (CRITICAL)
  logout/route.ts               # Existing
  me/route.ts                   # Existing
```

### Reusable Components

**Shared Auth Components:**

- `AuthFormCard`: Consistent card wrapper (title, description, content, footer)
- `AuthError`: Consistent error display with styling
- `AuthSubmitButton`: Submit button with loading state

**Server vs Client Boundaries:**

- **Server Components**: All page.tsx files, static wrappers, token validation pages
- **Client Components**: Forms, interactive buttons, components with hooks/event handlers

---

## Security Best Practices

### 1. XSS Prevention

- **HttpOnly Cookies**: Tokens inaccessible to JavaScript
- **Content Security Policy**: Restrict script sources
- **Input Sanitization**: All form inputs validated server-side with Zod
- **React Auto-Escaping**: Template strings automatically escaped
- **No innerHTML**: Never use dangerouslySetInnerHTML with user content

### 2. CSRF Prevention

- **SameSite=Lax**: Cookies not sent on cross-site POST requests
- **Server Actions**: Built-in CSRF protection (Next.js 13+)
- **Origin Validation**: Check Origin/Referer headers on sensitive endpoints
- **State-Changing Operations**: Only via POST/PUT/DELETE (never GET)

### 3. Token Rotation

- **Automatic on Refresh**: Each refresh generates new access + refresh tokens
- **Old Token Invalidated**: Prevents token replay attacks
- **Breach Detection**: Backend maintains token families (password reset invalidates all)
- **Suspicious Activity**: If old refresh token used after rotation → invalidate entire family

### 4. Secure Cookie Configuration

- **httpOnly: true**: No JavaScript access
- **secure: true**: HTTPS only (production)
- **sameSite: "lax"**: CSRF protection
- **Path restriction**: Refresh token only sent to `/api/auth/refresh`

### 5. Error Message Safety (No User Enumeration)

- **Generic login errors**: "Invalid email or password" (not "Email not found")
- **Generic forgot password**: "If account exists, reset link sent" (always success)
- **Consistent response times**: Always hash password, even if user doesn't exist

### 6. Rate Limiting UX

- **Frontend countdown**: Display seconds until retry allowed
- **Disabled submit**: Button disabled during cooldown
- **Clear messaging**: Explain why action is blocked
- **Parse Retry-After**: Use backend's Retry-After header for accurate countdown

---

## Implementation Priority

### Phase 1: Token Refresh Infrastructure (Foundational)

**Goal:** Enable automatic token refresh throughout the app

**Files to Create:**

1. [src/shared/lib/token-refresh.ts](../src/shared/lib/token-refresh.ts) - Mutex lock pattern, refresh logic
2. [src/app/api/auth/refresh/route.ts](../src/app/api/auth/refresh/route.ts) - Token refresh endpoint

**Files to Modify:**

1. [src/shared/lib/session.ts](../src/shared/lib/session.ts) - Add setRefreshCookie(), clearRefreshCookie(), decodeJWT()
2. [src/shared/lib/fetcher.ts](../src/shared/lib/fetcher.ts) - Add reactive refresh on 401
3. [src/proxy.ts](../src/proxy.ts) - Add proactive refresh, silent refresh
4. [src/shared/config/constants.ts](../src/shared/config/constants.ts) - Add REFRESH_COOKIE constant
5. [src/shared/config/api.ts](../src/shared/config/api.ts) - Update BACKEND_ROUTES with `/api/v1/auth/*` paths

**Why First:** All other flows depend on token refresh for auto-login functionality.

### Phase 2: Email Verification Flow

**Goal:** Complete registration → verify → auto-login flow

**Files to Create:**

1. [src/features/auth/actions/register.ts](../src/features/auth/actions/register.ts)
2. [src/features/auth/actions/verify-email.ts](../src/features/auth/actions/verify-email.ts)
3. [src/features/auth/actions/resend-verification.ts](../src/features/auth/actions/resend-verification.ts)
4. [src/app/(auth)/verify-email/page.tsx](<../src/app/(auth)/verify-email/page.tsx>)
5. [src/app/(auth)/verify-email/confirm/page.tsx](<../src/app/(auth)/verify-email/confirm/page.tsx>)
6. Components: VerifyEmailPrompt, ResendButton, VerificationSuccess/Error

**Files to Modify:**

1. [src/features/auth/schemas/auth.ts](../src/features/auth/schemas/auth.ts) - Add verifyEmailSchema

**Dependencies:** Phase 1 (needs token refresh)

### Phase 3: Password Reset Flow

**Goal:** Complete forgot → reset → auto-login flow

**Files to Create:**

1. [src/features/auth/actions/forgot-password.ts](../src/features/auth/actions/forgot-password.ts)
2. [src/features/auth/actions/reset-password.ts](../src/features/auth/actions/reset-password.ts)
3. [src/app/(auth)/forgot-password/page.tsx](<../src/app/(auth)/forgot-password/page.tsx>)
4. [src/app/(auth)/reset-password/page.tsx](<../src/app/(auth)/reset-password/page.tsx>)
5. Components: ForgotPasswordForm, ResetPasswordForm

**Files to Modify:**

1. [src/features/auth/schemas/auth.ts](../src/features/auth/schemas/auth.ts) - Add resetPasswordSchema, forgotPasswordSchema

**Dependencies:** Phase 1 (needs token refresh)

### Phase 4: Refactoring & Optimization

**Goal:** Polish, shared components, improved UX

**Tasks:**

1. Create shared auth components (AuthFormCard, AuthError, AuthSubmitButton)
2. Refactor existing forms to use shared components
3. Add rate limiting UI feedback
4. Add loading skeletons for async auth pages

**Dependencies:** Phases 1-3 (all core flows implemented)

---

## Trade-offs & Considerations

### Short-Lived Access Token (15 minutes)

**✓ Pros:**

- Reduced damage if access token stolen
- Encourages regular refresh (more opportunities for breach detection)

**✗ Cons:**

- More frequent refresh operations
- Slightly increased server load

**Decision:** Security benefit outweighs minimal performance impact.

### Refresh Token Path Restriction

**✓ Pros:**

- Minimizes refresh token exposure (only sent to one endpoint)
- Reduces attack surface

**✗ Cons:**

- Slightly more complex cookie management
- Can't use refresh token for other endpoints (by design)

**Decision:** Security best practice, worth the complexity.

### Server-Side Token Validation (Email/Reset)

**✓ Pros:**

- Token never exposed to client JavaScript
- Immediate redirect on success (no client roundtrip)
- Better security (validation happens server-side)

**✗ Cons:**

- Slightly longer page load (server validation before render)

**Decision:** Security and UX benefits outweigh slight performance cost.

### Proactive + Reactive Refresh (Hybrid)

**✓ Pros:**

- Best of both worlds (seamless UX + robust fallback)
- Handles both navigation and background requests

**✗ Cons:**

- More complex implementation
- Two refresh codepaths to maintain

**Decision:** Complexity justified by excellent UX and reliability.

### Refresh Token in Request Body (Not Cookie)

**✓ Pros:**

- Backend API design choice (consistent with other endpoints)
- Refresh token already in cookie, easy to read server-side

**✗ Cons:**

- Must read from cookie and send in body (extra step)
- Cannot leverage automatic cookie transmission for this specific call

**Decision:** Follow backend API contract. Frontend reads refresh token from cookie and sends in request body.

---

## Verification Strategy

### Testing the Implementation

**Phase 1 Testing (Token Refresh):**

1. **Manual expiry test**: Set access token max-age to 30 seconds, verify auto-refresh
2. **Concurrent requests**: Make multiple API calls simultaneously after expiry, verify single refresh
3. **Navigation test**: Navigate between pages with expired token, verify seamless refresh
4. **Refresh token expiry**: Let refresh token expire, verify redirect to login

**Phase 2 Testing (Email Verification):**

1. **Registration flow**: Register → receive email → click link → verify auto-login
2. **Expired token**: Wait 24 hours (or set shorter expiry), verify error + resend option
3. **Invalid token**: Use random token, verify error message
4. **Double verification**: Click link twice, verify "already verified" message
5. **Re-registration**: Register with same email while PENDING, verify overwrites previous

**Phase 3 Testing (Password Reset):**

1. **Reset flow**: Request reset → receive email → click link → set new password → verify auto-login
2. **Expired token**: Wait 1 hour (or set shorter expiry), verify error + request new link
3. **Invalid token**: Use random token, verify error message
4. **Session invalidation**: Reset password → verify all other sessions logged out
5. **Multiple requests**: Request reset twice, verify only latest token valid

**Security Testing:**

1. **XSS**: Attempt to access tokens via JavaScript, verify failure
2. **CSRF**: Make cross-site request with cookies, verify SameSite protection
3. **Token theft**: Use stolen refresh token after rotation, verify detection
4. **User enumeration**: Try login with non-existent email, verify generic error

**End-to-End Testing:**

1. Complete registration → verification → dashboard flow
2. Login → use app → wait for token expiry → verify seamless refresh
3. Logout → login → forgot password → reset → verify new password works
4. Test on multiple browsers/devices simultaneously

---

## Summary

This architecture provides a production-ready, secure, and user-friendly authentication system with:

- **Security-First Design**: HttpOnly cookies, token rotation, no user enumeration
- **Excellent UX**: Seamless token refresh, clear error messages, fast page loads
- **Modern Stack**: Next.js 16 App Router, Server Actions, React 19
- **Comprehensive Flows**: Registration, verification, login, password reset, all with auto-login
- **Backend Integration**: Accurate API contracts for `/api/v1/auth/*` endpoints
- **Maintainable Code**: Clear separation of concerns, reusable components, opinionated patterns

The implementation is designed to scale with the application while maintaining security and performance best practices.
