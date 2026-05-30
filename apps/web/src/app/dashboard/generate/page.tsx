"use client";

import { Clipboard, Check } from "lucide-react";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth-store";
import { useContentStore } from "@/store/content-store";
import { ContentType } from "@/types/content";

const contentTypes: { value: ContentType; label: string }[] = [
  { value: "blog", label: "Blog" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter" },
  { value: "instagram", label: "Instagram" }
];

const tones = ["Professional", "Friendly", "Bold", "Educational", "Witty"];

const generateSchema = z.object({
  contentType: z.enum(["blog", "linkedin", "twitter", "instagram"]),
  tone: z.string().min(2),
  prompt: z.string().min(10, "Prompt must be at least 10 characters").max(2000)
});

export default function GeneratePage() {
  const { user, setUser } = useAuthStore();
  const { generate, streamingText, isGenerating, error } = useContentStore();
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [tone, setTone] = useState("Professional");
  const [prompt, setPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setCopied(false);

    const parsed = generateSchema.safeParse({
      contentType,
      tone,
      prompt
    });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid prompt");
      return;
    }

    const content = await generate(parsed.data);

    if (content && user) {
      setUser({
        ...user,
        credits: Math.max(user.credits - 1, 0)
      });
    }
  };

  const copyResult = async () => {
    await navigator.clipboard.writeText(streamingText);
    setCopied(true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">AI Generator</h1>
          <p className="text-sm text-muted-foreground">
            Generate content with streaming responses and credit tracking.
          </p>
        </div>

        <Card>
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label>Content type</Label>
              <div className="grid grid-cols-2 gap-2">
                {contentTypes.map((item) => (
                  <button
                    key={item.value}
                    className={`h-10 rounded-md border text-sm font-medium ${
                      contentType === item.value
                        ? "border-primary bg-muted"
                        : "bg-background"
                    }`}
                    type="button"
                    onClick={() => setContentType(item.value)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <select
                id="tone"
                className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-primary"
                value={tone}
                onChange={(event) => setTone(event.target.value)}
              >
                {tones.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Describe what you want to create..."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
            </div>

            <FormError message={formError || error} />

            <Button className="w-full" type="submit" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate content"}
            </Button>
          </form>
        </Card>
      </div>

      <Card className="min-h-[520px]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Streaming output</h2>
            <p className="text-sm text-muted-foreground">
              Tokens appear here as the provider sends them.
            </p>
          </div>
          <button
            aria-label="Copy generated content"
            className="rounded-md border p-2 hover:bg-muted disabled:opacity-50"
            type="button"
            disabled={!streamingText}
            onClick={copyResult}
          >
            {copied ? (
              <Check className="h-5 w-5" />
            ) : (
              <Clipboard className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="min-h-96 whitespace-pre-wrap rounded-md border bg-muted p-4 text-sm leading-6">
          {streamingText || "Your generated content will appear here."}
          {isGenerating ? <span className="ml-1 animate-pulse">|</span> : null}
        </div>
      </Card>
    </div>
  );
}
