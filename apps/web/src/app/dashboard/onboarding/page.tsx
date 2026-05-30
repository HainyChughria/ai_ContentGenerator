"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  "Product descriptions"
];

const onboardingSchema = z.object({
  businessName: z.string().min(2, "Business name is required").max(120),
  niche: z.string().min(2, "Niche is required").max(120),
  contentGoals: z.array(z.string()).min(1, "Choose at least one goal").max(5)
});

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { onboarding, fetchOnboarding, saveOnboarding, isLoading } =
    useOnboardingStore();
  const [step, setStep] = useState(0);
  const [businessName, setBusinessName] = useState("");
  const [niche, setNiche] = useState("");
  const [contentGoals, setContentGoals] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOnboarding();
  }, [fetchOnboarding]);

  useEffect(() => {
    if (onboarding) {
      setBusinessName(onboarding.businessName);
      setNiche(onboarding.niche);
      setContentGoals(onboarding.contentGoals);
    }
  }, [onboarding]);

  const steps = [
    {
      title: "Business name",
      description: "This helps personalize future AI outputs."
    },
    {
      title: "Niche",
      description: "Your niche gives the AI better positioning context."
    },
    {
      title: "Content goals",
      description: "Pick the content types this workspace should optimize for."
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

    if (step === 0 && businessName.trim().length < 2) {
      setError("Business name is required");
      return;
    }

    if (step === 1 && niche.trim().length < 2) {
      setError("Niche is required");
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

      router.push("/dashboard");
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Onboarding</h1>
        <p className="text-sm text-muted-foreground">
          Set up your workspace context in three quick steps.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((item, index) => (
          <div
            key={item.title}
            className={`rounded-lg border p-3 ${
              index === step ? "bg-background" : "bg-muted"
            }`}
          >
            <p className="text-xs font-medium text-muted-foreground">
              Step {index + 1}
            </p>
            <p className="mt-1 text-sm font-semibold">{item.title}</p>
          </div>
        ))}
      </div>

      <Card>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div>
            <h2 className="text-lg font-semibold">{steps[step].title}</h2>
            <p className="text-sm text-muted-foreground">
              {steps[step].description}
            </p>
          </div>

          {step === 0 ? (
            <div className="space-y-2">
              <Label htmlFor="businessName">Business name</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
              />
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Input
                id="niche"
                placeholder="SaaS marketing, fitness coaching, ecommerce..."
                value={niche}
                onChange={(event) => setNiche(event.target.value)}
              />
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {contentGoalOptions.map((goal) => {
                const checked = contentGoals.includes(goal);

                return (
                  <label
                    key={goal}
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-3 text-sm ${
                      checked ? "border-primary bg-muted" : "bg-background"
                    }`}
                  >
                    <input
                      checked={checked}
                      className="h-4 w-4"
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
              disabled={step === 0 || isLoading}
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
            >
              Back
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={goNext}>
                Continue
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save onboarding"}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
