"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useDashboardStore } from "@/store/dashboard-store";

export default function DashboardPage() {
  const { summary, isLoading, error, fetchSummary } = useDashboardStore();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track credits, setup progress, and recent account activity.
          </p>
        </div>
        {!summary?.onboardingCompleted ? (
          <Link
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            href="/dashboard/onboarding"
          >
            Finish onboarding
          </Link>
        ) : null}
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-muted-foreground">Credits remaining</p>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "--" : summary?.creditsRemaining ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Total generations</p>
          <p className="mt-3 text-3xl font-semibold">
            {isLoading ? "--" : summary?.totalGenerations ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Onboarding</p>
          <p className="mt-3 text-lg font-semibold">
            {summary?.onboardingCompleted ? "Complete" : "Not complete"}
          </p>
        </Card>
      </section>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent activity</h2>
        </div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading activity...</p>
        ) : summary?.recentActivity.length ? (
          <div className="divide-y">
            {summary.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No activity yet. Complete onboarding to create your first account
            event.
          </p>
        )}
      </Card>
    </div>
  );
}
