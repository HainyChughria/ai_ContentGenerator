"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Coins,
  FileText,
  ImageIcon,
  PenLine,
  Sparkles,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useDashboardStore } from "@/store/dashboard-store";

const cardClass = "rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f] p-5";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { summary, isLoading, error, fetchSummary } = useDashboardStore();
  const onboarding = user?.onboarding;
  const isOnboarded = Boolean(summary?.onboardingCompleted ?? onboarding?.isCompleted);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="min-h-[calc(100vh-70px)] px-5 pb-12 pt-10 xl:px-[42px]">
      <div className="mb-9 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#d7a6ff]">
            Business Dashboard
          </p>
          <h1 className="mt-3 text-[38px] font-black tracking-[-0.055em] text-[#f4f1f6] drop-shadow-[3px_3px_0_rgba(0,0,0,0.85)]">
            {onboarding?.businessName || "Set up your content workspace"}
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-6 text-[#9b95a0]">
            {isOnboarded
              ? `${onboarding?.niche} content system for ${onboarding?.audience}. Your sandboxes use this context for text and image generation.`
              : "Complete onboarding so the generator can use your business, audience, offer, brand voice, and social handles."}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className="flex h-[44px] items-center gap-3 rounded-[3px] border border-[#2b2a31] bg-[#28262b] px-5 font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-[#f1edf4]"
            href="/dashboard/onboarding"
          >
            <Sparkles className="h-4 w-4" />
            {isOnboarded ? "Edit Setup" : "Complete Setup"}
          </Link>
          <Link
            className="flex h-[44px] items-center gap-3 rounded-[3px] bg-[#d7a6ff] px-6 font-mono text-[13px] font-black uppercase tracking-[0.12em] text-[#1c1024]"
            href="/dashboard/generate"
          >
            <PenLine className="h-4 w-4" />
            Generate
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mb-5 rounded-[4px] border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="grid gap-[24px] xl:grid-cols-4">
        <MetricCard
          icon={Coins}
          label="Credits Remaining"
          value={isLoading ? "--" : String(summary?.creditsRemaining ?? user?.credits ?? 0)}
          caption="Available generation balance"
        />
        <MetricCard
          icon={TrendingUp}
          label="Total Generations"
          value={isLoading ? "--" : String(summary?.totalGenerations ?? 0)}
          caption="Text outputs created"
        />
        <MetricCard
          icon={isOnboarded ? CheckCircle2 : Clock3}
          label="Onboarding"
          value={isOnboarded ? "Ready" : "Pending"}
          caption={isOnboarded ? "Brand context active" : "Business context needed"}
        />
        <MetricCard
          icon={ImageIcon}
          label="Image Sandbox"
          value="Live"
          caption="Generate visual assets"
        />
      </section>

      <section className="mt-[34px] grid gap-[28px] xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className={cardClass}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-mono text-[15px] uppercase tracking-[0.16em] text-[#e2dce8]">
                Business Context
              </h2>
              <p className="mt-2 text-sm text-[#8e8793]">
                This is the source of truth used by both sandboxes.
              </p>
            </div>
            <Link
              className="text-sm font-bold text-[#d7a6ff]"
              href="/dashboard/onboarding"
            >
              Update
            </Link>
          </div>
          {isOnboarded ? (
            <div className="grid gap-3 md:grid-cols-2">
              <ContextItem label="Offer" value={onboarding?.offer} />
              <ContextItem label="Brand Voice" value={onboarding?.brandVoice} />
              <ContextItem label="Website" value={onboarding?.website || "Not added"} />
              <ContextItem
                label="Content Goals"
                value={onboarding?.contentGoals.join(", ")}
              />
              <ContextItem
                label="Social Handles"
                value={[
                  onboarding?.socialHandles.linkedin,
                  onboarding?.socialHandles.twitter,
                  onboarding?.socialHandles.instagram
                ]
                  .filter(Boolean)
                  .join(" / ") || "Not added"}
              />
              <ContextItem label="Audience" value={onboarding?.audience} />
            </div>
          ) : (
            <div className="rounded-[4px] border border-[#302d35] bg-[#151419] p-5">
              <p className="text-[15px] text-[#d8d2dc]">
                Your workspace is missing business onboarding. Add it once, then
                generate content without retyping your brand details.
              </p>
              <Link
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-[3px] bg-[#d7a6ff] px-4 text-sm font-black text-[#1c1024]"
                href="/dashboard/onboarding"
              >
                Start onboarding
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <QuickAction
            href="/dashboard/generate"
            icon={PenLine}
            title="Content Sandbox"
            text="Generate posts, emails, ads, and blogs from onboarding data."
          />
          <QuickAction
            href="/dashboard/images"
            icon={ImageIcon}
            title="Image Sandbox"
            text="Create Cloudinary-hosted visuals for campaigns and socials."
          />
          <QuickAction
            href="/dashboard/history"
            icon={FileText}
            title="Generation History"
            text="Review, copy, reuse, or turn generated text into images."
          />
        </div>
      </section>

      <section className="mt-[34px] rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f]">
        <div className="border-b border-[#25242a] p-5">
          <h2 className="font-mono text-[15px] uppercase tracking-[0.16em] text-[#e2dce8]">
            Recent Activity
          </h2>
        </div>
        {isLoading ? (
          <p className="p-5 text-sm text-[#8e8793]">Loading activity...</p>
        ) : summary?.recentActivity.length ? (
          <div className="divide-y divide-[#25242a]">
            {summary.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="text-[15px] font-semibold text-[#f0edf2]">
                    {activity.title}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase text-[#817b86]">
                    {activity.type.replaceAll("_", " ")}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-[11px] text-[#817b86]">
                  {new Date(activity.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-5 text-sm text-[#8e8793]">
            No activity yet. Complete onboarding or generate your first asset.
          </p>
        )}
      </section>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  caption
}: {
  icon: typeof Coins;
  label: string;
  value: string;
  caption: string;
}) {
  return (
    <article className={cardClass}>
      <div className="flex items-start justify-between">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#d7cfe0]">
          {label}
        </p>
        <Icon className="h-5 w-5 text-[#d7a6ff]" />
      </div>
      <p className="mt-5 text-[30px] font-black tracking-[-0.05em] text-white">
        {value}
      </p>
      <p className="mt-2 text-sm text-[#8e8793]">{caption}</p>
    </article>
  );
}

function ContextItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-[4px] border border-[#2a2930] bg-[#151419] p-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#817b86]">
        {label}
      </p>
      <p className="mt-2 text-[15px] font-semibold text-[#eee9f2]">
        {value || "Not added"}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  text
}: {
  href: string;
  icon: typeof PenLine;
  title: string;
  text: string;
}) {
  return (
    <Link
      className="block rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f] p-5 transition-transform hover:-translate-y-0.5"
      href={href}
    >
      <Icon className="h-5 w-5 text-[#42d9ff]" />
      <h3 className="mt-4 text-[16px] font-black text-[#f0edf2]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#8e8793]">{text}</p>
    </Link>
  );
}
