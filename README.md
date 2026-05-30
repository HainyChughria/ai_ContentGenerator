# AI SaaS Platform

Phase 1 is a production-grade authentication foundation for a modular AI SaaS.
Phase 2 adds the protected dashboard shell, onboarding wizard, dashboard metrics, activity, and profile settings.
Phase 3 adds Groq-powered AI text generation, streaming responses, credits, history, and provider abstraction.
Phase 4 adds HuggingFace image generation, Cloudinary storage, and an image gallery.
Phase 5 adds forgot password, security hardening, deployment config, and a production checklist.

## Architecture

```text
apps/
  api/    Express + MongoDB + Mongoose + JWT + Resend
  web/    Next.js App Router + Zustand + Axios + Tailwind
packages/
  shared/ Shared TypeScript auth contracts
```

## Dashboard Routes

```text
/dashboard              Dashboard home
/dashboard/onboarding   Multi-step onboarding wizard
/dashboard/settings     Profile and password settings
/dashboard/generate     AI text generator
/dashboard/history      Generation history
/dashboard/images       AI image generation and gallery
```

## Production Docs

- `docs/phase-5-production-deployment.md`

## JWT Flow

```text
1. User registers
   Web -> POST /api/auth/register -> API hashes password -> DB stores user + OTP
                                      API sends OTP email using Resend

2. User verifies email
   Web -> POST /api/auth/verify-email -> API checks OTP + expiry
                                         API marks user isVerified=true

3. User logs in
   Web -> POST /api/auth/login -> API checks password with bcrypt
                                -> API signs JWT access token
                                -> Web stores token and sends it on API calls

4. Protected API request
   Web -> Authorization: Bearer <token>
       -> requireAuth middleware verifies JWT
       -> route controller receives req.user
```

## Auth Lifecycle

```text
register -> email OTP sent -> verify email -> login -> receive access token
         -> Zustand stores user state -> Axios attaches token
         -> protected backend routes use requireAuth
```

## Middleware Chain

```text
HTTP request
  -> express.json
  -> route
  -> validators
  -> validateRequest
  -> controller
  -> service
  -> model/database
  -> centralized error handler
```

For protected routes:

```text
HTTP request
  -> requireAuth
  -> verify JWT
  -> load user from MongoDB
  -> attach req.user
  -> controller
```

## Environment Setup

Copy the example files before running:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Fill real MongoDB Atlas, JWT, and Resend values in `apps/api/.env`.

## Development

```bash
npm install
npm run dev:api
npm run dev:web
```
