"use client";

import { Download, ImageIcon, Sparkles } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";
import { FormError } from "@/components/ui/form-error";
import { useAuthStore } from "@/store/auth-store";
import { useImageStore } from "@/store/image-store";
import { AspectRatio } from "@/types/image";

const aspectRatios: { value: AspectRatio; label: string; frame: string }[] = [
  { value: "1:1", label: "Square", frame: "aspect-square" },
  { value: "16:9", label: "Wide", frame: "aspect-video" },
  { value: "9:16", label: "Story", frame: "aspect-[9/16]" },
  { value: "4:5", label: "Portrait", frame: "aspect-[4/5]" }
];

const imageSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters").max(2000),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:5"])
});

export default function ImagesPage() {
  const { user } = useAuthStore();
  const {
    images,
    isLoading,
    isGenerating,
    error,
    fetchGallery,
    generateImage
  } = useImageStore();
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const parsed = imageSchema.safeParse({ prompt, aspectRatio });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid image request");
      return;
    }

    const image = await generateImage({
      ...parsed.data,
      sourceText: user?.onboarding.isCompleted
        ? `${user.onboarding.businessName}: ${user.onboarding.offer}. Brand voice: ${user.onboarding.brandVoice}.`
        : undefined
    });

    if (image) {
      setPrompt("");
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-70px)] grid-cols-1 bg-[#111114] xl:grid-cols-[minmax(0,430px)_1fr]">
      <section className="border-r border-[#202026] px-5 py-8 xl:px-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#d7a6ff]">
          Image Sandbox
        </p>
        <h1 className="mt-3 text-[32px] font-black tracking-[-0.055em] text-[#f4f1f6]">
          Generate campaign visuals
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#9b95a0]">
          Create Cloudinary-hosted visual assets for posts, ads, stories, and
          product campaigns.
        </p>

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div>
            <label
              className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#9d96a2]"
              htmlFor="imagePrompt"
            >
              Visual brief
            </label>
            <textarea
              id="imagePrompt"
              className="mt-3 min-h-[180px] w-full rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f] p-4 text-[15px] leading-6 text-[#f0edf2] outline-none placeholder:text-[#5f5964] focus:border-[#d7a6ff]"
              placeholder="A premium SaaS hero visual with analytics cards, clean lighting, and brand-safe composition..."
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
            />
          </div>

          <div>
            <label className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#9d96a2]">
              Aspect ratio
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {aspectRatios.map((item) => (
                <button
                  key={item.value}
                  className={`rounded-[5px] border p-4 text-left transition-all hover:-translate-y-0.5 ${
                    aspectRatio === item.value
                      ? "border-[#d7a6ff] bg-[#2b2133]"
                      : "border-[#2b2a31] bg-[#1c1b1f]"
                  }`}
                  type="button"
                  onClick={() => setAspectRatio(item.value)}
                >
                  <div
                    className={`mb-3 w-10 rounded-[2px] border border-current ${item.frame}`}
                  />
                  <p className="text-sm font-black text-[#f0edf2]">{item.label}</p>
                  <p className="mt-1 font-mono text-xs text-[#8e8793]">{item.value}</p>
                </button>
              ))}
            </div>
          </div>

          {user?.onboarding.isCompleted ? (
            <div className="rounded-[5px] border border-[#2b2a31] bg-[#151419] p-4">
              <div className="flex items-center gap-2 text-sm font-black text-[#f0edf2]">
                <Sparkles className="h-4 w-4 text-[#42d9ff]" />
                Brand context attached
              </div>
              <p className="mt-2 text-sm leading-6 text-[#8e8793]">
                {user.onboarding.businessName} - {user.onboarding.brandVoice}
              </p>
            </div>
          ) : null}

          <FormError message={formError || error} />

          <button
            className="flex h-11 w-full items-center justify-center gap-3 rounded-[3px] bg-[#d7a6ff] font-mono text-[13px] font-black uppercase tracking-[0.12em] text-[#1c1024] disabled:opacity-50"
            disabled={isGenerating}
            type="submit"
          >
            <ImageIcon className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Image"}
          </button>
        </form>
      </section>

      <section className="px-5 py-8 xl:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#9d96a2]">
              Gallery
            </p>
            <h2 className="mt-2 text-[26px] font-black tracking-[-0.04em] text-[#f0edf2]">
              Generated assets
            </h2>
          </div>
          <p className="font-mono text-xs uppercase text-[#817b86]">
            Newest first
          </p>
        </div>

        {isGenerating ? (
          <div className="mb-5 rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f] p-5">
            <div className="aspect-video animate-pulse rounded-[4px] bg-[#25242a]" />
            <p className="mt-4 text-sm text-[#8e8793]">Generating visual asset...</p>
          </div>
        ) : null}

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-square animate-pulse rounded-[5px] bg-[#1c1b1f]"
              />
            ))}
          </div>
        ) : images.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {images.map((image) => (
              <figure
                key={image.id}
                className="overflow-hidden rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f]"
              >
                <img
                  alt={image.prompt}
                  className="aspect-square w-full object-cover"
                  src={image.imageUrl}
                />
                <figcaption className="space-y-4 p-4">
                  <p className="line-clamp-2 text-sm leading-6 text-[#e4dfe8]">
                    {image.prompt}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-[11px] uppercase text-[#817b86]">
                      {image.aspectRatio} - {image.model}
                    </p>
                    <a
                      aria-label="Download image"
                      className="rounded-[3px] border border-[#2b2a31] p-2 text-[#e6e0ea] hover:bg-[#25242a]"
                      download
                      href={image.imageUrl}
                      target="_blank"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="grid min-h-[520px] place-items-center rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f] text-center">
            <div>
              <ImageIcon className="mx-auto h-9 w-9 text-[#5f5964]" />
              <p className="mt-4 text-sm text-[#8e8793]">
                No images yet. Generate your first visual asset.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
