"use client";

import axios from "axios";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address")
});

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading } = useAuthStore();
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const parsed = forgotPasswordSchema.safeParse({
      email: String(formData.get("email") ?? "")
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }

    try {
      const message = await forgotPassword(parsed.data.email);
      toast.success(message);
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        setError(requestError.response?.data?.message ?? "Request failed");
        return;
      }

      setError("Request failed");
    }
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter your workspace email and we will send a secure reset link."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" />
        </div>
        <FormError message={error} />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send reset link"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link className="font-medium text-foreground underline" href="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
