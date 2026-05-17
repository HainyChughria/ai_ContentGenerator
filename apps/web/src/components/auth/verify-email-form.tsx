"use client";

import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";

const verifyEmailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, {
    message: "OTP must contain only numbers"
  })
});

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";
  const { verifyEmail, resendOtp, isLoading } = useAuthStore();
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setServerError("");
    setServerMessage("");

    const formData = new FormData(event.currentTarget);
    const values = {
      email: String(formData.get("email") ?? ""),
      otp: String(formData.get("otp") ?? "")
    };

    const parsed = verifyEmailSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    try {
      await verifyEmail(parsed.data);
      setServerMessage("Email verified. You can now sign in.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message ?? "Verification failed");
        return;
      }

      setServerError("Verification failed");
    }
  };

  const onResend = async () => {
    setServerError("");
    setServerMessage("");

    const emailInput = document.querySelector<HTMLInputElement>("#email");
    const email = emailInput?.value ?? initialEmail;

    try {
      await resendOtp(email);
      setServerMessage("A fresh verification code was sent.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message ?? "Could not resend OTP");
        return;
      }

      setServerError("Could not resend OTP");
    }
  };

  return (
    <AuthShell
      title="Verify your email"
      subtitle="Enter the 6 digit OTP sent to your email address."
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={initialEmail}
            autoComplete="email"
          />
          <FormError message={errors.email?.[0]} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="otp">OTP</Label>
          <Input id="otp" name="otp" inputMode="numeric" maxLength={6} />
          <FormError message={errors.otp?.[0]} />
        </div>
        <FormError message={serverError} />
        {serverMessage ? (
          <p className="text-sm text-emerald-700">{serverMessage}</p>
        ) : null}
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify email"}
        </Button>
      </form>
      <div className="mt-6 flex items-center justify-between gap-4 text-sm">
        <button
          className="font-medium underline disabled:opacity-50"
          type="button"
          disabled={isLoading}
          onClick={onResend}
        >
          Resend OTP
        </button>
        <Link className="font-medium underline" href="/login">
          Back to login
        </Link>
      </div>
    </AuthShell>
  );
}
