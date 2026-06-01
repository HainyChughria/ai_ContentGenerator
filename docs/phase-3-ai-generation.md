# Phase 3 AI Text Generation

## Streaming Architecture

The generator uses Server-Sent Events over a normal authenticated POST request.

```text
Browser sandbox submit
  -> fetch POST /api/content/generate
  -> Express validates request and opens text/event-stream
  -> content service checks credits and completed onboarding
  -> content service builds prompt from saved brand context
  -> provider streams chunks from Groq
  -> Express writes each chunk as an SSE event
  -> browser reads the stream with ReadableStream
  -> UI appends text as it arrives
  -> backend saves final content and deducts credits
```

Streaming is split into two responsibilities:

- The provider yields raw model chunks.
- The service accumulates the final result, handles credits, and stores history.

This keeps billing and persistence outside the route layer.

## Provider Abstraction

The backend uses an `AiTextProvider` interface:

```text
content.service.ts
  -> createTextProvider()
  -> GroqTextProvider
```

Only `GroqTextProvider` knows about `groq-sdk`. Future providers can implement the same `streamText` method for OpenAI, Claude, or HuggingFace without changing controllers or frontend code.

## Context Engineering

Prompt templates live in `apps/api/src/ai/prompts`. The template separates:

- system instruction: stable behavior, safety, quality rules, content format
- saved onboarding context: business, niche, audience, offer, brand voice, website, social handles, and goals
- user request: the short asset the user wants generated
- dynamic options: content type and tone

This is more maintainable than building prompts inside route handlers.

## Token Handling

Groq streams content chunks, but token usage metadata is not always available chunk-by-chunk in a simple stream. This phase uses a conservative word-based estimate after generation finishes:

```text
estimated tokens = words * 1.35
```

Later, replace this with provider-reported usage when available or add a tokenizer package for stricter accounting.

## Credit Flow

```text
check credits and onboarding before generation
  -> stream content
  -> save Content document
  -> deduct one credit
  -> create generation Activity
  -> send final done event with saved content
```

Credits are deducted after a successful stream so failed provider calls do not charge the user.

## Async Flow

The provider returns an async iterable. The service uses `for await...of` to consume chunks without blocking the event loop. Express writes each chunk immediately, while the frontend reads chunks through `response.body.getReader()`.
