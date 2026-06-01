"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [serverError, setServerError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setServerError("");

    const formData = new FormData(event.currentTarget);
    const values = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "")
    };

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    try {
      await login(parsed.data);
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message ?? "Login failed");
        return;
      }

      setServerError("Login failed");
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your business content workspace."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" />
          <FormError message={errors.email?.[0]} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
          />
          <FormError message={errors.password?.[0]} />
        </div>
        <FormError message={serverError} />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link
          className="font-medium text-foreground underline"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
      </p>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link className="font-medium text-foreground underline" href="/register">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
