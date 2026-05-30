# Phase 5 Production Hardening And Deployment

## Production Security

Security exists to reduce blast radius when something goes wrong.

- Helmet adds HTTP security headers so browsers apply safer defaults.
- CORS restricts browser access to the deployed frontend URL.
- Rate limiting slows credential stuffing, reset-token abuse, and expensive AI calls.
- Reset tokens are random, one-time, hashed in MongoDB, and expire after 15 minutes.
- Validation rejects malformed input before it reaches business logic.
- Secrets stay in platform environment variables, never in git.

## Deployment Pipeline

Recommended split:

```text
Frontend: Vercel -> apps/web
Backend: Render or Railway -> apps/api
Database: MongoDB Atlas
Media: Cloudinary
Email: Resend
AI: Groq + HuggingFace
```

Deploy backend first so you have an API URL. Then set `NEXT_PUBLIC_API_URL` in Vercel to the backend API base URL.

## Environment Management

Backend production variables:

```text
NODE_ENV=production
MONGODB_URI
CLIENT_URL=https://your-vercel-app.vercel.app
API_URL=https://your-api.onrender.com
JWT_ACCESS_SECRET
GROQ_API_KEY
HF_TOKEN
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
RESEND_API_KEY
RESEND_FROM_EMAIL
```

Frontend production variable:

```text
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
```

Vercel stores variables per Production, Preview, and Development environment. Render and Railway inject variables into the runtime service environment.

## Render Backend

Use `render.yaml` or configure manually:

```text
Build Command: npm install && npm run build -w apps/api
Start Command: npm run start -w apps/api
Root Directory: repository root
```

## Railway Backend

Create a Node service from the repo and set:

```text
Build Command: npm install && npm run build -w apps/api
Start Command: npm run start -w apps/api
```

Paste backend variables into the service Variables tab.

## Vercel Frontend

For the monorepo frontend:

```text
Root Directory: apps/web
Build Command: npm run build
Install Command: npm install
```

Set `NEXT_PUBLIC_API_URL` in Project Settings -> Environment Variables.

## Monitoring And Logging

Current logging is structured JSON-like terminal output. In production, send these logs to the platform log stream first. Later, add Sentry or another error monitor for stack traces, request ids, and alerting.

## Production Checklist

- MongoDB Atlas network access configured.
- Strong `JWT_ACCESS_SECRET` generated.
- Resend domain verified.
- Cloudinary credentials verified.
- HuggingFace token has Inference Providers permission.
- Groq key configured.
- Backend `CLIENT_URL` equals deployed frontend origin.
- Frontend `NEXT_PUBLIC_API_URL` points to deployed backend `/api`.
- Test register, verify email, login, forgot password, AI text, and AI image flows.
- Confirm rate-limit errors are friendly.
- Confirm mobile dashboard navigation works.
- Confirm no `.env` files are committed.

## SaaS Scaling Strategy

The next scaling step is job queues. Text streaming can stay request-based, but image generation should eventually move to a queue because it is slower and depends on multiple external services.

Suggested future architecture:

```text
API request -> create generation job -> queue worker -> provider -> storage -> notify UI
```

This protects the API from long-running requests and makes retries safer.
