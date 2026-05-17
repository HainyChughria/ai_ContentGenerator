# Phase 1 Authentication

## Why This Structure

The backend uses controller/service/model separation because each layer has a clear job:

- Controllers translate HTTP requests and responses.
- Services contain business rules like hashing passwords, generating OTPs, and creating tokens.
- Models define how data is stored in MongoDB.
- Middleware handles reusable request logic like validation, auth checks, and errors.

The frontend keeps API calls, auth state, and pages separate:

- `lib/api.ts` owns the Axios instance.
- `lib/auth-api.ts` owns auth endpoints.
- `store/auth-store.ts` owns logged-in user state.
- App Router pages own form UI and client validation.

## Access Token Choice

This phase uses short-lived JWT access tokens. The backend signs a token with the MongoDB user id. The frontend stores that token and sends it in the `Authorization` header.

Later, add refresh tokens using secure HTTP-only cookies for longer sessions.

## OTP Choice

OTP verification prevents fake or mistyped emails from becoming active accounts. The OTP expires after 10 minutes, which keeps the flow simple while limiting risk.

## Scalability Notes

This structure can grow into:

- Role-based access control.
- Team/workspace membership.
- AI credit billing.
- Refresh token rotation.
- Rate limiting for login and OTP endpoints.
- Audit logs for security events.
