"use client";

import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Building2,
  Check,
  Sparkles,
  Target,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { useOnboardingStore } from "@/store/onboarding-store";

const contentGoalOptions = [
  "Blog posts",
  "Social captions",
  "Email campaigns",
  "Ad copy",
  "Product descriptions",
  "Launch content"
];

const onboardingSchema = z.object({
  businessName: z.string().min(2, "Business name is required").max(120),
  niche: z.string().min(2, "Niche is required").max(120),
  audience: z.string().min(2, "Audience is required").max(180),
  offer: z.string().min(2, "Offer is required").max(240),
  brandVoice: z.string().min(2, "Brand voice is required").max(120),
  website: z.string().max(180),
  socialHandles: z.object({
    linkedin: z.string().max(120),
    twitter: z.string().max(120),
    instagram: z.string().max(120)
  }),
  contentGoals: z.array(z.string()).min(1, "Choose at least one goal").max(6)
});

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { onboarding, fetchOnboarding, saveOnboarding, isLoading } =
    useOnboardingStore();
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [offer, setOffer] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [website, setWebsite] = useState("");
  const [socialHandles, setSocialHandles] = useState({
    linkedin: "",
    twitter: "",
    instagram: ""
  });
  const [contentGoals, setContentGoals] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOnboarding();
  }, [fetchOnboarding]);

  useEffect(() => {
    if (onboarding) {
      setBusinessName(onboarding.businessName);
      setNiche(onboarding.niche);
      setAudience(onboarding.audience);
      setOffer(onboarding.offer);
      setBrandVoice(onboarding.brandVoice);
      setWebsite(onboarding.website);
      setSocialHandles(onboarding.socialHandles);
      setContentGoals(onboarding.contentGoals);
    }
  }, [onboarding]);

  const steps = [
    {
      title: "Business",
      icon: Building2
    },
    {
      title: "Positioning",
      icon: Users
    },
    {
      title: "Social",
      icon: AtSign
    },
    {
      title: "Goals",
      icon: Target
    }
  ];

  const toggleGoal = (goal: string) => {
    setContentGoals((current) =>
      current.includes(goal)
        ? current.filter((item) => item !== goal)
        : [...current, goal]
    );
  };

  const goNext = () => {
    setError("");

    if (
      step === 0 &&
      (businessName.trim().length < 2 ||
        niche.trim().length < 2 ||
        offer.trim().length < 2)
    ) {
      setError("Add your business name, niche, and main offer");
      return;
    }

    if (
      step === 1 &&
      (audience.trim().length < 2 || brandVoice.trim().length < 2)
    ) {
      setError("Add your audience and brand voice");
      return;
    }

    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const parsed = onboardingSchema.safeParse({
      businessName,
      niche,
      audience,
      offer,
      brandVoice,
      website,
      socialHandles,
      contentGoals
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Complete onboarding");
      return;
    }

    try {
      const savedOnboarding = await saveOnboarding(parsed.data);

      if (user) {
        setUser({
          ...user,
          onboarding: savedOnboarding
        });
      }

      router.push("/dashboard/generate");
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        setError(
          requestError.response?.data?.message ?? "Could not save onboarding"
        );
        return;
      }

      setError("Could not save onboarding");
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] px-5 py-8 xl:px-[42px]">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#d7a6ff]">
            Business Onboarding
          </p>
          <h1 className="mt-3 text-[34px] font-black tracking-[-0.055em] text-[#f4f1f6]">
            Build your brand context
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[#9b95a0]">
            Add your business data once. The content and image sandboxes use it
            automatically for more specific outputs.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-[3px] border border-[#2b2a31] bg-[#1c1b1f] px-3 py-2 font-mono text-[12px] uppercase text-[#9d96a2]">
          <Sparkles className="h-4 w-4 text-[#42d9ff]" />
          {step + 1} of {steps.length}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {steps.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`group rounded-[5px] border p-4 transition-all duration-300 ${
                index === step
                  ? "border-[#d7a6ff] bg-[#2b2133]"
                  : index < step
                    ? "border-[#2b2a31] bg-[#1c1b1f]"
                    : "border-[#2b2a31] bg-[#151419]"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <Icon className="h-4 w-4 text-[#9d96a2] transition-colors group-hover:text-[#f0edf2]" />
                {index < step ? (
                  <Check className="h-4 w-4 text-emerald-300" />
                ) : null}
              </div>
              <p className="mt-3 text-sm font-black text-[#f0edf2]">{item.title}</p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#2b2a31]">
                <div
                  className={`h-full rounded-full bg-[#d7a6ff] transition-all duration-500 ${
                    index <= step ? "w-full" : "w-0"
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 overflow-hidden rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f]">
        <form className="space-y-6 p-5 sm:p-6" onSubmit={onSubmit}>
          {step === 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business name</Label>
                <Input
                  id="businessName"
                  placeholder="Acme Studio"
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="niche">Niche</Label>
                <Input
                  id="niche"
                  placeholder="B2B analytics, fitness coaching..."
                  value={niche}
                  onChange={(event) => setNiche(event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="offer">Main offer</Label>
                <Input
                  id="offer"
                  placeholder="Done-for-you content systems for founders"
                  value={offer}
                  onChange={(event) => setOffer(event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="audience">Audience</Label>
                <Input
                  id="audience"
                  placeholder="Seed-stage founders and marketing leads"
                  value={audience}
                  onChange={(event) => setAudience(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandVoice">Brand voice</Label>
                <Input
                  id="brandVoice"
                  placeholder="Clear, confident, useful"
                  value={brandVoice}
                  onChange={(event) => setBrandVoice(event.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://example.com"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  placeholder="@company"
                  value={socialHandles.linkedin}
                  onChange={(event) =>
                    setSocialHandles((current) => ({
                      ...current,
                      linkedin: event.target.value
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">X / Twitter</Label>
                <Input
                  id="twitter"
                  placeholder="@company"
                  value={socialHandles.twitter}
                  onChange={(event) =>
                    setSocialHandles((current) => ({
                      ...current,
                      twitter: event.target.value
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="@company"
                  value={socialHandles.instagram}
                  onChange={(event) =>
                    setSocialHandles((current) => ({
                      ...current,
                      instagram: event.target.value
                    }))
                  }
                />
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {contentGoalOptions.map((goal) => {
                const checked = contentGoals.includes(goal);

                return (
                  <label
                    key={goal}
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-[5px] border px-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                      checked
                        ? "border-[#d7a6ff] bg-[#d7a6ff] text-[#1c1024]"
                        : "border-[#2b2a31] bg-[#151419] text-[#e6e0ea]"
                    }`}
                  >
                    <input
                      checked={checked}
                      className="h-4 w-4 accent-current"
                      type="checkbox"
                      onChange={() => toggleGoal(goal)}
                    />
                    {goal}
                  </label>
                );
              })}
            </div>
          ) : null}

          <FormError message={error} />

          <div className="flex justify-between gap-3">
            <Button
              variant="secondary"
              type="button"
              className="gap-2"
              disabled={step === 0 || isLoading}
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button className="gap-2" type="button" onClick={goNext}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button className="gap-2" type="submit" disabled={isLoading}>
                <Check className="h-4 w-4" />
                {isLoading ? "Saving..." : "Open generator"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
