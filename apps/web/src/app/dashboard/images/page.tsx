"use client";

import { Download } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useImageStore } from "@/store/image-store";
import { AspectRatio } from "@/types/image";

const aspectRatios: { value: AspectRatio; label: string }[] = [
  { value: "1:1", label: "Square" },
  { value: "16:9", label: "Wide" },
  { value: "9:16", label: "Story" },
  { value: "4:5", label: "Portrait" }
];

const imageSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters").max(2000),
  aspectRatio: z.enum(["1:1", "16:9", "9:16", "4:5"])
});

export default function ImagesPage() {
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

    const parsed = imageSchema.safeParse({
      prompt,
      aspectRatio
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid prompt");
      return;
    }

    const image = await generateImage(parsed.data);

    if (image) {
      setPrompt("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">AI Images</h1>
        <p className="text-sm text-muted-foreground">
          Generate and store Cloudinary-hosted image assets.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <Card>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="imagePrompt">Prompt</Label>
              <Textarea
                id="imagePrompt"
                placeholder="Describe the image you want..."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Aspect ratio</Label>
              <div className="grid grid-cols-2 gap-2">
                {aspectRatios.map((item) => (
                  <button
                    key={item.value}
                    className={`h-10 rounded-md border text-sm font-medium ${
                      aspectRatio === item.value
                        ? "border-primary bg-muted"
                        : "bg-background"
                    }`}
                    type="button"
                    onClick={() => setAspectRatio(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <FormError message={formError || error} />

            <Button className="w-full" type="submit" disabled={isGenerating}>
              {isGenerating ? "Generating image..." : "Generate image"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Gallery</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Your newest generated images appear first.
          </p>

          {isGenerating ? (
            <div className="mb-4 aspect-square animate-pulse rounded-md bg-muted" />
          ) : null}

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="aspect-square animate-pulse rounded-md bg-muted"
                />
              ))}
            </div>
          ) : images.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {images.map((image) => (
                <figure key={image.id} className="overflow-hidden rounded-md border">
                  <img
                    alt={image.prompt}
                    className="aspect-square w-full object-cover"
                    src={image.imageUrl}
                  />
                  <figcaption className="space-y-3 p-3">
                    <p className="line-clamp-2 text-sm">{image.prompt}</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">
                        {image.aspectRatio}
                      </p>
                      <a
                        aria-label="Download image"
                        className="rounded-md border p-2 hover:bg-muted"
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
            <p className="text-sm text-muted-foreground">
              No images yet. Generate your first visual asset.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
