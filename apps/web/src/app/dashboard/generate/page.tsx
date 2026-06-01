"use client";

import {
  BadgeDollarSign,
  Check,
  Clipboard,
  FileText,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  PenLine,
  Send,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { FormError } from "@/components/ui/form-error";
import { useAuthStore } from "@/store/auth-store";
import { useContentStore } from "@/store/content-store";
import { ContentType } from "@/types/content";

const contentTypes: {
  value: ContentType;
  label: string;
  description: string;
  icon: typeof FileText;
}[] = [
  { value: "blog", label: "Blog", description: "Long-form article section", icon: FileText },
  { value: "linkedin", label: "LinkedIn", description: "Professional post", icon: Linkedin },
  { value: "twitter", label: "X Post", description: "Short social update", icon: MessageCircle },
  { value: "instagram", label: "Instagram", description: "Caption and hashtags", icon: Instagram },
  { value: "email", label: "Email", description: "Campaign draft", icon: Mail },
  { value: "ad", label: "Ad Copy", description: "Paid social variants", icon: BadgeDollarSign }
];

const tones = ["On-brand", "Professional", "Friendly", "Bold", "Educational", "Witty"];

const generateSchema = z.object({
  contentType: z.enum(["blog", "linkedin", "twitter", "instagram", "email", "ad"]),
  tone: z.string().min(2),
  request: z.string().min(4, "Tell the sandbox what to generate").max(500)
});

export default function GeneratePage() {
  const { user, setUser } = useAuthStore();
  const { generate, streamingText, isGenerating, error } = useContentStore();
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [tone, setTone] = useState("On-brand");
  const [request, setRequest] = useState("");
  const [formError, setFormError] = useState("");
  const [copied, setCopied] = useState(false);
  const onboarding = user?.onboarding;
  const isReady = Boolean(onboarding?.isCompleted);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setCopied(false);

    if (!isReady) {
      setFormError("Complete onboarding before generating content.");
      return;
    }

    const parsed = generateSchema.safeParse({ contentType, tone, request });

    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Invalid request");
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

  const copyOutput = async () => {
    await navigator.clipboard.writeText(streamingText);
    setCopied(true);
  };

  return (
    <div className="grid min-h-[calc(100vh-70px)] grid-cols-1 bg-[#111114] xl:grid-cols-[minmax(0,460px)_1fr]">
      <section className="border-r border-[#202026] px-5 py-8 xl:px-8">
        <div className="mb-7">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#d7a6ff]">
            Content Sandbox
          </p>
          <h1 className="mt-3 text-[32px] font-black tracking-[-0.055em] text-[#f4f1f6]">
            Generate from business context
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#9b95a0]">
            Ask for the asset. The backend injects your onboarding data, social
            handles, audience, offer, and brand voice automatically.
          </p>
        </div>

        {!isReady ? (
          <div className="mb-6 rounded-[5px] border border-[#5b4530] bg-[#221b12] p-4">
            <p className="text-sm font-bold text-[#f3d4a5]">Onboarding required</p>
            <p className="mt-2 text-sm leading-6 text-[#d8bd93]">
              Add your business context first so generation is specific to your brand.
            </p>
            <Link
              className="mt-4 inline-flex h-9 items-center rounded-[3px] bg-[#d7a6ff] px-4 text-sm font-black text-[#1c1024]"
              href="/dashboard/onboarding"
            >
              Complete onboarding
            </Link>
          </div>
        ) : null}

        <form className="space-y-6" onSubmit={onSubmit}>
          <div>
            <label className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#9d96a2]">
              Format
            </label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {contentTypes.map((item) => {
                const Icon = item.icon;
                const active = contentType === item.value;

                return (
                  <button
                    key={item.value}
                    className={`rounded-[5px] border p-4 text-left transition-all hover:-translate-y-0.5 ${
                      active
                        ? "border-[#d7a6ff] bg-[#2b2133]"
                        : "border-[#2b2a31] bg-[#1c1b1f]"
                    }`}
                    type="button"
                    onClick={() => setContentType(item.value)}
                  >
                    <Icon className={active ? "h-5 w-5 text-[#d7a6ff]" : "h-5 w-5 text-[#8e8793]"} />
                    <p className="mt-3 text-sm font-black text-[#f0edf2]">{item.label}</p>
                    <p className="mt-1 text-xs text-[#8e8793]">{item.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#9d96a2]">
              Tone
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {tones.map((item) => (
                <button
                  key={item}
                  className={`h-9 rounded-[3px] border px-3 text-sm font-bold ${
                    tone === item
                      ? "border-[#d7a6ff] bg-[#d7a6ff] text-[#1c1024]"
                      : "border-[#2b2a31] bg-[#1c1b1f] text-[#e6e0ea]"
                  }`}
                  type="button"
                  onClick={() => setTone(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#9d96a2]"
              htmlFor="request"
            >
              What do you want to generate?
            </label>
            <textarea
              id="request"
              className="mt-3 min-h-[150px] w-full rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f] p-4 text-[15px] leading-6 text-[#f0edf2] outline-none placeholder:text-[#5f5964] focus:border-[#d7a6ff]"
              placeholder="Launch post for our new analytics feature..."
              value={request}
              onChange={(event) => setRequest(event.target.value)}
            />
          </div>

          {isReady ? (
            <div className="rounded-[5px] border border-[#2b2a31] bg-[#151419] p-4">
              <div className="flex items-center gap-2 text-sm font-black text-[#f0edf2]">
                <Sparkles className="h-4 w-4 text-[#42d9ff]" />
                {onboarding?.businessName}
              </div>
              <p className="mt-2 text-sm leading-6 text-[#8e8793]">
                {onboarding?.niche} for {onboarding?.audience}. Voice:{" "}
                {onboarding?.brandVoice}.
              </p>
            </div>
          ) : null}

          <FormError message={formError || error} />

          <button
            className="flex h-11 w-full items-center justify-center gap-3 rounded-[3px] bg-[#d7a6ff] font-mono text-[13px] font-black uppercase tracking-[0.12em] text-[#1c1024] disabled:opacity-50"
            disabled={isGenerating || !isReady}
            type="submit"
          >
            <Send className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Content"}
          </button>
        </form>
      </section>

      <section className="px-5 py-8 xl:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#9d96a2]">
              Streaming Output
            </p>
            <h2 className="mt-2 text-[24px] font-black tracking-[-0.04em] text-[#f0edf2]">
              Generated draft
            </h2>
          </div>
          <button
            aria-label="Copy generated content"
            className="flex h-10 items-center gap-2 rounded-[3px] border border-[#2b2a31] bg-[#1c1b1f] px-4 text-sm font-bold text-[#e6e0ea] disabled:opacity-50"
            disabled={!streamingText}
            type="button"
            onClick={copyOutput}
          >
            {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            Copy
          </button>
        </div>

        <div className="min-h-[620px] rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f]">
          <div className="flex h-[46px] items-center justify-between border-b border-[#25242a] px-5">
            <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#9d96a2]">
              Output
            </p>
            {isGenerating ? (
              <span className="rounded-full border border-[#27687d] bg-[#12303a] px-3 py-1 text-[11px] font-bold uppercase text-[#48deff]">
                Live
              </span>
            ) : null}
          </div>
          <div className="whitespace-pre-wrap px-8 py-8 text-[17px] leading-8 text-[#e2dce6]">
            {streamingText || (
              <div className="grid min-h-[480px] place-items-center text-center">
                <div>
                  <PenLine className="mx-auto h-8 w-8 text-[#5f5964]" />
                  <p className="mt-4 text-sm text-[#8e8793]">
                    Your generated content will stream here.
                  </p>
                </div>
              </div>
            )}
            {isGenerating ? <span className="ml-1 animate-pulse text-[#d7a6ff]">|</span> : null}
          </div>
        </div>
      </section>
    </div>
  );
}
