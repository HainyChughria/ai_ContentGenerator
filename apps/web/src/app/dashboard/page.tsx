"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();

  return (
    <AuthGuard>
      <main className="min-h-screen bg-muted">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-6">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Your authenticated AI SaaS workspace.
            </p>
          </div>
          <Button variant="secondary" onClick={logout}>
            Sign out
          </Button>
        </div>
        <section className="mx-auto grid w-full max-w-5xl gap-4 px-4 pb-10 md:grid-cols-3">
          <div className="rounded-lg border bg-background p-5">
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="mt-2 font-medium">{user?.name}</p>
          </div>
          <div className="rounded-lg border bg-background p-5">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="mt-2 font-medium">{user?.email}</p>
          </div>
          <div className="rounded-lg border bg-background p-5">
            <p className="text-sm text-muted-foreground">Credits</p>
            <p className="mt-2 font-medium">{user?.credits ?? 0}</p>
          </div>
        </section>
      </main>
    </AuthGuard>
  );
}
