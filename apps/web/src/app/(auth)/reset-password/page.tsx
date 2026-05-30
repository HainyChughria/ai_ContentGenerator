"use client";

import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, FormEvent, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

const resetPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  token: z.string().min(32, "Reset token is invalid"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const { resetPassword, isLoading } = useAuthStore();
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const parsed = resetPasswordSchema.safeParse({
      email: String(formData.get("email") ?? ""),
      token: String(formData.get("token") ?? ""),
      password: String(formData.get("password") ?? "")
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid reset request");
      return;
    }

    try {
      const message = await resetPassword(parsed.data);
      toast.success(message);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        setError(requestError.response?.data?.message ?? "Reset failed");
        return;
      }

      setError("Reset failed");
    }
  };

  return (
    <AuthShell
      title="Create new password"
      subtitle="Use the reset link from your email to set a new password."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <input
          name="token"
          type="hidden"
          value={searchParams.get("token") ?? ""}
          readOnly
        />
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={searchParams.get("email") ?? ""}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
          />
        </div>
        <FormError message={error} />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update password"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Back to{" "}
        <Link className="font-medium text-foreground underline" href="/login">
          sign in
        </Link>
      </p>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
