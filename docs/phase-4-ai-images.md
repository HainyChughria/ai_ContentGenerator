# Phase 4 AI Image Generation

## Media Pipeline

The image system uses a reusable media pipeline instead of route-level AI logic.

```text
request
  -> image route
  -> image controller
  -> image service
  -> image provider
  -> HuggingFace raw bytes
  -> Buffer
  -> Base64 data URI
  -> Cloudinary upload
  -> Mongo metadata
  -> response
```

## Binary Handling

HuggingFace text-to-image returns raw image bytes. Node reads the response as an `ArrayBuffer`, converts it to a `Buffer`, then encodes that buffer as base64:

```text
ArrayBuffer -> Buffer -> data:image/png;base64,...
```

The base64 data URI is only a transport format for Cloudinary upload. MongoDB stores the Cloudinary URL and metadata, not the binary image.

## Cloudinary Architecture

Cloudinary is the media storage and delivery layer.

- API server owns signed uploads using Cloudinary credentials.
- Cloudinary stores generated image files.
- MongoDB stores metadata like prompt, aspect ratio, public id, format, width, height, and bytes.
- Frontend renders optimized Cloudinary URLs from Mongo metadata.

This keeps the database small and lets Cloudinary handle CDN delivery.

## Retry And Fallback

The HuggingFace provider tries the primary model twice, then tries the fallback model. This isolates provider instability inside the provider implementation.

## Async Workflow

Image generation is async because it waits on several external systems:

```text
HuggingFace generation
  -> Cloudinary upload
  -> Mongo save
  -> credit deduction
  -> activity log
```

For Phase 4 this runs inside a request. At scale, move this to a background job queue and return a job id immediately.

## Scaling Strategy

Next steps for production scale:

- Queue image jobs with BullMQ or a managed queue.
- Store image generation status: queued, processing, complete, failed.
- Add webhook or polling endpoint.
- Use Cloudinary transformations for thumbnails.
- Add per-user and per-plan image rate limits.
